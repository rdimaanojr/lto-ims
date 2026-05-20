import { crudApi } from '../api/crud_api.js';

// State management for CRUD page
let currentEditData = null;
let currentEditType = null;

// Sorting state for each table
const sortState = {
    'crud-drivers': { column: null, direction: null },
    'crud-vehicles': { column: null, direction: null },
    'crud-registrations': { column: null, direction: null },
    'crud-violations': { column: null, direction: null }
};

// Pagination state for each table
const paginationState = {
    'crud-drivers': { page: 1, pageSize: 50, totalItems: 0, data: [], filteredData: [] },
    'crud-vehicles': { page: 1, pageSize: 50, totalItems: 0, data: [], filteredData: [] },
    'crud-registrations': { page: 1, pageSize: 50, totalItems: 0, data: [], filteredData: [] },
    'crud-violations': { page: 1, pageSize: 50, totalItems: 0, data: [], filteredData: [] }
};

// Helper to parse date to YYYY-MM-DD format
const parseDate = (dateValue) => {
    if (!dateValue) return '';
    if (/^\d{4}-\d{2}-\d{2}$/.test(dateValue)) return dateValue;
    const date = new Date(dateValue);
    if (isNaN(date.getTime())) return dateValue;
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
};

// Tab switching logic
const handleTabChange = (tabId) => {
    const tabs = document.querySelectorAll('.tabs .tab-link');
    const contents = document.querySelectorAll('.tab-content');

    tabs.forEach(tab => tab.classList.remove('active'));
    contents.forEach(content => content.classList.remove('active'));

    document.getElementById(tabId)?.classList.add('active');
    const viewId = tabId.replace('tab-', 'view-');
    document.getElementById(viewId)?.classList.add('active');

    switch (tabId) {
        case 'tab-drivers': loadDrivers(); break;
        case 'tab-vehicles': loadVehicles(); break;
        case 'tab-registrations': loadRegistrations(); break;
        case 'tab-violations': loadViolations(); break;
    }
};

// Load data functions
const loadDrivers = async () => {
    try {
        const res = await crudApi.getDrivers();
        const data = Array.isArray(res) ? res : (res.data || []);
        const state = paginationState['crud-drivers'];
        state.data = data;
        state.filteredData = data;
        state.totalItems = data.length;
        state.page = 1;
        renderPaginatedTable('crud-drivers', [
            { key: 'license_number', label: 'License Number', nowrap: true },
            { key: 'full_name', label: 'Full Name' },
            { key: 'date_of_birth', label: 'Date of Birth', nowrap: true, formatDate: true },
            { key: 'sex', label: 'Sex', nowrap: true },
            { key: 'address', label: 'Address' },
            { key: 'license_type', label: 'License Type', nowrap: true },
            { key: 'license_status', label: 'Status', nowrap: true },
            { key: 'issue_date', label: 'Issue Date', nowrap: true, formatDate: true },
            { key: 'expiry_date', label: 'Expiry Date', nowrap: true, formatDate: true }
        ], 'license_number', 'driver');
    } catch (err) {
        console.error('Error loading drivers:', err);
    }
};

const loadVehicles = async () => {
    try {
        const res = await crudApi.getVehicles();
        const data = Array.isArray(res) ? res : (res.data || []);
        const state = paginationState['crud-vehicles'];
        state.data = data;
        state.filteredData = data;
        state.totalItems = data.length;
        state.page = 1;
        renderPaginatedTable('crud-vehicles', [
            { key: 'plate_number', label: 'Plate Number', nowrap: true },
            { key: 'model', label: 'Model' },
            { key: 'make', label: 'Make' },
            { key: 'year', label: 'Year', nowrap: true },
            { key: 'vehicle_type', label: 'Type', nowrap: true },
            { key: 'color', label: 'Color', nowrap: true },
            { key: 'license_number', label: 'Owner License', nowrap: true }
        ], 'plate_number', 'vehicle');
    } catch (err) {
        console.error('Error loading vehicles:', err);
    }
};

