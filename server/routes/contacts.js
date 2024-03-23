var express = require('express');
const Contact = require('../models/contact');
const sequenceGenerator = require('./sequenceGenerator');

var router = express.Router();

router.get('/', (req, res, next) => {
    var contactArray = new Array;
    Contact.find()
      .populate('group')
      .then(contacts => {
        // this is so new messages can set the sender foreign key.
        owner = contacts[0]._id;
        // clean this up before sending it back to the client!
        for (contact of contacts) {
            let id = contact.id; 
            let name = contact.name; 
            let email = contact.email; 
            let phone = contact.phone; 
            let imageUrl = contact.imageUrl; 
            let group = contact.group;
            contactArray.push({id, name, email, phone, imageUrl, group});
        }
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

router.post("/:id", async (req, res, next) => { 
    try {
        const maxContactId = await sequenceGenerator.nextId("contacts");
        const contact = new Contact({
        id: maxContactId,
        name: req.body.name,
        email: req.body.email,
        phone: req.body.phone,
        imageUrl: req.body.imageUrl
        });
        console.log(contact);
        contact
            .save()
            .then((createdContact) => {
                return res.status(201).json({
                    message: "Contact added successfully.",
                    contact: createdContact,
                });
            })

    } catch (error) {
        return res.status(500).json({
            message: "An error occurred saving the contact.",
            error: error,
        });
    }
});

/*
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
*/
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