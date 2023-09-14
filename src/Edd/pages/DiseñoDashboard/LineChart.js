import { Line } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler,
} from 'chart.js';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler
);

var General = [15, 30, 55, 50, 55, 60, 20, 45, 15, 55, 40, 40];

var Marcelo = [10, 50, 20, 30, 80, 40, 30, 20, 20, 30, 10, 60];
var Ramiro = [20, 10, 90, 70, 30, 80, 10, 70, 10, 80, 70, 20];
var meses = ["AUTONOMIA", "CAPACIDAD ANALITICA", "CAPACIDAD DE APRENDIZAJE", "COMUNICACIÓN", "CONFIANZA", "DESEMPEÑO", "DISPOSICION/ACTITUD", "EMPODERAMIENTO"];

var midata = {
    labels: meses,
    datasets: [ // Cada una de las líneas del gráfico
        {
            label: 'Marcelo Cortes Ortega',
            data: Marcelo,
            borderColor: 'red',
            backgroundColor: 'red',
            pointRadius: 5,
            pointBorderColor: 'red',
            pointBackgroundColor: 'red',
        },  
        
        {
            label: 'Ramiro Gomez',
            data: Ramiro,
            borderColor: 'green',
            backgroundColor: 'green',
            pointRadius: 5,
            pointBorderColor: 'green',
            pointBackgroundColor: 'green',
        },
        {
            label: 'GENERAL',
            data: General,
            borderColor: 'purple',
            backgroundColor: 'purple',
            pointRadius: 5,
            pointBorderColor: 'purple',
            pointBackgroundColor: 'purple',
        },
    ],
};

var misoptions = {
    responsive: true,
    scales : {
        y : {
            min : 0
        },
        x: {
            ticks: { color: 'black'}
        }
    }
};

export default function LinesChart() {
    return <Line data={midata} options={misoptions}/>
}