const loadRegistrations = async () => {
    try {
        const res = await crudApi.getRegistrations();
        const data = Array.isArray(res) ? res : (res.data || []);
        const state = paginationState['crud-registrations'];
        state.data = data;
        state.filteredData = data;
        state.totalItems = data.length;
        state.page = 1;
        renderPaginatedTable('crud-registrations', [
            { key: 'registration_number', label: 'Reg. Number', nowrap: true },
            { key: 'plate_number', label: 'Plate Number', nowrap: true },
            { key: 'registration_date', label: 'Reg. Date', nowrap: true, formatDate: true },
            { key: 'expiration_date', label: 'Expiration', nowrap: true, formatDate: true },
            { key: 'registration_status', label: 'Status', nowrap: true }
        ], 'registration_number', 'registration');
    } catch (err) {
        console.error('Error loading registrations:', err);
    }
};

const loadViolations = async () => {
    try {
        const res = await crudApi.getViolations();
        const data = Array.isArray(res) ? res : (res.data || []);
        const state = paginationState['crud-violations'];
        state.data = data;
        state.filteredData = data;
        state.totalItems = data.length;
        state.page = 1;
        renderPaginatedTable('crud-violations', [
            { key: 'violation_id', label: 'ID', nowrap: true },
            { key: 'violation_type', label: 'Violation' },
            { key: 'date', label: 'Date', nowrap: true, formatDate: true },
            { key: 'location', label: 'Location' },
            { key: 'fine_amount', label: 'Fine', nowrap: true },
            { key: 'violation_status', label: 'Status', nowrap: true },
            { key: 'license_number', label: 'License #', nowrap: true },
            { key: 'plate_number', label: 'Plate #', nowrap: true }
        ], 'violation_id', 'violation');
    } catch (err) {
        console.error('Error loading violations:', err);
    }
};

// Pagination functions
const getPageData = (tableId) => {
    const state = paginationState[tableId];
    if (!state) return [];
    const data = state.filteredData.length > 0 ? state.filteredData : state.data;
    const start = (state.page - 1) * state.pageSize;
    const end = start + state.pageSize;
    return data.slice(start, end);
};

const getTotalPages = (tableId) => {
    const state = paginationState[tableId];
    if (!state) return 0;
    const total = state.filteredData.length > 0 ? state.filteredData.length : state.totalItems;
    return Math.ceil(total / state.pageSize);
};

const updatePaginationUI = (tableId) => {
    const state = paginationState[tableId];
    const container = document.getElementById(`table-${tableId}`);
    if (!container) return;

    const total = state.filteredData.length > 0 ? state.filteredData.length : state.totalItems;
    const totalPages = getTotalPages(tableId);
    const start = total === 0 ? 0 : (state.page - 1) * state.pageSize + 1;
    const end = Math.min(state.page * state.pageSize, total);

    // Update count and range in top pagination
    const countEl = container.querySelector('.report-count strong');
    const rangeEl = container.querySelector('.report-range');
    if (countEl) countEl.textContent = total;
    if (rangeEl) rangeEl.textContent = `Showing ${start}–${end}`;

    // Update page inputs in both top and bottom pagination
    const pageInputs = container.querySelectorAll('.page-input');
    pageInputs.forEach(input => {
        input.value = state.page;
        input.disabled = totalPages <= 1;
    });

    // Update button states in both pagination sections
    container.querySelectorAll('.page-first, .page-prev').forEach(btn => {
        btn.disabled = state.page <= 1;
    });
    container.querySelectorAll('.page-next, .page-last').forEach(btn => {
        btn.disabled = state.page >= totalPages;
    });

    // Update page size select
    const pageSizeSelect = container.querySelector('.page-size-select');
    if (pageSizeSelect) pageSizeSelect.value = state.pageSize;

    // Always show bottom pagination
    const bottomPagination = container.querySelector('.report-pagination--bottom');
    if (bottomPagination) {
        bottomPagination.classList.remove('is-hidden');
    }
};

const handlePageChange = (tableId, newPage) => {
    const totalPages = getTotalPages(tableId);
    if (newPage < 1 || newPage > totalPages) return;
    paginationState[tableId].page = newPage;
    const columns = getColumnsForTable(tableId);
    const primaryKey = getPrimaryKeyForTable(tableId);
    const type = getTypeForTable(tableId);
    renderTableWithPagination(tableId, getPageData(tableId), columns, primaryKey, type);
    updatePaginationUI(tableId);
};

