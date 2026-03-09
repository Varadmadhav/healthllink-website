const API_BASE = "http://localhost:5000/api";

// Get stored login info
const token = localStorage.getItem("token");
const companyId = localStorage.getItem("companyId");
const userId = localStorage.getItem("userId");


// =========================
// LOAD UPLOAD HISTORY
// =========================

async function loadUploadHistory() {

    try {

        const res = await fetch(`${API_BASE}/upload/history?companyId=${companyId}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

       const uploads = await res.json();

if (!Array.isArray(uploads)) {
    console.error("Invalid response from server:", uploads);
    return;
}

        const table = document.getElementById("historyTableBody");

        table.innerHTML = "";

        uploads.forEach(upload => {

            const row = document.createElement("tr");

            row.innerHTML = `
                <td>${upload.fileName}</td>
                <td>${new Date(upload.createdAt).toLocaleString()}</td>
                <td>${upload.recordsCount} patients</td>
                <td>
                    <button onclick="loadPatients('${upload._id}')">
                        View Data
                    </button>
                </td>
            `;

            table.appendChild(row);

        });

    } catch (err) {

        console.error("History load error", err);

    }

}


// =========================
// LOAD PATIENT RECORDS
// =========================

async function loadPatients(uploadId) {

    try {

        const res = await fetch(`${API_BASE}/patients/upload/${uploadId}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        const patients = await res.json();

        const tbody = document.getElementById("recordsTableBody");

        tbody.innerHTML = "";

        patients.forEach(patient => {

            const row = document.createElement("tr");

            row.innerHTML = `
                <td>${patient.name}</td>
                <td>${patient.gender}</td>
                <td>${patient.age}</td>
                <td>${patient.appointmentDate ? new Date(patient.appointmentDate).toLocaleDateString() : "-"}</td>
                <td>${patient.address}</td>
                <td>${patient.pincode}</td>
                <td>${patient.phone}</td>
                <td>${patient.email}</td>
                <td>${patient.status || "Pending"}</td>
                <td>-</td>
            `;

            tbody.appendChild(row);

        });

    } catch (err) {

        console.error("Patient load error", err);

    }

}


// =========================
// INITIALIZE DASHBOARD
// =========================

document.addEventListener("DOMContentLoaded", () => {

    loadUploadHistory();

});