module.exports = (sequelize, Sequelize) => {
    const Users = sequelize.define("Users", {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        FirstName: {
            type: Sequelize.STRING(100),
        },
        LastName: {
            type: Sequelize.STRING(200),
        },
        Email: {
            type: Sequelize.STRING(100),
            allowNull: false,
            unique: {
                args: true,
                msg: 'Email address already in use!'
            }
        },
        RegistrationStatus: {
            type: Sequelize.BOOLEAN,
            allowNull: false,
            defaultValue: '0'
        },
        Active: {
            type: Sequelize.BOOLEAN,
            allowNull: false,
            defaultValue: '1'
        },
        Password: {
            type: Sequelize.STRING(50),
            allowNull: false,
        },
        Phone: {
            type: Sequelize.STRING(20),
        },
        ImageURL: {
            type: Sequelize.STRING(250)
        },
        AuthyId: {
            type: Sequelize.STRING(50)
        },
        CountryCode: {
            type: Sequelize.STRING(5)
        }
    });

    return Users;
};