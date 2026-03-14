// ===== API Base =====
const API_BASE = "http://localhost:5000/api"

// ===== Global Data Storage =====
let uploadedFiles = []   // upload batch objects from DB
let centersData = []
let companiesData = []
let selectedFileId = null          // currently viewed upload _id
let selectedFilePatients = []      // patients loaded for that upload

// ===== Initialize Application =====
document.addEventListener('DOMContentLoaded', function () {
  initializeTabs()
  fetchCompanies()
  fetchCenters()
  fetchUploads()
})

// ===== Tab Navigation =====
function initializeTabs() {
  const tabs = document.querySelectorAll('.nav-tab')
  const contents = document.querySelectorAll('.tab-content')

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const targetId = tab.dataset.tab

      tabs.forEach(t => t.classList.remove('active'))
      tab.classList.add('active')

      contents.forEach(content => {
        content.classList.remove('active')
        if (content.id === targetId) content.classList.add('active')
      })

      refreshTabData(targetId)
    })
  })
}

function refreshTabData(tabId) {
  switch (tabId) {
    case 'review-requests':
      fetchUploads()
      break
    case 'make-confirmation':
      fetchAllPatientsForConfirmation()
      break
    case 'reports':
      fetchConfirmedPatientsForReports()
      break
    case 'add-centers':
      renderCentersTable()
      break
    case 'add-companies':
      renderCompaniesTable()
      break
  }
}

// ===== REVIEW REQUESTS — fetch upload batches from DB =====
async function fetchUploads() {
  try {
    const res = await fetch(API_BASE + "/admin/uploads")
    const data = await res.json()

    uploadedFiles = data.map(u => ({
      id: u._id,
      fileName: u.fileName,
      uploadDate: new Date(u.uploadedAt).toLocaleString(),
      uploadTimestamp: new Date(u.uploadedAt).getTime(),
      records: u.recordsCount,
      status: u.status,
      company: u.companyId ? u.companyId.name : "",
      uploadedBy: u.uploadedBy ? u.uploadedBy.name : "",
      pendingCount: u.pendingCount || 0,
      confirmedCount: u.confirmedCount || 0,
      employees: []   // loaded on demand when card is opened
    }))

    renderExcelFilesGrid()
  } catch (err) {
    console.error("fetchUploads error:", err)
    showToast("Could not load upload files", "error")
  }
}

// ===== Excel Files Grid =====
function renderExcelFilesGrid() {
  const grid = document.getElementById('excel-files-grid')
  const emptyState = document.getElementById('excel-empty')
  const countBadge = document.getElementById('file-count-badge')

  countBadge.textContent = `${uploadedFiles.length} File${uploadedFiles.length !== 1 ? 's' : ''}`

  if (uploadedFiles.length === 0) {
    grid.style.display = 'none'
    emptyState.style.display = 'flex'
    return
  }

  grid.style.display = 'grid'
  emptyState.style.display = 'none'

  const sortedFiles = [...uploadedFiles].sort((a, b) => b.uploadTimestamp - a.uploadTimestamp)

  grid.innerHTML = sortedFiles.map(file => {
    // badge colour: pending=warning, approved=success, rejected=danger
    const statusClass = file.status === 'approved' ? 'processed'
      : file.status === 'rejected' ? 'rejected'
        : 'new'
    const statusLabel = file.status === 'approved' ? '✓ Approved'
      : file.status === 'rejected' ? '✗ Rejected'
        : '🆕 Pending'

    return `
      <div class="excel-file-card ${selectedFileId === file.id ? 'selected' : ''}"
           onclick="openFileView('${file.id}')">
        <span class="excel-file-badge ${statusClass}">${statusLabel}</span>
        <div class="excel-file-icon">📊</div>
        <h3>${file.fileName}</h3>
        <div class="excel-file-meta">
          <span>👥 ${file.records} employees</span>
          <span>📅 ${file.uploadDate}</span>
          ${file.company ? `<span>🏢 ${file.company}</span>` : ''}
          <span>⏳ ${file.pendingCount} pending • ✅ ${file.confirmedCount} confirmed</span>
        </div>
        <div class="file-actions">
          <button class="btn btn-primary btn-sm"
            onclick="event.stopPropagation(); openFileView('${file.id}')">
            View Data →
          </button>
          ${file.status === 'pending' ? `
            <button class="btn btn-success btn-sm"
              onclick="event.stopPropagation(); approveUpload('${file.id}')">
              Approve
            </button>
            <button class="btn btn-danger btn-sm"
              onclick="event.stopPropagation(); rejectUpload('${file.id}')">
              Reject
            </button>
          ` : ''}
        </div>
      </div>
    `
  }).join('')
}

