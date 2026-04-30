import { adminApi } from '../api/admin_api.js';
import { generate } from '../utils/user_utils.js';

const apiMap = {
    'form-driver': adminApi.addDriver,
    // 'form-model': adminApi.addModel,
    'form-vehicle': adminApi.addVehicle,
    'form-registration': adminApi.addRegistration,
    'form-violation': adminApi.addViolation
};

const fieldMap = {
    'license_number': generate.generateLicenseNumber,
    'full_name': generate.generateFullName,
    'date_of_birth': generate.generateDateOfBirth,
    'age': generate.generateAge,
    'address': generate.generateAddress,
    'issue_date': generate.generateIssueDate,
    'expiry_date': generate.generateExpiryDate
};

const randomFieldMap = {
    'license_number': generate.generateLicenseNumber,
    'full_name': generate.generateFullName,
    'date_of_birth': generate.generateDateOfBirth,
    'age': generate.generateAge,
    'address': generate.generateAddress,
    'issue_date': generate.generateIssueDate,
    'expiry_date': generate.generateExpiryDate,
    'model': generate.generateModel,
    'make': generate.generateVehicleMake,
    'vehicle_type': generate.generateVehicleType,
    'plate_number': generate.generatePlateNumber,
    'engine_number': generate.generateEngineNumber,
    'chassis_number': generate.generateChassisNumber,
    'year': generate.generateYear,
    'color': generate.generateColor,
    'registration_date': generate.generateRegistrationDate,
    'expiration_date': generate.generateExpirationDate,
    'violation_type': generate.generateViolationType,
    'date': generate.generateIssueDate,
    'location': generate.generateLocation,
    'apprehending_officer': generate.generateApprehendingOfficer,
    'fine_amount': generate.generateFineAmount
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

        if (e.target.classList.contains('random-btn')) {
            const field = e.target.dataset.field;
            const form = e.target.closest('form');
            const input = form.querySelector(`[name="${field}"]`);

            if (!input) return;

            let value;
            if (field === 'sex') {
                value = Math.random() > 0.5 ? 'M' : 'F';
            } else if (field === 'license_type') {
                const types = ['student', 'non-professional', 'professional'];
                value = types[Math.floor(Math.random() * types.length)];
            } else {
                const genFunc = randomFieldMap[field];
                if (genFunc) {
                    value = await genFunc();
                }
            }

            if (value !== undefined) {
                input.value = value;
            }
        }

        if (e.target.classList.contains('random-all-btn')) {
            const formId = e.target.dataset.form;
            const form = document.getElementById(`form-${formId}`);
            if (!form) return;

            let fields = [];
            if (formId === 'driver') {
                fields = ['license_number', 'full_name', 'date_of_birth', 'age', 'sex', 'address', 'license_type', 'issue_date', 'expiry_date'];
            } else if (formId === 'model') {
                fields = ['model', 'make', 'vehicle_type'];
            } else if (formId === 'vehicle') {
                fields = ['plate_number', 'engine_number', 'chassis_number', 'model', 'make', 'year', 'vehicle_type', 'color', 'license_number'];
            } else if (formId === 'registration') {
                fields = ['registration_date', 'expiration_date', 'plate_number'];
            } else if (formId === 'violation') {
                fields = ['violation_type', 'date', 'location', 'apprehending_officer', 'fine_amount', 'license_number', 'plate_number'];
            }

            for (const field of fields) {
                const input = form.querySelector(`[name="${field}"]`);
                if (!input) continue;

                let value;
                if (field === 'sex') {
                    value = Math.random() > 0.5 ? 'M' : 'F';
                } else if (field === 'license_type') {
                    const types = ['student', 'non-professional', 'professional'];
                    value = types[Math.floor(Math.random() * types.length)];
                } else {
                    const genFunc = randomFieldMap[field];
                    if (genFunc) {
                        value = await genFunc();
                    }
                }

                if (value !== undefined) {
                    input.value = value;
                }
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
    // await fetchAndRender('table-models', adminApi.getAllModels);
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