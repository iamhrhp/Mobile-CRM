import React, { useEffect, useRef } from 'react';
import { StyleSheet, View, Dimensions, Text } from 'react-native';
import LottieView from 'lottie-react-native';
import { useTheme } from '../context/ThemeContext';

interface SplashScreenProps {
  onFinish: () => void;
}

const { width, height } = Dimensions.get('screen');
const MIN_SPLASH_DURATION = 3000; // 3 seconds minimum


const SplashScreen: React.FC<SplashScreenProps> = ({ onFinish }) => {
  const { colors } = useTheme();
  const animationDoneRef = useRef(false);
  const timerDoneRef = useRef(false);
  const calledRef = useRef(false);

  // Called when both conditions are met (animation done + min time elapsed)
  const tryFinish = () => {
    if (animationDoneRef.current && timerDoneRef.current && !calledRef.current) {
      calledRef.current = true;
      onFinish();
    }
  };

  const handleAnimationFinish = () => {
    animationDoneRef.current = true;
    tryFinish();
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      timerDoneRef.current = true;
      // If animation already done, proceed; otherwise wait for it
      tryFinish();
      // Safety net: if animation never fires, force finish after a bit more
      const forceTimer = setTimeout(() => {
        if (!calledRef.current) {
          calledRef.current = true;
          onFinish();
        }
      }, 2000);
      return () => clearTimeout(forceTimer);
    }, MIN_SPLASH_DURATION);

    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.container}>
      <LottieView
        source={require('../assets/splash.json')}
        autoPlay
        loop={false}
        onAnimationFinish={handleAnimationFinish}
        resizeMode="cover"
        style={styles.animation}
      />
      <View style={styles.brandingContainer}>
        <Text style={styles.brandingText}>PARVEJ CRM</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFill,
    flex: 1,
    alignItems: 'center',
  },
  animation: {
    width,
    height,
    position: 'absolute',
    top: 0,
    left: 0,
  },
  brandingContainer: {
    position: 'absolute',
    bottom: 60,
    left: 0,
    right: 0,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 9999,
    elevation: 9999,
  },
  brandingText: {
    fontSize: 22,
    fontWeight: '800',
    letterSpacing: 4,
    color: '#000000',
  },
});

export default SplashScreen;
