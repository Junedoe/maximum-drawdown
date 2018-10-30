import React, { Component } from 'react';
import axios from 'axios';

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
            error: null
        };
    }
    handleInputChange(stateFieldName, event) {
        this.setState({
            [stateFieldName]: event.target.value
        });
    }

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

            const result = await axios.get(Url);

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
                </form>
            </div>
        );
    }
}

export default CalcMdd;
