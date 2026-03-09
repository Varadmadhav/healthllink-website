// ===== Global Data Storage =====
const API_BASE = "http://localhost:5000/api";
let uploadedFiles = []; // Array of uploaded Excel files with their data
let centersData = [];
let companiesData = [];
let selectedFileId = null; // Currently selected file for viewing

// ===== Initialize Application =====
document.addEventListener('DOMContentLoaded', function() {
    initializeTabs()
    initializeFileUpload()
    initializeDragAndDrop()

    fetchCompanies()
    fetchCenters()

    renderAllTables()
})
// ===== Tab Navigation =====
function initializeTabs() {
    const tabs = document.querySelectorAll('.nav-tab');
    const contents = document.querySelectorAll('.tab-content');
    
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const targetId = tab.dataset.tab;
            
            // Update active tab
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            
            // Update active content
            contents.forEach(content => {
                content.classList.remove('active');
                if (content.id === targetId) {
                    content.classList.add('active');
                }
            });
            
            // Refresh data when switching tabs
            refreshTabData(targetId);
        });
    });
}

function refreshTabData(tabId) {
    switch(tabId) {
        case 'review-requests':
            renderExcelFilesGrid();
            break;
        case 'make-confirmation':
            renderConfirmationTable();
            renderConfirmedTable();
            updateStats();
            break;
        case 'reports':
            renderReportsTable();
            break;
        case 'add-centers':
            renderCentersTable();
            break;
        case 'add-companies':
            renderCompaniesTable();
            break;
    }
}

// ===== File Upload Handling =====
function initializeFileUpload() {
    const fileInput = document.getElementById('excel-upload');
    
    fileInput.addEventListener('change', function(e) {
        const file = e.target.files[0];
        if (file) {
            handleExcelUpload(file);
        }
    });
}

function initializeDragAndDrop() {
    const uploadZone = document.getElementById('upload-zone');
    
    uploadZone.addEventListener('dragover', (e) => {
        e.preventDefault();
        uploadZone.classList.add('dragover');
    });
    
    uploadZone.addEventListener('dragleave', () => {
        uploadZone.classList.remove('dragover');
    });
    
    uploadZone.addEventListener('drop', (e) => {
        e.preventDefault();
        uploadZone.classList.remove('dragover');
        
        const file = e.dataTransfer.files[0];
        if (file && (file.name.endsWith('.xlsx') || file.name.endsWith('.xls'))) {
            handleExcelUpload(file);
        } else {
            showToast('Please upload a valid Excel file (.xlsx or .xls)', 'error');
        }
    });
    
    uploadZone.addEventListener('click', (e) => {
        if (e.target.tagName !== 'BUTTON') {
            document.getElementById('excel-upload').click();
        }
    });
}

function handleExcelUpload(file) {
    // Show progress
    document.getElementById('upload-zone').style.display = 'none';
    document.getElementById('upload-progress').style.display = 'block';
    document.getElementById('upload-status').style.display = 'none';
    
    const reader = new FileReader();
    
    reader.onload = function(e) {
        try {
            const data = new Uint8Array(e.target.result);
            const workbook = XLSX.read(data, { type: 'array' });
            const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
            const jsonData = XLSX.utils.sheet_to_json(firstSheet);
            
            // Create file object with employees
            const fileId = Date.now();
            const processedEmployees = jsonData.map((row, index) => ({
                id: fileId + '_' + index,
                employeeName: row['Employee Name'] || row['Name'] || row['EmployeeName'] || row['employee_name'] || '',
                employeeId: row['Employee ID'] || row['EmployeeID'] || row['EmpID'] || row['employee_id'] || `EMP${1000 + index}`,
                age: row['Age'] || row['age'] || Math.floor(Math.random() * 30) + 25,
                gender: row['Gender'] || row['gender'] || (Math.random() > 0.5 ? 'Male' : 'Female'),
                phone: row['Phone'] || row['Mobile'] || row['Contact'] || row['phone'] || generatePhone(),
                company: row['Company'] || row['CompanyName'] || row['company'] || 'Unknown Company',
                pincode: String(row['Pincode'] || row['PIN'] || row['ZipCode'] || row['pincode'] || generatePincode()),
                status: 'pending',
                assignedCenter: null,
                reports: []
            }));
            
            const uploadedFile = {
                id: fileId,
                fileName: file.name,
                uploadDate: new Date().toLocaleString(),
                uploadTimestamp: Date.now(),
                records: processedEmployees.length,
                employees: processedEmployees,
                status: 'new'
            };
            
            uploadedFiles.push(uploadedFile);
            
            // Hide progress, show success
            setTimeout(() => {
                document.getElementById('upload-progress').style.display = 'none';
                document.getElementById('upload-status').style.display = 'flex';
                document.getElementById('upload-file-name').textContent = file.name;
                document.getElementById('upload-record-count').textContent = `${processedEmployees.length} records processed`;
                
                // Render tables
                renderUploadHistory();
                renderExcelFilesGrid();
                
                showToast(`Successfully uploaded ${processedEmployees.length} records from ${file.name}!`, 'success');
            }, 1500);
            
        } catch (error) {
            console.error('Error parsing Excel file:', error);
            document.getElementById('upload-progress').style.display = 'none';
            document.getElementById('upload-zone').style.display = 'flex';
            showToast('Error parsing Excel file. Please check the format.', 'error');
        }
    };
    
    reader.readAsArrayBuffer(file);
}

