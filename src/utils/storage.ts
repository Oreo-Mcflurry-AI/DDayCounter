import AsyncStorage from '@react-native-async-storage/async-storage';
import {DDayEvent} from '../types';

const EVENTS_KEY = '@dday_events';

export const saveEvents = async (events: DDayEvent[]): Promise<void> => {
  try {
    await AsyncStorage.setItem(EVENTS_KEY, JSON.stringify(events));
  } catch (error) {
    console.error('Error saving events:', error);
  }
};

export const loadEvents = async (): Promise<DDayEvent[]> => {
  try {
    const data = await AsyncStorage.getItem(EVENTS_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error loading events:', error);
    return [];
  }
};
