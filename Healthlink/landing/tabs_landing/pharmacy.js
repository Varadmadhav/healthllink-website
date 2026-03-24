
        // Filter functionality
        const searchInput = document.getElementById('search');
        const dateFromInput = document.getElementById('dateFrom');
        const dateToInput = document.getElementById('dateTo');
        const statusSelect = document.getElementById('status');
        const reportsGrid = document.getElementById('reportsGrid');
        const reportCards = document.querySelectorAll('.report-card');

        function filterReports() {
            const searchTerm = searchInput.value.toLowerCase();
            const dateFrom = dateFromInput.value;
            const dateTo = dateToInput.value;
            const statusFilter = statusSelect.value;

            reportCards.forEach(card => {
                const reportType = card.querySelector('.report-type').textContent.toLowerCase();
                const reportDate = card.dataset.date;
                const reportStatus = card.dataset.status;
                
                let showCard = true;

                // Search filter
                if (searchTerm && !reportType.includes(searchTerm)) {
                    showCard = false;
                }

                // Date range filter
                if (dateFrom && reportDate < dateFrom) {
                    showCard = false;
                }
                if (dateTo && reportDate > dateTo) {
                    showCard = false;
                }

                // Status filter
                if (statusFilter && reportStatus !== statusFilter) {
                    showCard = false;
                }

                card.style.display = showCard ? 'block' : 'none';
            });

            // Check if any reports are visible
            const visibleReports = Array.from(reportCards).filter(card => card.style.display !== 'none');
            if (visibleReports.length === 0) {
                showNoReportsMessage();
            } else {
                hideNoReportsMessage();
            }
        }

        function showNoReportsMessage() {
            const existingMessage = document.querySelector('.no-reports');
            if (!existingMessage) {
                const noReportsDiv = document.createElement('div');
                noReportsDiv.className = 'no-reports';
                noReportsDiv.innerHTML = `
                    <h3>No reports found</h3>
                    <p>Try adjusting your search criteria or filters.</p>
                `;
                reportsGrid.appendChild(noReportsDiv);
            }
        }

        function hideNoReportsMessage() {
            const existingMessage = document.querySelector('.no-reports');
            if (existingMessage) {
                existingMessage.remove();
            }
        }

        // Add event listeners for filters
        searchInput.addEventListener('input', filterReports);
        dateFromInput.addEventListener('change', filterReports);
        dateToInput.addEventListener('change', filterReports);
        statusSelect.addEventListener('change', filterReports);

        // PDF Functions
        function viewPDF(filename) {
            document.getElementById('pdfTitle').textContent = 'Viewing: ' + filename;
            document.getElementById('currentPdfName').textContent = filename;
            document.getElementById('pdfModal').style.display = 'block';
        }

        function downloadPDF(filename) {
            // In a real application, this would download the actual PDF file
            // For demo purposes, we'll simulate the download
            alert(`Downloading: ${filename}\n\nIn a real application, this would start the PDF download from the server.`);
            
            // Simulate file download
            const link = document.createElement('a');
            link.href = '#'; // In real app, this would be the PDF URL
            link.download = filename;
            link.click();
        }

        function closePDFViewer() {
            document.getElementById('pdfModal').style.display = 'none';
        }

        // Close modal when clicking outside
        document.getElementById('pdfModal').addEventListener('click', function(e) {
            if (e.target === this) {
                closePDFViewer();
            }
        });

        // Keyboard shortcut to close modal
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape') {
                closePDFViewer();
            }
        });

          // Show modal on page load
        window.addEventListener('load', function() {
            showModal();
        });

        function showModal() {
            const modal = document.getElementById('loginModal');
            const pageContent = document.getElementById('pageContent');
            
            modal.classList.remove('hidden');
            pageContent.classList.add('page-blur');
        }

        function closeModal() {
            // Redirect to main page
            window.location.href = '/landing/landing.html';
        }

        // Close modal when clicking outside of it
        document.getElementById('loginModal').addEventListener('click', function(e) {
            if (e.target === this) {
                closeModal();
            }zz
        });

        // Close modal with Escape key
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape') {
                closeModal();
            }
        });