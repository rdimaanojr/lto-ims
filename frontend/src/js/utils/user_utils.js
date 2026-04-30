// field validators and parsers of field values or whatever
// will be used to validate and generate randomizers to help data population

import { userApi } from "../api/user_api.js";

// Dummy Data Lists
const SERIES = ['A', 'B', 'C', 'D'];
const FIRST_NAMES = [
    'John', 'Jane', 'Michael', 'Sarah', 'David', 'Emily', 'Robert', 'Lisa', 'James',
    'Anna', "Juan", "Maria", "Jose", "Luis", "Carmen", "Pedro", "Rosa", "Carlos", "Isabel", "Miguel",
    'Sofia', 'Diego', 'Lucia', 'Jorge', 'Marta', 'Alberto', 'Elena', 'Andres', 'Laura', 'Fernando',
    'Brandon', 'Jessica', 'Kevin', 'Amanda', 'Steven', 'Melissa', 'Brian', 'Nicole', 'Eric', 'Heather',
]
const LAST_NAMES = [
    'Garcia', 'Miller', 'Rodriguez', 'Martinez', 'Cruz', 'dela Cruz', 'Reyes', 'Santos', 'Bautista', 'Gonzales', 'Lopez',
    'Wilson', 'Torres', 'Aquino', 'Ramos', 'Ramirez', 'Garcia', 'Fernandez', 'Mendoza', 'Navarro', 'Manalo', 'Gomez',
    'Castillo', 'Rivera', 'Sanchez', 'De Leon', 'Tolentino', ]
const MIDDLE_NAMES = [
    'Alexander', 'Marie', 'William', 'Rose', 'Joseph', 'Grace', 'Thomas', 'Elizabeth', 'Daniel', 'Catherine', 'John',
    ...LAST_NAMES
]
const LICENSE_TYPES = [
    'student',
    'non-professional',
    'professional'
];
const STREET_NAMES = [
    // Generate Purok 1 to 10
    ...Array.from({ length: 10 }, (_, i) => `Purok ${i + 1}`),

    // Generate Sitio + Last Names
    ...LAST_NAMES.map(name => `Sitio ${name}`),

    // Generate EVERY combination of Last Name + (Street, Avenue, Road, and Boulevard)
    ...LAST_NAMES.flatMap(name => [
        `${name} Street`,
        `${name} Avenue`,
        `${name} Road`,
        `${name} Boulevard`
    ])
];
const LICENSE_STATUSES = [
    'valid',
    'expired',
    'suspended',
    'revoked'
];
const VEHICLE_MODELS = [
    'Honda Civic',
    'Toyota Corolla',
    'Ford Focus',
    'BMW 3 Series',
    'Yamaha NMAX',
    'Suzuki Raider',
    'Mitsubishi L300',
    'Isuzu Elf',
    'Mercedes-Benz Sprinter',
    'Hyundai Starex'
]
const VEHICLE_MAKES = [
    'Audi',
    'Honda',
    'Toyota',
    'Ford',
    'BMW',
    'Yamaha',
    'Suzuki',
    'Mitsubishi',
    'Isuzu',
    'Mercedes-Benz',
    'Hyundai',
    'Bentley',
    'GMC',
    'Hyundai',
];
const VEHICLE_TYPES = [
    'motorbike',
    'tricycle',
    'automobile',
    'car',
    'light truck',
    'large truck',
    'bus',
    'bmw',
];
const COLORS = [
    'red',
    'orange',
    'yellow',
    'green',
    'blue',
    'violet',
    'white',
    'black',
];
const REGISTRATION_STATUSES = [
    'active',
    'expired',
    'suspended'
];
const VIOLATION_STATUSES = [
    'unpaid',
    'paid',
    'contested'
];
const VIOLATION_TYPES = [
    'Reckless Driving',
    'Driving Under the Influence',
    'Overspeeding',
    'Illegal Parking',
    'No License',
    'Expired License',
    'No Seatbelt',
    'Using Mobile Phone',
    'Disregarding Traffic Signs',
    'Overloading'
];
const ALL_LOCATIONS = [...cities, ...municipalities].map(loc => {
    const provinceName = (loc.provinceCode) ? provinces.find(p => p.code === loc.provinceCode)?.name : null;
    const regionName = regions.find(r => r.code === loc.regionCode)?.name;
    return `${loc.name}, ${provinceName ? provinceName : regionName}`;
});

