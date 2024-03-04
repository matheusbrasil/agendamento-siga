const puppeteer = require('puppeteer');

(async () => {


  // Launch the browser and open a new blank page
  // const browser = await puppeteer.launch()
  const browser = await puppeteer.launch({ headless: false })
  // const browser = await puppeteer.launch({ headless: false, slowMo: 100 })
  const page = await browser.newPage()

  // Navigate the page to a URL
  await page.goto('https://siga.marcacaodeatendimento.pt/')

  // Set screen size
  await page.setViewport({ width: 1080, height: 1024 })

  await page.click('#btnMarcar')
  console.log("Clickou no primeiro botao na home page")

  await page.waitForSelector('.card-entidade')

  const cardElements = await page.$$('.card-entidade')
  for (const cardElement of cardElements) {
    const textContent = await cardElement.evaluate(el => el.textContent)
    if (textContent.includes('Start scheduling appointment selecting the entity.')) {
      const button = await cardElement.$('.btn-entidade-assunto')
      await button.click()
      console.log("Clickou no botao para escolher a entidade")
      break
    }
  }

  await page.waitForSelector('.choose-entity')
  await page.click('.choose-entity button[id="176"]')
  console.log("Clickou no botao para escolher IRN")

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
  const selectorDistritos = await page.waitForSelector('#IdDistrito')

  const districtOptions = await page.evaluate(() => {
    const selectElement = document.querySelector('#IdDistrito');
    const optionElements = selectElement.querySelectorAll('option');
    return Array.from(optionElements, option => option.textContent);
  });

  districtOptions.shift()

  await browser.close()
})()