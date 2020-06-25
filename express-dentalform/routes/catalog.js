var express = require('express');
var router = express.Router();

//Require controller modules.
var patient_controller = require('../controllers/patientController');
var insurance_controller = require('../controllers/insuranceController');
var employer_controller = require('../controllers/employerController');

// PATIENT ROUTES //

// GET Patient list.
router.get('/', patient_controller.index);

//GET request for creating a Patient. NOTE THis must come before routes that display Patients (uses id).
router.get('/patient/create', patient_controller.patient_create_get);

//POST request for creating Patient
router.post('/patient/create', patient_controller.patient_create_post);

//GET request to delete a Patient
router.get('/patient/:id/delete', patient_controller.patient_delete_get);

//POST request to delete Patient
router.post('/patient/:id/delete', patient_controller.patient_delete_post);

//GET request to update a Patient
router.get('/patient/:id/update', patient_controller.patient_update_get);

//POST request to update a Patient
router.get('/patient/:id/update', patient_controller.patient_update_post);

//GET request for one Patient
router.get('/patient/:id/', patient_controller.patient_detail);

//GET request for list of all Patients
router.get('/patient', patient_controller.patient_list);


// INSURANCE ROUTES //

// GET Insurance list.
router.get('/', patient_controller.index);

//GET request for creating a Insurance. NOTE This must come before routes that display Insurance (uses id).
router.get('/insurance/create', insurance_controller.insurance_create_get);

//POST request for creating Insurance
router.post('/insurance/create', insurance_controller.insurance_create_post);

//GET request to delete a Insurance
router.get('/insurance/:id/delete', insurance_controller.insurance_delete_get);

//POST request to delete Insurance
router.post('/insurance/:id/delete', insurance_controller.insurance_delete_post);

//GET request to update a Insurance
router.get('/insurance/:id/update', insurance_controller.insurance_update_get);

//POST request to update a Insurance
router.get('/insurance/:id/update', insurance_controller.insurance_update_post);

//GET request for one Insurance
router.get('/insurance/:id/', insurance_controller.insurance_detail);

//GET request for list of all Insurances
router.get('/insurance', insurance_controller.insurance_list);


// EMPLOYER ROUTES //

// GET Employer list.
//router.get('/', employer_controller.index);

//GET request for creating a Employer. NOTE This must come before routes that display Patients (uses id).
router.get('/employer/create', employer_controller.employer_create_get);

//POST request for creating Employer
router.post('/employer/create', employer_controller.employer_create_post);

//GET request to delete a Employer
router.get('/employer/:id/delete', employer_controller.employer_delete_get);

//POST request to delete Employer
router.post('/employer/:id/delete', employer_controller.employer_delete_post);

//GET request to update a Employer
router.get('/employer/:id/update', employer_controller.employer_update_get);

//POST request to update a Employer
router.get('/employer/:id/update', employer_controller.employer_update_post);

//GET request for one Employer
router.get('/employer/:id/', employer_controller.employer_detail);

//GET request for list of all Employer
router.get('/employer', employer_controller.employer_list);

module.exports = router;