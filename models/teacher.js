module.exports = (sequelize, Sequelize) => {
    const teachers = sequelize.define("teachers", {
        teacher_id: {
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
        teacher_token: {
            type: Sequelize.STRING,
            allowNull: true,
            validate: {
                len: [0, 24]
            }
        },
        contact_info: {
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
        subjects_taught: {
            type: Sequelize.STRING,
            allowNull: true,
            validate: {
                len: [0, 200]
            }
        },
        department: {
            type: Sequelize.STRING,
            allowNull: true,
            validate: {
                len: [0, 255]
            }
        },
        joining_date: {
            type: Sequelize.STRING,
            allowNull: true,
            validate: {
                len: [0, 100]
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
                fields: ['teacher_id']
            },
            {
                fields: ['name']
            },
            {
                unique: true,
                fields: ['email']
            },
            {
                unique: true,
                fields: ['teacher_token']
            },
            {
                fields: ['contact_info']
            },
            {
                fields: ['gender']
            },
            {
                fields: ['subjects_taught']
            },
            {
                fields: ['department']
            },
            {
                fields: ['joining_date']
            },
            {
                fields: ['profile_pic']
            }
        ]
    });

    return teachers;
};
