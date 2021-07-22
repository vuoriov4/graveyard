import { resolve } from '@/State.js'
import { NETWORK_DELAY } from '@/Constants.js'

let sessionId = null;
let sessionSocket = null;
let queueSocket = null;
let sessionService = "ws://localhost:8080/session";
let queueService = "ws://localhost:8080/queue";
let payload = { sessionId: null };
let interval = null;

export const setPayload = (pl) => {  payload = pl; payload.sessionId = sessionId; }

export const connect = (sessionId) => {
	return new Promise((_resolve, reject) => {
		sessionSocket = new WebSocket(sessionService);
		sessionSocket.onopen = _resolve
	});
}

export const queue = () => {
	return new Promise((resolve, reject) => {
		queueSocket = new WebSocket(queueService);
		queueSocket.onopen = () => {
			queueSocket.onmessage = (event) => {
				sessionId = event.data;
				return resolve();
			}
			queueSocket.send("sessionId");
		}
	});
}

export const startSession = () => {
	let t0;
	sessionSocket.onmessage = (event) => {
		let t1 = Date.now();
		let dt = t1- t0;
		if (event.data == "Bad Request") console.warn("Bad Request.");
		else {
			const serverState = JSON.parse(event.data);
			resolve(serverState, (t1 - t0) / 1000.0);
		}
	};
	interval = setInterval(() => {
		t0 = Date.now();
		sessionSocket.send(JSON.stringify(payload));
		payload = { sessionId };
	}, NETWORK_DELAY);
}

export const stopSession = () => {
	clearInterval(interval);
}
