export interface DDayEvent {
  id: string;
  title: string;
  date: string;
  isRepeat: boolean;
  category: 'anniversary' | 'birthday' | 'trip' | 'exam' | 'other';
  color: string;
  createdAt: string;
}

export const COLORS = [
  '#FF6B6B',
  '#4ECDC4',
  '#45B7D1',
  '#96CEB4',
  '#FFEAA7',
  '#DDA0DD',
  '#98D8C8',
  '#F7DC6F',
];

export const CATEGORIES: {key: DDayEvent['category']; label: string; icon: string}[] = [
  {key: 'anniversary', label: '기념일', icon: '💕'},
  {key: 'birthday', label: '생일', icon: '🎂'},
  {key: 'trip', label: '여행', icon: '✈️'},
  {key: 'exam', label: '시험', icon: '📚'},
  {key: 'other', label: '기타', icon: '📌'},
];
