import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, ScrollView, Image, TouchableOpacity, Text, Animated } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { FilterIcon, ChevronDownIcon, CalendarIcon, PencilIcon, MoreHorizontalIcon, PlusIcon } from '../components/icons/Icons';
import colors from '../constants/colors';
import { useTranslation } from 'react-i18next';

const PipelineScreen = () => {
  const { t } = useTranslation();
  
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const barAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    fadeAnim.setValue(0);
    barAnim.setValue(0);
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.timing(barAnim, {
        toValue: 1,
        duration: 1500,
        useNativeDriver: false,
      })
    ]).start();
  }, [fadeAnim, barAnim]);

  return (
    <Animated.ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.scrollContent}
      style={{ opacity: fadeAnim }}
    >
      {/* Map Section */}
      <View style={styles.mapSection}>
        <MapView
          style={styles.mapImage}
          initialRegion={{
            latitude: 48.8566,
            longitude: 2.3522,
            latitudeDelta: 30,
            longitudeDelta: 30,
          }}
          scrollEnabled={true}
          zoomEnabled={true}
          mapType="standard"
        >
          <Marker
            coordinate={{ latitude: 48.8566, longitude: 2.3522 }}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <View style={[styles.mapTooltipLine, { width: 10, marginRight: 4 }]} />
              <View style={styles.mapTooltip}>
                <Text style={styles.mapTooltipTitle}>{t('pipeline.europe')}</Text>
                <Text style={styles.mapTooltipValue}>$17.4M</Text>
              </View>
            </View>
          </Marker>
        </MapView>
      </View>

      {/* Kanban Header */}
      <View style={styles.kanbanHeaderRow}>
        <Text style={styles.kanbanTitle}>{t('pipeline.kanbanView')}</Text>
        <View style={styles.kanbanActions}>
          <TouchableOpacity activeOpacity={0.7} style={styles.kanbanFilterBtn}>
            <FilterIcon size={16} color={colors.textSecondary} />
          </TouchableOpacity>
          <TouchableOpacity activeOpacity={0.7} style={styles.kanbanDropdownBtn}>
            <Text style={styles.kanbanDropdownText}>{t('pipeline.contacted')}</Text>
            <ChevronDownIcon size={12} color={colors.textPrimary} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Kanban Board Container */}
      <View style={styles.kanbanBoardContainer}>
        {/* Column Header */}
        <View style={styles.columnHeaderRow}>
          <Text style={styles.columnHeaderText}>{t('pipeline.contacted')} (4)</Text>
          <View style={styles.columnActions}>
            <TouchableOpacity activeOpacity={0.7}>
              <MoreHorizontalIcon size={16} />
            </TouchableOpacity>
            <TouchableOpacity activeOpacity={0.7}>
              <PlusIcon size={16} color={colors.textSecondary} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Card 1 */}
        <View style={styles.pipelineCard}>
          <View style={styles.pipelineCardTop}>
            <View style={styles.pipelineProfile}>
              <Image source={{ uri: 'https://randomuser.me/api/portraits/men/32.jpg' }} style={styles.pipelineAvatar} />
              <View>
                <Text style={styles.pipelineName}>Vandelay Industries</Text>
                <View style={styles.pipelineDateRow}>
                  <CalendarIcon size={12} color={colors.textMuted} />
                  <Text style={styles.pipelineDateText}>1 day</Text>
                </View>
              </View>
            </View>
            <TouchableOpacity activeOpacity={0.7} style={styles.pencilBtn}>
              <PencilIcon size={12} color={colors.textSecondary} />
            </TouchableOpacity>
          </View>
          
          <View style={styles.pipelineCardBottom}>
            <Text style={styles.pipelineValue}>$15.5K</Text>
            
            {/* Custom Bar Chart 1 */}
            <View style={styles.customChartContainer}>
              <View style={styles.chartBarsLayer}>
                <Animated.View style={[styles.chartBarFill, { backgroundColor: colors.textPrimary, width: barAnim.interpolate({ inputRange: [0, 1], outputRange: ['0%', '36%'] }) }]} />
                <View style={styles.chartBarEmpty} />
              </View>
              <View style={styles.chartTicksRow}>
                <Text style={styles.chartTickText}>0</Text>
                <Text style={styles.chartTickText}>25</Text>
                <Text style={styles.chartTickText}>50</Text>
                <Text style={styles.chartTickText}>75</Text>
                <Text style={styles.chartTickText}>100</Text>
              </View>
            </View>

            <Text style={styles.pipelinePercent}>36%</Text>
          </View>
        </View>

        {/* Card 2 */}
        <View style={styles.pipelineCard}>
          <View style={styles.pipelineCardTop}>
            <View style={styles.pipelineProfile}>
              <Image source={{ uri: 'https://randomuser.me/api/portraits/women/44.jpg' }} style={styles.pipelineAvatar} />
              <View>
                <Text style={styles.pipelineName}>Globax Corporation</Text>
                <View style={styles.pipelineDateRow}>
                  <CalendarIcon size={12} color={colors.textMuted} />
                  <Text style={styles.pipelineDateText}>3 day</Text>
                </View>
              </View>
            </View>
            <TouchableOpacity activeOpacity={0.7} style={styles.pencilBtn}>
              <PencilIcon size={12} color={colors.textSecondary} />
            </TouchableOpacity>
          </View>
          
          <View style={styles.pipelineCardBottom}>
            <Text style={styles.pipelineValue}>$12.5K</Text>
            
            {/* Custom Bar Chart 2 */}
            <View style={styles.customChartContainer}>
              <View style={styles.chartBarsLayer}>
                <Animated.View style={[styles.chartBarFill, { backgroundColor: colors.limeAccent, width: barAnim.interpolate({ inputRange: [0, 1], outputRange: ['0%', '34%'] }) }]} />
                <View style={styles.chartBarEmpty} />
              </View>
              <View style={styles.chartTicksRow}>
                <Text style={styles.chartTickText}>0</Text>
                <Text style={styles.chartTickText}>25</Text>
                <Text style={styles.chartTickText}>50</Text>
                <Text style={styles.chartTickText}>75</Text>
                <Text style={styles.chartTickText}>100</Text>
              </View>
            </View>

            <Text style={styles.pipelinePercent}>34%</Text>
          </View>
        </View>

      </View>
    </Animated.ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContent: {
    paddingBottom: 110,
  },
  mapSection: {
    width: '100%',
    height: 180,
    marginBottom: 20,
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  mapImage: {
    width: '100%',
    height: '100%',
    opacity: 0.8,
  },
  mapTooltipContainer: {
    position: 'absolute',
    top: '30%',
    left: '55%',
    flexDirection: 'row',
    alignItems: 'center',
  },
  mapTooltipLine: {
    width: 20,
    height: 2,
    backgroundColor: colors.limeAccent,
  },
  mapTooltip: {
    backgroundColor: colors.cardBackground,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  mapTooltipTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: 2,
  },
  mapTooltipValue: {
    fontSize: 11,
    color: colors.textSecondary,
  },
  kanbanHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  kanbanTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  kanbanActions: {
    flexDirection: 'row',
    gap: 8,
  },
  kanbanFilterBtn: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: colors.cardBackground,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  kanbanDropdownBtn: {
    backgroundColor: colors.cardBackground,
    paddingHorizontal: 12,
    height: 36,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  kanbanDropdownText: {
    fontSize: 13,
    fontWeight: '500',
    color: colors.textPrimary,
  },
  kanbanBoardContainer: {
    marginHorizontal: 20,
    borderWidth: 1.5,
    borderColor: '#E8E8E8',
    borderStyle: 'dashed',
    borderRadius: 20,
    padding: 16,
  },
  columnHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  columnHeaderText: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.textPrimary,
  },
  columnActions: {
    flexDirection: 'row',
    gap: 12,
  },
  pipelineCard: {
    backgroundColor: colors.cardBackground,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 6,
    elevation: 2,
  },
  pipelineCardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  pipelineProfile: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  pipelineAvatar: {
    width: 36,
    height: 36,
    borderRadius: 8,
  },
  pipelineName: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: 4,
  },
  pipelineDateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  pipelineDateText: {
    fontSize: 11,
    color: colors.textMuted,
  },
  pencilBtn: {
    backgroundColor: colors.secondaryBackground,
    width: 28,
    height: 28,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  pipelineCardBottom: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
  },
  pipelineValue: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 4,
  },
  customChartContainer: {
    flex: 1,
    marginHorizontal: 16,
  },
  chartBarsLayer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    height: 24,
    borderLeftWidth: 1,
    borderBottomWidth: 1,
    borderColor: colors.border,
    marginBottom: 4,
  },
  chartBarFill: {
    height: 4,
  },
  chartBarEmpty: {
    flex: 1,
    height: '100%',
    borderLeftWidth: 1,
    borderLeftColor: '#F0F0F0',
    marginLeft: 2,
    borderStyle: 'dashed',
  },
  chartTicksRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  chartTickText: {
    fontSize: 9,
    color: colors.textMuted,
  },
  pipelinePercent: {
    fontSize: 13,
    color: colors.textMuted,
    marginBottom: 4,
  },
});

export default PipelineScreen;
