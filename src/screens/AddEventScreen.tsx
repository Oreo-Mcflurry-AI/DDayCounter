import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Platform,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import {useDDay} from '../contexts/DDayContext';
import {DDayEvent, COLORS, CATEGORIES} from '../types';
import {formatDate} from '../utils/dateUtils';

interface AddEventScreenProps {
  onClose: () => void;
  editEvent?: DDayEvent;
}

const AddEventScreen = ({onClose, editEvent}: AddEventScreenProps) => {
  const {addEvent, updateEvent} = useDDay();
  const [title, setTitle] = useState(editEvent?.title || '');
  const [date, setDate] = useState(
    editEvent ? new Date(editEvent.date) : new Date(),
  );
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [category, setCategory] = useState(editEvent?.category || 'general');
  const [color, setColor] = useState(editEvent?.color || COLORS[0]);
  const [isRepeat, setIsRepeat] = useState(editEvent?.isRepeat || false);
  const [memo, setMemo] = useState(editEvent?.memo || '');

  const handleSave = () => {
    if (!title.trim()) {
      return;
    }

    const eventData = {
      title: title.trim(),
      date: date.toISOString().split('T')[0],
      category,
      color,
      isRepeat,
      memo: memo.trim(),
    };

    if (editEvent) {
      updateEvent(editEvent.id, eventData);
    } else {
      addEvent(eventData);
    }
    onClose();
  };

  const onDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(Platform.OS === 'ios');
    if (selectedDate) {
      setDate(selectedDate);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onClose}>
          <Text style={styles.cancelButton}>취소</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>
          {editEvent ? 'D-Day 수정' : 'D-Day 추가'}
        </Text>
        <TouchableOpacity onPress={handleSave} disabled={!title.trim()}>
          <Text
            style={[styles.saveButton, !title.trim() && styles.saveDisabled]}>
            저장
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.section}>
          <Text style={styles.label}>제목</Text>
          <TextInput
            style={styles.input}
            value={title}
            onChangeText={setTitle}
            placeholder="예: 생일, 기념일, 시험일..."
            placeholderTextColor="#B2BEC3"
            maxLength={50}
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>날짜</Text>
          <TouchableOpacity
            style={styles.dateButton}
            onPress={() => setShowDatePicker(true)}>
            <Text style={styles.dateText}>{formatDate(date.toISOString())}</Text>
          </TouchableOpacity>
          {showDatePicker && (
            <DateTimePicker
              value={date}
              mode="date"
              display={Platform.OS === 'ios' ? 'spinner' : 'default'}
              onChange={onDateChange}
              locale="ko"
            />
          )}
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>카테고리</Text>
          <View style={styles.categoryGrid}>
            {CATEGORIES.map(cat => (
              <TouchableOpacity
                key={cat.key}
                style={[
                  styles.categoryItem,
                  category === cat.key && styles.categorySelected,
                ]}
                onPress={() => setCategory(cat.key)}>
                <Text style={styles.categoryIcon}>{cat.icon}</Text>
                <Text
                  style={[
                    styles.categoryLabel,
                    category === cat.key && styles.categoryLabelSelected,
                  ]}>
                  {cat.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>색상</Text>
          <View style={styles.colorGrid}>
            {COLORS.map(c => (
              <TouchableOpacity
                key={c}
                style={[
                  styles.colorItem,
                  {backgroundColor: c},
                  color === c && styles.colorSelected,
                ]}
                onPress={() => setColor(c)}>
                {color === c && <Text style={styles.colorCheck}>✓</Text>}
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <TouchableOpacity
            style={styles.repeatRow}
            onPress={() => setIsRepeat(!isRepeat)}>
            <View>
              <Text style={styles.label}>매년 반복</Text>
              <Text style={styles.repeatHint}>
                생일, 기념일 등 매년 반복되는 날
              </Text>
            </View>
            <View
              style={[
                styles.toggle,
                isRepeat && styles.toggleActive,
              ]}>
              <View
                style={[
                  styles.toggleKnob,
                  isRepeat && styles.toggleKnobActive,
                ]}
              />
            </View>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>메모 (선택)</Text>
          <TextInput
            style={[styles.input, styles.memoInput]}
            value={memo}
            onChangeText={setMemo}
            placeholder="메모를 입력하세요"
            placeholderTextColor="#B2BEC3"
            multiline
            maxLength={200}
          />
        </View>

        <View style={[styles.preview, {backgroundColor: color}]}>
          <Text style={styles.previewLabel}>미리보기</Text>
          <Text style={styles.previewTitle}>
            {title || '제목을 입력하세요'}
          </Text>
          <Text style={styles.previewDate}>
            {formatDate(date.toISOString())}
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#E9ECEF',
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: '#2D3436',
  },
  cancelButton: {
    fontSize: 16,
    color: '#636E72',
  },
  saveButton: {
    fontSize: 16,
    color: '#0984E3',
    fontWeight: '600',
  },
  saveDisabled: {
    color: '#B2BEC3',
  },
  content: {
    padding: 20,
  },
  section: {
    marginBottom: 24,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#636E72',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: '#2D3436',
    borderWidth: 1,
    borderColor: '#E9ECEF',
  },
  memoInput: {
    height: 100,
    textAlignVertical: 'top',
  },
  dateButton: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E9ECEF',
  },
  dateText: {
    fontSize: 16,
    color: '#2D3436',
  },
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  categoryItem: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
    width: '23%',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  categorySelected: {
    borderColor: '#0984E3',
    backgroundColor: '#EBF5FF',
  },
  categoryIcon: {
    fontSize: 24,
    marginBottom: 4,
  },
  categoryLabel: {
    fontSize: 12,
    color: '#636E72',
  },
  categoryLabelSelected: {
    color: '#0984E3',
    fontWeight: '600',
  },
  colorGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  colorItem: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  colorSelected: {
    borderWidth: 3,
    borderColor: '#2D3436',
  },
  colorCheck: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
  },
  repeatRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E9ECEF',
  },
  repeatHint: {
    fontSize: 12,
    color: '#B2BEC3',
    marginTop: 2,
  },
  toggle: {
    width: 50,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#E9ECEF',
    padding: 2,
  },
  toggleActive: {
    backgroundColor: '#0984E3',
  },
  toggleKnob: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: '#fff',
  },
  toggleKnobActive: {
    marginLeft: 20,
  },
  preview: {
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    marginTop: 8,
  },
  previewLabel: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.7)',
    marginBottom: 8,
  },
  previewTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 4,
  },
  previewDate: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.9)',
  },
});

export default AddEventScreen;
