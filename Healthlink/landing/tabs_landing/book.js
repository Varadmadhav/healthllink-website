let selectedOption = null;

function selectOption(option) {
    selectedOption = option;

    // Update visual selection
    document.querySelectorAll('.option-card').forEach(card => {
        card.classList.remove('selected');
    });

    event.currentTarget.classList.add('selected');

    // Check the radio button
    document.getElementById('option' + option.charAt(0).toUpperCase() + option.slice(1)).checked = true;

    // Show/hide conditional fields
    document.getElementById('departmentField').classList.remove('show');
    document.getElementById('prescriptionField').classList.remove('show');

    if (option === 'department') {
        document.getElementById('departmentField').classList.add('show');
        // Reset prescription
        document.getElementById('prescription').value = '';
        removeFile();
    } else if (option === 'prescription') {
        document.getElementById('prescriptionField').classList.add('show');
        // Reset department
        document.getElementById('department').value = '';
        updateSelectedServices();
    }
}

// File upload handling
const fileInput = document.getElementById('prescription');
const fileUploadArea = document.querySelector('.file-upload-area');

fileUploadArea.addEventListener('click', () => fileInput.click());

fileUploadArea.addEventListener('dragover', (e) => {
    e.preventDefault();
    fileUploadArea.classList.add('dragover');
});

fileUploadArea.addEventListener('dragleave', () => {
    fileUploadArea.classList.remove('dragover');
});

fileUploadArea.addEventListener('drop', (e) => {
    e.preventDefault();
    fileUploadArea.classList.remove('dragover');
    const files = e.dataTransfer.files;
    if (files.length > 0) {
        fileInput.files = files;
        handleFileSelect(files[0]);
    }
});

fileInput.addEventListener('change', (e) => {
    if (e.target.files.length > 0) {
        handleFileSelect(e.target.files[0]);
    }
});

function handleFileSelect(file) {
    // Check file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
        alert('File size must be less than 5MB');
        return;
    }

    // Check file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf'];
    if (!allowedTypes.includes(file.type)) {
        alert('Please upload only JPG, PNG, or PDF files');
        return;
    }

    // Show uploaded file
    showUploadedFile(file.name);
}

function showUploadedFile(fileName) {
    const uploadArea = document.querySelector('.file-upload-area');
    uploadArea.innerHTML = `
        <div class="uploaded-file">
            <span class="file-name">📄 ${fileName}</span>
            <button type="button" class="remove-file" onclick="removeFile()">×</button>
        </div>
    `;
}

function removeFile() {
    fileInput.value = '';
    const uploadArea = document.querySelector('.file-upload-area');
    uploadArea.innerHTML = `
        <div class="upload-icon">📄</div>
        <p>Click to upload or drag and drop</p>
        <p class="file-types">JPG, PNG, PDF (Max 5MB)</p>
    `;
}

