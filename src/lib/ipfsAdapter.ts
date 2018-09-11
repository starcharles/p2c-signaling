import * as IPFS from "ipfs";
import * as fs from "fs";
import { DecentralizedStore } from "../lib/interface/decentralizedStore"

export class IPFSAdapter implements DecentralizedStore {
	private node: any;

	constructor() {
		this.node = new IPFS({ start: false, init: true });
	}

	public async connect(): Promise<any> {
		await this.node.start();
	}

	public close(): void {
		this.node.stop();
	}

	public async add(name: string, data: Buffer): Promise<string> {
		const filesAdded = await this.node.files.add({
			path: name,
			content: data
		})

		console.log('Added file:', filesAdded[0].path, filesAdded[0].hash)
		return filesAdded[0].hash;
	}

	public async get(contentAddress: string, outputFilename: string): Promise<void> {
		const fileBuffer = await this.node.files.cat(contentAddress);
		console.log('Added file contents:', fileBuffer)
		fs.writeFileSync(outputFilename, fileBuffer);
	}
}