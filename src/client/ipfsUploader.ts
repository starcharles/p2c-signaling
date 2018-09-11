import { IPFSAdapter } from "../lib/ipfsAdapter";
import * as dotenv from "dotenv";
import * as fs from "fs";
import * as crypto from "crypto";

// load .env file at Directory root.
dotenv.config();

(async () => {
	// 1. read contranct 
	const path = "./src/client/example";
	const filename = "shop-contract.json"

	const dataBuf = fs.readFileSync(`${path}/${filename}`);
	const str = JSON.stringify(dataBuf.toString());

	// 2. encrypt it
	const sharedpubkey = process.env.SHARED_KEY as string;

	// key length should be 256 bits for AES-256-CBC.
	const m = crypto.createHash('sha256');
	m.update(sharedpubkey);
	const key = m.digest();

	// For AES-256-CBC, iv length is 16 bytes 
	// const iv = crypto.randomBytes(16);
	// console.log(iv.toString("hex"));
	const iv = process.env.INITIAL_VECTOR as string;
	const mode = process.env.ENCRYPTION_MODE as string;

	const cipher = crypto.createCipheriv(mode, key, Buffer.from(iv, "hex"));
	var enc_text = cipher.update(str, "utf8", "hex");
	enc_text += cipher.final("hex");

	// 3. add to ipfs
	const ipfsAdapter = new IPFSAdapter();

	setTimeout(async () => {
		const result = await ipfsAdapter.connect();
		// console.log(result);
		let res: string = "";
		res = await ipfsAdapter.add(filename, Buffer.from(enc_text, "hex"))
		console.log(res);
		ipfsAdapter.close();

		// =>  Added file: shop-contract.json QmSTT8fDPBsNfhPew3WddWSFKH7iwRTS74bMv6aviz6rwG
	}, 1000);
})();