function goToReviewRequests() {
    document.querySelector('[data-tab="review-requests"]').click();
    // Reset upload UI
    document.getElementById('upload-zone').style.display = 'flex';
    document.getElementById('upload-status').style.display = 'none';
    document.getElementById('excel-upload').value = '';
}

// ===== Dummy Data =====
function loadDummyData() {
    // Dummy Centers
    centersData = [
        { id: 1, name: 'Apollo Diagnostics', email: 'apollo@diagnostics.com', phone: '9876543210', address: '123 Health Street, Mumbai', pincode: '400001' },
        { id: 2, name: 'Metropolis Labs', email: 'info@metropolis.com', phone: '9876543211', address: '456 Medical Lane, Mumbai', pincode: '400002' },
        { id: 3, name: 'Dr. Lal PathLabs', email: 'contact@lalpathlab.com', phone: '9876543212', address: '789 Wellness Road, Mumbai', pincode: '400003' },
        { id: 4, name: 'Thyrocare', email: 'support@thyrocare.com', phone: '9876543213', address: '321 Diagnostic Ave, Delhi', pincode: '110001' },
        { id: 5, name: 'SRL Diagnostics', email: 'help@srl.com', phone: '9876543214', address: '654 Test Street, Delhi', pincode: '110002' },
        { id: 6, name: 'Healthians', email: 'care@healthians.com', phone: '9876543215', address: '987 Check-up Lane, Bangalore', pincode: '560001' },
        { id: 7, name: 'Practo Clinics', email: 'info@practo.com', phone: '9876543216', address: '147 Medical Park, Bangalore', pincode: '560002' },
        { id: 8, name: 'Max Healthcare', email: 'contact@maxhealthcare.com', phone: '9876543217', address: '258 Hospital Road, Chennai', pincode: '600001' }
    ];
    
    // Dummy Companies
    companiesData = [
        { id: 1, name: 'Tech Corp Ltd', address: '100 Innovation Park, Mumbai', email: 'hr@techcorp.com', phone: '9988776655', pincode: '400001' },
        { id: 2, name: 'Global Solutions Inc', address: '200 Business Hub, Delhi', email: 'admin@globalsol.com', phone: '9988776656', pincode: '110001' },
        { id: 3, name: 'Digital Dynamics', address: '300 Tech Tower, Bangalore', email: 'contact@digitaldyn.com', phone: '9988776657', pincode: '560001' },
        { id: 4, name: 'Innovate Systems', address: '400 Corporate Center, Chennai', email: 'hr@innovatesys.com', phone: '9988776658', pincode: '600001' },
        { id: 5, name: 'Future Enterprises', address: '500 Commerce Complex, Pune', email: 'info@futureent.com', phone: '9988776659', pincode: '411001' }
    ];
    
    // Sample uploaded files with employee data
    const sampleFile1 = {
        id: Date.now() - 86400000, // 1 day ago
        fileName: 'TechCorp_Employees_Jan2024.xlsx',
        uploadDate: new Date(Date.now() - 86400000).toLocaleString(),
        uploadTimestamp: Date.now() - 86400000,
        records: 3,
        status: 'processed',
        employees: [
            { id: '1_0', employeeName: 'John Doe', employeeId: 'TC001', age: 32, gender: 'Male', phone: '9123456781', company: 'Tech Corp Ltd', pincode: '400001', status: 'pending', assignedCenter: null, reports: [] },
            { id: '1_1', employeeName: 'Jane Smith', employeeId: 'TC002', age: 28, gender: 'Female', phone: '9123456782', company: 'Tech Corp Ltd', pincode: '400002', status: 'pending', assignedCenter: null, reports: [] },
            { id: '1_2', employeeName: 'Mike Johnson', employeeId: 'TC003', age: 35, gender: 'Male', phone: '9123456783', company: 'Tech Corp Ltd', pincode: '400001', status: 'pending', assignedCenter: null, reports: [] }
        ]
    };
    
    const sampleFile2 = {
        id: Date.now() - 172800000, // 2 days ago
        fileName: 'GlobalSolutions_Feb2024.xlsx',
        uploadDate: new Date(Date.now() - 172800000).toLocaleString(),
        uploadTimestamp: Date.now() - 172800000,
        records: 2,
        status: 'new',
        employees: [
            { id: '2_0', employeeName: 'Emily Brown', employeeId: 'GS001', age: 29, gender: 'Female', phone: '9123456784', company: 'Global Solutions Inc', pincode: '110001', status: 'pending', assignedCenter: null, reports: [] },
            { id: '2_1', employeeName: 'Robert Wilson', employeeId: 'GS002', age: 41, gender: 'Male', phone: '9123456785', company: 'Global Solutions Inc', pincode: '110002', status: 'pending', assignedCenter: null, reports: [] }
        ]
    };
    
    uploadedFiles = [sampleFile1, sampleFile2];
}

