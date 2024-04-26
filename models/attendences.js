module.exports = (sequelize, Sequelize) => {
    const attendences = sequelize.define("attendences", {
        attendence_id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            validate: {
                len: [0, 11]
            }
        },
        student_id: {
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
        date_taken: {
            type: Sequelize.STRING,
            allowNull: true,
            validate: {
                len: [0, 100]
            }
        },
        attendence_status: {
            type: Sequelize.STRING,
            allowNull: true,
            validate: {
                len: [0, 10]
            }
        }
    },
    {
        indexes: [
            {
                unique: true,
                fields: ['attendence_id']
            },
            {
                fields: ['student_id']
            },
            {
                fields: ['class_id']
            },
            {
                fields: ['date_taken']
            },
            {
                fields: ['attendence_status']
            },
        ]
    });

    attendences.belongsTo(sequelize.models.students, { foreignKey: 'student_id' });
    attendences.belongsTo(sequelize.models.classes, { foreignKey: 'class_id' });

    return attendences;
};
