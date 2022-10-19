module.exports = (sequelize, Sequelize) => {
    const Session = sequelize.define("session", {
        token: {
            type: Sequelize.STRING
        },
        validUntil: {
            type: Sequelize.DATE
        },
        userId: {
            type: Sequelize.INTEGER
        }
    }, { timestamps: false });

    return Session;
};