// ===== Render Functions =====
function renderAllTables() {
    renderExcelFilesGrid();
    renderConfirmationTable();
    renderConfirmedTable();
    renderReportsTable();
    renderCentersTable();
    renderCompaniesTable();
    renderUploadHistory();
    updateStats();
}

// ===== Excel Files Grid =====
function renderExcelFilesGrid() {
    const grid = document.getElementById('excel-files-grid');
    const emptyState = document.getElementById('excel-empty');
    const countBadge = document.getElementById('file-count-badge');
    
    countBadge.textContent = `${uploadedFiles.length} File${uploadedFiles.length !== 1 ? 's' : ''}`;
    
    if (uploadedFiles.length === 0) {
        grid.style.display = 'none';
        emptyState.style.display = 'flex';
        return;
    }
    
    grid.style.display = 'grid';
    emptyState.style.display = 'none';
    
    // Sort files by upload date (newest first)
    const sortedFiles = [...uploadedFiles].sort((a, b) => b.uploadTimestamp - a.uploadTimestamp);
    
    grid.innerHTML = sortedFiles.map(file => {
        const pendingCount = file.employees.filter(e => e.status === 'pending').length;
        const confirmedCount = file.employees.filter(e => e.status === 'confirmed').length;
        
        return `
            <div class="excel-file-card ${selectedFileId === file.id ? 'selected' : ''}" onclick="openFileView(${file.id})">
                <span class="excel-file-badge ${file.status}">${file.status === 'new' ? '🆕 New' : '✓ Processed'}</span>
                <div class="excel-file-icon">📊</div>
                <h3>${file.fileName}</h3>
                <div class="excel-file-meta">
                    <span>👥 ${file.records} employees</span>
                    <span>📅 ${file.uploadDate}</span>
                    <span>⏳ ${pendingCount} pending • ✅ ${confirmedCount} confirmed</span>
                </div>
                <div class="file-actions">
                    <button class="btn btn-primary btn-sm" onclick="event.stopPropagation(); openFileView(${file.id})">
                        View Data →
                    </button>
                    <button class="btn btn-danger btn-sm" onclick="event.stopPropagation(); deleteFile(${file.id})">
                        🗑️
                    </button>
                </div>
            </div>
        `;
    }).join('');
}

function openFileView(fileId) {
    selectedFileId = fileId;
    const file = uploadedFiles.find(f => f.id === fileId);
    
    if (!file) return;
    
    // Update file status to processed
    file.status = 'processed';
    
    // Hide files grid, show selected file card
    document.getElementById('selected-file-card').style.display = 'block';
    document.getElementById('selected-file-name').textContent = file.fileName;
    document.getElementById('selected-file-meta').textContent = `${file.records} records • Uploaded on ${file.uploadDate}`;
    
    // Render employees table
    renderEmployeesTable(file);
    
    // Show center matching
    renderCenterMatchingForFile(file);
    
    // Update the grid to show selected state
    renderExcelFilesGrid();
}

function closeFileView() {
    selectedFileId = null;
    document.getElementById('selected-file-card').style.display = 'none';
    document.getElementById('center-matching-card').style.display = 'none';
    renderExcelFilesGrid();
}

