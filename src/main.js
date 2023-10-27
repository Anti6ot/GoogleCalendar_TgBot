import TelegramApi from "node-telegram-bot-api";
import config from "config";
import {Calendar} from 'telegram-inline-calendar';
import calendar from "./common/calendar.js";

const bot = new TelegramApi(config.get("BOT_TOKEN"), { polling: true });

bot.setMyCommands([
  { command: "/start", description: "Начальное приветствие" },
  { command: "/info", description: "Получить информацию о пользователе" },
  { command: "/eventset", description: "Введите дату предстоящего события" },
]);

const googleCalendar = new Calendar(bot, {
  date_format: 'YYYY-MM-DD',
  language: 'ru'
});

const dataGcalendar = {
  text: "",
  timeStart:"",
  timeEnd:"",
  dateStart: "",
  dateEnd:"",
  msg: ""
}


function start() {

  bot.onText(/\/start/, msg => {
    const chatId = msg.chat.id;
    bot.sendMessage(
      chatId,
      `Добро пожаловать в чат с ботом google calendar. С помощью этого бота вы можете с легкостью добавить событие в свой гугл календарь`
    );
  })
  bot.onText(/\/info/, msg => {
    const chatId = msg.chat.id;
    return bot.sendMessage(chatId, `Тебя зовут ${msg.chat.first_name}`);
  })

  bot.onText(/\/eventset/, msg => {
    const chatId = msg.chat.id;
    try {
      calendar(bot,dataGcalendar, googleCalendar, msg, chatId)
      bot.on("callback_query", (query) => {
          let res;
          res = googleCalendar.clickButtonCalendar(query);
    
          if (res !== -1) {
            if(query.message.text === 'Пожалуйста, выберите время:'){
            return  dataGcalendar.timeStart = query.data.trim().replace(/[a-zа-яё]/gi, '').slice(12, 17);
            }
            if(query.message.text === 'Пожалуйста, выберите дату:'){
             return dataGcalendar.dateStart = query.data.trim().replace(/[a-zа-яё]/gi, '').slice(1,11);
            }
            return null
          }
      });
      return bot.sendMessage(chatId, "введите описание события")
      
    } catch (error) {
      console.log(`ERROR MAIN.js: ${error}`)
    }
   
  })

 
}


start();
