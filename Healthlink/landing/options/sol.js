// Create animated background particles
function createParticles() {
    const particlesContainer = document.getElementById('particles');
    const particleCount = 50;

    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        
        // Random size and position
        const size = Math.random() * 4 + 2;
        particle.style.width = size + 'px';
        particle.style.height = size + 'px';
        particle.style.left = Math.random() * 100 + '%';
        particle.style.top = Math.random() * 100 + '%';
        
        // Random animation delay
        particle.style.animationDelay = Math.random() * 6 + 's';
        
        particlesContainer.appendChild(particle);
    }
}

// Handle scroll effects
function handleScroll() {
    const header = document.getElementById('header');
    if (window.scrollY > 50) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
}

// Handle login clicks
function handleLogin(type) {
    const card = event.currentTarget;
    
    // Add click animation
    card.style.transform = 'scale(0.95)';
    setTimeout(() => {
        card.style.transform = '';
    }, 150);

    // Simulate login process
    const btn = card.querySelector('.login-btn');
    const originalText = btn.innerHTML;
    
    btn.innerHTML = '<span>Connecting...</span>';
    btn.style.background = 'linear-gradient(45deg, #666, #888)';
    
    setTimeout(() => {
        if (type === 'medical') {
            alert('Redirecting to Healthcare Portal...');
            // window.location.href = '/signup page';
        } else if (type==='corporate') {
            alert('Redirecting to Corporate Portal...');
            // window.location.href = '/doctor-login';
        } else {
            alert('Redirecting to Pharma Portal...');
            window.location.href = '/Healthlink/Solutions/sollanding.html';
        }
        
        
        btn.innerHTML = originalText;
        btn.style.background = '';
    }, 2000);
}

// Add mouse movement effect
function initMouseTracking() {
    document.addEventListener('mousemove', (e) => {
        const cards = document.querySelectorAll('.solution-card');
        cards.forEach(card => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            if (x >= 0 && x <= rect.width && y >= 0 && y <= rect.height) {
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                const rotateX = (y - centerY) / 10;
                const rotateY = (centerX - x) / 10;
                
                card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-15px) scale(1.02)`;
            } else {
                card.style.transform = '';
            }
        });
    });
}

// Add keyboard navigation
function initKeyboardNavigation() {
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            const focusedElement = document.activeElement;
            if (focusedElement.classList.contains('solution-card')) {
                focusedElement.click();
            }
        }
    });
}

// Add accessibility attributes
function initAccessibility() {
    document.querySelectorAll('.solution-card').forEach(card => {
        card.setAttribute('tabindex', '0');
        card.setAttribute('role', 'button');
        card.setAttribute('aria-label', card.querySelector('h2').textContent + ' - ' + card.querySelector('p').textContent);
    });
}

// Initialize loading animations
function initLoadingAnimations() {
    setTimeout(() => {
        document.querySelectorAll('.loading').forEach(el => {
            el.style.opacity = '1';
        });
    }, 100);
}

// Initialize all functionality when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Create background particles
    createParticles();
    
    // Add scroll listener for header effects
    window.addEventListener('scroll', handleScroll);
    
    // Initialize interactive features
    initMouseTracking();
    initKeyboardNavigation();
    initAccessibility();
    initLoadingAnimations();
    
    console.log('HealthLink portal initialized successfully!');
});