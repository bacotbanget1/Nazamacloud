// app.js
// Main application logic

// App State
const AppState = {
    currentUser: null,
    currentCategory: 'all',
    searchQuery: '',
    isDarkMode: localStorage.getItem('theme') === 'dark'
};

// DOM Elements
const DOM = {
    authSection: document.getElementById('auth-section'),
    loginModal: document.getElementById('loginModal'),
    premiumSection: document.getElementById('premiumSection'),
    domainSearch: document.getElementById('domain-search'),
    domainListContainer: document.getElementById('domain-list-container'),
    categoryTabs: document.getElementById('category-tabs'),
    notFoundMessage: document.getElementById('not-found-message'),
    themeToggle: document.getElementById('theme-toggle')
};

// Domain Data
const domainList = [
    // Domain Populer
    { name: '.com', price: 139000 + 3000, category: ['all', 'populer', 'business', 'us'] },
    { name: '.net', price: 105000 + 3000, category: ['all', 'populer', 'business'] },
    { name: '.org', price: 185000 + 3000, category: ['all', 'business'] },
    { name: '.co', price: 479000 + 3000, category: ['all', 'business'] },
    { name: '.me', price: 289000 + 3000, category: ['all', 'populer'] },
    { name: '.xyz', price: 29900 + 3000, category: ['all', 'populer', 'trending'] },
    { name: '.online', price: 27500 + 3000, category: ['all', 'populer', 'trending', 'business'] },
    
    // Trending Domain
    { name: '.ai', price: 790000 + 3000, category: ['all', 'trending', 'business'] },
    { name: '.io', price: 590000 + 3000, category: ['all', 'trending', 'business'] },
    { name: '.dev', price: 195000 + 3000, category: ['all', 'trending', 'business'] },
    { name: '.app', price: 249000 + 3000, category: ['all', 'trending', 'business'] },
    
    // Indonesia
    { name: '.id', price: 219000 + 3000, category: ['all', 'populer', 'id'] },
    { name: '.co.id', price: 150000 + 3000, category: ['all', 'business', 'id'] },
    { name: '.my.id', price: 25000 + 3000, category: ['all', 'id'] },
    
    // Tambahkan domain lainnya sesuai kebutuhan...
];

