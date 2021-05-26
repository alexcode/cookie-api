#!/usr/bin/env node
import chalk from 'chalk';
import { JsonDB } from 'node-json-db';
import { Config } from 'node-json-db/dist/lib/JsonDBConfig'
import program from 'commander';
import translate from '@vitalets/google-translate-api';
import { MultiBar, Presets } from 'cli-progress';
import { promisify } from 'util';
import { CookieItem, Languages } from './types';


program.parse();

const DB = new JsonDB(new Config("db/cookiedata", false, true));
const languageList = program.args as Array<Languages>;
const notSupported = languageList.filter(l => !translate.languages.isSupported(l));

if(notSupported.length) {
    throw new Error(`Some languages are not supported: ${notSupported.join(', ')}`);
}


const list: Map<Languages, Array<CookieItem>> = new Map();
languageList.forEach(language => {
    const result: Array<CookieItem> | undefined = DB.filter('/', ({i18n}) => !i18n?.hasOwnProperty(language));
    if (result) {
        list.set(language, result);
    }
});

const sleep = promisify(setTimeout)

function randomIntFromInterval(min: number, max: number) { // min and max included 
  return Math.floor(Math.random() * (max - min + 1) + min)
}

async function translateCookie(cookie: CookieItem, to: string) {
    try {
        if (cookie.i18n.en) {   
            await sleep(randomIntFromInterval(500, 1200));
            const result = await translate(cookie.i18n.en, {from: 'en', to});
            return result.text;
        }
    } catch (error) {
        console.error(chalk.red(error));
    }
}

const promises = [];
const multibar = new MultiBar({
    clearOnComplete: false,
    hideCursor: true,
    format: `Translating {name} | ${chalk.greenBright('{bar}')} | {percentage}% || {value}/{total} Cookies`,
}, Presets.shades_classic);

for (let [to, cookies] of list) {
    const progress = multibar.create(cookies.length, 0, {
        name: to.toUpperCase()
    });

    for (const cookie of cookies) {
        promises.push(translateCookie(cookie, to).then((text) => {
            if (text) {
                DB.push(`/${cookie.id}/i18n/${to}`, text);
            }
            progress.increment();
        }));
    }
}

Promise.all(promises).then(() => {
    multibar.stop();
    DB.save();
});

