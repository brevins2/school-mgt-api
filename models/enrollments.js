module.exports = (sequelize, Sequelize) => {
    const enrollements = sequelize.define("enrollements", {
        enrollment_id: {
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
        enrollement_date: {
            type: Sequelize.STRING,
            allowNull: true,
            validate: {
                len: [0, 100]
            }
        },
        enrollement_year: {
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
                fields: ['enrollment_id']
            },
            {
                fields: ['student_id']
            },
            {
                fields: ['class_id']
            },
            {
                fields: ['enrollement_date']
            },
            {
                fields: ['enrollement_year']
            },
        ]
    });

    enrollements.belongsTo(sequelize.models.students, { foreignKey: 'student_id' });
    enrollements.belongsTo(sequelize.models.classes, { foreignKey: 'class_id' });

    return enrollements;
};
