// field validators and parsers of field values or whatever
// will be used to validate and generate randomizers to help data population

// Dummy Data Lists
const SERIES = ['A', 'B', 'C', 'D'];
const FIRST_NAMES = [
    'John',
    'Jane',
    'Michael',
    'Sarah',
    'David',
    'Emily',
    'Robert',
    'Lisa',
    'James',
    'Anna'
]
const LAST_NAMES = [
    'Smith',
    'Johnson',
    'Williams',
    'Brown',
    'Jones',
    'Garcia',
    'Miller',
    'Davis',
    'Rodriguez',
    'Martinez'
]
const MIDDLE_NAMES = [
    'Alexander',
    'Marie',
    'William',
    'Rose',
    'Joseph',
    'Grace',
    'Thomas',
    'Elizabeth',
    'Daniel',
    'Catherine'
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
    'Honda',
    'Toyota',
    'Ford',
    'BMW',
    'Yamaha',
    'Suzuki',
    'Mitsubishi',
    'Isuzu',
    'Mercedes-Benz',
    'Hyundai'
];
const VEHICLE_TYPES = [
    'motorbike',
    'tricycle',
    'automobile',
    'car',
    'light truck',
    'large truck',
    'bus'
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

const PSGC_ENDPOINTS = {
    regions: 'https://psgc.cloud/api/regions',
    provinces: 'https://psgc.cloud/api/provinces',
    cities: 'https://psgc.cloud/api/cities',
    municipalities: 'https://psgc.cloud/api/municipalities',
    barangays: 'https://psgc.cloud/api/barangays'
};

const PSGC_DEFAULTS= {
    regions: [
        { code: '010000000', name: 'NCR' },
        { code: '020000000', name: 'CAR' },
        { code: '030000000', name: 'Region I' }
    ],
    provinces: [
        { code: '011300000', name: 'Metro Manila' },
        { code: '021800000', name: 'Benguet' },
        { code: '031800000', name: 'Ilocos Norte' }
    ],
    cities: [
        { code: '014600000', name: 'Manila', type: 'City', district: 'NCR', zip_code: '1000', regionName: 'Metro Manila' },
        { code: '040500000', name: 'Cebu City', type: 'City', district: 'Central Visayas', zip_code: '6000', regionName: 'Central Visayas' },
        { code: '012700000', name: 'Quezon City', type: 'City', district: 'NCR', zip_code: '1100', regionName: 'Metro Manila' }
    ],
    municipalities: [
        { code: '014671000', name: 'Pateros', type: 'Municipality', district: 'NCR', zip_code: '1600' },
        { code: '041200000', name: 'Liloan', type: 'Municipality', district: 'Central Visayas', zip_code: '6002' },
        { code: '037900000', name: 'Laoag', type: 'Municipality', district: 'Region I', zip_code: '2900' }
    ],
    barangays: [
        { code: '014600001', name: 'Barangay 1', status: 'active' },
        { code: '014600002', name: 'Barangay 2', status: 'active' },
        { code: '014600003', name: 'Barangay 3', status: 'active' }
    ]
};

const PSGC_CACHE = {
    regions: null,
    provinces: null,
    cities: null,
    municipalities: null,
    barangays: null
};

const fetchPSGC = async (endpoint) => {
    if (PSGC_CACHE[endpoint]) {
        return PSGC_CACHE[endpoint];
    }

    try {
        const response = await fetch(PSGC_ENDPOINTS[endpoint]);
        if (!response.ok) throw new Error(`PSGC ${endpoint} fetch failed`);
        const data = await response.json();
        PSGC_CACHE[endpoint] = data;
        return data;
    } catch (error) {
        PSGC_CACHE[endpoint] = PSGC_DEFAULTS[endpoint];
        return PSGC_DEFAULTS[endpoint];
    }
};

const fetchRegions = async () => await fetchPSGC('regions');
const fetchProvinces = async () => await fetchPSGC('provinces');
const fetchCities = async () => await fetchPSGC('cities');
const fetchMunicipalities = async () => await fetchPSGC('municipalities');
const fetchBarangays = async () => await fetchPSGC('barangays');

const getAllLocations = async () => {
    const cities = await fetchCities();
    if (Array.isArray(cities) && cities.length) {
        return cities.map((city) => {
            const region = city.regionName || city.region || 'Unknown Region';
            return `${city.name}, ${region}`;
        });
    }
    return PSGC_DEFAULTS.cities.map((city) => `${city.name}, ${city.regionName || city.region || 'Unknown Region'}`);
};

// license_number
// 3-2-6 Format - XNN-NN-NNNNNN
//      X - series (let's just assume A, B, C, D)
//     NN - office district or something 
//     NN - year of issuance
// NNNNNN - unique serial
const generateLicenseNumber = () => {
    const series = SERIES[Math.floor(Math.random() * SERIES.length)];
    const office = String(Math.floor(Math.random() * 90) + 10);
    const year = String(Math.floor(Math.random() * 90) + 10);
    const serial = String(Math.floor(Math.random() * 900000) + 100000);
    return `${series}${office}-${year}-${serial}`;
};
const validateLicenseNumber = (val) => {
    const regex = /^[A-Z]\d{2}-\d{2}-\d{6}$/;
    return regex.test(val);
};
const parseLicenseNumber = (val) => {
    return val;
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
const parseFullName = (val) => {
    const parts = val.split(',');
    if (parts.length !== 2) return null;
    const last = parts[0].trim();
    const firstMiddle = parts[1].trim().split(' ');
    const first = firstMiddle[0];
    const middle = firstMiddle.slice(1).join(' ') || null;
    return { last, first, middle };
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
const parseDateOfBirth = (val) => {
    const date = new Date(val);
    return date.toISOString().split('T')[0];
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
const parseAge = (val) => {
    return parseInt(val, 10);
};

// address : varchar 100
// generated with PSGC city data when available
const generateAddress = async () => {
    const houseNum = Math.floor(Math.random() * 999) + 1;
    const street = STREET_NAMES[Math.floor(Math.random() * STREET_NAMES.length)];

    const cities = await fetchCities();
    if (Array.isArray(cities) && cities.length) {
        const city = cities[Math.floor(Math.random() * cities.length)];
        const cityName = city.name || 'Unknown City';
        const region = city.regionName || city.region || city.district || 'Unknown Region';
        return `${houseNum} ${street}, ${cityName}, ${region}`;
    }

    return `${houseNum} ${street}, Manila, Metro Manila`;
};
const validateAddress = (val) => {
    return typeof val === 'string' && val.length <= 100 && val.trim().length > 0;
};
const parseAddress = (val) => {
    return val.trim();
};

// license_type
// enum: student, non-professional, professional
const generateLicenseType = () => {
    return LICENSE_TYPES[Math.floor(Math.random() * LICENSE_TYPES.length)];
};
const validateLicenseType = (val) => {
    return LICENSE_TYPES.includes(val);
};
const parseLicenseType = (val) => {
    return val;
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
const parseLicenseStatus = (val) => {
    return val;
};

// issue_date
// make sure this is also the same with the two-digit license number
const generateIssueDate = () => {
    const today = new Date();
    const pastYears = Math.floor(Math.random() * 10) + 1;
    const issueYear = today.getFullYear() - pastYears;
    const issueMonth = Math.floor(Math.random() * 12);
    const issueDay = Math.floor(Math.random() * 28) + 1;
    const date = new Date(issueYear, issueMonth, issueDay);
    return date.toISOString().split('T')[0];
};
const validateIssueDate = (val) => {
    return !isNaN(Date.parse(val));
};
const parseIssueDate = (val) => {
    const date = new Date(val);
    return date.toISOString().split('T')[0];
};

// expiry_date
// must be after issue_date
const generateExpiryDate = () => {
    const issueDate = new Date(generateIssueDate());
    const yearsToAdd = Math.floor(Math.random() * 5) + 1;
    issueDate.setFullYear(issueDate.getFullYear() + yearsToAdd);
    return issueDate.toISOString().split('T')[0];
};
const validateExpiryDate = (val, issueDate) => {
    if (!isNaN(Date.parse(val)) && issueDate) {
        return new Date(val) > new Date(issueDate);
    }
    return !isNaN(Date.parse(val));
};
const parseExpiryDate = (val) => {
    const date = new Date(val);
    return date.toISOString().split('T')[0];
};

// vehicle_model
const generateVehicleModel = () => {
    return VEHICLE_MODELS[Math.floor(Math.random() * VEHICLE_MODELS.length)];
};
const validateVehicleModel = (val) => {
    return typeof val === 'string' && val.length > 0;
};
const parseVehicleModel = (val) => {
    return val;
};

// vehicle make
const generateVehicleMake = () => {
    return VEHICLE_MAKES[Math.floor(Math.random() * VEHICLE_MAKES.length)];
};
const validateVehicleMake = (val) => {
    return typeof val === 'string' && val.length > 0;
};
const parseVehicleMake = (val) => {
    return val;
};

// vehicle_type
// motorbike, tricylcles, cars, light trucks, large trucks, buses, etc.
const generateVehicleType = () => {
    return VEHICLE_TYPES[Math.floor(Math.random() * VEHICLE_TYPES.length)];
};
const validateVehicleType = (val) => {
    return VEHICLE_TYPES.includes(val);
};
const parseVehicleType = (val) => {
    return val;
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
const validatePlateNumber = (val) => {
    const regex1 = /^[A-Z]{3} \d{4}$/;
    const regex2 = /^\d{3}[A-Z]{3}$/;
    const regex3 = /^[A-Z]\d{3}[A-Z]{2}$/;
    return regex1.test(val) || regex2.test(val) || regex3.test(val);
};
const parsePlateNumber = (val) => {
    return val;
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
const parseEngineNumber = (val) => {
    return val;
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
const parseChassisNumber = (val) => {
    return val;
};

// model : must match to what the models
// model itself ideintifies the make and vehicle type
const generateModel = () => {
    return VEHICLE_MODELS[Math.floor(Math.random() * VEHICLE_MODELS.length)];
};
const validateModel = (val) => {
    return typeof val === 'string' && val.length > 0;
};
const parseModel = (val) => {
    return val;
};

// year : valid year
const generateYear = () => {
    return Math.floor(Math.random() * (2024 - 1990 + 1)) + 1990;
};
const validateYear = (val) => {
    return Number.isInteger(val) && val >= 1900 && val <= 2030;
};
const parseYear = (val) => {
    return parseInt(val, 10);
};

// color :
// let's just have simple colors
const generateColor = () => {
    return COLORS[Math.floor(Math.random() * COLORS.length)];
};
const validateColor = (val) => {
    return typeof val === 'string' && val.length > 0;
};
const parseColor = (val) => {
    return val;
};

// registration_number : int auto increment if not specified
const generateRegistrationNumber = () => {
    return Math.floor(Math.random() * 10000000);
};
const validateRegistrationNumber = (val) => {
    return Number.isInteger(val);
};
const parseRegistrationNumber = (val) => {
    return val;
};

// registration_date : just valid date
const generateRegistrationDate = () => {
    const today = new Date();
    const pastDays = Math.floor(Math.random() * 365 * 5);
    const regDate = new Date(today.getTime() - pastDays * 24 * 60 * 60 * 1000);
    return regDate.toISOString().split('T')[0];
};
const validateRegistrationDate = (val) => {
    return !isNaN(Date.parse(val));
};
const parseRegistrationDate = (val) => {
    const date = new Date(val);
    return date.toISOString().split('T')[0];
};

// registration_staus
// enum : active, expired, suspended
const generateRegistrationStatus = () => {
    return REGISTRATION_STATUSES[Math.floor(Math.random() * REGISTRATION_STATUSES.length)];
};
const validateRegistrationStatus = (val) => {
    return REGISTRATION_STATUSES.includes(val);
};
const parseRegistrationStatus = (val) => {
    return val;
};

// expiration_date : just valid date
const generateExpirationDate = () => {
    const today = new Date();
    const futureDays = Math.floor(Math.random() * 365 * 2) + 30;
    const expDate = new Date(today.getTime() + futureDays * 24 * 60 * 60 * 1000);
    return expDate.toISOString().split('T')[0];
};
const validateExpirationDate = (val) => {
    return !isNaN(Date.parse(val));
};
const parseExpirationDate = (val) => {
    const date = new Date(val);
    return date.toISOString().split('T')[0];
};

// plate_number must exist already 
const generateExistingPlate = () => {
    return generatePlateNumber();
};
const validateExistingPlate = (val, db) => {
    return validatePlateNumber(val);
};
const parseExistingPlate = (val) => {
    return val;
};

// violation_id : int
const generateViolationId = () => {
    return Math.floor(Math.random() * 10000000);
};
const validateViolationId = (val) => {
    return Number.isInteger(val);
};
const parseViolationId = (val) => {
    return val;
};

// violation_type : varchar
// reckless driving, dui, overspeeding, etc..
const generateViolationType = () => {
    return VIOLATION_TYPES[Math.floor(Math.random() * VIOLATION_TYPES.length)];
};
const validateViolationType = (val) => {
    return typeof val === 'string' && val.length > 0;
};
const parseViolationType = (val) => {
    return val;
};

// location : varchar
// using PSGC api for city and/or region
const generateLocation = async () => {
    const locations = await getAllLocations();
    return locations[Math.floor(Math.random() * locations.length)];
};
const validateLocation = (val) => {
    return typeof val === 'string' && val.length > 0;
};
const parseLocation = (val) => {
    return val;
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
const parseApprehendingOfficer = (val) => {
    const parts = val.split(',');
    if (parts.length !== 2) return null;
    const last = parts[0].trim();
    const first = parts[1].trim();
    return { last, first };
};

// violation_status : enum
// unpaid, paid, contested
const generateViolationStatus = () => {
    return VIOLATION_STATUSES[Math.floor(Math.random() * VIOLATION_STATUSES.length)];
};
const validateViolationStatus = (val) => {
    return VIOLATION_STATUSES.includes(val);
};
const parseViolationStatus = (val) => {
    return val;
};

// fine amount : decimal two digits
const generateFineAmount = () => {
    return Math.floor(Math.random() * 100000) + Math.random();
};
const validateFineAmount = (val) => {
    return typeof val === 'number' && val >= 0;
};
const parseFineAmount = (val) => {
    return 'Php ' + parseFloat(val).toFixed(2).toString();
};

// license_number and plate_number must exist oor something
const generateVerification = () => {
    return true;
};
const validateVerification = (lic, plate, db) => {
    return validateLicenseNumber(lic) && validatePlateNumber(plate);
};
const parseVerification = (val) => {
    return val;
};

export const generate = {
    generateLicenseNumber,
    generateFullName,
    generateDateOfBirth,
    generateAge,
    generateAddress,
    generateLicenseType,
    generateLicenseStatus,
    generateIssueDate,
    generateExpiryDate,
    generateVehicleModel,
    generateVehicleMake,
    generateVehicleType,
    generatePlateNumber,
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

export const parse = {
    parseLicenseNumber,
    parseFullName,
    parseDateOfBirth,
    parseAge,
    parseAddress,
    parseLicenseType,
    parseLicenseStatus,
    parseIssueDate,
    parseExpiryDate,
    parseVehicleModel,
    parseVehicleMake,
    parseVehicleType,
    parsePlateNumber,
    parseEngineNumber,
    parseChassisNumber,
    parseModel,
    parseYear,
    parseColor,
    parseRegistrationNumber,
    parseRegistrationDate,
    parseRegistrationStatus,
    parseExpirationDate,
    parseExistingPlate,
    parseViolationId,
    parseViolationType,
    parseLocation,
    parseApprehendingOfficer,
    parseViolationStatus,
    parseFineAmount,
    parseVerification
};

export const get = {
    fetchRegions,
    fetchProvinces,
    fetchCities,
    fetchMunicipalities,
    fetchBarangays,
    getAllLocations
};

