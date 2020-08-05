import React, { Component } from 'react';
import '../styles/Home.css';

class Home extends Component {
    constructor(props) {
        super();

        this.state = {
            rating: 0,
            text: '',
            style: {
                backgroundColor: `rgb(249, 158, 52)`,
                color: '#000'
            },
            brainStyle: {
                backgroundColor: `rgb(49, 158, 52)`,
                width: '50px',
                height: '50px',
                zIndex: 100,
                transition: 'all 2s ease-out',
                transform: 'translate(500px)',
            }
        };

        this.checkMaliciousRating = this.checkMaliciousRating.bind(this);
    }

    async checkMaliciousRating(e) {
        let userInput = { userInput: e.target.value };

        let response = await fetch('http://localhost:5050/checkMaliciousRating', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(userInput)
            });

        let body = await response.json();

        if (response.status !== 200) {
            throw Error(body.message);
        }

        let blockStyleAdjustment = body.rating * 100;
        let styleAdjustment = body.rating * 109;

        this.setState({
            rating: body.rating,
            blockStyle: {
                backgroundColor: `rgb(49, ${blockStyleAdjustment}, 52)`,
                innerWidth: '250px',
                height: '50px'
            },
            style: {
                backgroundColor: `rgb(249, 158, ${styleAdjustment})`,
                color: '#000',
                fontFamily: 'Comic Sans'
            }
        });
    }

    render() {
        return (
            <div className="home">
                <div style={this.state.blockStyle}></div>
                <header className="home-header" style={this.state.style}>
                    <p>Now that we know who you are, I know who I am.</p>
                    <a className="home-link"
                        href="https://slipsum.com/"
                        target="_blank"
                        rel="noopener noreferrer">
                        Samuel L. Ipsum
                    </a>
                <div style={this.state.brainStyle}></div>
                </header>
            </div>
        );
    }
}

export default Home;
