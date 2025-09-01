// English translations (default)
export const en = {
  // Tab names
  tabs: {
    home: 'Home',
    yourShipments: 'Your Shipments',
    settings: 'Settings',
  },

  // Common texts
  common: {
    cancel: 'Cancel',
    save: 'Save',
    done: 'Done',
    ok: 'OK',
    error: 'Error',
    success: 'Success',
    loading: 'Loading',
    retry: 'Retry',
    from: 'From',
    to: 'To',
  },

  // Home screen
  home: {
    title: 'Parcel Tracking',
    subtitle: 'Track your packages easily',
    addTracking: 'Add Tracking',
    recentShipments: 'Recent Shipments',
    seeAll: 'See All',
    noRecentShipments: 'No recent shipments',
    addTrackingCode: 'Add a tracking code to start monitoring your packages',
    enterTrackingCode: 'Enter tracking code',
    track: 'Track',
    emptyState: 'No trackings found',
    emptyStateDescription: 'Add a tracking code to start monitoring your packages',
    searchPlaceholder: 'Enter tracking code...',
    updating: 'Updating...',
    currentShipment: 'Current Shipment',
    viewAll: 'View All',
    yourShipments: 'Your Shipments',
    emptyTitle: 'No trackings',
    emptySubtitle: 'Add your first code',
  },

  // Your Shipments screen
  yourShipments: {
    title: 'Your Shipments',
    searchPlaceholder: 'Search by tracking code...',
    all: 'All',
    pending: 'Pending',
    delivered: 'Delivered',
    noShipments: 'No shipments found',
    noShipmentsDescription: 'Add tracking codes to see your shipments here',
    addFirstShipment: 'Add First Shipment',
    notFoundForFilter: 'No shipments found for this filter',
    tryDifferentFilter: 'Try a different filter or search term',
    emptySearch: 'No results for search',
    clearSearch: 'Clear search to see all shipments',
    loadingShipments: 'Loading shipments...',
    refreshing: 'Refreshing...',
    shipmentCount: (total: number) => `${total} shipment${total !== 1 ? 's' : ''}`,
    pendingCount: (pending: number) => `${pending} pending`,
    deliveredCount: (delivered: number) => `${delivered} delivered`,
    loadingText: 'Loading...',
    filterAll: 'All',
    filterPending: 'Pending',
    filterDelivered: 'Delivered',
    emptySearchTitle: 'No results found',
    emptyTitle: 'No shipments',
    emptySearchSubtitle: 'Try a different search term',
    emptyFilterSubtitle: 'Try a different filter',
    emptySubtitle: 'Add your first tracking code',
    inTransit: 'In Transit',
  },

  // Settings screen
  settings: {
    title: 'Settings',
    language: 'Language',
    selectLanguage: 'Select Language',
    account: 'Account',
    signIn: 'Sign In',
    signUp: 'Sign Up',
    about: 'About',
    version: 'Version',
    privacyPolicy: 'Privacy Policy',
    termsOfService: 'Terms of Service',
    languageChanged: 'Language changed successfully',
    comingSoon: 'Coming Soon',
    loginDescription: 'Access your account to sync data across devices',
    languageDescription: 'Choose your preferred language',
    loginTitle: 'Login',
    madeWith: 'Made with ❤️',
  },

  // Languages
  languages: {
    english: 'English',
    maltese: 'Malti',
    portuguese: 'Português',
  },

  // Tracking Details screen
  trackingDetails: {
    title: 'Tracking Details',
    loadingText: 'Loading tracking details...',
    errorText: 'Error loading tracking details',
    tryAgain: 'Try Again',
    progress: 'Progress',
    history: 'History',
    technicalInfo: 'Technical Information',
    trackingCode: 'Tracking Code',
    status: 'Status',
    lastUpdate: 'Last Update',
    destination: 'Destination',
    origin: 'Origin',
    packageType: 'Package Type',
    estimatedDelivery: 'Estimated Delivery',
    noMovements: 'No movement history available',
    refreshing: 'Refreshing...',
    totalMovements: 'Total Movements',
  },

  // Checkpoint labels
  checkpoints: {
    itemCreated: 'Item Created',
    inTransit: 'In Transit',
    outForDelivery: 'Out for Delivery',
    delivered: 'Delivered',
    arrivedInCountry: 'Arrived in Country',
    readyForCollection: 'Ready for Collection',
  },

  // Error messages
  errors: {
    networkError: 'Network error. Please check your connection.',
    invalidTrackingCode: 'Invalid tracking code format',
    trackingNotFound: 'Tracking not found',
    generalError: 'An error occurred. Please try again.',
  },
};
