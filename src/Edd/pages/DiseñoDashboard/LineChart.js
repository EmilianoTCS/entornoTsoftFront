// import { Line } from 'react-chartjs-2';
// import {
//     Chart as ChartJS,
//     CategoryScale,
//     LinearScale,
//     PointElement,
//     LineElement,
//     Title,
//     Tooltip,
//     Legend,
//     Filler,
// } from 'chart.js';

// ChartJS.register(
//     CategoryScale,
//     LinearScale,
//     PointElement,
//     LineElement,
//     Title,
//     Tooltip,
//     Legend,
//     Filler
// );

// var General = [15, 30, 55, 50, 55, 60, 20, 45, 15, 55, 40, 40];

// var Joaquín = [10, 50, 20, 30, 80, 40, 30, 20, 20, 30, 10, 60];
// var Marco = [20, 10, 90, 70, 30, 80, 10, 70, 10, 80, 70, 20];
// var meses = ["AUTONOMIA", "CAPACIDAD ANALITICA", "CAPACIDAD DE APRENDIZAJE", "COMUNICACIÓN", "CONFIANZA", "DESEMPEÑO", "DISPOSICION/ACTITUD", "EMPODERAMIENTO"];

// var midata = {
//     labels: meses,
//     datasets: [ // Cada una de las líneas del gráfico
//         {
//             label: 'Joaquín Aguirre',
//             data: Joaquín,
//             borderColor: 'green',
//             backgroundColor: 'green',
//             pointRadius: 5,
//             pointBorderColor: 'green',
//             pointBackgroundColor: 'green',
//         },
//         {
//             label: 'Marco Díaz',
//             data: Marco,
//             borderColor: 'red',
//             backgroundColor: 'red',
//             pointRadius: 5,
//             pointBorderColor: 'red',
//             pointBackgroundColor: 'red',
//         },
//         {
//             label: 'General',
//             data: General,
//             borderColor: 'blue',
//             backgroundColor: 'blue',
//             pointRadius: 5,
//             pointBorderColor: 'blue',
//             pointBackgroundColor: 'blue',
//         },
        
//     ],
// };

// var misoptions = {
//     responsive: true,
//     scales: {
//         y: {
//             min: 0
//         },
//         x: {
//             ticks: { color: 'black' }
//         }
//     }
// };

// export default function LinesChart() {
//     return <Line data={midata} options={misoptions} />
// }