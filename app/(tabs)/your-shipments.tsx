import { SimpleTrackingItem } from '@/components/SimpleTrackingItem';
import { TrackingCard } from '@/components/TrackingCard';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ProcessedTracking } from '../../data/types/processedTracking.type';
import { useHomeViewModel } from '../../data/viewModel/useHomeViewModel';
import { useLocalization } from '../../hooks/useLocalization';

export default function YourShipmentsScreen() {
  const [allTrackings, setAllTrackings] = useState<ProcessedTracking[]>([]);
  const [filteredTrackings, setFilteredTrackings] = useState<ProcessedTracking[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'pending' | 'delivered'>('all');
  const { getAllTrackings } = useHomeViewModel();
  const { t } = useLocalization();
  const insets = useSafeAreaInsets();

  // Verifica se um tracking foi entregue
  const isDelivered = (tracking: ProcessedTracking): boolean => {
    const hasDeliveryCode = tracking.originalData.movements.some(m => m.code === 'EMI');
    const allCheckpointsCompleted = tracking.checkPoints.every(cp => cp.completed);
    return hasDeliveryCode || allCheckpointsCompleted;
  };

  useEffect(() => {
    loadTrackings();
  }, []);

  useEffect(() => {
    filterTrackings();
  }, [allTrackings, searchQuery, selectedFilter]);

  const loadTrackings = async () => {
    try {
      const trackings = await getAllTrackings();
      setAllTrackings(trackings);
    } catch (error) {
      console.error('Erro ao carregar trackings:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await loadTrackings();
    setIsRefreshing(false);
  };

  const filterTrackings = () => {
    let filtered = allTrackings;

    // Filtro por texto
    if (searchQuery.trim()) {
      filtered = filtered.filter(tracking =>
        tracking.trackingCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tracking.status.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tracking.fromLocation.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tracking.toLocation.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Filtro por status
    if (selectedFilter === 'pending') {
      filtered = filtered.filter(tracking => !isDelivered(tracking));
    } else if (selectedFilter === 'delivered') {
      filtered = filtered.filter(tracking => isDelivered(tracking));
    }

    setFilteredTrackings(filtered);
  };

  const handleTrackingPress = (trackingCode: string) => {
    router.push({
      pathname: '/tracking-details',
      params: { trackingCode }
    });
  };

  const getFilterStats = () => {
    const pending = allTrackings.filter(t => !isDelivered(t)).length;
    const delivered = allTrackings.filter(t => isDelivered(t)).length;
    return { total: allTrackings.length, pending, delivered };
  };

  const stats = getFilterStats();

  if (isLoading) {
    return (
      <View style={[styles.container, styles.centered]}>
        <ActivityIndicator size="large" color="#1976D2" />
        <Text style={styles.loadingText}>{t.yourShipments.loadingText}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + 16 }]}>
        <Text style={styles.headerTitle}>{t.yourShipments.title}</Text>
        <Text style={styles.headerSubtitle}>
          {t.yourShipments.shipmentCount(stats.total)} • {t.yourShipments.pendingCount(stats.pending)} • {t.yourShipments.deliveredCount(stats.delivered)}
        </Text>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBox}>
          <Ionicons name="search" size={20} color="#A0A0A0" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder={t.yourShipments.searchPlaceholder}
            placeholderTextColor="#A0A0A0"
            value={searchQuery}
            onChangeText={setSearchQuery}
            returnKeyType="search"
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')} style={styles.clearButton}>
              <Ionicons name="close-circle" size={20} color="#A0A0A0" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Filter Tabs */}
      <View style={styles.filterContainer}>
        <TouchableOpacity
          style={[styles.filterButton, selectedFilter === 'all' && styles.filterButtonActive]}
          onPress={() => setSelectedFilter('all')}
        >
          <Text style={[styles.filterText, selectedFilter === 'all' && styles.filterTextActive]}>
            {t.yourShipments.filterAll} ({stats.total})
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.filterButton, selectedFilter === 'pending' && styles.filterButtonActive]}
          onPress={() => setSelectedFilter('pending')}
        >
          <Text style={[styles.filterText, selectedFilter === 'pending' && styles.filterTextActive]}>
            {t.yourShipments.filterPending} ({stats.pending})
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.filterButton, selectedFilter === 'delivered' && styles.filterButtonActive]}
          onPress={() => setSelectedFilter('delivered')}
        >
          <Text style={[styles.filterText, selectedFilter === 'delivered' && styles.filterTextActive]}>
            {t.yourShipments.filterDelivered} ({stats.delivered})
          </Text>
        </TouchableOpacity>
      </View>

      {/* Content */}
      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl refreshing={isRefreshing} onRefresh={handleRefresh} />
        }
      >
        {filteredTrackings.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="cube-outline" size={64} color="#D0D0D0" />
            <Text style={styles.emptyTitle}>
              {searchQuery.trim() || selectedFilter !== 'all' 
                ? t.yourShipments.emptySearchTitle
                : t.yourShipments.emptyTitle
              }
            </Text>
            <Text style={styles.emptySubtitle}>
              {searchQuery.trim() 
                ? t.yourShipments.emptySearchSubtitle
                : selectedFilter !== 'all'
                ? t.yourShipments.emptyFilterSubtitle
                : t.yourShipments.emptySubtitle
              }
            </Text>
          </View>
        ) : (
          <View style={styles.trackingsList}>
            {filteredTrackings.map((tracking, index) => {
              const delivered = isDelivered(tracking);
              
              // Primeiro item não entregue será mostrado como card completo
              if (!delivered && index === 0 && selectedFilter === 'all') {
                return (
                  <View key={tracking.trackingCode} style={styles.featuredCard}>
                    <Text style={styles.featuredLabel}>{t.yourShipments.inTransit}</Text>
                    <TrackingCard
                      trackingCode={tracking.trackingCode}
                      status={tracking.status}
                      date={tracking.date}
                      fromLocation={tracking.fromLocation}
                      toLocation={tracking.toLocation}
                      checkPoints={tracking.checkPoints}
                      onPress={() => handleTrackingPress(tracking.trackingCode)}
                    />
                  </View>
                );
              }

              // Outros itens como lista simples
              return (
                <SimpleTrackingItem
                  key={tracking.trackingCode}
                  trackingCode={tracking.trackingCode}
                  status={tracking.status}
                  date={tracking.date}
                  isDelivered={delivered}
                  onPress={() => handleTrackingPress(tracking.trackingCode)}
                />
              );
            })}
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  centered: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    backgroundColor: '#1976D2',
    paddingBottom: 20,
    paddingHorizontal: 16,
  },
  headerTitle: {
    color: '#fff',
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  headerSubtitle: {
    color: '#BBE1FF',
    fontSize: 14,
  },
  searchContainer: {
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  clearButton: {
    padding: 4,
  },
  filterContainer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  filterButton: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginHorizontal: 4,
    borderRadius: 20,
    backgroundColor: '#F5F5F5',
    alignItems: 'center',
  },
  filterButtonActive: {
    backgroundColor: '#1976D2',
  },
  filterText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#666',
  },
  filterTextActive: {
    color: '#fff',
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  trackingsList: {
    paddingTop: 16,
  },
  featuredCard: {
    marginBottom: 20,
    paddingHorizontal: 16,
  },
  featuredLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1976D2',
    marginBottom: 12,
    paddingHorizontal: 4,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 80,
    paddingHorizontal: 32,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
    marginTop: 16,
    marginBottom: 8,
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 22,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
  },
});
