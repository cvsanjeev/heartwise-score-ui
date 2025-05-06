import React, { useState } from 'react';
import { 
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Heart, Weight, Activity, Calculator, CircleX } from "lucide-react";
import { HealthData, calculateHealthMetrics, predictCardiovascularRisk, CalculatedFeatures, PredictionResult } from "@/utils/healthCalculations";
import ResultDisplay from "./ResultDisplay";
import { toast } from "@/components/ui/use-toast";

const CardiovascularForm = () => {
  const [healthData, setHealthData] = useState<HealthData>({
    age: 40,
    gender: 'Male',
    cholesterol: 'Normal',
    glucose: 'Normal',
    smoking: false,
    alcohol: false,
    physicalActivity: true,
    height: 170,
    weight: 70,
    ap_hi: 120,
    ap_lo: 80
  });

  const [calculatedFeatures, setCalculatedFeatures] = useState<CalculatedFeatures | null>(null);
  const [predictionResult, setPredictionResult] = useState<PredictionResult | null>(null);
  const [showResults, setShowResults] = useState(false);

  const handleChange = (field: keyof HealthData, value: any) => {
    setHealthData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form data
    if (healthData.ap_hi <= healthData.ap_lo) {
      toast({
        title: "Invalid Blood Pressure",
        description: "Systolic pressure must be greater than diastolic pressure.",
        variant: "destructive"
      });
      return;
    }

    if (healthData.age < 18 || healthData.age > 120) {
      toast({
        title: "Invalid Age",
        description: "Age must be between 18 and 120.",
        variant: "destructive"
      });
      return;
    }

    if (healthData.height < 100 || healthData.height > 250) {
      toast({
        title: "Invalid Height",
        description: "Height must be between 100 and 250 cm.",
        variant: "destructive"
      });
      return;
    }

    if (healthData.weight < 30 || healthData.weight > 300) {
      toast({
        title: "Invalid Weight",
        description: "Weight must be between 30 and 300 kg.",
        variant: "destructive"
      });
      return;
    }

    // Calculate derived features
    const features = calculateHealthMetrics(healthData);
    setCalculatedFeatures(features);

    // Get prediction
    const result = predictCardiovascularRisk(healthData, features);
    setPredictionResult(result);

    // Show results
    setShowResults(true);
  };

  const resetForm = () => {
    setShowResults(false);
    setPredictionResult(null);
    setCalculatedFeatures(null);
  };

  // Render either form or results
  return (
    <Card className="w-full max-w-2xl mx-auto animate-fade-in">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-health">
          <Heart className="text-health" size={24} />
          Cardiovascular Risk Prediction
        </CardTitle>
        <CardDescription>
          Enter your health information to calculate your cardiovascular risk
        </CardDescription>
      </CardHeader>

      {!showResults ? (
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-6">
            <div className="form-section">
              <h3 className="form-section-title">Personal Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="form-group">
                  <Label className="form-label">Age (years)</Label>
                  <Input
                    type="number"
                    value={healthData.age}
                    onChange={(e) => handleChange('age', Number(e.target.value))}
                    min="18"
                    max="120"
                    required
                  />
                </div>
                <div className="form-group">
                  <Label className="form-label">Gender</Label>
                  <Select
                    value={healthData.gender}
                    onValueChange={(value) => handleChange('gender', value as 'Male' | 'Female')}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select Gender" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Male">Male</SelectItem>
                      <SelectItem value="Female">Female</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            <div className="form-section">
              <h3 className="form-section-title">Blood Parameters</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="form-group">
                  <Label className="form-label">Cholesterol Level</Label>
                  <Select
                    value={healthData.cholesterol}
                    onValueChange={(value) => handleChange('cholesterol', value as HealthData['cholesterol'])}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select Level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Normal">Normal</SelectItem>
                      <SelectItem value="Above Normal">Above Normal</SelectItem>
                      <SelectItem value="Well Above Normal">Well Above Normal</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="form-group">
                  <Label className="form-label">Glucose Level</Label>
                  <Select
                    value={healthData.glucose}
                    onValueChange={(value) => handleChange('glucose', value as HealthData['glucose'])}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select Level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Normal">Normal</SelectItem>
                      <SelectItem value="Above Normal">Above Normal</SelectItem>
                      <SelectItem value="Well Above Normal">Well Above Normal</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
            
            <div className="form-section">
              <h3 className="form-section-title">Lifestyle Factors</h3>
              <div className="grid grid-cols-1 gap-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <CircleX size={20} className="text-gray-500" />
                    <Label className="form-label m-0">Smoking</Label>
                  </div>
                  <Switch
                    checked={healthData.smoking}
                    onCheckedChange={(checked) => handleChange('smoking', checked)}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="text-gray-500 w-5 h-5"
                    >
                      <path d="M18 12H2"></path>
                      <path d="M13 6a4 4 0 00-4 4v6"></path>
                      <path d="M13 10a4 4 0 004 4h1"></path>
                      <path d="M7 8a2 2 0 14 0Q19 5 22 8"></path>
                    </svg>
                    <Label className="form-label m-0">Alcohol Consumption</Label>
                  </div>
                  <Switch
                    checked={healthData.alcohol}
                    onCheckedChange={(checked) => handleChange('alcohol', checked)}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Activity size={20} className="text-gray-500" />
                    <Label className="form-label m-0">Physical Activity</Label>
                  </div>
                  <Switch
                    checked={healthData.physicalActivity}
                    onCheckedChange={(checked) => handleChange('physicalActivity', checked)}
                  />
                </div>
              </div>
            </div>
            
            <div className="form-section">
              <h3 className="form-section-title">Body Measurements</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="form-group">
                  <Label className="form-label flex items-center gap-1">
                    <Weight size={16} />
                    Height (cm)
                  </Label>
                  <Input
                    type="number"
                    value={healthData.height}
                    onChange={(e) => handleChange('height', Number(e.target.value))}
                    min="100"
                    max="250"
                    required
                  />
                </div>
                <div className="form-group">
                  <Label className="form-label flex items-center gap-1">
                    <Weight size={16} />
                    Weight (kg)
                  </Label>
                  <Input
                    type="number"
                    value={healthData.weight}
                    onChange={(e) => handleChange('weight', Number(e.target.value))}
                    min="30"
                    max="300"
                    required
                  />
                </div>
              </div>
            </div>
            
            <div className="form-section">
              <h3 className="form-section-title flex items-center gap-1">
                <Heart size={20} className="text-gray-500" />
                Blood Pressure
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="form-group">
                  <Label className="form-label">Systolic (ap_hi)</Label>
                  <Input
                    type="number"
                    value={healthData.ap_hi}
                    onChange={(e) => handleChange('ap_hi', Number(e.target.value))}
                    min="70"
                    max="250"
                    required
                  />
                </div>
                <div className="form-group">
                  <Label className="form-label">Diastolic (ap_lo)</Label>
                  <Input
                    type="number"
                    value={healthData.ap_lo}
                    onChange={(e) => handleChange('ap_lo', Number(e.target.value))}
                    min="40"
                    max="150"
                    required
                  />
                </div>
              </div>
            </div>
          </CardContent>
          
          <CardFooter className="flex justify-end">
            <Button type="submit" className="bg-health" size="lg">
              <Calculator className="mr-2" size={18} />
              Predict Risk
            </Button>
          </CardFooter>
        </form>
      ) : (
        <ResultDisplay
          healthData={healthData}
          calculatedFeatures={calculatedFeatures!}
          predictionResult={predictionResult!}
          onReset={resetForm}
        />
      )}
    </Card>
  );
};

export default CardiovascularForm;
