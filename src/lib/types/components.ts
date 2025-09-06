import { ReactNode } from 'react';

export interface BaseComponentProps {
  className?: string;
  children?: ReactNode;
}

export interface AsyncState<T> {
  data: T | null;
  loading: boolean;
  error?: string;
}
