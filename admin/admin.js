// ===== API Base =====
const API_BASE = "http://localhost:5000/api"

// ===== Global State =====
let uploadedFiles = []
let centersData = []
let companiesData = []
let selectedFileId = null
let allPatients = []
let confirmedPatientsForReports = []
let preselectedCenterMap = {}
let dateChangeRequests = []   // patients with pending date change requests

// ===== Init =====
document.addEventListener('DOMContentLoaded', function () {
  initializeTabs()
  fetchCompanies()
  fetchCenters()
  fetchUploads()
  fetchDateChangeRequests()
})

// ===== Tabs =====
function initializeTabs() {
  const tabs = document.querySelectorAll('.nav-tab')
  const contents = document.querySelectorAll('.tab-content')
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const targetId = tab.dataset.tab
      tabs.forEach(t => t.classList.remove('active'))
      tab.classList.add('active')
      contents.forEach(c => {
        c.classList.remove('active')
        if (c.id === targetId) c.classList.add('active')
      })
      refreshTabData(targetId)
    })
  })
}

function refreshTabData(tabId) {
  switch (tabId) {
    case 'review-requests':   fetchUploads(); break
    case 'make-confirmation': fetchAllPatientsForConfirmation(); fetchDateChangeRequests(); break
    case 'reports':           fetchConfirmedPatientsForReports(); break
    case 'add-centers':       renderCentersTable(); break
    case 'add-companies':     renderCompaniesTable(); break
  }
}

// =====================================================================
// REVIEW REQUESTS
// =====================================================================

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
      pendingCount: u.pendingCount || 0,
      confirmedCount: u.confirmedCount || 0,
      employees: []
    }))
    renderExcelFilesGrid()
  } catch (err) {
    console.error("fetchUploads:", err)
    showToast("Could not load upload files", "error")
  }
}

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
  const sorted = [...uploadedFiles].sort((a, b) => b.uploadTimestamp - a.uploadTimestamp)
  grid.innerHTML = sorted.map(file => {
    const statusClass = file.status === 'approved' ? 'processed' : file.status === 'rejected' ? 'rejected' : 'new'
    const statusLabel = file.status === 'approved' ? '✓ Approved' : file.status === 'rejected' ? '✗ Rejected' : '🆕 Pending'
    return `
      <div class="excel-file-card ${selectedFileId === file.id ? 'selected' : ''}" onclick="openFileView('${file.id}')">
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
          <button class="btn btn-primary btn-sm" onclick="event.stopPropagation(); openFileView('${file.id}')">View Data →</button>
        </div>
      </div>
    `
  }).join('')
}

async function openFileView(fileId) {
  selectedFileId = fileId
  const file = uploadedFiles.find(f => f.id === fileId)
  if (!file) return
  document.getElementById('selected-file-card').style.display = 'block'
  document.getElementById('selected-file-name').textContent = file.fileName
  document.getElementById('selected-file-meta').textContent = `${file.records} records • Uploaded on ${file.uploadDate}`
  document.getElementById('review-table-body').innerHTML =
    `<tr><td colspan="12" style="text-align:center;padding:30px;color:var(--text-tertiary);">Loading...</td></tr>`
  document.getElementById('center-matching-card').style.display = 'none'
  try {
    const res = await fetch(`${API_BASE}/admin/uploads/${fileId}/patients`)
    const patients = await res.json()
    file.employees = patients.map(normalisePatient)
    renderEmployeesTable(file)
    renderCenterMatchingForFile(file)
  } catch (err) {
    console.error("openFileView:", err)
    showToast("Could not load employee data", "error")
  }
  renderExcelFilesGrid()

  // Auto-scroll to data table so admin sees the records immediately
  setTimeout(() => {
    const card = document.getElementById('selected-file-card')
    if (card) card.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }, 100)
}

function closeFileView() {
  selectedFileId = null
  document.getElementById('selected-file-card').style.display = 'none'
  document.getElementById('center-matching-card').style.display = 'none'
  renderExcelFilesGrid()
}

