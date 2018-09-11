import { APIInterface } from "./interface/apiInterface";
import * as request from "request-promise";
import { Txs } from "./interface/insight/txByBlockhash";

export class InsightAPI implements APIInterface {
	constructor(private apiUrl: string) {
	}

	public async getTxsByBlockHash(blockhash: string): Promise<Txs> {
		const txs = await request(`${this.apiUrl}/txs/?block=${blockhash}`, {
			json: true
		});
		return txs
	};

	public async getTx(address: string): Promise<string> {
		return "not implemented"
	};

	public async broadcastTx(rawTx: string): Promise<Object> {
		const result = await request({
			method: "POST",
			uri: `${this.apiUrl}/tx/send`,
			body: {
				rawtx: rawTx
			},
			json: true
		});

		return result;
	};

	public async getBalance(address: string): Promise<number> {
		const balance = await request(`${this.apiUrl}/addr/${address}/balance`);
		return Number(balance);
	}
	public async getUnconfirmedBalance(address: string): Promise<number> {
		const unconfirmedBalance = await request(`${this.apiUrl}/addr/${address}/unconfirmedBalance`);
		return unconfirmedBalance;
	}

	public async getUTXO(address: string): Promise<any> {
		const utxos = await request(`${this.apiUrl}/addr/${address}/utxo`);
		return utxos;
	};
}