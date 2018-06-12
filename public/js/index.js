var socket = io();
//Tạo sự kiện ở máy khách
socket.on('connect', function() {
    console.log('connected to server');

    // socket.emit('createMessage',{
    // 	from: 'TrongThanh',
    // 	text: 'Nguyen Trong Thanh'
    // });
});

socket.on('disconnect', function() {
    console.log('Disconnected from server');
});

socket.on('newMessage', function(message) {
	console.log('newMessage', message);
});

