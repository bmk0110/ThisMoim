'use strict';

var app = require('express')();
var server = require('http').createServer(app);
// http server를 socket.io server로 upgrade한다
var io = require('socket.io')(server);

var client_list = [];


// localhost:3000으로 서버에 접속하면 클라이언트로 index.html을 전송한다
app.get('/', function(req, res) {
    res.sendFile(__dirname + '/useTest.html');
});

app.get('/index', function(req, res) {
  res.sendFile(__dirname + '/index.html');
});

app.get('/cam', function(req, res) {
    res.sendFile(__dirname + '/cam.html');
});

// NameSpace 사용. 경로할당
// Server-side
// var nsp = io.of('/space');
// nsp.on('connection', function(socket){
//     console.log('someone connected');
// });
// nsp.emit('hi', 'everyone!');


// connection event handler
// connection이 수립되면 event handler function의 인자로 socket인 들어온다
io.on('connection', function(socket) {

    // socket.on('enter', function(data){

    //   var obj2 = {    
    //     sockect_id : socket.id,
    //     nickname : data.name,
    //     email : data.userid
    //   };

    //   client_list.push(obj2);
    //     for(var i in client_list){
    //       console.log(i+')'+client_list[i].nickname+" ");
    //     }
    //     socket.emit('sendList', client_list);
    // });

    // 접속한 클라이언트의 정보가 수신되면
    socket.on('login', function(data) {
        console.log('Client logged-in:\n name: ' + data.name + '\n userid: ' + data.userid);

        // client_List 부분
        var obj = {    
          sockect_id : socket.id,
          nickname : data.name,
          email : data.userid
        };

        client_list.push(obj);
        for(var i in client_list){
          console.log(i+')'+client_list[i].nickname+" ");
        }

        socket.emit('sendList', client_list);


        // 현재 접속된 유저를 전달, JSON형식으로 보냄 -> userList를 갖고오기 위함
        // socket.emit('userCnt', JSON.stringify(socket.id));
        // socket.emit('userList', )

        // socket에 클라이언트 정보를 저장한다
        socket.name = data.name;
        socket.userid = data.userid;


        // socket.id = data.name;
        data.socketid = socket.id;


        // room 조인
        var room = socket.room = data.name;
        console.log('('+socket.name+')'+ 'room : '+room);
        socket.join(room);
        console.log('socket.id: '+socket.id);
        // 접속된 모든 클라이언트에게 메시지를 전송한다
        // 'data.userid' has joined 가 index.html 에 출력. emit과 on방식 알기
        io.emit('login', data);
    });

    // 클라이언트로부터의 메시지가 수신되면
    socket.on('chat', function(data) {
        console.log('Message from %s, 내용 : %s', socket.name, data.msg);

        var msg = {
            to: {
                name: '',
            },
            from: {
                name: socket.name,
                userid: socket.userid
            },
            msg: data.msg,
            id: '',
        };

        // 메시지를 전송한 클라이언트를 제외한 모든 클라이언트에게 메시지를 전송한다
        // socket.broadcast.emit('chat', msg);

        // 메시지를 전송한 클라이언트에게만 메시지를 전송한다
        // socket.emit('s2c chat', msg);

        // 접속된 모든 클라이언트에게 메시지를 전송한다
        io.emit('s2c chat', msg);

        // 특정 클라이언트에게만 메시지를 전송한다
        // io.to(id).emit('s2c chat', data);
    });


    // 클라이언트로부터의 메시지가 수신되면
    socket.on('chatto', function(data) {
        console.log('to %s from %s', data.id, socket.name);
        // room 조인
        socket.join(data.id);

        console.log('(귓속말) 내용 : %s', data.msg);
        console.log("socketid : "+socket.id);
        console.log("dataid : "+data.id);

        // socket.join(data.id);  // 상대 socket.id에 내 id를 조인시킴으로써 같은 room 입장. 이 경우 조인 경우가 꼬일 수 있음.

        var msg = {
            to:{
                name: data.id,
            },
            from: {
                name: socket.name,
                userid: socket.userid
            },
            msg: data.msg,
            id: data.id,
            myid: socket.id,
            yourname: data.name
        };

        // 메시지를 전송한 클라이언트를 제외한 모든 클라이언트에게 메시지를 전송한다
        // socket.broadcast.emit('chat', msg);

        // 메시지를 전송한 클라이언트에게만 메시지를 전송한다
        // socket.emit('s2c chat', msg);

        // 접속된 모든 클라이언트에게 메시지를 전송한다
        // io.emit('s2c chat', msg);

        // 특정 클라이언트에게만 메시지를 전송한다
        //io.to(data.id).emit('s2c chat', msg);

        // room
        var room = socket.room = data.id;
        console.log('('+socket.name+') room : ' + room);
        socket.join(room);

        io.to(room).emit('s2c chat', msg);
    });

    // force client disconnect from server
    socket.on('forceDisconnect', function() {
        socket.disconnect();
    })



    socket.on('disconnect', function(data) {
        console.log(socket.name + "님이 연결을 끓으셨습니다.");
        var msg = {
            from: {
                name: socket.name,
                userid: socket.userid
            },
            msg: data.msg
        };

        io.emit('out', msg);

        // 연결이 끊긴 client_list 삭제 후 다시 조회
        for(var i in client_list){
          if(client_list[i].sockect_id == socket.id){
            io.emit('deleteUser', client_list[i].nickname);
            console.log('client_list[i] : '+client_list[i].nickname);
          }
        }

//        io.emit('sendList', client_list);
    });

    /////////////////////////////// Cam

    // convenience function to log server messages on the client
  function log() {
    var array = ['Message from server:'];
    array.push.apply(array, arguments);
    socket.emit('log', array);
  }

  socket.on('message', function(message) {
    log('Client said: ', message);
    // for a real app, would be room-only (not broadcast)
    socket.broadcast.emit('message', message);
  });

  socket.on('create or join', function(room) {
    log('Received request to create or join room ' + room);
    console.log('_______________________________________\n'+
    'Received request to create or join room ' + room);


    var clientsInRoom = io.sockets.adapter.rooms[room];
    var numClients = clientsInRoom ? Object.keys(clientsInRoom.sockets).length : 0;
    log('Room ' + room + ' now has ' + numClients + ' client(s)');
    console.log('Room ' + room + ' now has ' + numClients + ' client(s)');

    if (numClients === 0) {
      socket.join(room);

      log('Client ID ' + socket.id + ' created room ' + room);
      console.log('Client ID ' + socket.id + ' created room ' + room);

      socket.emit('created', room, socket.id);
      console.log('첫번째 if문');
    } else if (numClients === 1) {
      log('Client ID ' + socket.id + ' joined room ' + room);
      io.sockets.in(room).emit('join', room);
      socket.join(room);
      socket.emit('joined', room, socket.id);
      io.sockets.in(room).emit('ready');
    } else { // max two clients
      socket.emit('full', room);
    }
  });

  socket.on('ipaddr', function() {
    var ifaces = os.networkInterfaces();
    for (var dev in ifaces) {
      ifaces[dev].forEach(function(details) {
        if (details.family === 'IPv4' && details.address !== '127.0.0.1') {
          socket.emit('ipaddr', details.address);
        }
      });
    }
  });

  socket.on('bye', function(){
    console.log('received bye');
  });





});





server.listen(3030, function() {
    console.log('Socket IO server listening on port 3030');
});

