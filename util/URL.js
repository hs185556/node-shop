const url = require("url");
const querystring = require("querystring");

function getParams(URL){
	const arg = url.parse(URL).query;
	const params = querystring.parse(arg);
	return params;
}

module.exports = {
	getParams
}
