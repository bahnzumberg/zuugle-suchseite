const puppeteer = require('puppeteer');
const path = require("path");

export class BrowserService {

    static async getInstance() {
        if (this.instance == null) {
            this.instance = new BrowserService();
            await this.instance.init();
        }
        return this.instance;
    }

    constructor() { }

    async init() {
        let addParam = {};
        if(process.env.NODE_ENV == "production"){
            addParam.executablePath = path.resolve(__dirname,'../../node_modules/puppeteer/.local-chromium/linux-1022525/chrome-linux/chrome')
        }

        this._browser = await puppeteer.launch({
            ...addParam,
            headless: "true", // this new config replaces "true" does not work in my local machine but it does on UAT and PROD
            args: ['--no-sandbox']
        });

    }

    async closePage(page) {
        try {
            if(!!page) {
                await page.close();
            } else {
                console.log('no page given')
            }
        } catch(e){
            console.log('error closing page: ', e)
        }

    }

    getBrowser() {
        return this._browser;
    }

    async createNewPage(){
        try {
            if(this._browser){
                return await this._browser.newPage();
            }
        } catch (e){
            console.log('error creating page: ', e)
        }

        return null;
    }

}