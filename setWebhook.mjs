import { setWebhook } from "telebot-vercel";
import bot from "../bot.mjs";

const path = "/telegram.mjs";

export default setWebhook({ bot, path, handleErrors: true });