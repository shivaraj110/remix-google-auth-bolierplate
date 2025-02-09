import express from 'express'
import { WebSocketServer, WebSocket } from 'ws'
interface Room { clients: Set<WebSocket>; userCount: number; }
const rooms = new Map<string, Room>();
const app = express()
const httpServer = app.listen(8080)
const wss = new WebSocketServer({ server: httpServer }); function joinRoom(ws: WebSocket, roomId: string) {
	if (!rooms.has(roomId)) {
		rooms.set(roomId, {
			clients: new Set(),
			userCount: 0
		});
	}

	const room = rooms.get(roomId)!;
	room.clients.add(ws);
	room.userCount++;

	console.log(`User joined room ${roomId}. Total: ${room.userCount}`);
	broadcastSystemMessage(roomId, `New user joined! That counts total ${room.userCount} users`);
}

function leaveRoom(ws: WebSocket, roomId: string) {
	const room = rooms.get(roomId);
	if (!room) return;

	room.clients.delete(ws);
	room.userCount--;

	console.log(`User left room ${roomId}. Remaining: ${room.userCount}`);
	broadcastSystemMessage(roomId, `User left. ${room.userCount} users remaining`);

	if (room.userCount === 0) {
		rooms.delete(roomId);
	}
}

function broadcastToRoom(roomId: string, message: string) {
	const room = rooms.get(roomId);
	if (!room) return;

	room.clients.forEach(client => {
		if (client.readyState === WebSocket.OPEN) {
			client.send(JSON.stringify({
				type: 'message',
				content: message,
				timestamp: new Date().toISOString()
			}));
		}
	});
}

function broadcastSystemMessage(roomId: string, message: string) {
	const room = rooms.get(roomId);
	if (!room) return;

	room.clients.forEach(client => {
		if (client.readyState === WebSocket.OPEN) {
			client.send(JSON.stringify({
				type: 'system',
				content: message,
				timestamp: new Date().toISOString()
			}));
		}
	});
}

wss.on('connection', (ws: WebSocket) => {
	// Store the client's current room
	let currentRoom: string | null = null;

	ws.on('message', (data: Buffer) => {
		const message = JSON.parse(data.toString());

		if (message.type === 'join') {
			// Leave previous room if exists
			if (currentRoom) {
				leaveRoom(ws, currentRoom);
			}

			// Join new room
			joinRoom(ws, message.room);
			currentRoom = message.room;
		}

		if (message.type === 'message' && currentRoom) {
			broadcastToRoom(currentRoom, message.content);
		}
	});

	ws.on('close', () => {
		if (currentRoom) {
			leaveRoom(ws, currentRoom);
		}
	});
});
