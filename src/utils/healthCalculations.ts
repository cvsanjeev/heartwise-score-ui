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

// Function to call Flask API and get the prediction
export const predictCardiovascularRisk = async (data: HealthData): Promise<PredictionResult> => {
  const url = 'https://codespaces-flask-production-0b1e.up.railway.app/predict'; // Flask API URL
  const healthMetrics = calculateHealthMetrics(data);

  const requestPayload = {
    age: data.age,
    gender: data.gender === 'Male' ? 1 : 0, // Convert gender to numeric for the model
    cholesterol: mapCholesterol(data.cholesterol),
    gluc: mapGlucose(data.glucose),
    smoke: data.smoking ? 1 : 0,
    alco: data.alcohol ? 1 : 0,
    active: data.physicalActivity ? 1 : 0,
    height: data.height,
    weight: data.weight,
    ap_hi: data.ap_hi,
    ap_lo: data.ap_lo,
    bmi: healthMetrics.bmi,
    pulse_pressure: healthMetrics.pulsePressure,
    map: healthMetrics.map,
    age_bmi_interaction: healthMetrics.ageBmiInteraction,
    pulse_map_interaction: healthMetrics.pulseMapInteraction
  };

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(requestPayload)
    });

    if (!response.ok) {
      throw new Error('Failed to fetch prediction from API');
    }

    const result = await response.json();
    const { prediction, probability } = result;

    return {
      risk: prediction === 1 ? 'High' : 'Low',
      probability: probability
    };

  } catch (error) {
    console.error('Error in API call:', error);
    return { risk: 'Low', probability: 0 }; // Return a default low risk if something goes wrong
  }
};

// Helper function to map cholesterol levels to the model's expected input
const mapCholesterol = (cholesterol: 'Normal' | 'Above Normal' | 'Well Above Normal'): number => {
  switch (cholesterol) {
    case 'Normal': return 1;
    case 'Above Normal': return 2;
    case 'Well Above Normal': return 3;
    default: return 1;
  }
};

// Helper function to map glucose levels to the model's expected input
const mapGlucose = (glucose: 'Normal' | 'Above Normal' | 'Well Above Normal'): number => {
  switch (glucose) {
    case 'Normal': return 1;
    case 'Above Normal': return 2;
    case 'Well Above Normal': return 3;
    default: return 1;
  }
};
