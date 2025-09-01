import { en } from './en';
import { mt } from './mt';
import { pt } from './pt';

export type Language = 'en' | 'mt' | 'pt';
export type TranslationKeys = typeof en;

export const translations = {
  en,
  mt,
  pt,
};

export const languages = [
  { code: 'en' as Language, name: 'English', nativeName: 'English' },
  { code: 'mt' as Language, name: 'Maltese', nativeName: 'Malti' },
  { code: 'pt' as Language, name: 'Portuguese', nativeName: 'Português' },
];

export const defaultLanguage: Language = 'en';
