import { SimpleTrackingItem } from '@/components/SimpleTrackingItem';
import { TrackingCard } from '@/components/TrackingCard';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ProcessedTracking } from '../../data/types/processedTracking.type';
import { useHomeViewModel } from '../../data/viewModel/useHomeViewModel';
import { useLocalization } from '../../hooks/useLocalization';

export default function HomeScreen() {
  const [inputValue, setInputValue] = useState("");
  const [allTrackings, setAllTrackings] = useState<ProcessedTracking[]>([]);
  const [isUpdating, setIsUpdating] = useState(false);
  const { trackAndSave, getAllTrackings } = useHomeViewModel();
  const { t } = useLocalization();
  const insets = useSafeAreaInsets();

  // Verifica se um tracking foi entregue
  const isDelivered = (tracking: ProcessedTracking): boolean => {
    const hasDeliveryCode = tracking.originalData.movements.some(m => m.code === 'EMI');
    const allCheckpointsCompleted = tracking.checkPoints.every(cp => cp.completed);
    return hasDeliveryCode || allCheckpointsCompleted;
  };

  // Separa trackings em categorias
  const currentShipment = allTrackings.find(tracking => !isDelivered(tracking));
  const otherShipments = allTrackings.filter(tracking => 
    tracking !== currentShipment
  ).slice(0, 2);

  // Carrega todos os trackings ao entrar
  useEffect(() => {
    loadAllTrackings();
  }, []);

  // FUNÇÃO PARA LIMPAR TODO O LOCALSTORAGE - USE APENAS QUANDO NECESSÁRIO
  const clearAllStorage = async () => {
    try {
      await AsyncStorage.clear();
      console.log('LocalStorage limpo com sucesso!');
      Alert.alert(t.common.success, 'Todos os dados foram removidos do localStorage');
      setAllTrackings([]);
    } catch (error) {
      console.error('Erro ao limpar localStorage:', error);
      Alert.alert(t.common.error, 'Falha ao limpar localStorage');
    }
  };

  const loadAllTrackings = async () => {
    try {
      const trackings = await getAllTrackings();
      setAllTrackings(trackings);
      
      // Atualiza em background se houver trackings
      if (trackings.length > 0) {
        updateTrackingsInBackground(trackings);
      }
    } catch (error) {
      console.error('Erro ao carregar trackings:', error);
    }
  };

  // Atualiza os trackings em background
  const updateTrackingsInBackground = async (trackings: ProcessedTracking[]) => {
    setIsUpdating(true);
    try {
      const updatePromises = trackings.map(tracking => 
        trackAndSave(tracking.trackingCode)
      );
      
      const updatedTrackings = await Promise.all(updatePromises);
      setAllTrackings(updatedTrackings);
    } catch (error) {
      console.error('Erro ao atualizar trackings:', error);
    } finally {
      setIsUpdating(false);
    }
  };

  // Dispara busca ao finalizar edição
  const handleSubmit = async () => {
    if (inputValue.trim()) {
      try {
        await trackAndSave(inputValue.trim());
        setInputValue("");
        // Recarrega lista completa
        loadAllTrackings();
      } catch (error) {
        console.error('Erro ao buscar tracking:', error);
      }
    }
  };

  const handleViewAllPress = () => {
    router.push('/(tabs)/your-shipments');
  };

  const handleTrackingPress = (trackingCode: string) => {
    router.push({
      pathname: '/tracking-details',
      params: { trackingCode }
    });
  };

  return (
    <View style={{ flex: 1 }}>
      <View style={[styles.header, { paddingTop: insets.top + 32 }]}> 
        <Text style={styles.headerTitle}>{t.home.title}</Text>
        <View style={styles.searchBox}>
          <Ionicons name="search" size={24} color="#A0A0A0" style={styles.searchIcon} />
          <TextInput
            style={styles.input}
            placeholder={t.home.searchPlaceholder}
            placeholderTextColor="#666"
            value={inputValue}
            onChangeText={setInputValue}
            onSubmitEditing={handleSubmit}
            returnKeyType="done"
          />
        </View>
      </View>

      <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
        {/* Indicador de atualização */}
        {isUpdating && (
          <View style={styles.updateIndicator}>
            <ActivityIndicator size="small" color="#1976D2" />
            <Text style={styles.updateText}>{t.home.updating}</Text>
          </View>
        )}

        {/* Current Shipment Section */}
        {currentShipment && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>{t.home.currentShipment}</Text>
              <TouchableOpacity onPress={handleViewAllPress}>
                <Text style={styles.viewAllText}>{t.home.viewAll}</Text>
              </TouchableOpacity>
            </View>
            <TrackingCard
              trackingCode={currentShipment.trackingCode}
              status={currentShipment.status}
              date={currentShipment.date}
              fromLocation={currentShipment.fromLocation}
              toLocation={currentShipment.toLocation}
              checkPoints={currentShipment.checkPoints}
              onPress={() => handleTrackingPress(currentShipment.trackingCode)}
            />
          </View>
        )}

        {/* Your Shipments Section */}
        {otherShipments.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>{t.home.yourShipments}</Text>
              <TouchableOpacity onPress={handleViewAllPress}>
                <Text style={styles.viewAllText}>{t.home.viewAll}</Text>
              </TouchableOpacity>
            </View>
            {otherShipments.map((tracking) => (
              <SimpleTrackingItem
                key={tracking.trackingCode}
                trackingCode={tracking.trackingCode}
                status={tracking.originalData.movements[0].description}
                date={tracking.originalData.movements[0].date}
                isDelivered={isDelivered(tracking)}
                onPress={() => handleTrackingPress(tracking.trackingCode)}
              />
            ))}
          </View>
        )}

        {/* Empty State */}
        {!currentShipment && otherShipments.length === 0 && (
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>{t.home.emptyTitle}</Text>
            <Text style={styles.emptySubText}>{t.home.emptySubtitle}</Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  input: {
    flex: 1,
    padding: 8,
    backgroundColor: 'transparent',
    fontSize: 16,
    color: '#222',
  },
  header: {
    backgroundColor: '#1976D2',
    paddingTop: 48,
    paddingBottom: 32,
    paddingHorizontal: 16,
    alignItems: 'center',
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  headerTitle: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 24,
    textAlign: 'center',
  },
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollContent: {
    paddingTop: 16,
    paddingBottom: 32,
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
    width: '100%',
    maxWidth: 400,
    marginTop: 32,
  },
  searchIcon: {
    marginRight: 8,
  },
  updateIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#E3F2FD',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginHorizontal: 16,
    marginBottom: 16,
  },
  updateText: {
    marginLeft: 8,
    fontSize: 14,
    color: '#1976D2',
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
  },
  viewAllText: {
    fontSize: 16,
    color: '#1976D2',
    fontWeight: '500',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 64,
    paddingHorizontal: 32,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#666',
    marginBottom: 8,
    textAlign: 'center',
  },
  emptySubText: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
  },
});
