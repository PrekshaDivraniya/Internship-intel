import React, { useState } from 'react';
import { testCases, TestCase } from '../data/testCases';
import { PatientData } from '../types/medical';
import { validateAndCleanInput } from '../utils/dataPreprocessing';
import { Play, CheckCircle, XCircle, Clock } from 'lucide-react';

interface TestingPanelProps {
  onTestCase: (data: PatientData) => void;
  isLoading?: boolean;
}

export function TestingPanel({ onTestCase, isLoading = false }: TestingPanelProps) {
  const [selectedTest, setSelectedTest] = useState<TestCase | null>(null);
  const [testResults, setTestResults] = useState<{[key: string]: 'pass' | 'fail' | 'pending'}>({});

  const runTestCase = (testCase: TestCase) => {
    setSelectedTest(testCase);
    setTestResults(prev => ({ ...prev, [testCase.name]: 'pending' }));
    
    const cleanedData = validateAndCleanInput(testCase.data);
    onTestCase(cleanedData);
  };

  const runAllTests = () => {
    testCases.forEach((testCase, index) => {
      setTimeout(() => {
        runTestCase(testCase);
      }, index * 2000); // 2 second delay between tests
    });
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'text-red-600 bg-red-50 border-red-200';
      case 'high': return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'medium': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'low': return 'text-green-600 bg-green-50 border-green-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getResultIcon = (result: 'pass' | 'fail' | 'pending' | undefined) => {
    switch (result) {
      case 'pass': return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'fail': return <XCircle className="w-5 h-5 text-red-600" />;
      case 'pending': return <Clock className="w-5 h-5 text-yellow-600 animate-spin" />;
      default: return null;
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Test Cases</h2>
        <button
          onClick={runAllTests}
          disabled={isLoading}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Play className="w-4 h-4 mr-2" />
          Run All Tests
        </button>
      </div>

      <div className="space-y-4">
        {testCases.map((testCase, index) => (
          <div key={index} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-3">
                <h3 className="text-lg font-semibold text-gray-800">{testCase.name}</h3>
                {getResultIcon(testResults[testCase.name])}
              </div>
              <div className="flex items-center space-x-3">
                <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getPriorityColor(testCase.expectedPriority)}`}>
                  Expected: {testCase.expectedPriority}
                </span>
                <button
                  onClick={() => runTestCase(testCase)}
                  disabled={isLoading}
                  className="flex items-center px-3 py-1 bg-gray-600 text-white rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                >
                  <Play className="w-3 h-3 mr-1" />
                  Test
                </button>
              </div>
            </div>
            
            <p className="text-gray-600 mb-3">{testCase.description}</p>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
              <div><strong>Age:</strong> {testCase.data.age}</div>
              <div><strong>Gender:</strong> {testCase.data.gender}</div>
              <div><strong>HR:</strong> {testCase.data.heartRate} bpm</div>
              <div><strong>BP:</strong> {testCase.data.systolicBP}/{testCase.data.diastolicBP}</div>
              <div><strong>Temp:</strong> {testCase.data.temperature}°C</div>
              <div><strong>O2 Sat:</strong> {testCase.data.oxygenSaturation}%</div>
              <div><strong>Pain:</strong> {testCase.data.painLevel}/10</div>
              <div><strong>Arrival:</strong> {testCase.data.arrivalMethod}</div>
            </div>
            
            <div className="mt-2 text-sm text-gray-600">
              <strong>Chief Complaint:</strong> {testCase.data.chiefComplaint}
            </div>
          </div>
        ))}
      </div>

      {selectedTest && (
        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <h4 className="font-semibold text-blue-800 mb-2">Currently Testing:</h4>
          <p className="text-blue-700">{selectedTest.name} - {selectedTest.description}</p>
        </div>
      )}
    </div>
  );
}