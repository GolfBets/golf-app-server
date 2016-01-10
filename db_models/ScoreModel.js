var Sequelize = require('sequelize');

module.exports = function(sequelize, DataTypes) {
	var Score = sequelize.define('score', {
		score: { type : DataTypes.ARRAY(DataTypes.FLOAT), defaultValue: null},
		playernumber: DataTypes.FLOAT,
		winnings: DataTypes.FLOAT
	});
	return Score;
};