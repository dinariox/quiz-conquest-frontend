import { io, Socket } from 'socket.io-client';

class SocketSingleton {
	private static instance: SocketSingleton;
	public socket: Socket;

	private constructor() {
		this.socket = io('http://217.160.37.145:3000/');
	}

	public static getInstance(): SocketSingleton {
		if (!SocketSingleton.instance) {
			SocketSingleton.instance = new SocketSingleton();
		}

		return SocketSingleton.instance;
	}
}

export const socketInstance = SocketSingleton.getInstance();
