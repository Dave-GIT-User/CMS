var express = require('express');
const sequenceGenerator = require('./sequenceGenerator');
const Document = require('../models/document');

var router = express.Router();

router.get('/', async (req, res, next) => {
    /*
    var msgArray = new Array;
    Message.find()
        .populate('sender') 
        .then(messages => {
        // clean this up before sending it back to the client!
        for (msg of messages) {
            id = msg.id; subject = msg.subject; msgText = msg.msgText; sender = msg.sender.id;
            msgArray.push({id, subject, msgText, sender});
        }
    */
    try {
    let documents = await Document.find();
    console.log(documents);
    return res.status(200).json({
        message: 'fetched Documents.',
        documents: documents
        }); 
    } catch (error) {
        console.error('Error fetching documents:', error);
        res.status(500).json({
            error: error
        });
    }    
});

router.post('/:id', (req, res, next) => {
    const document = new Document({
        id: req.body.id,
        name: req.body.name,
        description: req.body.description,
        url: req.body.url        
    });
  
    document.save()
        .then(createdDocument => {
            res.status(201).json({
                message: 'Document added successfully',
                document: createdDocument
            });
        })
        .catch(error => {
            res.status(500).json({
            message: 'An error occurred',
            error: error
        });
    });    
});

// update a single document
router.put('/:id', (req, res, next) => {
    Document.findOne({ id: req.params.id })
        .then(document => {
            document.id = req.body.id;
            document.name = req.body.name;
            document.description = req.body.description;
            document.url = req.body.url;
  
            Document.updateOne({ id: req.params.id }, document)
                .then(result => {
                    res.status(204).json({
                    message: 'Document updated successfully'
            })
        })
            .catch(error => {
                res.status(500).json({
                message: 'An error occurred',
                error: error
            });
        });
    })
        .catch(error => {
            res.status(500).json({
            message: 'Document not found.',
            error: { document: 'Document not found'}
        });
    });
});
  
router.delete("/:id", (req, res, next) => {
    Document.findOne({ id: req.params.id })
        .then(document => {
            Document.deleteOne({ id: req.params.id })
            .then(result => {
                res.status(204).json({
                message: "Document deleted successfully"
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
                message: 'Document not found.',
                error: { document: 'Document not found'}
        });
    });
});

module.exports = router; 