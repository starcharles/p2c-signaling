import { IPFSAdapter } from "../lib/ipfsAdapter";
import * as dotenv from "dotenv";
import * as fs from "fs";
import * as crypto from "crypto";

// load .env file at Directory root.
dotenv.config();

(async () => {
	const path = "./src/server/example";
	const filename = "enc.txt"
	const output_filename = "shop-contract-dl.json"

	// 1. get contract 
	const ipfsAdapter = new IPFSAdapter();
	const contentAddress = "QmSTT8fDPBsNfhPew3WddWSFKH7iwRTS74bMv6aviz6rwG";

	setTimeout(async () => {
		await ipfsAdapter.get(contentAddress, `${path}/${filename}`)
		ipfsAdapter.close();

		// 2. read and decrypt contranct 
		const data = fs.readFileSync(`${path}/${filename}`);

		const sharedpubkey = process.env.SHARED_KEY as string;
		// key length should be 256 bits.
		const m = crypto.createHash('sha256');
		m.update(sharedpubkey);
		const key = m.digest();
		const iv = process.env.INITIAL_VECTOR as string;
		const mode = process.env.ENCRYPTION_MODE as string;

		const decipher = crypto.createDecipheriv(mode, key, Buffer.from(iv, "hex"));
		var dec = decipher.update(data, "base64", "utf8");
		dec += decipher.final("utf8");

		const parsed = JSON.parse(dec);
		fs.writeFileSync(`${path}/${output_filename}`, parsed);
	}, 1000);

})();