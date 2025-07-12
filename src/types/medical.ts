export interface PatientData {
  // Demographics
  age: number;
  gender: 'male' | 'female' | 'other';
  
  // Vital Signs
  heartRate: number;
  systolicBP: number;
  diastolicBP: number;
  temperature: number; // Celsius
  oxygenSaturation: number;
  respiratoryRate: number;
  
  // Symptoms (0-10 scale)
  painLevel: number;
  consciousnessLevel: number; // 0=unconscious, 10=fully alert
  breathingDifficulty: number;
  nausea: number;
  dizziness: number;
  
  // Medical History (boolean)
  hasHeartDisease: boolean;
  hasDiabetes: boolean;
  hasHypertension: boolean;
  hasAsthma: boolean;
  isPregnant: boolean;
  
  // Additional factors
  arrivalMethod: 'walk-in' | 'ambulance' | 'wheelchair' | 'stretcher';
  chiefComplaint: string;
}

export interface TriageResult {
  priority: 'critical' | 'high' | 'medium' | 'low';
  score: number;
  recommendations: string[];
  estimatedWaitTime: number; // minutes
  confidence: number;
}

export interface TrainingData extends PatientData {
  priority: 'critical' | 'high' | 'medium' | 'low';
}