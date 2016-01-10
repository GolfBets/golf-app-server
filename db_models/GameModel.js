var Sequelize = require('sequelize');

module.exports = function(sequelize, DataTypes) {
	var Game = sequelize.define('game', {
		inprogress: { type: Sequelize.BOOLEAN}
	});
	return Game;
};