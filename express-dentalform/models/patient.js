var mongoose = require('mongoose');
let moment = require('moment');

var Schema = mongoose.Schema;

let PatientSchema = new Schema({
    pat_firstName: { type: String, required: true, max: 70, trim: true },
    pat_lastName: { type: String, required: true, max: 70, trim: true },
    pat_middleName: { type: String, required: false, max: 70, trim: true },
    pat_address1: { type: String, required: true, maxlength: 150 },
    pat_address2: { type: String, required: false, maxlength: 150 },
    pat_city: { type: String, required: true, maxlength: 70 },
    pat_state: { type: String, required: true, maxlength: 40 },
    pat_zip: { type: String, required: true, maxlength: 5 },
    pat_email: { type: String, required: true, maxlength: 155 },
    pat_phone_home: { type: Number, required: false, maxlength: 10 },
    pat_phone_cell: { type: Number, required: false, maxlength: 10 },
    pat_phone_work: { type: Number, required: false, maxlength: 10 },
    pat_gender: { type: String, required: true, maxlength: 7 },
    pat_marital_status: { type: String, required: false, maxlength: 8 },
    pat_birthDate: { type: Date, required: true, maxlength: 10 },
    pat_age: { type: Number, required: false, maxlength: 3 },
    pat_ssn: { type: Number, required: false, maxlength: 9 },
    pat_referred_by: { type: String, required: false, maxlength: 150 },
    emergency_firstName: { type: String, required: false, maxlength: 70 },
    emergency_lastName: { type: String, required: false, maxlength: 70 },
    emergency_phone_cell: { type: Number, required: false, maxlength: 10 },
    insured_firstName: { type: String, required: false, maxlength: 70 },
    insured_lastName: { type: String, required: false, maxlength: 70 },
    insured_ssn: { type: Number, required: false, maxlength: 9 },
    insured_birthDate: { type: Date, required: false, maxlength: 10 },
    pat_insured_rel: { type: String, required: false, maxlength: 6 },
    insurance: { type: Schema.ObjectId, ref: 'Insurance' },
    employer: { type: Schema.ObjectId, ref: 'Employer' }
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