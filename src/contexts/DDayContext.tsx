import React, {createContext, useContext, useState, useEffect, ReactNode} from 'react';
import {DDayEvent, COLORS} from '../types';
import {saveEvents, loadEvents} from '../utils/storage';
import {calculateDDay} from '../utils/dateUtils';

interface DDayContextType {
  events: DDayEvent[];
  upcomingEvents: DDayEvent[];
  pastEvents: DDayEvent[];
  addEvent: (event: Omit<DDayEvent, 'id' | 'createdAt'>) => void;
  updateEvent: (id: string, updates: Partial<DDayEvent>) => void;
  deleteEvent: (id: string) => void;
}

const DDayContext = createContext<DDayContextType | undefined>(undefined);

export const DDayProvider = ({children}: {children: ReactNode}) => {
  const [events, setEvents] = useState<DDayEvent[]>([]);

  useEffect(() => {
    const init = async () => {
      const savedEvents = await loadEvents();
      setEvents(savedEvents);
    };
    init();
  }, []);

  const sortedEvents = [...events].sort((a, b) => {
    const daysA = calculateDDay(a.date);
    const daysB = calculateDDay(b.date);
    return daysA - daysB;
  });

  const upcomingEvents = sortedEvents.filter(e => calculateDDay(e.date) >= 0);
  const pastEvents = sortedEvents.filter(e => calculateDDay(e.date) < 0);

  const addEvent = async (event: Omit<DDayEvent, 'id' | 'createdAt'>) => {
    const newEvent: DDayEvent = {
      ...event,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    };
    const newEvents = [...events, newEvent];
    setEvents(newEvents);
    await saveEvents(newEvents);
  };

  const updateEvent = async (id: string, updates: Partial<DDayEvent>) => {
    const newEvents = events.map(event =>
      event.id === id ? {...event, ...updates} : event,
    );
    setEvents(newEvents);
    await saveEvents(newEvents);
  };

  const deleteEvent = async (id: string) => {
    const newEvents = events.filter(event => event.id !== id);
    setEvents(newEvents);
    await saveEvents(newEvents);
  };

  return (
    <DDayContext.Provider
      value={{
        events: sortedEvents,
        upcomingEvents,
        pastEvents,
        addEvent,
        updateEvent,
        deleteEvent,
      }}>
      {children}
    </DDayContext.Provider>
  );
};

export const useDDay = () => {
  const context = useContext(DDayContext);
  if (!context) {
    throw new Error('useDDay must be used within DDayProvider');
  }
  return context;
};
