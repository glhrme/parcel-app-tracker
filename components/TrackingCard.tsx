import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useLocalization } from '../hooks/useLocalization';

export interface CheckPoint {
  completed: boolean;
  title?: string;
}

export interface TrackingCardProps {
  trackingCode: string;
  status: string;
  date: string;
  fromLocation: string;
  toLocation: string;
  checkPoints: CheckPoint[];
  onPress?: () => void;
}

export const TrackingCard: React.FC<TrackingCardProps> = ({
  trackingCode,
  status,
  date,
  fromLocation,
  toLocation,
  checkPoints,
  onPress,
}) => {
  const { t } = useLocalization();

  const handlePress = () => {
    if (onPress) {
      onPress();
    } else {
      router.push({
        pathname: '/tracking-details',
        params: { trackingCode }
      });
    }
  };

  // Função para localizar o título do checkpoint
  const getLocalizedCheckpointTitle = (title?: string): string => {
    if (!title) return '';
    
    // Mapeia as chaves de localização
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

  return (
    <TouchableOpacity style={styles.card} onPress={handlePress} activeOpacity={0.7}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Ionicons name="cube-outline" size={24} color="#666" />
          <View style={styles.headerText}>
            <Text style={styles.trackingCode}>{trackingCode}</Text>
            <Text style={styles.status}>{status} • {date}</Text>
          </View>
        </View>
        {onPress && (
          <Ionicons name="chevron-forward" size={24} color="#666" />
        )}
      </View>

      {/* Progress Bar */}
      <View style={styles.progressContainer}>
        <View style={styles.progressLine}>
          {checkPoints.map((checkpoint, index) => (
            <React.Fragment key={index}>
              {/* Checkpoint Circle */}
              <View
                style={[
                  styles.checkpoint,
                  checkpoint.completed
                    ? styles.checkpointCompleted
                    : styles.checkpointPending,
                ]}
              >
                {checkpoint.completed && (
                  <Ionicons name="checkmark" size={12} color="#fff" />
                )}
              </View>
              
              {/* Line between checkpoints */}
              {index < checkPoints.length - 1 && (
                <View
                  style={[
                    styles.line,
                    checkPoints[index + 1].completed
                      ? styles.lineCompleted
                      : styles.linePending,
                  ]}
                />
              )}
            </React.Fragment>
          ))}
        </View>
      </View>

      {/* Locations */}
      <View style={styles.locations}>
        <View style={styles.location}>
          <Text style={styles.locationLabel}>{t.common.from}</Text>
          <Text style={styles.locationText}>{fromLocation}</Text>
        </View>
        <View style={styles.location}>
          <Text style={styles.locationLabel}>{t.common.to}</Text>
          <Text style={styles.locationText}>{toLocation}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    marginHorizontal: 16,
    marginVertical: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#E3F2FD',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  headerText: {
    marginLeft: 12,
    flex: 1,
  },
  trackingCode: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  status: {
    fontSize: 14,
    color: '#666',
  },
  progressContainer: {
    marginBottom: 20,
  },
  progressLine: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkpoint: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
  },
  checkpointCompleted: {
    backgroundColor: '#1976D2',
    borderColor: '#1976D2',
  },
  checkpointPending: {
    backgroundColor: '#fff',
    borderColor: '#E0E0E0',
  },
  line: {
    flex: 1,
    height: 2,
    marginHorizontal: 4,
  },
  lineCompleted: {
    backgroundColor: '#1976D2',
  },
  linePending: {
    backgroundColor: '#E0E0E0',
    borderStyle: 'dashed',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    height: 1,
  },
  locations: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  location: {
    flex: 1,
  },
  locationLabel: {
    fontSize: 12,
    color: '#999',
    marginBottom: 4,
  },
  locationText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
  },
});
