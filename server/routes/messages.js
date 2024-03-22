var express = require('express');
var router = express.Router();
const Message = require('../models/message');
const Contact = require('../models/contact');

router.get('/', async (req, res, next) => {   
    var msgArray = new Array;
    Message.find()
        .populate('sender') 
        .then(messages => {
        // clean this up before sending it back to the client!
        for (msg of messages) {
            id = msg.id; subject = msg.subject; msgText = msg.msgText; sender = msg.sender.id;
            msgArray.push({id, subject, msgText, sender});
        }
        //console.log('server: '+msgArray);
        res.status(200).json({
            message: 'messages fetched successfully!',
            messages: msgArray
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
        // Any new messages are only from the "owner". the first contact.
        // This is initialized when the list of 
        // contacts is fetched (prerequisite for
        // doing anything with messages).
        // Holding onto it seems more efficient
        // than going through some database
        // operation each time a new message must
        // be sent.
        sender: owner
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