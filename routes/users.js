const express = require('express')
const router = express.Router()
const UsersModel = require('../models/users')
const bcrypt = require('bcrypt')
const checkPassword = require('../utils/passwordCheck')
const passwordCheck = require('../utils/passwordCheck')

// routing endpoint users utama
router.get('/', async (req, res) => {
    const users = await UsersModel.findAll()
    res.status(200).json({
        data: users,
        metadata: "Test Read All Users Endpoint"
    })
})

// Create Data Users
router.post('/', async (req, res) => {
    const { nip, nama, password } = req.body

    const encryptedPassword = await bcrypt.hash(password, 10)

    const users = await UsersModel.create({
        nip, nama, password: encryptedPassword
    })

    res.status(200).json({
        data: users,
        metadata: "New Users Created"
    })
})

router.put('/', async (req, res) => {
    const { nip, nama, password, passwordBaru } = req.body

    const check = await passwordCheck(nip, password)

    // validasi password user sebelum mengganti data
    if(check === true) {
        const encryptedPasswordbaru = await bcrypt.hash(passwordBaru, 10)

        const users = await UsersModel.update({
            nama, password: encryptedPasswordbaru
        }, { where: { nip: nip } })  
        
        res.status(200).json({
            users: { updated: users[0] },
            success: "Users Data successfully updated 😘"
        })
    } else {
        res.status(400).json({
            error: "data invalid 😒 "
        })
    }
})  

router.post('/login', async (req, res) => {
    const { nip, password } = req.body

    const check = await passwordCheck(nip, password)

    if (check === true) {
        res.status(200).json({
            users: "",
            metadata: "login success"
        })
    } else {
        res.status(400).json({
            error: "data invalid, login failed"
        })
    }  
})

module.exports = router