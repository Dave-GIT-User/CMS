
const Sequence = require('../models/sequence');

// This is basically Aaron Picker's work (BYUI WDD430 Discussion Forum)
// My adjustment is to make to make it void and store the result
// in the variable ticket in the model.
// ticket is set to null at the start, and then changed upon completion.
// that way the caller can no they have a real result before they try to use it.
// DH 3/22/24
const sequenceGenerator = {
    sequenceId: null,
    maxDocumentId: 0,
    maxMessageId: 0,
    maxContactId: 0,
    async init() {
        try {
            //ticket = null;
            const sequence = await Sequence.findOne({}).exec();
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
        if (!this.sequenceId) {
            await this.init();
        }

        let updateObject = {};
        let nextId;

        switch (collectionType.toLowerCase()) {
            case "documents":
                this.maxDocumentId++;
                updateObject = { maxDocumentId: this.maxDocumentId };
                nextId = this.maxDocumentId;
                console.log('sg2');
                break;
            case "messages":
                this.maxMessageId++;
                updateObject = { maxMessageId: this.maxMessageId };
                nextId = this.maxMessageId;
                break;
            case "contacts":
                // skip over formal groups like "Network/OS Team"
                this.maxContactId++;
                if (this.maxContacts == 100) {
                    this.maxContacts = 200;
                }
                updateObject = { maxContactId: this.maxContactId };
                nextId = this.maxContactId;
                break;
            default:
                throw new Error('Invalid collection type');
        }

        try {
            await Sequence.updateOne({ _id: this.sequenceId }, { $set: updateObject }).exec();
            //ticket = nextId;
            return nextId;
        } catch (err) {
            console.error('Error updating sequence for', collectionType, err);
            throw err;
        }
    },
};

module.exports = sequenceGenerator;

