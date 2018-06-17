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
	var formattedTime = moment(message.createAt).format('h:mm a');
	var template = jQuery('#message-template').html();
	var html = Mustache.render(template, {
		text: message.text,
		from: message.from,
		createAt: formattedTime
	});
	jQuery('#messages').append(html);
	
});


socket.on('newLocationMessage', function(message) {
	var formattedTime = moment(message.createAt).format('h:mm a');
	var template = jQuery('#location-message-template').html();
	var html = Mustache.render(template, {
		url: message.url,
		from: message.from,
		createAt: formattedTime
	});
	jQuery('#messages').append(html);
	// var li = jQuery('<li></li>');
	// var a = jQuery('<a target="_blank">My current location</a>');
	// var formattedTime = moment(message.createAt).format('h:mm a');
	// li.text(`${message.from} ${formattedTime}: `);
	// a.attr('href',message.url);
	// li.append(a);
	// jQuery('#messages').append(li);
});


jQuery('#message-form').on('submit', function(e) {
    //preventDefault() ngăn cản brower thực hiện
    //hành động mặc định
    e.preventDefault();

    var messageTextbox = jQuery('[name=message]');
    //.val(): Lấy giá trị hiện tại của thành phần, hoặc thay đổi giá trị cho thành phần.
    // .val() sẽ lấy giá trị đầu tiên nếu thành phần chọn là một danh sách.
    // Lưu ý: [name=message] tất cả đề nằm trong ngoặc nháy
    socket.emit('createMessage', {
    	from: 'User',
    	text: messageTextbox.val()
    }, function() {
    	//Khi gửi textbox đến server xong thì cho ô textbox rỗng
    	messageTextbox.val('');
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

	//Khi nút gửi location được click thì nó cần 3-4 giây mới gửi được
	//location, vậy nên trong thời gian 3-4 giây đó, vô hiệu hóa nút 
	//đó luôn để tránh spam, và cũng thay đổi text của button đó 
	locationButton.attr('disabled', 'disabled').text('Sending location...');

	//Lấy tọa độ của user click vào button
	navigator.geolocation.getCurrentPosition(function(location) {

		//Khi lấy tọa độ thành công thì enable nút gửi location lại
		//và trả về text ban đầu của button
		locationButton.removeAttr('disabled').text('Send Location');
		//Gửi Position của user đến server
		socket.emit('createLocationMessage', {
			latitude: location.coords.latitude,
			longitude: location.coords.longitude
		});
	}, function(err) {
		//khi nút gửi không thành công thì cũng enable nút gửi location lại
		//và trả về text ban đầu của button
		locationButton.removeAttr('disabled').text('Send Location');
		alert('Unable to fetch location.');
	})

});