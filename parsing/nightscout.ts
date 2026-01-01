import { GlucoseReading, ParseResponse, GlucoseTypes, Options } from './glucose'
import { parse } from 'date-fns'

// Hash function for API secret (SHA1)
async function sha1Hash(text: string): Promise<string> {
    const encoder = new TextEncoder()
    const data = encoder.encode(text)
    const hashBuffer = await crypto.subtle.digest('SHA-1', data)
    const hashArray = Array.from(new Uint8Array(hashBuffer))
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
    return hashHex
}

// Try to fetch with different authentication methods
async function fetchWithAuth(
    url: string,
    apiSecret: string,
    hashedSecret: string
): Promise<Response> {
    // Method 1: Try with hashed API secret in header (most common)
    try {
        const response = await fetch(url, {
            method: 'GET',
            mode: 'cors',
            headers: {
                'API-SECRET': hashedSecret,
                'Accept': 'application/json',
            },
        })
        if (response.ok || response.status !== 0) {
            return response
        }
    } catch (e) {
        // Continue to next method
    }

    // Method 2: Try with plain API secret in header
    try {
        const response = await fetch(url, {
            method: 'GET',
            mode: 'cors',
            headers: {
                'API-SECRET': apiSecret,
                'Accept': 'application/json',
            },
        })
        if (response.ok || response.status !== 0) {
            return response
        }
    } catch (e) {
        // Continue to next method
    }

    // Method 3: Try with token in URL (avoids preflight for some servers)
    // This uses the hashed secret as a token parameter
    const urlWithToken = url.includes('?') 
        ? `${url}&token=${encodeURIComponent(apiSecret)}`
        : `${url}?token=${encodeURIComponent(apiSecret)}`
    
    try {
        const response = await fetch(urlWithToken, {
            method: 'GET',
            mode: 'cors',
            headers: {
                'Accept': 'application/json',
            },
        })
        if (response.ok || response.status !== 0) {
            return response
        }
    } catch (e) {
        // Continue to next method
    }

    // Method 4: Try without custom headers (for public Nightscout instances)
    try {
        const response = await fetch(url, {
            method: 'GET',
            mode: 'cors',
            headers: {
                'Accept': 'application/json',
            },
        })
        return response
    } catch (e) {
        // If all methods fail, throw the error
        throw e
    }
}

export type NightscoutReading = {
    _id: string
    type: string
    direction: string
    date: number
    dateString: string
    rawbg: number
    sgv: number
    trend: number
    device: string
    utcOffset: number
    sysTime: Date
    mills: number
}

