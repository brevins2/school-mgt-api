module.exports = (sequelize, Sequelize) => {
    const grades = sequelize.define("grades", {
        result_id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            validate: {
                len: [0, 11]
            }
        },
        exam_name: {
            type: Sequelize.STRING,
            allowNull: true,
            validate: {
                len: [0, 100]
            }
        },
        student_id: {
            type: Sequelize.INTEGER,
            allowNull: false,
            validate: {
                len: [0, 11]
            }
        },
        course_id: {
            type: Sequelize.INTEGER,
            allowNull: false,
            validate: {
                len: [0, 11]
            }
        },
        marks: {
            type: Sequelize.INTEGER,
            allowNull: false,
            validate: {
                len: [0, 4]
            }
        },
        exam_date: {
            type: Sequelize.STRING,
            allowNull: true,
            validate: {
                len: [0, 100]
            }
        },
        remarks: {
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
        }
    },
    {
        indexes: [
            {
                unique: true,
                fields: ['result_id']
            },
            {
                fields: ['exam_name']
            },
            {
                fields: ['student_id']
            },
            {
                fields: ['course_id']
            },
            {
                fields: ['marks']
            },
            {
                fields: ['exam_date']
            },
            {
                fields: ['remarks']
            },
            {
                fields: ['teacher_id']
            }
        ]
    });

    grades.belongsTo(sequelize.models.students, { foreignKey: 'student_id' });
    grades.belongsTo(sequelize.models.teachers, { foreignKey: 'teacher_id' });
    grades.belongsTo(sequelize.models.courses, { foreignKey: 'course_id' });

    return grades;
};
