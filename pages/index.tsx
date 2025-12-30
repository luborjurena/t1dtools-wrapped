import Head from 'next/head'
import React, { useState } from 'react'
import { DayGraph } from '../components/dayGraph'
import { RangeDoughnuts } from '../components/rangeDoughnuts'
import { RangeByDays } from '../components/rangeByDays'
import { Headline } from '../components/headline'
import { mapGlucoseRecordsToDailyRecords, DailyRecord, GlucoseRange } from '../datahandling/dailyRecords'
import { parseLibreViewData } from '../parsing/libreview'
import { parseDexcomClarityData } from '../parsing/dexcomclarity'
import { fetchAndParseNightscoutData } from '../parsing/nightscout'
import classnames from 'classnames'
import { ParseResponse } from '../parsing/glucose'
import { getLoadingMessage } from '../datahandling/loading'
import { useTranslation } from '../contexts/TranslationContext'

export default function Home() {
    const { t } = useTranslation()
    const [cgmProvider, setCGMProvider] = useState<'dexcom' | 'libreview' | 'nightscout' | undefined>(undefined)
    const [dailyRecords, setDailyRecords] = useState<DailyRecord[]>([])
    const [CGMDataLoading, setCGMDataLoading] = useState<boolean | string>(false)
    const [CGMDataError, setCGMDataError] = useState<string | null>(null)
    const [showCSVGuide, setShowCSVGuide] = useState<boolean>(false)

    const [nightscoutDomain, setNightscoutDomain] = useState<string>('')
    const [nightscoutSecret, setNightscoutSecret] = useState<string>('')
    
    // Date range for Nightscout - default to current year
    const currentYear = new Date().getFullYear()
    const [startDate, setStartDate] = useState<string>(() => {
        const date = new Date(currentYear, 0, 1)
        return date.toISOString().split('T')[0]
    })
    const [endDate, setEndDate] = useState<string>(() => {
        const date = new Date(currentYear, 11, 31)
        return date.toISOString().split('T')[0]
    })

    // Glucose range - default to 3.9-10 mmol/L (70-180 mg/dL)
    const [glucoseRangeUnit, setGlucoseRangeUnit] = useState<'mmol' | 'mgdl'>('mmol')
    const [glucoseRangeMin, setGlucoseRangeMin] = useState<string>('3.9')
    const [glucoseRangeMax, setGlucoseRangeMax] = useState<string>('10.0')

    const [dragActive, setDragActive] = useState<boolean>(false)

    const reset = () => {
        setCGMProvider(undefined)
        setCGMDataError(null)
        setDailyRecords([])
        setCGMDataLoading(false)
    }

    const handleDroppedFile = async (event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault()
        event.stopPropagation()

        event.dataTransfer.files &&
            parseData({ target: { files: event.dataTransfer.files } } as React.ChangeEvent<HTMLInputElement>)
    }

    const getNightscoutData = async () => {
        setCGMDataLoading(getLoadingMessage())
        const loadingInterval = setInterval(() => {
            setCGMDataLoading(getLoadingMessage())
        }, 4000)

        let domain = nightscoutDomain
        if (domain.endsWith('/')) {
            domain = domain.slice(0, -1)
        }

        const start = new Date(startDate)
        const end = new Date(endDate)
        
        if (isNaN(start.getTime()) || isNaN(end.getTime())) {
            clearInterval(loadingInterval)
            setCGMDataError(t('invalidDateRange'))
            setCGMDataLoading(false)
            return
        }
        
        if (start > end) {
            clearInterval(loadingInterval)
            setCGMDataError(t('startBeforeEnd'))
            setCGMDataLoading(false)
            return
        }

        const response = await fetchAndParseNightscoutData(domain, nightscoutSecret, start, end)

        if (response.error) {
            clearInterval(loadingInterval)
            setCGMDataError(response.error.message)
            setCGMDataLoading(false)
            return
        }

        const records = response.records

        const min = parseFloat(glucoseRangeMin)
        const max = parseFloat(glucoseRangeMax)
        
        if (isNaN(min) || isNaN(max) || min >= max) {
            clearInterval(loadingInterval)
            setCGMDataError('Invalid glucose range. Minimum must be less than maximum.')
            setCGMDataLoading(false)
            return
        }

        const glucoseRange: GlucoseRange = {
            min,
            max,
            unit: glucoseRangeUnit,
        }
        const mappedDailyRecords = mapGlucoseRecordsToDailyRecords(records, glucoseRange)

        setDailyRecords(mappedDailyRecords)
        setCGMDataLoading(false)
        clearInterval(loadingInterval)
    }

    const parseData = async (event: React.ChangeEvent<HTMLInputElement>) => {
        setCGMDataLoading(getLoadingMessage())
        const loadingInterval = setInterval(() => {
            setCGMDataLoading(getLoadingMessage())
        }, 2500)
        setDragActive(false)

        if (cgmProvider === undefined) {
            clearInterval(loadingInterval)
            return
        }

        let response: ParseResponse = {
            records: [],
            error: { message: t('noCGMProvider') },
        }

        if (['libreview', 'dexcom'].includes(cgmProvider)) {
            if (!event.target.files) {
                clearInterval(loadingInterval)
                return
            }

            const file = event.target.files[0]

            if (cgmProvider === 'libreview') {
                response = await parseLibreViewData(file, 2022)
            } else if (cgmProvider === 'dexcom') {
                response = await parseDexcomClarityData(file, 2022)
            }
        } else if (cgmProvider === 'nightscout') {
            const start = new Date(startDate)
            const end = new Date(endDate)
            response = await fetchAndParseNightscoutData(nightscoutDomain, nightscoutSecret, start, end)
        }

        if (response.error) {
            clearInterval(loadingInterval)
            setCGMDataError(response.error.message)
            setCGMDataLoading(false)
            return
        }

        const records = response.records

        const min = parseFloat(glucoseRangeMin)
        const max = parseFloat(glucoseRangeMax)
        
        if (isNaN(min) || isNaN(max) || min >= max) {
            clearInterval(loadingInterval)
            setCGMDataError(t('invalidGlucoseRange'))
            setCGMDataLoading(false)
            return
        }

        const glucoseRange: GlucoseRange = {
            min,
            max,
            unit: glucoseRangeUnit,
        }
        const mappedDailyRecords = mapGlucoseRecordsToDailyRecords(records, glucoseRange)

        setDailyRecords(mappedDailyRecords)
        setCGMDataLoading(false)
        clearInterval(loadingInterval)
    }

    const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault()
        event.stopPropagation()
        setDragActive(true)
    }

    const handleDragLeave = (event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault()
        event.stopPropagation()
        setDragActive(false)
    }

    const openFileDialog = () => {
        const input = document.getElementById('file-selector')
        input && input.click()
    }

    const showDemo = () => {
        const demoData: DailyRecord[] = []
        for (let i = 1; i < 366; i++) {
            demoData.push({
                date: new Date(2022, 0, i),
                rangePercentage: Math.round(Math.random() * 100),
            })
        }

        setDailyRecords(demoData)
    }

    const toggleCSVGuide = (e: any) => {
        e.preventDefault()
        setShowCSVGuide(!showCSVGuide)
    }

    return (
        <>
            <Head>
                <title>{t('metaTitle')}</title>
                <meta
                    name="description"
                    content={t('metaDescription')}
                />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <Headline size={1} text={t('headline')} />
            <div className="flex flex-col items-center justify-center self-center">
                {dailyRecords.length === 0 && (
                    <div className="z-10 w-full rounded-xl bg-gray-800 p-10 sm:max-w-lg">
                        <div className="text-center">
                            <h2 className="mt-5 text-3xl font-bold text-gray-200">{t('visualizeTitle')}</h2>
                            <p className="mt-2 text-sm text-gray-400">
                                {t('description')}{' '}
                                <a
                                    href="https://github.com/luborjurena/t1dtools-wrapped"
                                    className="text-blue-500 hover:text-blue-700"
                                    target="_blank">
                                    GitHub
                                </a>
                                .
                            </p>
                            <p className="mt-2 text-sm text-gray-400">
                                {t('curious')}{' '}
                                <button onClick={e => showDemo()} className="text-blue-500 hover:text-blue-700">
                                    {t('demoLink')}
                                </button>
                                .
                            </p>
                        </div>
                        {!CGMDataLoading && (
                            <form className="mt-8 space-y-3">
                                <div className="grid grid-cols-1 space-y-2">
                                    <label
                                        htmlFor="cgmproviders"
                                        className="text-sm font-bold tracking-wide text-gray-500">
                                        {t('selectCGMProvider')}
                                    </label>
                                    <select
                                        value={cgmProvider}
                                        onChange={e => setCGMProvider(e.target.value as any)}
                                        id="cgmproviders"
                                        className="block w-full rounded-lg border border-gray-600 bg-gray-700 p-2.5 text-sm text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none">
                                        <option value="choose">{t('chooseCGMProvider')}</option>
                                        <option value="dexcom">{t('dexcom')}</option>
                                        <option value="libreview">{t('libreview')}</option>
                                        <option value="nightscout">{t('nightscout')}</option>
                                    </select>
                                </div>
                                {cgmProvider !== undefined && (
                                    <div className="grid grid-cols-1 space-y-2 rounded-lg bg-gray-700 p-4">
                                        <label className="text-sm font-bold tracking-wide text-gray-500">
                                            {t('targetGlucoseRange')}
                                        </label>
                                        <div className="grid grid-cols-3 gap-2">
                                            <div className="grid grid-cols-1 space-y-1">
                                                <label htmlFor="rangeUnit" className="text-xs text-gray-400">
                                                    {t('unit')}
                                                </label>
                                                <select
                                                    id="rangeUnit"
                                                    value={glucoseRangeUnit}
                                                    onChange={e => {
                                                        const unit = e.target.value as 'mmol' | 'mgdl'
                                                        setGlucoseRangeUnit(unit)
                                                        // Update default values when switching units
                                                        if (unit === 'mmol') {
                                                            setGlucoseRangeMin('3.9')
                                                            setGlucoseRangeMax('10.0')
                                                        } else {
                                                            setGlucoseRangeMin('70')
                                                            setGlucoseRangeMax('180')
                                                        }
                                                    }}
                                                    className="block w-full rounded-lg border border-gray-600 bg-gray-800 p-2 text-xs text-white focus:border-blue-500 focus:outline-none">
                                                    <option value="mmol">mmol/L</option>
                                                    <option value="mgdl">mg/dL</option>
                                                </select>
                                            </div>
                                            <div className="grid grid-cols-1 space-y-1">
                                                <label htmlFor="rangeMin" className="text-xs text-gray-400">
                                                    {t('min')} {glucoseRangeUnit === 'mmol' ? '(mmol/L)' : '(mg/dL)'}
                                                </label>
                                                <input
                                                    id="rangeMin"
                                                    type="number"
                                                    step={glucoseRangeUnit === 'mmol' ? '0.1' : '1'}
                                                    value={glucoseRangeMin}
                                                    onChange={e => setGlucoseRangeMin(e.target.value)}
                                                    className="block w-full rounded-lg border border-gray-600 bg-gray-800 p-2 text-xs text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none"
                                                />
                                            </div>
                                            <div className="grid grid-cols-1 space-y-1">
                                                <label htmlFor="rangeMax" className="text-xs text-gray-400">
                                                    {t('max')} {glucoseRangeUnit === 'mmol' ? '(mmol/L)' : '(mg/dL)'}
                                                </label>
                                                <input
                                                    id="rangeMax"
                                                    type="number"
                                                    step={glucoseRangeUnit === 'mmol' ? '0.1' : '1'}
                                                    value={glucoseRangeMax}
                                                    onChange={e => setGlucoseRangeMax(e.target.value)}
                                                    className="block w-full rounded-lg border border-gray-600 bg-gray-800 p-2 text-xs text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none"
                                                />
                                            </div>
                                        </div>
                                        <p className="text-xs text-gray-400">
                                            {t('defaultRange')}
                                        </p>
                                    </div>
                                )}
                                {(cgmProvider === 'libreview' || cgmProvider === 'dexcom') && (
                                    <div className="grid grid-cols-1 space-y-2">
                                        <label className="text-sm font-bold tracking-wide text-gray-500">
                                            {t('selectCSVFile')}{' '}
                                            <span className="text-sm font-thin text-gray-400">
                                                (<button onClick={e => toggleCSVGuide(e)}>{t('how')}</button>)
                                            </span>
                                        </label>
                                        {showCSVGuide && (
                                            <div className="rounded-lg bg-gray-700 p-4">
                                                {cgmProvider === 'libreview' && (
                                                    <>
                                                        <p className="font-bold">{t('analyzeLibreView')}</p>
                                                        <ul className="list-disc p-2">
                                                            <li>
                                                                {t('libreViewStep1')}{' '}
                                                                <a
                                                                    href="https://www.libreview.com/"
                                                                    target="_blank"
                                                                    className="text-blue-500 hover:text-blue-700">
                                                                    LibreView
                                                                </a>
                                                            </li>
                                                            <li>
                                                                {t('libreViewStep2')}
                                                            </li>
                                                            <li>
                                                                {t('libreViewStep3')}
                                                            </li>
                                                        </ul>
                                                    </>
                                                )}
                                                {cgmProvider === 'dexcom' && (
                                                    <>
                                                        {t('dexcomMissing')}{' '}
                                                        <a
                                                            className="text-blue-500 hover:text-blue-700"
                                                            href="https://github.com/luborjurena/t1dtools-wrapped">
                                                            GitHub
                                                        </a>
                                                        .
                                                    </>
                                                )}
                                            </div>
                                        )}
                                        <div className="flex w-full items-center justify-center">
                                            <div
                                                className={classnames(
                                                    dragActive ? 'border-green-600' : 'border-gray-500',
                                                    'group flex h-60 w-full cursor-pointer flex-col rounded-lg border-4 border-dashed p-10 text-center'
                                                )}
                                                onDragOver={handleDragOver}
                                                onDragLeave={handleDragLeave}
                                                onClick={openFileDialog}
                                                onDrop={handleDroppedFile}>
                                                <div className="flex h-full w-full flex-col items-center justify-center text-center">
                                                    {dragActive && (
                                                        <p className="pointer-none text-gray-500 ">{t('dropIt')}</p>
                                                    )}
                                                    {!dragActive && (
                                                        <p className="pointer-none text-gray-500 ">
                                                            <span className="text-sm">
                                                                {t('dragDropText')} <br />
                                                                alebo{' '}
                                                                <span className="text-blue-500 hover:text-blue-700">
                                                                    {t('clickToSelect')}
                                                                </span>{' '}
                                                                {t('fileFromComputer')}
                                                            </span>
                                                        </p>
                                                    )}
                                                </div>
                                                <input
                                                    type="file"
                                                    id="file-selector"
                                                    accept="text/csv"
                                                    onChange={event => parseData(event)}
                                                    className="hidden"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                )}
                                {cgmProvider === 'nightscout' && (
                                    <>
                                        <div className="grid grid-cols-1 space-y-2 text-gray-500">
                                            <span className="text-sm font-bold tracking-wide text-gray-500">
                                                {t('nightscoutRequirements')}
                                            </span>
                                            <ul className="list-decimal rounded-xl bg-gray-700 p-4 pl-8 text-sm text-gray-400">
                                                <li>
                                                    {t('nightscoutReq1')}{' '}
                                                    <span className="rounded bg-slate-900 p-1 font-mono text-sm font-bold">
                                                        {t('readable')}
                                                    </span>{' '}
                                                    {t('role')}
                                                </li>
                                                <li>
                                                    {t('nightscoutReq2')}{' '}
                                                    <span className="rounded bg-slate-900 p-1 font-mono text-sm font-bold">
                                                        {t('cors')}
                                                    </span>{' '}
                                                    {t('inVariable')}{' '}
                                                    <a
                                                        href="https://nightscout.github.io/nightscout/setup_variables/#cors-cors"
                                                        target="_blank"
                                                        className="text-blue-500 hover:text-blue-700">
                                                        <span className="rounded bg-slate-900 p-1 font-mono text-sm font-bold">
                                                            {t('variable')}
                                                        </span>
                                                    </a>{' '}
                                                    {t('configuration')}
                                                </li>
                                            </ul>
                                        </div>
                                        <div className="grid grid-cols-1 space-y-2">
                                            <label
                                                htmlFor="nsdomain"
                                                className="text-sm font-bold tracking-wide text-gray-500">
                                                {t('nightscoutServer')}
                                            </label>

                                            <input
                                                id="nsdomain"
                                                type="text"
                                                placeholder="https://nightscout.example.com"
                                                className="block w-full rounded-lg border border-gray-600 bg-gray-700 p-2.5 text-sm text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none"
                                                onChange={e => setNightscoutDomain(e.target.value as string)}
                                            />
                                        </div>
                                        <div className="grid grid-cols-1 space-y-2">
                                            <label
                                                htmlFor="nskey"
                                                className="text-sm font-bold tracking-wide text-gray-500">
                                                {t('apiSecret')}
                                            </label>

                                            <input
                                                id="nskey"
                                                type="text"
                                                placeholder="t1dtools-0a6c761d3286c8d9"
                                                className="block w-full rounded-lg border border-gray-600 bg-gray-700 p-2.5 text-sm text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none"
                                                onChange={e => setNightscoutSecret(e.target.value as string)}
                                            />
                                        </div>
                                        <div className="grid grid-cols-1 space-y-2">
                                            <label
                                                htmlFor="startDate"
                                                className="text-sm font-bold tracking-wide text-gray-500">
                                                {t('startDate')}
                                            </label>
                                            <input
                                                id="startDate"
                                                type="date"
                                                value={startDate}
                                                className="block w-full rounded-lg border border-gray-600 bg-gray-700 p-2.5 text-sm text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none"
                                                onChange={e => setStartDate(e.target.value)}
                                            />
                                        </div>
                                        <div className="grid grid-cols-1 space-y-2">
                                            <label
                                                htmlFor="endDate"
                                                className="text-sm font-bold tracking-wide text-gray-500">
                                                {t('endDate')}
                                            </label>
                                            <input
                                                id="endDate"
                                                type="date"
                                                value={endDate}
                                                className="block w-full rounded-lg border border-gray-600 bg-gray-700 p-2.5 text-sm text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none"
                                                onChange={e => setEndDate(e.target.value)}
                                            />
                                        </div>
                                        <div className="grid grid-cols-1 space-y-2">
                                            <button
                                                className="mt-8 rounded-lg border border-gray-600 bg-gray-700 p-2.5 text-sm text-white focus:border-blue-500 focus:outline-none disabled:cursor-not-allowed disabled:text-gray-500 disabled:opacity-50"
                                                onClick={() => getNightscoutData()}
                                                disabled={nightscoutDomain === '' || nightscoutSecret === '' || !startDate || !endDate}>
                                                {t('wrapIt')}
                                            </button>
                                        </div>
                                    </>
                                )}
                            </form>
                        )}

                        {CGMDataLoading && (
                            <div className="pt-8 text-center">
                                {t('generatingReport')}
                                {typeof CGMDataLoading === 'string' && (
                                    <span className="mt-2 block">{CGMDataLoading}</span>
                                )}
                                <svg
                                    className="m-auto mt-2"
                                    width={24}
                                    height={24}
                                    viewBox="0 0 24 24"
                                    xmlns="http://www.w3.org/2000/svg">
                                    <style
                                        dangerouslySetInnerHTML={{
                                            __html: '.spinner_P7sC{transform-origin:center;animation:spinner_svv2 .75s infinite linear}@keyframes spinner_svv2{100%{transform:rotate(360deg)}}',
                                        }}
                                    />
                                    <path
                                        d="M10.14,1.16a11,11,0,0,0-9,8.92A1.59,1.59,0,0,0,2.46,12,1.52,1.52,0,0,0,4.11,10.7a8,8,0,0,1,6.66-6.61A1.42,1.42,0,0,0,12,2.69h0A1.57,1.57,0,0,0,10.14,1.16Z"
                                        fill="#fff"
                                        className="spinner_P7sC"
                                    />
                                </svg>
                            </div>
                        )}
                        {!CGMDataLoading && CGMDataError && (
                            <div className="pt-8 text-center text-red-500">
                                {t('errorParsing')} {CGMDataError}
                            </div>
                        )}
                    </div>
                )}
                {dailyRecords.length > 0 && !CGMDataLoading && (
                    <div className="pointer-cursor absolute top-5 right-5 rounded-md bg-gray-800 p-2 hover:text-gray-400">
                        <a href="#" onClick={reset} className="pointer-cursor text-sm">
                            {t('startOver')}
                        </a>
                    </div>
                )}

                {!CGMDataLoading && dailyRecords.length > 0 && (
                    <div className="max-w-[1600px] flex flex-col items-center justify-center self-center">
                        <div className="mb-8 w-full rounded-xl bg-gray-800 p-10 pt-0">
                            <DayGraph dailyRecords={dailyRecords} />
                        </div>
                        <div className="mb-8 w-full rounded-xl bg-gray-800 p-10 pt-0">
                            <RangeByDays dailyRecords={dailyRecords} />
                        </div>

                        <div className="w-full rounded-xl bg-gray-800 p-10 pt-0">
                            <RangeDoughnuts dailyRecords={dailyRecords} />
                        </div>
                    </div>
                )}
            </div>
            <div className="mt-8 mb-8 text-center text-sm text-gray-600">
                {t('openSource')}{' '}
                <a href="https://github.com/luborjurena/t1dtools-wrapped" className="underline hover:no-underline">
                    GitHub
                </a>, {t('originallyBy')}
                .
            </div>
        </>
    )
}
