"use strict";

var Sequelize = require('sequelize');

module.exports = function(sequelize, DataTypes) {
	var User = sequelize.define('user', {
		username: DataTypes.STRING,
		token: DataTypes.STRING,
		gamesWon: DataTypes.FLOAT,
		gamesPlayed: DataTypes.FLOAT,
		lastPlayed: DataTypes.DATEONLY,
		winnings: DataTypes.FLOAT,
		handicap: DataTypes.FLOAT
	});
	return User;
}