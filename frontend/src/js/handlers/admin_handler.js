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
            const targetId = e.target.id.replace('tab-', 'view-');
            const target = document.getElementById(targetId);

            if (!target) return;

            document.querySelectorAll('.tab-link').forEach(el => el.classList.remove('active'));
            document.querySelectorAll('.tab-content').forEach(el => el.classList.remove('active'));

            e.target.classList.add('active');
            target.classList.add('active');

            if (targetId === 'view-records') renderDataTables();
            if (targetId === 'view-accounts') renderAccountTables();
        }
    });

    app.addEventListener('submit', (e) => {
        if (e.target.closest('form')) {
            e.preventDefault();
            handleAdminSubmit(e.target);
        }
    });

    app.addEventListener('click', async (e) => {
        if (e.target.classList.contains('acc-btn')) {
            const action = e.target.dataset.action;
            const id = e.target.dataset.id;

            if (!confirm(`Are you sure you want to ${action} this account?`)) return;

            let res;
            if (action === 'approve') res = await adminApi.approveAccount(id);
            else if (action === 'reject') res = await adminApi.rejectAccount(id);
            else if (action === 'delete') res = await adminApi.deleteAccount(id);

            if (res && res.status === 200) {
                alert("Action successful!");
                renderAccountTables();
            } else {
                alert("Action failed.");
            }
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

export const renderAccountTables = async () => {
    const renderTable = async (containerId, apiCall, type) => {
        const container = document.getElementById(containerId);
        if (!container) return;

        const res = await apiCall();
        const data = Array.isArray(res.data) ? res.data : (res.data?.data || []);

        let html = `<table><thead><tr><th>ID</th><th>User</th><th>Role</th><th>Action</th></tr></thead><tbody>`;
        data.forEach(row => {
            html += `<tr>
                <td>${row.id}</td>
                <td>${row.username}</td>
                <td>${row.role}</td>
                <td>
                    ${type === 'pending'
                    ? `<button class="acc-btn" data-action="approve" data-id="${row.id}">Approve</button>
                        <button class="acc-btn" data-action="reject" data-id="${row.id}">Reject</button>`
                    : row.role !== 'admin'
                        ? `<button class="acc-btn" data-action="delete" data-id="${row.id}">Delete</button>`
                        : 'N/A'}
                </td>
            </tr>`;
        });
        container.innerHTML = html + `</tbody></table>`;
    };

    await renderTable('table-accounts-all', adminApi.getCurrentAccounts, 'all');
    await renderTable('table-accounts-pending', adminApi.getPendingAccounts, 'pending');
};