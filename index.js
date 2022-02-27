const express = require('express');
const HOST = '0.0.0.0';
const PORT = 3000;
const app = express();
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const productRoute = require('./routes');
dotenv.config({});
mongoose
    .connect(
        `mongodb://${process.env.MONGO_ID}:${process.env.MONGO_PW}@localhost:27017/study?authSource=admin&readPreference=primary&appname=MongoDB%20Compass&directConnection=true&ssl=false`,
        {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        }
    )
    .then(() => console.log('잘 연결됨'))
    .catch((err) => console.log('에러남 '));

app.use(express.json());
app.use('/api/products', productRoute);
app.listen(PORT);

app.use((error, req, res, next) => {
    res.status(500).json({ message: error.message });
});
module.exports = app;