function normalisePatient(p) {
  const rawStatus = (p.status || "pending").toLowerCase()
  const finalStatus = rawStatus
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
    dateChangeRequest: p.dateChangeRequest || null,
    assignedCenter: p.assignedCenterId ? {
      id: p.assignedCenterId._id || p.assignedCenterId,
      name: p.assignedCenterId.name || "",
      phone: p.assignedCenterId.phone || "",
      pincode: p.assignedCenterId.pincode || "",
      address: p.assignedCenterId.address || ""
    } : null,
    reportUrls: p.reportUrls && p.reportUrls.length > 0
      ? p.reportUrls
      : (p.reportUrl ? [{ url: p.reportUrl, originalName: 'Report', uploadedAt: null }] : [])
  }
}

function renderEmployeesTable(file) {
  const tbody = document.getElementById('review-table-body')
  tbody.innerHTML = file.employees.map(emp => `
    <tr>
      <td><input type="checkbox" class="employee-checkbox" data-id="${emp.id}" ${emp.status === 'confirmed' ? 'disabled' : ''}></td>
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
          emp.status === 'confirmed' ? 'badge-success'
: emp.status === 'rejected' ? 'badge-danger'
: emp.status === 'requested' ? 'badge-info'
: emp.status === 'approved' ? 'badge-warning'
: 'badge-pending'
        }">
          ${emp.status === 'confirmed' ? '✅ Confirmed'
: emp.status === 'rejected' ? '❌ Rejected'
: emp.status === 'requested' ? '📝 Requested'
: emp.status === 'approved' ? '👍 Approved'
: '⏳ Pending'}
        </span>
      </td>
    </tr>
  `).join('')
}

async function renderCenterMatchingForFile(file) {
  const card = document.getElementById('center-matching-card')
  const tbody = document.getElementById('center-matching-body')
 const pendingEmployees = file.employees.filter(emp => emp.status === 'pending')
  if (pendingEmployees.length === 0) { card.style.display = 'none'; return }
  card.style.display = 'block'
  tbody.innerHTML = `<tr><td colspan="7" style="text-align:center;padding:20px;color:var(--text-tertiary);">🔍 Finding nearby centres...</td></tr>`
  const rows = await Promise.all(pendingEmployees.map(async (emp) => {
    const nearby = await fetchNearbyCenters(emp.pincode, 3)
    return { emp, nearby }
  }))
  tbody.innerHTML = rows.map(({ emp, nearby }) => `
    <tr>
      <td><strong>${emp.employeeName}</strong></td>
      <td>${emp.appointmentDate ? new Date(emp.appointmentDate).toLocaleDateString() : '-'}</td>
      <td><span class="badge badge-warning">${emp.pincode || '-'}</span></td>
      <td>${renderCenterCell(nearby[0])}</td>
      <td>${renderCenterCell(nearby[1])}</td>
      <td>${renderCenterCell(nearby[2])}</td>
      <td><button class="btn btn-primary btn-sm" onclick="document.querySelector('[data-tab=make-confirmation]').click()">Assign →</button></td>
    </tr>
  `).join('')
}

function renderCenterCell(center) {
  if (!center) return '<span style="color:var(--text-tertiary);">-</span>'
  return `<div class="center-info"><div class="center-name">${center.name}</div><div class="center-phone">📞 ${center.phone}</div></div>`
}

async function fetchNearbyCenters(pincode, limit = 3) {
  if (!pincode || String(pincode).trim() === "") return []
  try {
    const res = await fetch(`${API_BASE}/admin/centers/nearby?pincode=${encodeURIComponent(pincode)}&limit=${limit}`)
    const data = await res.json()
    return Array.isArray(data) ? data : []
  } catch (err) { console.error("fetchNearbyCenters:", err); return [] }
}

