import React, { Component } from 'react';

class CalcMdd extends Component {
    constructor(props) {
        super(props);
        this.state = {
            ticker: 'AAPL',
            startDate: '2010-01-01',
            maxDrawdown: '0'
        };
    }
    render() {
        return (
            <div>
                <h1>Calculate the Maximum Drawdown (MDD)</h1>
                <form>
                    Ticker <br />
                    <input type="text" value={this.state.ticker} /> <br />
                    Start date <br />
                    <input type="date" value={this.state.startDate} />{' '}
                    <div className="mdd">MDD : {this.state.maxDrawdown}</div>
                    <br />
                    <button className="show-btn">Show</button>
                </form>
            </div>
        );
    }
}

export default CalcMdd;
