import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import {
    Alert,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useLocalization } from '../../hooks/useLocalization';
import { Language, languages } from '../../localization';

export default function SettingsScreen() {
  const { t, language, setLanguage } = useLocalization();
  const [isChangingLanguage, setIsChangingLanguage] = useState(false);
  const insets = useSafeAreaInsets();

  const handleLanguageChange = (newLanguage: Language) => {
    Alert.alert(
      t.settings.language,
      `${t.common.save} ${languages.find(l => l.code === newLanguage)?.nativeName}?`,
      [
        { text: t.common.cancel, style: 'cancel' },
        {
          text: t.common.save,
          onPress: async () => {
            setIsChangingLanguage(true);
            try {
              await setLanguage(newLanguage);
            } catch (error) {
              console.error('Error changing language:', error);
            } finally {
              setIsChangingLanguage(false);
            }
          },
        },
      ]
    );
  };

  const handleLoginPress = () => {
    Alert.alert(
      t.settings.comingSoon,
      t.settings.loginDescription,
      [{ text: t.common.ok }]
    );
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + 16 }]}>
        <Text style={styles.headerTitle}>{t.settings.title}</Text>
      </View>

      <ScrollView style={styles.content} contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + 100 }]}>
        {/* Language Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons name="language" size={24} color="#1976D2" />
            <View style={styles.sectionHeaderText}>
              <Text style={styles.sectionTitle}>{t.settings.language}</Text>
              <Text style={styles.sectionDescription}>{t.settings.languageDescription}</Text>
            </View>
          </View>
          
          <View style={styles.optionsList}>
            {languages.map((lang) => (
              <TouchableOpacity
                key={lang.code}
                style={[
                  styles.languageOption,
                  language === lang.code && styles.languageOptionSelected,
                ]}
                onPress={() => handleLanguageChange(lang.code)}
                disabled={isChangingLanguage}
              >
                <View style={styles.languageInfo}>
                  <Text
                    style={[
                      styles.languageName,
                      language === lang.code && styles.languageNameSelected,
                    ]}
                  >
                    {lang.nativeName}
                  </Text>
                  <Text
                    style={[
                      styles.languageSubname,
                      language === lang.code && styles.languageSubnameSelected,
                    ]}
                  >
                    {lang.name}
                  </Text>
                </View>
                {language === lang.code && (
                  <Ionicons name="checkmark" size={20} color="#1976D2" />
                )}
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Account Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons name="person" size={24} color="#1976D2" />
            <View style={styles.sectionHeaderText}>
              <Text style={styles.sectionTitle}>{t.settings.account}</Text>
            </View>
          </View>
          
          <TouchableOpacity style={styles.option} onPress={handleLoginPress}>
            <View style={styles.optionContent}>
              <View style={styles.optionInfo}>
                <Text style={styles.optionTitle}>{t.settings.loginTitle}</Text>
                <Text style={styles.optionDescription}>{t.settings.loginDescription}</Text>
              </View>
              <View style={styles.optionRight}>
                <Text style={styles.comingSoonBadge}>{t.settings.comingSoon}</Text>
                <Ionicons name="chevron-forward" size={20} color="#C0C0C0" />
              </View>
            </View>
          </TouchableOpacity>
        </View>

        {/* About Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons name="information-circle" size={24} color="#1976D2" />
            <View style={styles.sectionHeaderText}>
              <Text style={styles.sectionTitle}>{t.settings.about}</Text>
            </View>
          </View>
          
          <View style={styles.aboutContent}>
            <View style={styles.aboutRow}>
              <Text style={styles.aboutLabel}>{t.settings.version}</Text>
              <Text style={styles.aboutValue}>1.0.0</Text>
            </View>
            <Text style={styles.madeWith}>{t.settings.madeWith}</Text>
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
  header: {
    backgroundColor: '#1976D2',
    paddingBottom: 20,
    paddingHorizontal: 16,
  },
  headerTitle: {
    color: '#fff',
    fontSize: 28,
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: 20,
    paddingBottom: 40,
  },
  section: {
    backgroundColor: '#fff',
    marginBottom: 20,
    marginHorizontal: 16,
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionHeaderText: {
    marginLeft: 12,
    flex: 1,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 2,
  },
  sectionDescription: {
    fontSize: 14,
    color: '#666',
  },
  optionsList: {
    gap: 8,
  },
  languageOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: '#F8F9FA',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  languageOptionSelected: {
    backgroundColor: '#E3F2FD',
    borderColor: '#1976D2',
  },
  languageInfo: {
    flex: 1,
  },
  languageName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 2,
  },
  languageNameSelected: {
    color: '#1976D2',
  },
  languageSubname: {
    fontSize: 14,
    color: '#666',
  },
  languageSubnameSelected: {
    color: '#1976D2',
  },
  option: {
    paddingVertical: 4,
  },
  optionContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  optionInfo: {
    flex: 1,
  },
  optionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  optionDescription: {
    fontSize: 14,
    color: '#666',
  },
  optionRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  comingSoonBadge: {
    fontSize: 12,
    fontWeight: '500',
    color: '#FF9800',
    backgroundColor: '#FFF3E0',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  aboutContent: {
    paddingTop: 8,
  },
  aboutRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  aboutLabel: {
    fontSize: 16,
    color: '#666',
  },
  aboutValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  madeWith: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    fontStyle: 'italic',
  },
});