function toggleSelectAll(checkbox) {
  document.querySelectorAll('.employee-checkbox:not(:disabled)').forEach(cb => cb.checked = checkbox.checked)
}

async function processAllEmployees() {
  const file = uploadedFiles.find(f => f.id === selectedFileId)
  if (!file) return
  const pending = file.employees.filter(e => e.status === 'pending')
  if (pending.length === 0) { showToast('No pending employees to process!', 'warning'); return }
  showToast('Finding nearest centres for all employees...', 'success')
  await Promise.all(pending.map(async (emp) => {
    const nearby = await fetchNearbyCenters(emp.pincode, 1)
    if (nearby.length > 0) emp._preselectedCenterId = String(nearby[0]._id)
  }))
  preselectedCenterMap = {}
  pending.forEach(emp => { if (emp._preselectedCenterId) preselectedCenterMap[emp.id] = emp._preselectedCenterId })
  await fetchAllPatientsForConfirmation()
  showToast(`${pending.length} employees ready — nearest centre pre-selected!`, 'success')
  document.querySelector('[data-tab="make-confirmation"]').click()
}

// =====================================================================
// MAKE CONFIRMATION
// =====================================================================

async function fetchAllPatientsForConfirmation() {
  try {
    const res = await fetch(`${API_BASE}/admin/patients`)
    const data = await res.json()
    allPatients = data.map(normalisePatient)
    renderConfirmationTable()
    renderConfirmedTable()
    updateStats()
  } catch (err) {
    console.error("fetchAllPatientsForConfirmation:", err)
    showToast("Could not load patient data", "error")
  }
}

async function renderConfirmationTable() {
  const tbody = document.getElementById('confirmation-table-body')
  const emptyState = document.getElementById('confirmation-empty')
  // Include confirmed employees who have a pending date change request
  const pending = allPatients.filter(emp =>
    emp.status === 'pending'||
    (emp.dateChangeRequest && emp.dateChangeRequest.status === 'pending')
  )
  if (pending.length === 0) { tbody.innerHTML = ''; emptyState.style.display = 'flex'; return }
  emptyState.style.display = 'none'
  tbody.innerHTML = `<tr><td colspan="7" style="text-align:center;padding:20px;color:var(--text-tertiary);">🔍 Loading centres...</td></tr>`

  const rows = await Promise.all(pending.map(async (emp) => {
    const nearby = await fetchNearbyCenters(emp.pincode, 3)
    return { emp, nearby }
  }))

  tbody.innerHTML = rows.map(({ emp, nearby }) => {
    const nearbyIds = new Set(nearby.map(c => String(c._id)))
    const otherCenters = centersData.filter(c => !nearbyIds.has(String(c.id)))
    const autoSelectId = preselectedCenterMap[emp.id] || (nearby.length > 0 ? String(nearby[0]._id) : '')

    const appointmentDate = emp.appointmentDate ? new Date(emp.appointmentDate) : null

    // Show pending date change request badge if any
    const dcr = emp.dateChangeRequest
    let dcrBadge = ''
    if (dcr && dcr.status === 'pending') {
      dcrBadge = `<br><span style="font-size:11px;background:#fff3cd;color:#856404;padding:1px 6px;border-radius:8px;white-space:nowrap;">⏳ ${new Date(dcr.requestedDate).toLocaleDateString()}</span>`
    }

    return `
      <tr>
        <td><strong>${emp.employeeName}</strong></td>
        <td>${emp.phone || '-'}</td>
        <td>${emp.company || '-'}</td>
        <td>${emp.pincode || '-'}</td>
        <td style="white-space:nowrap;">
          ${appointmentDate ? appointmentDate.toLocaleDateString() : '-'}${dcrBadge}
        </td>
        <td>
          <select class="center-select" id="select-${emp.id}">
            <option value="">Select a center...</option>
            ${nearby.map(c => `<option value="${c._id}" ${String(c._id) === autoSelectId ? 'selected' : ''}>${c.name} (${c.pincode})</option>`).join('')}
            ${otherCenters.length > 0 ? `<option disabled>──── Other centres ────</option>` : ''}
            ${otherCenters.map(c => `<option value="${c.id}" ${String(c.id) === autoSelectId ? 'selected' : ''}>${c.name} (${c.pincode})</option>`).join('')}
          </select>
        </td>
        <td>
          <button class="btn btn-success btn-sm" onclick="confirmAssignment('${emp.id}')">✓ Confirm</button>
          <button class="btn btn-danger btn-sm" onclick="rejectPatient('${emp.id}')">✗ Reject</button>
        </td>
      </tr>
    `
  }).join('')

  updateStats()
}