// Function to update selected services display
function updateSelectedServices() {
    const departmentSelect = document.getElementById('department');
    const selectedServices = document.getElementById('selectedServices');
    const servicesList = document.getElementById('servicesList');
    const totalCost = document.getElementById('totalCost');

    const selectedOptions = Array.from(departmentSelect.selectedOptions);

    if (selectedOptions.length > 0) {
        selectedServices.style.display = 'block';

        let servicesHTML = '';
        let grandTotal = 0;

        selectedOptions.forEach(option => {
            if (option.value) { // Skip the placeholder option
                const price = parseInt(option.getAttribute('data-price')) || 0;
                const serviceName = option.textContent.trim();

                servicesHTML += `
                    <div style="display: flex; justify-content: space-between; align-items: center; padding: 12px 15px; margin: 8px 0; background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%); border-radius: 8px; border-left: 4px solid #667eea; box-shadow: 0 2px 5px rgba(0,0,0,0.1);">
                        <span style="color: #2c3e50; font-weight: 500; font-size: 14px;">${serviceName}</span>
                        <span style="color: #27ae60; font-weight: bold; font-size: 16px;">₹${price.toLocaleString()}</span>
                    </div>
                `;

                grandTotal += price;
            }
        });

        // Check if it's a home visit to add extra charges
        const visitType = document.querySelector('input[name="visitType"]:checked');
        let homeVisitCharge = 0;

        if (visitType && visitType.value === 'home' && selectedOptions.length > 0) {
            homeVisitCharge = 200;
            grandTotal += homeVisitCharge;

            servicesHTML += `
                <div style="display: flex; justify-content: space-between; align-items: center; padding: 12px 15px; margin: 8px 0; background: linear-gradient(135deg, #fff3cd 0%, #ffeeba 100%); border-radius: 8px; border-left: 4px solid #ffc107; box-shadow: 0 2px 5px rgba(0,0,0,0.1);">
                    <span style="color: #856404; font-weight: 500; font-size: 14px;">🏠 Home Visit Charges</span>
                    <span style="color: #856404; font-weight: bold; font-size: 16px;">₹${homeVisitCharge}</span>
                </div>
            `;
        }

        servicesList.innerHTML = servicesHTML;

        // Update total cost display with enhanced styling
        if (grandTotal > 0) {
            totalCost.innerHTML = `
                <div style="display: flex; justify-content: space-between; align-items: center; padding: 5px 0;">
                    <span style="font-size: 1.2em; font-weight: 600; color: white;">Grand Total:</span>
                    <span style="font-size: 1.4em; font-weight: bold; color: white; text-shadow: 0 1px 2px rgba(0,0,0,0.2);">₹${grandTotal.toLocaleString()}</span>
                </div>
                <div style="font-size: 12px; color: rgba(255,255,255,0.9); margin-top: 5px; text-align: center;">
                    ${selectedOptions.length} test${selectedOptions.length > 1 ? 's' : ''} selected
                    ${homeVisitCharge > 0 ? ' • Home visit included' : ''}
                </div>
            `;
            totalCost.style.display = 'block';
        } else {
            totalCost.style.display = 'none';
        }
    } else {
        selectedServices.style.display = 'none';
        totalCost.style.display = 'none';
    }
}

// Initialize Select2 with search functionality
$(document).ready(function () {
    $('#department').select2({
        placeholder: "🔍 Search and select test(s)...",
        width: '100%',
        allowClear: false,
        closeOnSelect: true,
        tags: false,
        multiple: true,
        templateResult: formatOption,
        templateSelection: function () { return ''; }, // Hide selected items from search bar
        escapeMarkup: function (markup) {
            return markup;
        }
    });

    // Custom formatting for options in dropdown
    function formatOption(option) {
        if (!option.id) {
            return option.text;
        }

        const price = $(option.element).attr('data-price');
        if (price) {
            return `
                <div style="display: flex; justify-content: space-between; align-items: center; padding: 5px 0;">
                    <span>${option.text}</span>
                    <span style="color: #27ae60; font-weight: bold; font-size: 14px;">₹${parseInt(price).toLocaleString()}</span>
                </div>
            `;
        }
        return option.text;
    }

    // Update the search container to only show placeholder
    $('#department').on('select2:select select2:unselect', function (e) {
        setTimeout(function () {
            // Clear the search input display
            $('.select2-selection__rendered').empty();
            $('.select2-selection__rendered').append('<span class="select2-selection__placeholder" style="color: #999;">🔍 Search and select test(s)...</span>');
        }, 10);
    });
});

// Enhanced event listener for department selection changes
$('#department').on('change', function () {
    updateSelectedServices();

    // Add a subtle animation to the selected services
    const selectedServices = document.getElementById('selectedServices');
    if (selectedServices.style.display === 'block') {
        selectedServices.style.opacity = '0';
        selectedServices.style.transform = 'translateY(10px)';
        setTimeout(() => {
            selectedServices.style.transition = 'all 0.3s ease';
            selectedServices.style.opacity = '1';
            selectedServices.style.transform = 'translateY(0)';
        }, 100);
    }
});

