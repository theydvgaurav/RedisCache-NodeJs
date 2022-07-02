const express = require("express");
const axios = require("axios");
const cors = require("cors")
const redisClient = require('./redis')

const PORT = 5000;
const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.get("/photos", async (req, res) => {

    const photos = await redisClient.get('photos');
    if (photos) {
        res.json(JSON.parse(photos));
    } else {
        const { data } = await axios.get("https://jsonplaceholder.typicode.com/photos")
        redisClient.setEx('photos', 3600, JSON.stringify(data)); // in redis we can only store key-value pairs
        res.json(data);

    }

})


app.get("/photos/:id", async (req, res) => {


    const photos = await redisClient.get(`photos:${req.params.id}`);
    if (photos) {
        res.json(JSON.parse(photos));
    } else {
        const { data } = await axios.get(`https://jsonplaceholder.typicode.com/photos/${req.params.id}`)
        redisClient.setEx(`photos:${req.params.id}`, 3600, JSON.stringify(data)); // in redis we can only store key-value pairs
        res.json(data);

    }
})


app.listen(PORT, () => { console.log(`Server is running on Port ${PORT}`) })
