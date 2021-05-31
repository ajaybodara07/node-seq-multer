require('dotenv').config();
const Sequelize = require('sequelize');

const sequelize = () => new Promise(((resolve, reject) => {
  // Init Sequelize
  const seq = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASS, {
    host: process.env.DB_HOST,
    dialect: process.env.DB_DIALECT,
    port: process.env.DB_PORT,
    define: {
      timestamps: false,
      freezeTableName: true
    },
    dialectOptions: {
      multipleStatements: true
    },
    logging: false
  });

  // Check connection
  seq
    .authenticate()
    .then(() => {
      console.log('DB connection established successfully.');
      resolve(seq);
    })
    .catch((err) => {
      // console.error('Unable to connect to the database:', err);
      reject(new Error(`Unable to connect to the database: ${err}`));
    });
}));

module.exports = sequelize;