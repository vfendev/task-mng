const express = require('express');
const path = require('path')
require('./db/mongoose');
const userRouter = require('./routers/user');
const taskRouter = require('./routers/task');
const listRouter = require('./routers/lists');
const getRouter = require('./routers/getRoutes');
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
app.use(getRouter);

app.listen(port, () => {
    console.log('Server is up on port ' + port)
})

