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
import { Line } from 'react-chartjs-2';

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

export default function SalesChart() {
    const data = {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
        datasets: [
            {
                label: 'Sales',
                data: [65, 59, 80, 81, 56, 55, 70],
                borderColor: 'rgba(44, 120, 220, 1)',
                backgroundColor: 'rgba(44, 120, 220, 0.1)',
                tension: 0.4,
                fill: true,
            },
            {
                label: 'Visitors',
                data: [28, 48, 40, 19, 86, 27, 90],
                borderColor: 'rgba(4, 209, 130, 1)',
                backgroundColor: 'rgba(4, 209, 130, 0.1)',
                tension: 0.4,
                fill: true,
            },
            {
                label: 'Products',
                data: [45, 25, 60, 45, 70, 35, 55],
                borderColor: 'rgba(180, 100, 230, 1)',
                backgroundColor: 'rgba(180, 100, 230, 0.1)',
                tension: 0.4,
                fill: true,
            },
        ],
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'top',
                labels: {
                    usePointStyle: true,
                    padding: 20,
                },
            },
        },
        scales: {
            y: {
                beginAtZero: true,
                grid: {
                    color: 'rgba(0, 0, 0, 0.05)',
                },
            },
            x: {
                grid: {
                    display: false,
                },
            },
        },
    };

    return (
        <div className="bg-white dark:bg-dark-card rounded-xl p-6 shadow-card">
            <div className="flex items-center justify-between mb-6">
                <h5 className="font-semibold text-heading dark:text-white">Sale statistics</h5>
                <select className="border border-gray-200 rounded-lg px-3 py-2 text-sm">
                    <option>Last 7 days</option>
                    <option>Last 30 days</option>
                    <option>Last 90 days</option>
                </select>
            </div>
            <div className="h-80">
                <Line data={data} options={options} />
            </div>
        </div>
    );
}