// Utility Functions
const Utils = {
    formatRupiah: (amount) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0
        }).format(amount);
    },

    calculateDiscountedPrice: (originalPrice) => {
        return Math.floor(originalPrice * 0.9); // 10% discount
    },

    showNotification: (message, type = 'success') => {
        const colors = {
            success: '#34A853',
            error: '#dc3545',
            info: '#007bff',
            warning: '#ffc107'
        };

        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 12px 20px;
            background: ${colors[type] || colors.info};
            color: white;
            border-radius: 6px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            z-index: 10000;
            font-weight: 500;
            transform: translateX(150%);
            transition: transform 0.3s ease;
        `;
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        setTimeout(() => notification.style.transform = 'translateX(0)', 10);
        setTimeout(() => {
            notification.style.transform = 'translateX(150%)';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }
};

// Auth UI Functions
const AuthUI = {
    updateUI: function(user) {
        AppState.currentUser = user;
        
        if (user) {
            this.showLoggedInUI(user);
            DOM.premiumSection.style.display = 'block';
        } else {
            this.showLoggedOutUI();
            DOM.premiumSection.style.display = 'none';
        }
        
        // Update domain display with correct pricing
        DomainUI.renderDomains();
    },

    showLoggedInUI: function(user) {
        const userPhoto = user.photoURL || 'https://i.imgur.com/5nKiHXG.png';
        const displayName = user.displayName || 'User';
        
        DOM.authSection.innerHTML = `
            <div class="user-profile">
                <img src="${userPhoto}" alt="${displayName}" class="user-avatar">
                <span class="user-name">${displayName}</span>
                <button class="logout-btn" onclick="App.signOut()">Keluar</button>
            </div>
        `;
        
        Utils.showNotification(`Selamat datang, ${displayName}! 🎉`);
    },

    showLoggedOutUI: function() {
        DOM.authSection.innerHTML = `
            <button class="login-btn" onclick="App.openLoginModal()">
                <svg class="google-icon" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Login
            </button>
        `;
    }
};

// Domain UI Functions
const DomainUI = {
    getFilteredDomains: function() {
        return domainList.filter(domain => {
            const matchesSearch = domain.name.toLowerCase()
                .includes(AppState.searchQuery.toLowerCase());
            const matchesCategory = AppState.currentCategory === 'all' || 
                domain.category.includes(AppState.currentCategory);
            return matchesSearch && matchesCategory;
        });
    },

    renderDomains: function() {
        const domains = this.getFilteredDomains();
        
        if (domains.length === 0) {
            DOM.domainListContainer.innerHTML = '';
            DOM.notFoundMessage.style.display = 'block';
            return;
        }
        
        DOM.notFoundMessage.style.display = 'none';
        
        let html = '';
        const isLoggedIn = AppState.currentUser !== null;
        
        domains.forEach(domain => {
            const originalPrice = domain.price;
            const finalPrice = isLoggedIn ? 
                Utils.calculateDiscountedPrice(originalPrice) : originalPrice;
            
            const discountBadge = isLoggedIn ? 
                '<span class="discount-badge">-10%</span>' : '';
            
            const originalPriceDisplay = isLoggedIn ? 
                `<div style="text-decoration: line-through; color: #999; font-size: 0.9em; margin-bottom: 5px;">
                    ${Utils.formatRupiah(originalPrice)}
                </div>` : '';
            
            html += `
                <div class="domain-card ${isLoggedIn ? 'premium-discount' : ''}">
                    <h3>${domain.name} ${discountBadge}</h3>
                    <p>Per Tahun</p>
                    ${originalPriceDisplay}
                    <div class="price ${isLoggedIn ? 'discounted' : ''}">
                        ${Utils.formatRupiah(finalPrice)}
                    </div>
                    <button onclick="App.handleBuyDomain('${domain.name}', ${originalPrice})">
                        ${isLoggedIn ? '🛒 Beli dengan Diskon' : 'Beli Sekarang'}
                    </button>
                </div>
            `;
        });
        
        DOM.domainListContainer.innerHTML = html;
    }
};

// Main App Functions
const App = {
    init: function() {
        console.log('Initializing Nazamacloud Shop...');
        
        // Set up auth listener
        FirebaseAuth.onAuthStateChanged((user) => {
            AuthUI.updateUI(user);
        });
        
        // Initialize dark mode
        this.initDarkMode();
        
        // Set up event listeners
        this.setupEventListeners();
        
        // Initial render
        DomainUI.renderDomains();
        
        // Set current year in footer if exists
        this.setCurrentYear();
        
        console.log('App initialized successfully');
    },

    setupEventListeners: function() {
        // Search input
        DOM.domainSearch.addEventListener('input', (e) => {
            AppState.searchQuery = e.target.value;
            DomainUI.renderDomains();
        });

        // Category tabs
        DOM.categoryTabs.querySelectorAll('button').forEach(button => {
            button.addEventListener('click', (e) => {
                // Update active state
                DOM.categoryTabs.querySelectorAll('button').forEach(btn => {
                    btn.classList.remove('active');
                });
                e.target.classList.add('active');
                
                // Update category and render
                AppState.currentCategory = e.target.dataset.category;
                DomainUI.renderDomains();
            });
        });

        // Close modal when clicking outside
        DOM.loginModal.addEventListener('click', (e) => {
            if (e.target === DOM.loginModal) {
                this.closeLoginModal();
            }
        });
    },

    initDarkMode: function() {
        if (AppState.isDarkMode) {
            document.body.classList.add('dark-mode');
            DOM.themeToggle.textContent = 'Terang';
        } else {
            document.body.classList.remove('dark-mode');
            DOM.themeToggle.textContent = 'Gelap';
        }

        DOM.themeToggle.addEventListener('click', () => {
            AppState.isDarkMode = !AppState.isDarkMode;
            localStorage.setItem('theme', AppState.isDarkMode ? 'dark' : 'light');
            
            if (AppState.isDarkMode) {
                document.body.classList.add('dark-mode');
                DOM.themeToggle.textContent = 'Terang';
            } else {
                document.body.classList.remove('dark-mode');
                DOM.themeToggle.textContent = 'Gelap';
            }
        });
    },

    openLoginModal: function() {
        DOM.loginModal.classList.add('active');
    },

    closeLoginModal: function() {
        DOM.loginModal.classList.remove('active');
    },

    signInWithGoogle: async function() {
        const result = await FirebaseAuth.signInWithGoogle();
        if (result.success) {
            this.closeLoginModal();
        } else {
            Utils.showNotification(`Login gagal: ${result.error}`, 'error');
        }
    },

    signOut: async function() {
        const result = await FirebaseAuth.signOut();
        if (result.success) {
            Utils.showNotification('Anda telah logout', 'info');
        }
    },

    handleBuyDomain: function(domainName, originalPrice) {
        if (!AppState.currentUser) {
            this.openLoginModal();
            Utils.showNotification('Silakan login terlebih dahulu untuk membeli', 'info');
            return;
        }

        const user = FirebaseAuth.getUserData();
        const phoneNumber = '6283142474788';
        const finalPrice = AppState.currentUser ? 
            Utils.calculateDiscountedPrice(originalPrice) : originalPrice;
        
        const message = encodeURIComponent(
            `Halo Admin Nazamacloud! 👋\n\n` +
            `*DATA PEMBELI:*\n` +
            `• Nama: ${user.displayName}\n` +
            `• Email: ${user.email}\n\n` +
            `*PESANAN DOMAIN:*\n` +
            `• Domain: ${domainName}\n` +
            `• Harga Normal: ${Utils.formatRupiah(originalPrice)}\n` +
            `• Harga Member: ${Utils.formatRupiah(finalPrice)}\n` +
            `• Diskon: ${AppState.currentUser ? '10%' : '0%'}\n\n` +
            `Saya ingin membeli domain ini. Mohon konfirmasi ketersediaannya.\n` +
            `Terima kasih! 🙏`
        );
        
        const whatsappUrl = `https://wa.me/${phoneNumber}?text=${message}`;
        window.open(whatsappUrl, '_blank');
    },

    navigateTo: function(url) {
        window.open(url, '_blank');
    },

    setCurrentYear: function() {
        const yearElement = document.getElementById('current-year');
        if (yearElement) {
            yearElement.textContent = new Date().getFullYear();
        }
    }
};

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', () => App.init());

// Make App available globally
window.App = App;