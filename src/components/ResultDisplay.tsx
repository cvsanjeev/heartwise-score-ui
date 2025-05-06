
import React from 'react';
import { 
  CardContent, 
  CardFooter 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  HealthData, 
  CalculatedFeatures, 
  PredictionResult 
} from "@/utils/healthCalculations";
import { CircleCheck, CircleX, Calculator } from "lucide-react";

interface ResultDisplayProps {
  healthData: HealthData;
  calculatedFeatures: CalculatedFeatures;
  predictionResult: PredictionResult;
  onReset: () => void;
}

const ResultDisplay = ({
  healthData,
  calculatedFeatures,
  predictionResult,
  onReset
}: ResultDisplayProps) => {
  const { risk, probability } = predictionResult;
  
  return (
    <>
      <CardContent className="space-y-6">
        <div className="bg-secondary/50 rounded-lg p-6 text-center">
          <div className="text-xl font-medium mb-2">Your Cardiovascular Risk Assessment</div>
          
          <div className={`mt-6 mb-4 inline-flex items-center justify-center p-3 rounded-full ${
            risk === 'Low' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
          }`}>
            {risk === 'Low' 
              ? <CircleCheck className="h-12 w-12" />
              : <CircleX className="h-12 w-12" />
            }
          </div>
          
          <div className="text-3xl font-bold mb-1">
            {risk === 0 ? 'Low Risk' : 'High Risk'}
          </div>
          
          <div className="text-xl">
            Risk Score: <span className="font-bold">{probability}%</span>
          </div>
        </div>

        <div className="space-y-6">
          <div className="form-section">
            <h3 className="form-section-title">Calculated Health Metrics</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-3 bg-gray-50 rounded-lg">
                <div className="text-sm text-gray-500">Body Mass Index (BMI)</div>
                <div className="text-xl font-semibold">{calculatedFeatures.bmi}</div>
              </div>
              
              <div className="p-3 bg-gray-50 rounded-lg">
                <div className="text-sm text-gray-500">Pulse Pressure</div>
                <div className="text-xl font-semibold">{calculatedFeatures.pulsePressure} mmHg</div>
              </div>
              
              <div className="p-3 bg-gray-50 rounded-lg">
                <div className="text-sm text-gray-500">Mean Arterial Pressure</div>
                <div className="text-xl font-semibold">{calculatedFeatures.map} mmHg</div>
              </div>
            </div>
          </div>
          
          <div className="form-section">
            <h3 className="form-section-title">Risk Factors Analysis</h3>
            {risk === 'High' ? (
              <div className="space-y-2">
                <p className="text-gray-700">Several factors might be contributing to your elevated risk:</p>
                <ul className="list-disc pl-5 space-y-1 text-gray-600">
                  {healthData.age > 50 && (
                    <li>Age above 50 increases cardiovascular risk</li>
                  )}
                  {healthData.gender === 'Male' && (
                    <li>Men tend to have slightly higher cardiovascular risk</li>
                  )}
                  {healthData.cholesterol !== 'Normal' && (
                    <li>Elevated cholesterol levels</li>
                  )}
                  {healthData.glucose !== 'Normal' && (
                    <li>Elevated glucose levels</li>
                  )}
                  {healthData.smoking && (
                    <li>Smoking significantly increases risk</li>
                  )}
                  {healthData.alcohol && (
                    <li>Regular alcohol consumption</li>
                  )}
                  {!healthData.physicalActivity && (
                    <li>Lack of regular physical activity</li>
                  )}
                  {calculatedFeatures.bmi > 25 && (
                    <li>BMI above recommended range</li>
                  )}
                  {healthData.ap_hi > 130 && (
                    <li>Elevated systolic blood pressure</li>
                  )}
                  {healthData.ap_lo > 85 && (
                    <li>Elevated diastolic blood pressure</li>
                  )}
                </ul>
                <p className="text-gray-700 mt-4">
                  Consider consulting with a healthcare professional to discuss these results.
                </p>
              </div>
            ) : (
              <div>
                <p className="text-gray-700">
                  Your cardiovascular risk appears to be relatively low. Continue maintaining these healthy habits:
                </p>
                <ul className="list-disc pl-5 space-y-1 mt-2 text-gray-600">
                  {!healthData.smoking && (
                    <li>Continued avoidance of smoking</li>
                  )}
                  {!healthData.alcohol && (
                    <li>Moderate or no alcohol consumption</li>
                  )}
                  {healthData.physicalActivity && (
                    <li>Regular physical activity</li>
                  )}
                  {calculatedFeatures.bmi <= 25 && (
                    <li>Healthy body mass index</li>
                  )}
                  {healthData.ap_hi <= 130 && healthData.ap_lo <= 85 && (
                    <li>Well-controlled blood pressure</li>
                  )}
                  {healthData.cholesterol === 'Normal' && (
                    <li>Healthy cholesterol levels</li>
                  )}
                </ul>
                <p className="text-gray-700 mt-4">
                  Remember that this is a screening tool. Regular checkups are still recommended.
                </p>
              </div>
            )}
          </div>
          
          <div className="bg-blue-50 rounded-lg p-4 text-blue-800 text-sm">
            <strong>Note:</strong> This tool provides an estimation based on general risk factors. 
            It does not replace medical advice. Always consult with healthcare professionals for 
            proper diagnosis and personalized recommendations.
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="flex justify-end">
        <Button onClick={onReset} className="bg-health" size="lg">
          <Calculator className="mr-2" size={18} />
          Calculate Again
        </Button>
      </CardFooter>
    </>
  );
};

export default ResultDisplay;
