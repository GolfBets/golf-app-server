var Sequelize = require('sequelize');

var Game = sequelize.define('game', {
	inprogress: { type: Sequelize.BOOLEAN}
});

module.exports = Game;