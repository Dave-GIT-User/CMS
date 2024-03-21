const mongoose = require('mongoose');

const documentSchema = mongoose.Schema({
   //_id:{ type: mongoose.Schema.Types.ObjectId, required: true},
   id: { type: String, required: true },
   name: { type: String, required: true },
   description: { type: String },
   url: { type: String, required: true },
   children: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Document' }]
});

module.exports = mongoose.model('Document', documentSchema);
