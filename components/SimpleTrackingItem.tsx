import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export interface SimpleTrackingItemProps {
  trackingCode: string;
  status: string;
  date: string;
  isDelivered?: boolean;
  onPress?: () => void;
}

export const SimpleTrackingItem: React.FC<SimpleTrackingItemProps> = ({
  trackingCode,
  status,
  date,
  isDelivered = false,
  onPress,
}) => {
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

  return (
    <TouchableOpacity style={styles.container} onPress={handlePress} activeOpacity={0.7}>
      <View style={styles.content}>
        <View style={styles.iconContainer}>
          <Ionicons 
            name={isDelivered ? "checkmark-circle" : "cube-outline"} 
            size={24} 
            color={isDelivered ? "#4CAF50" : "#1976D2"} 
          />
        </View>
        
        <View style={styles.textContainer}>
          <Text style={styles.trackingCode}>{trackingCode}</Text>
          <Text style={[styles.status, isDelivered && styles.deliveredStatus]}>
            {status} • {date}
          </Text>
        </View>
        
        <Ionicons name="chevron-forward" size={20} color="#999" />
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginVertical: 4,
    marginHorizontal: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
  },
  iconContainer: {
    marginRight: 12,
  },
  textContainer: {
    flex: 1,
  },
  trackingCode: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  status: {
    fontSize: 14,
    color: '#666',
  },
  deliveredStatus: {
    color: '#4CAF50',
  },
});
