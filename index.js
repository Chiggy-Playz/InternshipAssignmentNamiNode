const express = require('express');
const expressWs = require('express-ws');
const app = express();
const port = 3000;

expressWs(app);

var websockets = [];

app.get('/', (req, res) => {

  // Extract the query parameter from the request "message" 
  var message = req.query.message;

  if (message == null) {
    var message = "Default message";
  }

  res.send(`Hello World! Sending "${message}" to all connected clients.`);

  // send a message to all connected clients
  websockets.forEach((ws) => {
    ws.send(`{"title": "Broadcast", "body": "${message}"}`);
  });

});

app.ws('/', (ws, req) => {
  console.log('Client connected');
  websockets.push(ws);

  ws.on('message', (msg) => {
    console.log(`Received message: ${msg}`);
    // wait 10 seconds
    setTimeout(() => {
      console.log('Sending message back');
      // send a json with title and body containing the message
      ws.send(`{"title": "Echo", "body": "${msg}"}`);
    }, 10000);
  });
});

app.listen(port, () => {
  console.log(`Echo WebSocket server running on port ${port}`);
});