require('dotenv').config();
const token = process.env.BOT_FATHER_API_KEY;
const TelegramBot = require('node-telegram-bot-api');
const bot = new TelegramBot(token, { polling: true });
const AgendamentoSiga = require('./AgendamentoSiga');
const Monitor = require('./Monitor');

bot.onText(/\/start/, (msg) => {
  const monitor = Monitor.getIstance(msg.chat.id, bot)
  monitor.startMonitor()
  bot.sendMessage(msg.chat.id, `Welcome ${msg.chat.first_name}, the bot will start the monitoring of the SIGA schedules.`)
});

bot.onText(/\/stop/, (msg) => {
  const monitor = Monitor.getIstance(msg.chat.id, bot)
  monitor.stopMonitor()
  bot.sendMessage(msg.chat.id, `Thank you ${msg.chat.first_name}, the bot will stop the monitoring of the SIGA schedules.`)
});

bot.onText(/\/checkdistrict/, async (msg) => {
  const chatId = msg.chat.id;
  const agendamentoSiga = AgendamentoSiga.getIstance()
  const listaDeDistritos = await agendamentoSiga.getDistritos()
  agendamentoSiga.command = 'distrito'
  const keyboard = {
    inline_keyboard: listaDeDistritos.map(distrito => ([{ text: distrito.text, callback_data: distrito.value }]))
  }
  bot.sendMessage(chatId, 'Please select a district:', { reply_markup: keyboard });
});

bot.on('callback_query', async (callbackQuery) => {
  const chatId = callbackQuery.message.chat.id;
  const agendamentoSiga = AgendamentoSiga.getIstance()
  const callBackValue = callbackQuery.data;

  switch (agendamentoSiga.command) {
    case 'distrito':
      agendamentoSiga.command = 'localidades'
      await agendamentoSiga.setDistrito(callBackValue)
      const locales = await agendamentoSiga.getLocalidades()

      if (locales.length > 1) {
        const keyboard = {
          inline_keyboard: locales.filter(locale => locale.value && locale.value !== '-1').map(locale => ([{ text: locale.text, callback_data: locale.value }]))
        }
        bot.sendMessage(chatId, 'Please select a locale:', { reply_markup: keyboard });
        break;
      }

      await agendamentoSiga.setLocalidade(locales[0].value)
      const districtServiceLocations = await agendamentoSiga.getLocaisDeAtendimento()

      if (districtServiceLocations.length > 1) {
        agendamentoSiga.command = 'localDeAtendimento'
        const keyboard = {
          inline_keyboard: districtServiceLocations.map(serviceLocation => ([{ text: serviceLocation.text, callback_data: serviceLocation.value }]))
        }
        bot.sendMessage(chatId, 'Please select a service locations:', { reply_markup: keyboard });
        break;
      }

      await agendamentoSiga.setLocalDeAtendimento(districtServiceLocations[0].value)
      try {
        bot.sendPhoto(chatId, await agendamentoSiga.navigateToAppointmentTime())
      } catch (error) {
        bot.sendMessage(chatId, error.message)
      }
      break;
    case 'localidades':
      agendamentoSiga.command = 'localDeAtendimento'
      await agendamentoSiga.setLocalidade(callBackValue)
      const serviceLocations = await agendamentoSiga.getLocaisDeAtendimento()

      if (serviceLocations.length > 1) {
        const keyboard = {
          inline_keyboard: serviceLocations.map(serviceLocation => ([{ text: serviceLocation.text, callback_data: serviceLocation.value }]))
        }
        bot.sendMessage(chatId, 'Please select a service locations:', { reply_markup: keyboard });
        break;
      }

      await agendamentoSiga.setLocalDeAtendimento(serviceLocations[0].value)
      try {
        bot.sendPhoto(chatId, await agendamentoSiga.navigateToAppointmentTime())
      } catch (error) {
        bot.sendMessage(chatId, error.message)
      }
      break;
    case 'localDeAtendimento':
      await agendamentoSiga.setLocalDeAtendimento(callBackValue)
      try {
        bot.sendPhoto(chatId, await agendamentoSiga.navigateToAppointmentTime(), {}, { filename: 'screenshot' })
      } catch (error) {
        bot.sendMessage(chatId, error.message)
      }
      break;
    default:
      break;
  }
});

