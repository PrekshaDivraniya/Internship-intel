import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { generateSyntheticData } from '../data/syntheticData';
import { TrainingData } from '../types/medical';
import { Activity, Users, Clock, TrendingUp } from 'lucide-react';

export function Dashboard() {
  const [dashboardData, setDashboardData] = useState<TrainingData[]>([]);
  const [stats, setStats] = useState({
    totalPatients: 0,
    criticalCases: 0,
    averageAge: 0,
    averageWaitTime: 0
  });

  useEffect(() => {
    // Generate sample data for dashboard
    const data = generateSyntheticData(500);
    setDashboardData(data);

    // Calculate statistics
    const totalPatients = data.length;
    const criticalCases = data.filter(p => p.priority === 'critical').length;
    const averageAge = data.reduce((sum, p) => sum + p.age, 0) / totalPatients;
    const waitTimes = { critical: 0, high: 15, medium: 60, low: 120 };
    const averageWaitTime = data.reduce((sum, p) => sum + waitTimes[p.priority], 0) / totalPatients;

    setStats({
      totalPatients,
      criticalCases,
      averageAge: Math.round(averageAge),
      averageWaitTime: Math.round(averageWaitTime)
    });
  }, []);

  // Prepare chart data
  const priorityData = [
    { name: 'Critical', value: dashboardData.filter(p => p.priority === 'critical').length, color: '#ef4444' },
    { name: 'High', value: dashboardData.filter(p => p.priority === 'high').length, color: '#f97316' },
    { name: 'Medium', value: dashboardData.filter(p => p.priority === 'medium').length, color: '#eab308' },
    { name: 'Low', value: dashboardData.filter(p => p.priority === 'low').length, color: '#22c55e' }
  ];

  const ageGroupData = [
    { name: '18-30', critical: 0, high: 0, medium: 0, low: 0 },
    { name: '31-50', critical: 0, high: 0, medium: 0, low: 0 },
    { name: '51-70', critical: 0, high: 0, medium: 0, low: 0 },
    { name: '70+', critical: 0, high: 0, medium: 0, low: 0 }
  ];

  dashboardData.forEach(patient => {
    let ageGroup;
    if (patient.age <= 30) ageGroup = '18-30';
    else if (patient.age <= 50) ageGroup = '31-50';
    else if (patient.age <= 70) ageGroup = '51-70';
    else ageGroup = '70+';

    const group = ageGroupData.find(g => g.name === ageGroup);
    if (group) {
      group[patient.priority as keyof typeof group] += 1;
    }
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center mb-6">
        <Activity className="w-6 h-6 text-blue-600 mr-2" />
        <h2 className="text-2xl font-bold text-gray-800">Triage Analytics Dashboard</h2>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex items-center">
            <Users className="w-8 h-8 text-blue-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Patients</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalPatients}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex items-center">
            <Activity className="w-8 h-8 text-red-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Critical Cases</p>
              <p className="text-2xl font-bold text-gray-900">{stats.criticalCases}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex items-center">
            <TrendingUp className="w-8 h-8 text-green-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Average Age</p>
              <p className="text-2xl font-bold text-gray-900">{stats.averageAge}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex items-center">
            <Clock className="w-8 h-8 text-orange-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Avg Wait Time</p>
              <p className="text-2xl font-bold text-gray-900">{stats.averageWaitTime}m</p>
            </div>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Priority Distribution */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Priority Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={priorityData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {priorityData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Age Group Analysis */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Priority by Age Group</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={ageGroupData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="critical" stackId="a" fill="#ef4444" />
              <Bar dataKey="high" stackId="a" fill="#f97316" />
              <Bar dataKey="medium" stackId="a" fill="#eab308" />
              <Bar dataKey="low" stackId="a" fill="#22c55e" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Cases Table */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Recent Cases Sample</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Age/Gender
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Chief Complaint
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Vitals
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Priority
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Arrival
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {dashboardData.slice(0, 10).map((patient, index) => (
                <tr key={index}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {patient.age}y {patient.gender.charAt(0).toUpperCase()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {patient.chiefComplaint}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    HR:{patient.heartRate} BP:{patient.systolicBP}/{patient.diastolicBP}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      patient.priority === 'critical' ? 'bg-red-100 text-red-800' :
                      patient.priority === 'high' ? 'bg-orange-100 text-orange-800' :
                      patient.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      {patient.priority}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 capitalize">
                    {patient.arrivalMethod}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}