// Open a file card → load its patients from DB
async function openFileView(fileId) {
  selectedFileId = fileId
  const file = uploadedFiles.find(f => f.id === fileId)
  if (!file) return

  document.getElementById('selected-file-card').style.display = 'block'
  document.getElementById('selected-file-name').textContent = file.fileName
  document.getElementById('selected-file-meta').textContent =
    `${file.records} records • Uploaded on ${file.uploadDate}`

  // show loading state
  document.getElementById('review-table-body').innerHTML =
    `<tr><td colspan="11" style="text-align:center;padding:30px;color:var(--text-tertiary);">Loading...</td></tr>`
  document.getElementById('center-matching-card').style.display = 'none'

  try {
    const res = await fetch(`${API_BASE}/admin/uploads/${fileId}/patients`)
    const patients = await res.json()

    // normalise into the shape the render functions expect
    file.employees = patients.map(p => normalisePatient(p))
    selectedFilePatients = file.employees

    renderEmployeesTable(file)
    renderCenterMatchingForFile(file)
  } catch (err) {
    console.error("openFileView error:", err)
    showToast("Could not load employee data", "error")
  }

  renderExcelFilesGrid()
}

// Map a DB Patient document → internal employee object
function normalisePatient(p) {
  const rawStatus = (p.status || "pending").toLowerCase()
  const finalStatus = p.assignedCenterId ? "confirmed" : rawStatus

  return {
    id: p._id,
    employeeName: p.name || "",
    employeeId: p._id,
    age: p.age || "",
    gender: p.gender || "",
    phone: p.phone || "",
    email: p.email || "",
    company: p.companyId ? p.companyId.name : "",
    address: p.address || "",
    pincode: p.pincode || "",
    appointmentDate: p.appointmentDate || null,
    appointmentTime: p.appointmentTime || "10:00",
    status: finalStatus,
    assignedCenter: p.assignedCenterId ? {
      id: p.assignedCenterId._id || p.assignedCenterId,
      name: p.assignedCenterId.name || "",
      phone: p.assignedCenterId.phone || "",
      pincode: p.assignedCenterId.pincode || "",
      address: p.assignedCenterId.address || ""
    } : null,
    reportUrl: p.reportUrl || null
  }
}

function closeFileView() {
  selectedFileId = null
  selectedFilePatients = []
  document.getElementById('selected-file-card').style.display = 'none'
  document.getElementById('center-matching-card').style.display = 'none'
  renderExcelFilesGrid()
}

function renderEmployeesTable(file) {
  const tbody = document.getElementById('review-table-body')

  tbody.innerHTML = file.employees.map(emp => `
    <tr>
      <td>
        <input type="checkbox" class="employee-checkbox" data-id="${emp.id}"
          ${emp.status === 'confirmed' ? 'disabled' : ''}>
      </td>
      <td><strong>${emp.employeeName}</strong></td>
      <td><span class="badge badge-info">${emp.employeeId.toString().slice(-6)}</span></td>
      <td>${emp.age || '-'}</td>
      <td>${emp.gender || '-'}</td>
      <td>${emp.phone || '-'}</td>
      <td>${emp.email || '-'}</td>
      <td>${emp.company || '-'}</td>
      <td>${emp.address || '-'}</td>
      <td><span class="badge badge-warning">${emp.pincode || '-'}</span></td>
      <td>${emp.appointmentDate ? new Date(emp.appointmentDate).toLocaleDateString() : '-'}</td>
      <td>
        <span class="badge ${
          emp.status === 'confirmed'
            ? 'badge-success'
            : emp.status === 'requested'
            ? 'badge-info'
            : emp.status === 'approved'
            ? 'badge-warning'
            : 'badge-pending'
        }">
          ${
            emp.status === 'confirmed'
              ? '✅ Confirmed'
              : emp.status === 'requested'
              ? '📝 Requested'
              : emp.status === 'approved'
              ? '👍 Approved'
              : '⏳ Pending'
          }
        </span>
      </td>
    </tr>
  `).join('')
}


