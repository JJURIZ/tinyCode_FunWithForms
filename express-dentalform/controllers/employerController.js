let Employer = require('../models/employer');
let Patient = require('../models/patient');

let async = require('async');
const validator = require('express-validator');

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
            Employer.findById(req.params.id)
                .exec(callback);
        },
    }, function(err, results) {
        if (err) { return next(err); }
        if (results.employer == null) {
            let err = new Error('Employer not found');
            err.status = 404;
            return next(err);
        }
        res.render('employer_detail', { title: 'Employer Detail', employer: results.employer });
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
exports.employer_delete_get = function(req, res) {
    res.send('NOT IMPLEMENTED: Employer delete GET');
};

//Handle Employer delete on POST.
exports.employer_delete_post = function(req, res) {
    res.send('NOT IMPLEMENTED: Employer delete POST');
};

//Display Employer update form on GET.
exports.employer_update_get = function(req, res) {
    res.send('NOT IMPLEMENTED:Employer update GET');
};

//Handle Employer update on POST.
exports.employer_update_post = function(req, res) {
    res.send('NOT IMPLEMENTED: Employer update POST');
};