import { Stage } from "telegraf/scenes";
import authScene from "./auth.js";
import startScene from "./start.js";
import bookingScene from "./booking.js";
import rateScene from "./rate.js";
import aboutusScene from "./aboutus.js";
import admin from "./admin/index.js";
import menuScene from "./menu.js";
import cartScene from "./cart.js";
import orderScene from "./order.js";
import settings from "./settings/index.js";

export const stage = new Stage([
    authScene,
    startScene,
    bookingScene,
    rateScene,
    aboutusScene,
    menuScene,
    cartScene,
    orderScene,
    ...settings,
    ...admin
])