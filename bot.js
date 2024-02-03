require("dotenv").config();
const { Telegraf } = require("telegraf");
const { message } = require("telegraf/filters");
const axios = require("axios");

const userStates = {};

const bot = new Telegraf(process.env.TG_API_KEY);
bot.start((ctx) => {
  ctx.reply("Добро пожаловать в бот актуальной погоды =)");
  userStates[ctx.chat.id] = "STARTED";
});
bot.on("message", async (ctx) => {
  const userId = ctx.chat.id;
  if (ctx.message.location) {
    console.log(ctx.message.location);
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${ctx.message.location.latitude}&lon=${ctx.message.location.longitude}&units=metric&lang=ru&appid=${process.env.WEATHER_API_KEY}`;
    const response = await axios.get(url);
    console.log(response);
    ctx.reply(
      `Район: ${response.data.name} \nТемпература: ${response.data.main.temp}°C`
    );
  }

  if (ctx.message.text) {
    if (
      ctx.message.text == "Привет" &&
      (!userStates[userId] || userStates[userId] === "STARTED")
    ) {
      ctx.reply("Здарова! Актуальная погода интересует?");
      userStates[userId] = "AWAITING_WEATHER_CONFIRMATION";
      console.log(ctx);
    } else if (
      ctx.message.text == "Да" &&
      userStates[userId] === "AWAITING_WEATHER_CONFIRMATION"
    ) {
      ctx.reply("Тогда скинь геопозицию, сделаю по красоте!");
      userStates[userId] = "AWAITING_LOCATION";
    }
  }
});

bot.launch();

// Enable graceful stop
process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));
