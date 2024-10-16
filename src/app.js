import "./core/bot.js";
import express from "express";
import environments from "./config/environments.js";
import bot from "./core/bot.js";

const app = express();

app.use(express.json());

app.use('/dilkashdeliverybot', bot.webhookCallback('/secret-path'))
bot.telegram.setWebhook(environments.SERVER_URL)

app.get("/", (req, res) => {
    res.status(200).json({
        ok: true,
        message: "Bot running..."
    });
});

app.use((req, res) => {
    res.status(404).json({
        ok: false,
        message: "Page not found"
    });
});

app.listen(environments.PORT, () => {
    console.log(`Bot launched on ${ new Date().toLocaleString("uz") } on port ${environments.PORT}`);
});