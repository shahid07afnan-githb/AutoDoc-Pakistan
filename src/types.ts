export type MessageRole = 'user' | 'assistant';

export interface ChatMessageItem {
  id: string;
  role: MessageRole;
  content: string;
  timestamp: string;
  urgencyLevel?: 'safe' | 'warning' | 'critical' | 'unknown';
  isStreaming?: boolean;
}

export interface QuickPrompt {
  car: string;
  symptom: string;
  category: string;
  fullPrompt: string;
}
