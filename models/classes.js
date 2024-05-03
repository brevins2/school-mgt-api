module.exports = (sequelize, Sequelize) => {
    const classes = sequelize.define("classes", {
        class_id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            validate: {
                len: [0, 11]
            }
        },
        class_name: {
            type: Sequelize.STRING,
            allowNull: true,
            validate: {
                len: [0, 100]
            }
        },
        syllabus: {
            type: Sequelize.STRING,
            allowNull: true,
            validate: {
                len: [0, 100]
            }
        },
        capacity: {
            type: Sequelize.INTEGER,
            allowNull: false,
            validate: {
                len: [0, 11]
            }
        }
    },
    {
        indexes: [
            {
                unique: true,
                fields: ['class_id']
            },
            {
                fields: ['class_name']
            },
            {
                fields: ['syllabus']
            },
            {
                fields: ['capacity']
            },
        ]
    });

    return classes;
};
