
import React from 'react';
import CardiovascularForm from "@/components/CardiovascularForm";
import { Heart } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <div className="container px-4 py-10">
        <header className="mb-8 text-center">
          <div className="mb-4 flex justify-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-health text-white p-4">
              <Heart size={32} />
            </div>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">HeartWise Score</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Use this tool to assess your cardiovascular health risk based on key indicators
          </p>
        </header>
        <main>
          <CardiovascularForm />
        </main>
        <footer className="mt-10 text-center text-sm text-gray-500">
          <p>
            This tool is for educational purposes only and should not replace professional medical advice.
          </p>
          <p className="mt-2">
            © {new Date().getFullYear()} HeartWise Score
          </p>
        </footer>
      </div>
    </div>
  );
};

export default Index;