function renderEmployeesTable(file) {
    const tbody = document.getElementById('review-table-body');
    
    tbody.innerHTML = file.employees.map(emp => `
        <tr>
            <td>
                <input type="checkbox" class="employee-checkbox" data-id="${emp.id}" ${emp.status === 'confirmed' ? 'disabled' : ''}>
            </td>
            <td><strong>${emp.employeeName}</strong></td>
            <td><span class="badge badge-info">${emp.employeeId}</span></td>
            <td>${emp.age}</td>
            <td>${emp.gender}</td>
            <td>${emp.phone}</td>
            <td>${emp.company}</td>
            <td><span class="badge badge-warning">${emp.pincode}</span></td>
            <td>
                <span class="badge badge-${emp.status === 'confirmed' ? 'success' : 'pending'}">
                    ${emp.status === 'confirmed' ? '✅ Confirmed' : '⏳ Pending'}
                </span>
            </td>
        </tr>
    `).join('');
}

function renderCenterMatchingForFile(file) {
    const card = document.getElementById('center-matching-card');
    const tbody = document.getElementById('center-matching-body');
    
    const pendingEmployees = file.employees.filter(emp => emp.status === 'pending');
    
    if (pendingEmployees.length === 0) {
        card.style.display = 'none';
        return;
    }
    
    card.style.display = 'block';
    
    tbody.innerHTML = pendingEmployees.map(emp => {
        const nearbyCenters = findNearbyCenters(emp.pincode);
        return `
            <tr>
                <td><strong>${emp.employeeName}</strong></td>
                <td><span class="badge badge-warning">${emp.pincode}</span></td>
                <td>
                    ${nearbyCenters[0] ? `
                        <div class="center-info">
                            <div class="center-name">${nearbyCenters[0].name}</div>
                            <div class="center-phone">📞 ${nearbyCenters[0].phone}</div>
                        </div>
                    ` : '<span style="color: var(--text-tertiary);">No center found</span>'}
                </td>
                <td>
                    ${nearbyCenters[1] ? `
                        <div class="center-info">
                            <div class="center-name">${nearbyCenters[1].name}</div>
                            <div class="center-phone">📞 ${nearbyCenters[1].phone}</div>
                        </div>
                    ` : '<span style="color: var(--text-tertiary);">-</span>'}
                </td>
                <td>
                    ${nearbyCenters[2] ? `
                        <div class="center-info">
                            <div class="center-name">${nearbyCenters[2].name}</div>
                            <div class="center-phone">📞 ${nearbyCenters[2].phone}</div>
                        </div>
                    ` : '<span style="color: var(--text-tertiary);">-</span>'}
                </td>
                <td>
                    <button class="btn btn-primary btn-sm" onclick="sendToConfirmation('${emp.id}')">
                        Assign →
                    </button>
                </td>
            </tr>
        `;
    }).join('');
}

function toggleSelectAll(checkbox) {
    const checkboxes = document.querySelectorAll('.employee-checkbox:not(:disabled)');
    checkboxes.forEach(cb => cb.checked = checkbox.checked);
}

function processAllEmployees() {
    const file = uploadedFiles.find(f => f.id === selectedFileId);
    if (!file) return;
    
    const pendingEmployees = file.employees.filter(emp => emp.status === 'pending');
    
    if (pendingEmployees.length === 0) {
        showToast('No pending employees to process!', 'warning');
        return;
    }
    
    showToast(`${pendingEmployees.length} employees ready for confirmation!`, 'success');
    document.querySelector('[data-tab="make-confirmation"]').click();
}

function sendToConfirmation(employeeId) {
    showToast('Employee ready for center assignment!', 'success');
    document.querySelector('[data-tab="make-confirmation"]').click();
}

function deleteFile(fileId) {
    const file = uploadedFiles.find(f => f.id === fileId);
    if (!file) return;
    
    if (confirm(`Are you sure you want to delete "${file.fileName}"?\nThis will remove all ${file.records} employee records.`)) {
        uploadedFiles = uploadedFiles.filter(f => f.id !== fileId);
        
        if (selectedFileId === fileId) {
            closeFileView();
        }
        
        renderExcelFilesGrid();
        renderUploadHistory();
        renderConfirmationTable();
        showToast('File deleted successfully!', 'success');
    }
}

function findNearbyCenters(pincode) {
    const prefix = pincode.toString().substring(0, 3);
    let matches = centersData.filter(c => c.pincode.startsWith(prefix));
    
    if (matches.length === 0) {
        matches = centersData.slice(0, 3);
    }
    
    return matches.slice(0, 3);
}

// ===== Get All Employees =====
function getAllEmployees() {
    let allEmployees = [];
    uploadedFiles.forEach(file => {
        allEmployees = allEmployees.concat(file.employees);
    });
    return allEmployees;
}

