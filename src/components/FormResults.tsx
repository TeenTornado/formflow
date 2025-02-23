import React from 'react';
import { Bar, Doughnut, Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement,
} from 'chart.js';
import { Form } from '../types/form';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement
);

interface FormResultsProps {
  form: Form;
  onBack: () => void;
}

export default function FormResults({ form, onBack }: FormResultsProps) {
  // Sample data - in a real app, this would come from your backend
  const metrics = {
    views: 150,
    starts: 120,
    submissions: 100,
    completionRate: 83,
    averageTime: '2:30',
    deviceBreakdown: {
      desktop: 60,
      mobile: 35,
      tablet: 5,
    },
    timeData: {
      labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      submissions: [12, 19, 15, 25, 22, 18, 15],
    },
  };

  return (
    <div className="p-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-6">
          <button
            onClick={onBack}
            className="text-gray-600 hover:text-gray-900 mb-4"
          >
            ← Back to form
          </button>
          <h1 className="text-2xl font-bold mb-2">{form.title} - Results</h1>
          <div className="text-sm text-gray-500">
            Last updated: {new Date().toLocaleDateString()}
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Total Views', value: metrics.views },
            { label: 'Form Starts', value: metrics.starts },
            { label: 'Submissions', value: metrics.submissions },
            { label: 'Completion Rate', value: `${metrics.completionRate}%` },
          ].map((metric, index) => (
            <div
              key={index}
              className="bg-white p-6 rounded-lg shadow-sm border border-gray-200"
            >
              <div className="text-sm text-gray-500 mb-1">{metric.label}</div>
              <div className="text-2xl font-bold">{metric.value}</div>
            </div>
          ))}
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Submissions Over Time */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h3 className="text-lg font-semibold mb-4">Submissions Over Time</h3>
            <Line
              data={{
                labels: metrics.timeData.labels,
                datasets: [
                  {
                    label: 'Submissions',
                    data: metrics.timeData.submissions,
                    borderColor: 'rgb(147, 51, 234)',
                    tension: 0.3,
                  },
                ],
              }}
              options={{
                responsive: true,
                plugins: {
                  legend: {
                    display: false,
                  },
                },
              }}
            />
          </div>

          {/* Device Breakdown */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h3 className="text-lg font-semibold mb-4">Device Breakdown</h3>
            <div className="h-64">
              <Doughnut
                data={{
                  labels: ['Desktop', 'Mobile', 'Tablet'],
                  datasets: [
                    {
                      data: [
                        metrics.deviceBreakdown.desktop,
                        metrics.deviceBreakdown.mobile,
                        metrics.deviceBreakdown.tablet,
                      ],
                      backgroundColor: [
                        'rgb(147, 51, 234)',
                        'rgb(192, 132, 252)',
                        'rgb(216, 180, 254)',
                      ],
                    },
                  ],
                }}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                }}
              />
            </div>
          </div>
        </div>

        {/* Response Details */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-6">
            <h3 className="text-lg font-semibold mb-4">Question Responses</h3>
            {form.elements.map((element, index) => (
              <div key={element.id} className="mb-8 last:mb-0">
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center text-purple-600 font-medium">
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium mb-2">{element.question}</h4>
                    {element.type === 'multipleChoice' && (
                      <div className="space-y-4">
                        <Bar
                          data={{
                            labels: element.options,
                            datasets: [
                              {
                                data: element.options?.map(
                                  () => Math.floor(Math.random() * 100)
                                ),
                                backgroundColor: 'rgb(147, 51, 234)',
                              },
                            ],
                          }}
                          options={{
                            indexAxis: 'y',
                            plugins: {
                              legend: {
                                display: false,
                              },
                            },
                          }}
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}