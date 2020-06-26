let Employer = require('../models/employer');

//Display list of all patients.
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

//Display detail page for a specific Patient. 
exports.employer_detail = function(req, res) {
    res.send('NOT IMPLEMENTED: Employer Details');
};

//Display Patient create for on GET. 
exports.employer_create_get = function(req, res) {
    res.send('NOT IMPLEMENTED: Employer create GET');
};

//Handle Patient create on POST.
exports.employer_create_post = function(req, res) {
    res.send('NOT IMPLEMENTED: Employer create POST');
};

//Display Patient delete on GET.
exports.employer_delete_get = function(req, res) {
    res.send('NOT IMPLEMENTED: Employer delete GET');
};

//Handle Patient delete on POST.
exports.employer_delete_post = function(req, res) {
    res.send('NOT IMPLEMENTED: Employer delete POST');
};

//Display Patient update form on GET.
exports.employer_update_get = function(req, res) {
    res.send('NOT IMPLEMENTED:Employer update GET');
};

//Handle Patient update on POST.
exports.employer_update_post = function(req, res) {
    res.send('NOT IMPLEMENTED: Employer update POST');
};