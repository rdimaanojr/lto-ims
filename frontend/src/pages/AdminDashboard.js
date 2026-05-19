export const AdminDashboard = () => {
    return `
        <div class="admin-dashboard">
            <h1>Database Admin Panel</h1>
            
            <div class="tabs">
                <span id="tab-add" class="tab-link active">Add Records</span>
                <span id="tab-records" class="tab-link">View Database</span>
                <span id="tab-accounts" class="tab-link">Manage Accounts</span>
            </div>

            <div id="view-add" class="tab-content active">
                <div id="forms-container">
                    <form id="form-driver">
                        <h3>Add Driver</h3>
                        <div class="form-group"><label>License Number:</label><input type="text" name="license_number" required><button type="button" class="random-btn" data-field="license_number">Random</button></div>
                        <div class="form-group"><label>Full Name:</label><input type="text" name="full_name" required><button type="button" class="random-btn" data-field="full_name">Random</button></div>
                        <div class="form-group"><label>Date of Birth:</label><input type="date" name="date_of_birth" required><button type="button" class="random-btn" data-field="date_of_birth">Random</button></div>
                        <div class="form-group"><label>Sex:</label><select name="sex"><option value="M">Male</option><option value="F">Female</option></select><button type="button" class="random-btn" data-field="sex">Random</button></div>
                        <div class="form-group"><label>Address:</label><input type="text" name="address"><button type="button" class="random-btn" data-field="address">Random</button></div>
                        <div class="form-group"><label>License Type:</label><select name="license_type"><option value="student">Student</option><option value="non-professional">Non-Professional</option><option value="professional">Professional</option></select><button type="button" class="random-btn" data-field="license_type">Random</button></div>
                        <div class="form-group"><label>Issue Date:</label><input type="date" name="issue_date"><button type="button" class="random-btn" data-field="issue_date">Random</button></div>
                        <div class="form-group"><label>Expiry Date:</label><input type="date" name="expiry_date"><button type="button" class="random-btn" data-field="expiry_date">Random</button></div>
                        <button type="button" class="random-all-btn" data-form="driver">Random All</button>
                        <button type="submit">Add Driver</button>
                    </form>
                    <hr>
                    <form id="form-vehicle">
                        <h3>Add Vehicle</h3>
                        <div class="form-group"><label>Plate Number:</label><input type="text" name="plate_number" required><button type="button" class="random-btn" data-field="plate_number">Random</button></div>
                        <div class="form-group"><label>Engine Number:</label><input type="text" name="engine_number" required><button type="button" class="random-btn" data-field="engine_number">Random</button></div>
                        <div class="form-group"><label>Chassis Number:</label><input type="text" name="chassis_number" required><button type="button" class="random-btn" data-field="chassis_number">Random</button></div>
                        <div class="form-group"><label>Model:</label><input type="text" name="model" required><button type="button" class="random-btn" data-field="model">Random</button></div>
                        <div class="form-group"><label>Make:</label><input type="text" name="make" required><button type="button" class="random-btn" data-field="make">Random</button></div>
                        <div class="form-group"><label>Vehicle Type:</label><input type="text" name="vehicle_type" required><button type="button" class="random-btn" data-field="vehicle_type">Random</button></div>
                        <div class="form-group"><label>Year:</label><input type="number" name="year"><button type="button" class="random-btn" data-field="year">Random</button></div>
                        <div class="form-group"><label>Color:</label><input type="text" name="color"><button type="button" class="random-btn" data-field="color">Random</button></div>
                        <div class="form-group"><label>Owner License #:</label><input type="text" name="license_number" required><button type="button" class="random-btn" data-field="license_number" data-type="existing">Random</button></div>
                        <button type="button" class="random-all-btn" data-form="vehicle">Random All</button>
                        <button type="submit">Add Vehicle</button>
                    </form>
                    <hr>
                    <form id="form-registration">
                        <h3>Add Registration</h3>
                        <div class="form-group"><label>Registration Date:</label><input type="date" name="registration_date" required><button type="button" class="random-btn" data-field="registration_date">Random</button></div>
                        <div class="form-group"><label>Expiration Date:</label><input type="date" name="expiration_date" required><button type="button" class="random-btn" data-field="expiration_date">Random</button></div>
                        <div class="form-group"><label>Plate Number:</label><input type="text" name="plate_number" required><button type="button" class="random-btn" data-field="plate_number" data-type="existing">Random</button></div>
                        <button type="button" class="random-all-btn" data-form="registration">Random All</button>
                        <button type="submit">Register Vehicle</button>
                    </form>
                    <hr>
                    <form id="form-violation">
                        <h3>Add Violation</h3>
                        <div class="form-group"><label>Violation Type:</label><input type="text" name="violation_type" required><button type="button" class="random-btn" data-field="violation_type">Random</button></div>
                        <div class="form-group"><label>Date:</label><input type="date" name="date" required><button type="button" class="random-btn" data-field="date">Random</button></div>
                        <div class="form-group"><label>Location:</label><input type="text" name="location" required><button type="button" class="random-btn" data-field="location">Random</button></div>
                        <div class="form-group"><label>Apprehending Officer:</label><input type="text" name="apprehending_officer"><button type="button" class="random-btn" data-field="apprehending_officer">Random</button></div>
                        <div class="form-group"><label>Fine Amount:</label><input type="number" name="fine_amount" step="0.01"><button type="button" class="random-btn" data-field="fine_amount">Random</button></div>
                        <div class="form-group"><label>Violation Status:</label><select name="violation_status"><option value="unpaid">Unpaid</option><option value="paid">Paid</option><option value="contested">Contested</option></select><button type="button" class="random-btn" data-field="violation_status">Random</button></div>
                        <div class="form-group"><label>Driver License #:</label><input type="text" name="license_number" required><button type="button" class="random-btn" data-field="license_number" data-type="existing">Random</button></div>
                        <div class="form-group"><label>Plate Number:</label><input type="text" name="plate_number" required><button type="button" class="random-btn" data-field="plate_number" data-type="existing">Random</button></div>
                        <button type="button" class="random-all-btn" data-form="violation">Random All</button>
                        <button type="submit">Add Violation</button>
                    </form>
                </div>
            </div>

            <div id="view-records" class="tab-content">
                <h2>Database Records</h2>

                <div class="tabs sub-tabs">
                    <span id="tab-drivers" class="tab-link active">Drivers</span>
                    <span id="tab-vehicles" class="tab-link">Vehicles</span>
                    <span id="tab-registrations" class="tab-link">Registrations</span>
                    <span id="tab-violations" class="tab-link">Violations</span>
                </div>

                <div id="view-drivers" class="tab-content active">
                    <div id="table-drivers"></div>
                </div>
                <div id="view-vehicles" class="tab-content">
                    <div id="table-vehicles"></div>
                </div>
                <div id="view-registrations" class="tab-content">
                    <div id="table-registrations"></div>
                </div>
                <div id="view-violations" class="tab-content">
                    <div id="table-violations"></div>
                </div>

            </div>

            <div id="view-accounts" class="tab-content">
            <div class="accounts-container">
                <div class="accounts-section">
                    <h3>All Accounts</h3>
                    <div id="table-accounts-all"></div>
                </div>
                <div class="accounts-section">
                    <h3>Pending Approvals</h3>
                    <div id="table-accounts-pending"></div>
                </div>
            </div>
        </div>
        </div>
    `;
};