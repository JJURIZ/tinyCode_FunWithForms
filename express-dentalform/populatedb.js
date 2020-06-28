#! /usr/bin/env node

console.log('This script populates some test books, authors, genres and bookinstances to your database. Specified database as argument - e.g.: populatedb mongodb+srv://cooluser:coolpassword@cluster0-mbdj7.mongodb.net/local_library?retryWrites=true');

// Get arguments passed on command line
var userArgs = process.argv.slice(2);
/*
if (!userArgs[0].startsWith('mongodb')) {
    console.log('ERROR: You need to specify a valid mongodb URL as the first argument');
    return
}
*/
var async = require('async')
var Insurance = require('./models/insurance')
var Patient = require('./models/patient')
var Employer = require('./models/employer')


var mongoose = require('mongoose');
const employer = require('./models/employer');
var mongoDB = userArgs[0];
mongoose.connect(mongoDB, { useNewUrlParser: true });
mongoose.Promise = global.Promise;
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

var patients = []
var insurances = []
var employers = []

function patientCreate(pat_firstName, pat_lastName, pat_birthDate, pat_gender, pat_email, pat_zip, pat_state, pat_city, pat_address1, insurance, employer, cb) {
    patientdetail = {
        pat_firstName: pat_firstName,
        pat_lastName: pat_lastName,
        pat_birthDate: pat_birthDate,
        pat_gender: pat_gender,
        pat_email: pat_email,
        pat_zip: pat_zip,
        pat_state: pat_state,
        pat_city: pat_city,
        pat_address1: pat_address1,
        insurance: insurance,
        employer: employer
    }
    var patient = new Patient(patientdetail);
    patient.save(function(err) {
        if (err) {
            cb(err, null)
            return
        }
        console.log('New Patient: ' + patient);
        patients.push(patient)
        cb(null, patient)
    });
}

function insuranceCreate(ins_co_name, ins_co_zip, ins_co_state, ins_co_city, ins_co_address1, cb) {
    insurancedetail = {
        ins_co_name: ins_co_name,
        ins_co_zip: ins_co_zip,
        ins_co_state: ins_co_state,
        ins_co_city: ins_co_city,
        ins_co_address1: ins_co_address1
    }
    var insurance = new Insurance(insurancedetail);
    insurance.save(function(err) {
        if (err) {
            cb(err, null);
            return;
        }
        console.log('New Insurance: ' + insurance);
        insurances.push(insurance)
        cb(null, insurance);
    });
}

function employerCreate(employer_name, employer_zip, employer_state, employer_city, employer_address1, cb) {
    employerdetail = {
        employer_name: employer_name,
        employer_zip: employer_zip,
        employer_state: employer_state,
        employer_city: employer_city,
        employer_address1: employer_address1,
    }

    var employer = new Employer(employerdetail);
    employer.save(function(err) {
        if (err) {
            cb(err, null)
            return
        }
        console.log('New Employer: ' + employer);
        employers.push(employer)
        cb(null, employer)
    });
}




function createInsurance(cb) {
    async.parallel([
            function(callback) {
                insuranceCreate('Aetna', 20022, 'AL', 'Birmingham', '32 Ins. Co Lane', callback);
            },
            function(callback) {
                insuranceCreate("BlueCross BlueShield of Georgia", 20032, 'AR', 'Rickenback', '35 Ins. Co Lane', callback);
            },
            function(callback) {
                insuranceCreate("Cigna", 20044, 'AL', 'Birmingham', '356 Ins. Co Lane', callback);
            },
            function(callback) {
                insuranceCreate("DentiCal", 10022, 'AL', 'Birmingham', '54 Ins. Co Lane', callback);
            },
        ],
        cb);
}


function createEmployers(cb) {
    async.parallel([
            function(callback) {
                employerCreate("Target", 12345, 'AZ', 'Tempe', '32 Rough Ln', callback)
            },
            function(callback) {
                employerCreate("Music & Video", 12347, 'AZ', 'Tempe', '36 Rough Ln', callback)
            },
            function(callback) {
                employerCreate("Wal-Mart", 22345, 'AZ', 'Tempe', '66 Rough Ln', callback)
            },
        ],
        // Optional callback
        cb);
}

function createPatients(cb) {
    async.series([
            function(callback) {
                patientCreate('Ben', 'Bova', '1932-11-8', 'Male', 'email@email1.com', 30033, 'CA', 'Los Angeles', '1 Hwy Ave', insurances[0], employers[0], callback);
            },
            function(callback) {
                patientCreate('Isaac', 'Asimov', '1920-01-02', 'Male', 'email@email2.com', 30032, 'CA', 'Los Angeles', '2 Hwy Ave', insurances[1], employers[1], callback);
            },
            function(callback) {
                patientCreate('Bob', 'Billings', '1960-01-02', 'Female', 'email@email3.com', 30031, 'CA', 'Oakland', '3 Hwy Ave', insurances[2], employers[2], callback);
            },
            function(callback) {
                patientCreate('Jim', 'Jones', '1971-12-16', 'Unknown', 'email@email4.com', 30034, 'AZ', 'Tempe', '4 Hwy Ave', insurances[0], employers[1], callback);
            },
            function(callback) {
                patientCreate('Jackie', 'Robeson', '1969-09-16', 'Female', 'email@email5.com', 30087, 'AZ', 'Tempe', '5 Hwy Ave', insurances[3], employers[2], callback);
            },
            function(callback) {
                patientCreate('Pheobe', 'Alexandria', '1980-01-16', 'Female', 'email@email6.com', 30077, 'AL', 'Birmingham', '6 Hwy Ave', insurances[2], employers[0], callback);
            }
        ],
        // optional callback
        cb);
}


async.series([
        createInsurance,
        createEmployers,
        createPatients
    ],
    // Optional callback
    function(err, results) {
        if (err) {
            console.log('FINAL ERR: ' + err);
        }
        // All done, disconnect from database
        mongoose.connection.close();
    });