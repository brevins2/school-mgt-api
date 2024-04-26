module.exports = (sequelize, Sequelize) => {
    const classes = sequelize.define("classes", {
        course_id: {
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
        teacher_id: {
            type: Sequelize.INTEGER,
            allowNull: false,
            validate: {
                len: [0, 11]
            }
        },
        class_schedule: {
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
                fields: ['course_id']
            },
            {
                fields: ['class_name']
            },
            {
                fields: ['teacher_id']
            },
            {
                fields: ['class_schedule']
            },
            {
                fields: ['capacity']
            },
        ]
    });

    classes.belongsTo(sequelize.models.teachers, { foreignKey: 'teacher_id' });

    return classes;
};