function renderCenterMatchingForFile(file) {
  const card = document.getElementById('center-matching-card')
  const tbody = document.getElementById('center-matching-body')

  const pendingEmployees = file.employees.filter(
    emp => emp.status === 'requested' || emp.status === 'approved' || emp.status === 'pending'
  )

  if (pendingEmployees.length === 0) {
    card.style.display = 'none'
    return
  }

  card.style.display = 'block'

  tbody.innerHTML = pendingEmployees.map(emp => {
    const nearbyCenters = findNearbyCenters(emp.pincode)
    return `
      <tr>
        <td><strong>${emp.employeeName}</strong></td>
        <td>${emp.appointmentDate ? new Date(emp.appointmentDate).toLocaleDateString() : '-'}</td>
        <td><span class="badge badge-warning">${emp.pincode || '-'}</span></td>
        <td>
          ${nearbyCenters[0] ? `
            <div class="center-info">
              <div class="center-name">${nearbyCenters[0].name}</div>
              <div class="center-phone">📞 ${nearbyCenters[0].phone}</div>
            </div>` : '<span style="color:var(--text-tertiary);">No center found</span>'}
        </td>
        <td>
          ${nearbyCenters[1] ? `
            <div class="center-info">
              <div class="center-name">${nearbyCenters[1].name}</div>
              <div class="center-phone">📞 ${nearbyCenters[1].phone}</div>
            </div>` : '<span style="color:var(--text-tertiary);">-</span>'}
        </td>
        <td>
          ${nearbyCenters[2] ? `
            <div class="center-info">
              <div class="center-name">${nearbyCenters[2].name}</div>
              <div class="center-phone">📞 ${nearbyCenters[2].phone}</div>
            </div>` : '<span style="color:var(--text-tertiary);">-</span>'}
        </td>
        <td>
          <button class="btn btn-primary btn-sm"
            onclick="navigateToConfirmation('${emp.id}')">
            Assign →
          </button>
        </td>
      </tr>
    `
  }).join('')
}

function toggleSelectAll(checkbox) {
  const checkboxes = document.querySelectorAll('.employee-checkbox:not(:disabled)')
  checkboxes.forEach(cb => cb.checked = checkbox.checked)
}

function processAllEmployees() {
  const file = uploadedFiles.find(f => f.id === selectedFileId)
  if (!file) return

  const pendingEmployees = file.employees.filter(emp => emp.status !== 'confirmed')

  if (pendingEmployees.length === 0) {
    showToast('No pending employees to process!', 'warning')
    return
  }

  showToast(`${pendingEmployees.length} employees ready for confirmation!`, 'success')
  document.querySelector('[data-tab="make-confirmation"]').click()
}

function navigateToConfirmation(employeeId) {
  showToast('Navigate to Make Confirmation to assign a center', 'success')
  document.querySelector('[data-tab="make-confirmation"]').click()
}

// Approve / Reject upload
async function approveUpload(id) {
  try {
    await fetch(`${API_BASE}/admin/uploads/${id}/approve`, { method: "PUT" })
    showToast("Upload approved", "success")
    fetchUploads()
  } catch (err) {
    console.error(err)
    showToast("Error approving upload", "error")
  }
}

