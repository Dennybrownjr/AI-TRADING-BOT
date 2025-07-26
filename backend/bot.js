// backend/bot.js
const express = require("express");
const cors = require("cors");
const { ethers } = require("ethers");
const { analyzePatterns } = require("./patternRecognition");
const { trackWhales } = require("./whaleTracker");
const { detectVolumeSpikes } = require("./volumeSpikeDetector");

const app = express();
app.use(cors());
app.use(express.json());

let isTrading = false;
let tradeSettings = {
    tradeSize: parseFloat(process.env.TRADE_SIZE || "1.0"), // 100% of wallet
    stopLoss: parseFloat(process.env.STOP_LOSS || "0.1"),   // 10% loss
    takeProfit: process.env.TAKE_PROFIT || "AI"             // AI reversal
};

// Simulated trading loop
async function tradeLoop() {
    while (isTrading) {
        try {
            const patternSignal = await analyzePatterns();
            const whaleSignal = await trackWhales();
            const volumeSignal = await detectVolumeSpikes();

            if (patternSignal.buy || whaleSignal.buy || volumeSignal.buy) {
                console.log("Buying with", tradeSettings.tradeSize * 100, "% of wallet");
                // TODO: integrate with Rabby wallet and execute trade
            } else if (patternSignal.sell) {
                console.log("Selling based on reversal detection");
                // TODO: integrate with Rabby wallet and execute trade
            }

            await new Promise(resolve => setTimeout(resolve, 5000)); // wait 5 seconds
        } catch (err) {
            console.error("Error in trade loop:", err);
        }
    }
}

app.post("/start", (req, res) => {
    if (!isTrading) {
        isTrading = true;
        tradeLoop();
        res.json({ status: "Trading started" });
    } else {
        res.json({ status: "Already trading" });
    }
});

app.post("/stop", (req, res) => {
    isTrading = false;
    res.json({ status: "Trading stopped" });
});

app.post("/emergency-stop", (req, res) => {
    isTrading = false;
    console.log("Emergency Stop: Selling all positions!");
    // TODO: Execute emergency sell on Rabby wallet
    res.json({ status: "Emergency stop triggered" });
});

app.get("/settings", (req, res) => {
    res.json(tradeSettings);
});

app.post("/settings", (req, res) => {
    const { tradeSize, stopLoss, takeProfit } = req.body;
    if (tradeSize) tradeSettings.tradeSize = parseFloat(tradeSize);
    if (stopLoss) tradeSettings.stopLoss = parseFloat(stopLoss);
    if (takeProfit) tradeSettings.takeProfit = takeProfit;
    res.json({ status: "Settings updated", tradeSettings });
});

app.listen(3000, () => {
    console.log("AI Trading Bot backend running on port 3000");
});
