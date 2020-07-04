let Employer = require('../models/employer');
let Patient = require('../models/patient');

const mongoose = require('mongoose');
let async = require('async');
const validator = require('express-validator');
const { body, validationResult } = require('express-validator/check');
const { sanitizeBody } = require('express-validator/filter');

//Display list of all employers.
exports.employer_list = function(req, res) {

    Employer.find()
        .populate('employer')
        .sort([
            ['employer_name', 'ascending']
        ])
        .exec(function(err, list_employers) {
            if (err) { return next(err); }
            res.render('employer_list', { title: 'Employers', employer_list: list_employers });
        });
};

//Display detail page for a specific Employer. 
exports.employer_detail = function(req, res, next) {
    async.parallel({
        employer: function(callback) {
            Employer.findById(req.params.id).exec(callback);
        },
        employer_patient: function(callback) {
            Patient.find({ 'employer': req.params.id }).exec(callback)
        },
    }, function(err, results) {
        if (err) { return next(err); }
        if (results.employer == null) {
            let err = new Error('Employer not found');
            err.status = 404;
            return next(err);
        }
        res.render('employer_detail', { title: 'Employer Detail', employer: results.employer, employers_patients: results.employer_patients });
    });
};

//Display Employer create for on GET. 
exports.employer_create_get = function(req, res, next) {
    res.render('employer_form', { title: 'Create Employer' });
};

//Handle Employer create on POST.
exports.employer_create_post = [

    //Validate that the name field is not empty.
    validator.body('employer_name', 'Employer Name is required').trim().isLength({ min: 1 }),

    //Sanitize (escape) the name field.
    validator.sanitizeBody('employer_name').escape(),

    //Process request after validation and sanitization.
    (req, res, next) => {

        //Extract the validation errors from a request.
        const errors = validator.validationResult(req);

        //Create an employer object with escaped and trimmed data.
        let employer = new Employer({
            employer_name: req.body.employer_name,
            employer_address1: req.body.employer_address1,
            employer_address2: req.body.employer_address2,
            employer_city: req.body.employer_city,
            employer_state: req.body.employer_state,
            employer_zip: req.body.employer_zip,
            employer_phone: req.body.employer_phone
        });

        if (!errors.isEmpty()) {
            //There are errors. Render the form again with sanitized values/error messages.
            res.render('employer_form', { title: 'Create Employer', employer: employer, errors: errors.array() });
            return;
        } else {
            //Data from form is valid.
            //Check if Employer with same name already exists.
            Employer.findOne({ 'employer_name': req.body.employer_name })
                .exec(function(err, found_employer) {
                    if (err) { return next(err); }

                    if (found_employer) {
                        //Employer exists, redirect to its details
                        res.redirect(found_employer.url);
                    } else {
                        employer.save(function(err) {
                            if (err) { return next(err); }
                            // Employer saved. Redirect to employer detail page.
                            res.redirect(employer.url);
                        });
                    }
                });
        }
    }
];

//Display Employer delete on GET.
exports.employer_delete_get = function(req, res, next) {

    async.parallel({
        employer: function(callback) {
            Employer.findById(req.params.id).exec(callback)
        },
        employer_patients: function(callback) {
            Patient.find({ 'employer': req.params.id }).exec(callback)
        },
    }, function(err, results) {
        if (err) { return next(err); }
        if (results.employer == null) {
            res.redirect('/catalog/employer');
        }
        res.render('employer_delete', { title: 'Delete Employer', employer: results.employer, employers_patients: results.employer_patients })
    });
};

//Handle Employer delete on POST.
exports.employer_delete_post = function(req, res, next) {

    async.parallel({
            employer: function(callback) {
                Employer.findById(req.body.employerid).exec(callback)
            },
            employer_patients: function(callback) {
                Patient.find({ 'employer': req.body.employerid }).exec(callback)
            },
        },
        function(err, results) {
            if (err) { return next(err); }
            // Sucess
            if (results.employers_patients.length > 0) {
                // Employer has patients.
                res.render('employer_delete', { title: 'Delete Employer', employer: results.employer, employers_patients: results.employer_patients })
            } else {
                Employer.findByIdAndRemove(req.body.employerid, function deleteEmployer(err) {
                    if (err) { return next(err); }
                    res.redirect('/catalog/employer');
                })
            }
        });
};

//Display Employer update form on GET.
exports.employer_update_get = function(req, res) {
    async.parallel({
        employer: function(callback) {
            Employer.findById(req.params.id).exec(callback);
        },
    }, function(err, results) {
        if (err) { return next(err); }
        if (results.employer == null) {
            let err = new Error('Employer not found');
            err.status = 404;
            return next(err)
        }
        res.render('employer_form', { title: 'Update Employer', employer: results.employer })
    });
};

//Handle Employer update on POST.
exports.employer_update_post = [

    //Vaidate that the required fields are not empty
    body('employer_name', 'Employer name required').trim().isLength({ min: 1 }),

    //Sanitize (escape) required fields.
    sanitizeBody('*').escape(),

    //Process request after validation and sanitization
    (req, res, next) => {
        const errors = validationResult(req);

        const employer = new Employer({
            employer_name: req.body.employer_name,
            employer_address1: req.body.employer_address1,
            employer_address2: req.body.employer_address2,
            employer_city: req.body.employer_city,
            employer_state: req.body.employer_state,
            employer_zip: req.body.employer_zip,
            employer_phone: req.body.employer_phone,
            _id: req.params.id
        });

        if (!errors.isEmpty()) {
            //There are errors

            async.parallel({
                employer: function(callback) {
                    Employer.find(callback);
                },
            }, function(err, results) {
                if (err) { return next(err); }

                res.render('employer_form', { title: 'Update Employer', employer: results.employer, errors: errors.array() })
            });
            return;
        } else {
            Employer.findByIdAndUpdate(req.params.id, employer, {}, function(err, theemployer) {
                if (err) { return next(err); }
                //Successful - redirect to insurance details
                res.redirect(theemployer.url);
            });
        }
    }
];