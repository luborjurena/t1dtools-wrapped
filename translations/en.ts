export const translations = {
    // Meta
    metaTitle: 'Diabetes Wrapped',
    metaDescription: 'A Spotify Wrapped style view of your year with diabetes, based on your CGM data',
    
    // Main page
    headline: 'glykemia.sk',
    visualizeTitle: 'Visualize your CGM data!',
    description: 'glykemia.sk wrapped tool runs entirely in your browser, sending no data to any servers. Find the project on',
    curious: 'Curious what this is?',
    demoLink: 'Have a look at this demo',
    
    // CGM Provider
    selectCGMProvider: 'Select CGM Provider',
    chooseCGMProvider: 'Choose a CGM data provider',
    dexcom: 'Dexcom Clarity',
    libreview: 'Libreview (Freestyle Libre)',
    nightscout: 'Nightscout',
    
    // Glucose Range
    targetGlucoseRange: 'Target Glucose Range',
    unit: 'Unit',
    min: 'Min',
    max: 'Max',
    defaultRange: 'Default: 3.9-10.0 mmol/L (70-180 mg/dL). Adjust to match your target range.',
    
    // File Upload
    selectCSVFile: 'Select your CSV file',
    how: 'How?',
    dropIt: 'Drop it!',
    dragDropText: 'Drag and drop your CGM export here',
    clickToSelect: 'click to select',
    fileFromComputer: 'a file from your computer.',
    
    // LibreView Guide
    analyzeLibreView: 'Analyze your LibreView data',
    libreViewStep1: 'Log in to your account on',
    libreViewStep2: 'Click the blue "Download glucose data" button in the top right corner, and save the generated file to your computer.',
    libreViewStep3: 'Drag and drop the file into the box below, or click the box to select the file.',
    
    // Dexcom Guide
    dexcomMissing: 'Currently instructions are missing for Dexcom Clarity. If you can help, please open an issue on',
    
    // Nightscout
    nightscoutRequirements: 'Nightscout Requirements',
    nightscoutReq1: 'For protected Nightscout: API Secret or Access Token with at least a',
    readable: 'readable',
    role: 'role.',
    nightscoutReq2: 'CORS must be enabled. Set',
    cors: 'ENABLE_CORS=true',
    inVariable: 'in your Nightscout',
    variable: 'environment variables',
    configuration: '.',
    nightscoutReq3: 'If you have CORS issues, create an access token in Admin Tools → Subjects with "readable" role and use it instead of API secret.',
    nightscoutServer: 'Nightscout Server',
    apiSecretOrToken: 'API Secret or Access Token',
    apiSecret: 'API Secret or Access Token',
    optional: 'optional',
    leaveEmptyIfPublic: 'Leave empty if public Nightscout',
    startDate: 'Start Date',
    endDate: 'End Date',
    wrapIt: 'Wrap it!',
    
    // Loading
    generatingReport: 'Generating your wrapped report...',
    
    // Errors
    errorParsing: 'There was an error parsing your CGM data:',
    invalidDateRange: 'Invalid date range. Please select valid start and end dates.',
    startBeforeEnd: 'Start date must be before end date.',
    invalidGlucoseRange: 'Invalid glucose range. Minimum must be less than maximum.',
    noCGMProvider: 'No cgm provider selected.',
    
    // Results
    startOver: 'Start over?',
    targetRangeUsed: 'Target Range Used',
    targetRangeDisplay: '{min}-{max} {unit}',
    mmolL: 'mmol/L',
    mgdL: 'mg/dL',
    everyDayThisYear: 'Every Day this Year',
    everyDaySubheadline: 'This graph shows the entire year, with each day color coded by the the time in range for that day.',
    
    // Range By Days
    rangeByDays: 'Range By Days',
    rangeByDaysSubheadline: 'Hover over this graph to see how many days you spent in which range for the entire year.',
    daysBetween: 'days between',
    and: 'and',
    inRange: '% in range',
    
    // Range Distribution
    rangeDistribution: 'Range Distribution',
    rangeDistributionSubheadline: 'How many days to you have over a certain percentage in range?',
    daysOver: 'Days over',
    daysAt: 'Days at',
    
    // Footer
    openSource: 'This tool is open source and can be found on',
    originallyBy: 'originally developed by t1d.tools team',
    
    // Months
    jan: 'Jan',
    feb: 'Feb',
    mar: 'Mar',
    apr: 'Apr',
    may: 'May',
    jun: 'Jun',
    jul: 'Jul',
    aug: 'Aug',
    sep: 'Sep',
    oct: 'Oct',
    nov: 'Nov',
    dec: 'Dec',
    
    // Days
    mon: 'Mon',
    tue: 'Tue',
    wed: 'Wed',
    thu: 'Thu',
    fri: 'Fri',
    sat: 'Sat',
    sun: 'Sun',
}

