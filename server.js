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
	name: Sequelize.STRING,
	rating: Sequelize.FLOAT,
	slope: Sequelize.FLOAT,
	par:  { type : Sequelize.ARRAY(Sequelize.FLOAT), defaultValue: null},
	handicap:  { type : Sequelize.ARRAY(Sequelize.FLOAT), defaultValue: null}
});

var Score = sequelize.define('score', {
	score: { type : Sequelize.ARRAY(Sequelize.FLOAT), defaultValue: null},
	playernumber: Sequelize.FLOAT
})

var Game = sequelize.define('game', {
	inprogress: { type: Sequelize.BOOLEAN}
});

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

server.start(function () {
    console.log('Server running at:', server.info.uri);
});