import { barangays } from "./psgc/barangays.js";
import { cities } from "./psgc/cities.js";
import { municipalities } from "./psgc/municipalities.js";
import { provinces } from "./psgc/provinces.js";
import { regions } from "./psgc/regions.js";

// license_number
// 3-2-6 Format - XNN-NN-NNNNNN
//      X - series (let's just assume A, B, C, D)
//     NN - office district or something 
//     NN - year of issuance
// NNNNNN - unique serial
const generateLicenseNumber = (issueDate) => {
    const dateObj = issueDate ? new Date(issueDate) : new Date(generateIssueDate());
    const series = SERIES[Math.floor(Math.random() * SERIES.length)];
    const office = String(Math.floor(Math.random() * 99)).padStart(2, '0');
    const year = String(dateObj.getFullYear() % 100).padStart(2, '0');
    const serial = String(Math.floor(Math.random() * 100000)).padStart(6, '0');
    return `${series}${office}-${year}-${serial}`;
};

const generateExistingLicenseNumber = async () => {
    try {
        const response = await userApi.getLicenseNumbers();
        const list = response.data?.license_numbers || [];
        if (list.length === 0) return generate.generateLicenseNumber();
        return list[Math.floor(Math.random() * list.length)];
    } catch (err) {
        return generate.generateLicenseNumber();
    }
};

const validateLicenseNumber = (val) => {
    const regex = /^[A-Z]\d{2}-\d{2}-\d{6}$/;
    return regex.test(val);
};

// full_name
// LAST, FIRST MIDDLE
// middle is whole and optional
const generateFullName = () => {
    const last = LAST_NAMES[Math.floor(Math.random() * LAST_NAMES.length)];
    const first = FIRST_NAMES[Math.floor(Math.random() * FIRST_NAMES.length)];
    const middle = Math.random() > 0.5 ? MIDDLE_NAMES[Math.floor(Math.random() * MIDDLE_NAMES.length)] : '';
    return middle ? `${last}, ${first} ${middle}` : `${last}, ${first}`;
};
const validateFullName = (val) => {
    // Check format: LAST, FIRST or LAST, FIRST MIDDLE
    const regex = /^[A-Za-z\s]+,\s[A-Za-z\s]+(\s[A-Za-z\s]+)?$/;
    return regex.test(val);
};

// date_of_birth
// can be earlier than
// can parse to YYYY-MM-DD 
const generateDateOfBirth = () => {
    const today = new Date();
    const minAge = 18;
    const maxAge = 80;
    const age = Math.floor(Math.random() * (maxAge - minAge + 1)) + minAge;
    const birthYear = today.getFullYear() - age;
    const birthMonth = Math.floor(Math.random() * 12);
    const birthDay = Math.floor(Math.random() * 28) + 1;
    const dob = new Date(birthYear, birthMonth, birthDay);
    return dob.toISOString().split('T')[0];
};
const validateDateOfBirth = (val) => {
    return !isNaN(Date.parse(val));
};

// age
// just make sure it's correct with date_of_birth and valid age
const generateAge = () => {
    return Math.floor(Math.random() * 99) + 18;
};
const validateAge = (val, dob) => {
    if (typeof val !== 'number' || val < 0 || val > 120) return false;
    if (dob) {
        const birthDate = new Date(dob);
        const today = new Date();
        const calculatedAge = today.getFullYear() - birthDate.getFullYear();
        return Math.abs(val - calculatedAge) <= 1;
    }
    return true;
};

const generateSex = () => {
    return Math.random() > 0.5 ? 'M' : 'F';
};
const validateSex = (val) => {
    return val === 'M' || val === 'F';
};


