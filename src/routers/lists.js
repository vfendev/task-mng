const express = require('express');
const Lists = require('../models/lists');
const auth = require('../middleware/auth');
const router = new express.Router();

// Lists post

router.post('/lists', auth, async (req, res) => {
    
    const list = new Lists({
        ...req.body,
        owner: req.user._id
    })

    try {
        await list.save()
        res.status(201).send(list)
    } catch (e) {
        res.status(400).send(e)
        // res.redirect('/create_list')
    }
})

// Lists get

// GET /lists?completed=true,false
// GET /lists?limit=10&skip=0 // Pagination
// GET /lists?sortBy=createdAt_asc/_desc

router.get('/lists', auth, async (req, res) => {
    const match = {}   
    const sort = {}

    // Sorting lists descending or ascending  
    if (req.query.sortBy) {
        const parts = req.query.sortBy.split('_')
        sort[parts[0]] = parts[1] === 'desc' ? -1 : 1
    }

    try {
        const lists = await Lists.find({ owner: req.user._id})
        res.send(lists)
    } catch (e) {
        res.status(500).send()
    }
})

// Get list by id

router.get('/lists/:id', auth, async (req, res) => {
    const _id = req.params.id

    try {
        const list = await Lists.findOne({ _id, owner: req.user._id})

        if (!list) {
            return res.status(404).send()
        }

        res.send(list);
    } catch (e) {
        res.status(500).send(e)
    }
})

// Update lists 

router.patch('/lists/:id', auth, async (req, res) => {
    const listUpdates = Object.keys(req.body)
    const allowedListUpdates = ['listname']
    const validLists = listUpdates.every((update)  => allowedListUpdates.includes(update))
    try {
        const list = await Lists.findOne({ _id: req.params.id, owner: req.user._id });
        
        if (!list) {
            return res.status(404).send()
        }
        listUpdates.forEach((update) => list[update] = req.body[update]);
        await list.save()
            res.send(list)
    } catch (e) {
        res.status(400).send(e)
    }
})

// Delete lists

router.delete('/lists/:id', auth, async (req, res) => {
    try {
        const list = await Lists.findOneAndDelete({ _id: req.params.id, owner: req.user._id })

        if (!list) {
            return res.status(404).send()
        }
            res.send(list)
    }   
    catch (e) {
        res.status(500).send()
    }
})

module.exports = router