import { Stage } from "telegraf/scenes";
import authScene from "./auth.js";
import startScene from "./start.js";
import bookingScene from "./booking.js";
import rateScene from "./rate.js";

export const stage = new Stage([
    authScene,
    startScene,
    bookingScene,
    rateScene
])