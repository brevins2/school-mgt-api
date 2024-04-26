module.exports = (sequelize, Sequelize) => {
    const library = sequelize.define("library", {
        book_id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        title: {
            type: Sequelize.STRING,
            allowNull: true,
            validate: {
                len: [0, 100]
            }
        },
        author: {
            type: Sequelize.STRING,
            allowNull: true,
            validate: {
                len: [0, 100]
            }
        },
        gender: {
            type: Sequelize.STRING,
            allowNull: true,
            validate: {
                len: [0, 100]
            }
        },
        ISBN: {
            type: Sequelize.STRING,
            allowNull: true,
            validate: {
                len: [0, 100]
            }
        },
        Availability: {
            type: Sequelize.INTEGER,
            allowNull: true,
            validate: {
                len: [0, 11]
            }
        },
        book_cover: {
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
                fields: ['book_id']
            },
            {
                fields: ['title']
            },
            {
                unique: true,
                fields: ['author']
            },
            {
                fields: ['gender']
            },
            {
                fields: ['ISBN']
            },
            {
                fields: ['Availability']
            },
            {
                fields: ['book_cover']
            }
        ]
    });

    return library;
};
