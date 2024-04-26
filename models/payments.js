module.exports = (sequelize, Sequelize) => {
    const payments = sequelize.define("payments", {
        paymennt_id: {
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
        payment_date: {
            type: Sequelize.STRING,
            allowNull: true,
            validate: {
                len: [0, 100]
            }
        },
        amount: {
            type: Sequelize.INTEGER,
            allowNull: true,
            validate: {
                len: [0, 11]
            }
        },
        balance: {
            type: Sequelize.INTEGER,
            allowNull: true,
            validate: {
                len: [0, 11]
            }
        },
        payment_method: {
            type: Sequelize.STRING,
            allowNull: true,
            validate: {
                len: [0, 100]
            }
        },
        depositor: {
            type: Sequelize.STRING,
            allowNull: true,
            validate: {
                len: [0, 100]
            }
        },
        status: {
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
                fields: ['paymennt_id']
            },
            {
                fields: ['student_id']
            },
            {
                fields: ['payment_date']
            },
            {
                fields: ['amount']
            },
            {
                fields: ['balance']
            },
            {
                fields: ['payment_method']
            },
            {
                fields: ['depositor']
            },
            {
                fields: ['status']
            }
        ]
    });

    payments.belongsTo(sequelize.models.students, { foreignKey: 'student_id' });

    return payments;
};
