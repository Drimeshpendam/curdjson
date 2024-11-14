const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const app = express();

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Path to the JSON file that will hold our data
const DATA_FILE = './data.json';

// Read data from the JSON file
function readData() {
    if (!fs.existsSync(DATA_FILE)) {
        return [];
    }
    const data = fs.readFileSync(DATA_FILE, 'utf-8');
    return JSON.parse(data);
}

// Write data to the JSON file
function writeData(data) {
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), 'utf-8');
}

// Get all names and surnames
app.get('/api/names', (req, res) => {
    const data = readData();
    res.json(data);
});

// Create a new name and surname
app.post('/api/names', (req, res) => {
    const { name, surname } = req.body;
    if (!name || !surname) {
        return res.status(400).json({ error: 'Name and surname are required' });
    }
    const data = readData();
    const newEntry = { name, surname };
    data.push(newEntry);
    writeData(data);
    res.status(201).json(newEntry);
});

// Update a name and surname by index
app.put('/api/names/:index', (req, res) => {
    const { name, surname } = req.body;
    const index = parseInt(req.params.index, 10);
    const data = readData();

    if (index < 0 || index >= data.length) {
        return res.status(404).json({ error: 'Entry not found' });
    }

    if (!name || !surname) {
        return res.status(400).json({ error: 'Name and surname are required' });
    }

    data[index] = { name, surname };
    writeData(data);
    res.json(data[index]);
});

// Delete a name and surname by index
app.delete('/api/names/:index', (req, res) => {
    const index = parseInt(req.params.index, 10);
    const data = readData();

    if (index < 0 || index >= data.length) {
        return res.status(404).json({ error: 'Entry not found' });
    }

    const deletedEntry = data.splice(index, 1);
    writeData(data);
    res.json(deletedEntry[0]);
});

// Serve static files (for the front-end)
app.use(express.static('public'));

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
