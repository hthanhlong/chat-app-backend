import ws from 'ws';
import WsService from './services/WsService';

const wss = new ws.WebSocketServer({
  port: 8081,
});

// function notifyAboutOnlinePeople() {
//   [...wss.clients].forEach((client) => {
//     client.send(
//       JSON.stringify({
//         online: [...wss.clients].map((c) => ({
//           userId: c.userId,
//           username: c.username,
//         })),
//       }),
//     );
//   });
// }

wss.on('connection', (connection) => {
  connection.on('message', (message: any) => {
    const isMessage = message.toString();
    if (isMessage) {
      const { type, data } = JSON.parse(message.toString());
      if (type === 'auth') {
        WsService.authenticate(connection, data);
      }
    } else {
      connection.close();
    }
  });

  connection.on('close', () => {
    console.log('client disconnected');
  });

  //   connection.isAlive = true;

  //   connection.timer = setInterval(() => {
  //     connection.ping();
  //     connection.deathTimer = setTimeout(() => {
  //       connection.isAlive = false;
  //       clearInterval(connection.timer);
  //       connection.terminate();
  //       notifyAboutOnlinePeople();
  //       console.log('dead');
  //     }, 1000);
  //   }, 5000);

  //   connection.on('pong', () => {
  //     clearTimeout(connection.deathTimer);
  //   });

  //   connection.on('message', async (message) => {
  //     const messageData = JSON.parse(message.toString());
  //     const { recipient, text, file } = messageData;
  //     let filename = null;
  //     if (file) {
  //       console.log('size', file.data.length);
  //       const parts = file.name.split('.');
  //       const ext = parts[parts.length - 1];
  //       filename = Date.now() + '.' + ext;
  //       const path = __dirname + '/uploads/' + filename;
  //       const bufferData = new Buffer(file.data.split(',')[1], 'base64');
  //       fs.writeFile(path, bufferData, () => {
  //         console.log('file saved:' + path);
  //       });
  //     }
  //     if (recipient && (text || file)) {
  //       const messageDoc = await Message.create({
  //         sender: connection.userId,
  //         recipient,
  //         text,
  //         file: file ? filename : null,
  //       });
  //       [...wss.clients]
  //         .filter((c) => c.userId === recipient)
  //         .forEach((c) =>
  //           c.send(
  //             JSON.stringify({
  //               text,
  //               sender: connection.userId,
  //               recipient,
  //               file: file ? filename : null,
  //               _id: messageDoc._id,
  //             }),
  //           ),
  //         );
  //     }
  //   });

  //   // notify everyone about online people (when someone connects)
  //   notifyAboutOnlinePeople();
});