// Helper functions to get table config
const getColumnsForTable = (tableId) => {
    const configs = {
        'crud-drivers': [
            { key: 'license_number', label: 'License Number', nowrap: true },
            { key: 'full_name', label: 'Full Name' },
            { key: 'date_of_birth', label: 'Date of Birth', nowrap: true, formatDate: true },
            { key: 'sex', label: 'Sex', nowrap: true },
            { key: 'address', label: 'Address' },
            { key: 'license_type', label: 'License Type', nowrap: true },
            { key: 'license_status', label: 'Status', nowrap: true },
            { key: 'issue_date', label: 'Issue Date', nowrap: true, formatDate: true },
            { key: 'expiry_date', label: 'Expiry Date', nowrap: true, formatDate: true }
        ],
        'crud-vehicles': [
            { key: 'plate_number', label: 'Plate Number', nowrap: true },
            { key: 'model', label: 'Model' },
            { key: 'make', label: 'Make' },
            { key: 'year', label: 'Year', nowrap: true },
            { key: 'vehicle_type', label: 'Type', nowrap: true },
            { key: 'color', label: 'Color', nowrap: true },
            { key: 'license_number', label: 'Owner License', nowrap: true }
        ],
        'crud-registrations': [
            { key: 'registration_number', label: 'Reg. Number', nowrap: true },
            { key: 'plate_number', label: 'Plate Number', nowrap: true },
            { key: 'registration_date', label: 'Reg. Date', nowrap: true, formatDate: true },
            { key: 'expiration_date', label: 'Expiration', nowrap: true, formatDate: true },
            { key: 'registration_status', label: 'Status', nowrap: true }
        ],
        'crud-violations': [
            { key: 'violation_id', label: 'ID', nowrap: true },
            { key: 'violation_type', label: 'Violation' },
            { key: 'date', label: 'Date', nowrap: true, formatDate: true },
            { key: 'location', label: 'Location' },
            { key: 'fine_amount', label: 'Fine', nowrap: true },
            { key: 'violation_status', label: 'Status', nowrap: true },
            { key: 'license_number', label: 'License #', nowrap: true },
            { key: 'plate_number', label: 'Plate #', nowrap: true }
        ]
    };
    return configs[tableId] || [];
};

const getPrimaryKeyForTable = (tableId) => {
    const keys = {
        'crud-drivers': 'license_number',
        'crud-vehicles': 'plate_number',
        'crud-registrations': 'registration_number',
        'crud-violations': 'violation_id'
    };
    return keys[tableId] || 'id';
};

const getTypeForTable = (tableId) => {
    const types = {
        'crud-drivers': 'driver',
        'crud-vehicles': 'vehicle',
        'crud-registrations': 'registration',
        'crud-violations': 'violation'
    };
    return types[tableId] || 'unknown';
};

// Render table functions
const renderPaginatedTable = (tableId, columns, primaryKey, type) => {
    const state = paginationState[tableId];
    renderTableWithPagination(tableId, getPageData(tableId), columns, primaryKey, type);
    updatePaginationUI(tableId);
};

