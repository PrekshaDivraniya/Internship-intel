# AI Medical Triage System

A comprehensive AI-powered medical triage system built with React, TypeScript, and TensorFlow.js that can assess patient priority levels and provide clinical recommendations.

## 🏥 Features

- **Intelligent Triage Assessment**: AI-powered patient priority classification (Critical, High, Medium, Low)
- **Robust Input Handling**: Handles any input values with validation and preprocessing
- **Real-time Training**: Train machine learning models directly in the browser
- **Professional Medical UI**: Clean, medical-grade interface for healthcare professionals
- **Comprehensive Testing**: Built-in test cases for system validation
- **Analytics Dashboard**: Real-time statistics and visualizations
- **Model Persistence**: Save and load trained models

## 🚀 Quick Start Guide

### Step 1: Start the Application
```bash
npm install
npm run dev
```

### Step 2: Train the AI Model
1. Open the application in your browser
2. Go to the **"Model Training"** tab
3. Click **"Start Training"** button
4. Wait for training to complete (2-3 minutes)
5. Model will be automatically saved

### Step 3: Test the System
1. Go to the **"Test Cases"** tab
2. Click **"Run All Tests"** or test individual cases
3. Observe AI predictions and accuracy

### Step 4: Use Patient Assessment
1. Go to the **"Patient Assessment"** tab
2. Fill out patient information
3. Click **"Assess Patient"** to get AI triage results

## 📋 Test Cases Included

The system includes 8 comprehensive test cases:

1. **Critical Case - Cardiac Emergency**: 65-year-old with chest pain and low oxygen
2. **High Priority - Severe Asthma**: 28-year-old with breathing difficulty
3. **Medium Priority - Diabetic Fever**: 45-year-old diabetic with fever
4. **Low Priority - Minor Injury**: 22-year-old with ankle sprain
5. **Critical Case - Stroke Symptoms**: 72-year-old with neurological symptoms
6. **High Priority - Pregnant Emergency**: 30-year-old pregnant with severe pain
7. **Medium Priority - Elderly Fall**: 78-year-old with possible fracture
8. **Low Priority - Routine Check**: 35-year-old routine consultation

## 🧠 AI Model Architecture

- **Input Features**: 19 medical parameters
- **Architecture**: 4-layer neural network
  - Layer 1: 64 neurons (ReLU + Dropout)
  - Layer 2: 32 neurons (ReLU + Dropout)
  - Layer 3: 16 neurons (ReLU)
  - Output: 4 neurons (Softmax for priority classification)
- **Training**: Adam optimizer with L2 regularization
- **Dataset**: Synthetic medical data (1000+ samples)

## 🔧 Technical Stack

- **Frontend**: React 18 + TypeScript
- **ML Framework**: TensorFlow.js
- **Styling**: Tailwind CSS
- **Charts**: Recharts
- **Icons**: Lucide React
- **Build Tool**: Vite

## 📊 Input Parameters

### Demographics
- Age, Gender, Arrival Method

### Vital Signs
- Heart Rate, Blood Pressure, Temperature
- Oxygen Saturation, Respiratory Rate

### Symptoms (0-10 scale)
- Pain Level, Consciousness Level
- Breathing Difficulty, Nausea, Dizziness

### Medical History
- Heart Disease, Diabetes, Hypertension
- Asthma, Pregnancy Status

### Clinical Information
- Chief Complaint (free text)

## 🛡️ Robust Features

- **Input Validation**: All values validated and clamped to medical ranges
- **Missing Data Handling**: Intelligent defaults for incomplete forms
- **Error Recovery**: Comprehensive error handling
- **Model Persistence**: Browser storage for trained models
- **Real-time Processing**: Instant triage results

## 🎯 Usage Examples

### Example 1: Critical Case
```javascript
{
  age: 65,
  heartRate: 135,
  systolicBP: 85,
  oxygenSaturation: 88,
  painLevel: 9,
  hasHeartDisease: true,
  arrivalMethod: "ambulance"
}
// Expected: Critical Priority
```

### Example 2: Low Priority Case
```javascript
{
  age: 22,
  heartRate: 72,
  systolicBP: 118,
  oxygenSaturation: 99,
  painLevel: 3,
  arrivalMethod: "walk-in"
}
// Expected: Low Priority
```

## 📈 Performance Metrics

- **Training Accuracy**: ~95%+ on synthetic data
- **Inference Time**: <100ms per assessment
- **Model Size**: ~2MB compressed
- **Browser Compatibility**: Modern browsers with WebGL support

## 🔬 Testing & Validation

The system includes comprehensive testing features:
- Pre-built test cases covering all priority levels
- Automated testing suite
- Real-time accuracy monitoring
- Visual result validation

## 🚨 Important Notes

- **For demonstration purposes only**
- **Not for actual medical use**
- **Requires modern browser with JavaScript enabled**
- **TensorFlow.js requires WebGL support**

## 📝 License

This project is for educational and demonstration purposes.

## 🤝 Contributing

Feel free to submit issues and enhancement requests!