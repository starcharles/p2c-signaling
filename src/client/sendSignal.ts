import { networks, ECPair } from "bitcoinjs-lib";
import * as dotenv from "dotenv";
import * as crypto from "crypto";
import * as assert from "assert";
import * as ecurve from "ecurve";
import * as BigInteger from "bigi";
import { KeyService } from "../lib/keyService";
import { ECDH } from "../lib/ecdh";
import { InsightAPI } from "../lib/insightAPI";
import { TxBuilder } from "../lib/txBuilder";
import { UTXO } from "../lib/interface/entity/utxo";
import { customerKey, merchantKey } from "../lib/sample/keys";

// load .env file at Directory root.
dotenv.config()

const network = networks.testnet;
const merchantPubkey = merchantKey.derive.pubkey;

const keyService = new KeyService({
	xpub: customerKey.deriveKeys[0].xpub as string,
	xprv: customerKey.deriveKeys[0].xprv as string
}, {
		network: networks.testnet
	});

const customerPubkey = keyService.derivePubkeyByChildPath("0/0");
const customerPrivOnce = keyService.derivePrivkeyByChildPath("0/0");

/*
 *  step.1 calculate ECDH shared secret key
 * 
 *
 */

// Customer
const ecdh = crypto.createECDH("secp256k1");
ecdh.setPrivateKey(customerPrivOnce);
assert.equal(customerPubkey.toString("hex"), ecdh.getPublicKey("hex", "compressed"));

const secretKey = ecdh.computeSecret(Buffer.from(merchantPubkey, "hex"));

const ecparams = ecurve.getCurveByName("secp256k1");
const curvePt = ecparams.G.multiply(BigInteger.fromBuffer(secretKey));
const sharePubkey = curvePt.getEncoded(true); // get compressed pubkey

const ecdhcalc = new ECDH();
const sharedPubkey = ecdhcalc.getSharedPubkey(Buffer.from(merchantPubkey, "hex"), customerPrivOnce);

console.log(sharedPubkey);
assert.equal(sharePubkey.toString("hex"), sharedPubkey);

const signalingAddress = KeyService.deriveSignalAddress(merchantPubkey, sharedPubkey);
console.log(`signaling address: ${signalingAddress}`);

/*
 * step.2 build signaling transaction
 * 1. get UTXO data for customer pubkey to be used.
 * 2. build transaction to send to signalingAddress.
 * 
 */

const apiUrl = `http://${process.env.API_URL}/${process.env.INSIGHT_API_BASE}`;
const api = new InsightAPI(apiUrl);

const fromCustomerAddress = KeyService.getAddressFromPubkey(customerPubkey);
console.log(`from customer address: ${fromCustomerAddress}`);

(async () => {
	// check balance
	const balance = await api.getBalance(fromCustomerAddress).catch(err => {
		console.log(err.message);
	});
	if (balance === 0) {
		const unconfirmed = await api.getUnconfirmedBalance(fromCustomerAddress);
		if (unconfirmed > 0) {
			throw new Error(`balance(${unconfirmed}) is not confirmed yet. Address: ${fromCustomerAddress}`);
		}
		throw new Error("balance is 0 for address: " + fromCustomerAddress);
	}
	const utxos = await api.getUTXO(fromCustomerAddress).catch(err => {
	});
	const parsed: UTXO[] = JSON.parse(utxos)

	// Building transaction
	// 1. sendAmount
	// 2. set input : select UTXOs to use
	// 3. set outputs : to sharedPubkey, to customer change address

	const sendAmount = 1000;
	const keypair: ECPair = keyService.getKeypair("0/0");
	// const keypair = ECPair.fromWIF("cVVGgzVgcc5S3owCskoneK8R1BNGkBveiEcGDaxu8RRDvFcaQaSG", network);

	const data = "QmSTT8fDPBsNfhPew3WddWSFKH7iwRTS74bMv6aviz6rwG"; // shop-contract.json


	const txBuilder = new TxBuilder(network)
	const rawTx = txBuilder.buildTx(parsed, sendAmount, fromCustomerAddress, signalingAddress, data)
		.signTxWithSingleKey(keypair)
		.toRawTx();

	const result = await api.broadcastTx(rawTx);
	console.log(result);
})();