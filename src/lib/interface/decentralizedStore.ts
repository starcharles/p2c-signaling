export interface DecentralizedStore {
	add(name: string, data: Buffer, cb: Function): any;
	get(id: string, outputFilename: string): any;

}
