import React from 'react';
import { Bar } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    Filler,
} from 'chart.js';
import 'chartjs-plugin-datalabels';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    Filler
);

const labels = ['Marcelo cortes ortega', 'Ramigo Gomez', 'Romina Alvarez', 'Josefina Perez', 'Fatima Gonzales', 'Esteban Ramirez'];

const Florencia = [56, 65, 32, 20, 88, 65];
const Emiliano = [56, 32, 80, 54, 25, 12];
const Daniela = [41, 10, 32, 54, 12, 45];
const Juan = [45, 76, 54, 12, 45, 32, 78];

const data = {
    labels,
    datasets: [
        {
            label: 'Florencia Lorenzati',
            data: Florencia,
            backgroundColor: '#22cd73',
            text: ['Texto 1', 'Texto 2', 'Texto 3', 'Texto 4', 'Texto 5', 'Texto 6'],
        },
        {
            label: 'Emiliano Sotomayor',
            data: Emiliano,
            backgroundColor: '#efd36b',
            text: ['Texto 1', 'Texto 2', 'Texto 3', 'Texto 4', 'Texto 5', 'Texto 6'],
        },
        {
            label: 'Daniela',
            data: Daniela,
            backgroundColor: 'rgba(53, 162, 235, 0.5)',
            text: ['Texto 1', 'Texto 2', 'Texto 3', 'Texto 4', 'Texto 5', 'Texto 6'],
        },
        {
            label: 'Juan',
            data: Juan,
            backgroundColor: 'rgba(255, 99, 132, 0.5)',
            text: ['Texto 1', 'Texto 2', 'Texto 3', 'Texto 4', 'Texto 5', 'Texto 6', 'Texto 7'],
        },
    ],
};

const options = {
    responsive: true,
    plugins: {
        legend: {
            position: 'top',
        },
        datalabels: {
            color: 'black',
            anchor: 'end',
            align: 'end',
            offset: -10,
            font: {
                weight: 'bold',
            },
            formatter: (value, context) => {
                return context.dataset.text[context.dataIndex];
            },
        },
    },
};

export default function Bars() {
    return <Bar data={data} options={options} />;
}