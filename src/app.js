import "./index.js";
import express from "express";
import environments from "./config/environments.js";
import bot from "./core/bot.js";
import * as uuid from "uuid";

const app = express();

const secretPath = '/' + uuid.v4();
const webhookUrl = environments.SERVER_URL + secretPath;

app.use(express.json());

app.use("/dilkashdeliverybot", bot.webhookCallback(secretPath));
bot.telegram.setWebhook(webhookUrl);

app.get("/dilkashdeliverybot", (req, res) => {
  res.status(200).json({
    ok: true,
    message: "Bot running...",
  });
});

app.use((req, res) => {
  res.status(404).json({
    ok: false,
    message: "Page not found",
  });
});

app.listen(environments.PORT, () => {
  console.log(
    `Bot launched on ${new Date().toLocaleString("uz")} on port ${
      environments.PORT
    }`
  );
});
