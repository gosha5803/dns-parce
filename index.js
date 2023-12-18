import chalk from "chalk";
import { arrayFromLength } from './helpers/common.js'
import { getPageContent } from './helpers/puppeteer.js'
import { saveData } from "./helpers/saver.js";

const SITE = 'https://www.dns-shop.ru/catalog/17a8d26216404e77/vstraivaemye-xolodilniki/?p='
const pages = 5

async function main() {
    let contentFromAllPages = []

    try {
        for(const page of arrayFromLength(pages)) {
            const URL = `${SITE}${page}`
            const pageContent = await getPageContent(URL)

            contentFromAllPages = contentFromAllPages.concat(pageContent)
        }
        
        saveData(contentFromAllPages)
        console.log(chalk.blue('Finished'))
    } catch (err) {
        console.log(chalk.red('An error has ocured /n'))
        console.log(err)
    }
}

main()