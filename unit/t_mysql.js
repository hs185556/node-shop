var mysql      = require('mysql');
var connection = mysql.createConnection({
	host: 'localhost',
	port: 3306,
	user: 'root',
	password: 'root',
	database: 'vue-admin'
});

connection.connect();

connection.query('SELECT * from goods', function (error, results, fields) {
	if (error) throw error;
  	for(var item in results){
  		console.log(item);
  		console.log(results[item]);
  	}
});

connection.end();