const renderTableWithPagination = (tableId, pageData, columns, primaryKey, type) => {
    const container = document.getElementById(`table-${tableId}`);
    if (!container) return;

    const tableSlot = container.closest('.report-table-slot');
    const tableScroll = tableSlot?.querySelector('.report-table-scroll');
    const emptyMsg = tableSlot?.querySelector('.report-empty');

    if (!tableScroll || !emptyMsg) return;

    const state = paginationState[tableId];
    const total = state.filteredData.length > 0 ? state.filteredData.length : state.totalItems;

    if (total === 0) {
        emptyMsg.classList.remove('is-hidden');
        tableScroll.classList.add('is-hidden');
        return;
    }

    emptyMsg.classList.add('is-hidden');
    tableScroll.classList.remove('is-hidden');

    const table = tableScroll.querySelector('table');
    if (!table) return;

    const currentSort = sortState[tableId];

    let html = `<thead><tr>`;
    columns.forEach(col => {
        const isSorted = currentSort.column === col.key;
        const sortClass = isSorted ? `sortable sort-${currentSort.direction}` : 'sortable';
        html += `<th class="${sortClass}" data-column="${col.key}">${col.label}</th>`;
    });
    html += `<th style="width: 120px;">Actions</th></tr></thead><tbody>`;

    pageData.forEach(row => {
        html += `<tr>`;
        columns.forEach(col => {
            let value = row[col.key];
            if (col.formatDate && value) {
                value = parseDate(value);
            }
            const nowrap = col.nowrap ? ' class="nowrap"' : '';
            html += `<td${nowrap}>${value !== null && value !== undefined ? value : '-'}</td>`;
        });
        html += `<td class="actions-cell">
            <button class="btn-edit" data-type="${type}" data-id="${row[primaryKey]}" title="Edit">Edit</button>
            <button class="btn-delete" data-type="${type}" data-id="${row[primaryKey]}" title="Delete">Delete</button>
        </td></tr>`;
    });

    html += `</tbody></table>`;
    table.innerHTML = html;
};

// Form submission handlers
const handleFormSubmit = async (e) => {
    e.preventDefault();
    const form = e.target;
    const formData = new FormData(form);
    const submittedData = Object.fromEntries(formData.entries());
    const formType = submittedData['form-type'];

    delete submittedData['form-type'];

    const data = currentEditData && currentEditType === formType
        ? { ...currentEditData, ...submittedData }
        : submittedData;

    if (data.year) data.year = parseInt(data.year);
    if (data.fine_amount) data.fine_amount = parseFloat(data.fine_amount);

    try {
        let res;
        let message;

        if (currentEditData && currentEditType === formType) {
            switch (formType) {
                case 'driver': res = await crudApi.updateDriver(data); message = 'Driver updated successfully'; break;
                case 'vehicle': res = await crudApi.updateVehicle(data); message = 'Vehicle updated successfully'; break;
                case 'registration': res = await crudApi.updateRegistration(data); message = 'Registration updated successfully'; break;
                case 'violation': res = await crudApi.updateViolation(data); message = 'Violation updated successfully'; break;
            }
            closeModal();
            currentEditData = null;
            currentEditType = null;
        } else {
            switch (formType) {
                case 'driver': res = await crudApi.addDriver(data); message = 'Driver added successfully'; break;
                case 'vehicle': res = await crudApi.addVehicle(data); message = 'Vehicle added successfully'; break;
                case 'registration': res = await crudApi.addRegistration(data); message = 'Registration added successfully'; break;
                case 'violation': res = await crudApi.addViolation(data); message = 'Violation added successfully'; break;
            }
        }

        if (res.status >= 200 && res.status < 300) {
            alert(message);
            form.reset();
            switch (formType) {
                case 'driver': loadDrivers(); break;
                case 'vehicle': loadVehicles(); break;
                case 'registration': loadRegistrations(); break;
                case 'violation': loadViolations(); break;
            }
        } else {
            alert(res.data?.error || 'Error saving record');
        }
    } catch (err) {
        console.error('Error saving record:', err);
        alert('Error saving record: ' + (err.message || 'Unknown error'));
    }
};

// Edit and delete handlers
const unwrapApiResponse = (response) => {
    if (!response) return null;
    if (Array.isArray(response)) return response;
    if (response.data !== undefined) return response.data;
    return response;
};

const handleEdit = async (type, id) => {
    try {
        let response;
        switch (type) {
            case 'driver': response = await crudApi.getDriver(id); break;
            case 'vehicle': response = await crudApi.getVehicle(id); break;
            case 'registration': response = await crudApi.getRegistration(id); break;
            case 'violation': response = await crudApi.getViolation(id); break;
        }

        const data = unwrapApiResponse(response);
        if (data) {
            currentEditData = data;
            currentEditType = type;
            showEditModal(type, data);
        }
    } catch (err) {
        console.error('Error fetching record:', err);
        alert('Error fetching record');
    }
};

