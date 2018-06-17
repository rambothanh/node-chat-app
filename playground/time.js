// Jan 1st 1970 00:00:00 am
var moment = require('moment');

var date = moment(60000);

console.log(date.format('MMM Do, YYYY h:mm a'));