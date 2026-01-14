// Function to handle job applications
function applyForJob(jobTitle) {
    alert(`Thank you for your interest in the ${jobTitle} position! Please send your resume to info.healthlink@gmail.com or visit our nearest center for more information.`);
}

// Add smooth scrolling for navigation links
document.addEventListener('DOMContentLoaded', function() {
    // Smooth scrolling for navigation links
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

    // Animation on scroll observer
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

    // Observe all job cards for animation
    document.querySelectorAll('.job-card').forEach(card => {
        observer.observe(card);
    });

    // Add loading animation to apply buttons
    document.querySelectorAll('.apply-btn').forEach(button => {
        button.addEventListener('click', function() {
            const originalText = this.textContent;
            this.textContent = 'Processing...';
            this.disabled = true;
            
            setTimeout(() => {
                this.textContent = originalText;
                this.disabled = false;
            }, 2000);
        });
    });

    // Add hover effect to navigation items
    document.querySelectorAll('.nav-menu a').forEach(link => {
        link.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-2px)';
        });
        
        link.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });

    // Add typing effect to hero title (optional enhancement)
    const heroTitle = document.querySelector('.hero-title');
    if (heroTitle) {
        const originalText = heroTitle.textContent;
        heroTitle.textContent = '';
        
        let i = 0;
        const typeWriter = () => {
            if (i < originalText.length) {
                heroTitle.textContent += originalText.charAt(i);
                i++;
                setTimeout(typeWriter, 100);
            }
        };
        
        // Start typing effect after a short delay
        setTimeout(typeWriter, 500);
    }
});

// Add scroll-based header transparency
window.addEventListener('scroll', function() {
    const header = document.querySelector('.header');
    const scrollTop = window.pageYOffset;
    
    if (scrollTop > 100) {
        header.style.background = 'rgba(255, 255, 255, 0.98)';
        header.style.backdropFilter = 'blur(15px)';
    } else {
        header.style.background = 'rgba(255, 255, 255, 0.95)';
        header.style.backdropFilter = 'blur(10px)';
    }
});

// Add parallax effect to hero section
window.addEventListener('scroll', function() {
    const heroSection = document.querySelector('.hero-section');
    const scrollTop = window.pageYOffset;
    const rate = scrollTop * -0.5;
    
    if (heroSection) {
        heroSection.style.transform = `translateY(${rate}px)`;
    }
});

// Form validation and enhanced apply functionality
function enhancedApplyForJob(jobTitle) {
    // Create a more interactive application process
    const userConfirmed = confirm(`Are you sure you want to apply for the ${jobTitle} position?`);
    
    if (userConfirmed) {
        // Simulate form submission
        const applicationData = {
            position: jobTitle,
            timestamp: new Date().toISOString(),
            status: 'submitted'
        };
        
        // Store application in localStorage (for demo purposes)
        const applications = JSON.parse(localStorage.getItem('healthlink_applications') || '[]');
        applications.push(applicationData);
        localStorage.setItem('healthlink_applications', JSON.stringify(applications));
        
        // Show success message
        alert(`Application submitted successfully for ${jobTitle}! 
        
Application ID: THY-${Date.now()}
        
Next steps:
• Check your email for confirmation
• Our HR team will contact you within 3-5 business days
• Keep your documents ready for the interview process

Thank you for choosing HEalthlink!`);
        
        // Optional: redirect to a thank you page
        // window.location.href = 'thank-you.html';
    }
}

// Add keyboard navigation support
document.addEventListener('keydown', function(e) {
    if (e.key === 'Tab') {
        document.body.classList.add('keyboard-navigation');
    }
});

document.addEventListener('mousedown', function() {
    document.body.classList.remove('keyboard-navigation');
});

// Performance optimization: Lazy load animations
const lazyAnimationObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animate');
        }
    });
});

document.querySelectorAll('.job-card, .hero-content').forEach(el => {
    lazyAnimationObserver.observe(el);
});

function applyForJob(jobTitle, formLink) {
    console.log("Applying for:", jobTitle);
    window.open(formLink, '_blank');
  }
