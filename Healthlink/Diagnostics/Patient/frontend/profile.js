// Utility: Show toast messages
function showMessage(message, type = 'info') {
    const div = document.createElement('div');
    div.textContent = message;
    div.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 25px;
        border-radius: 8px;
        color: white;
        font-weight: 600;
        z-index: 1000;
        ${type === 'success' ? 'background: #27ae60;' :
          type === 'error' ? 'background: #e74c3c;' :
          'background: #3498db;'}
    `;
    document.body.appendChild(div);
    setTimeout(() => div.remove(), 3000);
}

// Utility: Validate email and phone
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

function validatePhone(phone) {
    // Allows for optional + prefix and spaces, ensures 10-15 digits
    const re = /^[\+]?[1-9][\d\s]{9,14}$/; // Adjusted regex for common phone formats
    return re.test(phone);
}

// Validate profile form fields
function validateForm(data) {
    const errors = [];
    if (!data.fullName || data.fullName.trim() === '') errors.push('Full name is required.');
    if (!data.email || !validateEmail(data.email)) errors.push('A valid email address is required.');
    if (!data.mobile || !validatePhone(data.mobile)) errors.push('A valid mobile number (10-15 digits) is required.');
    if (!data.gender || data.gender === '') errors.push('Please select your gender.');
    if (!data.dob || data.dob === '') errors.push('Date of birth is required.');
    else {
        const today = new Date();
        const birth = new Date(data.dob);
        if (birth >= today) errors.push('Date of birth must be in the past.');
    }
    if (!data.location || data.location === '') errors.push('Location is required.');
    if (!data.pincode || !/^\d{6}$/.test(data.pincode)) errors.push('A 6-digit pincode is required.');

    return errors;
}

// Populate form with user data
function populateProfileForm(user) {
    document.getElementById('fullName').value = user.name || ''; // Assuming signup uses 'name'
    document.getElementById('email').value = user.email || '';
    document.getElementById('mobile').value = user.mobile || '';
    document.getElementById('location').value = user.location || '';
    document.getElementById('pincode').value = user.pincode || '';
    
    // Gender
    const genderSelect = document.getElementById('gender');
    if (user.gender && Array.from(genderSelect.options).some(option => option.value === user.gender)) {
        genderSelect.value = user.gender;
    } else {
        genderSelect.value = ''; // Default to "Select Gender" if not found or empty
    }

    // DOB
    document.getElementById('dob').value = user.dob || ''; // Assuming you save dob in YYYY-MM-DD format
}


// --- Main Profile Logic ---

// Save profile changes to localStorage and optionally to a backend
function saveProfile(data) {
    let currentUser = JSON.parse(localStorage.getItem('currentUser'));
    let users = JSON.parse(localStorage.getItem('users')) || [];

    if (!currentUser) {
        showMessage('No logged-in user found. Please log in.', 'error');
        return;
    }

    // Update currentUser object with new data
    currentUser.name = data.fullName;
    currentUser.email = data.email;
    currentUser.mobile = data.mobile;
    currentUser.gender = data.gender;
    currentUser.dob = data.dob;
    currentUser.location = data.location;
    currentUser.pincode = data.pincode;

    localStorage.setItem('currentUser', JSON.stringify(currentUser));

    // Update the 'users' array in localStorage
    const userIndex = users.findIndex(u => u.userId === currentUser.userId);
    if (userIndex !== -1) {
        users[userIndex] = currentUser; // Replace old user object with updated one
        localStorage.setItem('users', JSON.stringify(users));
    } else {
        // This case should ideally not happen if currentUser is valid, but good for debugging
        console.warn("Logged-in user not found in the 'users' array. This might indicate an inconsistency.");
        // If the user isn't in 'users', maybe add them or handle as an error
    }

    showMessage('Profile updated successfully!', 'success');

    // --- Optional: Send data to backend if you have one ---
    // If you want to sync with a backend, uncomment this section.
    // Ensure your backend's /api/updateProfile endpoint can handle userId and other data.
    /*
    fetch('http://127.0.0.1:5000/api/updateProfile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...data, userId: currentUser.userId }) // Include userId for backend
    })
    .then(res => res.json())
    .then(result => {
        if (result.success) {
            // showMessage('Profile updated successfully (Backend sync)!', 'success');
            // Already showed success above. You might differentiate messages here.
        } else {
            showMessage(result.message || 'Failed to update profile on backend.', 'error');
        }
    })
    .catch(error => {
        console.error('Error saving profile to backend:', error);
        showMessage('Error communicating with backend for profile update.', 'error');
    });
    */
    // --- End Optional Backend Sync ---
}

// Function to log out the user
function logout() {
    localStorage.removeItem('currentUser');
    // localStorage.removeItem('userId'); // Remove if you used this for temporary storage
    showMessage('Logged out successfully!', 'info');
    // Redirect to login page or home page
    window.location.href = '/path/to/your/login.html'; // IMPORTANT: Change this to your actual login page path
    clearForm(); // Clear the profile form after logout
    // updateAuthStatus(false); // If you have a status indicator somewhere
}

// Helper for other actions (add your logic here)
// Helper for other actions (add your logic here)
function showBookings() {
    showMessage('Redirecting to My Bookings...', 'info');
    // IMPORTANT: Replace 'your_booking_page_url_here.html' with the actual path to your booking page
    window.location.href = '/Healthlink/Diagnostics/Patient/frontend/booking.html'; // Example path, adjust as needed
}
function resetPassword() { showMessage('Redirecting to reset password page...', 'info'); }
function showNotifications() { showMessage('Showing notifications settings...', 'info'); }
function showReports() { showMessage('Showing user reports...', 'info'); }
function deleteAccount() { 
    if (confirm("Are you sure you want to delete your account? This action cannot be undone.")) {
        showMessage('Account deletion process initiated...', 'warning');
        // Implement actual account deletion logic (e.g., API call)
        logout(); // Log out after attempting deletion
    }
}
function saveNotificationSettings() {
    showMessage('Notification settings saved!', 'success');
    // Optionally send settings to backend
}

// Clear profile form
function clearForm() {
    document.getElementById('profileForm').reset();
}


// Event listeners
document.addEventListener('DOMContentLoaded', () => {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));

    if (currentUser) {
        populateProfileForm(currentUser);
        // updateAuthStatus(true); // If you have a status indicator
    } else {
        showMessage('No user logged in. Please log in first.', 'error');
        // Redirect to login page if no user is logged in
        // window.location.href = '/path/to/your/login.html';
    }

    // Form submit
    document.getElementById('profileForm').addEventListener('submit', function (e) {
        e.preventDefault();
        const formData = new FormData(this);
        const data = Object.fromEntries(formData);
        
        const errors = validateForm(data);
        if (errors.length > 0) {
            showMessage(errors[0], 'error');
            return;
        }

        saveProfile(data);
    });

    // Logout button listener (added to HTML and linked here)
    const logoutButton = document.getElementById('logoutButton');
    if (logoutButton) {
        logoutButton.addEventListener('click', logout);
    }

    // Notification checkbox listeners
    ['emailNotif', 'smsNotif', 'pushNotif'].forEach(id => {
        const el = document.getElementById(id);
        if (el) {
            el.addEventListener('change', () => {
                if (localStorage.getItem('currentUser')) saveNotificationSettings();
            });
        }
    });

    // Pincode input to allow only numbers
    const pincodeInput = document.getElementById('pincode');
    if (pincodeInput) {
        pincodeInput.addEventListener('input', function() {
            this.value = this.value.replace(/[^0-9]/g, '');
        });
    }
});


