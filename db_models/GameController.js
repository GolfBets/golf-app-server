var Sequelize = require('sequelize');
var Game = require('./GameModel.js');
var User = require('./UserModel.js');
var Course = require('./CourseModel.js');
var Score = require('./ScoreModel.js');

var GameController = {};

GameController.getAllGames = function (request, reply) {
	Game.findAll({include: [{model: Course, on: 'courseId'}]}).then(function (games) {
		console.log(games);
		reply(games)
	})
};

// method to add game to multiple users needs to be added in
GameController.submitGame = function (request, reply) {
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


// adapt for guests
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
};

