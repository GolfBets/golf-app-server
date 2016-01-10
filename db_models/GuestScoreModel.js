var Sequelize = require('sequelize');

module.exports = function(sequelize, DataTypes) {
	var GuestScore = sequelize.define('guestscore', {
		score: { type : Sequelize.ARRAY(Sequelize.FLOAT), defaultValue: null},
		playernumber: Sequelize.FLOAT,
		winnings: Sequelize.FLOAT
	});
	return GuestScore;
};