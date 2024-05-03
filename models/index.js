const Sequelize = require("sequelize");

const sequelize = new Sequelize('school_api_db', 'root', '', {
  host: 'localhost',
  dialect: 'mysql',
  operatorsAliases: false,
});

const db_models = {};

db_models.Sequelize = Sequelize;
db_models.sequelize = sequelize;

db_models.users = require("./users.js")(sequelize, Sequelize);
db_models.students = require("./students.js")(sequelize, Sequelize);
db_models.classes = require("./classes.js")(sequelize, Sequelize);
db_models.teachers = require("./teacher.js")(sequelize, Sequelize);
db_models.attendences = require("./attendences.js")(sequelize, Sequelize);
db_models.courses = require("./courses.js")(sequelize, Sequelize);
db_models.enrollments = require("./enrollments.js")(sequelize, Sequelize);
db_models.library = require("./library.js")(sequelize, Sequelize);
db_models.payments = require("./payments.js")(sequelize, Sequelize);
db_models.grades = require("./grades.js")(sequelize, Sequelize);

module.exports = db_models;
