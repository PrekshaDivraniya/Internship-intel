import React, { useState, useEffect } from 'react';
import { TriageModel } from '../ml/triageModel';
import { generateSyntheticData } from '../data/syntheticData';
import { Brain, Play, Save, BarChart3 } from 'lucide-react';

interface ModelTrainingProps {
  model: TriageModel;
  onTrainingComplete: () => void;
}

export function ModelTraining({ model, onTrainingComplete }: ModelTrainingProps) {
  const [isTraining, setIsTraining] = useState(false);
  const [trainingProgress, setTrainingProgress] = useState(0);
  const [trainingLogs, setTrainingLogs] = useState<any[]>([]);
  const [datasetSize, setDatasetSize] = useState(1000);

  const startTraining = async () => {
    setIsTraining(true);
    setTrainingProgress(0);
    setTrainingLogs([]);

    try {
      // Generate synthetic data
      console.log('Generating training data...');
      const trainingData = generateSyntheticData(datasetSize);
      console.log(`Generated ${trainingData.length} training samples`);
      
      // Train the model
      console.log('Starting model training...');
      await model.trainModel(trainingData, (epoch, logs) => {
        setTrainingProgress(((epoch + 1) / 100) * 100);
        setTrainingLogs(prev => [...prev.slice(-10), { epoch: epoch + 1, ...logs }]);
      });

      // Save the trained model
      console.log('Saving trained model...');
      await model.saveModel();
      console.log('Model saved successfully');
      
      onTrainingComplete();
    } catch (error) {
      console.error('Training failed:', error);
      alert(`Training failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsTraining(false);
    }
  };

  const loadExistingModel = async () => {
    console.log('Attempting to load existing model...');
    const loaded = await model.loadModel();
    if (loaded) {
      console.log('Model loaded successfully');
      onTrainingComplete();
    } else {
      console.log('No existing model found');
    }
  };

  useEffect(() => {
    // Try to load existing model on component mount
    loadExistingModel();
  }, []);

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex items-center mb-6">
        <Brain className="w-6 h-6 text-purple-600 mr-2" />
        <h2 className="text-2xl font-bold text-gray-800">Model Training</h2>
      </div>

      <div className="space-y-6">
        {/* Dataset Configuration */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Training Dataset Size
          </label>
          <input
            type="number"
            min="100"
            max="10000"
            step="100"
            value={datasetSize}
            onChange={(e) => setDatasetSize(parseInt(e.target.value))}
            disabled={isTraining}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:opacity-50"
          />
          <p className="text-sm text-gray-600 mt-1">
            Larger datasets provide better accuracy but take longer to train
          </p>
        </div>

        {/* Training Controls */}
        <div className="flex space-x-4">
          <button
            onClick={startTraining}
            disabled={isTraining}
            className="flex items-center px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Play className="w-4 h-4 mr-2" />
            {isTraining ? 'Training...' : 'Start Training'}
          </button>
          
          <button
            onClick={loadExistingModel}
            disabled={isTraining}
            className="flex items-center px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Save className="w-4 h-4 mr-2" />
            Load Saved Model
          </button>
        </div>

        {/* Training Progress */}
        {isTraining && (
          <div>
            <div className="flex justify-between text-sm text-gray-600 mb-2">
              <span>Training Progress</span>
              <span>{Math.round(trainingProgress)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-purple-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${trainingProgress}%` }}
              ></div>
            </div>
          </div>
        )}

        {/* Training Logs */}
        {trainingLogs.length > 0 && (
          <div>
            <div className="flex items-center mb-3">
              <BarChart3 className="w-5 h-5 text-blue-600 mr-2" />
              <h3 className="text-lg font-semibold text-gray-800">Training Metrics</h3>
            </div>
            <div className="bg-gray-50 rounded-lg p-4 max-h-64 overflow-y-auto">
              <div className="grid grid-cols-4 gap-4 text-sm font-medium text-gray-600 mb-2">
                <span>Epoch</span>
                <span>Loss</span>
                <span>Accuracy</span>
                <span>Val Accuracy</span>
              </div>
              {trainingLogs.slice(-10).map((log, index) => (
                <div key={index} className="grid grid-cols-4 gap-4 text-sm text-gray-800 py-1">
                  <span>{log.epoch}</span>
                  <span>{log.loss?.toFixed(4) || 'N/A'}</span>
                  <span>{log.acc ? (log.acc * 100).toFixed(1) + '%' : 'N/A'}</span>
                  <span>{log.val_acc ? (log.val_acc * 100).toFixed(1) + '%' : 'N/A'}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Model Information */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h4 className="font-semibold text-blue-800 mb-2">Model Architecture</h4>
          <ul className="text-sm text-blue-700 space-y-1">
            <li>• Input Layer: 19 features (demographics, vitals, symptoms, history)</li>
            <li>• Hidden Layer 1: 64 neurons with ReLU activation</li>
            <li>• Hidden Layer 2: 32 neurons with ReLU activation</li>
            <li>• Hidden Layer 3: 16 neurons with ReLU activation</li>
            <li>• Output Layer: 4 neurons (Critical, High, Medium, Low priority)</li>
            <li>• Optimizer: Adam with learning rate 0.001</li>
            <li>• Regularization: L2 regularization and dropout layers</li>
          </ul>
        </div>
      </div>
    </div>
  );
}