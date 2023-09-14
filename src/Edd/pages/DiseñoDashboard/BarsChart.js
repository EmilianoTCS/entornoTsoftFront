import { Bar } from 'react-chartjs-2';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);
var Florencia = [56, 65, 32, 20, 88, 65];
var Emiliano = [56, 32, 80, 54, 25, 12];
var Daniela = [41, 10, 32, 54, 12, 45];
var Juan = [45, 76, 54, 12, 45, 32, 78];
const labels = ['Marcelo cortes ortega', 'Ramigo Gomez', 'Romina Alvarez', 'Josefina Perez', 'Fatima Gonzales', 'Esteban Ramirez'];

export const data = {
  labels,
  datasets: [
    {
      label: 'Florencia Lorenzati',
      data: Florencia,
      backgroundColor: '#82E0AA',
    },
    {
      label: 'Emiliano Sotomayor',
      data: Emiliano,
      backgroundColor: '#efd36b',
    },
    {
      label: 'Daniela',
      data: Daniela,
      backgroundColor: 'rgba(53, 162, 235, 0.5)',
    },
    {
      label: 'Juan',
      data: Juan,
      backgroundColor: 'rgba(255, 99, 132, 0.5)',
    },
  ],
};
export const options = {
  type: 'bar',
  data,
  options: {
    scales: {
      y: {
        beginAtZero: true,
      },
    },
   
  },
  plugins:[ChartDataLabels]
};







export default function Bars() {
  return <Bar data={data} options={options} />
}
