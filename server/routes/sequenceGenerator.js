var Sequence = require('../models/sequence');

var maxDocumentId;
var maxMessageId;
var maxContactId;
var sequenceId = null;
// this crashes, but isn't needed anyway. maxDocumentId, maxMessageId and MaxContactId are all handled 
// nicely from Angular. There should be no need to bother the backend about them.
const sequenceGenerator = {   //First, I restructured sequenceGenerator to be a variable containing the various methods.
  async init() {    //Make this init() function asynchronous
       try {
            const sequence = await Sequence.findOne({}).exec();   //"exec()" here has to do with Mongoose and async functions. Not sure if it's entirely necessary, but it works with it in there. 
            if (!sequence) {
                  throw new Error('Sequence not found');
            }
            this.sequenceId = sequence._id;
            this.maxDocumentId = sequence.maxDocumentId;
            this.maxMessageId = sequence.maxMessageId;
            this.maxContactId = sequence.maxContactId;
       } catch (err) {
            console.error('Error initializing SequenceGenerator:', err);
            throw err;
       }
  },

  async nextId(collectionType) {
    var updateObject = {};
    var nextId;
     // Ensure the generator is initialized. If not, call the init() function above. 
     if (!this.sequenceId) {
          await this.init();
     } // This function continues
     switch (collectionType) {
      case 'documents':
        maxDocumentId++;
        updateObject = {maxDocumentId: maxDocumentId};
        nextId = maxDocumentId;
        break;
      case 'messages':
        maxMessageId++;
        updateObject = {maxMessageId: maxMessageId};
        nextId = maxMessageId;
        break;
      case 'contacts':
        maxContactId++;
        updateObject = {maxContactId: maxContactId};
        nextId = maxContactId;
        break;
      default:
        return -1;
     }
     Sequence.update({_id: sequenceId}, {$set: updateObject},
      function(err) {
        if (err) {
          console.log("nextId error = " + err);
          return null
        }
      });
  
    return nextId;
  }
}    //Close out the sequenceGenerator object.