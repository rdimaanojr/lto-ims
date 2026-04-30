import { reportsApi } from "../api/reports_api.js";
import { parseDate } from "../utils/utils.js";

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

    const dateFields = ['date_of_birth', 'issue_date', 'expiry_date', 'registration_date', 'expiration_date', 'date'];

    const columns = Object.keys(data[0]);

    let html = `<p><strong>${data.length}</strong> entries found.</p>`;

    html += `<table><thead><tr>${columns.map(c => `<th>${c.split('_').map(word => word[0].toUpperCase() + word.slice(1)).join(' ')}</th>`).join('')}</tr></thead><tbody>`;
    
    html += data.map(row => {
        const cells = columns.map(c => {
            let value = row[c] ?? '-';
            
            // parse date values
            if (dateFields.includes(c) && value !== '-') {
                value = parseDate(value);
            }
            
            return `<td>${value}</td>`;
        }).join('');
        return `<tr>${cells}</tr>`;
    }).join('');
    
    html += `</tbody></table>`;
    
    container.innerHTML = html;
};