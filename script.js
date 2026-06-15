/* ============================================
   JAVASCRIPT - Interactivity & Validation
   ============================================ */

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    initHamburgerMenu();
    initFormValidation();
    initSmoothScroll();
    initCategoryCarousel();
});

/* ============================================
   HAMBURGER MENU FUNCTIONALITY
   ============================================ */

function initHamburgerMenu() {
    const hamburgerBtn = document.getElementById('hamburgerBtn');
    const navbarMenu = document.getElementById('navbarMenu');
    const navbarLinks = document.querySelectorAll('.navbar-link');

    if (!hamburgerBtn) return;

    // Toggle menu on hamburger click
    hamburgerBtn.addEventListener('click', function() {
        hamburgerBtn.classList.toggle('active');
        navbarMenu.classList.toggle('active');
    });

    // Close menu when a link is clicked
    navbarLinks.forEach(link => {
        link.addEventListener('click', function() {
            hamburgerBtn.classList.remove('active');
            navbarMenu.classList.remove('active');
        });
    });

    // Close menu when clicking outside
    document.addEventListener('click', function(event) {
        const isClickInsideNav = navbarMenu.contains(event.target) || hamburgerBtn.contains(event.target);
        if (!isClickInsideNav && navbarMenu.classList.contains('active')) {
            hamburgerBtn.classList.remove('active');
            navbarMenu.classList.remove('active');
        }
    });
}

/* ============================================
   FORM VALIDATION
   ============================================ */

function initFormValidation() {
    const rfqForm = document.getElementById('rfqForm');

    if (!rfqForm) return;

    // Real-time validation on input
    const formInputs = rfqForm.querySelectorAll('input, select, textarea');
    formInputs.forEach(input => {
        input.addEventListener('blur', function() {
            validateField(this);
        });

        input.addEventListener('change', function() {
            validateField(this);
        });
    });

    // Form submission
    rfqForm.addEventListener('submit', function(e) {
        e.preventDefault();

        // Validate all fields
        let isFormValid = true;
        formInputs.forEach(input => {
            if (!validateField(input)) {
                isFormValid = false;
            }
        });

        // Check agreement checkbox
        const agreementCheckbox = document.getElementById('agreement');
        if (!agreementCheckbox.checked) {
            showFieldError(agreementCheckbox, 'Anda harus setuju dengan kebijakan privasi');
            isFormValid = false;
        } else {
            clearFieldError(agreementCheckbox);
        }

        if (isFormValid) {
            submitForm(rfqForm);
        }
    });
}

/**
 * Validate individual form field
 */
function validateField(field) {
    const value = field.value.trim();
    const fieldName = field.name;
    let isValid = true;
    let errorMessage = '';

    // Skip validation for optional fields
    if (!field.hasAttribute('required') && !value) {
        clearFieldError(field);
        return true;
    }

    // Required field check
    if (field.hasAttribute('required') && !value) {
        isValid = false;
        errorMessage = 'Field ini wajib diisi';
    }

    // Specific field validation
    switch (fieldName) {
        case 'companyName':
            if (value.length < 3) {
                isValid = false;
                errorMessage = 'Nama perusahaan minimal 3 karakter';
            }
            break;

        case 'contactName':
            if (value.length < 3) {
                isValid = false;
                errorMessage = 'Nama kontak minimal 3 karakter';
            }
            break;

        case 'email':
            if (!isValidEmail(value)) {
                isValid = false;
                errorMessage = 'Format email tidak valid (contoh: nama@perusahaan.com)';
            }
            break;

        case 'phone':
            if (!isValidPhone(value)) {
                isValid = false;
                errorMessage = 'Nomor telepon tidak valid (minimal 10 digit)';
            }
            break;

        case 'productType':
            if (!value) {
                isValid = false;
                errorMessage = 'Pilih jenis merchandise terlebih dahulu';
            }
            break;

        case 'quantity':
            const qty = parseInt(value);
            if (isNaN(qty) || qty < 100) {
                isValid = false;
                errorMessage = 'Jumlah minimum adalah 100 unit';
            }
            break;
    }

    // Show or clear error
    if (isValid) {
        clearFieldError(field);
    } else {
        showFieldError(field, errorMessage);
    }

    return isValid;
}

/**
 * Show error message for a field
 */
function showFieldError(field, message) {
    field.classList.add('error');

    const errorElement = field.parentElement?.querySelector('.form-error');
    if (errorElement) {
        errorElement.textContent = message;
        errorElement.classList.add('show');
    }
}

/**
 * Clear error message for a field
 */
function clearFieldError(field) {
    field.classList.remove('error');

    const errorElement = field.parentElement?.querySelector('.form-error');
    if (errorElement) {
        errorElement.textContent = '';
        errorElement.classList.remove('show');
    }
}

/**
 * Validate email format
 */
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

/**
 * Validate phone number (at least 10 digits)
 */
function isValidPhone(phone) {
    const phoneRegex = /^\d{10,}$/;
    const digitsOnly = phone.replace(/\D/g, '');
    return phoneRegex.test(digitsOnly);
}

/**
 * Submit form
 */
function submitForm(form) {
    // Collect form data
    const formData = {
        companyName: document.getElementById('companyName').value,
        contactName: document.getElementById('contactName').value,
        email: document.getElementById('email').value,
        phone: document.getElementById('phone').value,
        productType: document.getElementById('productType').value,
        quantity: document.getElementById('quantity').value,
        message: document.getElementById('message').value,
        timestamp: new Date().toISOString()
    };

    console.log('Form submitted with data:', formData);

    // Simulate API call (replace with real endpoint)
    simulateFormSubmission(formData);
}

