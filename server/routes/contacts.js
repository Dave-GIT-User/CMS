var express = require('express');
const Contact = require('../models/contact');
var router = express.Router();

router.get('/', (req, res, next) => {
    Contact.find()
      .populate('group')
      .then(contacts => {
        res.status(200).json({
            message: 'Contacts fetched successfully!',
            contacts: contacts
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
    // why do we need this? Angular already computes the new id.
    // On the other hand, if it is needed, it must be debugged. 
    //const maxContactId = sequenceGenerator.nextId("contact");
    //console.log('maxcontactId: '+maxcontactId);
    const contact = new contact({
        id: req.body.id,
        name: req.body.name,
        email: req.body.email,
        phone: req.body.phone,
        imageUrl: req.body.imageUrl
    });
  
    contact.save()
        .then(createdContact => {
            res.status(201).json({
                message: 'Contact added successfully',
                contact: createdContact
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
  Contact.findOne({ id: req.params.id })
      .then(contact => {
          contact.deleteOne({ id: req.params.id })
          .then(result => {
              res.status(204).json({
              message: "Contact deleted successfully"
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
              message: 'contact not found.',
              error: { contact: 'contact not found'}
      });
  });
});

// update a single contact
router.put('/:id', (req, res, next) => {
    Contact.findOne({ id: req.params.id })
        .then(contact => {
            contact.name = req.body.name;
            contact.description = req.body.description;
            contact.url = req.body.url;
  
            contact.updateOne({ id: req.params.id }, contact)
                .then(result => {
                    res.status(204).json({
                    message: 'Contact updated successfully'
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
            message: 'Contact not found.',
            error: { contact: 'Contact not found'}
        });
    });
});

module.exports = router; 