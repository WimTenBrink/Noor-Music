export type Priority = 'low' | 'normal' | 'high';
export type JobStatus = 'pending' | 'running' | 'done' | 'failed';

export interface Job {
  id: string;
  name: string;
  priority: Priority;
  status: JobStatus;
  createdAt: number;
  startedAt?: number;
  completedAt?: number;
  error?: string;
  rawRequest?: string;
  rawResponse?: string;
  result?: any;
  prompt?: string;
  systemInstruction?: string;
}

export interface Song {
  title: string;
  style: string;
  lyrics: string;
}

export interface Instrument {
  name: string;
  type: string;
}

export interface Style {
  name: string;
  substyles: string[];
}

export interface LibraryItem {
  id: string;
  name: string;
  type: 'song' | 'image' | 'xml' | 'json' | 'text';
  content: any;
  sourceUrl?: string;
}

export interface LogEntry {
  id: string;
  timestamp: number;
  level: 'info' | 'warn' | 'error';
  title: string;
  details: string;
}
