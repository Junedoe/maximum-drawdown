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

            this.setState({ isLoading: false });
        } catch (error) {
            this.setState({ isLoading: false, error });
        }
    }

    render() {
        const { isLoading, error } = this.state;

        if (error) {
            return <p>{error.message}</p>;
        }

        if (isLoading) {
            return <p>Loading ...</p>;
        }
        return (
            <div>
                <h1>Calculate the Maximum Drawdown (MDD)</h1>
                <form>
                    Ticker <br />
                    <input
                        type="text"
                        value={this.state.ticker}
                        onChange={e => this.handleInputChange('ticker', e)}
                    />{' '}
                    <br />
                    Start date <br />
                    <input
                        type="date"
                        value={this.state.startDate}
                        onChange={e => this.handleInputChange('startDate', e)}
                    />{' '}
                    <div className="mdd">MDD : {this.state.maxDrawdown}</div>
                    <br />
                    <button className="sl-btn" onClick={e => this.handleClick(e)}>
                        Show
                    </button>
                    <div className="graph">
                        <Line data={this.state.data} width={20} height={10} options={{}} />
                    </div>
                </form>
            </div>
        );
    }
}

export default CalcMdd;