const handleDelete = async (type, id) => {
    if (!confirm('Are you sure you want to delete this record? This action cannot be undone.')) {
        return;
    }

    try {
        let res;
        let message;

        switch (type) {
            case 'driver': res = await crudApi.deleteDriver(id); message = 'Driver deleted successfully'; break;
            case 'vehicle': res = await crudApi.deleteVehicle(id); message = 'Vehicle deleted successfully'; break;
            case 'registration': res = await crudApi.deleteRegistration(id); message = 'Registration deleted successfully'; break;
            case 'violation': res = await crudApi.deleteViolation(id); message = 'Violation deleted successfully'; break;
        }

        if (res.status >= 200 && res.status < 300) {
            alert(message);
            switch (type) {
                case 'driver': loadDrivers(); break;
                case 'vehicle': loadVehicles(); break;
                case 'registration': loadRegistrations(); break;
                case 'violation': loadViolations(); break;
            }
        } else {
            alert(res.data?.error || 'Error deleting record');
        }
    } catch (err) {
        console.error('Error deleting record:', err);
        alert('Error deleting record: ' + (err.message || 'Unknown error'));
    }
};

// Modal functions
const showEditModal = (type, data) => {
    const modal = document.getElementById('edit-modal');
    const modalBody = document.getElementById('modal-body');

    let formHtml = `<form id="crud-edit-form" class="crud-form">`;
    formHtml += `<input type="hidden" name="form-type" value="${type}">`;

    switch (type) {
        case 'driver':
            formHtml += `
                <div class="form-row">
                    <div class="form-group">
                        <label>Full Name <span class="required">*</span></label>
                        <input type="text" name="full_name" value="${data.full_name || ''}" required>
                    </div>
                    <div class="form-group">
                        <label>Date of Birth <span class="required">*</span></label>
                        <input type="date" name="date_of_birth" value="${parseDate(data.date_of_birth)}" required>
                    </div>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label>Sex <span class="required">*</span></label>
                        <select name="sex" required>
                            <option value="M" ${data.sex === 'M' ? 'selected' : ''}>Male</option>
                            <option value="F" ${data.sex === 'F' ? 'selected' : ''}>Female</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label>License Type <span class="required">*</span></label>
                        <select name="license_type" required>
                            <option value="student" ${data.license_type === 'student' ? 'selected' : ''}>Student</option>
                            <option value="non-professional" ${data.license_type === 'non-professional' ? 'selected' : ''}>Non-Professional</option>
                            <option value="professional" ${data.license_type === 'professional' ? 'selected' : ''}>Professional</option>
                        </select>
                    </div>
                </div>
                <div class="form-group">
                    <label>Address</label>
                    <input type="text" name="address" value="${data.address || ''}">
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label>Issue Date <span class="required">*</span></label>
                        <input type="date" name="issue_date" value="${parseDate(data.issue_date)}" required>
                    </div>
                    <div class="form-group">
                        <label>Expiry Date <span class="required">*</span></label>
                        <input type="date" name="expiry_date" value="${parseDate(data.expiry_date)}" required>
                    </div>
                </div>
            `;
            break;

        case 'vehicle':
            formHtml += `
                <div class="form-row">
                    <div class="form-group">
                        <label>Model <span class="required">*</span></label>
                        <input type="text" name="model" value="${data.model || ''}" required>
                    </div>
                    <div class="form-group">
                        <label>Make <span class="required">*</span></label>
                        <input type="text" name="make" value="${data.make || ''}" required>
                    </div>
                    <div class="form-group">
                        <label>Engine Number <span class="required">*</span></label>
                        <input type="text" name="engine_number" value="${data.engine_number || ''}" required>
                    </div>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label>Chassis Number <span class="required">*</span></label>
                        <input type="text" name="chassis_number" value="${data.chassis_number || ''}" required>
                    </div>
                    <div class="form-group">
                        <label>Vehicle Type <span class="required">*</span></label>
                        <select name="vehicle_type" required>
                            <option value="sedan" ${data.vehicle_type === 'sedan' ? 'selected' : ''}>Sedan</option>
                            <option value="suv" ${data.vehicle_type === 'suv' ? 'selected' : ''}>SUV</option>
                            <option value="truck" ${data.vehicle_type === 'truck' ? 'selected' : ''}>Truck</option>
                            <option value="van" ${data.vehicle_type === 'van' ? 'selected' : ''}>Van</option>
                            <option value="motorcycle" ${data.vehicle_type === 'motorcycle' ? 'selected' : ''}>Motorcycle</option>
                            <option value="bus" ${data.vehicle_type === 'bus' ? 'selected' : ''}>Bus</option>
                            <option value="other" ${data.vehicle_type === 'other' ? 'selected' : ''}>Other</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label>Year <span class="required">*</span></label>
                        <input type="number" name="year" value="${data.year || ''}" required min="1900" max="2030">
                    </div>
                </div>
                <div class="form-group">
                    <label>Color</label>
                    <input type="text" name="color" value="${data.color || ''}">
                </div>
            `;
            break;

        case 'registration':
            formHtml += `
                <div class="form-row">
                    <div class="form-group">
                        <label>Registration Date <span class="required">*</span></label>
                        <input type="date" name="registration_date" value="${parseDate(data.registration_date)}" required>
                    </div>
                    <div class="form-group">
                        <label>Expiration Date <span class="required">*</span></label>
                        <input type="date" name="expiration_date" value="${parseDate(data.expiration_date)}" required>
                    </div>
                    <div class="form-group">
                        <label>Status <span class="required">*</span></label>
                        <select name="registration_status" required>
                            <option value="active" ${data.registration_status === 'active' ? 'selected' : ''}>Active</option>
                            <option value="expired" ${data.registration_status === 'expired' ? 'selected' : ''}>Expired</option>
                            <option value="pending" ${data.registration_status === 'pending' ? 'selected' : ''}>Pending</option>
                            <option value="cancelled" ${data.registration_status === 'cancelled' ? 'selected' : ''}>Cancelled</option>
                        </select>
                    </div>
                </div>
            `;
            break;

        case 'violation':
            formHtml += `
                <div class="form-row">
                    <div class="form-group">
                        <label>Violation Type <span class="required">*</span></label>
                        <select name="violation_type" required>
                            <option value="speeding" ${data.violation_type === 'speeding' ? 'selected' : ''}>Speeding</option>
                            <option value="reckless driving" ${data.violation_type === 'reckless driving' ? 'selected' : ''}>Reckless Driving</option>
                            <option value="no license" ${data.violation_type === 'no license' ? 'selected' : ''}>No License</option>
                            <option value="expired registration" ${data.violation_type === 'expired registration' ? 'selected' : ''}>Expired Registration</option>
                            <option value="illegal parking" ${data.violation_type === 'illegal parking' ? 'selected' : ''}>Illegal Parking</option>
                            <option value="running red light" ${data.violation_type === 'running red light' ? 'selected' : ''}>Running Red Light</option>
                            <option value="no helmet" ${data.violation_type === 'no helmet' ? 'selected' : ''}>No Helmet</option>
                            <option value="overloading" ${data.violation_type === 'overloading' ? 'selected' : ''}>Overloading</option>
                            <option value="other" ${data.violation_type === 'other' ? 'selected' : ''}>Other</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label>Date <span class="required">*</span></label>
                        <input type="date" name="date" value="${parseDate(data.date)}" required>
                    </div>
                </div>
                <div class="form-group">
                    <label>Location <span class="required">*</span></label>
                    <input type="text" name="location" value="${data.location || ''}" required>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label>Apprehending Officer</label>
                        <input type="text" name="apprehending_officer" value="${data.apprehending_officer || ''}">
                    </div>
                    <div class="form-group">
                        <label>Fine Amount</label>
                        <input type="number" name="fine_amount" step="0.01" min="0" value="${data.fine_amount || 0}">
                    </div>
                    <div class="form-group">
                        <label>Status <span class="required">*</span></label>
                        <select name="violation_status" required>
                            <option value="unpaid" ${data.violation_status === 'unpaid' ? 'selected' : ''}>Unpaid</option>
                            <option value="paid" ${data.violation_status === 'paid' ? 'selected' : ''}>Paid</option>
                            <option value="contested" ${data.violation_status === 'contested' ? 'selected' : ''}>Contested</option>
                        </select>
                    </div>
                </div>
            `;
            break;
    }

    formHtml += `
        <div class="form-actions">
            <button type="submit" class="btn-primary">Update Record</button>
            <button type="button" class="btn-secondary" onclick="closeModal()">Cancel</button>
        </div>
        </form>
    `;

    modalBody.innerHTML = formHtml;
    modal.classList.remove('is-hidden');
};

