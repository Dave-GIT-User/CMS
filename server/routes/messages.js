var express = require('express');
var router = express.Router();
const Message = require('../models/message');

router.get('/', async (req, res, next) => {
    Message.find()
      .populate('sender') // seems like a good idea
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

module.exports = router; 