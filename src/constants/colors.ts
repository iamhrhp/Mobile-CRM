export type ThemeColors = {
  primary: string;
  limeAccent: string;
  limeLight: string;
  background: string;
  cardBackground: string;
  secondaryBackground: string;
  textPrimary: string;
  textSecondary: string;
  textMuted: string;
  success: string;
  danger: string;
  notificationDot: string;
  chartBar: string;
  chartBarActive: string;
  gridLine: string;
  border: string;
  progressInactive: string;
  progressDot: string;
  tickItem: string;
};

export const lightTheme: ThemeColors = {
  primary: '#111318',
  limeAccent: '#B4F718',
  limeLight: '#F3FCD0',
  background: '#F4F5F7',
  cardBackground: '#FFFFFF',
  secondaryBackground: '#F7F8FA',
  textPrimary: '#111318',
  textSecondary: '#8E929F',
  textMuted: '#A0A3BD',
  success: '#34C759',
  danger: '#FF453A',
  notificationDot: '#FF3B30',
  chartBar: '#23262F',
  chartBarActive: '#111318',
  gridLine: '#F0F2F5',
  border: '#F0F2F5',
  progressInactive: '#E5E7EB',
  progressDot: '#D4D7DE',
  tickItem: '#D1D5DB',
};

export const darkTheme: ThemeColors = {
  primary: '#FFFFFF',
  limeAccent: '#B4F718', // Keep same brand accent
  limeLight: '#2C3A04', // Darker shade for contrast
  background: '#121212', // Deep dark
  cardBackground: '#1E1E1E', // Slightly elevated dark
  secondaryBackground: '#181818',
  textPrimary: '#FFFFFF',
  textSecondary: '#A1A1AA',
  textMuted: '#71717A',
  success: '#30D158', // iOS dark mode green
  danger: '#FF453A', // iOS dark mode red
  notificationDot: '#FF453A',
  chartBar: '#3A3A3C',
  chartBarActive: '#FFFFFF',
  gridLine: '#2C2C2E',
  border: '#2C2C2E',
  progressInactive: '#3A3A3C',
  progressDot: '#48484A',
  tickItem: '#48484A',
};

// Fallback for non-refactored files (so app doesn't break instantly)
export const colors = lightTheme;
export default colors;
