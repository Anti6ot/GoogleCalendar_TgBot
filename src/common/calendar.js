import { run } from "../services/googleCalendar.service.js"


export default function calendar (bot,dataGcalendar, gglClndr, msg, chatId){
    gglClndr.startNavCalendar(msg) //Инлайн клавиатура календаря в чате 
    gglClndr.startTimeSelector(msg) //инлайн клавиатура установки времени

    function proverka(msg) { //метод проверки листенера и отключения прослушки
              dataGcalendar.text = msg.text
              run(dataGcalendar)
              bot.sendMessage(chatId, 'Событие было добавленно');
              bot.removeListener("message", proverka);
    };
    
    bot.on('message', proverka);
 
}


