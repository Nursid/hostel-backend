require('dotenv').config();
const express = require('express');
const app = express();

app.get('/', (req, res) => {
  res.send('csdc sd c sc sdhc!');
});

app.get('/users', (req, res) => {
  res.send('nursid this side!');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
