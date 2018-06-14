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
	//jQuery('html') : tạo phần tử html
	//jQuery('<li></li>') : tạo phần tử <li></li>
	var li = jQuery('<li></li>');
    li.text(`${message.from}: ${message.text}`);
    // .append(): Thành phần được chèn thêm nội dung, 
    // nội dung này thường được sắp xếp ở vị trí sau cùng.
    jQuery('#messages').append(li);
});


socket.on('newLocationMessage', function(message) {
	var li = jQuery('<li></li>');
	var a = jQuery('<a target="_blank">My current location</a>');

	li.text(`${message.from}: `);
	a.attr('href',message.url);
	li.append(a);
	jQuery('#messages').append(li);
});


jQuery('#message-form').on('submit', function(e) {
    //preventDefault() ngăn cản brower thực hiện
    //hành động mặc định
    e.preventDefault();
    //.val(): Lấy giá trị hiện tại của thành phần, hoặc thay đổi giá trị cho thành phần.
    // .val() sẽ lấy giá trị đầu tiên nếu thành phần chọn là một danh sách.
    // Lưu ý: [name=message] tất cả đề nằm trong ngoặc nháy
    socket.emit('createMessage', {
    	from: 'User',
    	text: jQuery('[name=message]').val()
    }, function() {

    });
});

//select button có id = send-location cho vào biến locationButton
var locationButton = jQuery('#send-location');

//Bắt sự kiện click vào button
locationButton.on('click', function() {
	//Nếu không có navigator.geolocation (trình duyệt không hỗ trợ)
	//hình như brower có support html 5 mới được
	if (!navigator.geolocation) {
		return alert('Geolocation not support by your brower')
	};

	//Lấy tọa độ của user click vào button
	navigator.geolocation.getCurrentPosition(function(location) {
		//Gửi Position của user đến server
		socket.emit('createLocationMessage', {
			latitude: location.coords.latitude,
			longitude: location.coords.longitude
		});
	}, function(err) {
		alert('Unable to fetch location.');
	})

});