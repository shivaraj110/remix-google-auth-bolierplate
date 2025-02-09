import { useEffect, useRef, useState } from 'react';

interface Message {
  type: 'message' | 'system';
  content: string;
  timestamp: string;
  sender?: string;
}

export default function ChatRoom() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [messageInput, setMessageInput] = useState('');
  const [roomInput, setRoomInput] = useState('');
  const [currentRoom, setCurrentRoom] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const ws = useRef<WebSocket | null>(null);

  useEffect(() => {
    // Connect to WebSocket server
    ws.current = new WebSocket('ws://localhost:8080');

    ws.current.onopen = () => {
      setIsConnected(true);
      const room = prompt('Enter room name:') || 'general';
      joinRoom(room);
    };

    ws.current.onmessage = (event) => {
      const message: Message = JSON.parse(event.data);
      setMessages((prev) => [...prev, message]);
    };

    ws.current.onclose = () => {
      setIsConnected(false);
    };

    return () => {
      ws.current?.close();
    };
  }, []);

  const joinRoom = (room: string) => {
    if (!ws.current) return;

    setCurrentRoom(room);
    ws.current.send(JSON.stringify({
      type: 'join',
      room: room
    }));
  };

  const sendMessage = () => {
    if (!messageInput.trim() || !ws.current) return;

    ws.current.send(JSON.stringify({
      type: 'message',
      content: messageInput
    }));

    setMessageInput('');
  };

  const handleRoomChange = () => {
    if (!roomInput.trim()) return;
    joinRoom(roomInput);
    setRoomInput('');
  };
  if (!ws.current) {
    return <div>
      <div className="flex h-screen items-center justify-center">
        <div className="flex-col text-center">
          <div>
            {'Welcome to the Chat!'}
          </div>
          <div className="animate-pulse">
            {'Connecting to Websocket...'}
          </div>
        </div>
      </div>
    </div>
  }
  return (
    <div className="max-w-md mx-auto p-4 bg-white rounded-lg shadow-lg">
      <div className="mb-4">
        <div className="flex items-center gap-2 mb-2">
          <input
            type="text"
            value={roomInput}
            onChange={(e) => setRoomInput(e.target.value)}
            placeholder="Enter room name"
            className="flex-1 p-2 border rounded"
          />
          <button
            onClick={handleRoomChange}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Change Room
          </button>
        </div>
        <div className="text-sm mb-2">
          Current Room: {currentRoom} | Status: {isConnected ? 'Connected' : 'Disconnected'}
        </div>
      </div>

      <div className="h-64 overflow-y-auto mb-4 border rounded p-2 bg-gray-50">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`mb-2 p-2 rounded ${message.type === 'system'
              ? 'bg-yellow-100 text-yellow-800'
              : 'bg-blue-100 text-blue-800'
              }`}
          >
            {message.type === 'system' && '⚠️ '}
            {message.content}
            <div className="text-xs text-gray-500 mt-1">
              {new Date(message.timestamp).toLocaleTimeString()}
            </div>
          </div>
        ))}
      </div>

      <div className="flex gap-2">
        <input
          type="text"
          value={messageInput}
          onChange={(e) => setMessageInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
          placeholder="Type your message..."
          className="flex-1 p-2 border rounded"
        />
        <button
          onClick={sendMessage}
          disabled={!isConnected}
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:bg-gray-400"
        >
          Send
        </button>
      </div>
    </div>
  );
}