// =====================================================================
// DATE CHANGE REQUESTS (shown in make-confirmation tab)
// =====================================================================

async function fetchDateChangeRequests() {
  try {
    const res = await fetch(`${API_BASE}/admin/patients/date-change-requests`)
    const data = await res.json()
    dateChangeRequests = data.map(normalisePatient)
    renderDateChangeRequestsTable()
  } catch (err) {
    console.error("fetchDateChangeRequests:", err)
  }
}

function renderDateChangeRequestsTable() {
  const container = document.getElementById('date-change-requests-section')
  if (!container) return

  if (dateChangeRequests.length === 0) {
    container.innerHTML = ''
    return
  }

  container.innerHTML = `
    <div class="card">
      <div class="card-header">
        <h2>📅 Date Change Requests</h2>
        <span class="badge badge-warning">${dateChangeRequests.length} pending</span>
      </div>
      <div class="table-container">
        <table class="data-table">
          <thead>
            <tr>
              <th>Employee</th>
              <th>Company</th>
              <th>Current Date</th>
              <th>Requested Date</th>
              <th>Requested By</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            ${dateChangeRequests.map(p => {
              const dcr = p.dateChangeRequest
              const currentDate = p.appointmentDate ? new Date(p.appointmentDate).toLocaleDateString('en-IN') : '-'
              const requestedDate = dcr && dcr.requestedDate ? new Date(dcr.requestedDate).toLocaleDateString('en-IN') : '-'
              const requestedBy = dcr ? (dcr.requestedByName || dcr.requestedBy) : '-'
              const requestedAt = dcr && dcr.requestedAt ? new Date(dcr.requestedAt).toLocaleDateString('en-IN') : ''

              const reqDateObj = dcr && dcr.requestedDate ? new Date(dcr.requestedDate) : null
              const hoursUntilReq = reqDateObj ? (reqDateObj - new Date()) / (1000 * 60 * 60) : 999
              const canApprove = hoursUntilReq > 48
              const approveTitle = !canApprove
                ? (reqDateObj && reqDateObj < new Date()
                  ? "Cannot approve — requested date is in the past"
                  : "Cannot approve — requested date is less than 48 hours away")
                : ""

              return `
                <tr>
                  <td><strong>${p.employeeName}</strong></td>
                  <td>${p.company || '-'}</td>
                  <td>${currentDate}</td>
                  <td>
                    <span style="color:var(--primary-color);font-weight:600;">${requestedDate}</span>
                    <br>
                    <span style="font-size:12px;color:var(--text-tertiary);">on ${requestedAt}</span>
                  </td>
                  <td><span class="badge badge-info">${requestedBy}</span></td>
                  <td>
                    <div class="action-btns">
                      ${canApprove
                        ? `<button class="btn btn-success btn-sm" onclick="reviewDateRequest('${p.id}', 'approve')">✓ Approve</button>`
                        : `<button class="btn btn-secondary btn-sm" disabled style="opacity:0.4;cursor:not-allowed;" title="${approveTitle}">✓ Approve</button>`
                      }
                      <button class="btn btn-danger btn-sm" onclick="reviewDateRequest('${p.id}', 'reject')">✗ Reject</button>
                    </div>
                  </td>
                </tr>
              `
            }).join('')}
          </tbody>
        </table>
      </div>
    </div>
  `
}

