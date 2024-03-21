var express = require('express');
const sequenceGenerator = require('./sequenceGenerator');
const Document = require('../models/document');

var router = express.Router();

router.get('/', async (req, res, next) => {
    console.log('documents.js trying to get documents');
    try {
    let documents = await Document.find();
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

router.post('/', (req, res, next) => {
    const maxDocumentId = sequenceGenerator.nextId("Document");
    console.log('trying to post from the backend');
    console.log('maxDocumentId: '+maxDocumentId);
    const document = new Document({
        id: maxDocumentId,
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

router.put('/', (req, res, next) => {
    console.log('trying to put from the backend');
    Document.findOne({ id: req.params.id })
        .then(document => {
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