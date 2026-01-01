import React from 'react'
import { DailyRecord } from '../datahandling/dailyRecords'
import { Doughnut } from './doughnut'
import { Headline } from './headline'
import { useTranslation } from '../contexts/TranslationContext'

export const RangeByDays = ({ dailyRecords }: { dailyRecords: DailyRecord[] }) => {
    const { t } = useTranslation()
    const daysInRange = {
        d0t10: 0,
        d10t20: 0,
        d20t30: 0,
        d30t40: 0,
        d40t50: 0,
        d50t60: 0,
        d60t70: 0,
        d70t80: 0,
        d80t90: 0,
        d90t100: 0,
    }

    dailyRecords.forEach(dailyRecord => {
        const percentage = dailyRecord.rangePercentage
        if (percentage >= 0 && percentage < 10) {
            daysInRange.d0t10++
        } else if (percentage >= 10 && percentage < 20) {
            daysInRange.d10t20++
        } else if (percentage >= 20 && percentage < 30) {
            daysInRange.d20t30++
        } else if (percentage >= 30 && percentage < 40) {
            daysInRange.d30t40++
        } else if (percentage >= 40 && percentage < 50) {
            daysInRange.d40t50++
        } else if (percentage >= 50 && percentage < 60) {
            daysInRange.d50t60++
        } else if (percentage >= 60 && percentage < 70) {
            daysInRange.d60t70++
        } else if (percentage >= 70 && percentage < 80) {
            daysInRange.d70t80++
        } else if (percentage >= 80 && percentage < 90) {
            daysInRange.d80t90++
        } else if (percentage >= 90 && percentage <= 100) {
            daysInRange.d90t100++
        }
    })

    return (
        <>
            <Headline
                size={2}
                text={t('rangeByDays')}
                subheadline={t('rangeByDaysSubheadline')}
            />
            <div className="percentage-bar flex w-[1500px] text-center">
                {daysInRange.d0t10 > 0 && (
                    <div
                        style={{
                            backgroundColor: 'hsl(0, 0%, 13%)',
                            flexGrow: daysInRange.d0t10,
                        }}
                    >
                        <span className="tooltiptext">
                            <>
                                {daysInRange.d0t10} {t('daysBetween')} 0% {t('and')} 10% {t('inRange')}
                            </>
                        </span>
                    </div>
                )}
                {daysInRange.d10t20 > 0 && (
                    <div
                        style={{
                            backgroundColor: 'hsl(0, 100%, 39%)',
                            flexGrow: daysInRange.d10t20,
                        }}
                    >
                        <span className="tooltiptext">
                            <>
                                {daysInRange.d10t20} {t('daysBetween')} 10% {t('and')} 20% {t('inRange')}
                            </>
                        </span>
                    </div>
                )}
                {daysInRange.d20t30 > 0 && (
                    <div
                        style={{
                            backgroundColor: 'hsl(16, 100%, 36%)',
                            flexGrow: daysInRange.d20t30,
                        }}
                        >
                        <span className="tooltiptext">
                            <>
                                {daysInRange.d20t30} {t('daysBetween')} 20% {t('and')} 30% {t('inRange')}
                            </>
                        </span>
                    </div>
                )}
                {daysInRange.d30t40 > 0 && (
                    <div
                        style={{
                            backgroundColor: 'hsl(27, 100%, 36%)',
                            flexGrow: daysInRange.d30t40,
                        }}
                        >
                        <span className="tooltiptext">
                            <>
                                {daysInRange.d30t40} {t('daysBetween')} 30% {t('and')} 40% {t('inRange')}
                            </>
                        </span>
                    </div>
                )}
                {daysInRange.d40t50 > 0 && (
                    <div
                        style={{
                            backgroundColor: 'hsl(53, 100%, 36%)',
                            flexGrow: daysInRange.d40t50,
                        }}
                        >
                        <span className="tooltiptext">
                            <>
                                {daysInRange.d40t50} {t('daysBetween')} 40% {t('and')} 50% {t('inRange')}
                            </>
                        </span>
                    </div>
                )}
                {daysInRange.d50t60 > 0 && (
                    <div
                        style={{
                            backgroundColor: 'hsl(61, 100%, 36%)',
                            flexGrow: daysInRange.d50t60,
                        }}
                        >
                        <span className="tooltiptext">
                            <>
                                {daysInRange.d50t60} {t('daysBetween')} 50% {t('and')} 60% {t('inRange')}
                            </>
                        </span>
                    </div>
                )}
                {daysInRange.d60t70 > 0 && (
                    <div
                        style={{
                            backgroundColor: 'hsl(67, 100%, 44%)',
                            flexGrow: daysInRange.d60t70,
                        }}
                        >
                        <span className="tooltiptext">
                            <>
                                {daysInRange.d60t70} {t('daysBetween')} 60% {t('and')} 70% {t('inRange')}
                            </>
                        </span>
                    </div>
                )}
                {daysInRange.d70t80 > 0 && (
                    <div
                        style={{
                            backgroundColor: 'hsl(144, 100%, 31%)',
                            flexGrow: daysInRange.d70t80,
                        }}
                        >
                        <span className="tooltiptext">
                            <>
                                {daysInRange.d70t80} {t('daysBetween')} 70% {t('and')} 80% {t('inRange')}
                            </>
                        </span>
                    </div>
                )}
                {daysInRange.d80t90 > 0 && (
                    <div
                        style={{
                            backgroundColor: 'hsl(144, 100%, 39%)',
                            flexGrow: daysInRange.d80t90,
                        }}
                        >
                        <span className="tooltiptext">
                            <>
                                {daysInRange.d80t90} {t('daysBetween')} 80% {t('and')} 90% {t('inRange')}
                            </>
                        </span>
                    </div>
                )}
                {daysInRange.d90t100 > 0 && (
                    <div
                        style={{
                            backgroundColor: 'hsl(144, 100%, 50%)',
                            flexGrow: daysInRange.d90t100,
                        }}
                        >
                        <span className="tooltiptext">
                            <>
                                {daysInRange.d90t100} {t('daysBetween')} 90% {t('and')} 100% {t('inRange')}
                            </>
                        </span>
                    </div>
                )}
            </div>

            <style jsx>{`
                .percentage-bar div {
                    height: 50px;
                    display: inline-block;
                    position: relative;
                }

                .percentage-bar div .tooltiptext {
                    visibility: hidden;
                    width: 150px;
                    background-color: black;
                    color: #fff;
                    text-align: center;
                    padding: 5px 0;
                    border-radius: 6px;
                    position: absolute;
                    z-index: 1;
                    top: -5px;
                    left: 105%;
                }

                .percentage-bar div .tooltiptext::after {
                    content: ' ';
                    position: absolute;
                    top: 50%;
                    right: 100%;
                    margin-top: -5px;
                    border-width: 5px;
                    border-style: solid;
                    border-color: transparent black transparent transparent;
                }

                .percentage-bar div:hover .tooltiptext {
                    visibility: visible;
                }

                .percentage-bar div:first-child {
                    border-radius: 5px 0 0 5px;
                }

                .percentage-bar div:last-child {
                    border-radius: 0 5px 5px 0;
                }
            `}</style>
        </>
    )
}
