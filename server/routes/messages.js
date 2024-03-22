var express = require('express');
const sequenceGenerator = require('./sequenceGenerator');
const Message = require('../models/message');
const Contact = require('../models/contact');

var router = express.Router();
router.get('/', async (req, res, next) => {   
    var msgArray = new Array;
    Message.find()
        .populate('sender') 
        .then(messages => {
        // clean this up before sending it back to the client!
        
        for (msg of messages) {
            let id = msg.id; 
            let subject = msg.subject; 
            let msgText = msg.msgText; 
            let sender = msg.sender.id;
            msgArray.push({id, subject, msgText, sender});
        }
        
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

// Aaron Picker fixed sequenceGenerator, but this way to use it is my idea. DH
/*
router.post("/:id", async (req, res, next) => { *
    try {*
        await sequenceGenerator.nextId("documents");*
        
        if (ticket)*
            console.log('maxDocumentId: '+ticket);*
        else {*
            console.log('Darn! Sequence Generator failed.');*
            throw("Sequence Generator failed.");*
        }*
        const document = new Document({*
            id: ticket,
            name: req.body.name,
            description: req.body.description,
            url: req.body.url
        });*
        console.log(document);
        document
            .save()
            .then((createdDocument) => {
                return res.status(201).json({
                    message: "Document added successfully.",
                    document: createdDocument,
                });
            })

    } catch (error) {
        return res.status(500).json({
            message: "An error occurred saving the document.",
            error: error,
        });
    }
});
*/
// Aaron Picker fixed sequenceGenerator, but this way to use it is my idea. DH
router.post('/:id', async (req, res, next) => {
    try {
        await sequenceGenerator.nextId("messages");
        if (ticket) {
            console.log('maxDocumentId: '+ticket);
        } else {
            console.log('Darn! Sequence Generator failed.');
            throw("Sequence Generator failed.");
        }   
        const message = new Message({
            id: req.body.id,
            subject: req.body.subject,
            msgText: req.body.msgText,
            // any new messages are currently authored by the user with id 0.
            // owner is that user's primary key, _id. This is only used
            // on the server side.
            sender: owner
        });
        console.log(message);
        message.save()
        .then((createdmessage) => {
            res.status(201).json({
                message: 'message added successfully',
                message: createdmessage
            });
        })
    } catch(error) {
            res.status(500).json({
            message: 'An error occurred',
            error: error
        });
    }
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