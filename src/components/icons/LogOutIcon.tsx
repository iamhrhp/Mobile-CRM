import React from 'react';
import { View } from 'react-native';
import colors from '../../constants/colors';

export const LogOutIcon = ({ size = 20, color = colors.textPrimary }) => (
  <View style={{ width: size, height: size, justifyContent: 'center', alignItems: 'center' }}>
    <View style={{ width: size * 0.5, height: size * 0.8, borderWidth: 1.5, borderColor: color, borderRightWidth: 0, borderTopLeftRadius: 3, borderBottomLeftRadius: 3, position: 'absolute', left: 2 }} />
    <View style={{ width: size * 0.4, height: 1.5, backgroundColor: color, position: 'absolute', right: 2 }} />
    <View style={{ width: size * 0.2, height: 1.5, backgroundColor: color, transform: [{ rotate: '45deg' }], position: 'absolute', right: 2, top: size * 0.3 }} />
    <View style={{ width: size * 0.2, height: 1.5, backgroundColor: color, transform: [{ rotate: '-45deg' }], position: 'absolute', right: 2, bottom: size * 0.3 }} />
  </View>
);
