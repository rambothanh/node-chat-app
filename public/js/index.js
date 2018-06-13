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
	var li = jQuery('<li></li>');
    li.text(`${message.from}: ${message.text}`);
    // .append(): Thành phần được chèn thêm nội dung, 
    // nội dung này thường được sắp xếp ở vị trí sau cùng.
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