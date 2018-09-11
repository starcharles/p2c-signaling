import { KeyService } from "../src/lib/keyService";
import { merchantKey, customerKey } from "./fixture/keys";
import { ECPair, HDNode, networks, Network, crypto as bcrypto } from "bitcoinjs-lib";
import * as fs from "fs";
import * as crypto from "crypto";
import * as assert from "assert";


const xKeys = {
	xpub: merchantKey.xpub,
	xprv: merchantKey.xprv
}

const path = "./test/fixture/";
const filename = "shop-contract.json"
const ks = new KeyService(xKeys, { network: networks.testnet });
const buffer = fs.readFileSync(`${path}${filename}`);
const str = JSON.stringify(buffer.toString());

const contractHash = bcrypto.sha256(Buffer.from(str, "utf8"));
const address = ks.deriveP2CAddress(contractHash.toString("hex"));