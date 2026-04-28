export const Dashboard = () => {
    return `
        <style>
            .dashboard { padding: 20px; font-family: sans-serif; }
            .tabs { margin-bottom: 25px; border-bottom: 1px solid #ccc; padding-bottom: 10px; }
            .tab-link { margin-right: 20px; cursor: pointer; font-weight: bold; color: #555; }
            .tab-link:hover { color: #000; }
            .tab-link.active { color: #000; text-decoration: underline; }
            
            .tab-content { display: none; }
            .tab-content.active { display: block; }
            
            .form-group { margin-bottom: 10px; }
            .form-group label { display: inline-block; width: 150px; font-weight: bold; }
            .form-group input, .form-group select { width: 200px; }
            
            table { width: 100%; border-collapse: collapse; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
            th { background-color: #f4f4f4; }
            
            [id^="table-"] {
                overflow-y: auto;
                margin-top: 10px;
                padding: 20px 0;
            }

        </style>

        <div class="dashboard">
            <h1>Reports Panel</h1>
            
            <div class="tabs">
                <span id="tab-1" class="tab-link active">Report 1</span>
                <span id="tab-2" class="tab-link">Report 2</span>
                <span id="tab-3" class="tab-link">Report 3</span>
                <span id="tab-4" class="tab-link">Report 4</span>
                <span id="tab-5" class="tab-link">Report 5</span>
                <span id="tab-6" class="tab-link">Report 6</span>
                <span id="tab-7" class="tab-link">Report 7</span>
            </div>

            <div id="content-1" class="tab-content active">
                <form id="form-1">
                    <h3>View all registered drivers filtered by: License type, License status, Age range, Sex</h3>
                    <div class="form-group"><label>License Type:</label>
                        <select name="license_type">
                            <option value="">All</option>
                            <option value="student">Student</option>
                            <option value="non-professional">Non-Professional</option>
                            <option value="professional">Professional</option>
                        </select>
                    </div>
                    <div class="form-group"><label>Status:</label>
                        <select name="license_status">
                            <option value="">All</option>
                            <option value="valid">Valid</option>
                            <option value="expired">Expired</option>
                            <option value="suspended">Suspended</option>
                            <option value="revoked">Revoked</option>
                        </select>
                    </div>
                    <div class="form-group"><label>Sex:</label>
                        <select name="sex">
                            <option value="">All</option>
                            <option value="M">Male</option>
                            <option value="F">Female</option>
                        </select>
                    </div>
                    <div class="form-group"><label>Min Age:</label><input type="number" name="minAge"></div>
                    <div class="form-group"><label>Max Age:</label><input type="number" name="maxAge"></div>
                    <button type="submit">Get</button>
                </form>
                <div id="table-1"></div>
            </div>

            <div id="content-2" class="tab-content">
                <form id="form-2">
                    <h3>View all vehicles owned by a given driver</h3>
                    <div class="form-group"><label>License Number:</label><input type="text" name="license_number"></div>
                    <button type="submit">Get</button>
                </form>
                <div id="table-2"></div>
            </div>

            <div id="content-3" class="tab-content">
                <form id="form-3">
                    <h3>View all vehicles with expired registrations as of a given date</h3>
                    <div class="form-group"><label>As Of Date:</label><input type="date" name="date"></div>
                    <button type="submit">Get</button>
                </form>
                <div id="table-3"></div>
            </div>

            <div id="content-4" class="tab-content">
                <form id="form-4">
                    <h3>View all drivers with expired or suspended licenses</h3>
                    <button type="submit">Get</button>
                </form>
                <div id="table-4"></div>
            </div>

            <div id="content-5" class="tab-content">
                <form id="form-5">
                    <h3>View all traffic violations committed by a given driver within a specified date range</h3>
                    <div class="form-group"><label>License Number:</label><input type="text" name="license_number"></div>
                    <div class="form-group"><label>Start Date:</label><input type="date" name="startDate"></div>
                    <div class="form-group"><label>End Date:</label><input type="date" name="endDate"></div>
                    <button type="submit">Get</button>
                </form>
                <div id="table-5"></div>
            </div>

            <div id="content-6" class="tab-content">
                <form id="form-6">
                    <h3>View the total number of violations per violation type for a given year</h3>
                    <div class="form-group"><label>Year:</label><input type="number" name="year"></div>
                    <button type="submit">Get</button>
                </form>
                <div id="table-6"></div>
            </div>

            <div id="content-7" class="tab-content">
                <form id="form-7">
                    <h3>View all vehicles involved in violations within a given city or region</h3>
                    <div class="form-group"><label>Location:</label><input type="text" name="location"></div>
                    <button type="submit">Get</button>
                </form>
                <div id="table-7"></div>
            </div>
        </div>
    `;
};