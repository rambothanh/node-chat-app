const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');
const {generateMessage,generateLocationMessage} = require('./utils/message');

const publicPath = path.join(__dirname , '../public')

const port = process.env.PORT || 3000;

var app = express();

//Tạo máy chủ bằng cách sử dụng http
var server = http.createServer(app);

var io = socketIO(server);

app.use(express.static(publicPath));

//Mọi event của client cần được xử lý để bên trong 'connection'
 io.on('connection', (socket) => {
 	//Thông báo trên server kho có client mới conected
 	console.log('New user connected');
 	//Gửi thông báo chào mừng đến user vừa kết nối
 	socket.emit('newMessage', generateMessage('Admin', 'Welcom to the chat app'));
 	//Gửi thông báo đến tất cả các user đã kết nối trước đó (trừ user vừa kết nối)
 	socket.broadcast.emit('newMessage', generateMessage('Admin','New user joined'));
 	
 	//Listen các user tạo và gửi message
 	socket.on('createMessage', (message, callback) => {
 		//Thông báo có message được gửi từ client trên server
     	console.log('createMessage', message);
     	
     	//Gửi message nhận được đến tất cả các connected client 
     	io.emit('newMessage', generateMessage(message.from, message.text));
     	//gửi đối số thứ 3 (function) đến user vừa tạo message
     	callback();
     
     });

 	//Gửi tọa độ của User vửa gửi createLocationMessage đến tất cả connected client
 	socket.on('createLocationMessage',(coords) => {
 		io.emit('newLocationMessage', generateLocationMessage('Admin', coords.latitude, coords.longitude))
 	});

 	//Nhận thông báo khi có client close browser (disconected)
 	socket.on('disconnect', () => {
 		console.log('User was disconnected');
 	}); 
 });



server.listen(port, () => {
	console.log(`App starting at port ${port}`);
});