// Update cost when visit type changes
document.querySelectorAll('input[name="visitType"]').forEach(radio => {
    radio.addEventListener('change', function () {
        // Recalculate costs when visit type changes
        updateSelectedServices();

        // Show a brief highlight on total cost when visit type changes
        const totalCost = document.getElementById('totalCost');
        if (totalCost.style.display === 'block') {
            totalCost.style.transform = 'scale(1.05)';
            setTimeout(() => {
                totalCost.style.transition = 'transform 0.3s ease';
                totalCost.style.transform = 'scale(1)';
            }, 200);
        }
    });
});

// Test data mapping with prices
const testData = {
    'blood_fbps': { name: 'Fasting Blood Sugar (FBPS)', category: 'Blood Test', price: 150 },
    'blood_rbps': { name: 'Random Blood Sugar (RBPS)', category: 'Blood Test', price: 150 },
    'cardio_ecg': { name: 'ECG', category: 'Cardiology', price: 400 },
    'cardio_echo_doppler': { name: '2D Echo', category: 'Cardiology', price: 1500 },
    'cardio_peripheral_doppler': { name: 'Peripheral Color Doppler', category: 'Cardiology', price: 1500 },
    'cardio_tmt': { name: 'TMT (Treadmill Test)', category: 'Cardiology', price: 1500 },
    'radiology_xray': { name: 'X-ray Imaging', category: 'Radiology', price: 800 },
    'radiology_sono': { name: 'Sonography/Ultrasound', category: 'Radiology', price: 1000 },
    'radiology_doppler': { name: 'Color Doppler Study', category: 'Radiology', price: 700 },
    'radiology_package': { name: 'Complete Radiology Package', category: 'Radiology', price: 2500 },
    'eeg_emg': { name: 'EEG/EMG', category: 'Other Services', price: 1200 },
    'portable_xray': { name: 'Portable X-ray', category: 'Other Services', price: 3000 }
};

// Function to get URL parameters
function getUrlParameters() {
    const urlParams = new URLSearchParams(window.location.search);
    const params = {};
    
    for (const [key, value] of urlParams) {
        if (key === 'selectedTests') {
            try {
                params[key] = JSON.parse(decodeURIComponent(value));
            } catch (e) {
                console.error('Error parsing selectedTests:', e);
                params[key] = [];
            }
        } else {
            params[key] = decodeURIComponent(value);
        }
    }
    
    return params;
}

// Function to format date
function formatDate(dateString) {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

// Function to format time
function formatTime(timeString) {
    if (!timeString) return '-';
    const [hours, minutes] = timeString.split(':');
    const date = new Date();
    date.setHours(parseInt(hours), parseInt(minutes));
    return date.toLocaleTimeString('en-IN', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
    });
}

// Function to generate booking ID
function generateBookingId() {
    const now = new Date();
    const datePart = now.toISOString().slice(0, 10).replace(/-/g, '');
    const randomPart = Math.random().toString(36).substr(2, 6).toUpperCase();
    return `BK${datePart}${randomPart}`;
}

// Function to populate patient information
function populatePatientInfo(params) {
    document.getElementById('patientName').textContent = params.patientName || '-';
    document.getElementById('patientAge').textContent = params.age || '-';
    document.getElementById('patientGender').textContent = params.gender ? 
        params.gender.charAt(0).toUpperCase() + params.gender.slice(1) : '-';
    document.getElementById('patientMobile').textContent = params.mobile || '-';
    
    // Add email if element exists
    const emailElement = document.getElementById('patientEmail');
    if (emailElement) {
        emailElement.textContent = params.email || 'Not provided';
    }
    
    // Combine address and pincode
    let fullAddress = '';
    if (params.address) {
        fullAddress = params.address;
        if (params.pincode) {
            fullAddress += `, PIN: ${params.pincode}`;
        }
    }
    document.getElementById('patientAddress').textContent = fullAddress || '-';
}

// Function to populate appointment details
function populateAppointmentDetails(params) {
    document.getElementById('appointmentDate').textContent = formatDate(params.preferredDate);
    document.getElementById('appointmentTime').textContent = formatTime(params.preferredTime);
    document.getElementById('visitType').textContent = params.visitType ? 
        params.visitType.charAt(0).toUpperCase() + params.visitType.slice(1) + ' Visit' : '-';
    document.getElementById('bookingId').textContent = generateBookingId();
}

