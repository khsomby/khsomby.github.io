const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const app = express();
const port = process.env.PORT || 3000;
const messagesFilePath = 'messages.json';

app.use(bodyParser.json());
app.use(express.static('public'));

// Endpoint to fetch all messages and mark them as seen by the current user
app.get('/messages', (req, res) => {
    const userName = req.query.userName;
    fs.readFile(messagesFilePath, 'utf8', (err, data) => {
        if (err) {
            return res.status(500).send('Error reading messages file');
        }

        let messages = JSON.parse(data);

        if (userName) {
            messages = messages.map(message => {
                if (!message.seenBy.includes(userName)) {
                    message.seenBy.push(userName);
                }
                return message;
            });

            fs.writeFile(messagesFilePath, JSON.stringify(messages), 'utf8', err => {
                if (err) {
                    return res.status(500).send('Error updating messages file');
                }
                res.json(messages);
            });
        } else {
            res.json(messages);
        }
    });
});

// Endpoint to add a new message
app.post('/messages', (req, res) => {
    const newMessage = req.body;

    fs.readFile(messagesFilePath, 'utf8', (err, data) => {
        if (err) {
            return res.status(500).send('Error reading messages file');
        }

        const messages = JSON.parse(data);
        messages.push(newMessage);

        fs.writeFile(messagesFilePath, JSON.stringify(messages), 'utf8', err => {
            if (err) {
                return res.status(500).send('Error writing messages file');
            }
            res.status(200).send('Message added');
        });
    });
});

// Endpoint to delete a message
app.delete('/messages/:index', (req, res) => {
    const index = parseInt(req.params.index, 10);

    fs.readFile(messagesFilePath, 'utf8', (err, data) => {
        if (err) {
            return res.status(500).send('Error reading messages file');
        }

        const messages = JSON.parse(data);
        if (index >= 0 && index < messages.length) {
            messages.splice(index, 1);
            fs.writeFile(messagesFilePath, JSON.stringify(messages), 'utf8', err => {
                if (err) {
                    return res.status(500).send('Error writing messages file');
                }
                res.status(200).send('Message deleted');
            });
        } else {
            res.status(404).send('Message not found');
        }
    });
});

// Endpoint to change username
app.post('/name', (req, res) => {
    const { newName } = req.body;

    if (newName && newName.trim() !== '') {
        res.json({ newName: newName.trim() });
    } else {
        res.status(400).send('Invalid name');
    }
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
