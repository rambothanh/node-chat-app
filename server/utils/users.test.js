const expect = require('expect');
const {Users} = require('./users');

describe('Users',() => {
	var users = new Users();
	beforeEach(() => {
		
		users.users = [{
			id: '1',
			name: 'Khanh',
			room: 'Room1'
		},{
			id: '2',
			name: 'Tien',
			room: 'room 2'
		},{
			id: '3',
			name: 'Tam',
			room: 'Room1'
		}];
	});

	it('should add new user', () => {
		var users = new Users();
		var user = {
			id: '123',
			name: 'Thanh',
			room: 'The office Fans'
		};

		var resUser = users.addUser(user.id, user.name, user.room);

		expect(users.users).toEqual([user]);

	});

	it('should remove a user',()=> {
		var userId = '1';
		var user = users.removeUser(userId);
		expect(user.id).toBe(userId);
		expect(users.users.length).toBe(2);

	});

	it('should not remove user',()=> {
		var userId = '79';
		var user = users.removeUser(userId);
		expect(user).toBeFalsy();
		expect(users.users.length).toBe(3); 
	});

	it('should find a user',()=> {
		var userId = '2';
		var user = users.getUser(userId);

		expect(user.id).toBe(userId);

	});

	it('should not find user',()=> {
		var userId = '79';
		var user = users.getUser(userId);
		expect(user).toBeFalsy();
	});


	it('should return names for Room1',()=> {
		var userList = users.getUserList('Room1');
		expect(userList).toEqual(['Khanh','Tam']);
	});

	it('should return names for room 2',()=> {
		var userList = users.getUserList('room 2');
		expect(userList).toEqual(['Tien']);
	})


});