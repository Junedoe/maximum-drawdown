# Maximum Drawdown

Maximum Drawdown is a simple Web App that displays the market history of a certain stock and calculates the maximum drawdown from a the start date till today.

"A maximum drawdown (MDD) is the maximum loss from a peak to a trough of a portfolio, before a new peak is attained. Maximum Drawdown (MDD) is an indicator of downside risk over a specified time period. It can be used both as a stand-alone measure or as an input into other metrics such as "Return over Maximum Drawdown" and the Calmar Ratio. Maximum Drawdown is expressed in percentage terms and computed as:

MDD = (Trough Value – Peak Value) ÷ Peak Value"

Read more: Maximum Drawdown (MDD) Definition | Investopedia https://www.investopedia.com/terms/m/maximum-drawdown-mdd.asp#ixzz5VPRps7qM

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

To query the Quandl stock market data you will need to create an account to get you API key [here](https://www.quandl.com/sign-up-modal?defaultModal=showSignUp).

### Installing

A step by step series of examples that tell you how to get a development env running

First you need to clone the project

```
$ git clone https://github.com/Junedoe/maximum-drawdown.git
```

Change your directory:

```
$ cd maximum-drawdown
```

Install all the dependencies:

```
$ npm i --save
```

In order to run the application, you need to have a terminal window opened and run this command:

```
$ npm start
```

## Files to add

You should have a `server/.env` file with the following values:

```
REACT_APP_API_KEY= // -> Here your API Key
```
