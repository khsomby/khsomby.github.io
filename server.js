const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const port = process.env.PORT || 3000;
const messagesFile = path.join(__dirname, 'messages.json');

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.get('/messages', (req, res) => {
    fs.readFile(messagesFile, 'utf8', (err, data) => {
        if (err) {
            res.status(500).send('Error reading messages');
            return;
        }
        const messages = JSON.parse(data);
        res.json(messages.map(msg => ({
            ...msg,
            seenBy: [] // Initialize seenBy array for each message
        })));
    });
});

app.post('/messages', (req, res) => {
    const newMessage = req.body;
    fs.readFile(messagesFile, 'utf8', (err, data) => {
        if (err) {
            res.status(500).send('Error reading messages');
            return;
        }
        const messages = JSON.parse(data);
        messages.push({ ...newMessage, seenBy: [] }); // Add seenBy array for new message
        fs.writeFile(messagesFile, JSON.stringify(messages), err => {
            if (err) {
                res.status(500).send('Error writing message');
                return;
            }
            res.status(201).send('Message saved');
        });
    });
});

app.delete('/messages/:index', (req, res) => {
    const index = parseInt(req.params.index, 10);
    fs.readFile(messagesFile, 'utf8', (err, data) => {
        if (err) {
            res.status(500).send('Error reading messages');
            return;
        }
        const messages = JSON.parse(data);
        if (index >= 0 && index < messages.length) {
            messages.splice(index, 1);
            fs.writeFile(messagesFile, JSON.stringify(messages), err => {
                if (err) {
                    res.status(500).send('Error writing messages');
                    return;
                }
                res.status(200).send('Message deleted');
            });
        } else {
            res.status(400).send('Invalid index');
        }
    });
});

app.post('/name', (req, res) => {
    const { newName } = req.body;
    if (newName && typeof newName === 'string' && newName.trim() !== '') {
        res.status(200).send({ newName });
    } else {
        res.status(400).send('Invalid name');
    }
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
