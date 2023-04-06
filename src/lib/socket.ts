import { io, Socket } from 'socket.io-client';
import { PUBLIC_BACKEND_URL } from '$env/static/public';

class SocketSingleton {
	private static instance: SocketSingleton;
	public socket: Socket;

	private constructor() {
		this.socket = io(PUBLIC_BACKEND_URL);
	}

	public static getInstance(): SocketSingleton {
		if (!SocketSingleton.instance) {
			SocketSingleton.instance = new SocketSingleton();
		}

		return SocketSingleton.instance;
	}
}

export const socketInstance = SocketSingleton.getInstance();
