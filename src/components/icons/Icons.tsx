import React from 'react';
import { View, Text } from 'react-native';
import colors from '../../constants/colors';

export const BellIcon = ({ size = 20, color = colors.textPrimary }) => (
  <View style={{ width: size, height: size, justifyContent: 'center', alignItems: 'center' }}>
    <View
      style={{
        width: size * 0.7,
        height: size * 0.65,
        borderWidth: 1.8,
        borderColor: color,
        borderTopLeftRadius: size * 0.35,
        borderTopRightRadius: size * 0.35,
        borderBottomLeftRadius: 3,
        borderBottomRightRadius: 3,
      }}
    />
    <View style={{ width: size * 0.9, height: 1.8, backgroundColor: color, borderRadius: 1 }} />
    <View
      style={{
        width: 3.5,
        height: 3,
        backgroundColor: color,
        borderBottomLeftRadius: 2,
        borderBottomRightRadius: 2,
        marginTop: 1,
      }}
    />
  </View>
);

export const MenuIcon = ({ size = 20, color = colors.textPrimary }) => (
  <View style={{ width: size, height: size, justifyContent: 'center', alignItems: 'center', gap: 3.5 }}>
    <View style={{ width: size * 0.75, height: 2, backgroundColor: color, borderRadius: 1 }} />
    <View style={{ width: size * 0.5, height: 2, backgroundColor: color, borderRadius: 1, alignSelf: 'flex-start', marginLeft: size * 0.12 }} />
    <View style={{ width: size * 0.75, height: 2, backgroundColor: color, borderRadius: 1 }} />
  </View>
);

export const SearchIcon = ({ size = 20, color = colors.textPrimary }) => (
  <View style={{ width: size, height: size, justifyContent: 'center', alignItems: 'center' }}>
    <View style={{ 
      width: size * 0.7, 
      height: size * 0.7, 
      borderRadius: size * 0.35, 
      borderWidth: 2, 
      borderColor: color,
      marginRight: size * 0.2,
      marginBottom: size * 0.2
    }} />
    <View style={{
      width: 2,
      height: size * 0.4,
      backgroundColor: color,
      position: 'absolute',
      bottom: size * 0.1,
      right: size * 0.25,
      transform: [{ rotate: '-45deg' }]
    }} />
  </View>
);

export const FilterIcon = ({ size = 18, color = colors.textPrimary }) => (
  <View style={{ width: size, height: size, justifyContent: 'center', alignItems: 'center', gap: 3 }}>
    <View style={{ width: size * 0.85, height: 1.5, backgroundColor: color, borderRadius: 1, justifyContent: 'center' }}>
      <View style={{ width: 4, height: 4, borderRadius: 2, backgroundColor: color, position: 'absolute', left: 3 }} />
    </View>
    <View style={{ width: size * 0.85, height: 1.5, backgroundColor: color, borderRadius: 1, justifyContent: 'center' }}>
      <View style={{ width: 4, height: 4, borderRadius: 2, backgroundColor: color, position: 'absolute', right: 3 }} />
    </View>
  </View>
);

export const PlusIcon = ({ size = 14, color = colors.textPrimary }) => (
  <View style={{ width: size, height: size, justifyContent: 'center', alignItems: 'center' }}>
    <View style={{ width: size, height: 2, backgroundColor: color, borderRadius: 1, position: 'absolute' }} />
    <View style={{ width: 2, height: size, backgroundColor: color, borderRadius: 1, position: 'absolute' }} />
  </View>
);

export const UsersIcon = ({ size = 18, color = colors.textSecondary }) => (
  <View style={{ width: size, height: size, justifyContent: 'center', alignItems: 'center' }}>
    <View style={{ width: size * 0.4, height: size * 0.4, borderRadius: size * 0.2, borderWidth: 1.5, borderColor: color, position: 'absolute', top: size * 0.05, right: size * 0.15 }} />
    <View style={{ width: size * 0.6, height: size * 0.25, borderTopLeftRadius: size * 0.3, borderTopRightRadius: size * 0.3, borderWidth: 1.5, borderColor: color, borderBottomWidth: 0, position: 'absolute', bottom: size * 0.1, right: size * 0.05 }} />
    <View style={{ width: size * 0.35, height: size * 0.35, borderRadius: size * 0.175, borderWidth: 1.5, borderColor: color, position: 'absolute', top: size * 0.15, left: size * 0.1, backgroundColor: colors.cardBackground }} />
    <View style={{ width: size * 0.55, height: size * 0.25, borderTopLeftRadius: size * 0.3, borderTopRightRadius: size * 0.3, borderWidth: 1.5, borderColor: color, borderBottomWidth: 0, position: 'absolute', bottom: size * 0.1, left: size * 0.05, backgroundColor: colors.cardBackground }} />
  </View>
);

