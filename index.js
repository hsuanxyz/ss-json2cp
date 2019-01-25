#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const os = require('os');
const clipboardy = require('clipboardy');

(() => {
  const jsonPath = process.argv[2];

  if (!jsonPath || !fs.existsSync(jsonPath)) {
    console.error('Unable to find json file.');
    process.exit();
  }

  if(path.extname(jsonPath).toLocaleUpperCase() !== '.JSON') {
    console.error(`Unsupported extname: ${jsonPath}`);
    process.exit();
  }

  const jsonString = fs.readFileSync(jsonPath).toString('utf-8');
  let config = null;
  try {
    config = JSON.parse(jsonString);

    if (!Array.isArray(config.configs)) {
      throw new TypeError('JSON type error, unable find the configs property or this property is not Array type.')
    }
  } catch (e) {
    console.error(e);
    process.exit();
  }

  const results = config.configs.map(item => parseItem(item)).join(os.EOL);
  clipboardy.writeSync(results);
  console.log(results);
  process.exit();
})();

/**
 *
 * @param {{
 *    password: string,
 *    method: string,
 *    server: string,
 *    server_port: string,
 *    remarks: string
 *  }} item
 */
function parseItem(item) {
  const { method, password, server, server_port, remarks } = item;
  const cleartext = `${method}:${password}@${server}:${server_port}`;
  return `ss://${Buffer.from(cleartext).toString('base64')}#${encodeURIComponent(remarks)}`
}
