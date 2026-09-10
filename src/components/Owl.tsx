import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated } from 'react-native';

interface OwlProps {
  isPasswordFocused: boolean;
}

export const Owl: React.FC<OwlProps> = ({ isPasswordFocused }) => {
  const coverAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.spring(coverAnim, {
      toValue: isPasswordFocused ? 1 : 0,
      tension: 60,
      friction: 8,
      useNativeDriver: true,
    }).start();
  }, [isPasswordFocused, coverAnim]);

  // Left wing moves up and across the left eye
  const leftWingTransform = [
    { translateX: coverAnim.interpolate({ inputRange: [0, 1], outputRange: [-25, 20] }) },
    { translateY: coverAnim.interpolate({ inputRange: [0, 1], outputRange: [30, -35] }) },
    { rotate: coverAnim.interpolate({ inputRange: [0, 1], outputRange: ['-10deg', '50deg'] }) }
  ];

  // Right wing moves up and across the right eye
  const rightWingTransform = [
    { translateX: coverAnim.interpolate({ inputRange: [0, 1], outputRange: [25, -20] }) },
    { translateY: coverAnim.interpolate({ inputRange: [0, 1], outputRange: [30, -35] }) },
    { rotate: coverAnim.interpolate({ inputRange: [0, 1], outputRange: ['10deg', '-50deg'] }) }
  ];

  // Optional: close eyes slightly or move pupils when not covering
  // If we want the pupil to look down when typing email, we can add more logic, but this fulfills the request.

  return (
    <View style={styles.container}>
      {/* Ears */}
      <View style={[styles.ear, styles.leftEar]} />
      <View style={[styles.ear, styles.rightEar]} />

      {/* Owl Body */}
      <View style={styles.body}>
        {/* Belly */}
        <View style={styles.belly} />

        {/* Eyes */}
        <View style={styles.eyesContainer}>
          <View style={styles.eyeBg}>
            <View style={styles.pupil} />
          </View>
          <View style={styles.eyeBg}>
            <View style={styles.pupil} />
          </View>
        </View>

        {/* Beak */}
        <View style={styles.beak} />
      </View>

      {/* Wings - rendered after body so they sit on top */}
      <Animated.View style={[styles.wing, styles.leftWing, { transform: leftWingTransform }]} />
      <Animated.View style={[styles.wing, styles.rightWing, { transform: rightWingTransform }]} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 140,
    height: 100,
    alignItems: 'center',
    justifyContent: 'flex-end',
    position: 'relative',
    zIndex: 1, // Ensure owl is behind the form container in the parent
  },
  ear: {
    position: 'absolute',
    top: 5,
    width: 0,
    height: 0,
    borderLeftWidth: 16,
    borderRightWidth: 16,
    borderBottomWidth: 24,
    borderStyle: 'solid',
    backgroundColor: 'transparent',
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: '#6B4C3A', // dark brown
  },
  leftEar: {
    left: 15,
    transform: [{ rotate: '-25deg' }],
  },
  rightEar: {
    right: 15,
    transform: [{ rotate: '25deg' }],
  },
  body: {
    width: 120,
    height: 90,
    backgroundColor: '#8B5A2B', // brown
    borderTopLeftRadius: 60,
    borderTopRightRadius: 60,
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
    alignItems: 'center',
    overflow: 'hidden', // keeps belly inside
    borderWidth: 2,
    borderColor: '#4A3018',
  },
  belly: {
    position: 'absolute',
    bottom: -30,
    width: 90,
    height: 80,
    backgroundColor: '#D2B48C', // tan
    borderRadius: 45,
  },
  eyesContainer: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 20,
    zIndex: 2,
  },
  eyeBg: {
    width: 38,
    height: 38,
    backgroundColor: '#FFFFFF',
    borderRadius: 19,
    borderWidth: 2,
    borderColor: '#4A3018',
    justifyContent: 'center',
    alignItems: 'center',
  },
  pupil: {
    width: 14,
    height: 14,
    backgroundColor: '#000000',
    borderRadius: 7,
  },
  beak: {
    width: 0,
    height: 0,
    borderLeftWidth: 8,
    borderRightWidth: 8,
    borderTopWidth: 14,
    borderStyle: 'solid',
    backgroundColor: 'transparent',
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderTopColor: '#FFA500', // orange
    marginTop: -2,
    zIndex: 3,
  },
  wing: {
    position: 'absolute',
    width: 44,
    height: 56,
    backgroundColor: '#6B4C3A',
    borderRadius: 22,
    borderWidth: 2,
    borderColor: '#4A3018',
    zIndex: 4,
  },
  leftWing: {
    left: -10,
    bottom: -15,
  },
  rightWing: {
    right: -10,
    bottom: -15,
  }
});
