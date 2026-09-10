import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, Animated } from 'react-native';
import { GoogleIcon } from '../components/icons/GoogleIcon';
import { Owl } from '../components/Owl';
import { ThemeColors } from '../constants/colors';
import { useTheme } from '../context/ThemeContext';

interface SignUpScreenProps {
  onSignUp: () => void;
  onNavigateLogin: () => void;
}

const SignUpScreen: React.FC<SignUpScreenProps> = ({ onSignUp, onNavigateLogin }) => {
  const { colors, isDark } = useTheme();
  const styles = getStyles(colors, isDark);
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isPasswordFocused, setIsPasswordFocused] = useState(false);

  const fadeAnim = React.useRef(new Animated.Value(0)).current;
  const slideAnim = React.useRef(new Animated.Value(20)).current;

  React.useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      })
    ]).start();
  }, []);

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <Animated.View style={[styles.content, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
        
        <View style={styles.headerContainer}>
          <Text style={styles.title}>Create account</Text>
          <Text style={styles.subtitle}>Start closing more deals today.</Text>
        </View>

        <View style={styles.cardWrapper}>
          <View style={styles.owlWrapper}>
            <Owl isPasswordFocused={isPasswordFocused} />
          </View>

          <View style={styles.formContainer}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Full Name</Text>
              <TextInput 
                style={styles.input}
                placeholder="Enter your name"
                placeholderTextColor={colors.textMuted}
                autoCapitalize="words"
                value={name}
                onChangeText={setName}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Email</Text>
              <TextInput 
                style={styles.input}
                placeholder="Enter your email"
                placeholderTextColor={colors.textMuted}
                keyboardType="email-address"
                autoCapitalize="none"
                value={email}
                onChangeText={setEmail}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Password</Text>
              <TextInput 
                style={styles.input}
                placeholder="Create a password"
                placeholderTextColor={colors.textMuted}
                secureTextEntry
                value={password}
                onChangeText={setPassword}
                onFocus={() => setIsPasswordFocused(true)}
                onBlur={() => setIsPasswordFocused(false)}
              />
            </View>

            <TouchableOpacity activeOpacity={0.8} style={styles.primaryButton} onPress={onSignUp}>
              <Text style={styles.primaryButtonText}>Sign up</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.dividerContainer}>
          <View style={styles.dividerLine} />
          <Text style={styles.dividerText}>OR</Text>
          <View style={styles.dividerLine} />
        </View>

        <TouchableOpacity activeOpacity={0.8} style={styles.googleButton} onPress={onSignUp}>
          <GoogleIcon size={20} />
          <Text style={styles.googleButtonText}>Sign up with Google</Text>
        </TouchableOpacity>

        <View style={styles.footerContainer}>
          <Text style={styles.footerText}>Already have an account? </Text>
          <TouchableOpacity onPress={onNavigateLogin}>
            <Text style={styles.footerLink}>Log in</Text>
          </TouchableOpacity>
        </View>

      </Animated.View>
    </KeyboardAvoidingView>
  );
};

const getStyles = (colors: ThemeColors, isDark: boolean) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    justifyContent: 'center',
  },
  content: {
    paddingHorizontal: 24,
    maxWidth: 500,
    width: '100%',
    alignSelf: 'center',
  },
  headerContainer: {
    marginBottom: 40,
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    color: colors.textPrimary,
    marginBottom: 8,
    letterSpacing: -1,
  },
  subtitle: {
    fontSize: 16,
    color: colors.textSecondary,
    lineHeight: 24,
  },
  cardWrapper: {
    position: 'relative',
    paddingTop: 80, // Space for owl above the card
  },
  owlWrapper: {
    position: 'absolute',
    top: 5,
    alignSelf: 'center',
    zIndex: 1,
  },
  formContainer: {
    gap: 20,
    backgroundColor: colors.cardBackground,
    borderRadius: 24,
    padding: 24,
    zIndex: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.05,
    shadowRadius: 20,
    elevation: 5,
  },
  inputGroup: {
    gap: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  input: {
    backgroundColor: colors.cardBackground,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 18,
    fontSize: 16,
    color: colors.textPrimary,
  },
  primaryButton: {
    backgroundColor: colors.primary,
    borderRadius: 16,
    paddingVertical: 18,
    alignItems: 'center',
    marginTop: 8,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 4,
  },
  primaryButtonText: {
    color: isDark ? '#111318' : '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 32,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: colors.border,
  },
  dividerText: {
    paddingHorizontal: 16,
    fontSize: 14,
    color: colors.textMuted,
    fontWeight: '600',
  },
  googleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.cardBackground,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 16,
    paddingVertical: 18,
    gap: 12,
  },
  googleButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  footerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 32,
  },
  footerText: {
    fontSize: 15,
    color: colors.textSecondary,
  },
  footerLink: {
    fontSize: 15,
    color: colors.primary,
    fontWeight: '700',
  }
});

export default SignUpScreen;
