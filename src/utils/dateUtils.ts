import {differenceInDays, parseISO, format, isToday, isPast, isFuture} from 'date-fns';
import {ko} from 'date-fns/locale';

export const calculateDDay = (targetDate: string): number => {
  const target = parseISO(targetDate);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return differenceInDays(target, today);
};

export const formatDDay = (days: number): string => {
  if (days === 0) return 'D-Day';
  if (days > 0) return `D-${days}`;
  return `D+${Math.abs(days)}`;
};

export const formatDate = (dateStr: string): string => {
  return format(parseISO(dateStr), 'yyyy년 M월 d일 (EEE)', {locale: ko});
};

export const formatShortDate = (dateStr: string): string => {
  return format(parseISO(dateStr), 'M/d (EEE)', {locale: ko});
};

export const getDateStatus = (dateStr: string): 'today' | 'past' | 'future' => {
  const date = parseISO(dateStr);
  if (isToday(date)) return 'today';
  if (isPast(date)) return 'past';
  return 'future';
};
