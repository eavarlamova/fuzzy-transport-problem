import { memo } from 'react';
import { Chart, Line } from '../../../../../node_modules/react-chartjs-2';

const Graph = ({ value }) => {
    const valueArray = value.slice(1, value.length - 1).split(',')

    // console.log(valueArray.map((item, index) => ({
    //     x: Number(item),
    //     y: index === 1 ? 1 : 0,
    // }))
    // )
    const data = {
        labels: valueArray.map(item => item),

        datasets: [
            {
                label: 'величина общих затрат в виде нечеткого треугольника',
                data: valueArray.map((item, index) => ({
                    text:'new',
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
// data-testid="canvas"
// const path = document.querySelector('#chart-my');
// const path = document.getElementById('chart-my')
// console.log('path', path)
// const chartForSvg = new Chart(path, {data, options})
// console.log('chartForSvg', chartForSvg)
return (
        <div id="chart-my">
            <div className='chart'>
                <h4 className='title'>Line Chart for optimize matrix</h4>
            </div>
            <Line data={data} options={options} />
        </div>
    )
};

export default memo(Graph)