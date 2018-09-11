import { InsightAPI } from "./insightAPI";
import { KeyService } from "./keyService";
import { Tx, VIn, VOut } from "./interface/entity/insight/txByBlockhash";
import { ECDH } from "./ecdh";
import * as bs58 from "bs58";

export class BlockScanner {
	constructor(private api: InsightAPI, private merchantPubkey: string, private merchantPrivkey: string) { }


	public async findSignalByBlockHash(blockhash: string): Promise<Tx | undefined> {
		const response = await this.api.getTxsByBlockHash(blockhash);

		const signalTx = response.txs.find((tx: Tx) => {
			const signalTx = this.checkSignalInTx(tx, this.merchantPubkey, this.merchantPrivkey);
			return signalTx !== false;
		});
		return signalTx;
	}

	private checkSignalInTx(tx: Tx, merchantPubkey: string, merchantPrivkey: string): Tx | boolean {
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

	public getIPFSContentAddress(tx: Tx): string {
		let address = "";
		tx.vout.forEach(out => {
			const chuncks = out.scriptPubKey.asm.split(/\s/);
			if (chuncks[0] === "OP_RETURN") {
				const hex = chuncks[1];
				address = bs58.encode(Buffer.from(hex, "hex"));
			}
		});
		return address;
	}
}
