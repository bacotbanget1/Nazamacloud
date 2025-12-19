// app.js - Main Application Logic
console.log("🚀 Nazamacloud Shop Starting...");

// Application State
let currentUser = null;
let currentCategory = 'all';
let searchQuery = '';

// Domain Data
const domainList = [
    // Domain Populer
    { name: '.com', price: 142000, category: ['all', 'populer', 'business', 'us'] },
    { name: '.net', price: 108000, category: ['all', 'populer', 'business'] },
    { name: '.org', price: 188000, category: ['all', 'business'] },
    { name: '.co', price: 482000, category: ['all', 'business'] },
    { name: '.me', price: 292000, category: ['all', 'populer'] },
    { name: '.xyz', price: 32900, category: ['all', 'populer', 'trending'] },
    { name: '.online', price: 30500, category: ['all', 'populer', 'trending', 'business'] },
    
    // Trending Domain
    { name: '.ai', price: 793000, category: ['all', 'trending', 'business'] },
    { name: '.io', price: 593000, category: ['all', 'trending', 'business'] },
    { name: '.dev', price: 198000, category: ['all', 'trending', 'business'] },
    { name: '.app', price: 252000, category: ['all', 'trending', 'business'] },
    
    // Indonesia
    { name: '.id', price: 222000, category: ['all', 'populer', 'id'] },
    { name: '.co.id', price: 153000, category: ['all', 'business', 'id'] },
    { name: '.my.id', price: 28000, category: ['all', 'id'] },
    
    // Negara Lain
    { name: '.tv', price: 328000, category: ['all', 'tv'] },
    { name: '.au', price: 367000, category: ['all', 'au'] },
    { name: '.my', price: 125000, category: ['all', 'my'] },
    { name: '.us', price: 118000, category: ['all', 'us'] },
    
    // Bisnis & Lainnya
    { name: '.shop', price: 153000, category: ['all', 'business'] },
    { name: '.tech', price: 68000, category: ['all', 'trending', 'business'] },
    { name: '.site', price: 30500, category: ['all', 'populer', 'trending'] },
    { name: '.info', price: 328000, category: ['all', 'business'] },
    { name: '.biz', price: 192000, category: ['all', 'business'] },
    { name: '.store', price: 50500, category: ['all', 'business'] },
];

// Utility Functions
function formatRupiah(amount) {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0
    }).format(amount);
}

function calculateDiscountedPrice(originalPrice) {
    return Math.floor(originalPrice * 0.9); // 10% discount
}

function showNotification(message, type = 'success') {
    // Create notification element
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 12px 20px;
        background: ${type === 'error' ? '#ef4444' : '#10b981'};
        color: white;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        z-index: 10000;
        font-weight: 500;
        transform: translateX(150%);
        transition: transform 0.3s ease;
    `;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => notification.style.transform = 'translateX(0)', 10);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.transform = 'translateX(150%)';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// UI Functions
function updateUIForLoggedInUser(user) {
    const authSection = document.getElementById('auth-section');
    const userPhoto = user.photoURL || 'https://i.imgur.com/5nKiHXG.png';
    const displayName = user.displayName || 'Pengguna';
    
    authSection.innerHTML = `
        <div class="user-profile">
            <img src="${userPhoto}" alt="${displayName}" class="user-avatar">
            <span class="user-name">${displayName}</span>
            <button class="logout-btn">Keluar</button>
        </div>
    `;
    
    // Add logout event
    authSection.querySelector('.logout-btn').addEventListener('click', handleLogout);
    
    // Show premium section
    document.getElementById('premiumSection').style.display = 'block';
    
    showNotification(`Selamat datang, ${displayName}! 🎉`);
}

function updateUIForLoggedOutUser() {
    const authSection = document.getElementById('auth-section');
    authSection.innerHTML = `
        <button class="login-btn">
            <svg class="google-icon" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Login
        </button>
    `;
    
    // Add login event
    authSection.querySelector('.login-btn').addEventListener('click', openLoginModal);
    
    // Hide premium section
    document.getElementById('premiumSection').style.display = 'none';
}

function openLoginModal() {
    document.getElementById('loginModal').classList.add('active');
}

function closeLoginModal() {
    document.getElementById('loginModal').classList.remove('active');
}

// Domain Functions
function getFilteredDomains() {
    return domainList.filter(domain => {
        const matchesSearch = domain.name.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = currentCategory === 'all' || domain.category.includes(currentCategory);
        return matchesSearch && matchesCategory;
    });
}

function renderDomains() {
    const container = document.getElementById('domain-list-container');
    const notFoundMessage = document.getElementById('not-found-message');
    const domains = getFilteredDomains();
    
    if (domains.length === 0) {
        container.innerHTML = '';
        notFoundMessage.style.display = 'block';
        return;
    }
    
    notFoundMessage.style.display = 'none';
    
    let html = '';
    const isLoggedIn = currentUser !== null;
    
    domains.forEach(domain => {
        const originalPrice = domain.price;
        const finalPrice = isLoggedIn ? 
            calculateDiscountedPrice(originalPrice) : originalPrice;
        
        const discountBadge = isLoggedIn ? 
            '<span class="discount-badge">-10%</span>' : '';
        
        const originalPriceDisplay = isLoggedIn ? 
            `<div style="text-decoration: line-through; color: #999; font-size: 0.9em; margin-bottom: 5px;">
                ${formatRupiah(originalPrice)}
            </div>` : '';
        
        html += `
            <div class="domain-card ${isLoggedIn ? 'premium-discount' : ''}">
                <h3>${domain.name} ${discountBadge}</h3>
                <p>Per Tahun</p>
                ${originalPriceDisplay}
                <div class="price ${isLoggedIn ? 'discounted' : ''}">
                    ${formatRupiah(finalPrice)}
                </div>
                <button data-domain="${domain.name}" data-price="${originalPrice}">
                    ${isLoggedIn ? '🛒 Beli dengan Diskon' : 'Beli Sekarang'}
                </button>
            </div>
        `;
    });
    
    container.innerHTML = html;
    
    // Add event listeners to buy buttons
    container.querySelectorAll('button').forEach(button => {
        button.addEventListener('click', function() {
            const domainName = this.getAttribute('data-domain');
            const domainPrice = parseInt(this.getAttribute('data-price'));
            handleBuyDomain(domainName, domainPrice);
        });
    });
}

// Event Handlers
async function handleLogin() {
    if (typeof FirebaseAuth === 'undefined') {
        showNotification('Firebase belum siap. Tunggu sebentar...', 'error');
        return;
    }
    
    const result = await FirebaseAuth.signInWithGoogle();
    if (result.success) {
        currentUser = result.user;
        closeLoginModal();
        renderDomains();
    } else {
        showNotification(`Login gagal: ${result.error}`, 'error');
    }
}

async function handleLogout() {
    if (typeof FirebaseAuth === 'undefined') return;
    
    const result = await FirebaseAuth.signOut();
    if (result.success) {
        currentUser = null;
        showNotification('Anda telah logout');
        renderDomains();
    }
}

function handleBuyDomain(domainName, originalPrice) {
    if (!currentUser) {
        openLoginModal();
        showNotification('Silakan login terlebih dahulu untuk membeli', 'info');
        return;
    }
    
    const phoneNumber = '6283142474788';
    const finalPrice = currentUser ? 
        calculateDiscountedPrice(originalPrice) : originalPrice;
    
    const message = encodeURIComponent(
        `Halo Admin Nazamacloud! 👋\n\n` +
        `*DATA PEMBELI:*\n` +
        `• Nama: ${currentUser.displayName}\n` +
        `• Email: ${currentUser.email}\n\n` +
        `*PESANAN DOMAIN:*\n` +
        `• Domain: ${domainName}\n` +
        `• Harga Normal: ${formatRupiah(originalPrice)}\n` +
        `• Harga Member: ${formatRupiah(finalPrice)}\n` +
        `• Diskon: ${currentUser ? '10%' : '0%'}\n\n` +
        `Saya ingin membeli domain ini. Mohon konfirmasi ketersediaannya.\n` +
        `Terima kasih! 🙏`
    );
    
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${message}`;
    window.open(whatsappUrl, '_blank');
}

