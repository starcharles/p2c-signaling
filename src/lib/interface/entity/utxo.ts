// UTXO object from insight-api

export interface UTXO {
	address: string,
	txid: string,
	vout: number,
	scriptPubkey: string,
	amount: number,
	satoshis: number,
	height: number,
	confirmations: number
}

// {
// "address": "mnJQyeDFmGjNoxyxKQC6MMFdpx77rYV3Bo",
// 	"txid": "2f834b1f06e92da6e1560ceaa9730a562ffe547d7fecf88b1f386a058777969d",
// 		"vout": 0, "scriptPubKey": "76a9144a69bf18115e0dc490982c1318d9de350a386f0588ac", 
// "amount": 1.1337, "satoshis": 113370000, "height": 115, "confirmations": 316},
// }