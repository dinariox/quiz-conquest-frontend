import { io, Socket } from 'socket.io-client';

class SocketSingleton {
	private static instance: SocketSingleton;
	public socket: Socket;

	private constructor() {
		this.socket = io('https://vollsm.art/');
	}

	public static getInstance(): SocketSingleton {
		if (!SocketSingleton.instance) {
			SocketSingleton.instance = new SocketSingleton();
		}

		return SocketSingleton.instance;
	}
}

export const socketInstance = SocketSingleton.getInstance();