// ===== Confirmation Table =====
function renderConfirmationTable() {
    const tbody = document.getElementById('confirmation-table-body');
    const emptyState = document.getElementById('confirmation-empty');
    
    const allEmployees = getAllEmployees();
    const pendingEmployees = allEmployees.filter(emp => emp.status === 'pending');
    
    if (pendingEmployees.length === 0) {
        tbody.innerHTML = '';
        emptyState.style.display = 'flex';
        return;
    }
    
    emptyState.style.display = 'none';
    
    tbody.innerHTML = pendingEmployees.map(emp => {
        const nearbyCenters = findNearbyCenters(emp.pincode);
        return `
            <tr>
                <td><strong>${emp.employeeName}</strong></td>
                <td>${emp.phone}</td>
                <td>${emp.company}</td>
                <td><span class="badge badge-warning">${emp.pincode}</span></td>
                <td>
                    <select class="center-select" id="select-${emp.id}">
                        <option value="">Select a center...</option>
                        ${nearbyCenters.map(c => `
                            <option value="${c.id}">${c.name} (${c.pincode})</option>
                        `).join('')}
                        <option disabled>──────────</option>
                        ${centersData.filter(c => !nearbyCenters.includes(c)).map(c => `
                            <option value="${c.id}">${c.name} (${c.pincode})</option>
                        `).join('')}
                    </select>
                </td>
                <td>
                    <button class="btn btn-success btn-sm" onclick="confirmAssignment('${emp.id}')">
                        ✓ Confirm
                    </button>
                </td>
            </tr>
        `;
    }).join('');
    
    updateStats();
}

function confirmAssignment(employeeId) {
    const selectElement = document.getElementById(`select-${employeeId}`);
    const centerId = selectElement.value;
    
    if (!centerId) {
        showToast('Please select a center first!', 'warning');
        return;
    }
    
    // Find employee in uploaded files
    let employee = null;
    let file = null;
    
    for (const f of uploadedFiles) {
        employee = f.employees.find(e => e.id === employeeId);
        if (employee) {
            file = f;
            break;
        }
    }
    
    const center = centersData.find(c => c.id === parseInt(centerId));
    
    if (employee && center) {
        employee.status = 'confirmed';
        employee.assignedCenter = center;
        
        renderConfirmationTable();
        renderConfirmedTable();
        renderReportsTable();
        updateStats();
        
        // Update file view if open
        if (selectedFileId === file.id) {
            renderEmployeesTable(file);
            renderCenterMatchingForFile(file);
        }
        
        showToast(`${employee.employeeName} assigned to ${center.name}!`, 'success');
    }
}

