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

    2.) To calculate the maximum drawdown onClick:
        a.) Determine the point of maximum Value (maxValue) of the graph (yArray) and the index of maxValue
        b.) From point of maximum Value find the Peak Value
        c.) Calculate MDD = (Trough Value – Peak Value) ÷ Peak Value
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
                '&collapse=monthly&transform=rdiff&api_key=' +
                apiKey;

            // 1.a)
            const result = await axios.get(Url);
            let dataset = result.data.dataset.data;
            // 1.b)
            let xArray = dataset.map(val => val[0]);
            // 1.c)
            let yArray = dataset.map(val => val[1]);
            // 1.d.)
            this.state.data.labels = xArray;
            this.state.data.datasets[0].data = yArray;

            // 2.a)
            let maxValue = Math.max(...yArray);
            let maxValueIndex = yArray.indexOf(maxValue);
            // 2.b)
            let fromMaxToEnd = yArray.slice(maxValueIndex);
            let peakValue = Math.min(...fromMaxToEnd);
            // 2.c.)
            this.state.maxDrawdown = ((maxValue - peakValue) / peakValue).toFixed(2);

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