async function rejectUpload(id) {
  try {
    await fetch(`${API_BASE}/admin/uploads/${id}/reject`, { method: "PUT" })
    showToast("Upload rejected", "success")
    fetchUploads()
  } catch (err) {
    console.error(err)
    showToast("Error rejecting upload", "error")
  }
}

// ===== MAKE CONFIRMATION =====

// All patients (across all uploads) for the confirmation tables
let allPatients = []

async function fetchAllPatientsForConfirmation() {
  try {
    const res = await fetch(`${API_BASE}/admin/patients`)
    const data = await res.json()
    allPatients = data.map(p => normalisePatient(p))

    renderConfirmationTable()
    renderConfirmedTable()
    updateStats()
  } catch (err) {
    console.error("fetchAllPatientsForConfirmation error:", err)
    showToast("Could not load patient data", "error")
  }
}

function renderConfirmationTable() {
  const tbody = document.getElementById('confirmation-table-body')
  const emptyState = document.getElementById('confirmation-empty')

  const pendingEmployees = allPatients.filter(
    emp => emp.status === 'requested' || emp.status === 'approved' || emp.status === 'pending'
  )

  if (pendingEmployees.length === 0) {
    tbody.innerHTML = ''
    emptyState.style.display = 'flex'
    return
  }

  emptyState.style.display = 'none'

  tbody.innerHTML = pendingEmployees.map(emp => {
    const nearbyCenters = findNearbyCenters(emp.pincode)
    return `
      <tr>
        <td><strong>${emp.employeeName}</strong></td>
        <td>${emp.phone || '-'}</td>
        <td>${emp.company || '-'}</td>
        <td>${emp.appointmentDate ? new Date(emp.appointmentDate).toLocaleDateString() : '-'}</td>
        <td><span class="badge badge-warning">${emp.pincode || '-'}</span></td>
        <td>
          <select class="center-select" id="select-${emp.id}">
            <option value="">Select a center...</option>
            ${nearbyCenters.map(c => `
              <option value="${c.id}">${c.name} (${c.pincode})</option>
            `).join('')}
            <option disabled>──────────</option>
            ${centersData
              .filter(c => !nearbyCenters.find(n => n.id === c.id))
              .map(c => `
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
    `
  }).join('')

  updateStats()
}

async function confirmAssignment(patientId) {
  const selectElement = document.getElementById(`select-${patientId}`)
  const centerId = selectElement.value

  if (!centerId) {
    showToast('Please select a center first!', 'warning')
    return
  }

  try {
    const res = await fetch(`${API_BASE}/admin/patients/${patientId}/assign`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ centerId })
    })

    if (!res.ok) throw new Error("Assignment failed")

    const updatedPatient = await res.json()

    // Update in-memory allPatients
    const idx = allPatients.findIndex(p => p.id === patientId)
    if (idx !== -1) {
      allPatients[idx] = normalisePatient(updatedPatient)
    }

    // Also update in the open file view if that file is open
    if (selectedFileId) {
      const file = uploadedFiles.find(f => f.id === selectedFileId)
      if (file) {
        const empIdx = file.employees.findIndex(e => e.id === patientId)
        if (empIdx !== -1) {
          file.employees[empIdx] = normalisePatient(updatedPatient)
        }
        renderEmployeesTable(file)
        renderCenterMatchingForFile(file)
      }
    }

    renderConfirmationTable()
    renderConfirmedTable()
    updateStats()

    const center = centersData.find(c => c.id === centerId)
    showToast(
      `${updatedPatient.name || 'Employee'} assigned to ${center ? center.name : 'center'}!`,
      'success'
    )
  } catch (err) {
    console.error("confirmAssignment error:", err)
    showToast("Error assigning center", "error")
  }
}

function renderConfirmedTable() {
  const tbody = document.getElementById('confirmed-table-body')
  const countBadge = document.getElementById('confirmed-count')

  const confirmedEmployees = allPatients.filter(emp => emp.status === 'confirmed')

  countBadge.textContent = `${confirmedEmployees.length} Confirmed`

  if (confirmedEmployees.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="5" style="text-align:center;padding:40px;color:var(--text-tertiary);">
          No confirmed assignments yet
        </td>
      </tr>
    `
    return
  }

  tbody.innerHTML = confirmedEmployees.map(emp => `
    <tr>
      <td><strong>${emp.employeeName}</strong></td>
      <td><span class="badge badge-info">${emp.id.toString().slice(-6)}</span></td>
      <td>${emp.assignedCenter ? emp.assignedCenter.name : 'N/A'}</td>
      <td>${emp.assignedCenter ? emp.assignedCenter.phone : 'N/A'}</td>
      <td><span class="badge badge-success">✓ Confirmed</span></td>
    </tr>
  `).join('')
}

function updateStats() {
  const pendingCount = allPatients.filter(
    emp => emp.status === 'requested' || emp.status === 'approved' || emp.status === 'pending'
  ).length

  const confirmedCount = allPatients.filter(emp => emp.status === 'confirmed').length
  const totalCount = allPatients.length

  document.getElementById('pending-count').textContent = pendingCount
  document.getElementById('confirmed-count-stat').textContent = confirmedCount
  document.getElementById('total-count').textContent = totalCount
}


// ===== REPORTS =====

let confirmedPatientsForReports = []

async function fetchConfirmedPatientsForReports() {
  try {
    const res = await fetch(`${API_BASE}/admin/patients`)
    const data = await res.json()

    confirmedPatientsForReports = data
      .filter(p => p.assignedCenterId)
      .map(p => normalisePatient(p))

    renderReportsTable()
  } catch (err) {
    console.error("fetchConfirmedPatientsForReports error:", err)
    showToast("Could not load reports data", "error")
  }
}

function renderReportsTable() {
  const tbody = document.getElementById('reports-table-body')
  const emptyState = document.getElementById('reports-empty')

  if (confirmedPatientsForReports.length === 0) {
    tbody.innerHTML = ''
    emptyState.style.display = 'flex'
    return
  }

  emptyState.style.display = 'none'

  tbody.innerHTML = confirmedPatientsForReports.map(emp => `
    <tr>
      <td><strong>${emp.employeeName}</strong></td>
      <td><span class="badge badge-info">${emp.id.toString().slice(-6)}</span></td>
      <td>${emp.company}</td>
      <td>${emp.assignedCenter ? emp.assignedCenter.name : 'N/A'}</td>
      <td>
        <div class="file-upload-cell">
          <label class="file-input-label">
            📎 Upload PDF
            <input type="file" accept=".pdf"
              onchange="handleReportUpload('${emp.id}', this)">
          </label>
        </div>
      </td>
      <td>
        ${emp.reportUrl ? `
          <a class="btn btn-sm btn-secondary"
             href="http://localhost:5000${emp.reportUrl}"
             target="_blank">
            📁 View Report
          </a>
        ` : '<span style="color:var(--text-tertiary);">No report</span>'}
      </td>
    </tr>
  `).join('')
}

async function handleReportUpload(patientId, inputEl) {
  const file = inputEl.files[0]
  if (!file) return

  const formData = new FormData()
  formData.append("report", file)

  try {
    const res = await fetch(`${API_BASE}/admin/patients/${patientId}/report`, {
      method: "POST",
      body: formData
    })

    if (!res.ok) throw new Error("Upload failed")

    const data = await res.json()

    // Update in memory
    const idx = confirmedPatientsForReports.findIndex(p => p.id === patientId)
    if (idx !== -1) {
      confirmedPatientsForReports[idx].reportUrl = data.reportUrl
    }

    renderReportsTable()
    showToast(`Report uploaded successfully!`, 'success')
  } catch (err) {
    console.error("handleReportUpload error:", err)
    showToast("Error uploading report", "error")
  }
}

// ===== Centers =====

async function fetchCenters() {
  try {
    const res = await fetch(API_BASE + "/admin/centers")
    const data = await res.json()
    centersData = data.map(c => ({
      id: c._id,
      name: c.name,
      email: c.email || "",
      phone: c.phone || "",
      address: c.address || "",
      pincode: c.pincode || ""
    }))
    renderCentersTable()
  } catch (err) {
    console.error(err)
  }
}

function renderCentersTable() {
  const tbody = document.getElementById('centers-table-body')

  if (centersData.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="6" style="text-align:center;padding:40px;color:var(--text-tertiary);">
          No centers added yet. Click "+ Add Center" to get started.
        </td>
      </tr>
    `
    return
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
          <button class="btn btn-sm btn-secondary" onclick="editCenter('${center.id}')">✏️</button>
          <button class="btn btn-sm btn-danger" onclick="deleteCenter('${center.id}')">🗑️</button>
        </div>
      </td>
    </tr>
  `).join('')
}

// ===== Companies =====

async function fetchCompanies() {
  try {
    const res = await fetch(API_BASE + "/admin/companies")
    const data = await res.json()
    companiesData = data.map(c => ({
      id: c._id,
      name: c.name,
      address: c.address || "",
      email: c.email || "",
      phone: c.phone || "",
      pincode: c.pincode || ""
    }))
    renderCompaniesTable()
  } catch (err) {
    console.error(err)
  }
}

function renderCompaniesTable() {
  const tbody = document.getElementById('companies-table-body')

  if (companiesData.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="6" style="text-align:center;padding:40px;color:var(--text-tertiary);">
          No companies added yet. Click "+ Add Company" to get started.
        </td>
      </tr>
    `
    return
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
          <button class="btn btn-sm btn-secondary" onclick="editCompany('${company.id}')">✏️</button>
          <button class="btn btn-sm btn-danger" onclick="deleteCompany('${company.id}')">🗑️</button>
        </div>
      </td>
    </tr>
  `).join('')
}

// ===== Save Center (API) =====
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
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(center)
    })
    const data = await res.json()
    centersData.push({
      id: data._id,
      name: data.name,
      email: data.email || "",
      phone: data.phone || "",
      address: data.address || "",
      pincode: data.pincode || ""
    })
    renderCentersTable()
    closeModal('center-modal')
    showToast("Center added successfully!", "success")
  } catch (err) {
    console.error(err)
    showToast("Error adding center", "error")
  }
}

