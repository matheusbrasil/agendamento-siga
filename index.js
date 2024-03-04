require('dotenv').config();
const puppeteer = require('puppeteer');
const TelegramBot = require('node-telegram-bot-api');
const token = process.env.BOT_FATHER_API_KEY;
const bot = new TelegramBot(token, { polling: true });
const agendamentoSiga = require('./AgendamentoSiga');

bot.on('message', (msg) => {
  const chatId = msg.chat.id;
  const messageText = msg.text;

  if (messageText === '/start') {
    bot.sendMessage(chatId, 'Welcome to the bot!');
  }
});

bot.onText(/\/start/, (msg) => {
  bot.sendMessage(msg.chat.id, `Welcome ${msg.chat.first_name}, the bot will start the monitoring of the SIGA schedules.`);
});

bot.onText(/\/checkdistrict/, async (msg) => {
  const chatId = msg.chat.id;
  const listaDeDistritos = await agendamentoSiga.getDistritos()
  agendamentoSiga.command = 'distrito'
  const keyboard = {
    inline_keyboard: listaDeDistritos.map(distrito => ([{ text: distrito.text, callback_data: distrito.value }]))
  }
  bot.sendMessage(chatId, 'Please select a district:', { reply_markup: keyboard });
});

bot.on('callback_query', async (callbackQuery) => {
  const chatId = callbackQuery.message.chat.id;
  const callBackValue = callbackQuery.data; // Get the district from the button click

  switch (agendamentoSiga.command) {
    case 'distrito':
      agendamentoSiga.command = 'localidades'
      await agendamentoSiga.setDistrito(callBackValue)
      const locales = await agendamentoSiga.getLocalidades()

      if (locales.length > 1) {
        const keyboard = {
          inline_keyboard: locales.map(locale => ([{ text: locale.text, callback_data: locale.value }]))
        }
        bot.sendMessage(chatId, 'Please select a locale:', { reply_markup: keyboard });
        break;
      }

      await agendamentoSiga.setLocalidade(locales[0].value)
      const serviceLocationsTest = await agendamentoSiga.getLocaisDeAtendimento()

      if (serviceLocationsTest.length > 1) {
        agendamentoSiga.command = 'localDeAtendimento'
        const keyboard = {
          inline_keyboard: serviceLocationsTest.map(serviceLocation => ([{ text: serviceLocation.text, callback_data: serviceLocation.value }]))
        }
        bot.sendMessage(chatId, 'Please select a service locations:', { reply_markup: keyboard });
        break;
      }

      await agendamentoSiga.setLocalDeAtendimento(serviceLocationsTest[0].value)
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

  // You can perform further actions based on the user's choice
  // For example, you can send more data related to the selected district
  //bot.sendMessage(chatId, `You selected district: ${district}`);
});


async function getDistritos() {
  const browser = await puppeteer.launch({ slowMo: 25 })
  const page = await browser.newPage()

  // Navigate the page to a URL
  await page.goto('https://siga.marcacaodeatendimento.pt/')

  // Set screen size
  await page.setViewport({ width: 1080, height: 1024 })

  await page.click('#btnMarcar')
  await page.waitForSelector('.card-entidade')

  const cardElements = await page.$$('.card-entidade')
  for (const cardElement of cardElements) {
    const textContent = await cardElement.evaluate(el => el.textContent)
    if (textContent.includes('Start scheduling appointment selecting the entity.')) {
      const button = await cardElement.$('.btn-entidade-assunto')
      await button.click()
      break
    }
  }

  await page.waitForSelector('.choose-entity')
  await page.click('.choose-entity button[id="176"]')
  await page.waitForSelector('.choose-subject')
  await page.waitForSelector('#IdCategoria')
  await page.select('#IdCategoria', '22002')

  await page.waitForSelector('#IdSubcategoria')
  let subcategoriaIsDisabled
  do {
    subcategoriaIsDisabled = await page.evaluate(() => {
      const selectElement = document.querySelector('#IdSubcategoria');
      return selectElement.disabled;
    });
  } while (subcategoriaIsDisabled);
  await page.select('#IdSubcategoria', '30825')

  await page.waitForSelector('#IdMotivo')
  let motivoIsDisabled
  do {
    motivoIsDisabled = await page.evaluate(() => {
      const selectElement = document.querySelector('#IdMotivo');
      return selectElement.disabled;
    });
  } while (motivoIsDisabled);
  await page.select('#IdMotivo', '30826')

  await page.waitForSelector('#liProximoButton');

  let hasNextAndDisabledClasses
  do {
    hasNextAndDisabledClasses = await page.evaluate(() => {
      const liElement = document.querySelector('#liProximoButton');
      return liElement.classList.contains('next') && liElement.classList.contains('disabled');
    })
  } while (hasNextAndDisabledClasses);

  await page.waitForSelector('.set-date-button')
  await page.click('.set-date-button')

  await page.waitForSelector('.schedule-location')
  page.waitForSelector('#IdDistrito')

  const districtOptions = await page.evaluate(() => {
    const selectElement = document.querySelector('#IdDistrito');
    const optionElements = selectElement.querySelectorAll('option');
    return Array.from(optionElements, option => ({
      value: option.value,
      text: option.textContent.trim()
    }));
  });

  districtOptions.shift()

  return districtOptions;
}

