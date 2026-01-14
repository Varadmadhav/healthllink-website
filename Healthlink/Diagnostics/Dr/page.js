 let patients = [];
        let patientIdCounter = 1;
        let isLoggedIn = false;
        let currentDoctor = '';

        /* Sample doctor credentials (in real app, this would be server-side) */
        const doctors = {
            'dr001': { password: 'med123', name: 'Dr. Smith' },
            'dr002': { password: 'health456', name: 'Dr. Johnson' },
            'admin': { password: 'admin123', name: 'Dr. Administrator' }
        };

        function login() {
            const doctorId = document.getElementById('doctorId').value;
            const password = document.getElementById('password').value;

            if (doctors[doctorId] && doctors[doctorId].password === password) {
                isLoggedIn = true;
                currentDoctor = doctors[doctorId].name;

                document.getElementById('loginForm').style.display = 'none';
                document.getElementById('loggedInStatus').style.display = 'flex';
                document.getElementById('mainContent').style.display = 'block';
                document.getElementById('doctorName').textContent = currentDoctor;

                loadSampleData();
                updateTable();
                updateStats();
            } else {
                alert('❌ Invalid credentials. Try: dr001/med123 or admin/admin123');
            }
        }

        function logout() {
            isLoggedIn = false;
            currentDoctor = '';

            document.getElementById('loginForm').style.display = 'flex';
            document.getElementById('loggedInStatus').style.display = 'none';
            document.getElementById('mainContent').style.display = 'none';

            document.getElementById('doctorId').value = '';
            document.getElementById('password').value = '';
        }

        function loadSampleData() {
            if (patients.length === 0) {
                patients = [
                    {
                        id: 1,
                        name: 'John Doe',
                        testDate: '2024-06-20',
                        testType: 'Blood Test',
                        status: 'Completed',
                        reportFile: null,
                        reportName: 'blood_test_john_doe.pdf'
                    },
                    {
                        id: 2,
                        name: 'Jane Smith',
                        testDate: '2024-06-23',
                        testType: 'X-Ray',
                        status: 'Pending',
                        reportFile: null,
                        reportName: ''
                    },
                    {
                        id: 3,
                        name: 'Mike Johnson',
                        testDate: '2024-06-22',
                        testType: 'MRI Scan',
                        status: 'Completed',
                        reportFile: null,
                        reportName: 'mri_scan_mike_johnson.pdf'
                    },
                    {
                        id: 4,
                        name: 'Sarah Wilson',
                        testDate: '2024-06-21',
                        testType: 'CT Scan',
                        status: 'In Progress',
                        reportFile: null,
                        reportName: ''
                    },
                    {
                        id: 5,
                        name: 'David Brown',
                        testDate: '2024-06-24',
                        testType: 'Ultrasound',
                        status: 'Cancelled',
                        reportFile: null,
                        reportName: ''
                    }
                ];
                patientIdCounter = 6;
            }
        }

        function downloadReport(id) {
            const patient = patients.find(p => p.id === id);

            if (patient && patient.reportFile) {
                // Create download link for uploaded file
                const url = URL.createObjectURL(patient.reportFile);
                const a = document.createElement('a');
                a.href = url;
                a.download = patient.reportName || 'report.pdf';
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                URL.revokeObjectURL(url);
            } else if (patient && patient.reportName) {
                // For demo purposes, create a sample PDF
                generateSampleReport(patient);
            } else {
                alert('No report available for this patient.');
            }
        }

        function generateSampleReport(patient) {
            const reportContent = `
MEDICAL REPORT
==============

Patient: ${patient.name}
Test Date: ${patient.testDate}
Test Type: ${patient.testType}
Status: ${patient.status}

Doctor: ${currentDoctor}
Generated: ${new Date().toLocaleDateString()}

Report Details:
- Test completed successfully
- Results within normal parameters
- Follow-up recommended in 6 months

---
This is a sample report generated for demonstration purposes.
            `;

            const blob = new Blob([reportContent], { type: 'text/plain' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `${patient.name.replace(/\s+/g, '_')}_report.txt`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        }

        function getStatusBadge(status) {
            const statusClass = `status-${status.toLowerCase().replace(' ', '-')}`;
            return `<span class="status-badge ${statusClass}">${status}</span>`;
        }

        function updateTable() {
            const tbody = document.getElementById('patientTableBody');
            tbody.innerHTML = '';

            patients.forEach(patient => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${patient.id}</td>
                    <td>
                        <div class="readonly-field">${patient.name}</div>
                    </td>
                    <td>
                        <div class="readonly-field">${new Date(patient.testDate).toLocaleDateString()}</div>
                    </td>
                    <td>
                        <div class="readonly-field">${patient.testType}</div>
                    </td>
                    <td>
                        ${getStatusBadge(patient.status)}
                    </td>
                    <td>
                        <div>
                            ${patient.reportName ? `
                                <button onclick="downloadReport(${patient.id})" class="download-btn" title="${patient.reportName}">
                                    📥 Download Report
                                </button>
                            ` : '<span style="color: #6c757d; font-style: italic;">No report available</span>'}
                        </div>
                    </td>
                `;
                tbody.appendChild(row);
            });

            // Apply current filters after updating table
            applyFilters();
        }

        function applyFilters() {
            const searchTerm = document.getElementById('searchInput').value.toLowerCase();
            const dateFrom = document.getElementById('dateFrom').value;
            const dateTo = document.getElementById('dateTo').value;
            const rows = document.querySelectorAll('#patientTableBody tr');

            rows.forEach(row => {
                const text = row.textContent.toLowerCase();
                const patientId = parseInt(row.cells[0].textContent);
                const patient = patients.find(p => p.id === patientId);
                const testDate = patient ? patient.testDate : '';

                let showRow = true;

                // Apply search filter
                if (searchTerm && !text.includes(searchTerm)) {
                    showRow = false;
                }

                // Apply date range filter
                if (showRow && dateFrom && testDate < dateFrom) {
                    showRow = false;
                }

                if (showRow && dateTo && testDate > dateTo) {
                    showRow = false;
                }

                row.style.display = showRow ? '' : 'none';
            });
        }

        function clearFilters() {
            document.getElementById('searchInput').value = '';
            document.getElementById('dateFrom').value = '';
            document.getElementById('dateTo').value = '';
            applyFilters();
        }

        function updateStats() {
            document.getElementById('totalPatients').textContent = patients.length;

            const today = new Date().toISOString().split('T')[0];
            const todayTests = patients.filter(p => p.testDate === today).length;
            document.getElementById('todayTests').textContent = todayTests;

            const pendingReports = patients.filter(p => p.status === 'Pending').length;
            document.getElementById('pendingReports').textContent = pendingReports;
        }

        function exportToExcel() {
            let csvContent = "Patient ID,Patient Name,Test Date,Test Type,Status,Report Available\n";

            patients.forEach(patient => {
                csvContent += `${patient.id},"${patient.name}",${patient.testDate},${patient.testType},${patient.status},${patient.reportName ? 'Yes' : 'No'}\n`;
            });

            const blob = new Blob([csvContent], { type: 'text/csv' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `patient_records_${new Date().toISOString().split('T')[0]}.csv`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        }

        // Initialize the application
        document.addEventListener('DOMContentLoaded', function () {
            updateStats();
        });