// Function to populate selected tests
function populateSelectedTests(params) {
    const testsContainer = document.getElementById('selectedTests');
    testsContainer.innerHTML = ''; // Clear existing content
    let grandTotal = 0;
    
    if (params.bookingOption === 'department' && params.selectedTests && params.selectedTests.length > 0) {
        params.selectedTests.forEach(testValue => {
            if (testData[testValue]) {
                const test = testData[testValue];
                const testItem = document.createElement('div');
                testItem.style.cssText = `
                    display: flex; 
                    justify-content: space-between; 
                    align-items: center; 
                    padding: 15px; 
                    margin: 10px 0; 
                    background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%); 
                    border-radius: 10px; 
                    border-left: 4px solid #667eea; 
                    box-shadow: 0 3px 10px rgba(0,0,0,0.1);
                `;
                
                testItem.innerHTML = `
                    <div>
                        <div style="color: #2c3e50; font-weight: 600; font-size: 16px; margin-bottom: 5px;">${test.name}</div>
                        <div style="color: #6c757d; font-size: 13px;">${test.category}</div>
                    </div>
                    <div style="color: #27ae60; font-weight: bold; font-size: 18px;">₹${test.price.toLocaleString()}</div>
                `;
                
                testsContainer.appendChild(testItem);
                grandTotal += test.price;
            }
        });
        
        // Add home visit charges if applicable
        if (params.visitType === 'home' && params.selectedTests.length > 0) {
            const homeVisitCharge = 200;
            grandTotal += homeVisitCharge;
            
            const homeVisitItem = document.createElement('div');
            homeVisitItem.style.cssText = `
                display: flex; 
                justify-content: space-between; 
                align-items: center; 
                padding: 15px; 
                margin: 10px 0; 
                background: linear-gradient(135deg, #fff3cd 0%, #ffeeba 100%); 
                border-radius: 10px; 
                border-left: 4px solid #ffc107; 
                box-shadow: 0 3px 10px rgba(0,0,0,0.1);
            `;
            
            homeVisitItem.innerHTML = `
                <div>
                    <div style="color: #856404; font-weight: 600; font-size: 16px;">🏠 Home Visit Charges</div>
                    <div style="color: #6c757d; font-size: 13px;">Additional service charge</div>
                </div>
                <div style="color: #856404; font-weight: bold; font-size: 18px;">₹${homeVisitCharge.toLocaleString()}</div>
            `;
            
            testsContainer.appendChild(homeVisitItem);
        }
        
    } else if (params.bookingOption === 'prescription') {
        // Show prescription upload info
        const testItem = document.createElement('div');
        testItem.style.cssText = `
            display: flex; 
            justify-content: space-between; 
            align-items: center; 
            padding: 15px; 
            margin: 10px 0; 
            background: linear-gradient(135deg, #e8f5e8 0%, #d4edda 100%); 
            border-radius: 10px; 
            border-left: 4px solid #28a745; 
            box-shadow: 0 3px 10px rgba(0,0,0,0.1);
        `;
        
        testItem.innerHTML = `
            <div>
                <div style="color: #155724; font-weight: 600; font-size: 16px;">📋 Tests as per Prescription</div>
                <div style="color: #6c757d; font-size: 13px;">Custom tests based on doctor's prescription</div>
            </div>
            <div style="color: #155724; font-weight: bold; font-size: 16px;">Price on Assessment</div>
        `;
        testsContainer.appendChild(testItem);
        
        // Show prescription section
        const prescriptionSection = document.getElementById('prescriptionSection');
        if (prescriptionSection && params.prescriptionFileName) {
            prescriptionSection.style.display = 'block';
            const prescriptionFileElement = document.getElementById('prescriptionFile');
            if (prescriptionFileElement) {
                prescriptionFileElement.innerHTML = `
                    <div style="display: flex; align-items: center; padding: 20px; background: #f8f9fa; border-radius: 10px; border: 2px dashed #dee2e6; margin-top: 10px;">
                        <div style="font-size: 28px; margin-right: 15px;">📄</div>
                        <div>
                            <div style="font-weight: 600; color: #2c3e50; font-size: 16px; margin-bottom: 5px;">${params.prescriptionFileName}</div>
                            <div style="font-size: 13px; color: #28a745;">✅ Uploaded successfully</div>
                        </div>
                    </div>
                `;
            }
        }
    }
    
    // Update grand total
    const grandTotalElement = document.getElementById('grandTotal');
    if (grandTotalElement) {
        if (grandTotal > 0) {
            grandTotalElement.textContent = `₹${grandTotal.toLocaleString()}`;
            grandTotalElement.parentElement.style.display = 'block';
        } else {
            grandTotalElement.textContent = 'To be determined';
            grandTotalElement.parentElement.style.display = 'block';
        }
    }
}

