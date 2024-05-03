module.exports = (sequelize, Sequelize) => {
    const users = sequelize.define("users", {
        userid: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            validate: {
                len: [0, 11]
            }
        },
        name: {
            type: Sequelize.STRING,
            allowNull: true,
            validate: {
                len: [0, 100]
            }
        },
        email: {
            type: Sequelize.STRING,
            allowNull: true,
            validate: {
                len: [0, 100]
            }
        },
        password: {
            type: Sequelize.STRING,
            allowNull: true,
            validate: {
                len: [0, 100]
            }
        },
        token: {
            type: Sequelize.STRING,
            allowNull: true,
            validate: {
                len: [0, 24]
            }
        },
        account_token: {
            type: Sequelize.STRING,
            allowNull: true,
            validate: {
                len: [0, 24]
            }
        },
        status: {
            type: Sequelize.STRING,
            allowNull: true,
            validate: {
                len: [0, 24]
            }
        },
        avatar: {
            type: Sequelize.STRING,
            allowNull: true,
            validate: {
                len: [0, 100]
            }
        }
    },
    {
        indexes: [
            {
                unique: true,
                fields: ['userid']
            },
            {
                unique: true,
                fields: ['email']
            },
            {
                fields: ['password']
            },
            {
                fields: ['name']
            },
            {
                unique: true,
                fields: ['token']
            },
            {
                unique: true,
                fields: ['account_token']
            },
            {
                fields: ['status']
            },
            {
                fields: ['avatar']
            }
        ]
    });

    return users;
};
