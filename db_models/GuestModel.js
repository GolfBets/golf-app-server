var Sequelize = require('sequelize');

module.exports = function(sequelize, DataTypes) {
	var Guest = sequelize.define('guest', {
	 	name: Sequelize.STRING,
	});
	return Guest;
};