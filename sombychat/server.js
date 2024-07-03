const express = require('express');
const fs = require('fs');
const app = express();
const port = 3000;
const messagesFile = 'messages.json';

app.use(express.json());
app.use(express.static('public'));

// Endpoint to get messages
app.get('/messages', (req, res) => {
    fs.readFile(messagesFile, (err, data) => {
        if (err) {
            res.status(500).send('Error reading messages');
            return;
        }
        res.json(JSON.parse(data));
    });
});

// Endpoint to post a new message
app.post('/messages', (req, res) => {
    const newMessage = req.body;
    fs.readFile(messagesFile, (err, data) => {
        if (err) {
            res.status(500).send('Error reading messages');
            return;
        }
        const messages = JSON.parse(data);
        messages.push(newMessage);
        fs.writeFile(messagesFile, JSON.stringify(messages), err => {
            if (err) {
                res.status(500).send('Error writing message');
                return;
            }
            res.status(201).send('Message saved');
        });
    });
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
