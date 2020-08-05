const express = require('express');
const brain = require('brain.js');
const bodyParser = require('body-parser');

const app = express();

// Setting the port to 5000 if no other port is specified
const port = process.env.PORT || 5000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Start the Express server
app.listen(5000, () => console.log(`Server running on port ${port}!`));

// The training data for the neural network.
// This could also come from a database or a stream from the user.
const trainingInputData = [
    { a: 0.2, b: 0.4, g: 0.3, d: 0.5 },
    { a: 0.12, b: 0.64, g: 0.03, d: 0.45 },
    { a: 0.78, b: 0.23, g: 0.8, d: 0.57 },
    { a: 0.25, b: 0.45, g: 0.53, d: 0.55 },
    { a: 0.42, b: 0.54, g: 0.83, d: 0.05 },
    { a: 0.72, b: 0.34, g: 0.82, d: 0.15 },
    { a: 0.12, b: 0.14, g: 0.38, d: 0.57 },
    { a: 0, b: 0.14, g: 0.33, d: 0.73 },
    { a: 0.2, b: 0, g: 0.23, d: 0.62 },
    { a: 0.5, b: 0.3, g: 0.4, d: 0.2 },
    { a: 0.49, b: 0.24, g: 0.32, d: 0.25 },
    { a: 0.83, b: 0.53, g: 0.63, d: 0.42},
    { a: 0.28, b: 0.59, g: 0.38, d: 0.27 },
];

const trainingOutputData = [
    { up: 0.8 },
    { up: 0.8 },
    { down: 0.7 },
    { left: 0.8 },
    { left: 0.9 },
    { right: 1 },
    { up: 0.8 },
    { right: 0.7 },
    { left: 0.5 },
    { right: 0.6 },
    { down: 0.85 },
    { down: 0.9 }
];

const trainingData = [];

for (let i = 0; i < trainingInputData.length; i++) {
    trainingData.push({
        input: trainingInputData[i],
        output: trainingOutputData[i]
    });
}

// Create a new neural network with 3 hidden layers for better performance
const net = new brain.NeuralNetwork({ hiddenLayers: [3] });

// Train the neural network
const stats = net.train(trainingData);

// Send the predicted value to the front-end
app.get('/brain_data', (req, res) => {
    let processedValue = net.run({ a: 0.912, g: 0.183, b: 0.555, d: 0.368 });
    res.send({ predictedValue: processedValue });
});

app.post('/getUserMouseCoordinates', (req, res) => {
    let newTrainingInputData = req.body.userData;
    let newTrainingOutputData = [];
    let newTrainingData = [];
    
    newTrainingInputData.forEach(input => {
        newTrainingOutputData.push(
            net.run(
                { 
                    a: input.input.a, 
                    g: input.input.g, 
                    b: input.input.b, 
                    d: input.input.d,
                }
            )
        );
    });

    for (let i = 0; i < newTrainingInputData.length; i++) {
        newTrainingData.push({
            input: newTrainingInputData[i],
            output: newTrainingOutputData[i]
        });
    }

    net.train(newTrainingData);

    let newPredictedValue = net.run(newTrainingInputData[newTrainingInputData.length - 1]);

    res.send(JSON.stringify({ predictedValue: newPredictedValue }));
});

// Log to the console just as a check
console.log(stats);
console.log(
    net.run(
        {
            a: 0.912,
            g: 0.183,
            b: 0.555,
            d: 0.325
        }
    )
);
