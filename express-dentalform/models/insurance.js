//Insurance = Book

var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var InsuranceSchema = new Schema({
    ins_co_name: { type: String, required: true, maxlength: 150 },
    ins_co_address1: { type: String, required: true, maxlength: 150 },
    ins_co_address2: { type: String, required: false, maxlength: 150 },
    ins_co_city: { type: String, required: true, maxlength: 70 },
    ins_co_state: { type: String, required: true, maxlength: 40 },
    ins_co_zip: { type: String, required: true, maxlength: 5 }
});

//Export model

module.exports = mongoose.model('Insurance', InsuranceSchema);