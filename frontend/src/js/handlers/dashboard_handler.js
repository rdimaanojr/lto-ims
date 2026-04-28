import { reportsApi } from "../api/reports_api.js";

export const initDashboardHandlers = () => {
    // Helper to update the DOM
    const renderTable = (id, data) => {
        const container = document.getElementById(`table-${id}`);
        container.innerHTML = `<pre>${JSON.stringify(data, null, 2)}</pre>`;
    };

    // Setup event delegation for all buttons in the dashboard
    const dashboard = document.querySelector('.dashboard');
    if (!dashboard) return;

    dashboard.addEventListener('click', async (e) => {
        if (e.target.tagName !== 'BUTTON') return;
        
        const btnId = e.target.id;

        // #1: Filtered Drivers
        if (btnId === 'btn-1') {
            const data = await reportsApi.getDriversFiltered(
                document.getElementById('r1-type').value,
                document.getElementById('r1-status').value,
                document.getElementById('r1-sex').value,
                document.getElementById('r1-minAge').value,
                document.getElementById('r1-maxAge').value
            );
            renderTable(1, data.data);
        }

        // #2: Vehicles By License
        if (btnId === 'btn-2') {
            const data = await reportsApi.getVehiclesByLicense(
                document.getElementById('r2-license').value
            );
            renderTable(2, data.data);
        }

        // #3: Expired Vehicles
        if (btnId === 'btn-3') {
            const data = await reportsApi.getExpiredVehiclesAsOfDate(
                document.getElementById('r3-date').value
            );
            renderTable(3, data.data);
        }

        // #4: Expired License Drivers
        if (btnId === 'btn-4') {
            const data = await reportsApi.getExpiredLicenseDrivers();
            renderTable(4, data.data);
        }

        // #5: Violations By Driver
        if (btnId === 'btn-5') {
            const data = await reportsApi.getViolationsByDriverWithinDate(
                document.getElementById('r5-license').value,
                document.getElementById('r5-start').value,
                document.getElementById('r5-end').value
            );
            renderTable(5, data.data);
        }

        // #6: Violations By Year
        if (btnId === 'btn-6') {
            const data = await reportsApi.getTotalViolationsByYear(
                document.getElementById('r6-year').value
            );
            renderTable(6, data.data);
        }

        // #7: Vehicles By Location
        if (btnId === 'btn-7') {
            const data = await reportsApi.getVehiclesWithViolationsByLocation(
                document.getElementById('r7-location').value
            );
            renderTable(7, data.data);
        }
    });
};