const mongoose = require('mongoose');
/*
  {
    _id: ObjectId('65f89c7b1fa842d59e8bf204'),
    maxDocumentId: 100,
    maxMessageId: 101,
    maxContactId: 100
  }
*/
const sequenceSchema = mongoose.Schema({
   maxDocumentId: { type: String, required: true },
   maxMessageId: { type: Number, required: true },
   maxContactId: { type: Number, required: true }
});
var ticket = null;

module.exports = mongoose.model('Sequence', sequenceSchema), ticket;
