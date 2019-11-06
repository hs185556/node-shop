const mysql = require('mysql');

const moment = require('moment');
const async = require('async');

const db = require('./db');
const sql = require('./sql');
const urlTool = require('./../util/URL');

const pool = mysql.createPool(db);
const connection = mysql.createConnection(db);
connection.connect();

// 获取商品列表
function getGoodsList(req, res) {
	const params=urlTool.getParams(req.url);
	pool.getConnection((err, conn) => {
		conn.query(sql.queryAll, ['goods',(params.p-1)*10,params.p*10], (err, rows) => {
			if(err) throw err;

			rows = formatDate(rows);
			res.json(rows); //res.json将数据以json格式传给前端
			conn.release(); //读取操作完成后调用release()释放连接
		});
	});
}

// 查询商品数据条数
function getGoodsCount(req,res){
	pool.getConnection((err, conn) => {
		conn.query(sql.queryCount, ['goods'], (err, rows) => {
			if(err) throw err;
			if(rows[0].count!==undefined && rows[0].count!==0) {
				res.json(rows[0]);
			}
			conn.release(); 
		});
	});
}

// 根据id获取商品
function getOneGoods(req, res) {
	pool.getConnection((err, conn) => {
		conn.query(sql.queryById, ['goods', req.body.id], (err, rows) => {
			if(err) throw err;
			rows = formatDate(rows);
			res.json(rows[0]); //res.json将数据以json格式传给前端
			conn.release(); //读取操作完成后调用release()释放连接
		});
	});
}

// 根据id遍历删除商品
function deleteGoods(req, res) {
	// 遍历执行sql语句，全部执行完则回调
	pool.getConnection((err, conn) => {
		async.each(req.body, function(id, callback) {
		  // 遍历每条SQL并执行
		  conn.query(sql.del,['goods',id],function(err, results) {
		    if(err) {
		      // 异常后调用callback并传入err
		      callback(err);
		    } else {
		    	console.log(id + "执行成功");
		      	// 执行完成后也要调用callback，不需要参数
		    	callback();
		    }
		  });
		}, function(err) {
		  // 所有SQL执行完成后回调
		  if(err) {
		    console.log(err);
		  } else {
		    console.log("SQL全部执行成功");
		    conn.release();
		    res.json({
				status: 201,
				message: '删除成功'
			});
		  }
		});
	});
}

// 添加商品
function addGoods(req, res) {
	let Sql = "insert into ??(name,price) values(?,?)";
	pool.getConnection((err, conn) => {
		conn.query(Sql, ['goods', req.body.name,req.body.price], (err, rows) => {
			if(err) throw err;
			if(rows.affectedRows) {
				res.json({
					status: 201,
					message: '添加成功'
				});
			}
			conn.release(); 
		});
	});
}

// 修改商品
function updateGoods(req, res) {
	var Sql = "update ?? set name=?,price=?,create_time=? where id=?";
	pool.getConnection((err, conn) => {
		conn.query(Sql, ['goods', req.body.name,req.body.price,req.body.create_time,req.body.id], (err, rows) => {
			if(err) throw err;
			if(rows.affectedRows) {
				res.json({
					status: 201,
					message: '编辑成功'
				});
			}
			conn.release(); 
		});
	});
}


// 注册
function regAdmins(req, res) {
	let sql_select = "select count(*) count from ?? where name=?";
	let sql_insert = "insert into ??(name,pwd) values(?,?)";
	pool.getConnection((err, conn) => {
		conn.query(sql_select,['admins',req.body.name],(err,rows)=>{
			if(rows[0].count===0){
				conn.query(sql_insert, ['admins', req.body.name,req.body.pwd], (err, rows) => {
					if(err) throw err;
					if(rows.affectedRows) {
						res.json({
							status: 201,
							message: '注册成功'
						});
					}
				});
			}else{
				res.json({
					status: 406,// 不接受
					message: '账户名已存在'
				});	
			}
			conn.release(); 
		})
	});
}
// 登录 返回加密后的密码 前端比较
function loginAdmins (req, res) {
	pool.getConnection((err, conn) => {
		conn.query(sql.queryByName, ['admins', req.body.name], (err, rows) => {
			if(err) throw err;
			res.json(rows[0]);
			conn.release(); 
		});
	});
}

// formatDate函数利用moment.js将数据库中的时间戳格式转化为年月日的格式
function formatDate(rows) {
	return rows.map(row => {
		let date = moment(row.create_time).format('YYYY-MM-DD');
		return Object.assign({}, row, {
			create_time: date
		});
	});
}

module.exports = {
	getGoodsList,
	getGoodsCount,
	getOneGoods,
	deleteGoods,
	addGoods,
	updateGoods,
	regAdmins,
	loginAdmins,
};