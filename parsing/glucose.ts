import { ParseError } from './errors'

export enum GlucoseTypes {
    'mgdl',
    'mmol'
}

export type Options = {
    glucoseType: GlucoseTypes
    year?: number,
    startDate?: Date,
    endDate?: Date,
}

export type ParseResponse = {
    records: GlucoseReading[]
    error: ParseError | null
}

export type GlucoseReading = {
    Timestamp: Date
    Value: number
}
