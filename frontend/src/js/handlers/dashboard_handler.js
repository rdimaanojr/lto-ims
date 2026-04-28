import { reportsApi } from "../api/reports_api.js";

const apiMap = {
    'form-1': reportsApi.getDriversFiltered,
    'form-2': reportsApi.getVehiclesByLicense,
    'form-3': reportsApi.getExpiredVehiclesAsOfDate,
    'form-4': reportsApi.getExpiredLicenseDrivers,
    'form-5': reportsApi.getViolationsByDriverWithinDate,
    'form-6': reportsApi.getTotalViolationsByYear,
    'form-7': reportsApi.getVehiclesWithViolationsByLocation
};

export const initDashboardHandlers = () => {
    const app = document.getElementById('app');

    // tab logic
    app.addEventListener('click', (e) => {
        if (e.target.classList.contains('tab-link')) {
            const target = e.target.id.replace('tab', 'content');

            document.querySelectorAll('.tab-link').forEach(el => el.classList.remove('active'));
            document.querySelectorAll('.tab-content').forEach(el => el.classList.remove('active'));

            e.target.classList.add('active');
            document.getElementById(target).classList.add('active');
        }
    });

    // form submit logic
    app.addEventListener('submit', async (e) => {
        const form = e.target.closest('form');
        if (!form || !apiMap[form.id]) return;
        
        const formData = Object.fromEntries(new FormData(form));
        const apiFunction = apiMap[form.id];
        const res = await apiFunction(formData);       
        renderReportTable(form.id.replace('form-', ''), res.data || []);
    });
};

const renderReportTable = (id, data) => {
    const container = document.getElementById(`table-${id}`);
    if (!container) return;

    if (data.length === 0) {
        container.innerHTML = '<p>No records found.</p>';
        return;
    }

    const columns = Object.keys(data[0]);
    let html = `<table><thead><tr>${columns.map(c => `<th>${c.split('_').map(word => word[0].toUpperCase() + word.slice(1)).join(' ')}</th>`).join('')}</tr></thead><tbody>`;
    html += data.map(row => `<tr>${columns.map(c => `<td>${row[c] ?? '-'}</td>`).join('')}</tr>`).join('');
    html += `</tbody></table>`;
    
    container.innerHTML = html;
};