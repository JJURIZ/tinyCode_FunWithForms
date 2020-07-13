var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var InsuranceSchema = new Schema({
    ins_co_name: { type: String, required: false, maxlength: 150 },
    ins_co_address1: { type: String, required: false, maxlength: 150 },
    ins_co_address2: { type: String, required: false, maxlength: 150 },
    ins_co_city: { type: String, required: false, maxlength: 70 },
    ins_co_state: { type: String, required: false, maxlength: 40 },
    ins_co_zip: { type: String, required: false, maxlength: 5 },
    ins_co_phone: { type: String, required: false, minlength: 10 }
});


//Virtual for insurance's URL
InsuranceSchema
    .virtual('url')
    .get(function() {
        return '/catalog/insurance/' + this._id;
    });

//Export model

module.exports = mongoose.model('Insurance', InsuranceSchema);