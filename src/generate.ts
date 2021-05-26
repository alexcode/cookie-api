#!/usr/bin/env node
import path from 'path';
import fs from 'fs';
import { JsonDB } from 'node-json-db';
import { Config } from 'node-json-db/dist/lib/JsonDBConfig'
import program from 'commander';
import { CookieItem } from './types';

program.parse();

const DB = new JsonDB(new Config("db/cookiedata", false, true));
const list: Array<CookieItem> = Object.values(DB.getData('/'));
const dir = path.resolve('./api');

fs.mkdirSync(dir, { recursive: true });

const promises = list.map((cookie: CookieItem) => fs.promises.writeFile(
    `${dir}/${cookie.key}.json`, 
    JSON.stringify(cookie), 
    { encoding: 'utf8', flag: 'w' }
));
promises.push(fs.promises.writeFile(
    `${dir}/index.html`, 
    JSON.stringify(list), 
    { encoding: 'utf8', flag: 'w' }
));

Promise.all(promises).then(console.log).catch(console.error);