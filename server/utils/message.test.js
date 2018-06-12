const expect = require('expect');

var {generateMessage} = require('./message');

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