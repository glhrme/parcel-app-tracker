import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    RefreshControl,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ProcessedTracking } from '../data/types/processedTracking.type';
import { useHomeViewModel } from '../data/viewModel/useHomeViewModel';

export default function TrackingDetailsScreen() {
  const { trackingCode } = useLocalSearchParams<{ trackingCode: string }>();
  const [tracking, setTracking] = useState<ProcessedTracking | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const { getTrackingByCode, updateTracking } = useHomeViewModel();
  const insets = useSafeAreaInsets();

  useEffect(() => {
    loadTrackingDetails();
  }, [trackingCode]);

  const loadTrackingDetails = async () => {
    if (!trackingCode) return;
    
    try {
      const trackingData = await getTrackingByCode(trackingCode);
      setTracking(trackingData);
    } catch (error) {
      console.error('Erro ao carregar detalhes:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefresh = async () => {
    if (!trackingCode) return;
    
    setIsRefreshing(true);
    try {
      await updateTracking(trackingCode);
      await loadTrackingDetails();
    } catch (error) {
      console.error('Erro ao atualizar tracking:', error);
    } finally {
      setIsRefreshing(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getStatusIcon = (code: string) => {
    switch (code) {
      case 'EMI':
        return 'checkmark-circle';
      case 'TRA':
        return 'car';
      case 'RCE':
        return 'business';
      case 'SAI':
        return 'airplane';
      case 'CHE':
        return 'location';
      default:
        return 'ellipse';
    }
  };

  const getStatusColor = (code: string) => {
    switch (code) {
      case 'EMI':
        return '#4CAF50';
      case 'TRA':
        return '#2196F3';
      case 'RCE':
        return '#FF9800';
      case 'SAI':
        return '#9C27B0';
      case 'CHE':
        return '#607D8B';
      default:
        return '#757575';
    }
  };

  if (isLoading) {
    return (
      <View style={[styles.container, styles.centered]}>
        <ActivityIndicator size="large" color="#1976D2" />
        <Text style={styles.loadingText}>Carregando detalhes...</Text>
      </View>
    );
  }

  if (!tracking) {
    return (
      <View style={[styles.container, styles.centered]}>
        <Ionicons name="alert-circle" size={64} color="#F44336" />
        <Text style={styles.errorText}>Tracking não encontrado</Text>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Text style={styles.backButtonText}>Voltar</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + 16 }]}>
        <TouchableOpacity style={styles.backIcon} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Detalhes da Entrega</Text>
        <TouchableOpacity style={styles.refreshIcon} onPress={handleRefresh}>
          <Ionicons name="refresh" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.content}
        refreshControl={
          <RefreshControl refreshing={isRefreshing} onRefresh={handleRefresh} />
        }
      >
        {/* Informações Principais */}
        <View style={styles.mainInfo}>
          <Text style={styles.trackingCode}>{tracking.trackingCode}</Text>
          <Text style={styles.description}>{tracking.status}</Text>
          
          <View style={styles.locationRow}>
            <Ionicons name="location" size={16} color="#666" />
            <Text style={styles.location}>
              {tracking.fromLocation} → {tracking.toLocation}
            </Text>
          </View>
        </View>

        {/* Progresso dos Checkpoints */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Progresso da Entrega</Text>
          <View style={styles.progressContainer}>
            {tracking.checkPoints.map((checkpoint, index) => (
              <View key={index} style={styles.checkpointRow}>
                <View style={styles.checkpointIndicator}>
                  <View
                    style={[
                      styles.checkpointDot,
                      { backgroundColor: checkpoint.completed ? '#4CAF50' : '#E0E0E0' }
                    ]}
                  >
                    {checkpoint.completed && (
                      <Ionicons name="checkmark" size={12} color="#fff" />
                    )}
                  </View>
                  {index < tracking.checkPoints.length - 1 && (
                    <View
                      style={[
                        styles.checkpointLine,
                        { backgroundColor: checkpoint.completed ? '#4CAF50' : '#E0E0E0' }
                      ]}
                    />
                  )}
                </View>
                <View style={styles.checkpointContent}>
                  <Text
                    style={[
                      styles.checkpointTitle,
                      { color: checkpoint.completed ? '#333' : '#999' }
                    ]}
                  >
                    {checkpoint.title || `Checkpoint ${index + 1}`}
                  </Text>
                  <Text style={styles.checkpointDescription}>
                    {checkpoint.completed ? 'Concluído' : 'Pendente'}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* Histórico Completo de Movimentos */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Histórico Completo</Text>
          <View style={styles.movementsContainer}>
            {tracking.originalData.movements.map((movement, index) => (
              <View key={index} style={styles.movementItem}>
                <View style={styles.movementHeader}>
                  <View style={styles.movementIcon}>
                    <Ionicons
                      name={getStatusIcon(movement.code)}
                      size={20}
                      color={getStatusColor(movement.code)}
                    />
                  </View>
                  <View style={styles.movementInfo}>
                    <Text style={styles.movementTitle}>{movement.description}</Text>
                    <Text style={styles.movementDate}>
                      {formatDate(movement.date)}
                    </Text>
                  </View>
                </View>
                {movement.location && (
                  <Text style={styles.movementLocation}>{movement.location}</Text>
                )}
              </View>
            ))}
          </View>
        </View>

        {/* Informações Técnicas */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Informações Técnicas</Text>
          <View style={styles.technicalInfo}>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Código de Rastreamento:</Text>
              <Text style={styles.infoValue}>{tracking.trackingCode}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Status:</Text>
              <Text style={styles.infoValue}>{tracking.status}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Última Atualização:</Text>
              <Text style={styles.infoValue}>
                {formatDate(tracking.originalData.movements[0]?.date || '')}
              </Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Total de Movimentos:</Text>
              <Text style={styles.infoValue}>{tracking.originalData.movements.length}</Text>
            </View>
          </View>
        </View>
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
    paddingBottom: 16,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backIcon: {
    padding: 8,
  },
  refreshIcon: {
    padding: 8,
  },
  headerTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    flex: 1,
    textAlign: 'center',
    marginHorizontal: 16,
  },
  content: {
    flex: 1,
  },
  mainInfo: {
    backgroundColor: '#fff',
    padding: 20,
    marginBottom: 16,
  },
  trackingCode: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  description: {
    fontSize: 16,
    color: '#666',
    marginBottom: 12,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  location: {
    fontSize: 14,
    color: '#666',
    marginLeft: 8,
  },
  section: {
    backgroundColor: '#fff',
    marginBottom: 16,
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  progressContainer: {
    paddingLeft: 8,
  },
  checkpointRow: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  checkpointIndicator: {
    alignItems: 'center',
    marginRight: 16,
  },
  checkpointDot: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkpointLine: {
    width: 2,
    height: 30,
    marginTop: 4,
  },
  checkpointContent: {
    flex: 1,
  },
  checkpointTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  checkpointDescription: {
    fontSize: 14,
    color: '#666',
  },
  movementsContainer: {
    borderLeftWidth: 2,
    borderLeftColor: '#E0E0E0',
    paddingLeft: 16,
  },
  movementItem: {
    marginBottom: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  movementHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  movementIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    marginLeft: -24,
    borderWidth: 2,
    borderColor: '#fff',
  },
  movementInfo: {
    flex: 1,
  },
  movementTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  movementDate: {
    fontSize: 14,
    color: '#666',
  },
  movementLocation: {
    fontSize: 14,
    color: '#1976D2',
    marginTop: 4,
    marginLeft: 44,
  },
  technicalInfo: {
    backgroundColor: '#F8F9FA',
    padding: 16,
    borderRadius: 8,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  infoLabel: {
    fontSize: 14,
    color: '#666',
    flex: 1,
  },
  infoValue: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
    flex: 1,
    textAlign: 'right',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
  },
  errorText: {
    marginTop: 16,
    fontSize: 18,
    color: '#F44336',
    textAlign: 'center',
  },
  backButton: {
    marginTop: 24,
    backgroundColor: '#1976D2',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  backButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
});
