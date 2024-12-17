require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const passwordRoutes = require('./routes/passwordRoutes');

const app = express();
const port = process.env.PORT || 3000;

mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));


app.use(express.json());
app.use(express.static('views')); 
app.use('/api', passwordRoutes);

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html');
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
