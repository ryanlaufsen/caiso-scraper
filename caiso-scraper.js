const puppeteer = require('puppeteer');

function dateMaker(d) {
    let year = d.getFullYear();
    let month = d.getMonth() + 1; // getMonth() starts with January at 0
    let date = d.getUTCDate();
    let fullDate = month + '/' + date + '/' + year
    return fullDate;
}

let startDate = new Date(Date.UTC(2019, 2, 21)); // March 19, 2019

let endDate = new Date(Date.UTC(2021, 3, 19)); // March 19, 2021

let difference = (endDate - startDate) / (1000 * 3600 * 24);
console.log(difference);

(async () => {
    async function connectBrowser() {
        const browserURL = 'http://127.0.0.1:49150';
        const browser = await puppeteer.connect({ browserURL });
        const pages = await browser.pages();
        const page = pages[0];
        return { page, pages, browser };
    }

    const { page } = await connectBrowser();
    await page.goto('http://www.caiso.com/todaysoutlook/pages/emissions.html', { waitUntil: 'load' });

    async function download(fullDate) {

        await page.evaluate(() => {
            document.querySelector('.form-control.form-control-sm.date.co2-date').value = '';
        });

        await page.type('.form-control.form-control-sm.date.co2-date', fullDate);
        await page.keyboard.press('Enter');

        await page.evaluate(() => {
            document.querySelector('.form-control.form-control-sm.date.co2-date').blur();
        });

        await page.evaluate(() => {
            document.querySelector('#downloadCO2CSV').click();
        });

        // await page.click('#dropdownMenu1');
        // await page.click('#downloadCO2CSV');
    }

    let fullDate = dateMaker(startDate);
    let currentDate = startDate;
    for (i = 0; i < difference; i++) {
        console.log('Current Date:', fullDate);
        await download(fullDate);
        currentDate.setUTCDate(currentDate.getUTCDate() + 1);
        fullDate = dateMaker(currentDate);
        // await page.waitFor(1000);
    }

})()