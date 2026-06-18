/* ============================================
   BRANDTALK ADVERTISING — JavaScript
   ============================================ */

document.addEventListener('DOMContentLoaded', function () {
    initNavbar();
    initHamburgerMenu();
    initSmoothScroll();
    initCategoryCarousel();
    initFormValidation();
});

/* ============================================
   NAVBAR SCROLL EFFECT
   ============================================ */

function initNavbar() {
    const navbar = document.getElementById('navbar');
    if (!navbar) return;

    window.addEventListener('scroll', function () {
        if (window.scrollY > 20) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });
}

/* ============================================
   HAMBURGER MENU
   ============================================ */

function initHamburgerMenu() {
    const hamburgerBtn = document.getElementById('hamburgerBtn');
    const navbarMenu = document.getElementById('navbarMenu');
    if (!hamburgerBtn || !navbarMenu) return;

    hamburgerBtn.addEventListener('click', function () {
        hamburgerBtn.classList.toggle('active');
        navbarMenu.classList.toggle('active');
    });

    navbarMenu.querySelectorAll('.navbar-link').forEach(link => {
        link.addEventListener('click', function () {
            hamburgerBtn.classList.remove('active');
            navbarMenu.classList.remove('active');
        });
    });

    document.addEventListener('click', function (e) {
        if (!navbarMenu.contains(e.target) && !hamburgerBtn.contains(e.target)) {
            hamburgerBtn.classList.remove('active');
            navbarMenu.classList.remove('active');
        }
    });
}

/* ============================================
   SMOOTH SCROLL
   ============================================ */

function initSmoothScroll() {
    document.querySelectorAll('[data-scroll]').forEach(link => {
        link.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('data-scroll');
            const target = document.querySelector(targetId);
            if (target) {
                const offset = target.getBoundingClientRect().top + window.scrollY - 72;
                window.scrollTo({ top: offset, behavior: 'smooth' });
            }
        });
    });
}

/* ============================================
   CATEGORY TABS & CAROUSEL
   ============================================ */

function initCategoryCarousel() {
    const tabs = document.querySelectorAll('.category-tab');
    const containers = document.querySelectorAll('.carousel-container');
    const state = {};

    // Initialize all carousels
    containers.forEach(container => {
        const category = container.getAttribute('data-category');
        initCarousel(category, container);
    });

    // Tab switching
    tabs.forEach(tab => {
        tab.addEventListener('click', function () {
            const category = this.getAttribute('data-category');

            tabs.forEach(t => t.classList.remove('active'));
            this.classList.add('active');

            containers.forEach(c => c.classList.remove('active'));
            const target = document.querySelector(`.carousel-container[data-category="${category}"]`);
            if (target) target.classList.add('active');
        });
    });

    function initCarousel(category, container) {
        const cards = container.querySelectorAll('.product-card');
        const dots = container.querySelectorAll('.dot');
        const prevBtn = container.querySelector('.carousel-nav.prev') || container.querySelector('.carousel-nav:first-of-type');
        const nextBtn = container.querySelector('.carousel-nav.next') || container.querySelector('.carousel-nav:last-of-type');

        if (!cards.length) return;

        state[category] = { index: 0, interval: null };

        function show(idx) {
            if (idx >= cards.length) idx = 0;
            if (idx < 0) idx = cards.length - 1;
            state[category].index = idx;

            cards.forEach((c, i) => c.classList.toggle('active', i === idx));
            dots.forEach((d, i) => d.classList.toggle('active', i === idx));
        }

        function startAuto() {
            clearInterval(state[category].interval);
            state[category].interval = setInterval(() => show(state[category].index + 1), 5000);
        }

        if (prevBtn) {
            prevBtn.addEventListener('click', () => {
                show(state[category].index - 1);
                startAuto();
            });
        }

        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                show(state[category].index + 1);
                startAuto();
            });
        }

        dots.forEach((dot, i) => {
            dot.addEventListener('click', () => {
                show(i);
                startAuto();
            });
        });

        show(0);
        startAuto();
    }
}

/* ============================================
   FORM VALIDATION
   ============================================ */

function initFormValidation() {
    const form = document.getElementById('rfqForm');
    if (!form) return;

    const inputs = form.querySelectorAll('input, select, textarea');

    inputs.forEach(input => {
        input.addEventListener('blur', () => validateField(input));
        input.addEventListener('change', () => validateField(input));
    });

    form.addEventListener('submit', function (e) {
        e.preventDefault();

        let valid = true;
        inputs.forEach(input => {
            if (!validateField(input)) valid = false;
        });

        const agree = document.getElementById('agreement');
        if (!agree.checked) {
            showError(agree, 'Anda harus menyetujui kebijakan privasi');
            valid = false;
        } else {
            clearError(agree);
        }

        if (valid) submitForm(form);
    });
}

function validateField(field) {
    const val = field.value.trim();

    if (!field.hasAttribute('required') && !val) {
        clearError(field);
        return true;
    }

    if (field.hasAttribute('required') && !val) {
        showError(field, 'Field ini wajib diisi');
        return false;
    }

    switch (field.name) {
        case 'companyName':
        case 'contactName':
            if (val.length < 3) {
                showError(field, 'Minimal 3 karakter');
                return false;
            }
            break;
        case 'email':
            if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)) {
                showError(field, 'Format email tidak valid');
                return false;
            }
            break;
        case 'phone':
            if (val.replace(/\D/g, '').length < 10) {
                showError(field, 'Nomor telepon minimal 10 digit');
                return false;
            }
            break;
        case 'quantity':
            if (isNaN(parseInt(val)) || parseInt(val) < 50) {
                showError(field, 'Jumlah minimum adalah 50 pcs');
                return false;
            }
            break;
    }

    clearError(field);
    return true;
}

function showError(field, msg) {
    field.classList.add('error');
    const err = field.parentElement?.querySelector('.form-error');
    if (err) { err.textContent = msg; err.classList.add('show'); }
}

function clearError(field) {
    field.classList.remove('error');
    const err = field.parentElement?.querySelector('.form-error');
    if (err) { err.textContent = ''; err.classList.remove('show'); }
}

function submitForm(form) {
    const btn = form.querySelector('button[type="submit"]');
    const data = {
        companyName: document.getElementById('companyName').value,
        contactName: document.getElementById('contactName').value,
        email: document.getElementById('email').value,
        phone: document.getElementById('phone').value,
        productType: document.getElementById('productType').value,
        quantity: document.getElementById('quantity').value,
        message: document.getElementById('message').value,
    };

    btn.disabled = true;
    btn.textContent = 'Mengirim...';

    setTimeout(() => {
        btn.textContent = '✓ Berhasil Terkirim!';
        btn.style.background = '#10B981';
        btn.style.borderColor = '#10B981';

        alert(
            `Terima kasih, ${data.contactName}!\n\n` +
            `Permintaan penawaran Anda telah kami terima.\n\n` +
            `Kami akan segera menghubungi Anda di ${data.phone}.\n\n` +
            `Produk: ${data.productType}\nJumlah: ${data.quantity} pcs`
        );

        setTimeout(() => {
            form.reset();
            btn.disabled = false;
            btn.textContent = 'Kirim Permintaan Penawaran';
            btn.style.background = '';
            btn.style.borderColor = '';
        }, 2000);
    }, 1500);
}

/* ============================================
   CONSOLE
   ============================================ */
console.log('%c🖨️ Brandtalk Advertising', 'font-size:16px;font-weight:bold;color:#FACC15');
console.log('%cSouvenir, Merchandise & Barang Promosi', 'font-size:12px;color:#6B7280');