export const fetchAndParseNightscoutData = async (
    apiBaseURL: string,
    apiSecret: string,
    startDate: Date,
    endDate: Date
): Promise<ParseResponse> => {
    // Normalize the URL - remove trailing slash if present
    let normalizedURL = apiBaseURL.trim()
    if (normalizedURL.endsWith('/')) {
        normalizedURL = normalizedURL.slice(0, -1)
    }
    
    // Ensure URL has protocol
    if (!normalizedURL.startsWith('http://') && !normalizedURL.startsWith('https://')) {
        normalizedURL = `https://${normalizedURL}`
    }

    // Set end time to end of day for endDate
    const end = new Date(endDate)
    end.setHours(23, 59, 59, 999)
    const endTimestamp = end.getTime()
    
    // Set start time to beginning of day for startDate
    const start = new Date(startDate)
    start.setHours(0, 0, 0, 0)
    const startTimestamp = start.getTime()

    let beforeDate = endTimestamp
    let count = 2

    let lastReading: NightscoutReading
    const allReadings: NightscoutReading[] = []

    let breakOut = 0
    while (count > 1) {
        if (breakOut > 1000) {
            return { records: [], error: { message: 'Exceeded max number of allowed calls to Nightscout.' } }
        }

        const url = `${normalizedURL}/api/v1/entries.json?count=1440&find[date][$lte]=${beforeDate}`
        try {
            // Try multiple authentication methods to work around CORS issues
            const hashedSecret = await sha1Hash(apiSecret)
            const response = await fetchWithAuth(url, apiSecret, hashedSecret)

            if (!response.ok) {
                let errorMessage = `Unable to fetch data from Nightscout API. Server returned ${response.status} ${response.statusText}.`
                if (response.status === 401) {
                    errorMessage = 'Authentication failed. Please verify your API secret is correct. The API secret should be at least 12 characters and match the one configured in your Nightscout instance. If using a token, ensure it has "readable" permissions.'
                } else if (response.status === 403) {
                    errorMessage += ' Access forbidden. Check that your API secret or token has the correct permissions (readable role).'
                } else if (response.status === 0) {
                    errorMessage = 'CORS error: Your browser blocked the request. Please configure your Nightscout server to allow requests from this origin. Add your domain to the ENABLE_CORS or CORS environment variable in your Nightscout configuration.'
                }
                return {
                    records: [],
                    error: { message: errorMessage },
                }
            }
    
            const nightscoutReadings = await response.json()
            
            if (!nightscoutReadings || nightscoutReadings.length === 0) {
                // If this is the first request and we got no data, check if we have any data at all
                if (allReadings.length === 0 && breakOut === 0) {
                    // Try to get the most recent data to see what year we have
                    const testUrl = `${normalizedURL}/api/v1/entries.json?count=1`
                    try {
                        const testResponse = await fetchWithAuth(testUrl, apiSecret, hashedSecret)
                        if (testResponse.ok) {
                            const testData = await testResponse.json()
                            if (testData && testData.length > 0) {
                                const testDate = new Date(testData[0].date)
                                const availableYear = testDate.getFullYear()
                                const startStr = startDate.toLocaleDateString()
                                const endStr = endDate.toLocaleDateString()
                                return {
                                    records: [],
                                    error: { message: `No data found for the date range ${startStr} to ${endStr}. Your Nightscout instance has data from ${availableYear}. Please adjust your date range.` },
                                }
                            }
                        }
                    } catch (e) {
                        // Ignore test request errors
                    }
                }
                // If we've already fetched some data, break the loop
                break
            }
            
            lastReading = nightscoutReadings[nightscoutReadings.length - 1]
            count = nightscoutReadings.length
            
            // Handle date - Nightscout date can be in milliseconds or as a number
            const date = new Date(lastReading.date)
            if (isNaN(date.getTime())) {
                break
            }
            
            // Stop if we've gone before the start date
            if (date.getTime() < startTimestamp) {
                // Filter readings to only include those within range
                const filteredReadings = nightscoutReadings.filter((reading: NightscoutReading) => {
                    const readingDate = new Date(reading.date)
                    return readingDate.getTime() >= startTimestamp && readingDate.getTime() <= endTimestamp
                })
                allReadings.push(...filteredReadings)
                break
            }
            
            beforeDate = date.getTime()
    
            // Filter readings to only include those within range
            const filteredReadings = nightscoutReadings.filter((reading: NightscoutReading) => {
                const readingDate = new Date(reading.date)
                return readingDate.getTime() >= startTimestamp && readingDate.getTime() <= endTimestamp
            })
            allReadings.push(...filteredReadings)
            breakOut++
        } catch (e: any) {
            // Check for CORS-related errors
            const isCorsError = 
                e.name === 'TypeError' || 
                e.message?.includes('fetch') ||
                e.message?.includes('CORS') ||
                e.message?.includes('NetworkError') ||
                e.message?.includes('Failed to fetch') ||
                e.message?.includes('Network request failed')
            
            let errorMessage = 'Unable to fetch data from Nightscout API.'
            
            if (isCorsError) {
                errorMessage = `CORS Error: Your browser blocked the request to Nightscout. 

To fix this, configure your Nightscout server:
1. Add ENABLE_CORS=true to your Nightscout environment variables
2. Or add your domain to the CORS variable (e.g., CORS=https://yourdomain.com)
3. Restart your Nightscout server after making changes

Alternatively, you can use a Nightscout access token instead of the API secret. Create a token with "readable" role in your Nightscout admin panel and use that instead.`
            } else {
                errorMessage += ` Error: ${e.message || 'Unknown error'}`
            }
            return {
                records: [],
                error: { message: errorMessage },
            }
        }  
    }

    if (allReadings.length === 0) {
        const startStr = startDate.toLocaleDateString()
        const endStr = endDate.toLocaleDateString()
        return {
            records: [],
            error: { message: `No data found for the date range ${startStr} to ${endStr}. Your Nightscout instance may not have data for this period.` },
        }
    }

    const glucoseReadings: GlucoseReading[] = mapNightscoutToGlucoseReadings(allReadings, {
        startDate,
        endDate,
        glucoseType: GlucoseTypes.mgdl,
    })

    if (glucoseReadings.length === 0) {
        const startStr = startDate.toLocaleDateString()
        const endStr = endDate.toLocaleDateString()
        return {
            records: [],
            error: { message: `No valid glucose data found for the date range ${startStr} to ${endStr}.` },
        }
    }

    return { records: glucoseReadings, error: null }
}

const mapNightscoutToGlucoseReadings = (
    nightscoutReadings: NightscoutReading[],
    options: Options
): GlucoseReading[] => {
    const glucoseReadings: GlucoseReading[] = []

    nightscoutReadings.forEach(reading => {
        if (!reading.sgv || reading.sgv === 0) {
            // Skip readings without valid glucose values
            return
        }
        
        const date = new Date(reading.date)
        if (isNaN(date.getTime())) {
            return
        }
        
        // Filter by date range if provided, otherwise by year
        let includeReading = false
        if (options.startDate && options.endDate) {
            const readingTime = date.getTime()
            const startTime = options.startDate.getTime()
            const endTime = options.endDate.getTime()
            includeReading = readingTime >= startTime && readingTime <= endTime
        } else if (options.year !== undefined) {
            includeReading = date.getFullYear() === options.year
        } else {
            includeReading = true
        }
        
        if (includeReading) {
            const glucoseReading: GlucoseReading = {
                Timestamp: date,
                Value: reading.sgv / 18,
            }
            glucoseReadings.push(glucoseReading)
        }
    })

    return glucoseReadings
}
