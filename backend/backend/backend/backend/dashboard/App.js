// dashboard/App.js
import React, { useState, useEffect } from "react";

function App() {
    const [isTrading, setIsTrading] = useState(false);
    const [pnl, setPnl] = useState(0);
    const [tradeHistory, setTradeHistory] = useState([]);
    const [settings, setSettings] = useState({ tradeSize: 1.0, stopLoss: 0.1, takeProfit: "AI" });

    const apiUrl = "https://your-railway-app-url"; // replace with Railway URL after deployment

    const startBot = async () => {
        await fetch(`${apiUrl}/start`, { method: "POST" });
        setIsTrading(true);
    };

    const stopBot = async () => {
        await fetch(`${apiUrl}/stop`, { method: "POST" });
        setIsTrading(false);
    };

    const emergencyStop = async () => {
        await fetch(`${apiUrl}/emergency-stop`, { method: "POST" });
        setIsTrading(false);
    };

    const updateSettings = async () => {
        await fetch(`${apiUrl}/settings`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(settings)
        });
    };

    return (
        <div style={{ padding: "20px", textAlign: "center" }}>
            <h2>AI Trading Bot Dashboard</h2>
            <h3>Status: {isTrading ? "Running" : "Stopped"}</h3>
            <h4>Live PnL: {pnl.toFixed(2)}%</h4>

            <button onClick={startBot}>Start Bot</button>
            <button onClick={stopBot} style={{ marginLeft: "10px" }}>Stop Bot</button>
            <button onClick={emergencyStop} style={{ marginLeft: "10px", color: "red" }}>Emergency Stop</button>

            <div style={{ marginTop: "20px" }}>
                <h4>Trade Settings</h4>
                <label>
                    Trade Size (% of wallet):
                    <input type="number" value={settings.tradeSize} step="0.1"
                        onChange={(e) => setSettings({ ...settings, tradeSize: parseFloat(e.target.value) })} />
                </label><br />
                <label>
                    Stop Loss (%):
                    <input type="number" value={settings.stopLoss} step="0.01"
                        onChange={(e) => setSettings({ ...settings, stopLoss: parseFloat(e.target.value) })} />
                </label><br />
                <label>
                    Take Profit (% or "AI"):
                    <input type="text" value={settings.takeProfit}
                        onChange={(e) => setSettings({ ...settings, takeProfit: e.target.value })} />
                </label><br />
                <button onClick={updateSettings} style={{ marginTop: "10px" }}>Update Settings</button>
            </div>
        </div>
    );
}

export default App;
