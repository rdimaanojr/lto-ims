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

const reportTableSlot = (id, paginated = true) => {
    if (!paginated) {
        return `<div id="table-${id}" class="report-table-slot">
            <p class="report-empty is-hidden">No records found.</p>
            <div class="report-table-scroll is-hidden"><table class="report-table"><thead></thead><tbody></tbody></table></div>
        </div>`;
    }
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

export const Dashboard = () => {
    const today = new Date().toISOString().split('T')[0];
    const currentYear = new Date().getFullYear();
    const minYear = 1970;

    return `
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
                    <h3>View all registered drivers filtered by License type, License status, Age range, Sex</h3>
                    <div class="form-group"><label>License Type</label>
                        <select name="license_type">
                            <option value="">All</option>
                            <option value="student">Student</option>
                            <option value="non-professional">Non-Professional</option>
                            <option value="professional">Professional</option>
                        </select>
                    </div>
                    <div class="form-group"><label>Status</label>
                        <select name="license_status">
                            <option value="">All</option>
                            <option value="valid">Valid</option>
                            <option value="expired">Expired</option>
                            <option value="suspended">Suspended</option>
                            <option value="revoked">Revoked</option>
                        </select>
                    </div>
                    <div class="form-group"><label>Sex</label>
                        <select name="sex">
                            <option value="">All</option>
                            <option value="M">Male</option>
                            <option value="F">Female</option>
                        </select>
                    </div>
                    <div class="form-group age-range-group">
                        <div class="age-range-header">
                            <label>Age range</label>
                            <a href="#" id="age-reset-btn" class="age-reset-link">reset</a>
                        </div>
                        <div class="age-range-inline">
                            <input type="number" class="no-spinner" id="minAgeNumber" name="minAge" min="16" max="120" placeholder="Min">
                            <input type="number" class="no-spinner" id="maxAgeNumber" name="maxAge" min="16" max="120" placeholder="Max">
                        </div>
                    </div>
                    <button type="submit">Get</button>
                </form>
                ${reportTableSlot('1')}
            </div>

            <div id="content-2" class="tab-content">
                <form id="form-2" class="report-form report-form--single">
                    <h3>View all vehicles owned by a given driver</h3>
                    <div class="form-group"><label>License Number</label><input type="text" name="license_number" placeholder="e.g. N01-12-345678" autocomplete="off" required></div>
                    <button type="submit">Get</button>
                </form>
                ${reportTableSlot('2')}
            </div>

            <div id="content-3" class="tab-content">
                <form id="form-3" class="report-form report-form--single">
                    <h3>View all vehicles with expired registrations as of a given date</h3>
                    <div class="form-group"><label>As Of Date</label><input type="date" class="date-input" name="date" value="${today}" max="${today}" required></div>
                    <button type="submit">Get</button>
                </form>
                ${reportTableSlot('3')}
            </div>

            <div id="content-4" class="tab-content">
                <form id="form-4" class="report-form">
                    <h3>View all drivers with expired or suspended licenses</h3>
                    <button type="submit">Get</button>
                </form>
                ${reportTableSlot('4')}
            </div>

            <div id="content-5" class="tab-content">
                <form id="form-5" class="report-form report-form--row">
                    <h3>View all traffic violations committed by a given driver within a specified date range</h3>
                    <div class="form-group"><label>License Number</label><input type="text" name="license_number" placeholder="e.g. N01-12-345678" autocomplete="off" required></div>
                    <div class="form-group"><label>Start Date</label><input type="date" class="date-input" name="startDate" value="${new Date(0).toISOString().split('T')[0]}" max="${today}" required></div>
                    <div class="form-group"><label>End Date</label><input type="date" class="date-input" name="endDate" value="${today}" max="${today}" required></div>
                    <button type="submit">Get</button>
                </form>
                ${reportTableSlot('5')}
            </div>

            <div id="content-6" class="tab-content">
                <form id="form-6" class="report-form report-form--single">
                    <h3>View the total number of violations per violation type for a given year</h3>
                    <div class="form-group"><label>Year</label>
                        <div class="year-control">
                            <input type="range" class="year-range" min="${minYear}" max="${currentYear}" value="${currentYear}" aria-label="Year">
                            <input type="number" class="year-number" name="year" min="${minYear}" max="${currentYear}" value="${currentYear}" required>
                        </div>
                    </div>
                    <button type="submit">Get</button>
                </form>
                ${reportTableSlot('6', false)}
            </div>

            <div id="content-7" class="tab-content">
                <form id="form-7" class="report-form report-form--single">
                    <h3>View all vehicles involved in violations within a given city or region</h3>
                    <div class="form-group"><label>Location</label><input type="text" name="location" placeholder="e.g. Manila" required></div>
                    <button type="submit">Get</button>
                </form>
                ${reportTableSlot('7')}
            </div>
        </div>
    `;
};