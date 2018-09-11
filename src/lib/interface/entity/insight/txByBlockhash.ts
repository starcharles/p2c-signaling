export interface Txs {
	pagesTotal: number,
	txs: Tx[]
}

export interface Tx {
	txid: string,
	version: number,
	locktime: number,
	vin: VIn[],
	vout: VOut[],
	blockhash: string,
	blockheight: number,
	confirmations: number,
	time: number,
	blocktime: number
	isCoinBase: boolean,
	valueOut: number,
	size: 100
}

export interface VIn {
	txid: string,
	vout: number,
	sequence: number,
	n: number,
	scriptSig: {
		hex: string,
		asm: string
	},
	addr: string,
	valueSat: number, // value in satoshis
	value: number,
	doubleSpentTxID: any
}

// {
// 	txid: 'e93b64bd6167717dd2bf96e8d621679bc2f2955299a7bb892ad60c16470557c0',
// 		vout: 1,
// 			sequence: 4294967295,
// 				n: 0,
// 					scriptSig:
// 	{
// 		hex: '483045022100deeb01dfc6ae2c32200b0826e9a78a0cf25f8b6300e18d10bc32d8329779150202206041a3f07b9b736e70e549672ccc39f7ae230a40daf3f19c4102248a7aa95dba0121027536b48266b00bb77379fa1284be60b65a0d88c0997f1fb4d6cfa7eccc5940f7',
// 			asm: '3045022100deeb01dfc6ae2c32200b0826e9a78a0cf25f8b6300e18d10bc32d8329779150202206041a3f07b9b736e70e549672ccc39f7ae230a40daf3f19c4102248a7aa95dba[ALL] 027536b48266b00bb77379fa1284be60b65a0d88c0997f1fb4d6cfa7eccc5940f7'
// 	},
// 	addr: 'mnJQyeDFmGjNoxyxKQC6MMFdpx77rYV3Bo',
// 		valueSat: 13139082600,
// 			value: 131.390826,
// 				doubleSpentTxID: null
// }


export interface VOut {
	value: number,
	spentTxId: any,
	spentIndex: any,
	spentHeight: any
	scriptPubKey: {
		hex: string,
		asm: string,
		type: string,
		addresses: string[]
	}
}
// {
// 	"pagesTotal": 1, "txs": [
// 		{
// 			"txid": "38f1c58076b5246f9016e941749736be0759408e96f0884b967ca518e17db427",
// 			"version": 1, "locktime": 0,
// 			"vin": [{ "coinbase": "025f010101", "sequence": 4294967295, "n": 0 }],
// 			"vout": [{
// 				"value": "12.50000000", "n": 0,
// 				"scriptPubKey": {
// 					"hex": "2102471438a49760b31cedec14d740cf0ea8f1b03620f641196598d267e62658ce7dac", 
// "asm": "02471438a49760b31cedec14d740cf0ea8f1b03620f641196598d267e62658ce7d OP_CHECKSIG", 
//                  "addresses": ["mkyqiXFfocTgvXq3aXaJgmXn5qiK6qoU2J"], "type": "pubkeyhash"
// 				},
// 				"spentTxId": null, "spentIndex": null, "spentHeight": null
// 			}],
// 			"blockhash": "247aeabe127d37928f4e627b07baf7b526a0841d2938fcb3981dd9f6976467eb",
// 			"blockheight": 351, "confirmations": 1,
// 			"time": 1534316299, "blocktime": 1534316299, "isCoinBase": true, "valueOut": 12.5, "size": 100
// 		}]
// }