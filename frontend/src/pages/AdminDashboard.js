export const AdminDashboard = () => {
    return `
        <style>
            .admin-dashboard { padding: 20px; font-family: sans-serif; }
            .tabs { margin-bottom: 25px; border-bottom: 1px solid #ccc; padding-bottom: 10px; }
            .tab-link { margin-right: 20px; cursor: pointer; font-weight: bold; color: #555; }
            .tab-link:hover { color: #000; }
            .tab-link.active { color: #000; text-decoration: underline; }
            
            .tab-content { display: none; }
            .tab-content.active { display: block; }
            
            .form-group { margin-bottom: 10px; }
            .form-group label { display: inline-block; width: 180px; font-weight: bold; }
            .form-group input, .form-group select { width: 250px; }
            table { width: 100%; border-collapse: collapse; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
            th { background-color: #f4f4f4; }
            .section-block { margin: 20px 0; }

            [id^="table-"] {
                overflow-y: auto;
                margin-top: 10px;
                padding: 20px 0;
            }

        </style>
        
        <div class="admin-dashboard">
            <h1>Database Admin Panel</h1>
            
            <div class="tabs">
                <span id="tab-add" class="tab-link active">Add Records</span>
                <span id="tab-view" class="tab-link">View Database</span>
            </div>

            <div id="view-add" class="tab-content active">
                <div id="forms-container">
                    <form id="form-driver">
                        <h3>Add Driver</h3>
                        <div class="form-group"><label>License Number:</label><input type="text" name="license_number" required></div>
                        <div class="form-group"><label>Full Name:</label><input type="text" name="full_name" required></div>
                        <div class="form-group"><label>Date of Birth:</label><input type="date" name="date_of_birth" required></div>
                        <div class="form-group"><label>Age:</label><input type="number" name="age"></div>
                        <div class="form-group"><label>Sex:</label><select name="sex"><option value="M">Male</option><option value="F">Female</option></select></div>
                        <div class="form-group"><label>Address:</label><input type="text" name="address"></div>
                        <div class="form-group"><label>License Type:</label><select name="license_type"><option value="student">Student</option><option value="non-professional">Non-Professional</option><option value="professional">Professional</option></select></div>
                        <div class="form-group"><label>Issue Date:</label><input type="date" name="issue_date"></div>
                        <div class="form-group"><label>Expiry Date:</label><input type="date" name="expiry_date"></div>
                        <button type="submit">Add Driver</button>
                    </form>
                    <hr>
                    <form id="form-model">
                        <h3>Add Vehicle Model</h3>
                        <div class="form-group"><label>Model Name:</label><input type="text" name="model" required></div>
                        <div class="form-group"><label>Make:</label><input type="text" name="make" required></div>
                        <div class="form-group"><label>Vehicle Type:</label><input type="text" name="vehicle_type" required></div>
                        <button type="submit">Add Model</button>
                    </form>
                    <hr>
                    <form id="form-vehicle">
                        <h3>Add Vehicle</h3>
                        <div class="form-group"><label>Plate Number:</label><input type="text" name="plate_number" required></div>
                        <div class="form-group"><label>Engine Number:</label><input type="text" name="engine_number" required></div>
                        <div class="form-group"><label>Chassis Number:</label><input type="text" name="chassis_number" required></div>
                        <div class="form-group"><label>Model:</label><input type="text" name="model" required></div>
                        <div class="form-group"><label>Year:</label><input type="number" name="year"></div>
                        <div class="form-group"><label>Color:</label><input type="text" name="color"></div>
                        <div class="form-group"><label>Owner License #:</label><input type="text" name="license_number" required></div>
                        <button type="submit">Add Vehicle</button>
                    </form>
                    <hr>
                    <form id="form-registration">
                        <h3>Add Registration</h3>
                        <div class="form-group"><label>Registration Date:</label><input type="date" name="registration_date" required></div>
                        <div class="form-group"><label>Expiration Date:</label><input type="date" name="expiration_date" required></div>
                        <div class="form-group"><label>Plate Number:</label><input type="text" name="plate_number" required></div>
                        <button type="submit">Register Vehicle</button>
                    </form>
                    <hr>
                    <form id="form-violation">
                        <h3>Add Violation</h3>
                        <div class="form-group"><label>Violation Type:</label><input type="text" name="violation_type" required></div>
                        <div class="form-group"><label>Date:</label><input type="date" name="date" required></div>
                        <div class="form-group"><label>Location:</label><input type="text" name="location" required></div>
                        <div class="form-group"><label>Apprehending Officer:</label><input type="text" name="apprehending_officer"></div>
                        <div class="form-group"><label>Fine Amount:</label><input type="number" name="fine_amount" step="0.01"></div>
                        <div class="form-group"><label>Driver License #:</label><input type="text" name="license_number" required></div>
                        <div class="form-group"><label>Plate Number:</label><input type="text" name="plate_number" required></div>
                        <button type="submit">Add Violation</button>
                    </form>
                </div>
            </div>

            <div id="view-records" class="tab-content">
                <h2>Database Records</h2>
                <div class="section-block"><h3>Drivers</h3><div id="table-drivers"></div></div><hr>
                <div class="section-block"><h3>Vehicle Models</h3><div id="table-models"></div></div><hr>
                <div class="section-block"><h3>Vehicles</h3><div id="table-vehicles"></div></div><hr>
                <div class="section-block"><h3>Registrations</h3><div id="table-registrations"></div></div><hr>
                <div class="section-block"><h3>Violations</h3><div id="table-violations"></div></div>
            </div>
        </div>
    `;
};