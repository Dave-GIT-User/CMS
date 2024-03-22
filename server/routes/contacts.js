var express = require('express');
const Contact = require('../models/contact');
var router = express.Router();

router.get('/', (req, res, next) => {
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
    Contact.find()
      .populate('group')
      .then(contacts => {
        owner = contacts[0]._id;
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
    const contact = new Contact({
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
/*
    id: { type: String, required: true },
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String },
    imageUrl: { type: String },
*/
// update a single contact
router.put('/:id', (req, res, next) => {
    Contact.findOne({ id: req.params.id })
        .then(contact => {
            contact.id = req.body.id;
            contact.name = req.body.name;
            contact.email = req.body.email;
            contact.phone = req.body.phone;
            contact.imageUrl = req.body.imageUrl;
  
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