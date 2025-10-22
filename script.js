// --- FIREBASE CONFIG & SETUP ---
        // Import the functions you need from the SDKs you need
  import { initializeApp } from "https://www.gstatic.com/firebasejs/12.4.0/firebase-app.js";
  import { getAnalytics } from "https://www.gstatic.com/firebasejs/12.4.0/firebase-analytics.js";
import {getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword} from "https://www.gstatic.com/firebasejs/12.4.0/firebase-app.js";
 import{getFirestore, setDoc, doc} from "https://www.gstatic.com/firebasejs/12.4.0/firebase-app.js"
        // Firestore Globals (MANDATORY)
        const firebaseConfig = {
    apiKey: "AIzaSyAOMmvgmrJXbjPcxaeOZy_i3WjrFwMUwak",
    authDomain: "scaleheight-form.firebaseapp.com",
    projectId: "scaleheight-form",
    storageBucket: "scaleheight-form.firebasestorage.app",
    messagingSenderId: "279560737813",
    appId: "1:279560737813:web:b6e2358d48982df23bea1c",
    measurementId: "G-P1FG90C7DD"
  };

        let db = null;
        let auth = null;
        let userId = null;
        let isFirebaseReady = false;

        // Initialize Firebase
        if (firebaseConfig) {
            try {
                const app =   // Initialize Firebase
  const app = initializeApp(firebaseConfig);
  const analytics = getAnalytics(app);
                setLogLevel('debug'); // Enable Firestore logging

                // 1. Initial Authentication
                onAuthStateChanged(auth, async (user) => {
                    if (user) {
                        userId = user.uid;
                        isFirebaseReady = true;
                        console.log("Firebase initialized. User authenticated:", userId);
                    } else {
                        console.log("No user signed in. Attempting anonymous sign-in...");
                        if (initialAuthToken) {
                             await signInWithCustomToken(auth, initialAuthToken);
                        } else {
                             await signInAnonymously(auth);
                        }
                    }
                });
            } catch (error) {
                console.error("Error initializing Firebase:", error);
                showMessage("Failed to initialize the application database. Please refresh or contact support.", false);
            }
        } else {
            console.error("Firebase config is missing.");
            showMessage("Database configuration missing. Registration will not be saved.", false);
        }

        // --- HARDCODED COUPON CODES (50 Samples) ---
        // In a real application, these would be managed securely in Firestore or a backend server.
        const VALID_COUPON_CODES = new Set([
            "SCALEREG001", "SCALEREG002", "SCALEREG003", "SCALEREG004", "SCALEREG005",
            "SCALEREG006", "SCALEREG007", "SCALEREG008", "SCALEREG009", "SCALEREG010",
            "SCALEREG011", "SCALEREG012", "SCALEREG013", "SCALEREG014", "SCALEREG015",
            "SCALEREG016", "SCALEREG017", "SCALEREG018", "SCALEREG019", "SCALEREG020",
            "SCALEREG021", "SCALEREG022", "SCALEREG023", "SCALEREG024", "SCALEREG025",
            "SCALEREG026", "SCALEREG027", "SCALEREG028", "SCALEREG029", "SCALEREG030",
            "SCALEREG031", "SCALEREG032", "SCALEREG033", "SCALEREG034", "SCALEREG035",
            "SCALEREG036", "SCALEREG037", "SCALEREG038", "SCALEREG039", "SCALEREG040",
            "SCALEREG041", "SCALEREG042", "SCALEREG043", "SCALEREG044", "SCALEREG045",
            "SCALEREG046", "SCALEREG047", "SCALEREG048", "SCALEREG049", "SCALEREG050"
        ]);

        let USED_COUPON_CODES = []; // Array to store codes already validated in this session.

        // --- VIEW MANAGEMENT ---
        const views = {
            createAccount: document.getElementById('view-create-account'),
            couponPackage: document.getElementById('view-coupon-package'),
            loginCoupon: document.getElementById('view-login-coupon')
        };

        function switchView(targetView) {
            Object.values(views).forEach(view => {
                view.classList.add('hidden');
            });
            targetView.classList.remove('hidden');
        }

        window.showCreateAccountView = function() {
            switchView(views.createAccount);
        }

        window.showCouponView = function() {
            const form = document.getElementById('create-account-form');
            if (form.checkValidity() && document.getElementById('password').value === document.getElementById('passwordConfirm').value) {
                switchView(views.couponPackage);
            } else if (document.getElementById('password').value !== document.getElementById('passwordConfirm').value) {
                 showMessage("Passwords do not match.", true);
            } else {
                form.reportValidity();
            }
        }

        // --- MODAL MANAGEMENT ---
        const paymentModal = document.getElementById('payment-modal');

        window.showPaymentModal = function() {
            paymentModal.classList.add('active');
        }

        window.hidePaymentModal = function() {
            paymentModal.classList.remove('active');
        }
        
        // --- MESSAGE BOX FUNCTIONS ---
        const messageBox = document.getElementById('message-box');
        const messageText = document.getElementById('message-text');

        function showMessage(text, isError) {
            messageText.innerHTML = (isError ? '<strong>Error:</strong> ' : '') + text;
            messageBox.classList.remove('hidden');
        }

        window.hideMessageBox = function() {
            messageBox.classList.add('hidden');
        }

        // --- FORM UTILITIES ---
        window.togglePasswordVisibility = function(id) {
            const input = document.getElementById(id);
            const icon = input.nextElementSibling.querySelector('i');
            if (input.type === 'password') {
                input.type = 'text';
                icon.classList.remove('fa-eye');
                icon.classList.add('fa-eye-slash');
            } else {
                input.type = 'password';
                icon.classList.remove('fa-eye-slash');
                icon.classList.add('fa-eye');
            }
        }

        window.copyToClipboard = function(text, buttonElement) {
            // Using a temporary input for cross-browser/iframe compatibility
            const tempInput = document.createElement('textarea');
            tempInput.value = text;
            document.body.appendChild(tempInput);
            tempInput.select();
            document.execCommand('copy');
            document.body.removeChild(tempInput);

            // Give feedback
            buttonElement.innerHTML = '<i class="fas fa-check"></i> Copied!';
            setTimeout(() => {
                buttonElement.innerHTML = '<i class="fas fa-copy"></i> Copy';
            }, 1500);
        }

        // --- REGISTRATION LOGIC ---
        async function checkCouponValidity(coupon) {
            const normalizedCoupon = coupon.toUpperCase().trim();
            const errorElement = document.getElementById('coupon-error');
            errorElement.style.display = 'none';

            if (!VALID_COUPON_CODES.has(normalizedCoupon)) {
                errorElement.innerText = "Invalid coupon code.";
                errorElement.style.display = 'block';
                return false;
            }

            if (!isFirebaseReady) {
                 showMessage("Database not ready. Cannot check for used coupons.", true);
                 return false;
            }

            try {
                // Check if the code is already used in Firestore (Public Collection for shared resource)
                const q = query(
                    collection(db, `artifacts/${appId}/public/data/used_coupons`),
                    where("code", "==", normalizedCoupon)
                );
                const querySnapshot = await getDocs(q);

                if (querySnapshot.size > 0) {
                    errorElement.innerText = "Coupon code has already been redeemed.";
                    errorElement.style.display = 'block';
                    return false;
                }

                return true;

            } catch (e) {
                console.error("Error checking coupon:", e);
                showMessage("A database error occurred while validating the coupon. Please try again.", true);
                return false;
            }
        }


        window.submitRegistration = async function() {
            const couponCodeInput = document.getElementById('couponCode');
            const couponCode = couponCodeInput.value.trim();

            if (!couponCode) {
                 showMessage("Please enter a coupon code.", true);
                 return;
            }

            // 1. Validate Form Data again
            const firstName = document.getElementById('firstName').value;
            const lastName = document.getElementById('lastName').value;
            const phoneNumber = document.getElementById('phoneNumber').value;
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            
            if (!firstName || !lastName || !phoneNumber || !email || !password) {
                showMessage("Please complete all account creation fields before submitting.", true);
                showCreateAccountView(); // Go back to step 1
                return;
            }

            if (!isFirebaseReady) {
                showMessage("Application database is not ready. Please wait a moment or refresh.", true);
                return;
            }
            
            // 2. Validate Coupon
            const isValid = await checkCouponValidity(couponCode);
            if (!isValid) {
                return; // Error message already shown by checkCouponValidity
            }

            // 3. Register User and Mark Coupon as Used
            try {
                // Define paths
                const userPath = `artifacts/${appId}/users/${userId}/scaleheight_registrations`;
                const couponUsedPath = `artifacts/${appId}/public/data/used_coupons`;
                
                // User Data to Save
                const userData = {
                    userId: userId,
                    firstName: firstName,
                    lastName: lastName,
                    phoneNumber: phoneNumber,
                    email: email,
                    // NOTE: In a real app, passwords should NEVER be saved in plain text in Firestore.
                    // This is for demonstration purposes only.
                    passwordHash: btoa(password), // Mock secure storage
                    registrationDate: new Date(),
                    couponUsed: couponCode,
                    package: 'Standard Package (₦12,000)'
                };

                // Transaction to ensure both are saved (simulated)
                // 3a. Save User Registration (Private Data)
                await setDoc(doc(db, userPath, userId), userData);

                // 3b. Mark Coupon as Used (Public Shared Data)
                await setDoc(doc(db, couponUsedPath, couponCode), {
                    code: couponCode,
                    usedBy: userId,
                    usedDate: new Date(),
                    email: email
                });

                showMessage("Registration Successful! Welcome to Scaleheight. Your account is now active.", false);
                // Clear the form fields after successful registration
                document.getElementById('create-account-form').reset();
                couponCodeInput.value = '';
                switchView(views.createAccount); // Redirect to href='https://sites.google.com/view/scaleheight/dashboard

            } catch (e) {
                console.error("Error during registration:", e);
                showMessage("An error occurred while saving your registration data. Please contact support.", true);
            }
        }
        
        // Ensure the initial view is shown on load
        window.onload = function() {
            showCreateAccountView();
        }
