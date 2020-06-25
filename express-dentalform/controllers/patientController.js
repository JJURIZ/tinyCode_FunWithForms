let Patient = require('../models/patient');
let Insurance = require('../models/insurance');
let Employer = require('../models/employer');

let async = require('async');
const insurance = require('../models/insurance');

exports.index = function(req, res) {

    async.parallel({
        patient_count: function(callback) {
            Patient.countDocuments({}, callback)
        },
        insurance_count: function(callback) {
            Insurance.countDocuments({}, callback);
        },
        employer_count: function(callback) {
            Employer.countDocuments({}, callback);
        },
        function(err, results) {
            res.render('index', { title: 'Patient Intake Form Home', error: err, data: results })
        }
    });
};

//Display list of all patients.
exports.patient_list = function(req, res) {
    res.send('NOT IMPLEMENTED: Patient List');
};

//Display detail page for a specific Patient. 
exports.patient_detail = function(req, res) {
    res.send('NOT IMPLEMENTED: Patient Details');
};

//Display Patient create for on GET. 
exports.patient_create_get = function(req, res) {
    res.send('NOT IMPLEMENTED: Patient create GET');
};

//Handle Patient create on POST.
exports.patient_create_post = function(req, res) {
    res.send('NOT IMPLEMENTED: Patient create POST');
};

//Display Patient delete on GET.
exports.patient_delete_get = function(req, res) {
    res.send('NOT IMPLEMENTED: Patient delete GET');
};

//Handle Patient delete on POST.
exports.patient_delete_post = function(req, res) {
    res.send('NOT IMPLEMENTED: Patient delete POST');
};

//Display Patient update form on GET.
exports.patient_update_get = function(req, res) {
    res.send('NOT IMPLEMENTED: Patient update GET');
};

//Handle Patient update on POST.
exports.patient_update_post = function(req, res) {
    res.send('NOT IMPLEMENTED: Patient update POST');
};