async function reviewDateRequest(patientId, action) {
  try {
    const res = await fetch(`${API_BASE}/admin/patients/${patientId}/review-date`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action })
    })
    if (!res.ok) {
      const d = await res.json()
      showToast(d.message || "Failed to review request", "error")
      return
    }
    showToast(`Date change request ${action}d!`, "success")
    // Refresh both sections
    fetchAllPatientsForConfirmation()
    fetchDateChangeRequests()
  } catch (err) {
    console.error("reviewDateRequest:", err)
    showToast("Server error", "error")
  }
}

async function confirmAssignment(patientId) {
  const selectEl = document.getElementById(`select-${patientId}`)
  const centerId = selectEl ? selectEl.value : ''
  if (!centerId) { showToast('Please select a center first!', 'warning'); return }
  try {
    const res = await fetch(`${API_BASE}/admin/patients/${patientId}/assign`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ centerId })
    })
    if (!res.ok) throw new Error("Assignment failed")
    const updated = await res.json()
    const normUpdated = normalisePatient(updated)
    const idx = allPatients.findIndex(p => p.id === patientId)
    if (idx !== -1) allPatients[idx] = normUpdated
    if (selectedFileId) {
      const file = uploadedFiles.find(f => f.id === selectedFileId)
      if (file) {
        const ei = file.employees.findIndex(e => e.id === patientId)
        if (ei !== -1) file.employees[ei] = normUpdated
        renderEmployeesTable(file)
        renderCenterMatchingForFile(file)
      }
    }
    delete preselectedCenterMap[patientId]
    renderConfirmationTable()
    renderConfirmedTable()
    updateStats()
    showToast(`${normUpdated.employeeName} assigned to ${normUpdated.assignedCenter?.name || 'centre'}!`, 'success')
  } catch (err) {
    console.error("confirmAssignment:", err)
    showToast("Error assigning center", "error")
  }
}

