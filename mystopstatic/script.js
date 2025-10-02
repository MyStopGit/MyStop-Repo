// JavaScript functionality for Mystop Landing Page

// Global variable to store user email for referrals
let currentUserEmail = '';

// Toast notification system
function showToast(message, type = 'success') {
    const container = document.getElementById('toast-container');
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.textContent = message;
    
    container.appendChild(toast);
    
    // Remove toast after 4 seconds
    setTimeout(() => {
        toast.classList.add('removing');
        setTimeout(() => {
            if (container.contains(toast)) {
                container.removeChild(toast);
            }
        }, 300);
    }, 4000);
}

// Helper function to create hidden inputs
function createHiddenInput(name, value) {
    const input = document.createElement('input');
    input.type = 'hidden';
    input.name = name;
    input.value = value;
    return input;
}

// Main form submission handler
function handleMainFormSubmit(e) {
    e.preventDefault();
    
    const form = e.target;
    const submitBtn = document.getElementById('submit-btn');
    
    // Store the user's email for future referrals
    currentUserEmail = form.email.value;
    console.log("Stored user email:", currentUserEmail);
    
    // Validate agreement checkbox
    if (!form.agreement.checked) {
        showToast("Please accept the terms and conditions to continue.", "error");
        return;
    }
    
    // Update button state
    submitBtn.textContent = "Submitting...";
    submitBtn.disabled = true;
    
    try {
        console.log("Creating hidden iframe and form...");
        
        // Create a hidden iframe to handle the submission
        const iframeName = 'hidden-form-iframe-' + Date.now();
        const iframe = document.createElement('iframe');
        iframe.name = iframeName;
        iframe.style.display = 'none';
        document.body.appendChild(iframe);
        
        console.log("Iframe created with name:", iframeName);
        
        // Create a hidden form and submit it
        const hiddenForm = document.createElement('form');
        hiddenForm.method = 'POST';
        hiddenForm.action = 'https://script.google.com/macros/s/AKfycbwBIieoAkm01Zp1FTLvMkiTYFavWQbgZaTXlyZ9xNbGNqUlDTUfEWDqXuKjxlhGjglM/exec';
        hiddenForm.target = iframeName;
        
        // Add form data as hidden inputs
        hiddenForm.appendChild(createHiddenInput('fullName', form.fullName.value));
        hiddenForm.appendChild(createHiddenInput('location', form.location.value));
        hiddenForm.appendChild(createHiddenInput('phone', form.phone.value));
        hiddenForm.appendChild(createHiddenInput('email', form.email.value));
        hiddenForm.appendChild(createHiddenInput('agreement', form.agreement.checked));
        hiddenForm.appendChild(createHiddenInput('emailPreferences', form.emailPreferences.checked));
        hiddenForm.appendChild(createHiddenInput('isReferral', 'false')); // Explicitly set to false
        
        console.log("Form data added, about to submit...");
        
        // Add the form to the document and submit it
        document.body.appendChild(hiddenForm);
        console.log("Form added to document, submitting now...");
        hiddenForm.submit();
        console.log("Form submitted!");
        
        // Show success message
        showToast("Thank you! You've been added to our waitlist.");
        form.reset();
        
        // Clean up after submission
        setTimeout(() => {
            document.body.removeChild(hiddenForm);
            document.body.removeChild(iframe);
            console.log("Cleanup completed");
        }, 5000);
        
    } catch (error) {
        showToast("Network error. Please check your connection and try again.", "error");
        console.error('Network error during main form submission:', error);
    } finally {
        submitBtn.textContent = "Join the Waitlist";
        submitBtn.disabled = false;
    }
}

