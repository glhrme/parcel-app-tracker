// Maltese translations
export const mt = {
  // Tab names
  tabs: {
    home: 'Dar',
    yourShipments: 'Il-Konsenja Tiegħek',
    settings: 'Settings',
  },

  // Common texts
  common: {
    cancel: 'Ikkanċella',
    save: 'Issejvja',
    done: 'Lest',
    ok: 'OK',
    error: 'Żball',
    success: 'Suċċess',
    loading: 'Qed jitgħabba',
    retry: 'Erġa pprova',
    from: 'Minn',
    to: 'Għal',
  },

  // Home screen
  home: {
    title: 'Tracking tal-Pakketti',
    subtitle: 'Issegwi l-pakketti tiegħek faċilment',
    addTracking: 'Żid Tracking',
    recentShipments: 'Konsenja Riċenti',
    seeAll: 'Ara Kollox',
    noRecentShipments: 'Ebda konsenja riċenti',
    addTrackingCode: 'Żid kodiċi ta\' tracking biex tibda tissorvelja l-pakketti tiegħek',
    enterTrackingCode: 'Daħħal kodiċi tracking',
    track: 'Issegwi',
    emptyState: 'Ebda tracking misjub',
    emptyStateDescription: 'Żid kodiċi ta\' tracking biex tibda tissorvelja l-pakketti tiegħek',
    searchPlaceholder: 'Daħħal kodiċi tracking...',
    updating: 'Qed jiġġedded...',
    currentShipment: 'Konsenja Kurrenti',
    viewAll: 'Ara Kollox',
    yourShipments: 'Il-Konsenja Tiegħek',
    emptyTitle: 'Ebda tracking',
    emptySubtitle: 'Żid l-ewwel kodiċi tiegħek',
  },

  // Your Shipments screen
  yourShipments: {
    title: 'Il-Konsenja Tiegħek',
    searchPlaceholder: 'Fittex bil-kodiċi tracking...',
    all: 'Kollox',
    pending: 'Pendenti',
    delivered: 'Konsenjati',
    noShipments: 'Ebda konsenja misjuba',
    noShipmentsDescription: 'Żid kodiċijiet tracking biex tara l-konsenja tiegħek hawn',
    addFirstShipment: 'Żid L-Ewwel Konsenja',
    notFoundForFilter: 'Ebda konsenja misjuba għal dan il-filtru',
    tryDifferentFilter: 'Ipprova filtru jew terminu ta\' tfittxija differenti',
    emptySearch: 'Ebda riżultat għat-tfittxija',
    clearSearch: 'Neħħi t-tfittxija biex tara l-konsenja kollha',
    loadingShipments: 'Qed jitgħabbew il-konsenja...',
    refreshing: 'Qed jiġġedded...',
    shipmentCount: (total: number) => `${total} konsenja${total !== 1 ? '' : ''}`,
    pendingCount: (pending: number) => `${pending} pendenti`,
    deliveredCount: (delivered: number) => `${delivered} konsenjati`,
    loadingText: 'Qed jitgħabba...',
    filterAll: 'Kollox',
    filterPending: 'Pendenti',
    filterDelivered: 'Konsenjati',
    emptySearchTitle: 'Ebda riżultat misjub',
    emptyTitle: 'Ebda konsenja',
    emptySearchSubtitle: 'Ipprova terminu ta\' tfittxija ieħor',
    emptyFilterSubtitle: 'Ipprova filtru ieħor',
    emptySubtitle: 'Żid l-ewwel kodiċi tracking tiegħek',
    inTransit: 'Fi Tranżitu',
  },

  // Settings screen
  settings: {
    title: 'Settings',
    language: 'Lingwa',
    selectLanguage: 'Agħżel Lingwa',
    account: 'Kont',
    signIn: 'Idħol',
    signUp: 'Irreġistra',
    about: 'Dwar',
    version: 'Verżjoni',
    privacyPolicy: 'Politika tal-Privatezza',
    termsOfService: 'Termini tas-Servizz',
    languageChanged: 'Il-lingwa nbidlet b\'suċċess',
    comingSoon: 'Ġej Dalwaqt',
    loginDescription: 'Aċċessa l-kont tiegħek biex tissinkronizza d-data madwar il-mezzi kollha',
    languageDescription: 'Agħżel il-lingwa preferita tiegħek',
    loginTitle: 'Login',
    madeWith: 'Magħmul b\'❤️',
  },

  // Languages
  languages: {
    english: 'Ingliż',
    maltese: 'Malti',
    portuguese: 'Portugiż',
  },

  // Tracking Details screen
  trackingDetails: {
    title: 'Dettalji Tracking',
    loadingText: 'Qed jitgħabbew id-dettalji tracking...',
    errorText: 'Żball fil-loading tad-dettalji tracking',
    tryAgain: 'Erġa Pprova',
    progress: 'Progress',
    history: 'Storja',
    technicalInfo: 'Informazzjoni Teknika',
    trackingCode: 'Kodiċi Tracking',
    status: 'Status',
    lastUpdate: 'Aħħar Aġġornament',
    destination: 'Destinazzjoni',
    origin: 'Oriġini',
    packageType: 'Tip ta\' Pakkett',
    estimatedDelivery: 'Konsenja Stmata',
    noMovements: 'Ebda storja ta\' moviment disponibbli',
    refreshing: 'Qed jiġġedded...',
    totalMovements: 'Total ta\' Movimenti',
  },

  // Checkpoint labels
  checkpoints: {
    itemCreated: 'Oġġett Maħluq',
    inTransit: 'Fi Tranżitu',
    outForDelivery: 'Ħierek għall-Konsenja',
    delivered: 'Konsenjat',
    arrivedInCountry: 'Wasal fil-Pajjiż',
    readyForCollection: 'Lest għall-Ġbir',
  },

  // Error messages
  errors: {
    networkError: 'Żball tan-network. Jekk jogħġbok iċċekkja l-konnessjoni tiegħek.',
    invalidTrackingCode: 'Format tal-kodiċi tracking invalidu',
    trackingNotFound: 'Tracking ma nstabx',
    generalError: 'Seħħ żball. Jekk jogħġbok erġa pprova.',
  },
};
