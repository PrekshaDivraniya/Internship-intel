import React from 'react';
import { TriageResult as TriageResultType } from '../types/medical';
import { AlertTriangle, Clock, CheckCircle, AlertCircle } from 'lucide-react';

interface TriageResultProps {
  result: TriageResultType;
}

export function TriageResult({ result }: TriageResultProps) {
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'bg-red-100 border-red-500 text-red-800';
      case 'high': return 'bg-orange-100 border-orange-500 text-orange-800';
      case 'medium': return 'bg-yellow-100 border-yellow-500 text-yellow-800';
      case 'low': return 'bg-green-100 border-green-500 text-green-800';
      default: return 'bg-gray-100 border-gray-500 text-gray-800';
    }
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'critical': return <AlertTriangle className="w-6 h-6" />;
      case 'high': return <AlertCircle className="w-6 h-6" />;
      case 'medium': return <Clock className="w-6 h-6" />;
      case 'low': return <CheckCircle className="w-6 h-6" />;
      default: return <Clock className="w-6 h-6" />;
    }
  };

  const formatWaitTime = (minutes: number) => {
    if (minutes === 0) return 'Immediate';
    if (minutes < 60) return `${minutes} minutes`;
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return remainingMinutes > 0 ? `${hours}h ${remainingMinutes}m` : `${hours} hour${hours > 1 ? 's' : ''}`;
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Triage Assessment Result</h2>
      
      {/* Priority Badge */}
      <div className={`border-l-4 p-4 mb-6 ${getPriorityColor(result.priority)}`}>
        <div className="flex items-center">
          {getPriorityIcon(result.priority)}
          <div className="ml-3">
            <h3 className="text-lg font-semibold capitalize">
              {result.priority} Priority
            </h3>
            <p className="text-sm">
              Confidence: {Math.round(result.confidence * 100)}% | Score: {result.score}/100
            </p>
          </div>
        </div>
      </div>

      {/* Wait Time */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
        <div className="flex items-center">
          <Clock className="w-5 h-5 text-blue-600 mr-2" />
          <div>
            <h4 className="font-semibold text-blue-800">Estimated Wait Time</h4>
            <p className="text-blue-700">{formatWaitTime(result.estimatedWaitTime)}</p>
          </div>
        </div>
      </div>

      {/* Recommendations */}
      <div className="space-y-4">
        <h4 className="text-lg font-semibold text-gray-800">Clinical Recommendations</h4>
        <div className="space-y-2">
          {result.recommendations.map((recommendation, index) => (
            <div key={index} className="flex items-start">
              <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
              <p className="text-gray-700">{recommendation}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Priority Guidelines */}
      <div className="mt-6 pt-6 border-t border-gray-200">
        <h4 className="text-sm font-semibold text-gray-600 mb-3">Priority Guidelines</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
          <div className="flex items-center">
            <div className="w-3 h-3 bg-red-500 rounded mr-2"></div>
            <span className="text-gray-600">Critical: Life-threatening, immediate care</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-orange-500 rounded mr-2"></div>
            <span className="text-gray-600">High: Urgent, within 15 minutes</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-yellow-500 rounded mr-2"></div>
            <span className="text-gray-600">Medium: Semi-urgent, within 1 hour</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-green-500 rounded mr-2"></div>
            <span className="text-gray-600">Low: Non-urgent, within 2 hours</span>
          </div>
        </div>
      </div>
    </div>
  );
}