/**
 * Simulate form submission (for demo purposes)
 */
function simulateFormSubmission(data) {
    // Show success message
    const btn = document.querySelector('#rfqForm button[type="submit"]');
    const originalText = btn.textContent;

    btn.disabled = true;
    btn.textContent = 'Mengirim...';

    // Simulate API delay
    setTimeout(() => {
        btn.textContent = 'Berhasil Terkirim! ✓';
        btn.style.backgroundColor = '#10b981';

        // Show alert
        alert(
            `Terima kasih ${data.contactName}!\n\nPermintaan penawaran Anda telah kami terima.\n\n` +
            `Kami akan menghubungi Anda di ${data.phone} dalam 24 jam.\n\n` +
            `Email: ${data.email}\nProduk: ${data.productType}\nJumlah: ${data.quantity} unit`
        );

        // Reset form after 2 seconds
        setTimeout(() => {
            document.getElementById('rfqForm').reset();
            btn.disabled = false;
            btn.textContent = originalText;
            btn.style.backgroundColor = '';
        }, 2000);
    }, 1500);

    // In production, you would send this to a backend API:
    /*
    fetch('/api/rfq-submit', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then(result => {
        console.log('Success:', result);
        // Handle success response
    })
    .catch(error => {
        console.error('Error:', error);
        // Handle error
    });
    */
}

/* ============================================
   SMOOTH SCROLL
   ============================================ */

function initSmoothScroll() {
    const links = document.querySelectorAll('[data-scroll]');

    links.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();

            const targetId = this.getAttribute('data-scroll');
            const targetElement = document.querySelector(targetId);

            if (targetElement) {
                const offsetTop = targetElement.getBoundingClientRect().top + window.scrollY - 80;
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
}

/* ============================================
   CATEGORY TABS & PRODUCT CAROUSEL
   ============================================ */

function initCategoryCarousel() {
    const tabs = document.querySelectorAll('.category-tab');
    const carouselContainers = document.querySelectorAll('.carousel-container');
    const autoplayIntervals = {};

    // Initialize carousel for each category
    function initCarouselForCategory(category) {
        const container = document.querySelector(`.carousel-container[data-category="${category}"]`);
        if (!container) return;

        const cards = container.querySelectorAll('.product-card');
        const prevBtn = container.querySelector('.carousel-nav.prev');
        const nextBtn = container.querySelector('.carousel-nav.next');
        const dots = container.querySelectorAll('.dot');

        let currentIndex = 0;

        if (!prevBtn || !nextBtn || cards.length === 0) return;

        // Show product by index
        function showProduct(index) {
            if (index >= cards.length) {
                currentIndex = 0;
            } else if (index < 0) {
                currentIndex = cards.length - 1;
            } else {
                currentIndex = index;
            }

            // Hide all products
            cards.forEach(card => card.classList.remove('active'));
            // Show current product
            cards[currentIndex].classList.add('active');

            // Update dots
            dots.forEach((dot, idx) => {
                if (idx === currentIndex) {
                    dot.classList.add('active');
                } else {
                    dot.classList.remove('active');
                }
            });
        }

        // Next button
        nextBtn.addEventListener('click', () => {
            showProduct(currentIndex + 1);
            resetAutoplay();
        });

        // Previous button
        prevBtn.addEventListener('click', () => {
            showProduct(currentIndex - 1);
            resetAutoplay();
        });

        // Dot buttons
        dots.forEach((dot, idx) => {
            dot.addEventListener('click', () => {
                showProduct(idx);
                resetAutoplay();
            });
        });

        // Auto advance
        function startAutoplay() {
            autoplayIntervals[category] = setInterval(() => {
                showProduct(currentIndex + 1);
            }, 8000);
        }

        function resetAutoplay() {
            clearInterval(autoplayIntervals[category]);
            startAutoplay();
        }

        startAutoplay();
    }

    // Tab click handler
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const category = tab.getAttribute('data-category');

            // Update active tab
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');

            // Update active carousel
            carouselContainers.forEach(container => {
                container.classList.remove('active');
            });
            document.querySelector(`.carousel-container[data-category="${category}"]`)?.classList.add('active');

            // Initialize carousel for this category if not already done
            if (!autoplayIntervals[category]) {
                initCarouselForCategory(category);
            }
        });
    });

    // Initialize first category carousel
    initCarouselForCategory('merchandise');
}

/* ============================================
   UTILITY FUNCTIONS
   ============================================ */

/**
 * Debounce function for resize events
 */
function debounce(func, delay) {
    let timeoutId;
    return function() {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(func, delay);
    };
}

/**
 * Check if element is in viewport
 */
function isElementInViewport(el) {
    const rect = el.getBoundingClientRect();
    return (
        rect.top <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.bottom >= 0
    );
}

/**
 * Add scroll animation (optional enhancement)
 */
function initScrollAnimations() {
    const elements = document.querySelectorAll('[data-scroll-animate]');

    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    elements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'all 0.6s ease-in-out';
        observer.observe(el);
    });
}

// Initialize scroll animations (uncomment if needed)
// document.addEventListener('DOMContentLoaded', initScrollAnimations);

/* ============================================
   CONSOLE LOGGING (Development)
   ============================================ */

console.log('%c🎨 BrandTalk Landing Page', 'font-size: 16px; font-weight: bold; color: #FACC15;');
console.log('%cB2B Merchandise & Promosi Solution', 'font-size: 12px; color: #64748b;');
console.log('%cVersion 1.0 | Ready to deploy', 'font-size: 10px; color: #94a3b8;');