// Function to show additional notes
function populateAdditionalNotes(params) {
    if (params.notes && params.notes.trim()) {
        const notesSection = document.getElementById('notesSection');
        const additionalNotes = document.getElementById('additionalNotes');
        
        if (notesSection && additionalNotes) {
            notesSection.style.display = 'block';
            additionalNotes.innerHTML = `
                <div style="background: #f8f9fa; padding: 15px; border-radius: 8px; border-left: 4px solid #17a2b8;">
                    <p style="margin: 0; color: #2c3e50; line-height: 1.5;">${params.notes}</p>
                </div>
            `;
        }
    }
}

// UPDATED FORM SUBMISSION HANDLER
document.addEventListener('DOMContentLoaded', function() {
    const bookingForm = document.getElementById('bookingForm');
    
    if (bookingForm) {
        bookingForm.addEventListener('submit', function (e) {
            e.preventDefault(); // Prevent default form submission
            
            // Validate required fields first
            if (!this.checkValidity()) {
                this.reportValidity();
                return;
            }
            
            // Check if booking option is selected
            if (!selectedOption) {
                alert('Please select either Department or Prescription option');
                return;
            }
            
            // Validate department selection if department option is chosen
            if (selectedOption === 'department') {
                const departmentSelect = document.getElementById('department');
                if (!departmentSelect || departmentSelect.selectedOptions.length === 0) {
                    alert('Please select at least one test from the department');
                    return;
                }
            }
            
            // Validate prescription upload if prescription option is chosen
            if (selectedOption === 'prescription') {
                const fileInput = document.getElementById('prescription');
                if (!fileInput || fileInput.files.length === 0) {
                    alert('Please upload a prescription file');
                    return;
                }
            }
            
            // Collect all form data
            const formData = new FormData(this);
            const bookingData = {};
            
            // Get all basic form fields
            bookingData.patientName = formData.get('patientName') || '';
            bookingData.age = formData.get('age') || '';
            bookingData.gender = formData.get('gender') || '';
            bookingData.address = formData.get('address') || '';
            bookingData.pincode = formData.get('pincode') || '';
            bookingData.mobile = formData.get('mobile') || '';
            bookingData.email = formData.get('email') || '';
            bookingData.visitType = formData.get('visitType') || '';
            bookingData.preferredDate = formData.get('preferredDate') || '';
            bookingData.preferredTime = formData.get('preferredTime') || '';
            bookingData.notes = formData.get('notes') || '';
            bookingData.bookingOption = selectedOption || '';
            
            // Handle selected tests from department dropdown
            if (selectedOption === 'department') {
                const departmentSelect = document.getElementById('department');
                if (departmentSelect && departmentSelect.selectedOptions.length > 0) {
                    const selectedTests = Array.from(departmentSelect.selectedOptions)
                        .map(option => option.value)
                        .filter(value => value); // Remove empty values
                    bookingData.selectedTests = selectedTests;
                }
            }
            
            // Handle prescription file
            if (selectedOption === 'prescription') {
                const fileInput = document.getElementById('prescription');
                if (fileInput && fileInput.files.length > 0) {
                    bookingData.prescriptionFileName = fileInput.files[0].name;
                    // Store file data if needed (for demo purposes, we're just storing the name)
                }
            }
            
            // Convert booking data to URL parameters
            const urlParams = new URLSearchParams();
            for (let [key, value] of Object.entries(bookingData)) {
                if (key === 'selectedTests' && Array.isArray(value)) {
                    urlParams.append(key, encodeURIComponent(JSON.stringify(value)));
                } else if (value) {
                    urlParams.append(key, encodeURIComponent(value));
                }
            }
            
            // Redirect to bookingpg.html with parameters
            window.location.href = '/Diagnostics/Patient/tabs/bookingpg.html?' + urlParams.toString();
        });
    }
    
    // Check if we're on the booking confirmation page
    const params = getUrlParameters();
    
    console.log('URL Parameters:', params); // For debugging
    
    // Populate all sections with data if parameters exist
    if (Object.keys(params).length > 0) {
        populatePatientInfo(params);
        populateAppointmentDetails(params);
        populateSelectedTests(params);
        populateAdditionalNotes(params);
        
        // Initialize progress tracker
        simulateProgress();
    } else if (window.location.pathname.includes('bookingpg.html')) {
        // Show message if no data found on booking page
        const contentElement = document.querySelector('.content');
        if (contentElement) {
            contentElement.innerHTML = `
                <div style="text-align: center; padding: 50px; color: #666;">
                    <div style="font-size: 60px; margin-bottom: 20px;">📋</div>
                    <h2 style="color: #2c3e50; margin-bottom: 15px;">No booking data found</h2>
                    <p style="color: #6c757d; margin-bottom: 30px;">Please book an appointment first to see the confirmation details.</p>
                    <button class="btn-primary" onclick="goToHome()" style="padding: 12px 25px; background: #667eea; color: white; border: none; border-radius: 8px; font-size: 16px; cursor: pointer;">
                        📅 Book New Appointment
                    </button>
                </div>
            `;
        }
    }
});

