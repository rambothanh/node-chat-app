const expect = require('expect');

var {generateMessage,generateLocationMessage} = require('./message');

describe('generateMessage', function() {
	it('should generate the correct message object', function() {
		var from = 'Admin';
		var text = 'Test generate message';
		var message = generateMessage(from, text);
		// expect(message.from).toBe(from);
		// expect(message.text).toBe(text);
		// Một cách khác là so sanh một đối tượng (only object) có bao 
		// gồm các phần tử chính xác như đã cho, dùng toMatchObject:
		expect(message).toMatchObject({from, text});
		expect(typeof message.createAt).toBe('number');
	});
});


describe('generateLocationMessage', () => {
	it('should generate correct location object', () => {
		var from = 'Admin';
		var latitude = 10;
		var longitude = 106;
		var url = 'https://www.google.com/maps?q=10,106';
		var message = generateLocationMessage(from, latitude, longitude);
		expect(message).toMatchObject({from, url});
		expect(typeof message.createAt).toBe('number');
	});
});