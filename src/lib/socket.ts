import { io, Socket } from 'socket.io-client';
import { environment } from './environment';

class SocketSingleton {
	private static instance: SocketSingleton;
	public socket: Socket;

	private constructor() {
		this.socket = io(environment.BACKEND_URL);
	}

	public static getInstance(): SocketSingleton {
		if (!SocketSingleton.instance) {
			SocketSingleton.instance = new SocketSingleton();
		}

		return SocketSingleton.instance;
	}
}

export const socketInstance = SocketSingleton.getInstance();
