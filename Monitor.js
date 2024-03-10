const { CronJob } = require("cron")
const fs = require("fs")
const AgendamentoSiga = require('./AgendamentoSiga')

class Monitor {

    static instance
    static job
    #chatId
    #bot

    constructor(chatId, bot) {
        this.#chatId = chatId
        this.#bot = bot
    }

    static getIstance(chatId, bot) {
        if (!this.instance) {
            this.instance = new Monitor(chatId, bot)
        }
        return this.instance
    }

    startMonitor() {
        const bot = this.#bot
        const chatId = this.#chatId
        const attendancePlaces = JSON.parse( fs.readFileSync("./AttendancePlace.json", "utf8") )
        this.job = CronJob.from({
            // cronTime: '*/20 * * * 1-5',
            // cronTime: '0 */30 7-18 * 1-5',
            cronTime: '* * * * * *',
            onTick: async function () {
                for (const attendancePlace of attendancePlaces) {
                    const agendamentoSiga = new AgendamentoSiga()
                    try {
                        bot.sendPhoto(chatId, await agendamentoSiga.checkAttendancePlace(districtValue, localeValue, attendancePlaceValue))
                    } catch (error) {
                    }
                }
            },
            start: true,
            timeZone: 'Europe/Lisbon'
        });
    }

    stopMonitor() {
        this.job.stop()
    }

}
module.exports = Monitor;