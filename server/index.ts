import express from 'express'
import { WebSocketServer,WebSocket} from 'ws'

const app = express()
const httpServer = app.listen(8080)
const wss = new WebSocketServer({ server: httpServer });

let userCount = 0
wss.on('connection', function connection(ws) {
  ws.on('message', function message(data, isBinary) {
      wss.clients.forEach(function each(client) {
            if (client.readyState === WebSocket.OPEN) {
        client.send(data, { binary: isBinary });
      }
    });
  });
console.log("connection count : ", ++userCount)
  ws.send('Hello! Message From Server!!');
});