function renderConfirmedTable() {
    const tbody = document.getElementById('confirmed-table-body');
    const countBadge = document.getElementById('confirmed-count');
    
    const allEmployees = getAllEmployees();
    const confirmedEmployees = allEmployees.filter(emp => emp.status === 'confirmed');
    
    countBadge.textContent = `${confirmedEmployees.length} Confirmed`;
    
    if (confirmedEmployees.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="5" style="text-align: center; padding: 40px; color: var(--text-tertiary);">
                    No confirmed assignments yet
                </td>
            </tr>
        `;
        return;
    }
    
    tbody.innerHTML = confirmedEmployees.map(emp => `
        <tr>
            <td><strong>${emp.employeeName}</strong></td>
            <td><span class="badge badge-info">${emp.employeeId}</span></td>
            <td>${emp.assignedCenter ? emp.assignedCenter.name : 'N/A'}</td>
            <td>${emp.assignedCenter ? emp.assignedCenter.phone : 'N/A'}</td>
            <td><span class="badge badge-success">✓ Confirmed</span></td>
        </tr>
    `).join('');
}

function updateStats() {
    const allEmployees = getAllEmployees();
    const pendingCount = allEmployees.filter(emp => emp.status === 'pending').length;
    const confirmedCount = allEmployees.filter(emp => emp.status === 'confirmed').length;
    const totalCount = allEmployees.length;
    
    document.getElementById('pending-count').textContent = pendingCount;
    document.getElementById('confirmed-count-stat').textContent = confirmedCount;
    document.getElementById('total-count').textContent = totalCount;
}

// ===== Reports Table =====
function renderReportsTable() {
    const tbody = document.getElementById('reports-table-body');
    const emptyState = document.getElementById('reports-empty');
    
    const allEmployees = getAllEmployees();
    const confirmedEmployees = allEmployees.filter(emp => emp.status === 'confirmed');
    
    if (confirmedEmployees.length === 0) {
        tbody.innerHTML = '';
        emptyState.style.display = 'flex';
        return;
    }
    
    emptyState.style.display = 'none';
    
    tbody.innerHTML = confirmedEmployees.map(emp => `
        <tr>
            <td><strong>${emp.employeeName}</strong></td>
            <td><span class="badge badge-info">${emp.employeeId}</span></td>
            <td>${emp.company}</td>
            <td>${emp.assignedCenter ? emp.assignedCenter.name : 'N/A'}</td>
            <td>
                <div class="file-upload-cell">
                    <label class="file-input-label">
                        📎 Upload PDF
                        <input type="file" accept=".pdf" multiple onchange="handleReportUpload('${emp.id}', this.files)">
                    </label>
                </div>
            </td>
            <td>
                ${emp.reports && emp.reports.length > 0 ? `
                    <button class="btn btn-sm btn-secondary" onclick="viewReports('${emp.id}')">
                        📁 View (${emp.reports.length})
                    </button>
                ` : '<span style="color: var(--text-tertiary);">No reports</span>'}
            </td>
        </tr>
    `).join('');
}

function handleReportUpload(employeeId, files) {
    let employee = null;
    
    for (const file of uploadedFiles) {
        employee = file.employees.find(e => e.id === employeeId);
        if (employee) break;
    }
    
    if (employee && files.length > 0) {
        if (!employee.reports) {
            employee.reports = [];
        }
        
        Array.from(files).forEach(file => {
            employee.reports.push({
                name: file.name,
                uploadedAt: new Date().toLocaleString(),
                size: formatFileSize(file.size)
            });
        });
        
        renderReportsTable();
        showToast(`${files.length} report(s) uploaded for ${employee.employeeName}!`, 'success');
    }
}

function viewReports(employeeId) {
    let employee = null;
    
    for (const file of uploadedFiles) {
        employee = file.employees.find(e => e.id === employeeId);
        if (employee) break;
    }
    
    const reportsList = document.getElementById('reports-list');
    
    if (employee && employee.reports && employee.reports.length > 0) {
        reportsList.innerHTML = `
            <h4 style="margin-bottom: 16px; color: var(--text-secondary);">Reports for ${employee.employeeName}</h4>
            ${employee.reports.map(report => `
                <div class="report-item">
                    <div class="report-info">
                        <span class="report-icon">📄</span>
                        <div>
                            <div class="report-name">${report.name}</div>
                            <div class="report-date">${report.uploadedAt} • ${report.size}</div>
                        </div>
                    </div>
                    <button class="btn btn-sm btn-primary">Download</button>
                </div>
            `).join('')}
        `;
    } else {
        reportsList.innerHTML = '<p style="text-align: center; color: var(--text-tertiary);">No reports uploaded</p>';
    }
    
    openModal('reports-modal');
}

// ===== Upload History =====
function renderUploadHistory() {
    const tbody = document.getElementById('upload-history-body');
    
    if (uploadedFiles.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="5" style="text-align: center; padding: 40px; color: var(--text-tertiary);">
                    No upload history yet
                </td>
            </tr>
        `;
        return;
    }
    
    const sortedFiles = [...uploadedFiles].sort((a, b) => b.uploadTimestamp - a.uploadTimestamp);
    
    tbody.innerHTML = sortedFiles.map(file => `
        <tr>
            <td><strong>${file.fileName}</strong></td>
            <td>${file.uploadDate}</td>
            <td>${file.records}</td>
            <td><span class="badge badge-success">✓ Success</span></td>
            <td>
                <div class="action-btns">
                    <button class="btn btn-sm btn-secondary" onclick="document.querySelector('[data-tab=review-requests]').click(); setTimeout(() => openFileView(${file.id}), 100);">
                        View
                    </button>
                    <button class="btn btn-sm btn-danger" onclick="deleteFile(${file.id})">
                        Delete
                    </button>
                </div>
            </td>
        </tr>
    `).join('');
}