const closeModal = () => {
    const modal = document.getElementById('edit-modal');
    modal.classList.add('is-hidden');
    currentEditData = null;
    currentEditType = null;
};

// Page size change handler
const handlePageSizeChange = (tableId, newSize) => {
    paginationState[tableId].pageSize = parseInt(newSize);
    paginationState[tableId].page = 1;
    const columns = getColumnsForTable(tableId);
    const primaryKey = getPrimaryKeyForTable(tableId);
    const type = getTypeForTable(tableId);
    renderTableWithPagination(tableId, getPageData(tableId), columns, primaryKey, type);
    updatePaginationUI(tableId);
};

// Sorting functionality
const handleSort = (tableId, column) => {
    const state = paginationState[tableId];
    if (!state) return;

    const currentSort = sortState[tableId];
    
    // Toggle direction or set new column
    if (currentSort.column === column) {
        if (currentSort.direction === 'asc') {
            currentSort.direction = 'desc';
        } else if (currentSort.direction === 'desc') {
            currentSort.column = null;
            currentSort.direction = null;
        }
    } else {
        currentSort.column = column;
        currentSort.direction = 'asc';
    }

    // Apply sorting to filtered data or all data
    const dataToSort = state.filteredData.length > 0 ? [...state.filteredData] : [...state.data];
    
    if (currentSort.column && currentSort.direction) {
        dataToSort.sort((a, b) => {
            let valA = a[column] || '';
            let valB = b[column] || '';
            
            // Handle numbers
            if (typeof valA === 'number' && typeof valB === 'number') {
                return currentSort.direction === 'asc' ? valA - valB : valB - valA;
            }
            
            // Handle strings
            valA = String(valA).toLowerCase();
            valB = String(valB).toLowerCase();
            
            if (valA < valB) return currentSort.direction === 'asc' ? -1 : 1;
            if (valA > valB) return currentSort.direction === 'asc' ? 1 : -1;
            return 0;
        });
        
        // Update the filtered data
        if (state.filteredData.length > 0) {
            state.filteredData = dataToSort;
        } else {
            // If no filter active, we need to re-render with sorted data
            // Store sorted data temporarily
            state.sortedData = dataToSort;
        }
    } else {
        // Reset to original order
        if (state.filteredData.length > 0) {
            // Re-apply filter to get original order
            state.filteredData = state.data.filter(() => true);
        }
        delete state.sortedData;
    }

    state.page = 1;
    const columns = getColumnsForTable(tableId);
    const primaryKey = getPrimaryKeyForTable(tableId);
    const entityType = getTypeForTable(tableId);
    renderTableWithPagination(tableId, getPageData(tableId), columns, primaryKey, entityType);
    updatePaginationUI(tableId);
};

