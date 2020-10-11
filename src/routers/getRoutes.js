const express = require('express');
const router = new express.Router();

router.get('/', async (req, res) => {
    try {
       await res.render('index')
    } catch (error) {
        res.status(500).send()
    }
})

router.get('/register', async (req, res) => {
    try {
        await res.render('register')
    } catch (error) {
        res.status(500).send()
    }
})

router.get('/login', async (req, res) => {
    try {
        await res.render('login')
    } catch (error) {
        res.status(500).send()
    }
})
 
router.get('/create_list', async (req, res) => {
    try {
        await res.render('create-list')
    } catch (error) {
        res.status(500).send()
    }
})

router.get('/list', async (req, res) => {
    try {
        await res.render('list')
    } catch (error) {
        res.status(500).send()
    }
})

module.exports = router