// address : varchar 100
// generated with PSGC city data when available
const generateAddress = async () => {
    const houseNum = Math.floor(Math.random() * 999) + 1;
    const street = STREET_NAMES[Math.floor(Math.random() * STREET_NAMES.length)];
    const barangay = barangays[Math.floor(Math.random() * barangays.length)];
    const barangayName = barangay.name;
    const cityName = (barangay.cityCode) ? cities.find(c => c.code === barangay.cityCode)?.name : null;
    const municipalityName = (barangay.municipalityCode) ? municipalities.find(m => m.code === barangay.municipalityCode)?.name : null;
    const provinceName = (barangay.provinceCode) ? provinces.find(p => p.code === barangay.provinceCode)?.name : null;

    return `${houseNum} ${street}, ${barangayName}${cityName ? ', ' + cityName : ''}${municipalityName ? ', ' + municipalityName : ''}${provinceName ? ', ' + provinceName : ''}`;
};

const validateAddress = (val) => {
    return typeof val === 'string' && val.length <= 100 && val.trim().length > 0;
};

// license_type
// enum: student, non-professional, professional
const generateLicenseType = () => {
    return LICENSE_TYPES[Math.floor(Math.random() * LICENSE_TYPES.length)];
};
const validateLicenseType = (val) => {
    return LICENSE_TYPES.includes(val);
};


// 1 to 5 years
// license_status
// enum: valid, expired, suspended, revoked
const generateLicenseStatus = () => {
    return LICENSE_STATUSES[Math.floor(Math.random() * LICENSE_STATUSES.length)];
};
const validateLicenseStatus = (val) => {
    return LICENSE_STATUSES.includes(val);
};

// issue_date
// make sure this is also the same with the two-digit license number
const generateIssueDate = () => {
    const today = new Date();
    // upto 20 years in the past
    const offsetDays = Math.floor(Math.random() * 365 * 20);
    const date = new Date(today.getTime() - offsetDays * 24 * 60 * 60 * 1000);
    return date.toISOString().split('T')[0];
};
const validateIssueDate = (val) => {
    return !isNaN(Date.parse(val));
};


// expiry_date
// must be after issue_date
const generateExpiryDate = (issueDate) => {
    const dateObj = issueDate ? new Date(issueDate) : new Date(generateIssueDate());
    const yearsToAdd = Math.floor(Math.random() * 10) + 1;
    dateObj.setFullYear(dateObj.getFullYear() + yearsToAdd);
    return dateObj.toISOString().split('T')[0];
};
const validateExpiryDate = (val, issueDate) => {
    if (!isNaN(Date.parse(val)) && issueDate) {
        return new Date(val) > new Date(issueDate);
    }
    return !isNaN(Date.parse(val));
};

// vehicle_model
const generateVehicleModel = () => {
    return VEHICLE_MODELS[Math.floor(Math.random() * VEHICLE_MODELS.length)];
};
const validateVehicleModel = (val) => {
    return typeof val === 'string' && val.length > 0;
};


// vehicle make
const generateVehicleMake = () => {
    return VEHICLE_MAKES[Math.floor(Math.random() * VEHICLE_MAKES.length)];
};
const validateVehicleMake = (val) => {
    return typeof val === 'string' && val.length > 0;
};

// vehicle_type
// motorbike, tricylcles, cars, light trucks, large trucks, buses, etc.
const generateVehicleType = () => {
    return VEHICLE_TYPES[Math.floor(Math.random() * VEHICLE_TYPES.length)];
};
const validateVehicleType = (val) => {
    return VEHICLE_TYPES.includes(val);
};

