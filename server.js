const redis = require("redis");
const express = require("express");
const app = express();

let redisClient;

(async () => {
    try {
        redisClient = redis.createClient();
        redisClient.on('error', (error) => {
            console.error('Redis Client Error', error);
        });

        await redisClient.connect();
        console.log('Connected to Redis');
    } catch (error) {
        console.error('Failed to connect to Redis', error);
    }
})();

app.get("/", (req, res) => {
    res.send("Hello World!");
});

app.get("/calculate-data", async (req, res) => {
    try {
        let calculatedData = 0;

        const cachedData = await redisClient.get('calculatedData');
        if (cachedData) {
            return res.json({ data: cachedData });
        }

        for (let i = 0; i < 100000000000000; i++) {
            calculatedData += i;
        }

        await redisClient.set('calculatedData', calculatedData);

        return res.json({ data: calculatedData });

    } catch (error) {
        console.error('Error in /calculate-data:', error);
        return res.status(500).json({ error: error.message });
    }
});

app.listen(3000, () => {
    console.log("Server is running on http://localhost:3000");
});