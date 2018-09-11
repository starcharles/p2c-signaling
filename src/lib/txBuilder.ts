import { UTXO } from "./interface/entity/utxo";
import { Network, TransactionBuilder, script as bscript, address as baddress, ECPair } from "bitcoinjs-lib";
import * as bs58 from "bs58";

export class TxBuilder {
	private tx: TransactionBuilder;

	constructor(private network: Network) {
		this.tx = new TransactionBuilder(network);
	}

	public buildTx(utxos: UTXO[], amount: number, from: string, to: string, ipfsHash: string): TxBuilder {
		this.tx.setVersion(1);
		// 1. sendAmount
		// 2. set input : select UTXOs to use
		// 3. set outputs : to sharedPubkey, to customer change address

		const selectedUTXOs = this.selectUTXO(utxos);
		this.setInputs(selectedUTXOs);

		const totalBalance = this.getTotalBalance(selectedUTXOs);

		// TODO: set fee
		const fee = 1400;
		// change はcustomerのfromと同じpubkeyに送る
		this.setOutputs(totalBalance, to, from, amount, fee, ipfsHash);
		return this;
	}

	public signTxWithSingleKey(keypair: ECPair): TxBuilder {
		const numOfInputs = this.tx.inputs.length;
		for (let i = 0; i < numOfInputs; i++) {
			this.tx.sign(i, keypair)
		}
		return this;
	}

	public toRawTx(): string {
		return this.tx.build().toHex();
	}

	private getTotalBalance(utxos: UTXO[]): number {
		let sum = 0;
		utxos.forEach((utxo: UTXO) => {
			sum += utxo.satoshis;
		});
		return sum;
	}

	private selectUTXO(utxos: UTXO[]): UTXO[] {
		return utxos;
	}

	private setInputs(utxos: UTXO[]): void {
		// TODO: sequence
		// const sequence = 0xFFFFFFFF;
		const sequence = 4294967295;
		for (let utxo of utxos) {
			this.tx.addInput(utxo.txid, utxo.vout);
		}
	}

	private setOutputs(totalBalance: number, toAddress: string, changeAddress: string, amount: number, fee: number, message: string) {
		const opretAmount: number = Number(process.env.AMOUNT_OPRETURN) ? Number(process.env.AMOUNT_OPRETURN) : 1000;
		// TODO: for target p2c derived Address
		// this.tx.addOutput(baddress.toOutputScript(toAddress, this.network), amount);

		// to target signaling address
		this.tx.addOutput(baddress.toOutputScript(toAddress, this.network), amount);
		// to change address
		const change = totalBalance - amount - opretAmount - fee;
		this.tx.addOutput(baddress.toOutputScript(changeAddress, this.network), change);

		// OP_RETURN with message ipfs hash
		this.addOutputMessage(message, opretAmount);
	}

	private addOutputMessage(message: string, amount: number) {
		if (!this.isBase58(message)) {
			throw new Error("message is not base58 encoded: " + message);
		}

		// message shoud be base58 encoded IPFS location identifier.
		const decodedHex = bs58.decode(message).toString("hex");

		const asm = `OP_RETURN ${decodedHex}`;
		this.tx.addOutput(bscript.fromASM(asm), amount);
	}

	private isBase58(msg: string): boolean {
		return true;

	}

}