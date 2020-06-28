let Insurance = require('../models/insurance');
let Patient = require('../models/patient');
let async = require('async');

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
    exports.insurance_create_get = function(req, res) {
        res.send('NOT IMPLEMENTED: Insurance create GET');
    };

//Handle Patient create on POST.
exports.insurance_create_post = function(req, res) {
    res.send('NOT IMPLEMENTED: Insurance create POST');
};

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