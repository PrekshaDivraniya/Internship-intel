import React, { useState } from 'react';
import { PatientData } from '../types/medical';
import { validateAndCleanInput } from '../utils/dataPreprocessing';
import { User, Heart, Thermometer, Activity, Stethoscope } from 'lucide-react';

interface PatientFormProps {
  onSubmit: (data: PatientData) => void;
  isLoading?: boolean;
}

export function PatientForm({ onSubmit, isLoading = false }: PatientFormProps) {
  const [formData, setFormData] = useState<Partial<PatientData>>({
    age: 30,
    gender: 'other',
    heartRate: 70,
    systolicBP: 120,
    diastolicBP: 80,
    temperature: 36.5,
    oxygenSaturation: 98,
    respiratoryRate: 16,
    painLevel: 0,
    consciousnessLevel: 10,
    breathingDifficulty: 0,
    nausea: 0,
    dizziness: 0,
    hasHeartDisease: false,
    hasDiabetes: false,
    hasHypertension: false,
    hasAsthma: false,
    isPregnant: false,
    arrivalMethod: 'walk-in',
    chiefComplaint: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted with data:', formData);
    const cleanedData = validateAndCleanInput(formData);
    console.log('Cleaned data:', cleanedData);
    onSubmit(cleanedData);
  };

  const handleInputChange = (field: keyof PatientData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex items-center mb-6">
        <User className="w-6 h-6 text-blue-600 mr-2" />
        <h2 className="text-2xl font-bold text-gray-800">Patient Assessment</h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Demographics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Age
            </label>
            <input
              type="number"
              min="0"
              max="120"
              value={formData.age || ''}
              onChange={(e) => handleInputChange('age', parseInt(e.target.value) || 0)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Gender
            </label>
            <select
              value={formData.gender || 'other'}
              onChange={(e) => handleInputChange('gender', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Arrival Method
            </label>
            <select
              value={formData.arrivalMethod || 'walk-in'}
              onChange={(e) => handleInputChange('arrivalMethod', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="walk-in">Walk-in</option>
              <option value="wheelchair">Wheelchair</option>
              <option value="ambulance">Ambulance</option>
              <option value="stretcher">Stretcher</option>
            </select>
          </div>
        </div>

        {/* Vital Signs */}
        <div className="border-t pt-6">
          <div className="flex items-center mb-4">
            <Heart className="w-5 h-5 text-red-500 mr-2" />
            <h3 className="text-lg font-semibold text-gray-800">Vital Signs</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Heart Rate (bpm)
              </label>
              <input
                type="number"
                min="30"
                max="200"
                value={formData.heartRate || ''}
                onChange={(e) => handleInputChange('heartRate', parseInt(e.target.value) || 0)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Systolic BP (mmHg)
              </label>
              <input
                type="number"
                min="70"
                max="250"
                value={formData.systolicBP || ''}
                onChange={(e) => handleInputChange('systolicBP', parseInt(e.target.value) || 0)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Diastolic BP (mmHg)
              </label>
              <input
                type="number"
                min="40"
                max="150"
                value={formData.diastolicBP || ''}
                onChange={(e) => handleInputChange('diastolicBP', parseInt(e.target.value) || 0)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Temperature (°C)
              </label>
              <input
                type="number"
                step="0.1"
                min="35"
                max="42"
                value={formData.temperature || ''}
                onChange={(e) => handleInputChange('temperature', parseFloat(e.target.value) || 0)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Oxygen Saturation (%)
              </label>
              <input
                type="number"
                min="70"
                max="100"
                value={formData.oxygenSaturation || ''}
                onChange={(e) => handleInputChange('oxygenSaturation', parseInt(e.target.value) || 0)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Respiratory Rate (breaths/min)
              </label>
              <input
                type="number"
                min="8"
                max="40"
                value={formData.respiratoryRate || ''}
                onChange={(e) => handleInputChange('respiratoryRate', parseInt(e.target.value) || 0)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Symptoms */}
        <div className="border-t pt-6">
          <div className="flex items-center mb-4">
            <Activity className="w-5 h-5 text-orange-500 mr-2" />
            <h3 className="text-lg font-semibold text-gray-800">Symptoms (0-10 scale)</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { field: 'painLevel', label: 'Pain Level' },
              { field: 'consciousnessLevel', label: 'Consciousness Level' },
              { field: 'breathingDifficulty', label: 'Breathing Difficulty' },
              { field: 'nausea', label: 'Nausea' },
              { field: 'dizziness', label: 'Dizziness' }
            ].map(({ field, label }) => (
              <div key={field}>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {label}
                </label>
                <input
                  type="range"
                  min="0"
                  max="10"
                  value={formData[field as keyof PatientData] as number || 0}
                  onChange={(e) => handleInputChange(field as keyof PatientData, parseInt(e.target.value))}
                  className="w-full"
                />
                <div className="text-center text-sm text-gray-600">
                  {formData[field as keyof PatientData] as number || 0}/10
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Medical History */}
        <div className="border-t pt-6">
          <div className="flex items-center mb-4">
            <Stethoscope className="w-5 h-5 text-green-500 mr-2" />
            <h3 className="text-lg font-semibold text-gray-800">Medical History</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { field: 'hasHeartDisease', label: 'Heart Disease' },
              { field: 'hasDiabetes', label: 'Diabetes' },
              { field: 'hasHypertension', label: 'Hypertension' },
              { field: 'hasAsthma', label: 'Asthma' },
              { field: 'isPregnant', label: 'Pregnant' }
            ].map(({ field, label }) => (
              <div key={field} className="flex items-center">
                <input
                  type="checkbox"
                  id={field}
                  checked={formData[field as keyof PatientData] as boolean || false}
                  onChange={(e) => handleInputChange(field as keyof PatientData, e.target.checked)}
                  className="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor={field} className="text-sm font-medium text-gray-700">
                  {label}
                </label>
              </div>
            ))}
          </div>
        </div>

        {/* Chief Complaint */}
        <div className="border-t pt-6">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Chief Complaint
          </label>
          <textarea
            value={formData.chiefComplaint || ''}
            onChange={(e) => handleInputChange('chiefComplaint', e.target.value)}
            placeholder="Describe the main reason for the visit..."
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed font-medium transition-colors"
        >
          {isLoading ? 'Analyzing...' : 'Assess Patient'}
        </button>
        
        {isLoading && (
          <div className="mt-4 text-center">
            <div className="inline-flex items-center px-4 py-2 bg-blue-50 border border-blue-200 rounded-md">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>
              <span className="text-blue-700 text-sm">AI is analyzing patient data...</span>
            </div>
          </div>
        )}
      </form>
    </div>
  );
}