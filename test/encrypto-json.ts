import * as fs from "fs";
import * as crypto from "crypto";
import * as assert from "assert";


// 1. read contranct 
const path = "./src/client";

const dataBuf = fs.readFileSync(`${path}/example/shop-contract.json`);
const str = JSON.stringify(dataBuf.toString());

// 2. encrypt it
const sharedpubkey = "0330c70bd8402eb0035c9c543f9dfd647e3297b3db5bee79c940b52eb649cb92d9";

// key length should be 256 bits.
const m = crypto.createHash('sha256');
m.update(sharedpubkey);
const key = m.digest();

// For AES-256-CBC, iv length is 16 bytes 
// const iv = crypto.randomBytes(16);
// console.log(iv.toString("hex"));

const iv = "ec292018717f4cad405ac281d66d13c5"
const mode = "aes-256-cbc";

// 暗号化
const cipher = crypto.createCipheriv(mode, key, Buffer.from(iv, "hex"));
var enc_text = cipher.update(str, "utf8", "base64");
enc_text += cipher.final("base64");

// console.log(enc_text);

// 復号化
const decipher = crypto.createDecipheriv(mode, key, Buffer.from(iv, "hex"));
var dec = decipher.update(enc_text, 'base64', 'utf8');
dec += decipher.final('utf8');

const parsed = JSON.parse(dec);
fs.writeFileSync(`${path}/example/decrypted.json`, parsed);

assert.equal(JSON.parse(str), parsed)