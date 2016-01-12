var Sequelize = require('sequelize');
var Course = require('./CourseModel.js');

var CourseController = {};

CourseController.createCourse = function (request, reply) {
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
};

CourseController.getCourses = function (request, reply) {
	Course.findAll().done(function (courses) {
		reply(courses);
	})
};

CourseController.getCourseNames = function (request, reply) {
	Course.findAll({attributes: ['name']}).done(function (courses) {
		reply(courses);
	})
};

CourseController.getCoursesByCounty = function (request, reply) {
	var location = request.params.location
	Course.findAll({where: {county: location}, attributes: ['name', 'city'], order: 'name ASC'}).then(function (courses) {
		reply(courses);
	})
};

CourseController.getCoursesByCountyCity = function (request, reply) {
	var location = request.params.location.split('/');
	Course.findAll({where: {county: location[0], city: location[1]}, attributes: ['name'], order: 'name ASC'}).then(function (courses) {
		reply(courses);
	})
};

CourseController.getCoursesByCity = function (request, reply) {
	var city = request.params.city;
	Course.findAll({where: {city: {$iLike: city}}, attributes: ['name'], order: 'name ASC'}).then(function (courses) {
		reply(courses);
	})
};

CourseController.getCourseByName = function (request, reply) {
	Course.findOne({where: {name: {$iLike: request.params.name}}}).done(function (course) {
		reply(course);
	})
};