// ===== Save Company (API) =====
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
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(company)
    })
    const data = await res.json()
    companiesData.push({
      id: data._id,
      name: data.name,
      address: data.address || "",
      email: data.email || "",
      phone: data.phone || "",
      pincode: data.pincode || ""
    })
    renderCompaniesTable()
    closeModal('company-modal')
    showToast("Company added successfully!", "success")
  } catch (err) {
    console.error(err)
    showToast("Error adding company", "error")
  }
}

// ===== Delete Center =====
function deleteCenter(id) {
  if (confirm('Are you sure you want to delete this center?')) {
    centersData = centersData.filter(c => c.id !== id)
    renderCentersTable()
    showToast('Center deleted successfully!', 'success')
  }
}

// ===== Delete Company =====
function deleteCompany(id) {
  if (confirm('Are you sure you want to delete this company?')) {
    companiesData = companiesData.filter(c => c.id !== id)
    renderCompaniesTable()
    showToast('Company deleted successfully!', 'success')
  }
}

// ===== Edit Center =====
function editCenter(id) {
  const center = centersData.find(c => c.id === id)
  if (center) {
    document.getElementById('center-name').value = center.name
    document.getElementById('center-email').value = center.email
    document.getElementById('center-phone').value = center.phone
    document.getElementById('center-address').value = center.address
    document.getElementById('center-pincode').value = center.pincode
    centersData = centersData.filter(c => c.id !== id)
    openModal('center-modal')
  }
}

