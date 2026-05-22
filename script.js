document.addEventListener('DOMContentLoaded', () => {
    
    // ==========================================
    // 1. ADVANCED THEME SYNC SYSTEM
    // ==========================================
    const themeToggleBtn = document.getElementById('globalThemeToggle');
    const savedTheme = localStorage.getItem('theme') || 
                       (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    
    function applyTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        if (themeToggleBtn) {
            themeToggleBtn.innerText = theme === 'dark' ? '☀️' : '🌙';
        }
        localStorage.setItem('theme', theme);
    }

    applyTheme(savedTheme);

    if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', () => {
            const currentTheme = document.documentElement.getAttribute('data-theme');
            applyTheme(currentTheme === 'light' ? 'dark' : 'light');
        });
    }

    // ==========================================
    // 2. FORM ENGINE AND PERSISTENT RECOVERY
    // ==========================================
    const form = document.getElementById('registrationForm');
    if (!form) return; // Stop executing form features on index or about pages

    const successMessage = document.getElementById('successMessage');
    const nameInput = document.getElementById('fullName');
    const charCount = document.getElementById('charCount');
    const submitBtn = document.getElementById('submitBtn');

    const inputs = {
        fullName: nameInput,
        email: document.getElementById('email'),
        phone: document.getElementById('phone'),
        github: document.getElementById('github')
    };

    const validators = {
        fullName: val => val.trim().length >= 3,
        email: val => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val.trim()),
        phone: val => /^\d{10}$/.test(val.trim()),
        github: val => {
            const trimmed = val.trim();
            if (!trimmed) return false;
            try {
                const url = new URL(trimmed);
                return url.hostname === 'github.com' || url.hostname.endsWith('.github.com');
            } catch (_) {
                return false;
            }
        }
    };

    // ADVANCED OPTIMIZATION: XSS Anti-Injection Sanitization Guard
    function sanitizeInput(str) {
        const charMap = {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#x27;',
            "/": '&#x2F;'
        };
        return str.replace(/[&<>"'/]/g, match => charMap[match]);
    }

    function validateField(fieldId) {
        const inputField = inputs[fieldId];
        if (!inputField) return true;

        const isValid = validators[fieldId](inputField.value);
        const formGroup = inputField.parentElement;

        if (isValid) {
            formGroup.classList.remove('invalid');
        } else {
            formGroup.classList.add('invalid');
        }
        return isValid;
    }

    // ADVANCED UX: Rehydrate draft data from localStorage cache if available
    Object.keys(inputs).forEach(fieldId => {
        const savedDraftValue = localStorage.getItem(`draft_${fieldId}`);
        if (savedDraftValue && inputs[fieldId]) {
            inputs[fieldId].value = savedDraftValue;
            validateField(fieldId); // Immediate validation check on recovery
        }
    });

    // Handle real-time updates and character counts
    if (nameInput && charCount) {
        charCount.textContent = nameInput.value.length;
        nameInput.addEventListener('input', () => {
            const currentLength = nameInput.value.length;
            charCount.textContent = currentLength;
            charCount.style.color = (currentLength > 0 && currentLength < 3) ? 'var(--error-color)' : 'var(--text-muted)';
        });
    }

    // Capture dynamic inputs and auto-save current drafts
    Object.keys(inputs).forEach(fieldId => {
        if (inputs[fieldId]) {
            inputs[fieldId].addEventListener('input', () => {
                validateField(fieldId);
                localStorage.setItem(`draft_${fieldId}`, inputs[fieldId].value);
            });
        }
    });

    // ==========================================
    // 3. ASYNCHRONOUS NETWORK REQUEST LAYER
    // ==========================================
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        let isFormValid = true;

        Object.keys(inputs).forEach(fieldId => {
            if (!validateField(fieldId)) {
                isFormValid = false;
            }
        });

        if (!isFormValid) return;

        // Set up the interactive loading state
        submitBtn.disabled = true;
        const originalBtnContent = submitBtn.innerHTML;
        submitBtn.innerHTML = '<span class="spinner"></span> Processing Application...';

        // Securely package and clean input data fields
        const payloadData = {
            applicantName: sanitizeInput(inputs.fullName.value.trim()),
            applicantEmail: sanitizeInput(inputs.email.value.trim()),
            applicantPhone: sanitizeInput(inputs.phone.value.trim()),
            applicantGithub: sanitizeInput(inputs.github.value.trim()),
            timestamp: new Date().toISOString()
        };

        try {
            // Dispatches validation parameters seamlessly using JSONPlaceholder API
            const fetchResponse = await fetch('https://jsonplaceholder.typicode.com/posts', {
                method: 'POST',
                body: JSON.stringify(payloadData),
                headers: { 'Content-type': 'application/json; charset=UTF-8' }
            });

            if (fetchResponse.ok) {
                // Flash success layout boxes and clean storage caches
                successMessage.style.display = 'block';
                form.reset();
                if (charCount) charCount.textContent = '0';

                Object.keys(inputs).forEach(fieldId => {
                    localStorage.removeItem(`draft_${fieldId}`);
                    if (inputs[fieldId]) {
                        inputs[fieldId].parentElement.classList.remove('invalid');
                    }
                });

                setTimeout(() => {
                    successMessage.style.display = 'none';
                }, 6000);
            } else {
                throw new Error('Server returned an abnormal execution state.');
            }
        } catch (networkError) {
            alert('Unable to transmit data. Please verify your connection parameter values.');
            console.error('Submission processing failure:', networkError);
        } finally {
            // Re-enable interactive elements
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalBtnContent;
        }
    });
});