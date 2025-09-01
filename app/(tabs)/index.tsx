import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useHomeViewModel } from '../../data/viewModel/useHomeViewModel';

export default function HomeScreen() {
  const [inputValue, setInputValue] = useState("BF244397396MT")
  const { trackAndSave } = useHomeViewModel();
  const insets = useSafeAreaInsets();

  // Dispara busca ao finalizar edição
  const handleSubmit = async () => {
    if (inputValue.trim()) {
      await trackAndSave(inputValue.trim());
    }
  };

  return (
    <View>
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
      <View style={styles.container}>
        {/* ...outros conteúdos da tela... */}
      </View>
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
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
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
