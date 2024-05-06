module.exports = (sequelize, Sequelize) => {
    const students = sequelize.define("students", {
        student_id: {
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
        dob: {
            type: Sequelize.STRING,
            allowNull: true,
            validate: {
                len: [0, 100]
            }
        },
        student_age: {
            type: Sequelize.INTEGER,
            allowNull: true,
            validate: {
                len: [0, 4]
            }
        },
        gender: {
            type: Sequelize.STRING,
            allowNull: true,
            validate: {
                len: [0, 100]
            }
        },
        contact_info: {
            type: Sequelize.STRING,
            allowNull: true,
            validate: {
                len: [0, 100]
            }
        },
        guardian_info: {
            type: Sequelize.STRING,
            allowNull: true,
            validate: {
                len: [0, 255]
            }
        },
        house: {
            type: Sequelize.STRING,
            allowNull: true,
            validate: {
                len: [0, 255]
            }
        },
        home_status: {
            type: Sequelize.STRING,
            allowNull: true,
            validate: {
                len: [0, 255]
            }
        },
        profile_pic: {
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
                fields: ['student_id']
            },
            {
                fields: ['name']
            },
            {
                unique: true,
                fields: ['dob']
            },
            {
                fields: ['student_age']
            },
            {
                fields: ['gender']
            },
            {
                unique: true,
                fields: ['contact_info']
            },
            {
                fields: ['guardian_info']
            },
            {
                fields: ['profile_pic']
            }
        ]
    });

    return students;
};
