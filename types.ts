export interface Alarm {
  id: string;
  time: string; // Format "HH:mm"
  label: string;
  isActive: boolean;
  days: number[]; // 0-6, where 0 is Sunday
  smartPrompt?: string; // Optional prompt for Gemini to generate a wake-up message
}

export interface WakeUpMessage {
  text: string;
  mood?: string;
}
