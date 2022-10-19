/* BEGIN db initialization */
const { Op } = require("sequelize");
const { v4: uuidv4 } = require('uuid');
const moment = require('moment');
const Sequelize = require("../db.connection");
const Session = require("../models/session.model")(Sequelize.connection, Sequelize.Sequelize);
/* END db initialization */


// Create session for user
exports.create = async (id) => {
    const obj = {
        token: uuidv4(),
        validUntil: moment().add(25, 'minutes').format(),
        userId: id
    };
    let result = {};


    // Save in the database
    await Session.create(obj)
        .then(data => result = data)
        .catch(e => {
            console.log("Error =");
            console.log(e);
        });

    return result;
};

// Get session by user id
exports.findByUserId = async (id) => {
    let condition = id ? { userId: { [Op.eq]: id } } : null;
    let result = {};


    await Session.findOne({ where: condition })
        .then(data => result = data)
        .catch(e => {
            console.log("Error =");
            console.log(e);
        });

    return result;
};

// Get session by token
exports.findByToken = async (token) => {
    let condition = token ? { token: { [Op.eq]: token } } : null;
    let result = {};


    await Session.findOne({ where: condition })
        .then(data => result = data)
        .catch(e => {
            console.log("Error =");
            console.log(e);
        });

    return result;
};

// Delete a token with a certain id
exports.delete = async (token) => {
    let result;


    await Session.destroy({
        'where': {
            'token': token
        }
    })
        .then(num => result = num)
        .catch(err => result = err);

    return result;
};

