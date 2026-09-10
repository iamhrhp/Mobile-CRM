import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Modal, FlatList, StyleSheet, TouchableWithoutFeedback } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { ThemeColors } from '../constants/colors';

export const MONTHS = ['All', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
export const YEARS = ['2020', '2021', '2022', '2023', '2024'];

interface TimeFilterProps {
  selectedMonth: string;
  onMonthChange: (month: string) => void;
  selectedYear: string;
  onYearChange: (year: string) => void;
}

const TimeFilter: React.FC<TimeFilterProps> = ({ selectedMonth, onMonthChange, selectedYear, onYearChange }) => {
  const { colors } = useTheme();
  const styles = getStyles(colors);
  
  const [modalVisible, setModalVisible] = useState<'month' | 'year' | null>(null);

  const renderModal = () => {
    if (!modalVisible) return null;
    
    const data = modalVisible === 'month' ? MONTHS : YEARS;
    const selected = modalVisible === 'month' ? selectedMonth : selectedYear;
    const onSelect = (val: string) => {
      if (modalVisible === 'month') onMonthChange(val);
      else onYearChange(val);
      setModalVisible(null);
    };

    return (
      <Modal transparent visible={!!modalVisible} animationType="fade" onRequestClose={() => setModalVisible(null)}>
        <TouchableWithoutFeedback onPress={() => setModalVisible(null)}>
          <View style={styles.modalOverlay}>
            <TouchableWithoutFeedback>
              <View style={styles.modalContent}>
                <Text style={styles.modalTitle}>Select {modalVisible === 'month' ? 'Month' : 'Year'}</Text>
                <FlatList
                  data={data}
                  keyExtractor={item => item}
                  style={{ maxHeight: 300 }}
                  renderItem={({ item }) => (
                    <TouchableOpacity 
                      style={[styles.modalItem, selected === item && styles.modalItemSelected]}
                      onPress={() => onSelect(item)}
                    >
                      <Text style={[styles.modalItemText, selected === item && styles.modalItemTextSelected]}>
                        {item}
                      </Text>
                      {selected === item && <Text style={styles.checkIcon}>✓</Text>}
                    </TouchableOpacity>
                  )}
                />
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    );
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.button} onPress={() => setModalVisible('month')}>
        <Text style={styles.buttonText}>{selectedMonth}</Text>
        <Text style={styles.chevron}>▼</Text>
      </TouchableOpacity>
      
      <TouchableOpacity style={styles.button} onPress={() => setModalVisible('year')}>
        <Text style={styles.buttonText}>{selectedYear}</Text>
        <Text style={styles.chevron}>▼</Text>
      </TouchableOpacity>
      
      {renderModal()}
    </View>
  );
};

const getStyles = (colors: ThemeColors) => StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginBottom: 16,
    gap: 8,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.cardBackground,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  buttonText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.textPrimary,
    marginRight: 6,
  },
  chevron: {
    fontSize: 10,
    color: colors.textSecondary,
    marginTop: 2,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: colors.cardBackground,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    paddingBottom: 40,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 16,
    textAlign: 'center',
  },
  modalItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  modalItemSelected: {
    backgroundColor: 'rgba(38, 198, 218, 0.05)',
  },
  modalItemText: {
    fontSize: 16,
    color: colors.textPrimary,
    fontWeight: '500',
  },
  modalItemTextSelected: {
    color: '#26C6DA',
    fontWeight: '700',
  },
  checkIcon: {
    color: '#26C6DA',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default TimeFilter;
