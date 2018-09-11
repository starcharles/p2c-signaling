export interface APIInterface {
	getTx(address: string): Promise<string>;
	getBalance(address: string): Promise<number>;
	getUTXO(address: string): Promise<string>;
	broadcastTx(tx: any): Promise<Object>;
}
