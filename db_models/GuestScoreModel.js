var Sequelize = require('sequelize');

var GuestScore = sequelize.define('guestscore', {
	score: { type : Sequelize.ARRAY(Sequelize.FLOAT), defaultValue: null},
	playernumber: Sequelize.FLOAT,
	winnings: Sequelize.FLOAT
});

module.exports = GuestScore;