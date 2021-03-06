var mongoose = require('mongoose');
let moment = require('moment');

var Schema = mongoose.Schema;

let PatientSchema = new Schema({
    pat_firstName: { type: String, required: false, max: 70 },
    pat_lastName: { type: String, required: false, max: 70 },
    pat_middleName: { type: String, required: false, max: 70 },
    pat_address1: { type: String, required: false, maxlength: 150 },
    pat_address2: { type: String, required: false, maxlength: 150 },
    pat_city: { type: String, required: false, maxlength: 70 },
    pat_state: { type: String, required: false, maxlength: 40 },
    pat_zip: { type: String, required: false, maxlength: 5 },
    pat_email: { type: String, required: false, maxlength: 155 },
    pat_phone_home: { type: String, required: false, maxlength: 15 },
    pat_phone_work: { type: String, required: false, maxlength: 15 },
    pat_phone_cell: { type: String, required: false, maxlength: 15 },
    pat_gender: { type: String, required: false, maxlength: 7 },
    pat_marital_status: { type: String, required: false, maxlength: 8 },
    pat_birthDate: { type: Date, required: false, maxlength: 100 },
    pat_age: { type: String, required: false, maxlength: 3 },
    pat_ssn: { type: String, required: false, maxlength: 9 },
    pat_referred_by: { type: String, required: false, maxlength: 150 },
    emergency_firstName: { type: String, required: false, maxlength: 70 },
    emergency_lastName: { type: String, required: false, maxlength: 70 },
    emergency_phone_cell: { type: Number, required: false, maxlength: 10 },
    insured_firstName: { type: String, required: false, maxlength: 70 },
    insured_lastName: { type: String, required: false, maxlength: 70 },
    insured_ssn: { type: Number, required: false, maxlength: 9 },
    insured_birthDate: { type: Date, required: false, maxlength: 12 },
    pat_insured_rel: { type: String, required: false, maxlength: 155 },
    insurance: { type: Schema.Types.ObjectId, ref: 'Insurance' },
    employer: { type: Schema.Types.ObjectId, ref: 'Employer' },
});

//Virtual for patient's full name
PatientSchema
    .virtual('patientName')
    .get(function() {
        let fullname = '';
        if (this.pat_firstName && this.pat_lastName) {
            fullname = this.pat_lastName + ', ' + this.pat_firstName
        }
        if (!this.pat_firstName || !this.pat_lastName) {
            fullname = '';
        }
        return fullname;
    })

//Virtual for patient's URL
PatientSchema
    .virtual('url')
    .get(function() {
        return '/catalog/patient/' + this._id;
    });

PatientSchema
    .virtual('pat_birthDate_formatted')
    .get(function() {
        return moment(this.pat_birthDate).format('MMMM Do, YYYY');
    });

//Export model
module.exports = mongoose.model('Patient', PatientSchema);