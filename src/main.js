import { Telegraf } from "telegraf";
import { message } from "telegraf/filters";
import config from "config";

const bot = new Telegraf(config.get("BOT_TOKEN"), {
  handlerTimeout: Infinity,
});

bot.start((ctx) => ctx.reply("welcome"));
bot.on(message("hi"), (ctx) => ctx.reply("22"));
bot.launch();
