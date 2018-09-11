import * as dotenv from "dotenv";
import { InsightWS } from "../lib/insightWS";
import { merchantKey } from "../lib/sample/keys";
import { InsightAPI } from "../lib/insightAPI";
import { Tx } from "../lib/interface/entity/insight/txByBlockhash";
import { BlockScanner } from "../lib/blockScanner";
import { IPFSAdapter } from "../lib/ipfsAdapter";


// load .env file at Directory root.
dotenv.config()

// watch new blocks
const apiUrl = `http://${process.env.API_URL}/${process.env.INSIGHT_API_BASE}/`;
const wsUrl = `http://${process.env.API_URL}/`;

const api = new InsightAPI(apiUrl);
const ws = new InsightWS(wsUrl);
const sb = new BlockScanner(api, merchantKey.derive.pubkey, merchantKey.derive.privkey);
const ipfsAdapter = new IPFSAdapter();

const callback = async (blockhash: string) => {
	const tx = await sb.findSignalByBlockHash(blockhash);
	if (tx) {
		console.log(`signal found in txid: ${(tx as Tx).txid}`);
		console.log(tx);

		const contentAddress = sb.getIPFSContentAddress(tx);
		console.log(contentAddress);

		// get contract from signal, by IPFS
		ipfsAdapter.get(contentAddress, "getContract.txt");
	}
}

ws.subscribBlocks(callback);
