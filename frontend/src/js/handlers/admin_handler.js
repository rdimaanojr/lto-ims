import { adminApi } from '../api/admin_api.js';

const apiMap = {
    'form-driver': adminApi.addDriver,
    'form-model': adminApi.addModel,
    'form-vehicle': adminApi.addVehicle,
    'form-registration': adminApi.addRegistration,
    'form-violation': adminApi.addViolation
};

const handleAdminSubmit = async (form) => {
    const data = Object.fromEntries(new FormData(form));

    const apiFunction = apiMap[form.id];
    if (!apiFunction) return;

    const res = await apiFunction(data);
    if (res.status === 201) {
        alert("Successfully added entry!");
        form.reset();
        renderDataTables();
    } else {
        alert(res.data.error || 'Error adding entry');
    }
};

export const initAdminHandlers = () => {
    const app = document.getElementById('app');

    // tab logic
    app.addEventListener('click', (e) => {
        if (e.target.classList.contains('tab-link')) {
            const target = e.target.id === 'tab-view' ? 'view-records' : 'view-add';

            document.querySelectorAll('.tab-link').forEach(el => el.classList.remove('active'));
            document.querySelectorAll('.tab-content').forEach(el => el.classList.remove('active'));

            e.target.classList.add('active');
            document.getElementById(target).classList.add('active');

            if (target === 'view-records') renderDataTables();
        }
    });

    app.addEventListener('submit', (e) => {
        if (e.target.closest('form')) {
            e.preventDefault();
            handleAdminSubmit(e.target);
        }
    });
};

export const renderDataTables = async () => {
    const fetchAndRender = async (containerId, apiCall) => {
        const container = document.getElementById(containerId);
        if (!container) return;

        const response = await apiCall();
        const data = response.data || [];

        if (data.length === 0) {
            container.innerHTML = '<p>No records found.</p>';
            return;
        }

        const columns = Object.keys(data[0]);
        let content = `<table><thead><tr>${columns.map(c => `<th>${c}</th>`).join('')}</tr></thead><tbody>`;
        content += data.map(row => `<tr>${columns.map(c => `<td>${row[c] ?? '-'}</td>`).join('')}</tr>`).join('');
        content += `</tbody></table>`;
        container.innerHTML = content;
    };

    await fetchAndRender('table-drivers', adminApi.getAllDrivers);
    await fetchAndRender('table-models', adminApi.getAllModels);
    await fetchAndRender('table-vehicles', adminApi.getAllVehicles);
    await fetchAndRender('table-registrations', adminApi.getAllRegistrations);
    await fetchAndRender('table-violations', adminApi.getAllViolations);
};