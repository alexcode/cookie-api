#!/usr/bin/env node
import fetch from 'node-fetch';
import { JsonDB } from 'node-json-db';
import { Config } from 'node-json-db/dist/lib/JsonDBConfig'
import { StringStream } from 'scramjet';

const get = async (url: string, options = {}) => (await fetch(url, options)).text();
const DB = new JsonDB(new Config("db/cookiedata", false, true, '*'));

StringStream
.from(() => get("https://raw.githubusercontent.com/jkwakman/Open-Cookie-Database/master/open-cookie-database.csv"))
.CSVParse({
    delimiter: ",",
    skipEmptyLines: true,
    header: false
})
.shift(1, (x) => console.log("Shifted", x))
.each(item => {
    DB.push(`*${item[0]}`, {
        id: item[0],
        platform: item[1],
        type: item[2],
        key: item[3],
        domain: item[4],
        i18n: {
            en: item[5]
        }
    });
})
.run()
.then(() => DB.save())
.catch(e => console.error(e));