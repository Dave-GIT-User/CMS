var express = require('express');
var router = express.Router();
const Message = require('../models/message');
const Contact = require('../models/contact');

router.get('/', async (req, res, next) => {
    Message.find()
        .populate('sender') 
        .then(messages => {
        res.status(200).json({
            message: 'messages fetched successfully!',
            messages: messages
        });
    })
    .catch(error => {
        res.status(500).json({
            message: 'An error occurred',
            error: error
        });
    });
});

 router.post('/:id', (req, res, next) => {

    const message = new Message({
        id: req.body.id,
        subject: req.body.subject,
        msgText: req.body.msgText,
        // this is too specific.
        // The sender is always id 0 in the contacts.
        // tried using Contact.findOne({"id": "0"})._id but that is trash.
        sender: owner//'65fc5ebfb4ff7f63e78bf202'
    });
  
    message.save()
        .then(createdmessage => {
            res.status(201).json({
                message: 'message added successfully',
                message: createdmessage
            });
        })
        .catch(error => {
            res.status(500).json({
            message: 'An error occurred',
            error: error
        });
    });    
});

router.delete("/:id", (req, res, next) => {
    Message.findOne({ id: req.params.id })
        .then(message => {
            message.deleteOne({ id: req.params.id })
            .then(result => {
                res.status(204).json({
                message: "Message deleted successfully"
            });
        })
            .catch(error => {
                res.status(500).json({
                message: 'An error occurred',
                error: error
            });
        })
    })
        .catch(error => {
            res.status(500).json({
                message: 'Message not found.',
                error: { message: 'Message not found'}
        });
    });
});

module.exports = router; 