import React, { Component } from 'react';
import Home from './Home';

class App extends Component {
    constructor() {
        super();
        this.input = [];
        this.state = {
            light: 1,
            dark: 1,
            neutral: 1
        };
        this.getUserMouseCoordinates = this.getUserMouseCoordinates.bind(this);
        this.changeAlpha = this.changeAlpha.bind(this);
    }

    callBrain = async () => {
        const response = await fetch('/brain_data');
        const body = await response.json();

        if (response.status !== 200) {
            throw Error(body.message);
        }

        return body.predictedValue;
    }

    changeAlpha() {
        this.setState({
            style: {
                backgroundColor: `rgba(249, 158, 52, ${this.state.neutral})`
            }
        })
    }

    getUserMouseCoordinates = async (event) => {
        if (this.input.length >= 12) {
            let userData = { userData: this.input };
            let prediction = await fetch('/getUserMouseCoordinates', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(userData)
            });
                
            const predict = await prediction.json();

            this.setState({
                light: predict.predictedValue.light,
                dark: predict.predictedValue.dark,
                neutral: predict.predictedValue.neutral
            });
            
            this.changeAlpha();
        }
        else {
            this.input.push(
                { 'input': { 
                    red: event.target.style.backgroundColor.split(',')[0].substr(4) / 1000, 
                    green: event.target.style.backgroundColor.split(',')[1].trim() / 1000, 
                    blue: event.target.style.backgroundColor.split(',')[2].trim().split(')')[0] / 1000 
                    }
                }
            );
        }
    }

    render() {
        return (
            <Home
                getUserMouseCoordinates={this.getUserMouseCoordinates}
                light={this.state.light}
                dark={this.state.dark}
                neutral={this.state.neutral} />
        );
    }
}

export default App;
