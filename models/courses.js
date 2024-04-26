module.exports = (sequelize, Sequelize) => {
    const courses = sequelize.define("courses", {
        course_id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            validate: {
                len: [0, 11]
            }
        },
        course_name: {
            type: Sequelize.STRING,
            allowNull: true,
            validate: {
                len: [0, 100]
            }
        },
        description: {
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
        class_id: {
            type: Sequelize.INTEGER,
            allowNull: false,
            validate: {
                len: [0, 11]
            }
        },
        pass_mark: {
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
                fields: ['course_id']
            },
            {
                fields: ['course_name']
            },
            {
                fields: ['description']
            },
            {
                fields: ['teacher_id']
            },
            {
                fields: ['class_id']
            },
            {
                fields: ['pass_mark']
            },
        ]
    });

    courses.belongsTo(sequelize.models.teachers, { foreignKey: 'teacher_id' });
    courses.belongsTo(sequelize.models.classes, { foreignKey: 'class_id' });

    return courses;
};
