import { memo } from 'react';
import { Line } from '../../../../../node_modules/react-chartjs-2';

const Graph = ({ value }) => {
    const valueArray = value.slice(1, value.length - 1).split(',')

    const data = {
        labels: valueArray.map(item => item),

        datasets: [
            {
                label: 'величина общих затрат в виде нечеткого треугольника',
                data: valueArray.map((item, index) => ({
                    text: 'new',
                    x: Number(item),
                    y: index === 1 ? 1 : 0,
                })),
                fill: false,
                backgroundColor: 'rgb(255, 99, 132)',
                borderColor: 'rgba(255, 99, 132, 0.2)',
            },
        ],
    };

    const options = {
        scales: {
            yAxes: [
                {
                    ticks: {
                        beginAtZero: true,
                    },
                },
            ],
        },
    };
    const svg = <svg><Line data={data} options={options} /></svg>

    return (
        <div id="chart-my">
            <div className='chart'>
                <h4 className='title'>  ВЕЛИЧИНА ОБЩИХ ЗАТРАТ В ВИДЕ НЕЧЕТКОГО ТРЕУГОЛЬНОГО ЧИСЛА</h4>
            </div>
            <Line data={data} options={options} />
        </div>
    )
};

export default memo(Graph)