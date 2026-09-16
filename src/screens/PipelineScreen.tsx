import React, { useEffect, useRef, useState } from 'react';
import { View, StyleSheet, ScrollView, Image, TouchableOpacity, Text, Animated, Modal, TouchableWithoutFeedback } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { FilterIcon, ChevronDownIcon, CalendarIcon, PencilIcon, MoreHorizontalIcon, PlusIcon } from '../components/icons/Icons';
import { useTheme } from '../context/ThemeContext';
import { ThemeColors } from '../constants/colors';
import { useTranslation } from 'react-i18next';
import { useCurrency } from '../hooks/useCurrency';
import { TabType } from '../components/BottomNavBar';
import { PipelineLead, MOCK_LEADS } from '../data/mockLeads';

interface PipelineScreenProps {
  onNavigate?: (screen: TabType) => void;
  onSelectLead?: (leadId: string) => void;
}

const STATUSES = ['New', 'Contacted', 'Proposal Sent', 'Negotiation', 'Closed Won', 'Closed Lost'];

const PipelineScreen: React.FC<PipelineScreenProps> = ({ onNavigate, onSelectLead }) => {
  const { t } = useTranslation();
  const currency = useCurrency();
  const { colors, isDark } = useTheme();
  const styles = getStyles(colors, isDark);
  
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const barAnim = useRef(new Animated.Value(0)).current;
  const mapRef = useRef<MapView>(null);

  const [selectedStatus, setSelectedStatus] = useState('Contacted');
  const [dropdownVisible, setDropdownVisible] = useState(false);

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
  }, [fadeAnim, barAnim, selectedStatus]);

  const filteredLeads = MOCK_LEADS.filter(lead => lead.status === selectedStatus);

  useEffect(() => {
    if (mapRef.current && filteredLeads.length > 0) {
      // Timeout to ensure the map layout is calculated before fitting
      setTimeout(() => {
        if (filteredLeads.length === 1) {
          mapRef.current?.animateToRegion({
            latitude: filteredLeads[0].lat,
            longitude: filteredLeads[0].lng,
            latitudeDelta: 10,
            longitudeDelta: 10,
          }, 1000);
        } else {
          const coords = filteredLeads.map(l => ({ latitude: l.lat, longitude: l.lng }));
          mapRef.current?.fitToCoordinates(coords, {
            edgePadding: { top: 50, right: 50, bottom: 50, left: 50 },
            animated: true,
          });
        }
      }, 500);
    }
  }, [filteredLeads]);

  const renderLeadCard = (lead: PipelineLead) => {
    const barColor = lead.colorType === 'primary' ? colors.textPrimary : colors.limeAccent;
    return (
      <TouchableOpacity 
        key={lead.id} 
        activeOpacity={0.8}
        onPress={() => {
          onSelectLead?.(lead.id);
          onNavigate?.('lead_details');
        }}
      >
        <View style={styles.pipelineCard}>
          <View style={styles.pipelineCardTop}>
            <View style={styles.pipelineProfile}>
            <Image source={{ uri: lead.avatarUri }} style={styles.pipelineAvatar} />
            <View>
              <Text style={styles.pipelineName}>{lead.name}</Text>
              <View style={styles.pipelineDateRow}>
                <CalendarIcon size={12} color={colors.textMuted} />
                <Text style={styles.pipelineDateText}>{lead.days}</Text>
              </View>
            </View>
          </View>
          <TouchableOpacity activeOpacity={0.7} style={styles.pencilBtn}>
            <PencilIcon size={12} color={colors.textSecondary} />
          </TouchableOpacity>
        </View>
        
        <View style={styles.pipelineCardBottom}>
          <Text style={styles.pipelineValue}>{currency}{lead.value}K</Text>
          
          <View style={styles.customChartContainer}>
            <View style={styles.chartBarsLayer}>
              <Animated.View style={[styles.chartBarFill, { backgroundColor: barColor, width: barAnim.interpolate({ inputRange: [0, 1], outputRange: ['0%', `${lead.progress}%`] }) }]} />
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

          <Text style={styles.pipelinePercent}>{lead.progress}%</Text>
        </View>
      </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={{ flex: 1 }}>
      <Animated.ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        style={{ opacity: fadeAnim }}
      >
        {/* Map Section */}
        <View style={styles.mapSection}>
          <MapView
            ref={mapRef}
            style={styles.mapImage}
            initialRegion={{
              latitude: 39.0,
              longitude: -34.0,
              latitudeDelta: 60,
              longitudeDelta: 120,
            }}
            scrollEnabled={true}
            zoomEnabled={true}
            mapType="standard"
          >
            {filteredLeads.map(lead => (
              <Marker
                key={lead.id}
                coordinate={{ latitude: lead.lat, longitude: lead.lng }}
              >
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <View style={[styles.mapTooltipLine, { width: 10, marginRight: 4, backgroundColor: lead.colorType === 'primary' ? colors.primary : colors.limeAccent }]} />
                  <View style={styles.mapTooltip}>
                    <Text style={styles.mapTooltipTitle}>{lead.name}</Text>
                    <Text style={styles.mapTooltipValue}>{currency}{lead.value}K</Text>
                  </View>
                </View>
              </Marker>
            ))}
          </MapView>
        </View>

        {/* Kanban Header */}
        <View style={styles.kanbanHeaderRow}>
          <Text style={styles.kanbanTitle}>{t('pipeline.kanbanView', 'Kanban View')}</Text>
          <View style={styles.kanbanActions}>
            <TouchableOpacity activeOpacity={0.7} style={styles.kanbanFilterBtn} onPress={() => onNavigate?.('sort')}>
              <FilterIcon size={16} color={colors.textSecondary} />
            </TouchableOpacity>
            
            <View style={{ position: 'relative', zIndex: 100 }}>
              <TouchableOpacity 
                activeOpacity={0.7} 
                style={[styles.dropdownButton, dropdownVisible && styles.dropdownButtonActive]} 
                onPress={() => setDropdownVisible(!dropdownVisible)}
              >
                <Text style={styles.dropdownText}>{selectedStatus}</Text>
                <ChevronDownIcon size={12} color={colors.textPrimary} />
              </TouchableOpacity>
              
              {dropdownVisible && (
                <View style={[styles.inlineDropdown, { top: 45, right: 0, width: 160 }]}>
                  {STATUSES.map(status => (
                    <TouchableOpacity 
                      key={status} 
                      style={[styles.dropdownOption, selectedStatus === status && styles.dropdownOptionSelected]}
                      onPress={() => {
                        setSelectedStatus(status);
                        setDropdownVisible(false);
                      }}
                    >
                      <Text style={[styles.dropdownOptionText, selectedStatus === status && styles.dropdownOptionTextSelected]}>{status}</Text>
                      {selectedStatus === status && <Text style={styles.checkmark}>✓</Text>}
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </View>
          </View>
        </View>

        {/* Kanban Board Container */}
        <View style={styles.kanbanBoardContainer}>
          {/* Column Header */}
          <View style={styles.columnHeaderRow}>
            <Text style={styles.columnHeaderText}>{selectedStatus} ({filteredLeads.length})</Text>
            <View style={styles.columnActions}>
              <TouchableOpacity activeOpacity={0.7}>
                <MoreHorizontalIcon size={16} />
              </TouchableOpacity>
              <TouchableOpacity activeOpacity={0.7}>
                <PlusIcon size={16} color={colors.textSecondary} />
              </TouchableOpacity>
            </View>
          </View>

          {filteredLeads.length === 0 ? (
            <View style={{ padding: 40, alignItems: 'center', justifyContent: 'center' }}>
              <Text style={{ fontSize: 16, fontWeight: '600', color: colors.textSecondary, marginBottom: 8 }}>Empty Pipeline</Text>
              <Text style={{ textAlign: 'center', color: colors.textMuted, fontSize: 13 }}>There are no leads currently in this stage.</Text>
            </View>
          ) : (
            filteredLeads.map(renderLeadCard)
          )}

        </View>
      </Animated.ScrollView>
    </View>
  );
};

const getStyles = (colors: ThemeColors, isDark: boolean) => StyleSheet.create({
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
    borderRadius: 18,
    backgroundColor: colors.cardBackground,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
  },
  dropdownButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.cardBackground,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 20,
    gap: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
  },
  dropdownButtonActive: {
    borderWidth: 1.5,
    borderColor: colors.limeAccent,
  },
  dropdownText: {
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
  inlineDropdown: { position: 'absolute', backgroundColor: colors.cardBackground, borderRadius: 16, padding: 8, shadowColor: isDark ? '#000' : '#888', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.1, shadowRadius: 24, elevation: 10, zIndex: 1000 },
  dropdownOption: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 10, paddingHorizontal: 12, borderRadius: 10, marginBottom: 2 },
  dropdownOptionSelected: { backgroundColor: isDark ? colors.secondaryBackground : '#F0F0F0' },
  dropdownOptionText: { fontSize: 13, fontWeight: '500', color: colors.textSecondary },
  dropdownOptionTextSelected: { fontWeight: '700', color: colors.textPrimary },
  checkmark: { fontSize: 14, color: colors.textPrimary, fontWeight: '700' },
});

export default PipelineScreen;