// plate_number : three formats
// ABC 1234
// 123ABC
// A123BC
const generatePlateNumber = () => {
    const formats = [
        () => {
            const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
            const nums = '0123456789';
            let plate = '';
            for (let i = 0; i < 3; i++) plate += letters[Math.floor(Math.random() * letters.length)];
            plate += ' ';
            for (let i = 0; i < 4; i++) plate += nums[Math.floor(Math.random() * nums.length)];
            return plate;
        },
        () => {
            const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
            const nums = '0123456789';
            let plate = '';
            for (let i = 0; i < 3; i++) plate += nums[Math.floor(Math.random() * nums.length)];
            for (let i = 0; i < 3; i++) plate += letters[Math.floor(Math.random() * letters.length)];
            return plate;
        },
        () => {
            const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
            const nums = '0123456789';
            let plate = letters[Math.floor(Math.random() * letters.length)];
            for (let i = 0; i < 3; i++) plate += nums[Math.floor(Math.random() * nums.length)];
            for (let i = 0; i < 2; i++) plate += letters[Math.floor(Math.random() * letters.length)];
            return plate;
        }
    ];
    return formats[Math.floor(Math.random() * formats.length)]();
};

const generateExistingPlateNumber = async () => {
    try {
        const response = await userApi.getPlateNumbers();
        const list = response.data?.plate_numbers || [];
        if (list.length === 0) return generate.generatePlateNumber();
        return list[Math.floor(Math.random() * list.length)];
    } catch (err) {
        return generate.generatePlateNumber();
    }
};

const validatePlateNumber = (val) => {
    const regex1 = /^[A-Z]{3} \d{4}$/;
    const regex2 = /^\d{3}[A-Z]{3}$/;
    const regex3 = /^[A-Z]\d{3}[A-Z]{2}$/;
    return regex1.test(val) || regex2.test(val) || regex3.test(val);
};

// engine_number : varchar 17 (unique)
const generateEngineNumber = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let num = '';
    for (let i = 0; i < 17; i++) {
        num += chars[Math.floor(Math.random() * chars.length)];
    }
    return num;
};
const validateEngineNumber = (val) => {
    return typeof val === 'string' && val.length === 17 && /^[A-Z0-9]+$/.test(val);
};

// chassis_number: varchar 17 (unique)
const generateChassisNumber = () => {// Assuming it exists
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let num = '';
    for (let i = 0; i < 17; i++) {
        num += chars[Math.floor(Math.random() * chars.length)];
    }
    return num;
};
const validateChassisNumber = (val) => {
    return typeof val === 'string' && val.length === 17 && /^[A-Z0-9]+$/.test(val);
};

// model : must match to what the models
// model itself ideintifies the make and vehicle type
const generateModel = () => {
    return VEHICLE_MODELS[Math.floor(Math.random() * VEHICLE_MODELS.length)];
};
const validateModel = (val) => {
    return typeof val === 'string' && val.length > 0;
};

// year : valid year
const generateYear = () => {
    return Math.floor(Math.random() * (2024 - 1990 + 1)) + 1990;
};
const validateYear = (val) => {
    return Number.isInteger(val) && val >= 1900 && val <= 2030;
};

// color :
// let's just have simple colors
const generateColor = () => {
    return COLORS[Math.floor(Math.random() * COLORS.length)];
};
const validateColor = (val) => {
    return typeof val === 'string' && val.length > 0;
};

// registration_number : int auto increment if not specified
const generateRegistrationNumber = () => {
    return Math.floor(Math.random() * 10000000);
};
const validateRegistrationNumber = (val) => {
    return Number.isInteger(val);
};

// registration_date : just valid date
const generateRegistrationDate = () => {
    const today = new Date();
    // upto (-15, -5) years in the past
    const offsetDays = Math.floor(Math.random() * 365 * 10) - (365 * 15);
    const regDate = new Date(today.getTime() + offsetDays * 24 * 60 * 60 * 1000);
    return regDate.toISOString().split('T')[0];
};
const validateRegistrationDate = (val) => {
    return !isNaN(Date.parse(val));
};

// registration_staus
// enum : active, expired, suspended
const generateRegistrationStatus = () => {
    return REGISTRATION_STATUSES[Math.floor(Math.random() * REGISTRATION_STATUSES.length)];
};
const validateRegistrationStatus = (val) => {
    return REGISTRATION_STATUSES.includes(val);
};

// expiration_date : just valid date
const generateExpirationDate = () => {
    const today = new Date();
    const offsetDays = Math.floor(Math.random() * 365 * 10) - (365 * 5);
    const expDate = new Date(today.getTime() + offsetDays * 24 * 60 * 60 * 1000);
    return expDate.toISOString().split('T')[0];
};
const validateExpirationDate = (val) => {
    return !isNaN(Date.parse(val));
};