// ===== Edit Company =====
function editCompany(id) {
  const company = companiesData.find(c => c.id === id)
  if (company) {
    document.getElementById('company-name').value = company.name
    document.getElementById('company-address').value = company.address
    document.getElementById('company-email').value = company.email
    document.getElementById('company-phone').value = company.phone
    document.getElementById('company-pincode').value = company.pincode
    companiesData = companiesData.filter(c => c.id !== id)
    openModal('company-modal')
  }
}

// ===== HR Modal =====
function populateCompanyDropdown() {
  const select = document.getElementById("hr-company")
  select.innerHTML = companiesData.map(c => `
    <option value="${c.id}">${c.name}</option>
  `).join("")
}

async function createHR(event) {
  event.preventDefault()

  const hr = {
    name: document.getElementById("hr-name").value,
    email: document.getElementById("hr-email").value,
    password: document.getElementById("hr-password").value,
    companyId: document.getElementById("hr-company").value
  }

  try {
    const res = await fetch(API_BASE + "/hr/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(hr)
    })
    await res.json()
    closeModal("hr-modal")
    showToast("HR account created successfully", "success")
  } catch (err) {
    console.error(err)
    showToast("Error creating HR", "error")
  }
}

// ===== Modals =====
function openModal(modalId) {
  document.getElementById(modalId).classList.add('active')
  document.body.style.overflow = 'hidden'
  if (modalId === "hr-modal") populateCompanyDropdown()
}

