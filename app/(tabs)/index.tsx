import { useHomeViewModel } from '@/data/viewModel/useHomeViewModel';
import { useCallback, useState } from 'react';
import { StyleSheet, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function HomeScreen() {
  const { search } = useHomeViewModel()
  const [inputValue, setInputValue] = useState("BF244244435MT")

  const onSubmit = useCallback(() => {
    console.log(search(inputValue))
  }, [inputValue])

  return (
      <SafeAreaView>
        <View style={styles.container}>
          <TextInput style={styles.input} placeholder='Tracking Code' value={inputValue} onChangeText={setInputValue} onSubmitEditing={onSubmit} />

        </View>
      </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  input: {
    padding: 8,
    borderColor: '#000000',
    borderWidth: 1
  },
  container: {
    padding: 16
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
