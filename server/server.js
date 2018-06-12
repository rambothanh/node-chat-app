const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');
const {generateMessage} = require('./utils/message');

const publicPath = path.join(__dirname , '../public')

const port = process.env.PORT || 3000;

var app = express();

//Tạo máy chủ bằng cách sử dụng http
var server = http.createServer(app);

var io = socketIO(server);

app.use(express.static(publicPath));

//Mọi event của client cần được xử lý để bên trong 'connection'
 io.on('connection', (socket) => {
 	console.log('New user connected');
 	//socket.emit from Admin text Welcom to the chat app
 	socket.emit('newMessage', generateMessage('Admin', 'Welcom to the chat app'));
 	//socket.broadcast.emit from admin text New user joined
 	socket.broadcast.emit('newMessage',generateMessage('Admin','New user joined'));
 	


 	//Lắng nghe sự kiện của cleint, đối số thứ 2 là đối tượng
 	//để làm đối số của emit máy khách, là đối số thứ nhất của callback 
 	socket.on('createMessage', (message) => {
     	console.log('createMessage', message);
     	//Gửi tin nhắn đến tất cả client đang kết nối, ngay cả 
     	//client gửi tin nhắn
     	io.emit('newMessage', generateMessage(message.from, message.text));
     	// 
     	// gửi tin nhắn nhận được đến tất cả các connected, trừ người gửi tin nhắn
     	// socket.broadcast.emit('newMessage', {
     	// 	from: message.from,
     	// 	text: message.text,
     	// 	createAt: new Date().getTime()
     	// });

     });

 	socket.on('disconnect', () => {
 		console.log('User was disconnected');
 	}); 
 });


server.listen(port, () => {
	console.log(`App starting at port ${port}`);
});