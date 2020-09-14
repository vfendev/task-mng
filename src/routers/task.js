const express = require('express');
const Tasks = require('../models/task');
const auth = require('../middleware/auth')
const router = new express.Router();

// Tasks post

router.post('/tasks', auth, async (req, res) => {
    
    const task = new Tasks({
        ...req.body,
        owner: req.user._id
    })

    try {
        await task.save()
        res.status(201).send(task)
    } catch (e) {
        res.status(400).send(e)
    }
})

// Tasks get

// GET /tasks?completed=true,false
// GET /tasks?limit=10&skip=0 // Pagination
// GET /tasks?sortBy=createdAt_asc/_desc

router.get('/tasks', auth, async (req, res) => {
    const match = {}   
    const sort = {}
    if (req.query.completed) {
            match.completed = req.query.completed === 'true'
    }

    // Sorting tasks descending or ascending
    
    if (req.query.sortBy) {
        const parts = req.query.sortBy.split('_')
        sort[parts[0]] = parts[1] === 'desc' ? -1 : 1
    }
    try {
        // const tasks = await Tasks.find({ owner: req.user._id})

        await req.user.populate({
            path: 'tasks',
            match,
            options: {
                limit: parseInt(req.query.limit),
                skip: parseInt(req.query.skip),
                sort
            }
        }).execPopulate()

        res.send(req.user.tasks)
    } catch (e) {
        res.status(500).send()
    }
})

router.get('/tasks/:id', auth, async (req, res) => {
    const _id = req.params.id

    try {
        const task = await Tasks.findOne({ _id, owner: req.user._id})

        if (!task) {
            return res.status(404).send()
        }

        res.send(task);
    } catch (e) {
        res.status(500).send(e)
    }
})

// Update task 

router.patch('/tasks/:id', auth, async (req, res) => {
    const taskUpdates = Object.keys(req.body)
    const allowedTaskUpdates = ['description', 'completed']
    const validTasks = taskUpdates.every((update)  => allowedTaskUpdates.includes(update))
    try {
        const task = await Tasks.findOne({ _id: req.params.id, owner: req.user._id });
        
        if (!task) {
            return res.status(404).send()
        }
        taskUpdates.forEach((update) => task[update] = req.body[update]);
        await task.save()
            res.send(task)
    } catch (e) {
        res.status(400).send(e)
    }
})

// Delete task

router.delete('/tasks/:id', auth, async (req, res) => {
    try {
        const task = await Tasks.findOneAndDelete({ _id: req.params.id, owner: req.user._id })

        if (!task) {
            return res.status(404).send()
        }
            res.send(task)
    }   
    catch (e) {
        res.status(500).send()
    }
})

module.exports = router