let Insurance = require('../models/insurance');
let Patient = require('../models/patient');

const mongoose = require('mongoose');
const async = require('async');
const validator = require('express-validator');
const { body } = require('express-validator');
const { sanitizeBody } = require('express-validator/filter');

//Display list of all patients.
exports.insurance_list = function(req, res) {

    Insurance.find()
        .populate('insurance')
        .sort([
            ['ins_co_name', 'ascending']
        ])
        .exec(function(err, list_insurances) {
            if (err) { return next(err); }
            res.render('insurance_list', { title: 'Insurance Companies', insurance_list: list_insurances });
        });
};

//Display detail page for a specific Patient. 
exports.insurance_detail = function(req, res, next) {
        async.parallel({
            insurance: function(callback) {
                Insurance.findById(req.params.id)
                    .exec(callback);
            },
        }, function(err, results) {
            if (err) { return next(err); }
            if (results.insurance == null) {
                let err = new Error('Insurance not found');
                err.status = 404;
                return next(err);
            }
            res.render('insurance_detail', { title: 'Insurance Company Details', insurance: results.insurance });
        });
    },

    //Display Patient create for on GET. 
    exports.insurance_create_get = function(req, res, next) {
        res.render('insurance_form', { title: 'Create Insurance Company' })
    };

//Handle Insurance create on POST.
exports.insurance_create_post = [
    //Vaidate that the required fields are not empty
    validator.body('ins_co_name', 'Insurance Company name required').trim().isLength({ min: 1 }),

    //Sanitize (escape) required fields.
    validator.sanitizeBody('ins_co_name').escape(),

    //Process request after validation and sanitization
    (req, res, next) => {

        //Extract the validation errors from a request
        const errors = validator.validationResult(req);

        //Create an insurance company with escaped and trimmed data
        let insurance = new Insurance({
            ins_co_name: req.body.ins_co_name,
            ins_co_address1: req.body.ins_co_address1,
            ins_co_address2: req.body.ins_co_address2,
            ins_co_city: req.body.ins_co_city,
            ins_co_state: req.body.ins_co_state,
            ins_co_zip: req.body.ins_co_zip,
            ins_co_phone: req.body.ins_co_phone
        });

        if (!errors.isEmpty()) {
            //There are errors. Render the form again with sanitized values/error messages.
            res.render('insurance_form', { title: 'Create Insurance Company', insurance: insurance, errors: errors.array() });
            return;
        } else {
            //Data from form is valid
            //Check if Insurance with same name already exists.
            Insurance.findOne({ 'ins_co_name': req.body.ins_co_name })
                .exec(function(err, found_insurance) {
                    if (err) { return next(err); }

                    if (found_insurance) {
                        //Insurance company exists, redirect to its deteail page.
                        res.redirect(found_insurance.url);
                    } else {

                        insurance.save(function(err) {
                            if (err) { return next(err); }
                            //Insurance saved. Redirect to insurance detail page.
                            res.redirect(insurance.url);
                        });
                    }
                });
        }
    }
];

exports.insurance_delete_get = function(req, res, next) {

    async.parallel({
        insurance: function(callback) {
            Insurance.findById(req.params.id).exec(callback)
        },
        insurance_patients: function(callback) {
            Patient.find({ 'insurance': req.params.id }).exec(callback)
        },
    }, function(err, results) {
        if (err) { return next(err); }
        if (results.insurance == null) { // No results.
            res.redirect('/catalog/insurance');
        }
        // Successful, so render.
        res.render('insurance_delete', { title: 'Delete Insurance Company', insurance: results.insurance, insurances_patients: results.insurance_patients });
    });
};

// Handle Insurance delete on POST.
exports.insurance_delete_post = function(req, res, next) {

    async.parallel({
        insurance: function(callback) {
            Insurance.findById(req.body.insuranceid).exec(callback)
        },
        insurance_patients: function(callback) {
            Patient.find({ 'insurance': req.body.insuranceid }).exec(callback)
        },
    }, function(err, results) {
        if (err) { return next(err); }
        // Success
        if (results.insurances_patients.length > 0) {
            // Insurance has patients. Render in same way as for GET route.
            res.render('insurance_delete', { title: 'Delete Insurance Company', insurance: results.insurance, insurances_patients: results.insurance_patients });
            return;
        } else {
            // Author has no books. Delete object and redirect to the list of authors.
            Insurance.findByIdAndRemove(req.body.insuranceid, function deleteInsurance(err) {
                if (err) { return next(err); }
                // Success - go to insurance list
                res.redirect('/catalog/insurance')
            })
        }
    });
};

//Display Patient update form on GET.
exports.insurance_update_get = function(req, res, next) {

    async.parallel({
        insurance: function(callback) {
            Insurance.findById(req.params.id).exec(callback);
        },
    }, function(err, results) {
        if (err) { return next(err); }
        if (results.insurance == null) {
            let err = new Error('Insurance Company not found');
            err.status = 404;
            return next(err)
        }
        res.render('insurance_form', { title: 'Update Insurance Company', insurance: results.insurance })
    });
};

//Handle Patient update on POST.
exports.insurance_update_post = [

    //Vaidate that the required fields are not empty
    body('ins_co_name', 'Insurance Company name required').trim().isLength({ min: 1 }),

    //Sanitize (escape) required fields.
    sanitizeBody('*').escape(),

    //Process request after validation and sanitization
    (req, res, next) => {
        const errors = validationResults(req);

        const insurance = new Insurance({
            ins_co_name: req.body.ins_co_name,
            ins_co_address1: req.body.ins_co_address1,
            ins_co_address2: req.body.ins_co_address2,
            ins_co_city: req.body.ins_co_city,
            ins_co_state: req.body.ins_co_state,
            ins_co_zip: req.body.ins_co_zip,
            ins_co_phone: req.body.ins_co_phone,
            _id: req.params.id
        });

        if (!errors.isEmpty()) {
            //There are errors

            async.parallel({
                insurance: function(callback) {
                    Insurance.find(callback);
                },
            }, function(err, results) {
                if (err) { return next(err); }

                res.render('insurance_form', { title: 'Update Insurance Company', insurance: results.insurance, errors: errors.array() })
            });
            return;
        } else {
            Insurance.findByIdAndUpdate(req.params.id, insurance, {}, function(err, theinsurance) {
                if (err) { return next(err); }
                //Successful - redirect to insurance details
                res.redirect(theinsurance.url);
            });
        }
    }
];