// ===== Centers Table =====
function renderCentersTable() {
    const tbody = document.getElementById('centers-table-body');
    
    if (centersData.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="6" style="text-align: center; padding: 40px; color: var(--text-tertiary);">
                    No centers added yet. Click "+ Add Center" to get started.
                </td>
            </tr>
        `;
        return;
    }
    
    tbody.innerHTML = centersData.map(center => `
        <tr>
            <td><strong>${center.name}</strong></td>
            <td>${center.email}</td>
            <td>${center.phone}</td>
            <td>${center.address}</td>
            <td><span class="badge badge-info">${center.pincode}</span></td>
            <td>
                <div class="action-btns">
                    <button class="btn btn-sm btn-secondary" onclick="editCenter(${center.id})">✏️</button>
                    <button class="btn btn-sm btn-danger" onclick="deleteCenter(${center.id})">🗑️</button>
                </div>
            </td>
        </tr>
    `).join('');
}

// ===== Companies Table =====
async function fetchCompanies() {
    try {

        const res = await fetch(API_BASE + "/admin/companies")
        const data = await res.json()

        companiesData = data.map(c => ({
            id: c._id,
            name: c.name,
            address: c.address,
            email: c.email,
            phone: c.phone,
            pincode: c.pincode
        }))

        renderCompaniesTable()

    } catch (err) {
        console.error(err)
    }
}
async function fetchCenters() {
    try {

        const res = await fetch(API_BASE + "/admin/centers")
        const data = await res.json()

        centersData = data.map(c => ({
            id: c._id,
            name: c.name,
            email: c.email,
            phone: c.phone,
            address: c.address,
            pincode: c.pincode
        }))

        renderCentersTable()

    } catch (err) {
        console.error(err)
    }
}
function renderCompaniesTable() {
    const tbody = document.getElementById('companies-table-body');
    
    if (companiesData.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="6" style="text-align: center; padding: 40px; color: var(--text-tertiary);">
                    No companies added yet. Click "+ Add Company" to get started.
                </td>
            </tr>
        `;
        return;
    }
    
    tbody.innerHTML = companiesData.map(company => `
        <tr>
            <td><strong>${company.name}</strong></td>
            <td>${company.address}</td>
            <td>${company.email}</td>
            <td>${company.phone}</td>
            <td><span class="badge badge-info">${company.pincode}</span></td>
            <td>
                <div class="action-btns">
                    <button class="btn btn-sm btn-secondary" onclick="editCompany(${company.id})">✏️</button>
                    <button class="btn btn-sm btn-danger" onclick="deleteCompany(${company.id})">🗑️</button>
                </div>
            </td>
        </tr>
    `).join('');
}

// ===== Modal Functions =====
function openModal(modalId) {
    document.getElementById(modalId).classList.add('active');
    document.body.style.overflow = 'hidden';
    if(modalId === "hr-modal"){
    populateCompanyDropdown()
}
}

function closeModal(modalId) {
    document.getElementById(modalId).classList.remove('active');
    document.body.style.overflow = '';
    
    const form = document.getElementById(modalId.replace('-modal', '-form'));
    if (form) {
        form.reset();
    }
}

// Close modal on outside click
document.querySelectorAll('.modal').forEach(modal => {
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal(modal.id);
        }
    });
});

// Close modal on Escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        document.querySelectorAll('.modal.active').forEach(modal => {
            closeModal(modal.id);
        });
    }
});

// ===== Save Functions =====
async function saveCenter(event) {

    event.preventDefault()

    const center = {
        name: document.getElementById('center-name').value,
        email: document.getElementById('center-email').value,
        phone: document.getElementById('center-phone').value,
        address: document.getElementById('center-address').value,
        pincode: document.getElementById('center-pincode').value
    }

    try {

        const res = await fetch(API_BASE + "/admin/centers", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(center)
        })

        const data = await res.json()

        centersData.push({
            id: data._id,
            name: data.name,
            email: data.email,
            phone: data.phone,
            address: data.address,
            pincode: data.pincode
        })

        renderCentersTable()
        closeModal('center-modal')

        showToast("Center added successfully!", "success")

    } catch (err) {
        console.error(err)
        showToast("Error adding center", "error")
    }
}

async function saveCompany(event) {

    event.preventDefault()

    const company = {
        name: document.getElementById('company-name').value,
        address: document.getElementById('company-address').value,
        email: document.getElementById('company-email').value,
        phone: document.getElementById('company-phone').value,
        pincode: document.getElementById('company-pincode').value
    }

    try {

        const res = await fetch(API_BASE + "/admin/companies", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(company)
        })

        const data = await res.json()

        companiesData.push({
            id: data._id,
            name: data.name,
            address: data.address,
            email: data.email,
            phone: data.phone,
            pincode: data.pincode
        })

        renderCompaniesTable()
        closeModal('company-modal')

        showToast("Company added successfully!", "success")

    } catch (err) {
        console.error(err)
        showToast("Error adding company", "error")
    }
}
// ===== Delete Functions =====
function deleteCenter(id) {
    if (confirm('Are you sure you want to delete this center?')) {
        centersData = centersData.filter(c => c.id !== id);
        renderCentersTable();
        showToast('Center deleted successfully!', 'success');
    }
}

