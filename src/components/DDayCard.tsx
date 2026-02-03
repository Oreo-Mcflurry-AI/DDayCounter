import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import {DDayEvent, CATEGORIES} from '../types';
import {calculateDDay, formatDDay, formatShortDate} from '../utils/dateUtils';

interface DDayCardProps {
  event: DDayEvent;
  onPress: () => void;
  onDelete: () => void;
}

const DDayCard = ({event, onPress, onDelete}: DDayCardProps) => {
  const days = calculateDDay(event.date);
  const dDayText = formatDDay(days);
  const isToday = days === 0;
  const isPast = days < 0;
  const category = CATEGORIES.find(c => c.key === event.category);

  return (
    <TouchableOpacity
      style={[styles.card, {borderLeftColor: event.color}]}
      onPress={onPress}
      activeOpacity={0.7}>
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.categoryIcon}>{category?.icon}</Text>
          <Text style={styles.title} numberOfLines={1}>
            {event.title}
          </Text>
          {event.isRepeat && <Text style={styles.repeatBadge}>🔄</Text>}
        </View>
        <Text style={styles.date}>{formatShortDate(event.date)}</Text>
      </View>
      <View style={styles.dDayContainer}>
        <Text
          style={[
            styles.dDay,
            isToday && styles.dDayToday,
            isPast && styles.dDayPast,
          ]}>
          {dDayText}
        </Text>
        {isToday && <Text style={styles.todayText}>오늘!</Text>}
      </View>
      <TouchableOpacity style={styles.deleteButton} onPress={onDelete}>
        <Text style={styles.deleteIcon}>×</Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    borderLeftWidth: 4,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  content: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  categoryIcon: {
    fontSize: 18,
    marginRight: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2D3436',
    flex: 1,
  },
  repeatBadge: {
    fontSize: 14,
    marginLeft: 4,
  },
  date: {
    fontSize: 13,
    color: '#636E72',
    marginLeft: 26,
  },
  dDayContainer: {
    alignItems: 'center',
    marginHorizontal: 12,
  },
  dDay: {
    fontSize: 20,
    fontWeight: '700',
    color: '#0984E3',
  },
  dDayToday: {
    color: '#E17055',
  },
  dDayPast: {
    color: '#B2BEC3',
  },
  todayText: {
    fontSize: 11,
    color: '#E17055',
    fontWeight: '600',
  },
  deleteButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#FFF5F5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  deleteIcon: {
    fontSize: 20,
    color: '#E17055',
    fontWeight: '600',
  },
});

export default DDayCard;
