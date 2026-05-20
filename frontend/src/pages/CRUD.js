const pageSizeSelect = `
    <select class="page-size-select">
        <option value="25">25</option>
        <option value="50" selected>50</option>
        <option value="100">100</option>
        <option value="250">250</option>
    </select>`;

const paginationCenter = `
    <div class="report-pagination-center">
        <button type="button" class="page-first" aria-label="First page">&laquo;</button>
        <button type="button" class="page-prev" aria-label="Previous page">&lsaquo;</button>
        <input type="number" class="page-input no-spinner" min="1" value="1" aria-label="Page" disabled>
        <button type="button" class="page-next" aria-label="Next page">&rsaquo;</button>
        <button type="button" class="page-last" aria-label="Last page">&raquo;</button>
    </div>`;


const reportTableSlot = (id) => {
    return `<div id="table-${id}" class="report-table-slot" data-paginated="true">
        <p class="report-empty is-hidden">No records found.</p>
        <div class="report-pagination report-pagination--top">
            <div class="report-pagination-left">
                <span class="report-count"><strong>0</strong> results found</span>
                <span class="report-range">Showing 0–0</span>
            </div>
            ${paginationCenter}
            <div class="report-pagination-right">
                <span class="report-page-size-label">Rows per page</span>
                ${pageSizeSelect}
            </div>
        </div>
        <div class="report-table-scroll is-hidden"><table class="report-table"><thead></thead><tbody></tbody></table></div>
        <div class="report-pagination report-pagination--bottom is-hidden">
            ${paginationCenter}
        </div>
    </div>`;
};

