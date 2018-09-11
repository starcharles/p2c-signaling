import { Txs, Tx, VIn, VOut } from "../../lib/interface/insight/txByBlockhash";
import { merchantKey } from "../../lib/sample/keys";
import { ECDH } from "../../lib/ecdh";
import { InsightAPI } from "../../lib/insightAPI";
import * as dotenv from "dotenv";
import { KeyService } from "../../lib/keyService";

// load .env file at Directory root.
dotenv.config()

const sharedSecret = "0330c70bd8402eb0035c9c543f9dfd647e3297b3db5bee79c940b52eb649cb92d9";


const asyncFunc = async function () {
	const merchantPubkey = merchantKey.derive.pubkey;
	const merchantPrivkey = merchantKey.derive.privkey;
	// watch new blocks
	const apiUrl = `http://${process.env.API_URL}/${process.env.INSIGHT_API_BASE}/`;
	const api = new InsightAPI(apiUrl);

	// const response: Txs = await api.getTXsByBlockHash(blockhash);
	const response: Txs = await api.getTxsByBlockHash("42bf17c12592de9e63732294ecb989c965bfaea414099acec6222a6db23aaedd");

	response.txs.forEach(async (tx: Tx) => {
		const signalTx = checkSignalInTx(tx, merchantPubkey, merchantPrivkey);
		if (signalTx) {
			console.log(`signal found in ${(signalTx as Tx).txid}`);
		};
	});
}

function checkSignalInTx(tx: Tx, merchantPubkey: string, merchantPrivkey: string): Tx | boolean {
	if (tx.isCoinBase) return false;
	const outs: VOut[] = tx.vout;
	const ecdh = new ECDH();

	let signalTx: any = null;
	outs.forEach((out: VOut) => {
		if (signalTx) return;
		// only check P2PKH
		// TODO: segwit
		if (out.scriptPubKey.type !== "pubkeyhash") return false;
		const outputAddress = out.scriptPubKey.addresses[0];

		signalTx = tx.vin.find((input: VIn) => {
			const chunks = input.scriptSig.asm.split(/\s/);
			const inputPubkey = chunks[1];
			const shared = ecdh.getSharedPubkey(Buffer.from(inputPubkey, "hex"), Buffer.from(merchantPrivkey, "hex"));
			const derived = KeyService.deriveSignalAddress(merchantPubkey, shared);
			return derived === outputAddress;
		});
	});

	if (!signalTx) return false;
	return signalTx
}

asyncFunc();