// plate_number must exist already 
const generateExistingPlate = () => {
    return generatePlateNumber();
};
const validateExistingPlate = (val, db) => {
    return validatePlateNumber(val);
};

// violation_id : int
const generateViolationId = () => {
    return Math.floor(Math.random() * 10000000);
};
const validateViolationId = (val) => {
    return Number.isInteger(val);
};

// violation_type : varchar
// reckless driving, dui, overspeeding, etc..
const generateViolationType = () => {
    return VIOLATION_TYPES[Math.floor(Math.random() * VIOLATION_TYPES.length)];
};
const validateViolationType = (val) => {
    return typeof val === 'string' && val.length > 0;
};

// location : varchar
// using PSGC api for city and/or region
const generateLocation = async () => {
    return ALL_LOCATIONS[Math.floor(Math.random() * ALL_LOCATIONS.length)];
};

const validateLocation = (val) => {
    return typeof val === 'string' && val.length > 0;
};

// apprehending_officer : varchar
// LAST, FIRST
const generateApprehendingOfficer = () => {
    const last = LAST_NAMES[Math.floor(Math.random() * LAST_NAMES.length)];
    const first = FIRST_NAMES[Math.floor(Math.random() * FIRST_NAMES.length)];
    return `${last}, ${first}`;
};
const validateApprehendingOfficer = (val) => {
    const regex = /^[A-Za-z\s]+,\s[A-Za-z\s]+$/;
    return regex.test(val);
};

// violation_status : enum
// unpaid, paid, contested
const generateViolationStatus = () => {
    return VIOLATION_STATUSES[Math.floor(Math.random() * VIOLATION_STATUSES.length)];
};
const validateViolationStatus = (val) => {
    return VIOLATION_STATUSES.includes(val);
};

// fine amount : decimal two digits
const generateFineAmount = () => {
    return Math.floor(Math.random() * 100000).toFixed(2);
};
const validateFineAmount = (val) => {
    return typeof val === 'number' && val >= 0;
};

// license_number and plate_number must exist oor something
const generateVerification = () => {
    return true;
};
const validateVerification = (lic, plate, db) => {
    return validateLicenseNumber(lic) && validatePlateNumber(plate);
};

export const generate = {
    generateLicenseNumber, generateExistingLicenseNumber,
    generateFullName,
    generateDateOfBirth,
    generateAge,
    generateSex,
    generateAddress,
    generateLicenseType,
    generateLicenseStatus,
    generateIssueDate,
    generateExpiryDate,
    generateVehicleModel,
    generateVehicleMake,
    generateVehicleType,
    generatePlateNumber,
    generateExistingPlateNumber,
    generateEngineNumber,
    generateChassisNumber,
    generateModel,
    generateYear,
    generateColor,
    generateRegistrationNumber,
    generateRegistrationDate,
    generateRegistrationStatus,
    generateExpirationDate,
    generateExistingPlate,
    generateViolationId,
    generateViolationType,
    generateLocation,
    generateApprehendingOfficer,
    generateViolationStatus,
    generateFineAmount,
    generateVerification
};

export const validate = {
    validateLicenseNumber,
    validateFullName,
    validateDateOfBirth,
    validateAge,
    validateSex,
    validateAddress,
    validateLicenseType,
    validateLicenseStatus,
    validateIssueDate,
    validateExpiryDate,
    validateVehicleModel,
    validateVehicleMake,
    validateVehicleType,
    validatePlateNumber,
    validateEngineNumber,
    validateChassisNumber,
    validateModel,
    validateYear,
    validateColor,
    validateRegistrationNumber,
    validateRegistrationDate,
    validateRegistrationStatus,
    validateExpirationDate,
    validateExistingPlate,
    validateViolationId,
    validateViolationType,
    validateLocation,
    validateApprehendingOfficer,
    validateViolationStatus,
    validateFineAmount,
    validateVerification
};