const createFormHTML = (type) => {
    const forms = {
        driver: `
            <form id="crud-form-driver" class="crud-form">
                <input type="hidden" name="form-type" value="driver">
                <div class="form-row">
                    <div class="form-group">
                        <label>License Number <span class="required">*</span></label>
                        <input type="text" name="license_number" required placeholder="N01-12-345678">
                    </div>
                    <div class="form-group">
                        <label>Full Name <span class="required">*</span></label>
                        <input type="text" name="full_name" required>
                    </div>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label>Date of Birth <span class="required">*</span></label>
                        <input type="date" name="date_of_birth" required>
                    </div>
                    <div class="form-group">
                        <label>Sex <span class="required">*</span></label>
                        <select name="sex" required>
                            <option value="">Select...</option>
                            <option value="M">Male</option>
                            <option value="F">Female</option>
                        </select>
                    </div>
                </div>
                <div class="form-group">
                    <label>Address</label>
                    <input type="text" name="address" placeholder="Full address">
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label>License Type <span class="required">*</span></label>
                        <select name="license_type" required>
                            <option value="">Select...</option>
                            <option value="student">Student</option>
                            <option value="non-professional">Non-Professional</option>
                            <option value="professional">Professional</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label>Issue Date <span class="required">*</span></label>
                        <input type="date" name="issue_date" required>
                    </div>
                    <div class="form-group">
                        <label>Expiry Date <span class="required">*</span></label>
                        <input type="date" name="expiry_date" required>
                    </div>
                </div>
                <div class="form-actions">
                    <button type="submit" class="btn-primary">Save Driver</button>
                    <button type="button" class="btn-secondary" onclick="document.getElementById('crud-form-driver').reset()">Clear</button>
                </div>
            </form>
        `,
        vehicle: `
            <form id="crud-form-vehicle" class="crud-form">
                <input type="hidden" name="form-type" value="vehicle">
                <div class="form-row">
                    <div class="form-group">
                        <label>Plate Number <span class="required">*</span></label>
                        <input type="text" name="plate_number" required placeholder="ABC-1234">
                    </div>
                    <div class="form-group">
                        <label>Model <span class="required">*</span></label>
                        <input type="text" name="model" required>
                    </div>
                    <div class="form-group">
                        <label>Make <span class="required">*</span></label>
                        <input type="text" name="make" required>
                    </div>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label>Engine Number <span class="required">*</span></label>
                        <input type="text" name="engine_number" required>
                    </div>
                    <div class="form-group">
                        <label>Chassis Number <span class="required">*</span></label>
                        <input type="text" name="chassis_number" required>
                    </div>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label>Vehicle Type <span class="required">*</span></label>
                        <select name="vehicle_type" required>
                            <option value="">Select...</option>
                            <option value="sedan">Sedan</option>
                            <option value="suv">SUV</option>
                            <option value="truck">Truck</option>
                            <option value="van">Van</option>
                            <option value="motorcycle">Motorcycle</option>
                            <option value="bus">Bus</option>
                            <option value="other">Other</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label>Year <span class="required">*</span></label>
                        <input type="number" name="year" required min="1900" max="2030" placeholder="2024">
                    </div>
                    <div class="form-group">
                        <label>Color</label>
                        <input type="text" name="color" placeholder="e.g. Silver">
                    </div>
                </div>
                <div class="form-group">
                    <label>Owner License Number <span class="required">*</span></label>
                    <input type="text" name="license_number" required placeholder="N01-12-345678">
                </div>
                <div class="form-actions">
                    <button type="submit" class="btn-primary">Save Vehicle</button>
                    <button type="button" class="btn-secondary" onclick="document.getElementById('crud-form-vehicle').reset()">Clear</button>
                </div>
            </form>
        `,
        registration: `
            <form id="crud-form-registration" class="crud-form">
                <input type="hidden" name="form-type" value="registration">
                <div class="form-row">
                    <div class="form-group">
                        <label>Plate Number <span class="required">*</span></label>
                        <input type="text" name="plate_number" required placeholder="ABC-1234">
                    </div>
                    <div class="form-group">
                        <label>Registration Date <span class="required">*</span></label>
                        <input type="date" name="registration_date" required>
                    </div>
                    <div class="form-group">
                        <label>Expiration Date <span class="required">*</span></label>
                        <input type="date" name="expiration_date" required>
                    </div>
                </div>
                <div class="form-actions">
                    <button type="submit" class="btn-primary">Save Registration</button>
                    <button type="button" class="btn-secondary" onclick="document.getElementById('crud-form-registration').reset()">Clear</button>
                </div>
            </form>
        `,
        violation: `
            <form id="crud-form-violation" class="crud-form">
                <input type="hidden" name="form-type" value="violation">
                <div class="form-row">
                    <div class="form-group">
                        <label>Violation Type <span class="required">*</span></label>
                        <select name="violation_type" required>
                            <option value="">Select...</option>
                            <option value="speeding">Speeding</option>
                            <option value="reckless driving">Reckless Driving</option>
                            <option value="no license">No License</option>
                            <option value="expired registration">Expired Registration</option>
                            <option value="illegal parking">Illegal Parking</option>
                            <option value="running red light">Running Red Light</option>
                            <option value="no helmet">No Helmet</option>
                            <option value="overloading">Overloading</option>
                            <option value="other">Other</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label>Date <span class="required">*</span></label>
                        <input type="date" name="date" required>
                    </div>
                </div>
                <div class="form-group">
                    <label>Location <span class="required">*</span></label>
                    <input type="text" name="location" required placeholder="e.g. Main St. cor. Rizal Ave.">
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label>Apprehending Officer</label>
                        <input type="text" name="apprehending_officer" placeholder="Officer's name">
                    </div>
                    <div class="form-group">
                        <label>Fine Amount</label>
                        <input type="number" name="fine_amount" step="0.01" min="0" placeholder="0.00">
                    </div>
                    <div class="form-group">
                        <label>Status <span class="required">*</span></label>
                        <select name="violation_status" required>
                            <option value="unpaid">Unpaid</option>
                            <option value="paid">Paid</option>
                            <option value="contested">Contested</option>
                        </select>
                    </div>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label>Driver License Number <span class="required">*</span></label>
                        <input type="text" name="license_number" required placeholder="N01-12-345678">
                    </div>
                    <div class="form-group">
                        <label>Plate Number <span class="required">*</span></label>
                        <input type="text" name="plate_number" required placeholder="ABC-1234">
                    </div>
                </div>
                <div class="form-actions">
                    <button type="submit" class="btn-primary">Save Violation</button>
                    <button type="button" class="btn-secondary" onclick="document.getElementById('crud-form-violation').reset()">Clear</button>
                </div>
            </form>
        `
    };
    return forms[type] || '';
};

