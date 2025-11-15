
'use client';

import React from 'react';
import styles from './SalesChart.module.css';
import { Bar } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);


const chartData = {
    labels: ['Minggu 1', 'Minggu 2', 'Minggu 3', 'Minggu 4'],
    datasets: [
        {
            label: 'Total Penjualan',
            data: [2900000, 2100000, 1300000, 900000],
            backgroundColor: '#205781',
            borderRadius: 4,
        },
    ],
};
const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false }, title: { display: false } },
    scales: {
        y: {
            ticks: {
                callback: function (value: string | number) {
                    if (typeof value === 'number') {
                        return 'Rp ' + value.toLocaleString('id-ID');
                    } return value;
                },
            },
        },
    },
};

export default function SalesChart() {
    return (

        <div className={styles.chartContainer}>
            <Bar options={chartOptions} data={chartData} />
        </div>
    );
}