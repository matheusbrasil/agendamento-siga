require('dotenv').config();
const puppeteer = require('puppeteer');
const TelegramBot = require('node-telegram-bot-api');
const token = process.env.BOT_FATHER_API_KEY;
const bot = new TelegramBot(token, { polling: true });
//const agendamentoSiga = new AgendamentoSiga();

bot.on('message', (msg) => {
  const chatId = msg.chat.id;
  const messageText = msg.text;

  if (messageText === '/start') {
    bot.sendMessage(chatId, 'Welcome to the bot!');
  }
});

bot.onText(/\/start/, (msg) => {
  bot.sendMessage(msg.chat.id, `Welcome ${msg.chat.first_name}`);
});

bot.onText(/\/distritos/, async (msg) => {
  const chatId = msg.chat.id;
  const listaDeDistritos = await getDistritos()

  const keyboard = {
    inline_keyboard: listaDeDistritos.map(distrito => ([{ text: distrito.text, callback_data: distrito.value }]))
  }
  bot.sendMessage(chatId, 'Please select a district:', { reply_markup: keyboard });
});

bot.on('callback_query', (callbackQuery) => {
  const chatId = callbackQuery.message.chat.id;
  const district = callbackQuery.data; // Get the district from the button click
  
  // You can perform further actions based on the user's choice
  // For example, you can send more data related to the selected district
  bot.sendMessage(chatId, `You selected district: ${district}`);
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

class AgendamentoSiga {

  #browser
  #page

  constructor() {
    this.#setBrowser()
  }

  async #setBrowser() {
    this.#browser = await puppeteer.launch({ slowMo: 25 })
    await this.#setPage()
  }

  async #setPage() {
    this.#page = await browser.newPage()
    await this.#page.goto('https://siga.marcacaodeatendimento.pt/')
    await this.#page.setViewport({ width: 1080, height: 1024 })
  }

  async #closeBrowser() {
    await this.#browser.close()
  }

  async #navigateToAttendancePlace() {
    await this.#page.click('#btnMarcar')
    await this.#page.waitForSelector('.card-entidade')

    const cardElements = await this.#page.$$('.card-entidade')
    for (const cardElement of cardElements) {
      const textContent = await cardElement.evaluate(el => el.textContent)
      if (textContent.includes('Start scheduling appointment selecting the entity.')) {
        const button = await cardElement.$('.btn-entidade-assunto')
        await button.click()
        break
      }
    }

    await this.#page.waitForSelector('.choose-entity')
    await this.#page.click('.choose-entity button[id="176"]')
    await this.#page.waitForSelector('.choose-subject')
    await this.#page.waitForSelector('#IdCategoria')
    await this.#page.select('#IdCategoria', '22002')

    await this.#page.waitForSelector('#IdSubcategoria')
    let subcategoriaIsDisabled
    do {
      subcategoriaIsDisabled = await this.#page.evaluate(() => {
        const selectElement = document.querySelector('#IdSubcategoria');
        return selectElement.disabled;
      });
    } while (subcategoriaIsDisabled);
    await this.#page.select('#IdSubcategoria', '30825')

    await this.#page.waitForSelector('#IdMotivo')
    let motivoIsDisabled
    do {
      motivoIsDisabled = await this.#page.evaluate(() => {
        const selectElement = document.querySelector('#IdMotivo');
        return selectElement.disabled;
      });
    } while (motivoIsDisabled);
    await this.#page.select('#IdMotivo', '30826')

    await this.#page.waitForSelector('#liProximoButton');

    let hasNextAndDisabledClasses
    do {
      hasNextAndDisabledClasses = await this.#page.evaluate(() => {
        const liElement = document.querySelector('#liProximoButton');
        return liElement.classList.contains('next') && liElement.classList.contains('disabled');
      })
    } while (hasNextAndDisabledClasses);

    await this.#page.waitForSelector('.set-date-button')
    await this.#page.click('.set-date-button')

    await this.#page.waitForSelector('.schedule-location')
  }

  async getDistritos() {
    await this.#page.waitForSelector('#IdDistrito')
    const districtOptions = await this.#page.evaluate(() => {
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

  async setDistrito(distrito) {
    await this.#page.waitForSelector('#IdDistrito')
    let selectorIsDisabled
    do {
      selectorIsDisabled = await this.#page.evaluate(() => {
        const selectElement = document.querySelector('#IdDistrito');
        return selectElement.disabled;
      });
    } while (selectorIsDisabled);
    await this.#page.select('#IdDistrito', distrito)
  }

  async getLocalidades() {
    await this.#page.waitForSelector('#IdLocalidade')
    const LocalesOptions = await this.#page.evaluate(() => {
      const selectElement = document.querySelector('#IdLocalidade');
      const optionElements = selectElement.querySelectorAll('option');
      return Array.from(optionElements, option => ({
        value: option.value,
        text: option.textContent.trim()
      }));
    });

    return LocalesOptions;
  }

  async setLocalidade(localidade) {
    await this.#page.waitForSelector('#IdLocalidade')
    let selectorIsDisabled
    do {
      selectorIsDisabled = await this.#page.evaluate(() => {
        const selectElement = document.querySelector('#IdLocalidade');
        return selectElement.disabled;
      });
    } while (selectorIsDisabled);
    await this.#page.select('#IdLocalidade', localidade)
  }

  async getLocaisdeAtendimento() {
    await this.#page.waitForSelector('#IdLocalAtendimento')
    const LocalesOptions = await this.#page.evaluate(() => {
      const selectElement = document.querySelector('#IdLocalAtendimento');
      const optionElements = selectElement.querySelectorAll('option');
      return Array.from(optionElements, option => ({
        value: option.value,
        text: option.textContent.trim()
      }));
    });

    return LocalesOptions;
  }

  async setLocaldeAtendimento(localDeAtendimento) {
    await this.#page.waitForSelector('#IdLocalAtendimento')
    let selectorIsDisabled
    do {
      selectorIsDisabled = await this.#page.evaluate(() => {
        const selectElement = document.querySelector('#IdLocalAtendimento');
        return selectElement.disabled;
      });
    } while (selectorIsDisabled);
    await this.#page.select('#IdLocalAtendimento', localDeAtendimento)
  }
}