function renderConfirmedTable() {
  const tbody = document.getElementById('confirmed-table-body')
  const countBadge = document.getElementById('confirmed-count')

  // Exclude confirmed employees who have a pending date change request
  // — they show in Pending Assignments instead until request is resolved
const pending = allPatients.filter(emp =>
  emp.status === 'pending' ||
  (emp.status === 'confirmed' && emp.dateChangeRequest && emp.dateChangeRequest.status === 'pending')
)

countBadge.textContent = `${confirmed.length} Confirmed`
  countBadge.textContent = `${confirmed.length} Confirmed`
  if (confirmed.length === 0) {
    tbody.innerHTML = `<tr><td colspan="5" style="text-align:center;padding:40px;color:var(--text-tertiary);">No confirmed assignments yet</td></tr>`
    return
  }
  tbody.innerHTML = confirmed.map(emp => `
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
  const confirmed = allPatients.filter(e =>
    e.status === 'confirmed' &&
    !(e.dateChangeRequest && e.dateChangeRequest.status === 'pending')
  ).length
  const pending = allPatients.filter(e => e.status === "pending").length
  document.getElementById('pending-count').textContent = pending
  document.getElementById('confirmed-count-stat').textContent = confirmed
  document.getElementById('total-count').textContent = allPatients.length
}

// =====================================================================
// REPORTS
// =====================================================================

async function fetchConfirmedPatientsForReports() {
  try {
    const res = await fetch(`${API_BASE}/admin/patients`)
    const data = await res.json()
  confirmedPatientsForReports = data.filter(p => p.status === "confirmed").map(normalisePatient)
    renderReportsTable()
  } catch (err) {
    console.error("fetchConfirmedPatientsForReports:", err)
    showToast("Could not load reports data", "error")
  }
}

function renderReportsTable() {
  const tbody = document.getElementById('reports-table-body')
  const emptyState = document.getElementById('reports-empty')
  if (confirmedPatientsForReports.length === 0) {
    tbody.innerHTML = ''; emptyState.style.display = 'flex'; return
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
          <label class="file-input-label">📎 Upload PDF<input type="file" accept=".pdf" onchange="handleReportUpload('${emp.id}', this)"></label>
        </div>
      </td>
      <td>
        ${emp.reportUrls && emp.reportUrls.length > 0 ? `
          <div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap;">
            <select class="center-select" id="report-select-${emp.id}" style="min-width:150px;font-size:12px;padding:6px 8px;">
              ${emp.reportUrls.map((r, i) => `<option value="${r.url}">${r.originalName || 'Report ' + (i + 1)}</option>`).join('')}
            </select>
            <button class="btn btn-sm btn-secondary" onclick="viewSelectedReport('${emp.id}')">👁 View</button>
            <button class="btn btn-sm btn-danger" onclick="removeSelectedReport('${emp.id}')">🗑 Remove</button>
            <span class="badge badge-info">${emp.reportUrls.length} file${emp.reportUrls.length > 1 ? 's' : ''}</span>
          </div>` : '<span style="color:var(--text-tertiary);">No reports</span>'}
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
    const res = await fetch(`${API_BASE}/admin/patients/${patientId}/report`, { method: "POST", body: formData })
    if (!res.ok) throw new Error("Upload failed")
    const data = await res.json()
    const idx = confirmedPatientsForReports.findIndex(p => p.id === patientId)
    if (idx !== -1) confirmedPatientsForReports[idx].reportUrls.push(data.reportEntry)
    renderReportsTable()
    showToast(`Report "${file.name}" uploaded successfully!`, 'success')
  } catch (err) { console.error("handleReportUpload:", err); showToast("Error uploading report", "error") }
}

function viewSelectedReport(patientId) {
  const select = document.getElementById(`report-select-${patientId}`)
  if (!select || !select.value) return
  window.open(`http://localhost:5000${select.value}`, '_blank')
}

async function removeSelectedReport(patientId) {
  const select = document.getElementById(`report-select-${patientId}`)
  if (!select || !select.value) return
  if (!confirm('Remove this report?')) return
  const reportUrl = select.value
  try {
    const res = await fetch(`${API_BASE}/admin/patients/${patientId}/report`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ reportUrl })
    })
    if (!res.ok) throw new Error("Delete failed")
    const idx = confirmedPatientsForReports.findIndex(p => p.id === patientId)
    if (idx !== -1) confirmedPatientsForReports[idx].reportUrls = confirmedPatientsForReports[idx].reportUrls.filter(r => r.url !== reportUrl)
    renderReportsTable()
    showToast('Report removed successfully!', 'success')
  } catch (err) { console.error("removeSelectedReport:", err); showToast("Error removing report", "error") }
}

// =====================================================================
// CENTERS
// =====================================================================

async function fetchCenters() {
  try {
    const res = await fetch(API_BASE + "/admin/centers")
    const data = await res.json()
    centersData = data.map(c => ({ id: c._id, name: c.name, email: c.email || "", phone: c.phone || "", address: c.address || "", pincode: c.pincode || "" }))
    renderCentersTable()
  } catch (err) { console.error(err) }
}

function renderCentersTable() {
  const tbody = document.getElementById('centers-table-body')
  if (centersData.length === 0) {
    tbody.innerHTML = `<tr><td colspan="6" style="text-align:center;padding:40px;color:var(--text-tertiary);">No centers added yet. Click "+ Add Center" to get started.</td></tr>`
    return
  }
  tbody.innerHTML = centersData.map(center => `
    <tr>
      <td><strong>${center.name}</strong></td>
      <td>${center.email}</td><td>${center.phone}</td><td>${center.address}</td>
      <td><span class="badge badge-info">${center.pincode}</span></td>
      <td><div class="action-btns">
        <button class="btn btn-sm btn-secondary" onclick="editCenter('${center.id}')">✏️</button>
        <button class="btn btn-sm btn-danger" onclick="deleteCenter('${center.id}')">🗑️</button>
      </div></td>
    </tr>
  `).join('')
}

