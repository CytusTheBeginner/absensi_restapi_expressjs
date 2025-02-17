const bcrypt = require('bcrypt')
const usersModel = require('../models/users')

const passwordCheck = async (nip, password) => {
    const userData = await usersModel.findOne({ where: { nip: nip } })
    const compare = await bcrypt.compare(password, userData.password)
    return compare
}

module.exports = passwordCheck