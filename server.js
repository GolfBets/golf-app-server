var Hapi = require('hapi');

var server = new Hapi.Server();
server.connection({port: 3000});

var Sequelize = require('sequelize');

var sequelize = new Sequelize('golf', 'postgres', 'postgres', {
  host: 'localhost',
  dialect: 'postgres',
  logging: false
});

var User = sequelize.define('user', {
	username: Sequelize.STRING,
	email: Sequelize.STRING,
	password: Sequelize.STRING,
	handicap: Sequelize.FLOAT,
	winnings: Sequelize.FLOAT
});

var Course = sequelize.define('course', {
	county: Sequelize.STRING,
	city: Sequelize.STRING,
	name: Sequelize.STRING,
	rating: Sequelize.FLOAT,
	slope: Sequelize.FLOAT,
	par:  { type : Sequelize.ARRAY(Sequelize.FLOAT), defaultValue: null},
	hdcp:  { type : Sequelize.ARRAY(Sequelize.FLOAT), defaultValue: null},
	parL:  { type : Sequelize.ARRAY(Sequelize.FLOAT), defaultValue: null},
	hdcpL:  { type : Sequelize.ARRAY(Sequelize.FLOAT), defaultValue: null},
});

var Score = sequelize.define('score', {
	score: { type : Sequelize.ARRAY(Sequelize.FLOAT), defaultValue: null},
	playernumber: Sequelize.FLOAT
})

var Game = sequelize.define('game', {
	inprogress: { type: Sequelize.BOOLEAN}
});

User.hasMany(Score);
User.belongsToMany(Course, {as: 'favorites', through: 'favorites'});
Course.belongsToMany(User, {as: 'favorites', through: 'favorites'});
// Score.belongsTo(User);
// Score.belongsToMany(User, {as: 'individualgame', through: 'individualgame'});
Score.belongsToMany(Game, {as: 'individualgame', through: 'individualgame'});
Game.belongsToMany(Score, {as: 'individualgame', through: 'individualgame'});
Game.belongsTo(Course);


sequelize.sync()


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
		User.findOrCreate({where: {username: request.payload.username}, defaults: {
			email: request.payload.email,
			password: request.payload.password,
			handicap: request.payload.handicap,
			winnings: 0
		}}).spread( function (user, created) {
			if (created === false) {
				reply('user already exists');
			}
			else {
				reply('user created');
			}
		})
	}
});

server.route({
	method: 'POST',
	path: '/createcourse',
	handler: function (request, reply) {
		Course.findOrCreate({where: {name: request.payload.name}, defaults: {
			par: request.payload.par,
			handicap: request.payload.handicap
		}}).spread(function (course, created) {
			if (!created) {
				reply('Already exists');
			}
			else {
				reply(course);
			}
		})
	}
});

server.route({
	method: 'GET',
	path: '/users',
	handler: function (request, reply) {
		User.findAll().done(function (users) {
			reply(users);
		})
	}
});

server.route({
	method: 'GET',
	path: '/user/{user}',
	handler: function (request, reply) {
		User.findOne({where: {username: request.params.user}}, {include: [{model: Course, as: 'favorites'}]}).then( function (user) {
			reply(user);
		})
	}
});

server.route({
	method: "GET",
	path: "/courses",
	handler: function (request, reply) {
		Course.findAll().done(function (courses) {
			reply(courses);
		})
	}
});

server.route({
	method: "GET",
	path: "/coursenames",
	handler: function (request, reply) {
		Course.findAll({attributes: ['name']}).done(function (courses) {
			reply(courses);
		})
	}
});

server.route({
	method: "GET",
	path: "/coursenames/{location*1}",
	handler: function (request, reply) {
		var location = request.params.location
		Course.findAll({where: {county: location}, attributes: ['name', 'city'], order: 'name ASC'}).then(function (courses) {
			reply(courses);
		})		
	}
});

server.route({
	method: "GET",
	path: "/coursenames/{location*2}",
	handler: function (request, reply) {
		var location = request.params.location.split('/');
		Course.findAll({where: {county: location[0], city: location[1]}, attributes: ['name'], order: 'name ASC'}).then(function (courses) {
			reply(courses);
		})		
	}
});

server.route({
	method: "GET",
	path: "/coursesbycity/{city}",
	handler: function (request, reply) {
		var city = request.params.city;
		Course.findAll({where: {city: {$iLike: city}}, attributes: ['name'], order: 'name ASC'}).then(function (courses) {
			reply(courses);
		})
	}
});

server.route({
	method: "GET",
	path: "/course/{name*}",
	handler: function (request, reply) {
		Course.findOne({where: {name: {$iLike: request.params.name}}}).done(function (course) {
			reply(course);
		})
	}
});

server.route({
	method: 'POST',
	path: '/newGame',
	handler: function (request, reply) {
		Course.findOne({where: {name: request.payload.course}}).then(function (course) {
			Game.create({courseId: course.id}).then(function (game) {
				game.setCourse(course).then(function () {
					// for (var i = 0; i < request.payload.user.length; i++) {

						//putting in a for loop caused async issues, loop finishes before user finding ever happens

						Score.create({playernumber: 0}).then(function (score) {
							score.addIndividualgame(game);
							// game.addIndividualgame(score);
							User.findOne({where: {username: request.payload.user[0]}}).then(function (user) {
								user.addScore(score)
							})
						})
						Score.create({playernumber: 1}).then(function (score) {
							score.addIndividualgame(game);
							// game.addIndividualgame(score);
							User.findOne({where: {username: request.payload.user[1]}}).then(function (user) {
								user.addScore(score)
							})
						})
						Score.create({playernumber: 2}).then(function (score) {
							score.addIndividualgame(game);
							// game.addIndividualgame(score);
							User.findOne({where: {username: request.payload.user[2]}}).then(function (user) {
								user.addScore(score)
							})
						})
						Score.create({playernumber: 3}).then(function (score) {
							score.addIndividualgame(game);
							// game.addIndividualgame(score);
							User.findOne({where: {username: request.payload.user[3]}}).then(function (user) {
								user.addScore(score)
							})
						})
						
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
		User.findOne({where: {username: request.payload.username}}).then(function (user) {
			Course.findOne({where: {name: request.payload.course}}).then(function (course) {
				user.addFavorite(course).then(function () {
					reply('added favorite');
				})
			})
		})
	}
});

server.route({
	method: 'POST',
	path: '/getFavorites',
	handler: function (request, reply) {
		User.findOne({where: {username: request.payload.username}, include: [{model: Course, as: 'favorites'}]}).then(function (user) {
			reply(user.favorites);
		})
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
		User.findOne({where: {id: 1}, include: [{model: Score, as: 'individualgame'}]}).then(function (user) {
			console.log(user);
			reply(user);
		})
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