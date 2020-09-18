const express = require('express');
require('./db/mongoose');
const userRouter = require('./routers/user');
const taskRouter = require('./routers/task');
const listRouter = require('./routers/lists');
require('dotenv').config();

const app = express();
const port = process.env.PORT

app.use(express.json())
app.use(userRouter);
app.use(taskRouter);
app.use(listRouter);

// Static folder
app.use(express.static(path.join(__dirname, 'public')))

app.listen(port, () => {
    console.log('Server is up on port ' + port)
})

const User = require('./models/user')