export const UserIcon = ({ size = 18, color = colors.textSecondary }) => (
  <View style={{ width: size, height: size, justifyContent: 'center', alignItems: 'center' }}>
    <View style={{ width: size * 0.45, height: size * 0.45, borderRadius: size * 0.225, borderWidth: 1.6, borderColor: color, marginBottom: 1 }} />
    <View style={{ width: size * 0.75, height: size * 0.3, borderTopLeftRadius: size * 0.35, borderTopRightRadius: size * 0.35, borderWidth: 1.6, borderColor: color, borderBottomWidth: 0 }} />
  </View>
);

export const FireIcon = ({ size = 16, color = '#FF6B00' }) => (
  <View style={{ width: size, height: size, justifyContent: 'center', alignItems: 'center' }}>
    {/* A simple SVG-like representation using views for a flame is hard, so we use a text emoji if needed, or an icon */}
    <Text style={{ fontSize: size, color }}>🔥</Text>
  </View>
);

export const ArrowUpRightIcon = ({ size = 16, color = colors.textPrimary }) => (
  <View style={{ width: size, height: size, justifyContent: 'center', alignItems: 'center' }}>
    <View style={{ width: size * 0.5, height: 1.5, backgroundColor: color, position: 'absolute', top: size * 0.25, right: size * 0.25 }} />
    <View style={{ width: 1.5, height: size * 0.5, backgroundColor: color, position: 'absolute', top: size * 0.25, right: size * 0.25 }} />
    <View style={{ width: size * 0.7, height: 1.5, backgroundColor: color, transform: [{ rotate: '-45deg' }] }} />
  </View>
);

export const MailIcon = ({ size = 16, color = colors.textSecondary }) => (
  <View style={{ width: size, height: size * 0.7, borderWidth: 1.5, borderColor: color, borderRadius: 3, justifyContent: 'center', alignItems: 'center' }}>
    <View style={{ width: size * 0.8, height: 1.5, backgroundColor: color, position: 'absolute', top: 2, transform: [{ rotate: '15deg' }] }} />
    <View style={{ width: size * 0.8, height: 1.5, backgroundColor: color, position: 'absolute', top: 2, transform: [{ rotate: '-15deg' }] }} />
  </View>
);

export const PhoneIcon = ({ size = 16, color = colors.textSecondary }) => (
  <View style={{ width: size * 0.6, height: size, borderWidth: 1.5, borderColor: color, borderRadius: 3, justifyContent: 'space-between', alignItems: 'center', paddingVertical: 2 }}>
    <View style={{ width: '40%', height: 1.5, backgroundColor: color, borderRadius: 1 }} />
    <View style={{ width: 3, height: 3, backgroundColor: color, borderRadius: 1.5 }} />
  </View>
);

export const ChevronDownIcon = ({ size = 16, color = colors.textPrimary }) => (
  <View style={{ width: size, height: size, justifyContent: 'center', alignItems: 'center' }}>
    <View style={{ width: size * 0.4, height: 1.5, backgroundColor: color, transform: [{ rotate: '45deg' }], position: 'absolute', left: size * 0.2, top: size * 0.4 }} />
    <View style={{ width: size * 0.4, height: 1.5, backgroundColor: color, transform: [{ rotate: '-45deg' }], position: 'absolute', right: size * 0.2, top: size * 0.4 }} />
  </View>
);

export const VideoCameraIcon = ({ size = 16, color = colors.background }) => (
  <View style={{ width: size, height: size, justifyContent: 'center', alignItems: 'center', flexDirection: 'row' }}>
    <View style={{ width: size * 0.6, height: size * 0.5, backgroundColor: color, borderRadius: 2 }} />
    <View style={{ width: 0, height: 0, borderTopWidth: size * 0.2, borderBottomWidth: size * 0.2, borderRightWidth: size * 0.25, borderTopColor: 'transparent', borderBottomColor: 'transparent', borderRightColor: color, marginLeft: 1 }} />
  </View>
);

