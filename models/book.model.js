module.exports = (tableName, sequelize, Sequelize) => {
    const Book = sequelize.define("book", {
        title: {
            type: Sequelize.STRING
        },
        author: {
            type: Sequelize.STRING
        },
        publishingHouse: {
            type: Sequelize.STRING
        },
        publishingDate: {
            type: Sequelize.STRING
        },
        available: {
            type: Sequelize.INTEGER
        },
        loaned: {
            type: Sequelize.INTEGER
        },
        image: {
            type: Sequelize.STRING
        }
    }, {timestamps: true, tableName: tableName, freezeTableName: true});
    return Book
}