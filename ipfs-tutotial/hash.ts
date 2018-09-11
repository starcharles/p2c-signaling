import * as fs from "fs";
import * as crypto from "crypto";

const data = fs.readFileSync("./shop-contract.json");

const str = JSON.stringify(data.toString());
console.log(str);

// const hashFunc = crypto.createHash("sha256");
// hashFunc.update(str);
// const hashBuf = hashFunc.digest();

// console.log(hashBuf.toString("hex"));

// const cipher = crypto.createCipher("aes192", "password");
// const input = fs.createReadStream('./shop-contract.json');
// const output = fs.createWriteStream('test.enc');

// input.pipe(cipher).pipe(output);