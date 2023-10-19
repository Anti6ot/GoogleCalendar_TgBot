import { Telegraf } from "telegraf";
import { message } from "telegraf/filters";
import config from "config";
import { calendar } from "@googleapis/calendar";
import { google } from "googleapis";
// const fs = require("fs");
// const { google } = require("googleapis");

// console.log(config);
const client_secret = {
  YOUR_CLIENT_ID:
    "460924242671-9p21ookaop10luoe060eme5t6lo4t0km.apps.googleusercontent.com",
  YOUR_CLIENT_SECRET: "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",
  YOUR_REDIRECT_URL: "/",
  CALENDAR_ID:
    "ced1aaf63ba15dcdb8b4404c8ed197cd0592e66a8590de5cccd2a0139fd9b1ba@group.calendar.google.com",
};

const CALENDAR_ID =
  "ced1aaf63ba15dcdb8b4404c8ed197cd0592e66a8590de5cccd2a0139fd9b1ba@group.calendar.google.com";
const SCOPE_CALENDAR = "https://www.googleapis.com/auth/calendar"; // authorization scopes
const SCOPE_EVENTS = "https://www.googleapis.com/auth/calendar.events";

(async function run() {
  // INNER FUNCTIONS
  // async function readPrivateKey() {
  //   const content = fs.readFileSync(KEYFILE);
  //   return JSON.parse(content.toString());
  // }

  async function authenticate(key) {
    const jwtClient = new google.auth.JWT(
      key.client_email,
      null,
      key.private_key,
      [SCOPE_CALENDAR, SCOPE_EVENTS]
    );
    await jwtClient.authorize();
    return jwtClient;
  }

  async function createEvent(auth) {
    const event = {
      summary: "Habr Post Demo",
      description:
        "Тест для демонстрации интеграции nodejs-приложения с Google Calendar API.",
      start: {
        dateTime: "2023-10-18T16:00:00+02:00",
        timeZone: "Europe/Riga",
      },
      end: {
        dateTime: "2023-10-20T18:00:00+02:00",
        timeZone: "Europe/Riga",
      },
    };

    let calendar = google.calendar("v3");
    await calendar.events.insert({
      auth: auth,
      calendarId: CALENDAR_ID,
      resource: event,
    });
  }

  // MAIN
  try {
    const auth = await authenticate(config);
    await createEvent(auth);
  } catch (e) {
    console.log("Error: " + e);
  }
})();
const bot = new Telegraf(config.get("BOT_TOKEN"), {
  handlerTimeout: Infinity,
});

bot.start((ctx) => ctx.reply("welcome"));
bot.on("message", (ctx) => {
  console.log(ctx.update);
});
bot.launch();
