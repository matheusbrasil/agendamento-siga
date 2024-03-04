const puppeteer = require('puppeteer');

class AgendamentoSiga {

    #browser
    #page
    #command

    constructor() {
        if (!AgendamentoSiga.instance) {
            AgendamentoSiga.instance = this;
        }
        return AgendamentoSiga.instance;
    }

    set command(value) {
        this.#command = value
    }

    get command() {
        return this.#command
    }

    async #setBrowser() {
        this.#browser = await puppeteer.launch({ slowMo: 10 })
        // this.#browser = await puppeteer.launch({ headless: false, slowMo: 10 })
    }

    async #setPage() {
        this.#page = await this.#browser.newPage()
        await this.#page.goto('https://siga.marcacaodeatendimento.pt/')
        await this.#page.setViewport({ width: 1080, height: 1024 })
    }

    async #closeBrowser() {
        await this.#browser.close()
    }

    async #navigateToAttendancePlace() {

        await this.#setBrowser()
        await this.#setPage()
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
        await this.#navigateToAttendancePlace()
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
        await this.#page.select('#IdDistrito', distrito.toString())
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

    async getLocaisDeAtendimento() {
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

    async setLocalDeAtendimento(localDeAtendimento) {
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

    async navigateToAppointmentTime() {
        await this.#page.waitForSelector('.set-date-button')
        await this.#page.click('.set-date-button')

        await this.#page.waitForSelector('.schedule-details')
        const errorMessageElement = await this.#page.$('.error-message');

        if (errorMessageElement) {
            const message = await this.#page.$eval('.error-message h5', element => element.textContent.trim())
            await this.#closeBrowser()
            throw new Error(message)
        } else {
            const screenshot = await this.#page.screenshot()
            await this.#closeBrowser()
            return screenshot
        }
    }
}

module.exports = new AgendamentoSiga();