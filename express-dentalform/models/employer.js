var mongoose = require('mongoose');

var Schema = mongoose.Schema;

let EmployerSchema = new Schema({
    employer_name: { type: String, required: false, maxlength: 255 },
    employer_address1: { type: String, required: false, maxlength: 150 },
    employer_address2: { type: String, required: false, maxlength: 150 },
    employer_city: { type: String, required: false, maxlength: 70 },
    employer_state: { type: String, required: false, maxlength: 40 },
    employer_zip: { type: String, required: false, maxlength: 5 },
    employer_phone: { type: String, required: false, minlength: 10 }
});


//Virtual for employer's URL
EmployerSchema
    .virtual('url')
    .get(function() {
        return '/catalog/employer/' + this._id;
    });

//Export model

module.exports = mongoose.model('Employer', EmployerSchema);