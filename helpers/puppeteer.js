import puppeteer from "puppeteer-extra";
import StealthPlugin from 'puppeteer-extra-plugin-stealth'

puppeteer.use(StealthPlugin())

export const LAUNCH_PUPPETER_OPTS = {
    // headless: false,
    args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-accelerated-2d-canvas',
        '--disable-gpu',
        // '--window-size=1920x1080'
    ]
}

export const PAGE_PUPPETEER_OPTS = {
    networkIdle2Timeout: 5000,
    waitUntil: 'networkidle2',
    timeout: 3000000
}

const requestTypesToBlock = [
    'stylesheet', 
    'image',
    'font',
    'document',
    'media'
]

export async function getPageContent(url) {
    try {
        const browser = await puppeteer.launch(LAUNCH_PUPPETER_OPTS)
        const page = await browser.newPage() 
        
        await page.goto(url, PAGE_PUPPETEER_OPTS)
        page.setRequestInterception(true)
        page.on('request', (request) => {
            if( 
                requestTypesToBlock.includes(request.resourceType()) || 
                request.url().includes('https://analytics.google.com') ||
                request.url().includes('https://mc.yandex.ru') 
                ) {
                    return request.abort()
                } else {
                    request.continue()
                }
            })
            

        await page.waitForSelector('.product-buy__price')
        const content = await page.evaluate(() => {
            const products = Array.from(document.querySelectorAll('.catalog-product'))
            const productsData = []

            products.map((product) => {
                const singleProduct = {
                    title: product.querySelector('a span').innerHTML,
                    price: product.querySelector('.product-buy__price').firstChild.textContent
                }
                productsData.push(singleProduct)
            })

            return productsData
        })
        
        // await page.screenshot({path: 'screen.png'})
        await browser.close()
        return content
    } catch (e) {
        throw e
    }
}