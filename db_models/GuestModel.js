var Sequelize = require('sequelize');

var Guest = sequelize.define('guest', {
 	name: Sequelize.STRING,
});

module.exports = Guest;