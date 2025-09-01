// Portuguese translations
export const pt = {
  // Tab names
  tabs: {
    home: 'Início',
    yourShipments: 'Suas Remessas',
    settings: 'Configurações',
  },

  // Common texts
  common: {
    cancel: 'Cancelar',
    save: 'Salvar',
    done: 'Concluído',
    ok: 'OK',
    error: 'Erro',
    success: 'Sucesso',
    loading: 'Carregando',
    retry: 'Tentar Novamente',
    from: 'De',
    to: 'Para',
  },

  // Home screen
  home: {
    title: 'Rastreamento de Pacotes',
    subtitle: 'Rastreie seus pacotes facilmente',
    addTracking: 'Adicionar Rastreamento',
    recentShipments: 'Remessas Recentes',
    seeAll: 'Ver Todos',
    noRecentShipments: 'Nenhuma remessa recente',
    addTrackingCode: 'Adicione um código de rastreamento para começar a monitorar seus pacotes',
    enterTrackingCode: 'Digite o código de rastreamento',
    track: 'Rastrear',
    emptyState: 'Nenhum rastreamento encontrado',
    emptyStateDescription: 'Adicione um código de rastreamento para começar a monitorar seus pacotes',
    searchPlaceholder: 'Digite o código de rastreamento...',
    updating: 'Atualizando...',
    currentShipment: 'Remessa Atual',
    viewAll: 'Ver Todos',
    yourShipments: 'Suas Remessas',
    emptyTitle: 'Nenhum rastreamento',
    emptySubtitle: 'Adicione seu primeiro código',
  },

  // Your Shipments screen
  yourShipments: {
    title: 'Suas Remessas',
    searchPlaceholder: 'Buscar por código de rastreamento...',
    all: 'Todos',
    pending: 'Pendente',
    delivered: 'Entregue',
    noShipments: 'Nenhuma remessa encontrada',
    noShipmentsDescription: 'Adicione códigos de rastreamento para ver suas remessas aqui',
    addFirstShipment: 'Adicionar Primeira Remessa',
    notFoundForFilter: 'Nenhuma remessa encontrada para este filtro',
    tryDifferentFilter: 'Tente um filtro ou termo de busca diferente',
    emptySearch: 'Nenhum resultado para a busca',
    clearSearch: 'Limpe a busca para ver todas as remessas',
    loadingShipments: 'Carregando remessas...',
    refreshing: 'Atualizando...',
    shipmentCount: (total: number) => `${total} remessa${total !== 1 ? 's' : ''}`,
    pendingCount: (pending: number) => `${pending} pendente${pending !== 1 ? 's' : ''}`,
    deliveredCount: (delivered: number) => `${delivered} entregue${delivered !== 1 ? 's' : ''}`,
    loadingText: 'Carregando...',
    filterAll: 'Todos',
    filterPending: 'Pendente',
    filterDelivered: 'Entregue',
    emptySearchTitle: 'Nenhum resultado encontrado',
    emptyTitle: 'Nenhuma remessa',
    emptySearchSubtitle: 'Tente um termo de busca diferente',
    emptyFilterSubtitle: 'Tente um filtro diferente',
    emptySubtitle: 'Adicione seu primeiro código de rastreamento',
    inTransit: 'Em Trânsito',
  },

  // Settings screen
  settings: {
    title: 'Configurações',
    language: 'Idioma',
    selectLanguage: 'Selecionar Idioma',
    account: 'Conta',
    signIn: 'Entrar',
    signUp: 'Cadastrar',
    about: 'Sobre',
    version: 'Versão',
    privacyPolicy: 'Política de Privacidade',
    termsOfService: 'Termos de Serviço',
    languageChanged: 'Idioma alterado com sucesso',
    comingSoon: 'Em Breve',
    loginDescription: 'Acesse sua conta para sincronizar dados entre dispositivos',
    languageDescription: 'Escolha seu idioma preferido',
    loginTitle: 'Login',
    madeWith: 'Feito com ❤️',
  },

  // Languages
  languages: {
    english: 'Inglês',
    maltese: 'Maltês',
    portuguese: 'Português',
  },

  // Tracking Details screen
  trackingDetails: {
    title: 'Detalhes da Entrega',
    loadingText: 'Carregando detalhes...',
    errorText: 'Erro ao carregar detalhes de rastreamento',
    tryAgain: 'Tentar Novamente',
    progress: 'Progresso',
    history: 'Histórico',
    technicalInfo: 'Informações Técnicas',
    trackingCode: 'Código de Rastreamento',
    status: 'Status',
    lastUpdate: 'Última Atualização',
    destination: 'Destino',
    origin: 'Origem',
    packageType: 'Tipo de Pacote',
    estimatedDelivery: 'Entrega Estimada',
    noMovements: 'Nenhum histórico de movimento disponível',
    refreshing: 'Atualizando...',
    totalMovements: 'Total de Movimentos',
  },

  // Checkpoint labels
  checkpoints: {
    itemCreated: 'Item Criado',
    inTransit: 'Em Trânsito',
    outForDelivery: 'Saiu para Entrega',
    delivered: 'Entregue',
    arrivedInCountry: 'Chegou no País',
    readyForCollection: 'Pronto para Retirada',
  },

  // Error messages
  errors: {
    networkError: 'Erro de rede. Verifique sua conexão.',
    invalidTrackingCode: 'Formato de código de rastreamento inválido',
    trackingNotFound: 'Rastreamento não encontrado',
    generalError: 'Ocorreu um erro. Tente novamente.',
  },
};
