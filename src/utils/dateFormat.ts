import { format } from 'date-fns';

export const formatDate = (date: Date | string): string => {
    return date ? format(new Date(date), 'yyyy-MM-dd') : '';
  };
  