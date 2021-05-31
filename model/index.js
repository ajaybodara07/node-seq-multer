const Sequelize = require('sequelize');

const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASS, {
    host: process.env.DB_HOST,
    dialect: process.env.DB_DIALECT,
    port: process.env.DB_PORT,
    operatorsAliases: false,
    define: {
        timestamps: false,
        freezeTableName: true
    },
    dialectOptions: {
        multipleStatements: true
    },
    logging: true
});

const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.Users = require("../model/users.model")(sequelize, Sequelize);

module.exports = db;