async function saveCenter(event) {
  event.preventDefault()
  const center = {
    name: document.getElementById('center-name').value, email: document.getElementById('center-email').value,
    phone: document.getElementById('center-phone').value, address: document.getElementById('center-address').value,
    pincode: document.getElementById('center-pincode').value
  }
  try {
    const res = await fetch(API_BASE + "/admin/centers", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(center) })
    const data = await res.json()
    centersData.push({ id: data._id, name: data.name, email: data.email || "", phone: data.phone || "", address: data.address || "", pincode: data.pincode || "" })
    renderCentersTable(); closeModal('center-modal'); showToast("Center added successfully!", "success")
  } catch (err) { showToast("Error adding center", "error") }
}

function editCenter(id) {
  const c = centersData.find(x => x.id === id)
  if (c) {
    document.getElementById('center-name').value = c.name; document.getElementById('center-email').value = c.email
    document.getElementById('center-phone').value = c.phone; document.getElementById('center-address').value = c.address
    document.getElementById('center-pincode').value = c.pincode
    centersData = centersData.filter(x => x.id !== id); openModal('center-modal')
  }
}

function deleteCenter(id) {
  if (confirm('Are you sure you want to delete this center?')) {
    centersData = centersData.filter(c => c.id !== id); renderCentersTable(); showToast('Center deleted successfully!', 'success')
  }
}

// =====================================================================
// COMPANIES
// =====================================================================

async function fetchCompanies() {
  try {
    const res = await fetch(API_BASE + "/admin/companies")
    const data = await res.json()
    companiesData = data.map(c => ({ id: c._id, name: c.name, address: c.address || "", email: c.email || "", phone: c.phone || "", pincode: c.pincode || "" }))
    renderCompaniesTable()
  } catch (err) { console.error(err) }
}

function renderCompaniesTable() {
  const tbody = document.getElementById('companies-table-body')
  if (companiesData.length === 0) {
    tbody.innerHTML = `<tr><td colspan="6" style="text-align:center;padding:40px;color:var(--text-tertiary);">No companies added yet. Click "+ Add Company" to get started.</td></tr>`
    return
  }
  tbody.innerHTML = companiesData.map(company => `
    <tr>
      <td><strong>${company.name}</strong></td>
      <td>${company.address}</td><td>${company.email}</td><td>${company.phone}</td>
      <td><span class="badge badge-info">${company.pincode}</span></td>
      <td><div class="action-btns">
        <button class="btn btn-sm btn-secondary" onclick="editCompany('${company.id}')">✏️</button>
        <button class="btn btn-sm btn-danger" onclick="deleteCompany('${company.id}')">🗑️</button>
      </div></td>
    </tr>
  `).join('')
}

async function saveCompany(event) {
  event.preventDefault()
  const company = {
    name: document.getElementById('company-name').value, address: document.getElementById('company-address').value,
    email: document.getElementById('company-email').value, phone: document.getElementById('company-phone').value,
    pincode: document.getElementById('company-pincode').value
  }
  try {
    const res = await fetch(API_BASE + "/admin/companies", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(company) })
    const data = await res.json()
    companiesData.push({ id: data._id, name: data.name, address: data.address || "", email: data.email || "", phone: data.phone || "", pincode: data.pincode || "" })
    renderCompaniesTable(); closeModal('company-modal'); showToast("Company added successfully!", "success")
  } catch (err) { showToast("Error adding company", "error") }
}

function editCompany(id) {
  const c = companiesData.find(x => x.id === id)
  if (c) {
    document.getElementById('company-name').value = c.name; document.getElementById('company-address').value = c.address
    document.getElementById('company-email').value = c.email; document.getElementById('company-phone').value = c.phone
    document.getElementById('company-pincode').value = c.pincode
    companiesData = companiesData.filter(x => x.id !== id); openModal('company-modal')
  }
}

