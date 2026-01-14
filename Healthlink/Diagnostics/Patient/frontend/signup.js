 // ============================================
        // EmailJS Configuration
        // ============================================
        // STEP 1: Go to https://www.emailjs.com/ and create a free account
        // STEP 2: Add an Email Service (Gmail, Outlook, etc.) and get your SERVICE_ID
        // STEP 3: Create an Email Template with these variables: {{to_email}}, {{to_name}}, {{user_id}}, {{password}}
        // STEP 4: Get your PUBLIC_KEY from Account > API Keys
        // STEP 5: Replace the values below with your actual credentials

        const EMAILJS_PUBLIC_KEY = 'cQsYxD1psxuN9xVtD';
        const EMAILJS_SERVICE_ID = 'service_d0t0h7n';
        const EMAILJS_TEMPLATE_ID = 'template_mfgidig';

        // Initialize EmailJS
        (function() {
            if (typeof emailjs !== 'undefined') {
                emailjs.init(EMAILJS_PUBLIC_KEY);
            }
        })();

        // Function to send credentials via email
        async function sendCredentialsEmail(userEmail, userName, userId, password) {
            try {
                const templateParams = {
                    to_email: userEmail,
                    to_name: userName,
                    user_id: userId,
                    password: password,
                    reply_to: userEmail
                };

                const response = await emailjs.send(
                    EMAILJS_SERVICE_ID,
                    EMAILJS_TEMPLATE_ID,
                    templateParams
                );

                console.log('Email sent successfully!', response.status, response.text);
                return { success: true, message: 'Credentials sent to your email!' };
            } catch (error) {
                console.error('Failed to send email:', error);
                return { success: false, message: 'Failed to send email. Please save your credentials manually.' };
            }
        }

        // DOM Elements
        const signupForm = document.getElementById('signupForm');
        const loginForm = document.getElementById('loginForm');
        const dashboard = document.getElementById('dashboard');
        const signupFormElement = document.getElementById('signupFormElement');
        const loginFormElement = document.getElementById('loginFormElement');
        const signupSubmitBtn = document.getElementById('signupSubmitBtn');
        const loginSubmitBtn = document.getElementById('loginSubmitBtn');
        const signupMessage = document.getElementById('signupMessage');
        const loginMessage = document.getElementById('loginMessage');
        const userInfo = document.getElementById('userInfo');

        // Signup form inputs
        const nameInput = document.getElementById('name');
        const mobileInput = document.getElementById('mobile');
        const emailInput = document.getElementById('email');
        const locationSelect = document.getElementById('location');
        const pincodeInput = document.getElementById('pincode');
        const termsCheckbox = document.getElementById('terms');

        // Login form inputs
        const loginUserIdInput = document.getElementById('loginUserId');
        const loginPasswordInput = document.getElementById('loginPassword');

        // Storage for users
        let users = JSON.parse(localStorage.getItem('users')) || [];

        // Show/Hide Forms
        function showLogin() {
            // If user is already logged in, redirect to dashboard
            const currentUser = localStorage.getItem('currentUser');
            if (currentUser) {
                showDashboard(JSON.parse(currentUser));
                return;
            }
            
            signupForm.classList.remove('active');
            dashboard.classList.remove('active');
            loginForm.classList.add('active');
            clearMessages();
            loginFormElement.reset();
            validateLoginForm();
        }

        function showSignup() {
            // If user is already logged in, redirect to dashboard
            const currentUser = localStorage.getItem('currentUser');
            if (currentUser) {
                showDashboard(JSON.parse(currentUser));
                showMessage(signupMessage, '⚠️ You are already logged in! Please logout first to create a new account.', 'error');
                return;
            }
            
            loginForm.classList.remove('active');
            dashboard.classList.remove('active');
            signupForm.classList.add('active');
            clearMessages();
            signupFormElement.reset();
            validateSignupForm();
        }

        function showDashboard(user) {
            signupForm.classList.remove('active');
            loginForm.classList.remove('active');
            dashboard.classList.add('active');
            
            // Store current user in localStorage to maintain session
            localStorage.setItem('currentUser', JSON.stringify(user));
            
            userInfo.innerHTML = `
                <div class="info-row">
                    <span class="info-label">Name:</span>
                    <span class="info-value">${user.name}</span>
                </div>
                <div class="info-row">
                    <span class="info-label">User ID:</span>
                    <span class="info-value">${user.userId}</span>
                </div>
                <div class="info-row">
                    <span class="info-label">Email:</span>
                    <span class="info-value">${user.email}</span>
                </div>
                <div class="info-row">
                    <span class="info-label">Mobile:</span>
                    <span class="info-value">${user.mobile}</span>
                </div>
                <div class="info-row">
                    <span class="info-label">Location:</span>
                    <span class="info-value">${user.location}</span>
                </div>
                <div class="info-row">
                    <span class="info-label">Pin Code:</span>
                    <span class="info-value">${user.pincode}</span>
                </div>
            `;
        }

        function clearMessages() {
            signupMessage.innerHTML = '';
            loginMessage.innerHTML = '';
        }

        function showMessage(container, message, type) {
            container.innerHTML = `<div class="${type}-message">${message}</div>`;
        }

        // Generate User ID and Password
        function generateUserId(name) {
            const cleanName = name.replace(/\s+/g, '').toLowerCase().substring(0, 5);
            const randomNum = Math.floor(1000 + Math.random() * 9000);
            return `${cleanName}${randomNum}`;
        }

        function generatePassword() {
            const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%';
            let password = '';
            for (let i = 0; i < 10; i++) {
                password += chars.charAt(Math.floor(Math.random() * chars.length));
            }
            return password;
        }

        // Validation Functions
        function validateSignupForm() {
            const isNameValid = nameInput.value.trim().length >= 2;
            const isMobileValid = /^[0-9]{10}$/.test(mobileInput.value);
            const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailInput.value);
            const isLocationValid = locationSelect.value !== '';
            const isPincodeValid = /^[0-9]{6}$/.test(pincodeInput.value);
            const isTermsChecked = termsCheckbox.checked;

            // Add visual feedback
            toggleValidClass(nameInput, isNameValid);
            toggleValidClass(mobileInput, isMobileValid);
            toggleValidClass(emailInput, isEmailValid);
            toggleValidClass(locationSelect, isLocationValid);
            toggleValidClass(pincodeInput, isPincodeValid);

            const isFormValid = isNameValid && isMobileValid && isEmailValid && 
                               isLocationValid && isPincodeValid && isTermsChecked;
            
            signupSubmitBtn.disabled = !isFormValid;
            return isFormValid;
        }

        function validateLoginForm() {
            const isUserIdValid = loginUserIdInput.value.trim().length >= 3;
            const isPasswordValid = loginPasswordInput.value.length >= 6;

            toggleValidClass(loginUserIdInput, isUserIdValid);
            toggleValidClass(loginPasswordInput, isPasswordValid);

            const isFormValid = isUserIdValid && isPasswordValid;
            loginSubmitBtn.disabled = !isFormValid;
            return isFormValid;
        }

        function toggleValidClass(element, isValid) {
            if (element.value.length === 0) {
                element.classList.remove('valid', 'invalid');
            } else if (isValid) {
                element.classList.add('valid');
                element.classList.remove('invalid');
            } else {
                element.classList.add('invalid');
                element.classList.remove('valid');
            }
        }

        // Event Listeners for Signup Form
        [nameInput, mobileInput, emailInput, pincodeInput].forEach(input => {
            input.addEventListener('input', validateSignupForm);
        });
        locationSelect.addEventListener('change', validateSignupForm);
        termsCheckbox.addEventListener('change', validateSignupForm);

        // Event Listeners for Login Form
        [loginUserIdInput, loginPasswordInput].forEach(input => {
            input.addEventListener('input', validateLoginForm);
        });

        // Only allow numbers in mobile and pincode
        mobileInput.addEventListener('input', function() {
            this.value = this.value.replace(/[^0-9]/g, '');
        });

        pincodeInput.addEventListener('input', function() {
            this.value = this.value.replace(/[^0-9]/g, '');
        });

        // Form Submissions
        signupFormElement.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            if (!validateSignupForm()) return;

            // Re-sync users from localStorage to ensure we have the latest data
            users = JSON.parse(localStorage.getItem('users')) || [];
            
            const emailValue = emailInput.value.trim().toLowerCase();
            const mobileValue = mobileInput.value.trim();
            
            // Check if user is currently logged in
            const currentUser = localStorage.getItem('currentUser');
            if (currentUser) {
                showMessage(signupMessage, '⚠️ You are already logged in! Please logout first to create a new account.', 'error');
                showDashboard(JSON.parse(currentUser));
                return;
            }

            // Check if email already exists
            const existingEmailUser = users.find(u => u.email.trim().toLowerCase() === emailValue);
            if (existingEmailUser) {
                showMessage(signupMessage, `❌ The email "${emailValue}" is already registered. Please login or use a different email.`, 'error');
                return;
            }
            
            // Check if mobile number already exists
            const existingMobileUser = users.find(u => u.mobile.trim() === mobileValue);
            if (existingMobileUser) {
                showMessage(signupMessage, `❌ The mobile number "${mobileValue}" is already registered. Please login or use a different number.`, 'error');
                return;
            }

            const userId = generateUserId(nameInput.value);
            const password = generatePassword();

            const newUser = {
                name: nameInput.value.trim(),
                mobile: mobileInput.value.trim(),
                email: emailInput.value.trim().toLowerCase(),
                location: locationSelect.value,
                pincode: pincodeInput.value.trim(),
                userId: userId,
                password: password
            };

            // Disable submit button and show loading state
            signupSubmitBtn.disabled = true;
            signupSubmitBtn.textContent = 'Creating Account...';

            // Send credentials via email
            let emailStatus = { success: false, message: '' };
            if (EMAILJS_PUBLIC_KEY && EMAILJS_PUBLIC_KEY !== 'YOUR_PUBLIC_KEY') {
                emailStatus = await sendCredentialsEmail(
                    newUser.email,
                    newUser.name,
                    userId,
                    password
                );
            }

            // Save user to localStorage
            users.push(newUser);
            localStorage.setItem('users', JSON.stringify(users));

            // Show success message with email status
            const emailNote = emailStatus.success 
                ? `<p style="margin-top: 10px; color: #28a745;">✅ Credentials have been sent to <strong>${newUser.email}</strong></p>`
                : `<p style="margin-top: 10px; color: #856404;">📧 Could not send email. Please save your credentials below!</p>`;

            signupMessage.innerHTML = `
                <div class="success-message">
                    <strong>🎉 Registration Successful!</strong>
                    <p style="margin-top: 10px;">Your account has been created successfully.</p>
                    ${emailNote}
                </div>
                <div class="user-credentials">
                    <div class="credential-item">
                        <span class="credential-label">User ID:</span>
                        <span class="credential-value" id="generatedUserId">${userId}</span>
                        <button type="button" class="copy-btn" onclick="copyToClipboard('${userId}', this)">Copy</button>
                    </div>
                    <div class="credential-item">
                        <span class="credential-label">Password:</span>
                        <span class="credential-value" id="generatedPassword">${password}</span>
                        <button type="button" class="copy-btn" onclick="copyToClipboard('${password}', this)">Copy</button>
                    </div>
                    <p style="margin-top: 15px; font-size: 12px; color: #666; text-align: center;">
                        ⚠️ Please copy and save these credentials securely before proceeding!
                    </p>
                    <button type="button" class="btn proceed-btn" onclick="showLogin()">
                        ✓ I've Saved My Credentials - Proceed to Login
                    </button>
                </div>
            `;

            signupFormElement.reset();
            signupSubmitBtn.textContent = 'Sign Up';
            validateSignupForm();
        });

        loginFormElement.addEventListener('submit', function(e) {
            e.preventDefault();
            
            if (!validateLoginForm()) return;

            const userId = loginUserIdInput.value.trim();
            const password = loginPasswordInput.value;

            const user = users.find(u => u.userId === userId && u.password === password);

            if (user) {
                localStorage.setItem('currentUser', JSON.stringify(user));
                showDashboard(user);
            } else {
                showMessage(loginMessage, '❌ Invalid User ID or Password. Please try again.', 'error');
            }
        });

        // Logout Function
        function logout() {
            localStorage.removeItem('currentUser');
            showLogin();
        }

        // Go to Main Page
        function goToMainPage() {
            window.location.href = '/Healthlink/Diagnostics/Patient/frontend/main.html';
        }

        // Check if user is already logged in
        function checkLoggedIn() {
            const currentUser = localStorage.getItem('currentUser');
            if (currentUser) {
                const user = JSON.parse(currentUser);
                showDashboard(user);
                return true;
            }
            return false;
        }
        
        // Check if email is already registered
        function isEmailRegistered(email) {
            return users.some(u => u.email.toLowerCase() === email.toLowerCase());
        }
        
        // Check if user is already registered (by email or mobile)
        function isAlreadyRegistered(email, mobile) {
            return users.some(u => 
                u.email.toLowerCase() === email.toLowerCase() || 
                u.mobile === mobile
            );
        }

        // Event listeners for switch links
        document.getElementById('goToLogin').addEventListener('click', function(e) {
            e.preventDefault();
            showLogin();
        });

        document.getElementById('goToSignup').addEventListener('click', function(e) {
            e.preventDefault();
            showSignup();
        });

        // Copy to clipboard function
        function copyToClipboard(text, button) {
            navigator.clipboard.writeText(text).then(() => {
                const originalText = button.textContent;
                button.textContent = 'Copied!';
                button.classList.add('copied');
                setTimeout(() => {
                    button.textContent = originalText;
                    button.classList.remove('copied');
                }, 2000);
            }).catch(err => {
                // Fallback for older browsers
                const textArea = document.createElement('textarea');
                textArea.value = text;
                document.body.appendChild(textArea);
                textArea.select();
                document.execCommand('copy');
                document.body.removeChild(textArea);
                
                const originalText = button.textContent;
                button.textContent = 'Copied!';
                button.classList.add('copied');
                setTimeout(() => {
                    button.textContent = originalText;
                    button.classList.remove('copied');
                }, 2000);
            });
        }

        // Clear all test accounts (run once to clean up)
        function clearAllTestAccounts() {
            localStorage.removeItem('users');
            localStorage.removeItem('currentUser');
            users = [];
            console.log('All test accounts have been cleared!');
        }

        // UNCOMMENT THE LINE BELOW TO CLEAR ALL TEST ACCOUNTS, THEN COMMENT IT AGAIN
        // clearAllTestAccounts();

        // Initialize
        checkLoggedIn();
        validateSignupForm();
        validateLoginForm();