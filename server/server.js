const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');
const {generateMessage,generateLocationMessage} = require('./utils/message');
const {isRealString} = require('./utils/validation');
const {Users} = require('./utils/users');
const publicPath = path.join(__dirname , '../public')

const port = process.env.PORT || 3000;

var app = express();

//Tạo máy chủ bằng cách sử dụng http
var server = http.createServer(app);

var io = socketIO(server);

var users = new Users();

app.use(express.static(publicPath));

//Mọi event của client cần được xử lý để bên trong 'connection'
 io.on('connection', (socket) => {
 	//Thông báo trên server kho có client mới conected
 	console.log('New user connected');
 	
 	
 	socket.on('join',(params, callback) => {
 		if(!isRealString(params.name) || !isRealString(params.room)) {
 			return callback('Name and room name are required.');
 		};
          //Tạo room trong socket
 		socket.join(params.room);
          //Xóa user có id này nếu còn có trong mảng trước đó có thể nằm trong room khác
          users.removeUser(socket.id) ;    
          //Thêm user này vào mảng đang có
          users.addUser(socket.id, params.name, params.room);

          io.to(params.room).emit('updateUserList', users.getUserList(params.room));

 		//Gửi thông báo chào mừng đến user vừa kết nối
	 	socket.emit('newMessage', generateMessage('Admin', 'Welcom to the chat app'));
	 	//Gửi thông báo đến tất cả các user đã kết nối trước đó (trừ user vừa kết nối)
	 	socket.broadcast.to(params.room).emit('newMessage', generateMessage('Admin',`${params.name} joined`));

 		callback();
 	});

 	//Listen các user tạo và gửi message
 	socket.on('createMessage', (message, callback) => {
 		//Lấy id của client vừa gửi message, và tìm user có id đó
          var user = users.getUser(socket.id);         

          //Nếu user tồn tại và message gửi đi khác rỗng
          if (user && isRealString(message.text)) {
               //Gửi message nhận được đến tất cả các connected client 
               io.to(user.room).emit('newMessage', generateMessage(user.name, message.text));  
          } ;

     	
     	//gửi đối số thứ 3 (function) đến user vừa tạo message
     	callback();
     
     });

 	//Gửi tọa độ của User vửa gửi createLocationMessage đến tất cả connected client
 	socket.on('createLocationMessage',(coords) => {
          //Lấy id của client vừa gửi message, và tìm user có id đó
          var user = users.getUser(socket.id);
          if(user) {
              io.to(user.room).emit('newLocationMessage', generateLocationMessage(user.name, coords.latitude, coords.longitude)) 
          }
 		
 	});

 	//Khi có client close browser (disconected)
 	socket.on('disconnect', () => {
          //Xóa user đó ra khỏi mảng
 		var user = users.removeUser(socket.id);
          //Update lại danh sách cho các user khác có trong phòng 
          io.to(user.room).emit('updateUserList', users.getUserList(user.room))
          //Gửi thông báo đến các users có trong room 
          io.to(user.room).emit('newMessage',generateMessage('Admin', `${user.name} has left`));
 	}); 
 });



server.listen(port, () => {
	console.log(`App starting at port ${port}`);
});