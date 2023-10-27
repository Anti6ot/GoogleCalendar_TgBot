import config from "config";
import { google } from "googleapis";

const CALENDAR_ID =
  "ced1aaf63ba15dcdb8b4404c8ed197cd0592e66a8590de5cccd2a0139fd9b1ba@group.calendar.google.com";
const SCOPE_CALENDAR = "https://www.googleapis.com/auth/calendar"; // authorization scopes
const SCOPE_EVENTS = "https://www.googleapis.com/auth/calendar.events";

export async function run({dateStart, timeStart, dateEnd, text, h1}) {
  const parse = Date.parse(`${dateStart} ${timeStart}:00 GMT`) + 10000000; // парсит дату и добавляет 2 с половиной часа
  let lastEndDate = JSON.stringify(new Date(parse)).slice(1,20)

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
      summary: "ТГ БОТ",
      description: text || "not writing",
      start: {
        dateTime: `${dateStart}T${timeStart}:00+05:00`,
        timeZone: "Asia/Yekaterinburg",
      },
      end: {
        dateTime: `${lastEndDate}+05:00`,
        timeZone: "Asia/Yekaterinburg",
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
}
