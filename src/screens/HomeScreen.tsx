import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import {useDDay} from '../contexts/DDayContext';
import DDayCard from '../components/DDayCard';
import {DDayEvent} from '../types';
import {calculateDDay, formatDDay} from '../utils/dateUtils';

interface HomeScreenProps {
  onAddPress: () => void;
  onEventPress: (event: DDayEvent) => void;
}

const HomeScreen = ({onAddPress, onEventPress}: HomeScreenProps) => {
  const {upcomingEvents, pastEvents, deleteEvent} = useDDay();
  const [showPast, setShowPast] = useState(false);

  const nearestEvent = upcomingEvents[0];

  const handleDelete = (event: DDayEvent) => {
    Alert.alert(
      '삭제',
      `"${event.title}"을(를) 삭제하시겠습니까?`,
      [
        {text: '취소', style: 'cancel'},
        {text: '삭제', style: 'destructive', onPress: () => deleteEvent(event.id)},
      ],
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.title}>D-Day</Text>
          <TouchableOpacity style={styles.addButton} onPress={onAddPress}>
            <Text style={styles.addButtonText}>+ 추가</Text>
          </TouchableOpacity>
        </View>

        {nearestEvent && (
          <TouchableOpacity
            style={[styles.featuredCard, {backgroundColor: nearestEvent.color}]}
            onPress={() => onEventPress(nearestEvent)}>
            <Text style={styles.featuredLabel}>가장 가까운 날</Text>
            <Text style={styles.featuredDDay}>
              {formatDDay(calculateDDay(nearestEvent.date))}
            </Text>
            <Text style={styles.featuredTitle}>{nearestEvent.title}</Text>
          </TouchableOpacity>
        )}

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            다가오는 날 ({upcomingEvents.length})
          </Text>
          {upcomingEvents.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyIcon}>📅</Text>
              <Text style={styles.emptyText}>등록된 D-Day가 없습니다</Text>
              <Text style={styles.emptySubtext}>
                새로운 기념일을 추가해보세요!
              </Text>
            </View>
          ) : (
            upcomingEvents.map(event => (
              <DDayCard
                key={event.id}
                event={event}
                onPress={() => onEventPress(event)}
                onDelete={() => handleDelete(event)}
              />
            ))
          )}
        </View>

        {pastEvents.length > 0 && (
          <View style={styles.section}>
            <TouchableOpacity
              style={styles.sectionHeader}
              onPress={() => setShowPast(!showPast)}>
              <Text style={styles.sectionTitle}>
                지난 날 ({pastEvents.length})
              </Text>
              <Text style={styles.toggleIcon}>{showPast ? '▲' : '▼'}</Text>
            </TouchableOpacity>
            {showPast &&
              pastEvents.map(event => (
                <DDayCard
                  key={event.id}
                  event={event}
                  onPress={() => onEventPress(event)}
                  onDelete={() => handleDelete(event)}
                />
              ))}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  scrollContent: {
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#2D3436',
  },
  addButton: {
    backgroundColor: '#0984E3',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
  },
  addButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },
  featuredCard: {
    borderRadius: 20,
    padding: 24,
    marginBottom: 24,
    alignItems: 'center',
  },
  featuredLabel: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 14,
    marginBottom: 8,
  },
  featuredDDay: {
    color: '#fff',
    fontSize: 48,
    fontWeight: '700',
    marginBottom: 8,
  },
  featuredTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#636E72',
    marginBottom: 12,
  },
  toggleIcon: {
    fontSize: 12,
    color: '#636E72',
  },
  emptyContainer: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 40,
    alignItems: 'center',
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: 12,
  },
  emptyText: {
    fontSize: 16,
    color: '#636E72',
    marginBottom: 4,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#B2BEC3',
  },
});

export default HomeScreen;
