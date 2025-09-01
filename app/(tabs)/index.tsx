import { TrackingCard } from '@/components/TrackingCard';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ProcessedTracking } from '../../data/types/processedTracking.type';
import { useHomeViewModel } from '../../data/viewModel/useHomeViewModel';

export default function HomeScreen() {
  const [inputValue, setInputValue] = useState("CNSTA100786058MT");
  const [recentTrackings, setRecentTrackings] = useState<ProcessedTracking[]>([]);
  const [isUpdating, setIsUpdating] = useState(false);
  const { trackAndSave, getRecentTrackings, trackAndSave: updateTracking } = useHomeViewModel();
  const insets = useSafeAreaInsets();

  // Carrega os 2 mais recentes do localStorage ao entrar
  useEffect(() => {
    loadRecentTrackings();
    // Descomente a linha abaixo para limpar o localStorage (apenas uma vez)
    // clearAllStorage();
  }, []);

  // FUNÇÃO PARA LIMPAR TODO O LOCALSTORAGE - USE APENAS QUANDO NECESSÁRIO
  const clearAllStorage = async () => {
    try {
      await AsyncStorage.clear();
      console.log('LocalStorage limpo com sucesso!');
      Alert.alert('Sucesso', 'Todos os dados foram removidos do localStorage');
      setRecentTrackings([]);
    } catch (error) {
      console.error('Erro ao limpar localStorage:', error);
      Alert.alert('Erro', 'Falha ao limpar localStorage');
    }
  };

  const loadRecentTrackings = async () => {
    try {
      const recent = await getRecentTrackings(2);
      setRecentTrackings(recent);
      
      // Atualiza em background se houver trackings
      if (recent.length > 0) {
        updateTrackingsInBackground(recent);
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
        updateTracking(tracking.trackingCode)
      );
      
      const updatedTrackings = await Promise.all(updatePromises);
      
      // Remove duplicatas ao atualizar
      const uniqueTrackings = updatedTrackings.filter((tracking, index, self) =>
        index === self.findIndex(t => t.trackingCode === tracking.trackingCode)
      );
      
      setRecentTrackings(uniqueTrackings.slice(0, 2));
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
        const newTracking = await trackAndSave(inputValue.trim());
        
        // Remove duplicatas e adiciona o novo no início
        setRecentTrackings(prev => {
          const filteredTrackings = prev.filter(
            tracking => tracking.trackingCode !== newTracking.trackingCode
          );
          return [newTracking, ...filteredTrackings].slice(0, 2);
        });
        
        setInputValue("");
      } catch (error) {
        console.error('Erro ao buscar tracking:', error);
      }
    }
  };

  useEffect(() => {
    console.log(recentTrackings)
  }, [recentTrackings]);

  return (
    <View style={{ flex: 1 }}>
      <View style={[styles.header, { paddingTop: insets.top + 32 }]}> 
        <Text style={styles.headerTitle}>Let's Track Your Package</Text>
        <View style={styles.searchBox}>
          <Ionicons name="search" size={24} color="#A0A0A0" style={styles.searchIcon} />
          <TextInput
            style={styles.input}
            placeholder='Enter your tracking number'
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
            <Text style={styles.updateText}>Atualizando...</Text>
          </View>
        )}

        {/* Lista dos trackings recentes */}
        {recentTrackings.length > 0 ? (
          recentTrackings.map((tracking, index) => (
            <TrackingCard
              key={tracking.trackingCode}
              trackingCode={tracking.trackingCode}
              status={tracking.originalData.movements[0].description}
              date={tracking.originalData.movements[0].date}
              fromLocation={tracking.fromLocation}
              toLocation={tracking.toLocation}
              checkPoints={tracking.checkPoints}
              onPress={() => console.log('Card pressed:', tracking.trackingCode)}
            />
          ))
        ) : (
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>Nenhum tracking encontrado</Text>
            <Text style={styles.emptySubText}>Adicione um código de rastreamento acima</Text>
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
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#222',
    paddingVertical: 4,
    backgroundColor: 'transparent',
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: 'absolute',
  },
});
