import React, { useState } from 'react';
import { PatientForm } from './components/PatientForm';
import { TriageResult } from './components/TriageResult';
import { ModelTraining } from './components/ModelTraining';
import { TestingPanel } from './components/TestingPanel';
import { Dashboard } from './components/Dashboard';
import { TriageModel } from './ml/triageModel';
import { PatientData, TriageResult as TriageResultType } from './types/medical';
import { Heart, Brain, BarChart3, FileText, TestTube } from 'lucide-react';

function App() {
  const [activeTab, setActiveTab] = useState<'assess' | 'train' | 'test' | 'dashboard'>('train');
  const [triageModel] = useState(() => new TriageModel());
  const [isModelReady, setIsModelReady] = useState(false);
  const [currentResult, setCurrentResult] = useState<TriageResultType | null>(null);
  const [isAssessing, setIsAssessing] = useState(false);

  const handlePatientAssessment = async (patientData: PatientData) => {
    console.log('handlePatientAssessment called with:', patientData);
    
    if (!isModelReady) {
      alert('Please train the model first before making assessments.');
      setActiveTab('train');
      return;
    }

    setIsAssessing(true);
    setCurrentResult(null); // Clear previous result
    
    try {
      console.log('Starting prediction...');
      const result = await triageModel.predict(patientData);
      console.log('Prediction completed:', result);
      setCurrentResult(result);
    } catch (error) {
      console.error('Assessment failed:', error);
      alert(`Assessment failed: ${error instanceof Error ? error.message : 'Unknown error'}. Please try again.`);
    } finally {
      setIsAssessing(false);
    }
  };

  const handleTrainingComplete = () => {
    console.log('Training completed, setting model as ready');
    setIsModelReady(true);
    alert('Model training completed successfully! You can now assess patients.');
    // Don't automatically switch tabs, let user choose
  };

  const tabs = [
    { id: 'assess', label: 'Patient Assessment', icon: Heart },
    { id: 'train', label: 'Model Training', icon: Brain },
    { id: 'test', label: 'Test Cases', icon: TestTube },
    { id: 'dashboard', label: 'Analytics', icon: BarChart3 }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <Heart className="w-8 h-8 text-red-500 mr-3" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">AI Triage System</h1>
                <p className="text-sm text-gray-600">Intelligent Emergency Department Triage with ML</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                isModelReady 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-yellow-100 text-yellow-800'
              }`}>
                {isModelReady ? 'Model Ready' : 'Model Not Trained'}
              </div>
              {isModelReady && (
                <div className="px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                  TensorFlow.js Active
                </div>
              )}
              <div className="text-sm text-gray-500">
                Step {!isModelReady ? '1' : activeTab === 'assess' ? '3' : activeTab === 'test' ? '4' : '2'} of 4
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center px-3 py-4 text-sm font-medium border-b-2 transition-colors ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon className="w-4 h-4 mr-2" />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'assess' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <PatientForm 
              onSubmit={handlePatientAssessment} 
              isLoading={isAssessing}
            />
            {currentResult && (
              <TriageResult result={currentResult} />
            )}
            {!currentResult && (
              <div className="bg-white rounded-lg shadow-lg p-6 flex items-center justify-center">
                <div className="text-center text-gray-500">
                  <FileText className="w-16 h-16 mx-auto mb-4 opacity-50" />
                  <p className="text-lg font-medium">Assessment Results</p>
                  <p className="text-sm">Complete the patient form to see triage results</p>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'test' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <TestingPanel 
              onTestCase={handlePatientAssessment} 
              isLoading={isAssessing}
            />
            {currentResult && (
              <TriageResult result={currentResult} />
            )}
          </div>
        )}

        {activeTab === 'train' && (
          <div className="max-w-4xl mx-auto">
            <ModelTraining 
              model={triageModel} 
              onTrainingComplete={handleTrainingComplete}
            />
          </div>
        )}

        {activeTab === 'dashboard' && <Dashboard />}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="text-center text-sm text-gray-600">
            <p>AI Triage System - Built with TensorFlow.js, React & TypeScript</p>
            <p className="mt-1">For demonstration purposes only. Not for actual medical use.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;