function deleteCompany(id) {
    if (confirm('Are you sure you want to delete this company?')) {
        companiesData = companiesData.filter(c => c.id !== id);
        renderCompaniesTable();
        showToast('Company deleted successfully!', 'success');
    }
}

// ===== Edit Functions =====
function editCenter(id) {
    const center = centersData.find(c => c.id === id);
    if (center) {
        document.getElementById('center-name').value = center.name;
        document.getElementById('center-email').value = center.email;
        document.getElementById('center-phone').value = center.phone;
        document.getElementById('center-address').value = center.address;
        document.getElementById('center-pincode').value = center.pincode;
        
        centersData = centersData.filter(c => c.id !== id);
        
        openModal('center-modal');
    }
}

function editCompany(id) {
    const company = companiesData.find(c => c.id === id);
    if (company) {
        document.getElementById('company-name').value = company.name;
        document.getElementById('company-address').value = company.address;
        document.getElementById('company-email').value = company.email;
        document.getElementById('company-phone').value = company.phone;
        document.getElementById('company-pincode').value = company.pincode;
        
        companiesData = companiesData.filter(c => c.id !== id);
        
        openModal('company-modal');
    }
}

// ===== Table Functions =====
function sortTable(tableId, columnIndex) {
    const table = document.getElementById(tableId);
    const tbody = table.querySelector('tbody');
    const rows = Array.from(tbody.querySelectorAll('tr'));
    
    if (rows.length === 0 || rows[0].cells.length <= columnIndex) return;
    
    const isAscending = table.dataset.sortColumn !== String(columnIndex) || table.dataset.sortDirection !== 'asc';
    
    rows.sort((a, b) => {
        const aValue = a.cells[columnIndex]?.textContent.trim().toLowerCase() || '';
        const bValue = b.cells[columnIndex]?.textContent.trim().toLowerCase() || '';
        
        const aNum = parseFloat(aValue);
        const bNum = parseFloat(bValue);
        
        if (!isNaN(aNum) && !isNaN(bNum)) {
            return isAscending ? aNum - bNum : bNum - aNum;
        }
        
        return isAscending ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
    });
    
    table.dataset.sortColumn = columnIndex;
    table.dataset.sortDirection = isAscending ? 'asc' : 'desc';
    
    rows.forEach(row => tbody.appendChild(row));
}

function searchTable(tableId, searchTerm) {
    const table = document.getElementById(tableId);
    const tbody = table.querySelector('tbody');
    const rows = tbody.querySelectorAll('tr');
    
    const term = searchTerm.toLowerCase();
    
    rows.forEach(row => {
        const text = row.textContent.toLowerCase();
        row.style.display = text.includes(term) ? '' : 'none';
    });
}

// ===== Toast Notification =====
function showToast(message, type = 'success') {
    const toast = document.getElementById('toast');
    const toastMessage = toast.querySelector('.toast-message');
    const toastIcon = toast.querySelector('.toast-icon');
    
    toast.className = 'toast';
    toast.classList.add(type);
    
    switch(type) {
        case 'success':
            toastIcon.textContent = '✓';
            break;
        case 'error':
            toastIcon.textContent = '✕';
            break;
        case 'warning':
            toastIcon.textContent = '⚠';
            break;
        default:
            toastIcon.textContent = 'ℹ';
    }
    
    toastMessage.textContent = message;
    toast.classList.add('show');
    
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

// ===== Utility Functions =====
function generatePhone() {
    return '9' + Math.random().toString().slice(2, 11);
}

function generatePincode() {
    const pincodes = ['400001', '400002', '110001', '110002', '560001', '560002', '600001', '411001'];
    return pincodes[Math.floor(Math.random() * pincodes.length)];
}

function formatFileSize(bytes) {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
}
function populateCompanyDropdown() {

    const select = document.getElementById("hr-company")

    select.innerHTML = companiesData.map(c => `
        <option value="${c.id}">
            ${c.name}
        </option>
    `).join("")
}
async function createHR(event){

event.preventDefault()

const hr = {
name: document.getElementById("hr-name").value,
email: document.getElementById("hr-email").value,
password: document.getElementById("hr-password").value,
companyId: document.getElementById("hr-company").value
}

try{

const res = await fetch(API_BASE + "/hr/create",{
method:"POST",
headers:{
"Content-Type":"application/json"
},
body:JSON.stringify(hr)
})

const data = await res.json()

closeModal("hr-modal")

showToast("HR account created successfully","success")

}catch(err){
console.error(err)
showToast("Error creating HR","error")
}

}