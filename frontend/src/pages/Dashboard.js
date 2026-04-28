export const Dashboard = () => {
    return `
        <div class="dashboard">
            <h1>Driver & Vehicle Reports</h1>
            
            <section id="report-1">
                <h3>1. Filtered Drivers</h3>
                <input type="text" id="r1-type" placeholder="License Type">
                <input type="text" id="r1-status" placeholder="Status">
                <input type="text" id="r1-sex" placeholder="Sex">
                <input type="number" id="r1-minAge" placeholder="Min Age">
                <input type="number" id="r1-maxAge" placeholder="Max Age">
                <button id="btn-1">Apply</button>
                <div class="table-container" id="table-1"></div>
            </section>
            <hr>

            <section id="report-2">
                <h3>2. Vehicles By License</h3>
                <input type="text" id="r2-license" placeholder="License Number">
                <button id="btn-2">Apply</button>
                <div class="table-container" id="table-2"></div>
            </section>
            <hr>

            <section id="report-3">
                <h3>3. Expired Vehicles As Of Date</h3>
                <input type="date" id="r3-date">
                <button id="btn-3">Apply</button>
                <div class="table-container" id="table-3"></div>
            </section>
            <hr>

            <section id="report-4">
                <h3>4. Drivers With Expired/Suspended License</h3>
                <button id="btn-4">Apply</button>
                <div class="table-container" id="table-4"></div>
            </section>
            <hr>

            <section id="report-5">
                <h3>5. Violations By Driver</h3>
                <input type="text" id="r5-license" placeholder="License Number">
                <input type="date" id="r5-start">
                <input type="date" id="r5-end">
                <button id="btn-5">Apply</button>
                <div class="table-container" id="table-5"></div>
            </section>
            <hr>

            <section id="report-6">
                <h3>6. Total Violations Per Year</h3>
                <input type="number" id="r6-year" placeholder="Year">
                <button id="btn-6">Apply</button>
                <div class="table-container" id="table-6"></div>
            </section>
            <hr>

            <section id="report-7">
                <h3>7. Vehicles With Violations By Location</h3>
                <input type="text" id="r7-location" placeholder="Location">
                <button id="btn-7">Apply</button>
                <div class="table-container" id="table-7"></div>
            </section>
        </div>
    `;
};