export const CRUD = () => {
    return `
        <div class="crud-page">
            <h1>Data Management</h1>

            <div class="tabs">
                <span id="tab-drivers" class="tab-link active">Drivers</span>
                <span id="tab-vehicles" class="tab-link">Vehicles</span>
                <span id="tab-registrations" class="tab-link">Registrations</span>
                <span id="tab-violations" class="tab-link">Violations</span>
            </div>

            <!-- DRIVERS TAB -->
            <div id="view-drivers" class="tab-content active">
                <div class="crud-layout">
                    <div class="crud-form-section">
                        <h2>Add/Edit Driver</h2>
                        ${createFormHTML('driver')}
                    </div>
                    <div class="crud-table-section">
                        <h2>Driver Records</h2>
                        <div class="search-bar">
                            <input type="text" id="search-drivers" placeholder="Search by license number or name..." class="search-input">
                            <button type="button" class="search-go-btn">Go</button>
                        </div>
                        ${reportTableSlot('crud-drivers')}
                    </div>
                </div>
            </div>

            <!-- VEHICLES TAB -->
            <div id="view-vehicles" class="tab-content">
                <div class="crud-layout">
                    <div class="crud-form-section">
                        <h2>Add/Edit Vehicle</h2>
                        ${createFormHTML('vehicle')}
                    </div>
                    <div class="crud-table-section">
                        <h2>Vehicle Records</h2>
                        <div class="search-bar">
                            <input type="text" id="search-vehicles" placeholder="Search by plate number or model..." class="search-input">
                            <button type="button" class="search-go-btn">Go</button>
                        </div>
                        ${reportTableSlot('crud-vehicles')}
                    </div>
                </div>
            </div>

            <!-- REGISTRATIONS TAB -->
            <div id="view-registrations" class="tab-content">
                <div class="crud-layout">
                    <div class="crud-form-section">
                        <h2>Add/Edit Registration</h2>
                        ${createFormHTML('registration')}
                    </div>
                    <div class="crud-table-section">
                        <h2>Registration Records</h2>
                        <div class="search-bar">
                            <input type="text" id="search-registrations" placeholder="Search by registration number or plate..." class="search-input">
                            <button type="button" class="search-go-btn">Go</button>
                        </div>
                        ${reportTableSlot('crud-registrations')}
                    </div>
                </div>
            </div>

            <!-- VIOLATIONS TAB -->
            <div id="view-violations" class="tab-content">
                <div class="crud-layout">
                    <div class="crud-form-section">
                        <h2>Add/Edit Violation</h2>
                        ${createFormHTML('violation')}
                    </div>
                    <div class="crud-table-section">
                        <h2>Violation Records</h2>
                        <div class="search-bar">
                            <input type="text" id="search-violations" placeholder="Search by violation type or location..." class="search-input">
                            <button type="button" class="search-go-btn">Go</button>
                        </div>
                        ${reportTableSlot('crud-violations')}
                    </div>
                </div>
            </div>

            <!-- Edit Modal -->
            <div id="edit-modal" class="modal is-hidden">
                <div class="modal-overlay"></div>
                <div class="modal-content">
                    <div class="modal-header">
                        <h2>Edit Record</h2>
                        <button class="modal-close" aria-label="Close">&times;</button>
                    </div>
                    <div id="modal-body" class="modal-body">
                        <!-- Dynamic form content will be inserted here -->
                    </div>
                </div>
            </div>
        </div>
    `;
};