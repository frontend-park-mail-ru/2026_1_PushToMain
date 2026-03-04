require('dotenv').config();
const express = require("express");
const ApiAuth = require("./src/api/ApiAuth.js");

const API_BASE_URL = `http://localhost:8000/api`;

const port = process.env.PORT || 8000;

const app = express();

app.use('/public', express.static("public"));
app.use('/src', express.static("src"));

app.post('/api/login', async (req, res) => {
    try {
        const data = await ApiAuth.postDataLogin(req.body);
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get("/{:any}", (req, res) => {
    res.sendFile(__dirname + "/public/index.html");
});

app.listen(port, () => {
    console.log(`Server started on http://localhost:${port}`);
});
