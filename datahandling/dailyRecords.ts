import { GlucoseReading } from '../parsing/glucose'
import { format, parse } from 'date-fns'

export type DailyRecord = {
    date: Date
    rangePercentage: number
}

export type GlucoseRange = {
    min: number
    max: number
    unit: 'mmol' | 'mgdl'
}

export const mapGlucoseRecordsToDailyRecords = (
    records: GlucoseReading[],
    range?: GlucoseRange
): DailyRecord[] => {
    const dailyRecords: DailyRecord[] = []
    let currentDay: Date | null = null
    let dailyReadings = new Map<string, GlucoseReading[]>()

    // Default range: 3.9-10 mmol/L (70-180 mg/dL)
    const defaultRange: GlucoseRange = { min: 3.9, max: 10, unit: 'mmol' }
    const glucoseRange = range || defaultRange

    records.forEach(record => {
        if (record.Value > 0) {
            if (currentDay === null) {
                currentDay = record.Timestamp
            }

            const dateString = format(record.Timestamp, 'yyyy-MM-dd')
            if (!dailyReadings.has(dateString)) {
                dailyReadings.set(dateString, [])
            }
            dailyReadings.set(dateString, [...dailyReadings.get(dateString)!, record])
        }
    })

    dailyReadings.forEach((records, dateString) => {
        const date = parse(dateString, 'yyyy-MM-dd', new Date())
        const rangePercentage = calculateRangePercentage(records, glucoseRange)
        dailyRecords.push({ date: date, rangePercentage: rangePercentage })
    })

    return dailyRecords
}

const calculateRangePercentage = (records: GlucoseReading[], range: GlucoseRange): number => {
    const total = records.length
    if (total === 0) return 0

    // Convert range to mmol/L if needed (records are stored in mmol/L)
    let minRange: number
    let maxRange: number

    if (range.unit === 'mgdl') {
        // Convert mg/dL to mmol/L (divide by 18)
        minRange = range.min / 18
        maxRange = range.max / 18
    } else {
        minRange = range.min
        maxRange = range.max
    }

    const inRange = records.filter(record => record.Value >= minRange && record.Value <= maxRange).length
    return (inRange / total) * 100
}
