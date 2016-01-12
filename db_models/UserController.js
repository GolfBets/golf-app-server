var Sequelize = require('sequelize');
var User = require('./UserModel.js');
var Course = require('./CourseModel.js');
var Score = require('./ScoreModel.js');

var UserController = {};

UserController.createUser = function (request, reply) {
	User.findOrCreate({where: {username: request.payload.username}, defaults: {
		gamesWon: 0,
		gamesPlayed: 0,
		handicap: request.payload.handicap,
		winnings: 0
	}}).spread( function (user, created) {
		if (created === false) {
			reply('user already exists');
		}
		else {
			reply('user created');
		}
	});
};

UserController.getUsers = function (request, reply) {
	User.findAll().done(function (users) {
		reply(users);
	})
};

UserController.getSpecificUser = function (request,reply) {
	User.findOne({where: {username: request.params.user}}, {include: [{model: Course, as: 'favorites'}]}).then( function (user) {
		reply(user);
	})
};

UserController.addFavorite = function (request, reply) {
	User.findOne({where: {username: request.payload.username}}).then(function (user) {
		Course.findOne({where: {name: request.payload.course}}).then(function (course) {
			user.addFavorite(course).then(function () {
				reply('added favorite');
			})
		})
	})
};

UserController.getFavorites = function (request, reply) {
	User.findOne({where: {username: {$iLike: request.params.name}}, include: [{model: Course, as: 'favorites', attributes: ['name']}]}).then(function (user) {
		reply(user.favorites);
	})
};

// this function needs to be made dynamic
UserController.getGamesFromUser = function (request, reply) {
	User.findOne({where: {id: 1}, include: [{model: Score, as: 'userId'}]}).then(function (user) {
		reply(user);
	})
};

module.exports = UserController;