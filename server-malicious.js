const express = require('express');
const brain = require('brain.js');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();

// Setting the port to 5050 if no other port is specified
const port = process.env.PORT || 5050;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());

// Start the Express server
app.listen(5050, () => console.log(`Server running on port ${port}!`));

// The training data for the neural network.
// This could also come from a database or a stream from the user.
const trainingInputData = [
    { select: 0.2, from: 0.4 },
    { userId: 0.4, password: 0.6 },
    { select: 0.2, password: 0.8, username: 0.8 },
    { lastLogin: 1, isActive: 1 },
    { update: 0.8, where: 1, set: 1 },
    { transaction: 1, delete: 1, null: 1 },
    { group: 1, select: 0.8, where: 0.8 },
    { firstName: 1, email: 0.6, password: 0.6 },
    { isActive: 1, select: 0.4, from: 0.4 },
    { id: 1, address: 0.31, city: 0.31 },
    { not: 0.8 },
    { having: 0.6, group: 0.2, select: 0.2 }
];

// higher score means more likely to be malicious
const trainingOutputData = [
    { rating: 0.8 },
    { rating: 0.8 },
    { rating: 0.6 },
    { rating: 0.8 },
    { rating: 0.9 },
    { rating: 1 },
    { rating: 0.8 },
    { rating: 0.7 },
    { rating: 0.5 },
    { rating: 0.6 },
    { rating: 0.85 },
    { rating: 0.9 }
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
app.get('/getMaliciousRating', (req, res) => {
    let processedValue = net.run({ select: 0.6, from: 0.18, all: 0.55 });
    res.send({ predictedRating: processedValue });
});

app.post('/checkMaliciousRating', (req, res) => {
    let newTrainingInputData = req.body.userInput.split(' ');
    let newTrainingData = [];

    let wordCount = {};
    
    newTrainingInputData.forEach(word => {
        if (word === 'select') {
            wordCount[word] = ((wordCount[word] * 7) / 100) || 0.7;
        }
        if (word === 'from') {
            wordCount[word] = ((wordCount[word] * 4) / 100) || 0.4;
        }
        if (word === 'userId') {
            wordCount[word] = ((wordCount[word] * 9) / 100) || 0.9;
        }
    });

    newTrainingInputData.forEach(input => newTrainingData.push(wordCount));

    let newPredictedRating = net.run(newTrainingData[newTrainingData.length - 1]);

    res.send(JSON.stringify(newPredictedRating));
});

// Log to the console just as a check
console.log(stats);
console.log(
    net.run(
        {
            select: 0.912,
            from: 0.183,
            where: 0.555
        }
    )
);
