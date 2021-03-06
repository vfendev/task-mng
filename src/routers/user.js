const express = require('express');
const multer = require('multer');
const sharp = require('sharp');
const User = require('../models/user');
const router = new express.Router();
const auth = require('../middleware/auth');
const { remove } = require('../models/user');
const { sendWelcomeEmail, sendCancelationEmail } = require('../emails/account');
const { response } = require('express');

// Users post 
router.post('/register', async (req, res) => {
    const user = new User(req.body)
    try {
         await user.save()
         sendWelcomeEmail(user.email, user.name)
         const token = await user.generateAuthToken()
         res.header('x-auth-token', token).send({ user, token })
        //  res.status(201).send({ user, token })
        //  res.redirect('/create_list')
    } catch (e) {
        res.status(401).send()
        //  res.redirect('/register');
    }       
 })

 router.post('/users/login', async (req, res) => {
     try {
         const user = await User.findByCredentials(req.body.email, req.body.password)
         const token = await user.generateAuthToken()
         res.header('x-auth-token', token).send({ user, token })
        //  res.status(200).send({ user, token })
        //  res.redirect('/create_list')
     } catch (e) {
         res.status(400).send()
        // res.redirect('/login')
     }
 })

// Logout only one session
router.post('/users/logout', auth, async (req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter((token) => {
        return token.token !== req.token
        })
        await req.user.save()
        res.send()
    } catch (e) {
        res.status(500).send()
    }
})
 
// Logout all sessions
router.post('/users/logoutAll', auth, async (req, res) => {
    try {
        req.user.tokens = []
        await req.user.save()
        res.send()
    } catch (e) {
        res.status(500).send()
    }
})

 // User get
 router.get('/users/me', auth, async (req, res) => {
        res.send(req.user)
 })
 
 // Update user
 router.patch('/users/me', auth, async (req, res) => {
     const updates = Object.keys(req.body)
     const allowedUpdates = ['name', 'email', 'password', 'age']
     const isValidOperation = updates.every((update) => allowedUpdates.includes(update))
 
     if (!isValidOperation) {
         return res.status(400).send({ error: 'Invalid updates!'})
     }
     try {
        
        updates.forEach((update) => req.user[update] = req.body[update])
        await req.user.save()
         res.send(req.user)
     } catch (e) {
         res.status(400).send()
     }
 })

 // Delete user
 router.delete('/users/me', auth, async (req, res) => {
     try {
        await req.user.remove()
        sendCancelationEmail(req.user.email, req.user.name)
        res.send(req.user)
     } catch (e) {
          res.status(500).send()
     }
 })
 
 // Upload profile images
 const upload = multer({
    limits: {
        fileSize: 1000000
    },
    fileFilter(req, file, cb) {
        if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
            return cb(new Error('The extension of file is not supported'))
        }
        cb(undefined, true)
    }
})
 
 router.post('/users/me/avatar', auth, upload.single('avatar'), async (req, res) => {
    const buffer = await sharp(req.file.buffer).resize({ width: 250, height: 250 }).png().toBuffer()
    req.user.avatar = buffer
    await req.user.save()
    res.send('Image is uploaded')
 }, (error, req, res, next) => {
     res.status(400).send({error: error.message})
 })

//  Delete profile images
router.delete('/users/me/avatar', auth, async (req, res) => {  
    req.user.avatar = undefined
    await req.user.save()
    res.send('Image is deleted')
}, (error, req, res, next) => {
    res.status(500).send({error: error.message})
})

// Fetching an avatar
router.get('/users/:id/avatar', async (req, res) => {
    try {
        const user = await User.findById(req.params.id)

        if (!user || !user.avatar) {
            throw new Error({ error: error.message })
        }
        
        res.set('Content-Type', 'image/png')
        res.send(user.avatar)

    } catch (e) {
        res.status(404).send()
    }
})

 module.exports = router