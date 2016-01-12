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
var courseController = require('./db_models/CourseController');

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
		Course.findOne({where: {name: request.payload.course}}).then(function (course) {
			Game.create({courseId: course.id}).then(function (game) {
				game.setCourse(course).then(function () {
          var scoreArray1 = [];
          var scoreArray2 = [];
          var scoreArray3 = [];
          var scoreArray4 = [];
          for (var i = 1; i < 19; i++) {
            var temp = 'h'+ i;
            scoreArray1.push(request.payload.player1score[temp]);
            if (request.payload.player2score) {
              scoreArray2.push(request.payload.player2score[temp]);
            }
            if (request.payload.player3score.h1) {
              scoreArray3.push(request.payload.player3score[temp]);
            }
            if (request.payload.player4score.h1) {
              scoreArray4.push(request.payload.player4score[temp]);
            }
          }
					// for (var i = 0; i < request.payload.user.length; i++) {

						//putting in a for loop caused async issues, loop finishes before user finding ever happens

						Score.create({playernumber: 0, score: scoreArray1, winnings: request.payload.player1Results}).then(function (score) {
							score.addIndividualgame(game);
							game.addIndividualgame(score);
							User.findOne({where: {username: request.payload.player1}}).then(function (user) {
								user.addScore(score)
							})
						})
						Score.create({playernumber: 1, score: scoreArray2, winnings: request.payload.player2Results}).then(function (score) {
							score.addIndividualgame(game);
							// game.addIndividualgame(score);
							User.findOrCreate({where: {username: 1}}).then(function (user) {
								user.addScore(score)
							})
						})
            if (scoreArray3[0]) {
  						Score.create({playernumber: 2, score: scoreArray3, winnings: request.payload.player3Results}).then(function (score) {
  							score.addIndividualgame(game);
  							// game.addIndividualgame(score);
  							User.findOne({where: {id: 2}}).then(function (user) {
  								user.addScore(score)
  							})
  						})
            }
            if(scoreArray4[0]){
  						Score.create({playernumber: 3, score: scoreArray4, winnings: request.payload.player4Results}).then(function (score) {
  							score.addIndividualgame(game);
  							// game.addIndividualgame(score);
  							User.findOne({where: {id: 3}}).then(function (user) {
  								user.addScore(score)
  							})
  						})
            }

					// }
					reply('Game Created');
				})
			})
		})
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
		Game.findAll({include: [{model: Course, on: 'courseId'}]}).then(function (games) {
			console.log(games);
			reply(games)
		})
	}
});

server.route({
	method: 'GET',
	path: '/getGamesFromUser',
	handler: function (request, reply) {
		userController.getGamesFromUser(request, reply)
	}
});

server.route({
	method: 'POST',
	path: '/postHoleScore',
	handler: function (request, reply) {
		Game.findOne({where: {}})
	}
});

server.start(function () {
    console.log('Server running at:', server.info.uri);
});
