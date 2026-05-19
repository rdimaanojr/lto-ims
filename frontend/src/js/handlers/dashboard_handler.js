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

const DEFAULT_PAGE_SIZE = 50;
const DATE_FIELDS = ['date_of_birth', 'issue_date', 'expiry_date', 'registration_date', 'expiration_date', 'date'];
const PAGINATED_REPORTS = new Set(['1', '2', '3', '4', '5', '7']);

const reportDataCache = new Map();
const tableState = {};

const clampYear = (value, min, max) => Math.min(max, Math.max(min, Number(value) || min));

const bindYearControl = (form) => {
    const range = form.querySelector('.year-range');
    const number = form.querySelector('.year-number');
    if (!range || !number) return;

    const min = Number(range.min);
    const max = Number(range.max);
    const sync = (source) => {
        const value = clampYear(source === range ? range.value : number.value, min, max);
        range.value = value;
        number.value = value;
    };

    range.addEventListener('input', () => sync(range));
    number.addEventListener('input', () => sync(number));
    number.addEventListener('blur', () => sync(number));
};

const openDatePicker = (input) => {
    if (typeof input.showPicker === 'function') {
        try {
            input.showPicker();
        } catch {
            input.focus();
        }
    }
};

const formatColumnName = (col) =>
    col.split('_').map((word) => word[0].toUpperCase() + word.slice(1)).join(' ');

const isNowrapColumn = (col) =>
    DATE_FIELDS.includes(col)
    || /date/i.test(col)
    || (/license|plate|vin|_number$|_id$/i.test(col) && !/^total_/i.test(col));

const getTableState = (id) => ({
    page: 1,
    pageSize: DEFAULT_PAGE_SIZE,
    ...tableState[id],
});

const setTableState = (id, patch) => {
    tableState[id] = { ...getTableState(id), ...patch };
};

const formatCell = (col, value) => {
    if (value == null || value === '') return '-';
    if (DATE_FIELDS.includes(col)) return parseDate(value);
    return value;
};

const setSlotVisible = (slot, visible) => {
    slot.querySelectorAll('.report-table-scroll, .report-pagination--bottom').forEach((el) => {
        el.classList.toggle('is-hidden', !visible);
    });
    slot.querySelector('.report-empty')?.classList.toggle('is-hidden', visible);
};

const updatePaginationUi = (slot, { total, rangeStart, rangeEnd, page, totalPages, pageSize }) => {
    const inactive = total === 0;

    slot.querySelectorAll('.report-count strong').forEach((el) => {
        el.textContent = total;
    });
    slot.querySelectorAll('.report-range').forEach((el) => {
        el.textContent = inactive ? 'Showing 0–0' : `Showing ${rangeStart}–${rangeEnd}`;
    });
    slot.querySelectorAll('.page-input').forEach((inp) => {
        inp.value = page;
        inp.min = 1;
        inp.max = totalPages;
        inp.disabled = inactive;
    });
    slot.querySelectorAll('.page-first, .page-prev').forEach((btn) => {
        btn.disabled = inactive || page <= 1;
    });
    slot.querySelectorAll('.page-next, .page-last').forEach((btn) => {
        btn.disabled = inactive || page >= totalPages;
    });
    const sizeSelect = slot.querySelector('.page-size-select');
    if (sizeSelect) sizeSelect.value = String(pageSize);
};

const renderReportTable = (id, data) => {
    const slot = document.getElementById(`table-${id}`);
    if (!slot) return;

    if (data.length === 0) {
        reportDataCache.delete(id);
        setSlotVisible(slot, false);
        slot.querySelector('.report-empty')?.classList.remove('is-hidden');
        if (PAGINATED_REPORTS.has(id)) {
            const { pageSize } = getTableState(id);
            updatePaginationUi(slot, {
                total: 0, rangeStart: 0, rangeEnd: 0, page: 1, totalPages: 1, pageSize,
            });
        }
        return;
    }

    reportDataCache.set(id, data);
    if (!tableState[id]) setTableState(id, { page: 1, pageSize: DEFAULT_PAGE_SIZE });
    else setTableState(id, { page: 1 });
    renderTableView(id);
};