function deleteCompany(id) {
  if (confirm('Are you sure you want to delete this company?')) {
    companiesData = companiesData.filter(c => c.id !== id); renderCompaniesTable(); showToast('Company deleted successfully!', 'success')
  }
}

// =====================================================================
// HR
// =====================================================================

function populateCompanyDropdown() {
  const select = document.getElementById("hr-company")
  select.innerHTML = companiesData.map(c => `<option value="${c.id}">${c.name}</option>`).join("")
}

async function createHR(event) {
  event.preventDefault()
  const hr = {
    name: document.getElementById("hr-name").value, email: document.getElementById("hr-email").value,
    password: document.getElementById("hr-password").value, companyId: document.getElementById("hr-company").value
  }
  try {
    await fetch(API_BASE + "/hr/create", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(hr) })
    closeModal("hr-modal"); showToast("HR account created successfully", "success")
  } catch (err) { showToast("Error creating HR", "error") }
}

// =====================================================================
// MODALS
// =====================================================================

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
  modal.addEventListener('click', (e) => { if (e.target === modal) closeModal(modal.id) })
})

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') document.querySelectorAll('.modal.active').forEach(m => closeModal(m.id))
})

// =====================================================================
// TABLE UTILITIES
// =====================================================================

function sortTable(tableId, columnIndex) {
  const table = document.getElementById(tableId)
  const tbody = table.querySelector('tbody')
  const rows = Array.from(tbody.querySelectorAll('tr'))
  if (rows.length === 0 || rows[0].cells.length <= columnIndex) return
  const isAsc = table.dataset.sortColumn !== String(columnIndex) || table.dataset.sortDirection !== 'asc'
  rows.sort((a, b) => {
    const av = a.cells[columnIndex]?.textContent.trim().toLowerCase() || ''
    const bv = b.cells[columnIndex]?.textContent.trim().toLowerCase() || ''
    const an = parseFloat(av); const bn = parseFloat(bv)
    if (!isNaN(an) && !isNaN(bn)) return isAsc ? an - bn : bn - an
    return isAsc ? av.localeCompare(bv) : bv.localeCompare(av)
  })
  table.dataset.sortColumn = columnIndex
  table.dataset.sortDirection = isAsc ? 'asc' : 'desc'
  rows.forEach(row => tbody.appendChild(row))
}

function searchTable(tableId, searchTerm) {
  const table = document.getElementById(tableId)
  const rows = table.querySelector('tbody').querySelectorAll('tr')
  const term = searchTerm.toLowerCase()
  rows.forEach(row => { row.style.display = row.textContent.toLowerCase().includes(term) ? '' : 'none' })
}

// =====================================================================
// TOAST
// =====================================================================

function showToast(message, type = 'success') {
  const toast = document.getElementById('toast')
  toast.className = 'toast ' + type
  toast.querySelector('.toast-icon').textContent = type === 'success' ? '✓' : type === 'error' ? '✕' : '⚠'
  toast.querySelector('.toast-message').textContent = message
  toast.classList.add('show')
  setTimeout(() => toast.classList.remove('show'), 3000)
}

function formatFileSize(bytes) {
  if (bytes < 1024) return bytes + ' B'
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB'
}
async function rejectPatient(patientId) {
  if (!confirm("Are you sure you want to reject this patient?")) return

  try {
    const res = await fetch(`${API_BASE}/admin/patients/${patientId}/reject`, {
      method: "PUT"
    })

    if (!res.ok) throw new Error("Reject failed")

    const updated = await res.json()
    const normUpdated = normalisePatient(updated)

    const idx = allPatients.findIndex(p => p.id === patientId)
    if (idx !== -1) allPatients[idx] = normUpdated

    renderConfirmationTable()
    renderConfirmedTable()
    updateStats()

    showToast("Patient rejected successfully", "success")
  } catch (err) {
    console.error(err)
    showToast("Error rejecting patient", "error")
  }
}