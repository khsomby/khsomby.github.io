const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const app = express();
const port = process.env.PORT || 3000;
const messagesFilePath = path.join(__dirname, 'messages.json');

app.use(bodyParser.json());
app.use(express.static('public'));

// Utility function to read messages from file
function readMessagesFile(callback) {
    fs.readFile(messagesFilePath, 'utf8', (err, data) => {
        if (err) {
            if (err.code === 'ENOENT') {
                // File does not exist, initialize with empty array
                return callback(null, []);
            }
            return callback(err);
        }
        try {
            const messages = JSON.parse(data || '[]'); // Fallback to empty array if data is empty
            callback(null, messages);
        } catch (parseErr) {
            callback(parseErr);
        }
    });
}

// Utility function to write messages to file
function writeMessagesFile(messages, callback) {
    fs.writeFile(messagesFilePath, JSON.stringify(messages), 'utf8', callback);
}

// Endpoint to fetch all messages and mark them as seen by the current user
app.get('/messages', (req, res) => {
    const userName = req.query.userName;
    readMessagesFile((err, messages) => {
        if (err) {
            return res.status(500).send('Error reading messages file');
        }

        if (userName) {
            messages = messages.map(message => {
                if (!message.seenBy.includes(userName)) {
                    message.seenBy.push(userName);
                }
                return message;
            });

            writeMessagesFile(messages, err => {
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

    readMessagesFile((err, messages) => {
        if (err) {
            return res.status(500).send('Error reading messages file');
        }

        messages.push(newMessage);

        writeMessagesFile(messages, err => {
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

    readMessagesFile((err, messages) => {
        if (err) {
            return res.status(500).send('Error reading messages file');
        }

        if (index >= 0 && index < messages.length) {
            messages.splice(index, 1);
            writeMessagesFile(messages, err => {
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
