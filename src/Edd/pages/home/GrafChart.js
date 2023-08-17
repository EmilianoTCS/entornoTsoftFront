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

var beneficios = [0, 56, 20, 36, 80, 40, 30, -20, 25, 30, 12, 60];
var meses = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
var otraLinea = [20, 25, 60, 65, 45, 10, 0, 25, 35, 7, 20, 25];

var midata = {
    labels: meses,
    datasets: [ // Cada una de las líneas del gráfico
        {
            label: 'GENERAL',
            data: beneficios,
            tension: 0.5,
            fill : true,
            borderColor: 'rgb(255, 99, 132)',
            backgroundColor: 'rgba(255, 99, 132, 0.5)',
            pointRadius: 5,
            pointBorderColor: 'rgba(255, 99, 132)',
            pointBackgroundColor: 'rgba(255, 99, 132)',
        },
        {
            label: 'INGE',
            data: otraLinea,
            borderColor: 'light blue',
            backgroundColor: 'light blue',
            pointRadius: 3,
            pointBorderColor: 'light blue',
            pointBackgroundColor: 'light blue',
        },
        {
            label: 'RODRIGO',
            data: [30, 30, 20, 45, 55, 30, 45, 65, 30, 30, 70, 30],
            borderColor: 'green',
            backgroundColor: 'green',
            pointRadius: 3,
            pointBorderColor: 'green',
            pointBackgroundColor: 'green',
        },
    ],
};

var misoptions = {
    scales : {
        y : {
            min : 0
        },
        x: {
            ticks: { color: 'black'}
        }
    }
};

export default function GrafChart() {
    return <Line data={midata} options={misoptions}/>
}