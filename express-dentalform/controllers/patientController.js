let Patient = require('../models/patient');
let Insurance = require('../models/insurance');
let Employer = require('../models/employer');

let async = require('async');
let mongoose = require('mongoose');
const { body, validationResult } = require('express-validator/check');
const { sanitizeBody } = require('express-validator/filter');
const patient = require('../models/patient');

exports.index = function(req, res) {
    async.parallel({
            patient_count: function(callback) {
                Patient.countDocuments({}, callback);
            },
            insurance_count: function(callback) {
                Insurance.countDocuments({}, callback);
            },
            employer_count: function(callback) {
                Employer.countDocuments({}, callback);
            },
        },
        function(err, results) {
            res.render('index', { title: 'Patient Intake Form Home', error: err, data: results })
        });
};

//Display list of all patients.
exports.patient_list = function(req, res, next) {

    Patient.find({}, 'pat_lastName pat_firstName pat_birthDate pat_city')
        .populate('patient').exec(function(err, list_patients) {
            if (err) { return next(err) } else {
                //Successful, so render
                res.render('patient_list', { title: 'Patient List', patient_list: list_patients });
            }
        });
};


//Display detail page for a specific Patient. 
exports.patient_detail = function(req, res, next) {
    let id = mongoose.Types.ObjectId(req.params.id);
    async.parallel({
        patient: function(callback) {

            Patient.findById(id)
                .populate('patient')
                .populate('insurance')
                .populate('employer')
                .exec(callback);
        },
    }, function(err, results) {
        if (err) { return next(err); }
        if (results.patient == null) {
            let err = new Error('Patient not found');
            err.status = 404;
            return next(err);
        }
        res.render('patient_detail', { title: 'Patient Details', patient: results.patient });
    });
};

//Display Patient create for on GET. 
exports.patient_create_get = function(req, res, next) {
    async.parallel({
        insurances: function(callback) {
            Insurance.find(callback);
        },
        employers: function(callback) {
            Employer.find(callback);
        },
    }, function(err, results) {
        if (err) { return next(err); }
        res.render('patient_form', { title: 'Create Patient', insurances: results.insurances, employers: results.employers });
    });
};

//Handle Patient create on POST.
exports.patient_create_post = [
    //Validate fields
    body('pat_firstName', 'First name required').trim().isLength({ min: 1 }),
    body('pat_lastName', 'Last name required').trim().isLength({ min: 1 }),
    body('pat_email').trim().isLength({ min: 1 }),
    body('pat_phone_home').trim().isLength({ min: 10 }),
    body('pat_phone_cell').trim().isLength({ max: 10 }),

    //Sanitize all fields

    sanitizeBody('*').escape(),

    //Process request after validation and sanitization
    (req, res, next) => {

        //Extract the validation errors from request.
        const errors = validationResult(req);

        //Create a Patient object with escaped and trimmed data
        const patient = new Patient({
            pat_firstName: req.body.pat_firstName,
            pat_lastName: req.body.pat_lastName,
            pat_address1: req.body.pat_address1,
            pat_address2: req.body.pat_address2,
            pat_city: req.body.pat_city,
            pat_state: req.body.pat_state,
            pat_zip: req.body.pat_zip,
            pat_phone_home: req.body.pat_phone_home,
            pat_phone_cell: req.body.pat_phone_cell,
            pat_phone_work: req.body.pat_phone_work,
            pat_email: req.body.pat_email,
            pat_gender: req.body.pat_gender,
            pat_birthDate: req.body.pat_birthDate,
            pat_ssn: req.body.pat_ssn,
            pat_referred_by: req.body.pat_referred_by,
            emergency_firstName: req.body.emergency_firstName,
            emergency_lastName: req.body.emergency_lastName,
            emergency_phone_cell: req.body.emergency_phone_cell,
            insurance: req.body.insurance,
            employer: req.body.employer
        });

        if (!errors.isEmpty()) {
            //There are errors.Render form again with sanitized values/error messages.

            //Get all insurance and employers for form.
            async.parallel({
                insurances: function(callback) {
                    Insurance.find(callback);
                },
                employers: function(callback) {
                    Employer.find(callback);
                },
            }, function(err, results) {
                if (err) { return next(err); }
                res.render('patient_form', { title: 'Create New Patient', insurances: results.insurances, employers: results.employers, patient: patient, errors: errors.array() });
            });
            return;
        } else {
            //Data from form is invalid. Save Patient
            patient.save(function(err) {
                if (err) { return next(err); }
                //successful - redirect to new patient record.
                res.redirect(patient.url);
            });
        }
    }
];

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