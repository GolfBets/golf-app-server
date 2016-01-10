var Sequelize = require('sequelize');

module.exports = function(sequelize, DataTypes) {
	var Course = sequelize.define('course', {
		county: Sequelize.STRING,
		city: Sequelize.STRING,
		name: Sequelize.STRING,
		rating: Sequelize.FLOAT,
		slope: Sequelize.FLOAT,
		par:  { type : Sequelize.ARRAY(Sequelize.FLOAT), defaultValue: null},
		hdcp:  { type : Sequelize.ARRAY(Sequelize.FLOAT), defaultValue: null},
		parL:  { type : Sequelize.ARRAY(Sequelize.FLOAT), defaultValue: null},
		hdcpL:  { type : Sequelize.ARRAY(Sequelize.FLOAT), defaultValue: null},
	});
	return Course;
};