const renderTableView = (id) => {
    const slot = document.getElementById(`table-${id}`);
    const data = reportDataCache.get(id);
    if (!slot || !data?.length) return;

    const table = slot.querySelector('.report-table');
    const thead = table.querySelector('thead');
    const tbody = table.querySelector('tbody');
    const columns = Object.keys(data[0]);
    const paginated = PAGINATED_REPORTS.has(id);
    const { page, pageSize } = getTableState(id);
    const total = data.length;
    const totalPages = paginated ? Math.max(1, Math.ceil(total / pageSize)) : 1;
    const safePage = paginated ? Math.min(page, totalPages) : 1;
    if (safePage !== page) setTableState(id, { page: safePage });

    const start = paginated ? (safePage - 1) * pageSize : 0;
    const end = paginated ? Math.min(start + pageSize, total) : total;
    const rows = data.slice(start, end);
    const rangeStart = paginated ? start + 1 : 1;
    const rangeEnd = end;

    setSlotVisible(slot, true);
    slot.querySelector('.report-empty')?.classList.add('is-hidden');

    if (paginated) {
        updatePaginationUi(slot, {
            total, rangeStart, rangeEnd, page: safePage, totalPages, pageSize,
        });
    }

    thead.innerHTML = `<tr>${columns.map((c) => {
        const nowrap = isNowrapColumn(c) ? ' class="nowrap"' : '';
        return `<th${nowrap}>${formatColumnName(c)}</th>`;
    }).join('')}</tr>`;

    tbody.innerHTML = rows.map((row) => {
        const cells = columns.map((c) => {
            const nowrap = isNowrapColumn(c) ? ' class="nowrap"' : '';
            return `<td${nowrap}>${formatCell(c, row[c])}</td>`;
        }).join('');
        return `<tr>${cells}</tr>`;
    }).join('');
};

export const initDashboardHandlers = () => {
    const app = document.getElementById('app');
    bindYearControl(document.getElementById('form-6'));

    document.querySelectorAll('.report-table-slot[data-paginated]').forEach((slot) => {
        updatePaginationUi(slot, {
            total: 0, rangeStart: 0, rangeEnd: 0, page: 1, totalPages: 1, pageSize: DEFAULT_PAGE_SIZE,
        });
    });

    app.addEventListener('click', (e) => {
        if (e.target.classList.contains('tab-link')) {
            const target = e.target.id.replace('tab', 'content');
            document.querySelectorAll('.tab-link').forEach((el) => el.classList.remove('active'));
            document.querySelectorAll('.tab-content').forEach((el) => el.classList.remove('active'));
            e.target.classList.add('active');
            document.getElementById(target).classList.add('active');
        }
    });

    app.addEventListener('submit', async (e) => {
        const form = e.target.closest('form');
        if (!form || !apiMap[form.id]) return;

        const formData = Object.fromEntries(new FormData(form));
        const res = await apiMap[form.id](formData);
        const reportId = form.id.replace('form-', '');
        const data = res.data || [];
        renderReportTable(reportId, data);
        if (data.length > 0) {
            document.getElementById(`table-${reportId}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });

    app.addEventListener('change', (e) => {
        const slot = e.target.closest('.report-table-slot');
        if (!slot) return;
        const id = slot.id.replace('table-', '');
        if (e.target.classList.contains('page-size-select')) {
            const pageSize = Number(e.target.value);
            setTableState(id, { pageSize, page: 1 });
            const data = reportDataCache.get(id);
            if (data?.length) renderTableView(id);
            else {
                updatePaginationUi(slot, {
                    total: 0, rangeStart: 0, rangeEnd: 0, page: 1, totalPages: 1, pageSize,
                });
            }
            return;
        }
        if (e.target.classList.contains('page-input')) {
            const data = reportDataCache.get(id);
            if (!data?.length) return;
            const totalPages = Math.max(1, Math.ceil(data.length / getTableState(id).pageSize));
            const page = Math.min(totalPages, Math.max(1, Number(e.target.value) || 1));
            setTableState(id, { page });
            renderTableView(id);
        }
    });

    app.addEventListener('input', (e) => {
        if (!e.target.classList.contains('page-input')) return;
        const slot = e.target.closest('.report-table-slot');
        if (!slot) return;
        const id = slot.id.replace('table-', '');
        const data = reportDataCache.get(id);
        if (!data?.length) return;
        const totalPages = Math.max(1, Math.ceil(data.length / getTableState(id).pageSize));
        const page = Math.min(totalPages, Math.max(1, Number(e.target.value) || 1));
        setTableState(id, { page });
        slot.querySelectorAll('.page-input').forEach((inp) => { inp.value = page; });
    });

    app.addEventListener('click', (e) => {
        if (e.target.classList.contains('age-reset-link')) {
            e.preventDefault();
            document.getElementById('minAgeNumber').value = '';
            document.getElementById('maxAgeNumber').value = '';
            return;
        }
        const dateInput = e.target.closest('input.date-input');
        if (dateInput) {
            openDatePicker(dateInput);
            return;
        }
        const slot = e.target.closest('.report-table-slot');
        if (!slot) return;
        const id = slot.id.replace('table-', '');
        const { page, pageSize } = getTableState(id);
        const data = reportDataCache.get(id);
        if (!data?.length) return;
        const totalPages = Math.max(1, Math.ceil(data.length / pageSize));
        if (e.target.classList.contains('page-first')) {
            setTableState(id, { page: 1 });
            renderTableView(id);
        }
        if (e.target.classList.contains('page-prev') && page > 1) {
            setTableState(id, { page: page - 1 });
            renderTableView(id);
        }
        if (e.target.classList.contains('page-next') && page < totalPages) {
            setTableState(id, { page: page + 1 });
            renderTableView(id);
        }
        if (e.target.classList.contains('page-last')) {
            setTableState(id, { page: totalPages });
            renderTableView(id);
        }
    });
};
