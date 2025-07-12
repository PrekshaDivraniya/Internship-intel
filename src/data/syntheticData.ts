import { TrainingData } from '../types/medical';

// Generate synthetic medical triage data
export function generateSyntheticData(count: number = 1000): TrainingData[] {
  const data: TrainingData[] = [];
  
  const complaints = [
    'Chest pain', 'Shortness of breath', 'Abdominal pain', 'Headache',
    'Fever', 'Injury/Trauma', 'Dizziness', 'Nausea/Vomiting',
    'Back pain', 'Allergic reaction', 'Seizure', 'Stroke symptoms'
  ];
  
  for (let i = 0; i < count; i++) {
    // Generate base demographics
    const age = Math.floor(Math.random() * 80) + 18;
    const gender = Math.random() < 0.5 ? 'female' : Math.random() < 0.8 ? 'male' : 'other';
    
    // Generate vital signs with some correlation to severity
    const severity = Math.random(); // 0 = mild, 1 = severe
    
    const heartRate = Math.floor(60 + (severity * 80) + (Math.random() * 40 - 20));
    const systolicBP = Math.floor(120 + (severity * 60) + (Math.random() * 40 - 20));
    const diastolicBP = Math.floor(80 + (severity * 30) + (Math.random() * 20 - 10));
    const temperature = 36.5 + (severity * 3) + (Math.random() * 2 - 1);
    const oxygenSaturation = Math.floor(100 - (severity * 15) - (Math.random() * 10));
    const respiratoryRate = Math.floor(16 + (severity * 20) + (Math.random() * 8 - 4));
    
    // Generate symptoms
    const painLevel = Math.floor(severity * 8 + Math.random() * 3);
    const consciousnessLevel = Math.floor(10 - (severity * 7) - (Math.random() * 3));
    const breathingDifficulty = Math.floor(severity * 7 + Math.random() * 4);
    const nausea = Math.floor(severity * 6 + Math.random() * 5);
    const dizziness = Math.floor(severity * 5 + Math.random() * 6);
    
    // Medical history (age-correlated)
    const hasHeartDisease = age > 50 && Math.random() < 0.3;
    const hasDiabetes = age > 40 && Math.random() < 0.25;
    const hasHypertension = age > 45 && Math.random() < 0.35;
    const hasAsthma = Math.random() < 0.15;
    const isPregnant = gender === 'female' && age < 45 && Math.random() < 0.1;
    
    // Arrival method correlates with severity
    let arrivalMethod: 'walk-in' | 'ambulance' | 'wheelchair' | 'stretcher';
    if (severity > 0.8) {
      arrivalMethod = Math.random() < 0.7 ? 'ambulance' : 'stretcher';
    } else if (severity > 0.5) {
      arrivalMethod = Math.random() < 0.4 ? 'ambulance' : Math.random() < 0.7 ? 'wheelchair' : 'walk-in';
    } else {
      arrivalMethod = Math.random() < 0.8 ? 'walk-in' : 'wheelchair';
    }
    
    // Determine priority based on multiple factors
    let priority: 'critical' | 'high' | 'medium' | 'low';
    
    const criticalFactors = [
      consciousnessLevel < 5,
      oxygenSaturation < 90,
      systolicBP > 180 || systolicBP < 90,
      heartRate > 120 || heartRate < 50,
      temperature > 39.5,
      painLevel > 8,
      arrivalMethod === 'ambulance' || arrivalMethod === 'stretcher'
    ].filter(Boolean).length;
    
    const highFactors = [
      consciousnessLevel < 7,
      oxygenSaturation < 95,
      systolicBP > 160 || systolicBP < 100,
      heartRate > 100 || heartRate < 60,
      temperature > 38.5,
      painLevel > 6,
      breathingDifficulty > 6,
      hasHeartDisease && (heartRate > 100 || painLevel > 5)
    ].filter(Boolean).length;
    
    if (criticalFactors >= 2) {
      priority = 'critical';
    } else if (criticalFactors >= 1 || highFactors >= 3) {
      priority = 'high';
    } else if (highFactors >= 1 || severity > 0.4) {
      priority = 'medium';
    } else {
      priority = 'low';
    }
    
    data.push({
      age,
      gender,
      heartRate: Math.max(30, Math.min(200, heartRate)),
      systolicBP: Math.max(70, Math.min(250, systolicBP)),
      diastolicBP: Math.max(40, Math.min(150, diastolicBP)),
      temperature: Math.max(35, Math.min(42, temperature)),
      oxygenSaturation: Math.max(70, Math.min(100, oxygenSaturation)),
      respiratoryRate: Math.max(8, Math.min(40, respiratoryRate)),
      painLevel: Math.max(0, Math.min(10, painLevel)),
      consciousnessLevel: Math.max(0, Math.min(10, consciousnessLevel)),
      breathingDifficulty: Math.max(0, Math.min(10, breathingDifficulty)),
      nausea: Math.max(0, Math.min(10, nausea)),
      dizziness: Math.max(0, Math.min(10, dizziness)),
      hasHeartDisease,
      hasDiabetes,
      hasHypertension,
      hasAsthma,
      isPregnant,
      arrivalMethod,
      chiefComplaint: complaints[Math.floor(Math.random() * complaints.length)],
      priority
    });
  }
  
  return data;
}