// Initialize Application
function initApp() {
    console.log("🚀 Initializing Nazamacloud Shop...");
    
    // Initialize Firebase Auth State
    if (typeof FirebaseAuth !== 'undefined') {
        FirebaseAuth.onAuthStateChanged((user) => {
            currentUser = user;
            if (user) {
                updateUIForLoggedInUser(user);
            } else {
                updateUIForLoggedOutUser();
            }
            renderDomains();
        });
        
        // Check initial auth state
        const initialUser = FirebaseAuth.getCurrentUser();
        if (initialUser) {
            currentUser = initialUser;
            updateUIForLoggedInUser(initialUser);
        } else {
            updateUIForLoggedOutUser();
        }
    } else {
        console.warn("FirebaseAuth not available, using guest mode");
        updateUIForLoggedOutUser();
    }
    
    // Event Listeners
    document.getElementById('googleLoginBtn').addEventListener('click', handleLogin);
    document.querySelector('.close-modal').addEventListener('click', closeLoginModal);
    
    // Close modal when clicking outside
    document.getElementById('loginModal').addEventListener('click', function(e) {
        if (e.target === this) {
            closeLoginModal();
        }
    });
    
    // Search functionality
    document.getElementById('domain-search').addEventListener('input', function(e) {
        searchQuery = e.target.value;
        renderDomains();
    });
    
    // Category tabs
    document.querySelectorAll('#category-tabs button').forEach(button => {
        button.addEventListener('click', function() {
            // Update active state
            document.querySelectorAll('#category-tabs button').forEach(btn => {
                btn.classList.remove('active');
            });
            this.classList.add('active');
            
            // Update category
            currentCategory = this.getAttribute('data-category');
            renderDomains();
        });
    });
    
    // Dark mode toggle
    const themeToggle = document.getElementById('theme-toggle');
    const savedTheme = localStorage.getItem('theme') || 'light';
    
    if (savedTheme === 'dark') {
        document.body.classList.add('dark-mode');
        themeToggle.textContent = 'Terang';
    } else {
        document.body.classList.remove('dark-mode');
        themeToggle.textContent = 'Gelap';
    }
    
    themeToggle.addEventListener('click', function() {
        if (document.body.classList.contains('dark-mode')) {
            document.body.classList.remove('dark-mode');
            themeToggle.textContent = 'Gelap';
            localStorage.setItem('theme', 'light');
        } else {
            document.body.classList.add('dark-mode');
            themeToggle.textContent = 'Terang';
            localStorage.setItem('theme', 'dark');
        }
    });
    
    // Initial render
    renderDomains();
    
    console.log("✅ Nazamacloud Shop initialized successfully!");
}

// Start the app when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Wait a bit for Firebase to load
    setTimeout(initApp, 1000);
});

// Make functions available globally (for debugging)
window.app = {
    currentUser,
    formatRupiah,
    calculateDiscountedPrice,
    showNotification,
    openLoginModal,
    closeLoginModal
};
