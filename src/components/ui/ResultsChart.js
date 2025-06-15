import React from 'react';
import { Bar } from 'react-chartjs-2';
import { 
  Chart as ChartJS, 
  CategoryScale, 
  LinearScale, 
  BarElement, 
  Title, 
  Tooltip, 
  Legend 
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export default function ResultsChart({ position, results }) {
  if (!position || !results) return null;

  const candidates = results.candidates || [];
  
  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: true,
        text: position.title,
        font: {
          size: 16
        }
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            return `${context.dataset.label}: ${context.parsed.y} votes (${candidates[context.dataIndex].percentage}%)`;
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Votes'
        }
      }
    }
  };
  
  const data = {
    labels: candidates.map(c => c.name),
    datasets: [
      {
        label: 'Votes',
        data: candidates.map(c => c.votes),
        backgroundColor: candidates.map((_, i) => 
          `hsl(${(i * 137) % 360}, 70%, 60%)` // Different colors for each candidate
        ),
        borderWidth: 1,
      }
    ],
  };

  return (
    <div style={{ height: '300px' }}>
      <Bar options={options} data={data} />
    </div>
  );
}