// Invite friend form submission handler
function handleInviteSubmit(e) {
    e.preventDefault();
    
    const form = e.target;
    const friendEmail = form.friendEmail.value;
    const submitBtn = form.querySelector('button[type="submit"]');
    
    if (!friendEmail) {
        showToast("Please enter your friend's email address.", "error");
        return;
    }
    
    // Update button state
    submitBtn.textContent = "...";
    submitBtn.disabled = true;
    
    try {
        console.log("Creating hidden iframe and form for referral...");
        
        // Create a hidden iframe to handle the submission
        const iframeName = 'hidden-invite-iframe-' + Date.now();
        const iframe = document.createElement('iframe');
        iframe.name = iframeName;
        iframe.style.display = 'none';
        document.body.appendChild(iframe);
        
        console.log("Iframe created with name:", iframeName);
        
        // Create a hidden form and submit it
        const hiddenForm = document.createElement('form');
        hiddenForm.method = 'POST';
        hiddenForm.action = 'https://script.google.com/macros/s/AKfycbwBIieoAkm01Zp1FTLvMkiTYFavWQbgZaTXlyZ9xNbGNqUlDTUfEWDqXuKjxlhGjglM/exec';
        hiddenForm.target = iframeName;
        
        // Add form data as hidden inputs
        hiddenForm.appendChild(createHiddenInput('friendEmail', friendEmail));
        hiddenForm.appendChild(createHiddenInput('referrerEmail', currentUserEmail || 'unknown'));
        hiddenForm.appendChild(createHiddenInput('isReferral', 'true')); // Explicitly set to true
        
        console.log("Referral form data added, about to submit...");
        
        // Add the form to the document and submit it
        document.body.appendChild(hiddenForm);
        console.log("Referral form added to document, submitting now...");
        hiddenForm.submit();
        console.log("Referral form submitted!");
        
        // Show success message
        showToast("Invitation sent! Your friend will be notified.");
        form.friendEmail.value = '';
        
        // Clean up after submission
        setTimeout(() => {
            document.body.removeChild(hiddenForm);
            document.body.removeChild(iframe);
            console.log("Referral cleanup completed");
        }, 5000);
        
    } catch (error) {
        showToast("Network error. Please check your connection and try again.", "error");
        console.error('Network error during referral submission:', error);
    } finally {
        submitBtn.textContent = "Invite";
        submitBtn.disabled = false;
    }
}

// Modal functionality
function openModal() {
    const modal = document.getElementById('legal-modal');
    modal.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
}

function closeModal() {
    const modal = document.getElementById('legal-modal');
    modal.classList.add('hidden');
    document.body.style.overflow = 'auto';
}

// Initialize event listeners when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log("DOM loaded, initializing event listeners");
    
    // Main form submission
    const mainForm = document.getElementById('main-form');
    if (mainForm) {
        console.log("Main form found, adding submit listener");
        mainForm.addEventListener('submit', handleMainFormSubmit);
    } else {
        console.error("Main form not found");
    }
    
    // Invite form submission
    const inviteForm = document.getElementById('invite-form');
    if (inviteForm) {
        console.log("Invite form found, adding submit listener");
        inviteForm.addEventListener('submit', handleInviteSubmit);
    } else {
        console.error("Invite form not found");
    }
    
    // Legal modal triggers
    const legalTrigger = document.getElementById('legal-trigger');
    if (legalTrigger) {
        legalTrigger.addEventListener('click', openModal);
    }
    
    const closeModalBtn = document.getElementById('close-modal');
    if (closeModalBtn) {
        closeModalBtn.addEventListener('click', closeModal);
    }
    
    // Close modal when clicking outside
    const modal = document.getElementById('legal-modal');
    if (modal) {
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                closeModal();
            }
        });
    }
    
    // Close modal with Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closeModal();
        }
    });
    
    // Form validation for agreement checkbox
    const agreementCheckbox = document.getElementById('agreement');
    const submitBtn = document.getElementById('submit-btn');
    
    if (agreementCheckbox && submitBtn) {
        function updateSubmitButton() {
            if (agreementCheckbox.checked) {
                submitBtn.disabled = false;
                submitBtn.classList.remove('opacity-50', 'cursor-not-allowed');
            } else {
                submitBtn.disabled = true;
                submitBtn.classList.add('opacity-50', 'cursor-not-allowed');
            }
        }
        
        agreementCheckbox.addEventListener('change', updateSubmitButton);
        
        // Initial state
        updateSubmitButton();
    }
    
    // Smooth scroll for anchor links (if any)
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Add loading states for all interactive elements
    const interactiveElements = document.querySelectorAll('button, input[type="submit"]');
    interactiveElements.forEach(element => {
        element.addEventListener('click', function() {
            // Add a subtle loading animation
            this.style.transform = 'scale(0.98)';
            setTimeout(() => {
                this.style.transform = '';
            }, 150);
        });
    });
    
    // Initialize animations on scroll (intersection observer)
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.animationPlayState = 'running';
            }
        });
    }, observerOptions);
    
    // Observe animated elements
    const animatedElements = document.querySelectorAll('[class*="animate-"]');
    animatedElements.forEach(el => {
        el.style.animationPlayState = 'paused';
        observer.observe(el);
    });
    
    // Resume animations after a short delay for initial load
    setTimeout(() => {
        animatedElements.forEach(el => {
            el.style.animationPlayState = 'running';
        });
    }, 100);
});

// Performance optimization: Debounce resize events
let resizeTimeout;
window.addEventListener('resize', function() {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(function() {
        // Handle any resize-dependent functionality here
        console.log('Window resized');
    }, 250);
});

// Console welcome message
console.log('%cWelcome to Mystop! 🛒', 'color: #ffffff; background: #1a1a1a; padding: 10px; border-radius: 5px; font-size: 16px;');
console.log('All you need at one stop');