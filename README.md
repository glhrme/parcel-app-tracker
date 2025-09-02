# 📦 Parc5. [Estrutura de Dados](#estrutura-de-dados)
6. [Navegação](#navegação)
7. [Componentes](#componentes)
8. [Telas](#telas)
9. [Hooks Customizados](#hooks-customizados)
10. [Guia de Manutenção](#guia-de-manutenção)
11. [Troubleshooting](#troubleshooting)king App - Documentação Completa

## 📋 Índice

1. [Visão Geral](#visão-geral)
2. [Arquitetura do Projeto](#arquitetura-do-projeto)
3. [Sistema de Localização](#sistema-de-localização)
4. [Regras de Negócio](#regras-de-negócio)
5. [Repository Pattern](#repository-pattern)
6. [Estrutura de Dados](#estrutura-de-dados)
6. [Navegação](#navegação)
7. [Componentes](#componentes)
8. [Telas](#telas)
9. [Hooks Customizados](#hooks-customizados)
10. [Guia de Manutenção](#guia-de-manutenção)
11. [Troubleshooting](#troubleshooting)

---

## 🎯 Visão Geral

### Tecnologias Utilizadas
- **React Native** com **Expo SDK**
- **TypeScript** para tipagem estática
- **Expo Router** para navegação
- **AsyncStorage** para persistência local
- **React Context** para gerenciamento de estado global

### Funcionalidades Principais
- ✅ Rastreamento de pacotes via API
- ✅ Sistema de localização (3 idiomas: EN/MT/PT)
- ✅ Persistência de dados offline
- ✅ Interface responsiva e moderna
- ✅ Navegação por tabs
- ✅ Detalhes completos de rastreamento

---

## 🏗️ Arquitetura do Projeto

```
parcel-app/
├── app/                          # Telas da aplicação (Expo Router)
│   ├── (tabs)/                   # Navegação por tabs
│   │   ├── _layout.tsx          # Layout das tabs
│   │   ├── index.tsx            # Tela Home
│   │   ├── your-shipments.tsx   # Lista de remessas
│   │   └── settings.tsx         # Configurações
│   ├── _layout.tsx              # Layout root
│   ├── +not-found.tsx           # Tela 404
│   └── tracking-details.tsx     # Detalhes do rastreamento
├── components/                   # Componentes reutilizáveis
│   ├── TrackingCard.tsx         # Card de rastreamento
│   ├── SimpleTrackingItem.tsx   # Item simples de rastreamento
│   └── default/                 # Componentes padrão do Expo
├── data/                        # Camada de dados
│   ├── repositories/            # Repository Pattern
│   ├── services/               # Serviços de API
│   ├── types/                  # Definições de tipos
│   └── viewModel/              # View Models
├── hooks/                       # Hooks customizados
├── localization/               # Sistema de traduções
└── constants/                  # Constantes globais
```

---

## 🌍 Sistema de Localização

### Estrutura
O sistema suporta **3 idiomas**:
- **🇺🇸 English (en)** - Idioma padrão
- **🇲🇹 Maltese (mt)** - Idioma local de Malta
- **🇧🇷 Portuguese (pt)** - Idioma brasileiro

### Arquivos de Tradução

#### `localization/index.ts`
```typescript
export type Language = 'en' | 'mt' | 'pt';
export type TranslationKeys = typeof en;

export const translations = {
  en, mt, pt
};

export const defaultLanguage: Language = 'en';
```

#### Estrutura das Traduções
```typescript
{
  tabs: {
    home: string;
    yourShipments: string;
    settings: string;
  },
  common: {
    cancel: string;
    save: string;
    // ... outros textos comuns
  },
  home: {
    title: string;
    subtitle: string;
    // ... textos da tela home
  },
  yourShipments: {
    // ... textos da tela de remessas
  },
  settings: {
    // ... textos da tela de configurações
  },
  trackingDetails: {
    // ... textos da tela de detalhes
  },
  checkpoints: {
    itemCreated: string;
    inTransit: string;
    outForDelivery: string;
    delivered: string;
    arrivedInCountry: string;
    readyForCollection: string;
  },
  languages: {
    english: string;
    maltese: string;
    portuguese: string;
  },
  errors: {
    // ... mensagens de erro
  }
}
```

### Hook de Localização

#### `hooks/useLocalization.ts`
```typescript
interface LocalizationContextType {
  language: Language;
  t: TranslationKeys;
  setLanguage: (language: Language) => Promise<void>;
  isLoading: boolean;
}
```

**Uso:**
```typescript
const { t, language, setLanguage } = useLocalization();

// Usando traduções
<Text>{t.home.title}</Text>
<Text>{t.checkpoints.delivered}</Text>

// Mudando idioma
await setLanguage('pt');
```

**Persistência:** O idioma é salvo no AsyncStorage com a chave `'app_language'`.

---

## 📋 Regras de Negócio

### Lógica de Determinação de Checkpoints

O sistema automaticamente determina quantos checkpoints mostrar baseado em características do pacote:

#### Regra 1: 6 Checkpoints
**Condições:**
- Primeiro movimento com código `EMC` OU `EMA`
- **E** movimento é internacional (`isForeignMovement: true`)
- **E** localização diferente de `MaltaPost` e `MT`
- **E** é pacote Easipik (`isEasipikParcel: true`)

**Sequência:**
1. Item Created
2. Arrived in Country
3. In Transit
4. Out for Delivery
5. Ready for Collection
6. Delivered

#### Regra 2: 5 Checkpoints
**Condições A:** Pacote NÃO é Easipik (`isEasipikParcel: false`)

**Condições B:** Pacote É Easipik MAS primeiro movimento é local (`!isForeignMovement`)

**Sequência para Pacotes Internacionais:**
1. Item Created
2. Arrived in Country
3. In Transit
4. Out for Delivery
5. Delivered

**Sequência para Pacotes Locais:**
1. Item Created
2. In Transit
3. Out for Delivery
4. Ready for Collection
5. Delivered

#### Regra 3: 4 Checkpoints (Padrão)
**Condições:**
- Pacote local (`isForeign: false`)
- **E** NÃO é Easipik (`isEasipikParcel: false`)

**Sequência:**
1. Item Created
2. In Transit
3. Out for Delivery
4. Delivered

### Mapeamento de Códigos de Status

O sistema mapeia códigos da API para status dos checkpoints:

#### Códigos de Movimento
```typescript
// Checkpoint 0: Item Created
'EMA' | 'EMC' → Completo

// Checkpoint 1: Arrived in Country (internacional) ou In Transit (local)
// Para pacotes internacionais:
'EMD' | 'EDA' → Completo
// Para pacotes locais:
'EMG' → Completo

// Checkpoint 2: In Transit (internacional) ou Out for Delivery (local)
// Para pacotes internacionais:
'EMG' → Completo
// Para pacotes locais:
'EDG' → Completo

// Checkpoint 3: Out for Delivery
'EDG' → Completo

// Checkpoint 4: Ready for Collection (local 5 checkpoints) ou Delivered
// Para 5 checkpoints locais:
'EDH' → Completo
// Para outros casos:
'EMI' → Completo

// Checkpoint 5: Delivered (apenas 6 checkpoints)
'EMI' → Completo
```

### Lógica de Classificação de Pacotes

#### Critérios de Entrega
Um pacote é considerado "entregue" quando:
1. **Tem código EMI** nos movimentos (código oficial de entrega)
2. **OU** todos os checkpoints estão completos

#### Ordenação de Rastreamentos
```typescript
// Prioridade 1: Pacotes não entregues (por data de adição, mais novo primeiro)
// Prioridade 2: Pacotes entregues (por data de adição, mais novo primeiro)

sort((a, b) => {
  const aDelivered = isDelivered(a);
  const bDelivered = isDelivered(b);
  
  // Não entregue sempre vem primeiro
  if (aDelivered !== bDelivered) {
    return aDelivered ? 1 : -1;
  }
  
  // Mesmo status: mais novo primeiro
  return b.addedAt - a.addedAt;
});
```

### Regras de Interface

#### Tela Home
- **Remessa Atual:** Primeiro pacote não entregue encontrado
- **Outras Remessas:** Até 3 outros pacotes (entregues ou não)
- **Estado Vazio:** Mostrado quando não há rastreamentos

#### Filtros em Your Shipments
- **Todos:** Mostra todos os rastreamentos
- **Pendente:** Apenas pacotes não entregues (`!isDelivered()`)
- **Entregue:** Apenas pacotes entregues (`isDelivered()`)

#### Busca
- **Scope:** Apenas campo `trackingCode`
- **Comportamento:** Case-insensitive, busca por substring
- **Combinação:** Busca + filtro funcionam em conjunto

### Regras de Persistência

#### AsyncStorage
- **Chave por Código:** Cada rastreamento salvo com chave = código de rastreamento
- **Dados Preservados:** `addedAt` mantido em atualizações, `lastUpdated` sempre atualizado
- **Idioma:** Salvo separadamente com chave `'app_language'`

#### Atualizações
```typescript
// Se tracking já existe:
processedData.addedAt = existing.addedAt;     // Preserva data original
processedData.lastUpdated = Date.now();      // Atualiza timestamp

// Se é novo:
processedData.addedAt = Date.now();          // Data atual
processedData.lastUpdated = Date.now();     // Mesmo timestamp
```

### Regras de Localização

#### Fallback de Idiomas
1. **Idioma selecionado** pelo usuário
2. **Inglês (en)** como fallback se tradução não existir
3. **Chave original** se nem inglês tiver a tradução

#### Labels de Checkpoints
- **Repository retorna:** Chaves em inglês (`'itemCreated'`, `'inTransit'`, etc.)
- **UI traduz:** Via função `getLocalizedCheckpointTitle()`
- **Fallback:** Se chave não existe, mostra texto original

### Limitações e Considerações

#### Performance
- **AsyncStorage:** Operações são assíncronas, sempre aguardar com `await`
- **Traduções:** Carregadas uma vez no app start
- **Lista de Rastreamentos:** Reordenada a cada busca (otimizar se muitos itens)

#### Dados da API
- **Dependência:** Sistema assume que API retorna campos obrigatórios
- **Códigos:** Mapeamento fixo de códigos para status (pode precisar atualização)
- **Fallbacks:** Implementados para campos ausentes (`|| 'No Info'`)

---

## 🗃️ Repository Pattern

### `TrackingRepository`

Centraliza toda a lógica de dados de rastreamento.

#### Métodos Principais

```typescript
class TrackingRepository {
  // Rastreia e salva um código
  async trackAndSave(code: string): Promise<ProcessedTracking>
  
  // Verifica se código existe
  async exists(code: string): Promise<boolean>
  
  // Busca todos os rastreamentos
  async getAllTrackings(): Promise<ProcessedTracking[]>
  
  // Busca rastreamentos recentes
  async getRecentTrackings(limit: number): Promise<ProcessedTracking[]>
  
  // Busca por código específico
  async getTrackingByCode(code: string): Promise<ProcessedTracking | null>
  
  // Atualiza um rastreamento
  async updateTracking(code: string): Promise<ProcessedTracking | null>
}
```

#### Lógica de Checkpoints

O sistema determina automaticamente a quantidade de checkpoints baseado nas regras:

- **4 checkpoints:** Pacotes locais simples
- **5 checkpoints:** Pacotes locais com Easipik OU pacotes internacionais
- **6 checkpoints:** Pacotes internacionais com Easipik

```typescript
private determineCheckpointCount(response: ParcelResponse): number {
  const firstMovement = response.movements[0];
  
  // 6 checkpoints: Internacional + Easipik + location específica
  if (firstMovement.code === 'EMC' || firstMovement.code === 'EMA' && 
      firstMovement.isForeignMovement && 
      firstMovement.location !== 'MaltaPost' && 
      firstMovement.location !== 'MT' && 
      response.isEasipikParcel) {
    return 6;
  }
  
  // 5 checkpoints: Sem Easipik OU Easipik local
  if (!response.isEasipikParcel || 
      (response.isEasipikParcel && !firstMovement.isForeignMovement)) {
    return 5;
  }
  
  // 4 checkpoints: Local sem Easipik
  if (!response.isForeign && !response.isEasipikParcel) {
    return 4;
  }
  
  return 4; // Default
}
```

#### Mapeamento de Status

```typescript
switch (i) {
  case 0: // Item Created
    isCompleted = hasCode('EMA') || hasCode('EMC');
    break;
  case 1: // Arrived in Country (internacional) ou In Transit (local)
    if (response.isForeign) {
      isCompleted = hasCode('EMD') || hasCode('EDA');
    } else {
      isCompleted = hasCode('EMG');
    }
    break;
  case 2: // In Transit (internacional) ou Out for Delivery (local)
    if (response.isForeign) {
      isCompleted = hasCode('EMG');
    } else {
      isCompleted = hasCode('EDG');
    }
    break;
  case 3: // Out for Delivery
    isCompleted = hasCode('EDG');
    break;
  case 4: // Ready for Collection (local) ou Delivered (internacional)
    if (count === 5 && !response.isForeign) {
      isCompleted = hasCode('EDH');
    } else {
      isCompleted = hasCode('EMI');
    }
    break;
  case 5: // Delivered (apenas para 6 checkpoints)
    isCompleted = hasCode('EMI');
    break;
}
```

---

## 📊 Estrutura de Dados

### `ParcelResponse` (API Response)
```typescript
interface ParcelResponse {
  movements: Movement[];
  destination: string;
  isForeign: boolean;
  isEasipikParcel: boolean;
}

interface Movement {
  code: string;
  description: string;
  date: string;
  location: string;
  isForeignMovement: boolean;
}
```

### `ProcessedTracking` (Dados Processados)
```typescript
interface ProcessedTracking {
  originalData: ParcelResponse;
  trackingCode: string;
  status: string;
  date: string;
  fromLocation: string;
  toLocation: string;
  checkPoints: CheckPoint[];
  addedAt: number;        // timestamp de criação
  lastUpdated: number;    // timestamp da última atualização
}

interface CheckPoint {
  completed: boolean;
  title?: string;         // chave de localização (ex: 'itemCreated')
}
```

---

## 🧭 Navegação

### Estrutura (Expo Router)

```
app/
├── _layout.tsx                 # Root layout + LocalizationProvider
├── (tabs)/
│   ├── _layout.tsx            # Tab navigation layout
│   ├── index.tsx              # Home tab
│   ├── your-shipments.tsx     # Your Shipments tab
│   └── settings.tsx           # Settings tab
├── tracking-details.tsx       # Modal para detalhes
└── +not-found.tsx            # 404 page
```

### Tab Navigation

**Definição em `app/(tabs)/_layout.tsx`:**
```typescript
<Tabs>
  <Tabs.Screen
    name="index"
    options={{
      title: t.tabs.home,
      tabBarIcon: ({ color, focused }) => (
        <TabBarIcon name={focused ? 'home' : 'home-outline'} color={color} />
      ),
    }}
  />
  {/* ... outras tabs */}
</Tabs>
```

### Navegação Modal
```typescript
// Para abrir detalhes do rastreamento
router.push({
  pathname: '/tracking-details',
  params: { trackingCode }
});
```

---

## 🧩 Componentes

### `TrackingCard`

**Localização:** `components/TrackingCard.tsx`

**Props:**
```typescript
interface TrackingCardProps {
  trackingCode: string;
  status: string;
  date: string;
  fromLocation: string;
  toLocation: string;
  checkPoints: CheckPoint[];
  onPress?: () => void;
}
```

**Funcionalidades:**
- ✅ Exibe progresso visual dos checkpoints
- ✅ Localização automática dos títulos dos checkpoints
- ✅ Navegação para detalhes ao tocar
- ✅ Suporte a diferentes quantidades de checkpoints

**Localização de Checkpoints:**
```typescript
const getLocalizedCheckpointTitle = (title?: string): string => {
  const checkpointMap: { [key: string]: string } = {
    'itemCreated': t.checkpoints.itemCreated,
    'inTransit': t.checkpoints.inTransit,
    'outForDelivery': t.checkpoints.outForDelivery,
    'delivered': t.checkpoints.delivered,
    'arrivedInCountry': t.checkpoints.arrivedInCountry,
    'readyForCollection': t.checkpoints.readyForCollection,
  };

  return checkpointMap[title] || title;
};
```

### `SimpleTrackingItem`

**Localização:** `components/SimpleTrackingItem.tsx`

Versão simplificada do TrackingCard para listas.

---

## 📱 Telas

### 1. Home (`app/(tabs)/index.tsx`)

**Funcionalidades:**
- ✅ Campo de entrada para código de rastreamento
- ✅ Exibição de remessa atual (não entregue)
- ✅ Lista de remessas recentes
- ✅ Estados vazios com chamadas para ação

**ViewModel:** `useHomeViewModel`

**Estados:**
```typescript
const [trackingCode, setTrackingCode] = useState('');
const [isTracking, setIsTracking] = useState(false);
const [allTrackings, setAllTrackings] = useState<ProcessedTracking[]>([]);
```

**Lógica de Categorização:**
```typescript
// Separa em remessa atual (não entregue) e outras
const currentShipment = allTrackings.find(tracking => !isDelivered(tracking));
const otherShipments = allTrackings.filter(tracking => 
  tracking !== currentShipment
).slice(0, 3);
```

### 2. Your Shipments (`app/(tabs)/your-shipments.tsx`)

**Funcionalidades:**
- ✅ Lista completa de rastreamentos
- ✅ Busca por código
- ✅ Filtros (Todos/Pendente/Entregue)
- ✅ Estatísticas de contagem
- ✅ Pull-to-refresh
- ✅ Estados vazios contextuais

**Estados:**
```typescript
const [searchQuery, setSearchQuery] = useState('');
const [selectedFilter, setSelectedFilter] = useState<'all' | 'pending' | 'delivered'>('all');
const [isRefreshing, setIsRefreshing] = useState(false);
```

**Lógica de Filtros:**
```typescript
const filteredTrackings = trackings.filter(tracking => {
  const matchesSearch = tracking.trackingCode
    .toLowerCase()
    .includes(searchQuery.toLowerCase());
  
  const matchesFilter = selectedFilter === 'all' || 
    (selectedFilter === 'delivered' && isDelivered(tracking)) ||
    (selectedFilter === 'pending' && !isDelivered(tracking));
  
  return matchesSearch && matchesFilter;
});
```

### 3. Settings (`app/(tabs)/settings.tsx`)

**Funcionalidades:**
- ✅ Seleção de idioma com nomes nativos
- ✅ Seção de conta (placeholder para login futuro)
- ✅ Informações sobre o app
- ✅ ScrollView com padding adequado para tab bar

**Estrutura:**
```typescript
// Seções
- Language Selection (com visual feedback)
- Account (Coming Soon badge)
- About (versão e créditos)
```

**Mudança de Idioma:**
```typescript
const handleLanguageChange = (newLanguage: Language) => {
  Alert.alert(
    t.settings.language,
    `${t.common.save} ${languages.find(l => l.code === newLanguage)?.nativeName}?`,
    [
      { text: t.common.cancel, style: 'cancel' },
      {
        text: t.common.save,
        onPress: async () => {
          await setLanguage(newLanguage);
        },
      },
    ]
  );
};
```

### 4. Tracking Details (`app/tracking-details.tsx`)

**Funcionalidades:**
- ✅ Detalhes completos do rastreamento
- ✅ Progresso visual dos checkpoints
- ✅ Histórico de movimentações
- ✅ Informações técnicas
- ✅ Pull-to-refresh

**Parâmetros de Rota:**
```typescript
const { trackingCode } = useLocalSearchParams<{ trackingCode: string }>();
```

**Seções:**
1. **Progress:** Checkpoints visuais com status
2. **History:** Lista cronológica de movimentações
3. **Technical Info:** Dados técnicos (código, total de movimentos, etc.)

---

## 🎣 Hooks Customizados

### `useLocalization`

**Localização:** `hooks/useLocalization.ts`

**Funcionalidades:**
- ✅ Gerenciamento global do idioma
- ✅ Persistência no AsyncStorage
- ✅ Context Provider para toda a app
- ✅ Tipagem TypeScript completa

**Uso:**
```typescript
// Em qualquer componente
const { t, language, setLanguage, isLoading } = useLocalization();

// Provider no root
<LocalizationProvider>
  <App />
</LocalizationProvider>
```

### `useHomeViewModel`

**Localização:** `data/viewModel/useHomeViewModel.ts`

**Funcionalidades:**
- ✅ Wrapper para TrackingRepository
- ✅ Operações CRUD de rastreamento
- ✅ Abstração da lógica de negócio

**Métodos:**
```typescript
const {
  trackAndSave,
  getAllTrackings,
  getRecentTrackings,
  getTrackingByCode,
  updateTracking,
  exists
} = useHomeViewModel();
```

---

## 🔧 Guia de Manutenção

### Adicionando Nova Tradução

1. **Adicione a chave em `localization/en.ts`:**
```typescript
home: {
  // ... chaves existentes
  newKey: 'New Text',
}
```

2. **Adicione em `localization/mt.ts`:**
```typescript
home: {
  // ... chaves existentes
  newKey: 'Tess Ġdid',
}
```

3. **Adicione em `localization/pt.ts`:**
```typescript
home: {
  // ... chaves existentes
  newKey: 'Novo Texto',
}
```

4. **Use no código:**
```typescript
<Text>{t.home.newKey}</Text>
```

### Adicionando Novo Idioma

1. **Crie arquivo `localization/xx.ts`:**
```typescript
export const xx = {
  // ... estrutura completa igual aos outros
};
```

2. **Atualize `localization/index.ts`:**
```typescript
import { xx } from './xx';

export type Language = 'en' | 'mt' | 'pt' | 'xx';

export const translations = {
  en, mt, pt, xx
};

export const languages = [
  // ... existentes
  { code: 'xx' as Language, name: 'Language Name', nativeName: 'Native Name' },
];
```

### Modificando Lógica de Checkpoints

**Arquivo:** `data/repositories/trackingRepository.ts`

1. **Para adicionar nova regra de contagem:**
```typescript
private determineCheckpointCount(response: ParcelResponse): number {
  // Adicione sua lógica aqui
  if (/* nova condição */) {
    return /* novo número */;
  }
  
  // ... lógica existente
}
```

2. **Para adicionar novo tipo de checkpoint:**
```typescript
// 1. Adicione em todas as traduções
checkpoints: {
  // ... existentes
  newCheckpoint: 'New Checkpoint',
}

// 2. Use na lógica de labels
private getCheckpointLabels(count: number, isForeign: boolean): string[] {
  if (count === 7) { // nova quantidade
    return ['itemCreated', 'newCheckpoint', /* ... */];
  }
  // ... lógica existente
}
```

### Adicionando Nova Tela

1. **Crie arquivo em `app/`:**
```typescript
// app/new-screen.tsx
export default function NewScreen() {
  const { t } = useLocalization();
  
  return (
    <View>
      <Text>{t.newScreen.title}</Text>
    </View>
  );
}
```

2. **Adicione traduções:**
```typescript
// Em todos os arquivos de tradução
newScreen: {
  title: 'New Screen',
  // ... outras chaves
}
```

3. **Configure navegação se necessário.**

### Modificando API

**Arquivo:** `data/services/trackingService.ts`

Para alterar endpoint ou lógica de API, modifique este arquivo. O Repository abstrairá as mudanças automaticamente.

---

## 🐛 Troubleshooting

### Problemas Comuns

#### 1. Erro de Tradução Faltando
```
Property 'newKey' does not exist on type TranslationKeys
```

**Solução:** Adicione a chave em TODOS os arquivos de tradução (en, mt, pt).

#### 2. AsyncStorage não Persiste
```typescript
// Verifique se está aguardando corretamente
await setLanguage('pt');

// E não apenas
setLanguage('pt'); // ❌ Sem await
```

#### 3. Checkpoints não Aparecem Corretamente
- Verifique se a API retorna os códigos esperados
- Confirme se a lógica de `determineCheckpointCount` está correta
- Verifique se as labels dos checkpoints estão nas traduções

#### 4. Navegação não Funciona
```typescript
// Use router.push corretamente
router.push({
  pathname: '/tracking-details',
  params: { trackingCode: 'ABC123' }
});
```

#### 5. TypeScript Errors após Mudanças
```bash
# Limpe o cache do TypeScript
npx tsc --build --clean
```

### Logs de Debug

Para debugar problemas:

```typescript
// Repository
console.log('Tracking data:', processedData);

// Localização
console.log('Current language:', language);
console.log('Translation key:', t.home.title);

// Navegação
console.log('Route params:', useLocalSearchParams());
```

### Performance

- **AsyncStorage** é assíncrono - sempre use `await`
- **Traduções** são carregadas uma vez no Context
- **Repository** cache automaticamente no AsyncStorage
- **Images** devem estar otimizadas para diferentes densidades

---

## 📝 Notas de Desenvolvimento

### Convenções de Código

1. **Nomenclatura:**
   - Componentes: `PascalCase`
   - Hooks: `useCamelCase`
   - Arquivos: `kebab-case` ou `PascalCase`

2. **Estrutura de Pastas:**
   - `/app` - Telas (Expo Router)
   - `/components` - Componentes reutilizáveis
   - `/data` - Lógica de dados (Repository Pattern)
   - `/hooks` - Hooks customizados
   - `/localization` - Sistema de traduções

3. **Imports:**
   - Absolute imports configurados no `tsconfig.json`
   - Use `@/` para imports de components

### Próximas Funcionalidades Sugeridas

1. **Notificações Push** quando status mudar
2. **Dark Mode** support
3. **Backup na nuvem** dos rastreamentos
4. **Histórico de mudanças** por rastreamento
5. **Export para PDF** dos detalhes
6. **Widget para home screen**

---

## 🚀 Deploy e Distribuição

### Usando EAS (Expo Application Services)

O projeto está configurado para deploy usando EAS, que oferece builds nativas e distribuição para App Store/Google Play.

#### Configuração Inicial
```bash
# 1. Instalar EAS CLI (já feito)
npm install -g eas-cli

# 2. Login no EAS
eas login

# 3. Inicializar projeto (já feito)
eas project:init
```

#### Profiles de Build Configurados

**`eas.json`:**
```json
{
  "cli": {
    "version": ">= 13.2.0"
  },
  "build": {
    "development": {
      "developmentClient": true,
      "distribution": "internal"
    },
    "preview": {
      "distribution": "internal"  
    },
    "production": {
      "autoIncrement": true
    }
  },
  "submit": {
    "production": {}
  }
}
```

#### Comandos de Build

```bash
# Build de desenvolvimento (para testar com Expo Dev Client)
eas build --profile development --platform all

# Build preview (para testes internos)
eas build --profile preview --platform all

# Build de produção
eas build --profile production --platform all

# Build apenas iOS
eas build --profile production --platform ios

# Build apenas Android
eas build --profile production --platform android
```

#### Processo de Deploy

1. **Desenvolvimento:**
   ```bash
   eas build --profile development --platform all
   # Instala Expo Dev Client no dispositivo
   # Usa QR code para conectar
   ```

2. **Testes Internos:**
   ```bash
   eas build --profile preview --platform all
   # Gera APK/IPA para distribuição interna
   # Compartilha link para download
   ```

3. **Produção:**
   ```bash
   # 1. Build para produção
   eas build --profile production --platform all
   
   # 2. Submit para stores
   eas submit --platform ios
   eas submit --platform android
   ```

#### Configurações Importantes

**Bundle Identifiers:**
- iOS: `com.yourcompany.parceltracker`
- Android: `com.yourcompany.parceltracker`

**Versioning:**
- `autoIncrement: true` no profile production
- Incrementa automaticamente build number
- Version string definida no `app.json`

#### Checklist Pré-Deploy

- [ ] ✅ **Bundle ID único** configurado
- [ ] ✅ **Ícones e splash screen** otimizados
- [ ] ✅ **Permissões** necessárias declaradas
- [ ] ✅ **Variáveis de ambiente** configuradas (se necessário)
- [ ] ✅ **Testes** em dispositivos físicos
- [ ] ✅ **Store listings** preparados (App Store/Google Play)

#### Monitoramento

```bash
# Ver builds em andamento
eas build:list

# Ver detalhes de um build específico  
eas build:view [BUILD_ID]

# Cancelar build
eas build:cancel [BUILD_ID]
```

#### Distribuição Interna

Para compartilhar builds de teste:

```bash
# Build preview gera link de download
eas build --profile preview --platform all

# Link será enviado por email
# Ou acesse: https://expo.dev/accounts/[username]/projects/[project]/builds
```

#### Troubleshooting Deploy

**Erro de Bundle ID:**
- Certifique que bundle IDs são únicos
- Não use nomes genéricos como `com.company.app`

**Build falha:**
- Verifique logs: `eas build:view [BUILD_ID]`
- Conflitos de dependências: `npm ci`
- Versões do Expo SDK incompatíveis

**Submit falha:**
- Certifique certificados Apple/Google válidos
- Screenshots e metadados da store completos
- Guidelines das stores respeitadas

---

## 🏁 Conclusão

Esta documentação cobre toda a arquitetura e funcionamento do app de rastreamento de pacotes. O sistema foi projetado para ser:

- ✅ **Escalável:** Fácil adicionar novos idiomas e funcionalidades
- ✅ **Manutenível:** Repository Pattern e separação clara de responsabilidades
- ✅ **Tipado:** TypeScript em todo o codebase
- ✅ **Offline-First:** Persistência local com AsyncStorage
- ✅ **Internacionalizado:** Sistema completo de traduções

Para dúvidas específicas, consulte o código-fonte ou esta documentação. Cada seção inclui exemplos práticos de uso e modificação.

---

**Criado em:** Janeiro 2025  
**Última Atualização:** Janeiro 2025  
**Versão da Documentação:** 1.0.0
