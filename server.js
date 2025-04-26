const express = require('express');
const app = express();
const path = require('path');

// existing routes...

// Add a new route for the landing page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'landing.html'));
});

// existing code... 