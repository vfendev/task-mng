const path = require('path')
const express = require('express');
require('./db/mongoose');
const userRouter = require('./routers/user');
const taskRouter = require('./routers/task');
const listRouter = require('./routers/lists');
require('dotenv').config();

const app = express();
const port = process.env.PORT

// Set views
const viewsPath = path.join(__dirname, '../views')
app.set('views', viewsPath)
app.set('view engine', 'ejs')

// Static folder
const publicDirectoryPath = path.join(__dirname, '../public')
app.use(express.static(publicDirectoryPath))
app.use(express.urlencoded({ extended: false }))
app.use(express.json())
app.use(userRouter);
app.use(taskRouter);
app.use(listRouter);

app.listen(port, () => {
    console.log('Server is up on port ' + port)
})

app.get('/', async (req, res) => {
    try {
        res.render('index')
    } catch (error) {
        res.status(500).send()
    }
})
app.get('/register', async (req, res) => {
    try {
        await res.render('register')
    } catch (error) {
        res.status(500).send()
    }
})

app.get('/login', async (req, res) => {
    try {
        await res.render('login')
    } catch (error) {
        res.status(500).send()
    }
})

app.get('/create_list', async (req, res) => {
    try {
        await res.render('create-list')
    } catch (error) {
        res.status(500).send()
    }
})

app.get('/list', async (req, res) => {
    try {
        await res.render('list')
    } catch (error) {
        res.status(500).send()
    }
})
const User = require('./models/user')