function closeModal(modalId) {
  document.getElementById(modalId).classList.remove('active')
  document.body.style.overflow = ''
  const form = document.getElementById(modalId.replace('-modal', '-form'))
  if (form) form.reset()
}

document.querySelectorAll('.modal').forEach(modal => {
  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal(modal.id)
  })
})

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    document.querySelectorAll('.modal.active').forEach(modal => closeModal(modal.id))
  }
})

// ===== Table Utilities =====
function sortTable(tableId, columnIndex) {
  const table = document.getElementById(tableId)
  const tbody = table.querySelector('tbody')
  const rows = Array.from(tbody.querySelectorAll('tr'))

  if (rows.length === 0 || rows[0].cells.length <= columnIndex) return

  const isAscending = table.dataset.sortColumn !== String(columnIndex) ||
    table.dataset.sortDirection !== 'asc'

  rows.sort((a, b) => {
    const aValue = a.cells[columnIndex]?.textContent.trim().toLowerCase() || ''
    const bValue = b.cells[columnIndex]?.textContent.trim().toLowerCase() || ''
    const aNum = parseFloat(aValue)
    const bNum = parseFloat(bValue)
    if (!isNaN(aNum) && !isNaN(bNum)) return isAscending ? aNum - bNum : bNum - aNum
    return isAscending ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue)
  })

  table.dataset.sortColumn = columnIndex
  table.dataset.sortDirection = isAscending ? 'asc' : 'desc'
  rows.forEach(row => tbody.appendChild(row))
}

function searchTable(tableId, searchTerm) {
  const table = document.getElementById(tableId)
  const tbody = table.querySelector('tbody')
  const rows = tbody.querySelectorAll('tr')
  const term = searchTerm.toLowerCase()
  rows.forEach(row => {
    row.style.display = row.textContent.toLowerCase().includes(term) ? '' : 'none'
  })
}

// ===== Nearby Centers (pincode prefix match) =====
function findNearbyCenters(pincode) {
  if (!pincode) return centersData.slice(0, 3)
  const prefix = pincode.toString().substring(0, 3)
  let matches = centersData.filter(c => c.pincode && c.pincode.startsWith(prefix))
  if (matches.length === 0) matches = centersData.slice(0, 3)
  return matches.slice(0, 3)
}

// ===== Toast =====
function showToast(message, type = 'success') {
  const toast = document.getElementById('toast')
  const toastMessage = toast.querySelector('.toast-message')
  const toastIcon = toast.querySelector('.toast-icon')

  toast.className = 'toast'
  toast.classList.add(type)

  toastIcon.textContent = type === 'success' ? '✓' : type === 'error' ? '✕' : '⚠'
  toastMessage.textContent = message
  toast.classList.add('show')

  setTimeout(() => toast.classList.remove('show'), 3000)
}

// ===== Utilities =====
function formatFileSize(bytes) {
  if (bytes < 1024) return bytes + ' B'
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB'
}