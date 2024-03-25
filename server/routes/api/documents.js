var express = require('express');
const Document = require('../models/document');
const sequenceGenerator = require('./sequenceGenerator');

var router = express.Router();

router.get('/', async (req, res, next) => {
    var documentArray = new Array();
    try {
    let documents = await Document.find();
    // clean this up before sending it back to the client!
    for (document of documents) {
        let id = document.id; 
        let name = document.name; 
        let description = document.description; 
        let url = document.url;
        let children = document.children; 
        documentArray.push({id, name, url, description, children});
    }
    return res.status(200).json({
        message: 'fetched Documents.',
        documents: documentArray
        }); 
    } catch (error) {
        console.error('Error fetching documents:', error);
        res.status(500).json({
            error: error
        });
    }    
});

router.post("/:id", async (req, res, next) => { 
    try {
        const maxDocumentId = await sequenceGenerator.nextId("documents");
        const document = new Document({
            id: maxDocumentId,
            name: req.body.name,
            description: req.body.description,
            url: req.body.url
        });
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