// Function to go back to home/booking page
function goToHome() {
    window.location.href = '/Diagnostics/Patient/tabs/book.html'; // Adjust the filename as needed
}

// Function to simulate progress updates (for demo purposes)
function simulateProgress() {
    const steps = document.querySelectorAll('.progress-step');
    if (steps.length > 0) {
        let currentStep = 0;
        
        // Set initial state
        steps[0].classList.add('active');
        
        // You can add real-time updates here by calling an API
        // For now, this is just a placeholder for future implementation
    }
}

// Function to update progress (can be called from external sources)
function updateProgress(stepIndex) {
    const steps = document.querySelectorAll('.progress-step');
    
    steps.forEach((step, index) => {
        step.classList.remove('active', 'completed');
        
        if (index < stepIndex) {
            step.classList.add('completed');
        } else if (index === stepIndex) {
            step.classList.add('active');
        }
    });
}
function storeFormData() {
    const formData = {
        name: document.getElementById("patientName").value,
        age: document.getElementById("age").value,
        gender: document.getElementById("gender").value,
        address: document.getElementById("address").value,
        mobile: document.getElementById("mobile").value,
        date: document.getElementById("preferredDate").value,
        time: document.getElementById("preferredTime").value,
        visitType: document.querySelector('input[name="visitType"]:checked')?.value || '',
        notes: document.getElementById("notes").value
    };

    localStorage.setItem("bookingData", JSON.stringify(formData));
    window.location.href = "/Diagnostics/Patient/tabs/bookingpg.html";
    
    window.onload = function () {
    const data = JSON.parse(localStorage.getItem("bookingData"));

    if (data) {
      document.getElementById("patientName").innerText = data.name;
      document.getElementById("patientAge").innerText = data.age;
      document.getElementById("patientGender").innerText = data.gender;
      document.getElementById("patientMobile").innerText = data.mobile;
      document.getElementById("patientAddress").innerText = data.address;
      document.getElementById("appointmentDate").innerText = data.date;
      document.getElementById("appointmentTime").innerText = data.time;
      document.getElementById("visitType").innerText = data.visitType;
      document.getElementById("additionalNotes").innerText = data.notes;

      // Show notes section if notes exist
      if (data.notes && data.notes.trim() !== "") {
        document.getElementById("notesSection").style.display = "block";
      }
    }
  };

}
// Export functions for potential external use
window.updateProgress = updateProgress;
window.goToHome = goToHome;

 