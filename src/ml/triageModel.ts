import * as tf from '@tensorflow/tfjs';
import { PatientData, TriageResult, TrainingData } from '../types/medical';
import { normalizePatientData } from '../utils/dataPreprocessing';

export class TriageModel {
  private model: tf.Sequential | null = null;
  private isTraining = false;
  private trainingHistory: any[] = [];

  async createModel(): Promise<tf.Sequential> {
    const model = tf.sequential({
      layers: [
        tf.layers.dense({
          inputShape: [19], // Number of input features
          units: 64,
          activation: 'relu',
          kernelRegularizer: tf.regularizers.l2({ l2: 0.01 })
        }),
        tf.layers.dropout({ rate: 0.3 }),
        tf.layers.dense({
          units: 32,
          activation: 'relu',
          kernelRegularizer: tf.regularizers.l2({ l2: 0.01 })
        }),
        tf.layers.dropout({ rate: 0.2 }),
        tf.layers.dense({
          units: 16,
          activation: 'relu'
        }),
        tf.layers.dense({
          units: 4, // 4 priority levels
          activation: 'softmax'
        })
      ]
    });

    model.compile({
      optimizer: tf.train.adam(0.001),
      loss: 'categoricalCrossentropy',
      metrics: ['accuracy']
    });

    return model;
  }

  async trainModel(
    trainingData: TrainingData[],
    onProgress?: (epoch: number, logs: any) => void
  ): Promise<void> {
    if (this.isTraining) {
      throw new Error('Model is already training');
    }

    this.isTraining = true;
    
    try {
      // Prepare training data
      const features = trainingData.map(data => normalizePatientData(data));
      const labels = trainingData.map(data => this.priorityToOneHot(data.priority));

      const xs = tf.tensor2d(features);
      const ys = tf.tensor2d(labels);

      // Create model if not exists
      if (!this.model) {
        this.model = await this.createModel();
      }

      // Train the model
      const history = await this.model.fit(xs, ys, {
        epochs: 100,
        batchSize: 32,
        validationSplit: 0.2,
        shuffle: true,
        callbacks: {
          onEpochEnd: (epoch, logs) => {
            if (onProgress) {
              onProgress(epoch, logs);
            }
            this.trainingHistory.push({ epoch, ...logs });
          }
        }
      });

      // Clean up tensors
      xs.dispose();
      ys.dispose();

      console.log('Model training completed');
    } finally {
      this.isTraining = false;
    }
  }

  async predict(patientData: PatientData): Promise<TriageResult> {
    if (!this.model) {
      throw new Error('Model not trained yet. Please train the model first in the Model Training tab.');
    }

    console.log('Making prediction with patient data:', patientData);
    
    const features = normalizePatientData(patientData);
    console.log('Normalized features:', features);
    
    const input = tf.tensor2d([features]);
    
    const prediction = this.model.predict(input) as tf.Tensor;
    const probabilities = await prediction.data();
    console.log('Model probabilities:', probabilities);
    
    // Clean up tensors
    input.dispose();
    prediction.dispose();

    // Convert probabilities to result
    const priorities = ['critical', 'high', 'medium', 'low'] as const;
    const maxIndex = probabilities.indexOf(Math.max(...probabilities));
    const priority = priorities[maxIndex];
    const confidence = probabilities[maxIndex];

    // Calculate score (0-100)
    const score = Math.round(confidence * 100);

    // Generate recommendations
    const recommendations = this.generateRecommendations(patientData, priority);

    // Estimate wait time based on priority
    const waitTimes = { critical: 0, high: 15, medium: 60, low: 120 };
    const estimatedWaitTime = waitTimes[priority];

    const result = {
      priority,
      score,
      recommendations,
      estimatedWaitTime,
      confidence
    };
    
    console.log('Prediction result:', result);
    return {
      priority,
      score,
      recommendations,
      estimatedWaitTime,
      confidence
    };
  }

  private priorityToOneHot(priority: string): number[] {
    const priorities = ['critical', 'high', 'medium', 'low'];
    const index = priorities.indexOf(priority);
    const oneHot = [0, 0, 0, 0];
    oneHot[index] = 1;
    return oneHot;
  }

  private generateRecommendations(data: PatientData, priority: string): string[] {
    const recommendations: string[] = [];

    if (priority === 'critical') {
      recommendations.push('Immediate medical attention required');
      recommendations.push('Prepare for emergency intervention');
      if (data.oxygenSaturation < 90) {
        recommendations.push('Administer oxygen therapy');
      }
      if (data.consciousnessLevel < 5) {
        recommendations.push('Monitor airway and breathing');
      }
    } else if (priority === 'high') {
      recommendations.push('Urgent medical evaluation needed');
      recommendations.push('Monitor vital signs closely');
      if (data.painLevel > 7) {
        recommendations.push('Consider pain management');
      }
      if (data.hasHeartDisease && data.heartRate > 100) {
        recommendations.push('Cardiac monitoring recommended');
      }
    } else if (priority === 'medium') {
      recommendations.push('Medical evaluation within 1 hour');
      recommendations.push('Continue monitoring symptoms');
      if (data.temperature > 38.5) {
        recommendations.push('Monitor for fever progression');
      }
    } else {
      recommendations.push('Routine medical consultation');
      recommendations.push('Patient can wait in general area');
      recommendations.push('Provide comfort measures as needed');
    }

    return recommendations;
  }

  getTrainingHistory(): any[] {
    return this.trainingHistory;
  }

  isModelTraining(): boolean {
    return this.isTraining;
  }

  async saveModel(): Promise<void> {
    if (this.model) {
      await this.model.save('localstorage://triage-model');
    }
  }

  async loadModel(): Promise<boolean> {
    try {
      this.model = await tf.loadLayersModel('localstorage://triage-model') as tf.Sequential;
      return true;
    } catch (error) {
      console.log('No saved model found, will need to train new model');
      return false;
    }
  }
}