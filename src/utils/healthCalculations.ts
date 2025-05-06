export interface HealthData {
  age: number;
  gender: 'Male' | 'Female';
  cholesterol: 'Normal' | 'Above Normal' | 'Well Above Normal';
  glucose: 'Normal' | 'Above Normal' | 'Well Above Normal';
  smoking: boolean;
  alcohol: boolean;
  physicalActivity: boolean;
  height: number;
  weight: number;
  ap_hi: number; // Systolic blood pressure
  ap_lo: number; // Diastolic blood pressure
}

export interface CalculatedFeatures {
  bmi: number;
  pulsePressure: number;
  map: number; // Mean Arterial Pressure
  ageBmiInteraction: number;
  pulseMapInteraction: number;
}

export interface PredictionResult {
  risk: 'Low' | 'High';
  probability: number;
}

// Calculate Body Mass Index
export const calculateBMI = (weight: number, height: number): number => {
  // Height in cm converted to meters
  const heightInMeters = height / 100;
  return Number((weight / (heightInMeters * heightInMeters)).toFixed(2));
};

// Calculate Pulse Pressure
export const calculatePulsePressure = (systolic: number, diastolic: number): number => {
  return systolic - diastolic;
};

// Calculate Mean Arterial Pressure
export const calculateMAP = (systolic: number, diastolic: number): number => {
  return Number(((diastolic * 2) + systolic) / 3);
};

// Calculate all derived health metrics
export const calculateHealthMetrics = (data: HealthData): CalculatedFeatures => {
  const bmi = calculateBMI(data.weight, data.height);
  const pulsePressure = calculatePulsePressure(data.ap_hi, data.ap_lo);
  const map = calculateMAP(data.ap_hi, data.ap_lo);
  
  return {
    bmi,
    pulsePressure,
    map,
    ageBmiInteraction: data.age * bmi,
    pulseMapInteraction: pulsePressure * map
  };
};

// Simulate a prediction result
// In a real application, this would call a backend API
export const predictCardiovascularRisk = (
  data: HealthData, 
  calculatedFeatures: CalculatedFeatures
): PredictionResult => {
  // This is a simplified model for demonstration purposes only
  // A real model would use more sophisticated algorithms
  
  // Risk factors that increase probability
  let baseRisk = 0.05; // 5% base risk
  
  // Age factor (risk increases with age)
  baseRisk += (data.age - 20) * 0.005;
  
  // Gender factor
  if (data.gender === 'Male') baseRisk += 0.05;
  
  // Cholesterol factor
  if (data.cholesterol === 'Above Normal') baseRisk += 0.07;
  if (data.cholesterol === 'Well Above Normal') baseRisk += 0.15;
  
  // Glucose factor
  if (data.glucose === 'Above Normal') baseRisk += 0.05;
  if (data.glucose === 'Well Above Normal') baseRisk += 0.1;
  
  // Lifestyle factors
  if (data.smoking) baseRisk += 0.15;
  if (data.alcohol) baseRisk += 0.08;
  if (!data.physicalActivity) baseRisk += 0.12;
  
  // BMI factor
  if (calculatedFeatures.bmi > 25) baseRisk += 0.05;
  if (calculatedFeatures.bmi > 30) baseRisk += 0.1;
  
  // Blood pressure factors
  if (data.ap_hi > 140) baseRisk += 0.15;
  if (data.ap_lo > 90) baseRisk += 0.1;
  
  // Calculate final probability (capped at 95%)
  const probability = Math.min(baseRisk, 0.95);
  
  return {
    risk: probability > 0.3 ? 'High' : 'Low',
    probability: Number((probability * 100).toFixed(1))
  };
};
