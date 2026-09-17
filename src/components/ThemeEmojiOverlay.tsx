import React, { forwardRef, useImperativeHandle } from 'react';
import { View, Text, StyleSheet, Animated, Easing, Dimensions } from 'react-native';

export interface ThemeEmojiOverlayRef {
  playAnimation: (emoji: string) => void;
}

const ThemeEmojiOverlay = forwardRef<ThemeEmojiOverlayRef, {}>((props, ref) => {
  const [activeEmoji, setActiveEmoji] = React.useState<string | null>(null);
  const emojiTranslateY = React.useRef(new Animated.Value(Dimensions.get('window').height)).current;
  const emojiOpacity = React.useRef(new Animated.Value(0)).current;
  const emojiScale = React.useRef(new Animated.Value(0.5)).current;

  useImperativeHandle(ref, () => ({
    playAnimation: (emoji: string) => {
      setActiveEmoji(emoji);
      emojiTranslateY.setValue(Dimensions.get('window').height / 2 + 100);
      emojiOpacity.setValue(0);
      emojiScale.setValue(0.5);

      Animated.sequence([
        Animated.parallel([
          Animated.timing(emojiTranslateY, {
            toValue: 0,
            duration: 600,
            easing: Easing.out(Easing.back(1.5)),
            useNativeDriver: true,
          }),
          Animated.timing(emojiOpacity, {
            toValue: 1,
            duration: 400,
            useNativeDriver: true,
          }),
          Animated.spring(emojiScale, {
            toValue: 1.2,
            friction: 4,
            useNativeDriver: true,
          })
        ]),
        Animated.delay(800),
        Animated.parallel([
          Animated.timing(emojiTranslateY, {
            toValue: -150,
            duration: 500,
            useNativeDriver: true,
          }),
          Animated.timing(emojiOpacity, {
            toValue: 0,
            duration: 400,
            useNativeDriver: true,
          })
        ])
      ]).start(() => {
        setActiveEmoji(null);
      });
    }
  }));

  if (!activeEmoji) return null;

  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      <Animated.View
        style={[
          styles.emojiContainer,
          {
            opacity: emojiOpacity,
            transform: [
              { translateY: emojiTranslateY },
              { scale: emojiScale }
            ]
          }
        ]}
      >
        <Text style={styles.emojiText}>{activeEmoji}</Text>
      </Animated.View>
    </View>
  );
});

const styles = StyleSheet.create({
  emojiContainer: {
    ...StyleSheet.absoluteFill,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 9999,
  },
  emojiText: {
    fontSize: 120,
    textShadowColor: 'rgba(0,0,0,0.3)',
    textShadowOffset: { width: 0, height: 10 },
    textShadowRadius: 20,
  }
});

export default ThemeEmojiOverlay;