export const ConversionIcon = ({ size = 18, color = colors.textSecondary }) => (
  <View style={{ width: size, height: size, justifyContent: 'center', alignItems: 'center', flexDirection: 'row', gap: 2 }}>
    <View style={{ width: size * 0.35, height: size * 0.35, borderRadius: size * 0.175, borderWidth: 1.5, borderColor: color }} />
    <View style={{ width: 6, height: 6, borderRightWidth: 1.8, borderTopWidth: 1.8, borderColor: color, transform: [{ rotate: '45deg' }] }} />
  </View>
);

export const TrendingIcon = ({ size = 16, color = colors.textSecondary }) => (
  <View style={{ width: size, height: size, flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between', paddingVertical: size * 0.1, paddingHorizontal: size * 0.05 }}>
    <View style={{ width: size * 0.15, height: '40%', backgroundColor: color, borderRadius: size * 0.05 }} />
    <View style={{ width: size * 0.15, height: '60%', backgroundColor: color, borderRadius: size * 0.05 }} />
    <View style={{ width: size * 0.15, height: '80%', backgroundColor: color, borderRadius: size * 0.05 }} />
    <View style={{ width: size * 0.15, height: '100%', backgroundColor: color, borderRadius: size * 0.05 }} />
  </View>
);

export const CalendarIcon = ({ size = 18, color = colors.textSecondary, date = null as string | number | null }) => (
  <View style={{ width: size, height: size, justifyContent: 'center', alignItems: 'center' }}>
    <View style={{ width: size * 0.8, height: size * 0.75, borderWidth: 1.6, borderColor: color, borderRadius: 3, paddingTop: size * 0.2, alignItems: 'center' }}>
      <View style={{ width: '100%', height: 2, backgroundColor: color, position: 'absolute', top: 1 }} />
      {date ? (
        <Text style={{ fontSize: size * 0.4, color, fontWeight: '800', lineHeight: size * 0.45 }}>{date}</Text>
      ) : (
        <View style={{ flexDirection: 'row', gap: 2, flexWrap: 'wrap', paddingHorizontal: 2 }}>
          <View style={{ width: 2, height: 2, backgroundColor: color, borderRadius: 1 }} />
          <View style={{ width: 2, height: 2, backgroundColor: color, borderRadius: 1 }} />
          <View style={{ width: 2, height: 2, backgroundColor: color, borderRadius: 1 }} />
        </View>
      )}
    </View>
  </View>
);

export const PencilIcon = ({ size = 16, color = colors.textSecondary }) => (
  <View style={{ width: size, height: size, justifyContent: 'center', alignItems: 'center' }}>
    <View style={{ width: size * 0.7, height: size * 0.2, backgroundColor: color, transform: [{ rotate: '-45deg' }], borderRadius: 1 }} />
    <View style={{ position: 'absolute', bottom: size * 0.2, left: size * 0.2, width: 2, height: 2, backgroundColor: color, borderRadius: 1 }} />
  </View>
);

export const MoreHorizontalIcon = ({ size = 16, color = colors.textSecondary }) => (
  <View style={{ width: size, height: size, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 2 }}>
    <View style={{ width: 3, height: 3, backgroundColor: color, borderRadius: 1.5 }} />
    <View style={{ width: 3, height: 3, backgroundColor: color, borderRadius: 1.5 }} />
    <View style={{ width: 3, height: 3, backgroundColor: color, borderRadius: 1.5 }} />
  </View>
);

export const TrendUpIcon = ({ size = 16, color = colors.textSecondary }) => (
  <View style={{ width: size, height: size, justifyContent: 'center', alignItems: 'center' }}>
    <View style={{ width: size * 0.8, height: size * 0.8, borderBottomWidth: 1.5, borderLeftWidth: 1.5, borderColor: color, position: 'absolute', bottom: size * 0.1, left: size * 0.1 }} />
    <View style={{ width: size * 0.5, height: 1.5, backgroundColor: color, transform: [{ rotate: '-45deg' }], position: 'absolute', top: size * 0.45, left: size * 0.2 }} />
    <View style={{ width: size * 0.5, height: 1.5, backgroundColor: color, transform: [{ rotate: '45deg' }], position: 'absolute', top: size * 0.35, right: size * 0.15 }} />
    <View style={{ width: size * 0.3, height: size * 0.3, borderTopWidth: 1.5, borderRightWidth: 1.5, borderColor: color, position: 'absolute', top: size * 0.1, right: size * 0.1 }} />
  </View>
);

export const LoopIcon = ({ size = 16, color = colors.textSecondary }) => (
  <View style={{ width: size, height: size, justifyContent: 'center', alignItems: 'center' }}>
    <View style={{ width: size * 0.7, height: size * 0.5, borderWidth: 1.5, borderColor: color, borderRadius: 4 }} />
    <View style={{ width: size * 0.3, height: size * 0.3, borderRadius: size * 0.15, borderWidth: 1.5, borderColor: color, position: 'absolute' }} />
  </View>
);

export const WarningTriangleIcon = ({ size = 16, color = colors.textSecondary }) => (
  <View style={{ width: size, height: size, justifyContent: 'center', alignItems: 'center' }}>
    <View style={{ width: 0, height: 0, borderLeftWidth: size * 0.4, borderRightWidth: size * 0.4, borderBottomWidth: size * 0.7, borderLeftColor: 'transparent', borderRightColor: 'transparent', borderBottomColor: color, opacity: 0.2, position: 'absolute', bottom: size * 0.15 }} />
    <View style={{ width: size * 0.7, height: size * 0.65, borderBottomWidth: 1.5, borderColor: color, position: 'absolute', bottom: size * 0.15, borderBottomLeftRadius: 2, borderBottomRightRadius: 2 }} />
    <View style={{ width: size * 0.75, height: 1.5, backgroundColor: color, transform: [{ rotate: '60deg' }], position: 'absolute', left: size * 0.05 }} />
    <View style={{ width: size * 0.75, height: 1.5, backgroundColor: color, transform: [{ rotate: '-60deg' }], position: 'absolute', right: size * 0.05 }} />
    <View style={{ width: 1.5, height: size * 0.2, backgroundColor: color, position: 'absolute', top: size * 0.4 }} />
    <View style={{ width: 1.5, height: 1.5, backgroundColor: color, position: 'absolute', bottom: size * 0.25 }} />
  </View>
);

export const EyeIcon = ({ size = 16, color = colors.textSecondary }) => (
  <View style={{ width: size, height: size, justifyContent: 'center', alignItems: 'center' }}>
    <View style={{ width: size * 0.9, height: size * 0.5, borderRadius: size * 0.45, borderWidth: 1.5, borderColor: color, justifyContent: 'center', alignItems: 'center' }}>
      <View style={{ width: size * 0.3, height: size * 0.3, borderRadius: size * 0.15, backgroundColor: color }} />
    </View>
  </View>
);

export const XIcon = ({ size = 12, color = colors.textSecondary }) => (
  <View style={{ width: size, height: size, justifyContent: 'center', alignItems: 'center' }}>
    <View style={{ width: size, height: 1.5, backgroundColor: color, transform: [{ rotate: '45deg' }], position: 'absolute' }} />
    <View style={{ width: size, height: 1.5, backgroundColor: color, transform: [{ rotate: '-45deg' }], position: 'absolute' }} />
  </View>
);

export const CheckCircleIcon = ({ size = 16, color = colors.textSecondary }) => (
  <View style={{ width: size, height: size, justifyContent: 'center', alignItems: 'center' }}>
    <View style={{ width: size * 0.9, height: size * 0.9, borderRadius: size * 0.45, borderWidth: 1.5, borderColor: color }} />
    <View style={{ width: size * 0.3, height: 1.5, backgroundColor: color, transform: [{ rotate: '45deg' }], position: 'absolute', left: size * 0.25, top: size * 0.55 }} />
    <View style={{ width: size * 0.5, height: 1.5, backgroundColor: color, transform: [{ rotate: '-55deg' }], position: 'absolute', right: size * 0.2, top: size * 0.4 }} />
  </View>
);
