var Sequelize = require('sequelize');

var Score = sequelize.define('score', {
	score: { type : Sequelize.ARRAY(Sequelize.FLOAT), defaultValue: null},
	playernumber: Sequelize.FLOAT,
	winnings: Sequelize.FLOAT
});

module.exports = Score;