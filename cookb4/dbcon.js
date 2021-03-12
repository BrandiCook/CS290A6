var mysql = require('mysql');
var pool = mysql.createPool({
  connectionLimit : 10,
  host            : 'classmysql.engr.oregonstate.edu',
  user            : 'cs290_cookb4',
  password        : '9286',
  database        : 'cs290_cookb4',
  dateStrings 	  : true
});

module.exports.pool = pool;