const puppeteer = require('puppeteer');

(async () => {
    const browser = await puppeteer.launch({
        headless: false,
        args: ['--remote-debugging-port=49150'],
        width: 1000, height: 1000
    });
})()