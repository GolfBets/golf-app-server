var Hapi = require('hapi');
var port = process.env.PORT || 3000;
var server = new Hapi.Server();
server.connection({port: port});

var Sequelize = require('sequelize');

sequelize = new Sequelize(process.env.DBDB || 'golf', process.env.DBUSER || 'postgres', process.env.DBPW || 'postgres', {
  host: process.env.DBHOST || 'localhost',
  dialect: 'postgres',
  // logging: false
});

var User = require('./db_models/UserModel.js');
var Course = require('./db_models/CourseModel.js');
var Score = require('./db_models/ScoreModel.js');
var Game = require('./db_models/GameModel.js');
var Guest = require('./db_models/GuestModel.js');
var GuestScore = require('./db_models/GuestScoreModel.js');

User.hasMany(Score);
User.belongsToMany(Course, {as: 'favorites', through: 'favorites'});
Course.belongsToMany(User, {as: 'favorites', through: 'favorites'});
// Score.belongsTo(User);
// Score.belongsToMany(User, {as: 'individualgame', through: 'individualgame'});
Score.belongsToMany(Game, {as: 'individualgame', through: 'individualgame'});
Game.belongsToMany(Score, {as: 'individualgame', through: 'individualgame'});
Game.belongsTo(Course);

sequelize.sync()

var userController = require('./db_models/UserController.js');
var courseController = require('./db_models/CourseController.js');
var gameController = require('./db_models/GameController.js');

server.register(require('inert'), function (err) {
    if (err) {
        throw err;
    }
    server.route({
        method: 'GET',
        path: '/',
        handler: function (request, reply) {
            reply.file('./index.html');
        }
    });
});

server.route({
	method: 'POST',
	path: '/createuser',
	handler: function (request, reply) {
		userController.createUser(request, reply);
	}
});

server.route({
	method: 'POST',
	path: '/createcourse',
	handler: function (request, reply) {
		courseController.createCourse(request, reply);
	}
});

server.route({
	method: 'GET',
	path: '/users',
	handler: function (request, reply) {
		userController.getUsers(request, reply);
	}
});

server.route({
	method: 'GET',
	path: '/user/{user}',
	handler: function (request, reply) {
		userController.getSpecificUser(request, reply);
	}
});

server.route({
	method: "GET",
	path: "/courses",
	handler: function (request, reply) {
		courseController.getCourses(request, reply);
	}
});

server.route({
	method: "GET",
	path: "/coursenames",
	handler: function (request, reply) {
		courseController.getCourseNames(request, reply);
	}
});

server.route({
	method: "GET",
	path: "/coursenames/{location*1}",
	handler: function (request, reply) {
		courseController.getCoursesByCounty(request, reply);
	}
});

server.route({
	method: "GET",
	path: "/coursenames/{location*2}",
	handler: function (request, reply) {
		courseController.getCoursesByCountyCity(request, reply);
	}
});

server.route({
	method: "GET",
	path: "/coursesbycity/{city}",
	handler: function (request, reply) {
		courseController.getCoursesByCity(request, reply);
	}
});

server.route({
	method: "GET",
	path: "/course/{name*}",
	handler: function (request, reply) {
		courseController.getCourseByName(request, reply);
	}
});

server.route({
	method: 'POST',
	path: '/submitGame',
	handler: function (request, reply) {
		
	}
});

server.route({
	method: 'POST',
	path: '/addFavorite',
	handler: function (request, reply) {
		userController.addFavorite(request, reply);
	}
});

server.route({
	method: 'GET',
	path: '/getFavorites/{name}',
	handler: function (request, reply) {
		userController.getFavorites(request, reply);
	}
});

server.route({
	method: 'GET',
	path: '/getAllGames',
	handler: function (request, reply) {
		gameController.getAllGames(request, reply);
	}
});

server.route({
	method: 'GET',
	path: '/getGamesFromUser',
	handler: function (request, reply) {
		userController.getGamesFromUser(request, reply)
	}
});

server.start(function () {
    console.log('Server running at:', server.info.uri);
});
