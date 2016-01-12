var Sequelize = require('sequelize');

var User = sequelize.define('user', {
	username: Sequelize.STRING,
	token: Sequelize.STRING,
	gamesWon: Sequelize.FLOAT,
	gamesPlayed: Sequelize.FLOAT,
	lastPlayed: Sequelize.DATEONLY,
	winnings: Sequelize.FLOAT,
	handicap: Sequelize.FLOAT
});

module.exports = User;