// Search functionality - simple client-side filtering
const handleSearch = (searchTerm, type) => {
    // Map search input IDs to table IDs
    const tableIdMap = {
        'drivers': 'crud-drivers',
        'vehicles': 'crud-vehicles',
        'registrations': 'crud-registrations',
        'violations': 'crud-violations'
    };
    const tableId = tableIdMap[type];
    const state = paginationState[tableId];
    if (!state) return;

    const term = searchTerm.toLowerCase().trim();
    
    if (!term) {
        // Clear filter - show all data
        state.filteredData = [];
        state.page = 1;
    } else {
        // Filter data
        state.filteredData = state.data.filter(row => {
            return Object.values(row).some(val => 
                String(val || '').toLowerCase().includes(term)
            );
        });
        state.page = 1;
    }

    // Reset sort when searching
    sortState[tableId].column = null;
    sortState[tableId].direction = null;

    const columns = getColumnsForTable(tableId);
    const primaryKey = getPrimaryKeyForTable(tableId);
    const entityType = getTypeForTable(tableId);
    renderTableWithPagination(tableId, getPageData(tableId), columns, primaryKey, entityType);
    updatePaginationUI(tableId);
};

// Initialization
export const initCRUDHandlers = () => {
    const app = document.getElementById('app');

    // Tab switching
    app.addEventListener('click', (e) => {
        if (e.target.classList.contains('tab-link')) {
            handleTabChange(e.target.id);
        }
    });

    // Form submissions
    app.addEventListener('submit', (e) => {
        const form = e.target.closest('form.crud-form');
        if (form) {
            e.preventDefault();
            handleFormSubmit(e);
        }
    });

    // Central click handler for all buttons
    app.addEventListener('click', (e) => {
        // Sortable header click
        if (e.target.classList.contains('sortable')) {
            const tableSlot = e.target.closest('.report-table-slot');
            const tableId = tableSlot?.id?.replace('table-', '');
            const column = e.target.dataset.column;
            if (tableId && column) {
                handleSort(tableId, column);
            }
            return;
        }

        // Search Go button - handle first to prevent bubbling
        if (e.target.classList.contains('search-go-btn')) {
            e.preventDefault();
            e.stopPropagation();
            const searchBar = e.target.closest('.search-bar');
            const input = searchBar?.querySelector('.search-input');
            if (input) {
                const searchId = input.id;
                const type = searchId.replace('search-', '');
                handleSearch(input.value, type);
            }
            return;
        }

        // Edit button
        if (e.target.classList.contains('btn-edit')) {
            const type = e.target.dataset.type;
            const id = e.target.dataset.id;
            handleEdit(type, id);
            return;
        }

        // Delete button
        if (e.target.classList.contains('btn-delete')) {
            const type = e.target.dataset.type;
            const id = e.target.dataset.id;
            handleDelete(type, id);
            return;
        }

        // Modal close
        if (e.target.classList.contains('modal-close') || e.target.classList.contains('modal-overlay')) {
            closeModal();
            return;
        }

        // Pagination buttons
        const tableSlot = e.target.closest('.report-table-slot');
        if (tableSlot) {
            const tableId = tableSlot.id.replace('table-', '');
            
            if (e.target.classList.contains('page-first')) {
                if (paginationState[tableId]) handlePageChange(tableId, 1);
                return;
            }
            if (e.target.classList.contains('page-prev')) {
                if (paginationState[tableId]) {
                    const state = paginationState[tableId];
                    handlePageChange(tableId, state.page - 1);
                }
                return;
            }
            if (e.target.classList.contains('page-next')) {
                if (paginationState[tableId]) {
                    const state = paginationState[tableId];
                    handlePageChange(tableId, state.page + 1);
                }
                return;
            }
            if (e.target.classList.contains('page-last')) {
                if (paginationState[tableId]) {
                    const totalPages = getTotalPages(tableId);
                    handlePageChange(tableId, totalPages);
                }
                return;
            }
            if (e.target.classList.contains('page-go-btn')) {
                if (paginationState[tableId]) {
                    const input = e.target.parentElement.querySelector('.page-input');
                    if (input) handlePageChange(tableId, parseInt(input.value));
                }
                return;
            }
        }
    });

    // Page input enter key (for bottom pagination)
    app.addEventListener('keypress', (e) => {
        if (e.target.classList.contains('page-input') && e.key === 'Enter') {
            const tableSlot = e.target.closest('.report-table-slot');
            const tableId = tableSlot?.id?.replace('table-', '');
            if (tableId) handlePageChange(tableId, parseInt(e.target.value));
        }
    });

    // Page size change (top pagination only)
    app.addEventListener('change', (e) => {
        if (e.target.classList.contains('page-size-select')) {
            const tableSlot = e.target.closest('.report-table-slot');
            const tableId = tableSlot?.id?.replace('table-', '');
            if (tableId) handlePageSizeChange(tableId, e.target.value);
        }
    });

    // Search on Enter key
    app.addEventListener('keypress', (e) => {
        if (e.target.classList.contains('search-input') && e.key === 'Enter') {
            e.preventDefault();
            e.stopPropagation();
            const searchId = e.target.id;
            const type = searchId.replace('search-', '');
            handleSearch(e.target.value, type);
        }
    });

    // Load initial data
    loadDrivers();
};
