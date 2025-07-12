import { PatientData } from '../types/medical';

export function normalizePatientData(data: PatientData): number[] {
  // Normalize all features to 0-1 range for neural network
  const features = [
    // Demographics
    data.age / 100,
    data.gender === 'male' ? 0 : data.gender === 'female' ? 0.5 : 1,
    
    // Vital signs (normalized to typical ranges)
    (data.heartRate - 60) / 140, // 60-200 range
    (data.systolicBP - 90) / 160, // 90-250 range
    (data.diastolicBP - 60) / 90, // 60-150 range
    (data.temperature - 36) / 6, // 36-42 range
    data.oxygenSaturation / 100,
    (data.respiratoryRate - 12) / 28, // 12-40 range
    
    // Symptoms (already 0-10, normalize to 0-1)
    data.painLevel / 10,
    data.consciousnessLevel / 10,
    data.breathingDifficulty / 10,
    data.nausea / 10,
    data.dizziness / 10,
    
    // Medical history (boolean to 0/1)
    data.hasHeartDisease ? 1 : 0,
    data.hasDiabetes ? 1 : 0,
    data.hasHypertension ? 1 : 0,
    data.hasAsthma ? 1 : 0,
    data.isPregnant ? 1 : 0,
    
    // Arrival method (categorical encoding)
    data.arrivalMethod === 'walk-in' ? 0 : 
    data.arrivalMethod === 'wheelchair' ? 0.33 :
    data.arrivalMethod === 'ambulance' ? 0.66 : 1
  ];
  
  // Handle any NaN or undefined values
  return features.map(f => isNaN(f) || f === undefined ? 0 : Math.max(0, Math.min(1, f)));
}

export function validateAndCleanInput(data: Partial<PatientData>): PatientData {
  // Provide defaults and validate ranges
  return {
    age: Math.max(0, Math.min(120, data.age || 30)),
    gender: data.gender || 'other',
    heartRate: Math.max(30, Math.min(200, data.heartRate || 70)),
    systolicBP: Math.max(70, Math.min(250, data.systolicBP || 120)),
    diastolicBP: Math.max(40, Math.min(150, data.diastolicBP || 80)),
    temperature: Math.max(35, Math.min(42, data.temperature || 36.5)),
    oxygenSaturation: Math.max(70, Math.min(100, data.oxygenSaturation || 98)),
    respiratoryRate: Math.max(8, Math.min(40, data.respiratoryRate || 16)),
    painLevel: Math.max(0, Math.min(10, data.painLevel || 0)),
    consciousnessLevel: Math.max(0, Math.min(10, data.consciousnessLevel || 10)),
    breathingDifficulty: Math.max(0, Math.min(10, data.breathingDifficulty || 0)),
    nausea: Math.max(0, Math.min(10, data.nausea || 0)),
    dizziness: Math.max(0, Math.min(10, data.dizziness || 0)),
    hasHeartDisease: data.hasHeartDisease || false,
    hasDiabetes: data.hasDiabetes || false,
    hasHypertension: data.hasHypertension || false,
    hasAsthma: data.hasAsthma || false,
    isPregnant: data.isPregnant || false,
    arrivalMethod: data.arrivalMethod || 'walk-in',
    chiefComplaint: data.chiefComplaint || 'General consultation'
  };
}