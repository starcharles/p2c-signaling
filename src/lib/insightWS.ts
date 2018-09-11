import { WebsocketInterface } from "./interface/websocketInterface"
import * as io from "socket.io-client";


export class InsightWS implements WebsocketInterface {
	private socket: SocketIOClient.Socket;

	constructor(wsURL: string) {
		this.socket = io(wsURL);
		this.onConnect("inv");
	}

	subscribBlocks(cb: Function): void {
		const callback = (blockhash: string) => {
			console.log(`New block received:  ${blockhash}`)
			cb(blockhash);
		}
		this._setEventListener("block", callback);
	}

	onConnect(room: string): void {
		this.socket.on('connect', () => {
			console.log("connected");
			// Join the room.
			this.socket.emit('subscribe', room);
		})
	}

	private _setEventListener(eventToListenTo: string, callback: Function) {
		this.socket.on(eventToListenTo, callback);
	}
}