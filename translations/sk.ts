export const translations = {
    // Meta
    metaTitle: 'Diabetes Wrapped',
    metaDescription: 'Prehľad vášho roka s diabetom v štýle Spotify Wrapped, založený na vašich údajoch z CGM',
    
    // Main page
    headline: 'glykemia.sk',
    visualizeTitle: 'Vizualizujte svoje údaje z CGM!',
    description: 'glykemia.sk wrapped nástroj beží celý vo vašom prehliadači, neodosiela žiadne údaje na servery. Nájdite projekt na',
    curious: 'Zaujíma vás, čo to je?',
    demoLink: 'Pozrite si túto ukážku',
    
    // CGM Provider
    selectCGMProvider: 'Vyberte poskytovateľa CGM',
    chooseCGMProvider: 'Vyberte poskytovateľa údajov CGM',
    dexcom: 'Dexcom Clarity',
    libreview: 'Libreview (Freestyle Libre)',
    nightscout: 'Nightscout',
    
    // Glucose Range
    targetGlucoseRange: 'Cieľový rozsah glykémie',
    unit: 'Jednotka',
    min: 'Min',
    max: 'Max',
    defaultRange: 'Predvolené: 3.9-10.0 mmol/L (70-180 mg/dL). Upravte podľa svojho cieľového rozsahu.',
    
    // File Upload
    selectCSVFile: 'Vyberte svoj CSV súbor',
    how: 'Ako?',
    dropIt: 'Pustite!',
    dragDropText: 'Presuňte sem svoj export CGM alebo',
    clickToSelect: 'kliknite na výber',
    fileFromComputer: 'súboru z vášho počítača.',
    
    // LibreView Guide
    analyzeLibreView: 'Analyzujte svoje údaje z LibreView',
    libreViewStep1: 'Prihláste sa do svojho účtu na',
    libreViewStep2: 'Kliknite na modré tlačidlo "Stiahnuť údaje o glykémii" v pravom hornom rohu a uložte vygenerovaný súbor do vášho počítača.',
    libreViewStep3: 'Presuňte súbor do poľa nižšie alebo kliknite na pole a vyberte súbor.',
    
    // Dexcom Guide
    dexcomMissing: 'Momentálne chýbajú inštrukcie pre Dexcom Clarity. Ak môžete pomôcť, otvorte problém na',
    
    // Nightscout
    nightscoutRequirements: 'Požiadavky Nightscout',
    nightscoutReq1: 'API Secret alebo prístupový token s aspoň',
    readable: 'readable',
    role: 'rolou.',
    nightscoutReq2: 'CORS musí byť povolený. Nastavte',
    cors: 'ENABLE_CORS=true',
    inVariable: 'v premenných prostredia',
    variable: 'Nightscout',
    configuration: '.',
    nightscoutReq3: 'Ak máte problémy s CORS, skúste použiť token namiesto API secret. Vytvorte ho v Nightscout Admin Tools.',
    nightscoutServer: 'Nightscout Server',
    apiSecretOrToken: 'API Secret alebo Token',
    apiSecret: 'API Secret alebo Token',
    startDate: 'Dátum začiatku',
    endDate: 'Dátum konca',
    wrapIt: 'Zabaliť!',
    
    // Loading
    generatingReport: 'Generovanie vášho wrapped prehľadu...',
    
    // Errors
    errorParsing: 'Pri parsovaní vašich údajov CGM došlo k chybe:',
    invalidDateRange: 'Neplatný rozsah dátumov. Vyberte platné dátumy začiatku a konca.',
    startBeforeEnd: 'Dátum začiatku musí byť pred dátumom konca.',
    invalidGlucoseRange: 'Neplatný rozsah glykémie. Minimum musí byť menšie ako maximum.',
    noCGMProvider: 'Nie je vybraný poskytovateľ CGM.',
    
    // Results
    startOver: 'Začať znova?',
    targetRangeUsed: 'Použitý cieľový rozsah',
    targetRangeDisplay: '{min}-{max} {unit}',
    mmolL: 'mmol/L',
    mgdL: 'mg/dL',
    everyDayThisYear: 'Každý deň tohto roka',
    everyDaySubheadline: 'Tento graf zobrazuje celý rok, pričom každý deň je farebne označený podľa času v rozsahu pre daný deň.',
    
    // Range By Days
    rangeByDays: 'Rozsah podľa dní',
    rangeByDaysSubheadline: 'Prejdite myšou cez tento graf a uvidíte, koľko dní ste strávili v ktorom rozsahu počas celého roka.',
    daysBetween: 'dní medzi',
    and: 'a',
    inRange: '% v rozsahu',
    
    // Range Distribution
    rangeDistribution: 'Rozdelenie rozsahu',
    rangeDistributionSubheadline: 'Koľko dní máte nad určitým percentom v rozsahu?',
    daysOver: 'Dní nad',
    daysAt: 'Dní na',
    
    // Footer
    openSource: 'Tento nástroj je open source a nájdete ho na',
    originallyBy: 'pôvodne vyvinutý tímom t1d.tools',
    
    // Months
    jan: 'Jan',
    feb: 'Feb',
    mar: 'Mar',
    apr: 'Apr',
    may: 'Máj',
    jun: 'Jún',
    jul: 'Júl',
    aug: 'Aug',
    sep: 'Sep',
    oct: 'Okt',
    nov: 'Nov',
    dec: 'Dec',
    
    // Days
    mon: 'Pon',
    tue: 'Uto',
    wed: 'Str',
    thu: 'Štv',
    fri: 'Pia',
    sat: 'Sob',
    sun: 'Ned',
}

