export enum AppView {
  DASHBOARD = 'DASHBOARD',
  CROP_ADVISOR = 'CROP_ADVISOR',
  DISEASE_DETECTOR = 'DISEASE_DETECTOR',
  MANDI_BHAV = 'MANDI_BHAV',
  AI_CHAT = 'AI_CHAT',
  GOV_SCHEMES = 'GOV_SCHEMES'
}

export interface WeatherData {
  temp: number;
  condition: string;
  humidity: number;
  windSpeed: number;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
}

export interface CropRecommendation {
  cropName: string;
  estimatedProfit: string;
  technique: string;
  reason: string;
}