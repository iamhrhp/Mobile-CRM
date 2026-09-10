import { useTranslation } from 'react-i18next';

export const useCurrency = () => {
  const { i18n } = useTranslation();
  // List of major Indian languages
  const indianLangs = ['hi', 'bn', 'te', 'mr', 'ta', 'gu', 'ur', 'kn', 'or', 'ml', 'pa', 'as', 'ma'];
  const langCode = i18n.language?.split('-')[0]?.toLowerCase();
  
  const isIndian = indianLangs.includes(langCode);
  return isIndian ? '₹' : '$';
};
