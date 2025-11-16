import type { ChatMessage } from '@/lib/types/ai';

export interface AIChatMessage extends ChatMessage {
  id: string;
  timestamp: Date;
}
