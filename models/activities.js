module.exports = (sequelize, Sequelize) => {
    const school_events = sequelize.define("school_events", {
        event_id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            validate: {
                len: [0, 11]
            }
        },
        event_name: {
            type: Sequelize.STRING,
            allowNull: false,
            validate: {
                len: [0, 100]
            }
        },
        description: {
            type: Sequelize.STRING,
            allowNull: true,
            validate: {
                len: [0, 200]
            }
        },
        event_date: {
            type: Sequelize.STRING,
            allowNull: true,
            validate: {
                len: [0, 100]
            }
        },
        location: {
            type: Sequelize.STRING,
            allowNull: true,
            validate: {
                len: [0, 100]
            }
        },
        event_status: {
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
                fields: ['event_id']
            },
            {
                fields: ['event_name']
            },
            {
                fields: ['description']
            },
            {
                fields: ['event_date']
            },
            {
                fields: ['location']
            },
            {
                fields: ['event_status']
            }
        ]
    });

    return school_events;
};
