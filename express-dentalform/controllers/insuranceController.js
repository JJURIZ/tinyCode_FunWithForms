let Insurance = require('../models/insurance');
let Patient = require('../models/patient');

const async = require('async');
const validator = require('express-validator');
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

//Handle Patient create on POST.
exports.insurance_create_post = [
    //Vaidate that the required fields are not empty
    validator.body('ins_co_name', 'Insurance Company name required').trim().isLength({ min: 1 }),
    validator.body('ins_co_address1', 'Insurance Company address line 1 is required').trim().isLength({ min: 1 }),
    validator.body('ins_co_address2').trim(),
    validator.body('ins_co_city', 'Insurance Company city is required').trim().isLength({ min: 1 }),
    validator.body('ins_co_state', 'Insurance Company state is required').trim().isLength({ min: 2 }),
    validator.body('ins_co_zip', 'Insurance Company zip code is required').trim().isLength({ min: 5, max: 5 }),

    //Sanitize (escape) required fields.
    validator.sanitizeBody('ins_co_name').escape(),
    validator.sanitizeBody('ins_co_address1').escape(),
    validator.sanitizeBody('ins_co_address2').escape(),
    validator.sanitizeBody('ins_co_city').escape(),
    validator.sanitizeBody('ins_co_state').escape(),
    validator.sanitizeBody('ins_co_zip').escape(),

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

//Display Patient delete on GET.
exports.insurance_delete_get = function(req, res) {
    res.send('NOT IMPLEMENTED: Insurance delete GET');
};

//Handle Patient delete on POST.
exports.insurance_delete_post = function(req, res) {
    res.send('NOT IMPLEMENTED: Insurance delete POST');
};

//Display Patient update form on GET.
exports.insurance_update_get = function(req, res) {
    res.send('NOT IMPLEMENTED:Insurance update GET');
};

//Handle Patient update on POST.
exports.insurance_update_post = function(req, res) {
    res.send('NOT IMPLEMENTED: Insurance update POST');
};