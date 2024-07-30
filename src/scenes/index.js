import { Stage } from "telegraf/scenes";
import authScene from "./auth.js";
import startScene from "./start.js";

export const stage = new Stage([
    authScene,
    startScene
])