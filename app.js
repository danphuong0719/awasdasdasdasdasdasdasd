const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const mongoose = require('mongoose');
const User = require('./model/user');
const bcrypt = require('bcryptjs');
const cors = require('cors');

const authRoute = require('./routes/auth.route');
const userRoute = require('./routes/user.route');
const challengeRoute = require('./routes/challenge.route.js');
const { verifyToken } = require('./verify/verifyToken');

mongoose.connect('mongodb://localhost:27017/appdb', {
    useNewUrlParser: true,
    useUnifiedTopology: true,

})
const app = express();
app.use('/', express.static(path.join(__dirname, 'static-test')));
// app.use(bodyParser.json());
app.use(express.json())
app.use(cors());

app.use('/challenges', verifyToken, challengeRoute);
app.use('/users', userRoute);
app.use('/auth', authRoute);


const PORT = 3005;
app.listen(PORT, () => {
    console.log(`Server is running on PORT ${PORT}!`);
})