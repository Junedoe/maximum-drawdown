import React, { Component } from 'react';
import axios from 'axios';
import { Line } from 'react-chartjs-2';

const apiKey = process.env.REACT_APP_API_KEY;

const startURL = 'https://www.quandl.com/api/v3/datasets/WIKI/';
let currentDate = new Date().toISOString().slice(0, 10);
let adjClose = '&column_names=10';

class CalcMdd extends Component {
    constructor(props) {
        super(props);
        this.state = {
            ticker: 'AAPL',
            startDate: '2010-01-01',
            maxDrawdown: '0',
            isLoading: false,
            error: null,
            data: {
                // data = for use of react-chartjs-2
                labels: [],
                datasets: [
                    {
                        label: 'Stock market',
                        fill: false,
                        lineTension: 0.1,
                        backgroundColor: 'rgba(75,192,192,0.4)',
                        borderColor: 'rgba(75,192,192,1)',
                        borderCapStyle: 'butt',
                        borderDash: [],
                        borderDashOffset: 0.0,
                        borderJoinStyle: 'miter',
                        pointBorderColor: 'rgba(75,192,192,1)',
                        pointBackgroundColor: '#fff',
                        pointBorderWidth: 1,
                        pointHoverRadius: 5,
                        pointHoverBackgroundColor: 'rgba(75,192,192,1)',
                        pointHoverBorderColor: 'rgba(220,220,220,1)',
                        pointHoverBorderWidth: 2,
                        pointRadius: 1,
                        pointHitRadius: 10,
                        data: []
                    }
                ]
            }
        };
    }

    handleInputChange(stateFieldName, event) {
        this.setState({
            [stateFieldName]: event.target.value
        });
    }

    /*
    1.) To Visualize the data in a graph:
    a) Access and visualize the data
    b) Create an array (xArray) with the dates
    c) Create an Array (yArray) with the values
    d.) refer xArray and yArray values to the state
    */

    async handleClick(e) {
        e.preventDefault();
        this.setState({ isLoading: true });
        try {
            let Url =
                startURL +
                this.state.ticker +
                '.json?start_date=' +
                this.state.startDate +
                '&end_date=' +
                currentDate +
                adjClose +
                '&collapse=daily&transform=rdiff&api_key=' +
                apiKey;

            // 1.a)
            const result = await axios.get(Url);
            let dataset = result.data.dataset.data;
            // 1.b)
            let xArray = dataset.map(val => val[0]);
            // 1.c)
            let yArray = dataset.map(val => val[1]);
            // 1.d.)
            this.state.data.labels = xArray.reverse();
            this.state.data.datasets[0].data = yArray;

            let maxDdArr = [];
            let pricesArray = [...yArray];
            do {
                let yIndex = pricesArray.indexOf(Math.max(...pricesArray));
                let xArr = pricesArray.slice(yIndex, pricesArray.length);
                let zIndex = xArr.indexOf(Math.min(...xArr));

                let maxD = (xArr[zIndex] - pricesArray[yIndex]) / pricesArray[yIndex];
                maxDdArr.push(maxD);
                pricesArray.splice(yIndex, pricesArray.length);
            } while (pricesArray.length > 0);

            this.state.maxDrawdown = (Math.min(...maxDdArr) * 100).toFixed(1);

            this.setState({ isLoading: false });
        } catch (error) {
            this.setState({ isLoading: false, error });
        }
    }

    render() {
        const { error } = this.state;

        if (error) {
            return <p>{error.message}</p>;
        }
        return (
            <div>
                <div className="header">
                    <h1>Calculate the Maximum Drawdown (MDD)</h1>
                </div>
                <div className="content">
                    <div id="form-container">
                        <form>
                            1. Type in ticker <br />
                            <input
                                type="text"
                                value={this.state.ticker}
                                onChange={e => this.handleInputChange('ticker', e)}
                            />{' '}
                            <br />
                            2. Select start date
                            <br />
                            <input
                                type="date"
                                value={this.state.startDate}
                                onChange={e => this.handleInputChange('startDate', e)}
                            />{' '}
                            <button onClick={e => this.handleClick(e)}>SHOW</button>
                            <br />
                            <div className="mdd">
                                Calculated MDD is : {this.state.maxDrawdown} % <br />
                            </div>
                        </form>
                    </div>
                    <div className="graph">
                        <Line data={this.state.data} options={{ maintainAspectRatio: false }} />
                    </div>
                </div>
            </div>
        );
    }
}

export default CalcMdd;
