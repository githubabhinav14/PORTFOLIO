document.addEventListener('DOMContentLoaded', function() {
    // Initialize EmailJS
    emailjs.init('YOUR_PUBLIC_KEY'); // Replace with your EmailJS public key
    
    // Mobile menu toggle
    const hamburger = document.querySelector('.hamburger');
    const mobileMenu = document.querySelector('.mobile-menu');
    
    hamburger.addEventListener('click', function() {
        mobileMenu.classList.toggle('active');
        hamburger.classList.toggle('active');
    });
    
    // Navigation links
    const navLinks = document.querySelectorAll('.nav-link, .mobile-nav-link');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetSection = this.getAttribute('data-section');
            scrollToSection(targetSection);
            
            // Close mobile menu if open
            mobileMenu.classList.remove('active');
            hamburger.classList.remove('active');
            
            // Update active link
            updateActiveNavLink(targetSection);
        });
        
        // Keyboard navigation for mobile menu
        link.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                scrollToSection(this.getAttribute('data-section'));
                mobileMenu.classList.remove('active');
                hamburger.classList.remove('active');
                updateActiveNavLink(this.getAttribute('data-section'));
            }
        });
    });
    
    // Scroll spy for navigation
    window.addEventListener('scroll', function() {
        const sections = ['home', 'about', 'projects', 'contact'];
        const scrollPos = window.scrollY + 100;
        
        sections.forEach(sectionId => {
            const element = document.getElementById(sectionId);
            if (element) {
                const sectionTop = element.offsetTop;
                const sectionHeight = element.offsetHeight;
                
                if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
                    updateActiveNavLink(sectionId);
                }
            }
        });
    });
    
    // Intersection Observer for animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);
    
    // Observe elements for animations
    const animateElements = document.querySelectorAll('.fade-in, .slide-in-left, .slide-in-right');
    animateElements.forEach(el => observer.observe(el));
    
    // Add animation classes to elements
    addAnimationClasses();
    
    // Initialize typing effect
    const heroTitle = document.querySelector('.hero-title .gradient-text');
    if (heroTitle) {
        typeWriter(heroTitle, 'Abhinav Nallanagula', 100);
    }
    
    // Initialize chart
    const ctx = document.getElementById('typingSpeedChart')?.getContext('2d');
    if (ctx) {
        new Chart(ctx, {
            type: 'line',
            data: {
                labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
                datasets: [{
                    label: 'Typing Speed (WPM)',
                    data: [30, 45, 60, 75],
                    borderColor: '#4f46e5',
                    backgroundColor: 'rgba(79, 70, 229, 0.2)',
                    fill: true,
                    tension: 0.4
                }]
            },
            options: {
                responsive: true,
                scales: {
                    y: { beginAtZero: true }
                }
            }
        });
    }
    
    // Contact form handling
    const contactForm = document.getElementById('contactForm');
    const toastNotification = document.getElementById('toastNotification');
    
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const formData = new FormData(this);
        const name = formData.get('name');
        const email = formData.get('email');
        const message = formData.get('message');
        
        if (!name || !email || !message) {
            showToast('Please fill in all fields.', false);
            return;
        }
        
        const submitBtn = this.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
        submitBtn.disabled = true;
        
        emailjs.send('YOUR_SERVICE_ID', 'YOUR_TEMPLATE_ID', {
            name,
            email,
            message
        }).then(() => {
            this.reset();
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
            showToast('Message Sent! I\'ll get back to you soon.', true);
        }).catch(() => {
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
            showToast('Failed to send message. Please try again.', false);
        });
    });
});

// Function to show toast notification
function showToast(message, isSuccess = true) {
    const toastNotification = document.getElementById('toastNotification');
    toastNotification.querySelector('span').textContent = message;
    toastNotification.querySelector('.toast-icon').className = `fas ${isSuccess ? 'fa-check-circle' : 'fa-exclamation-circle'} toast-icon`;
    toastNotification.style.background = isSuccess 
        ? 'linear-gradient(135deg, #4f46e5, #c026d3)' 
        : 'linear-gradient(135deg, #ef4444, #f87171)';
    
    toastNotification.classList.add('visible');
    
    setTimeout(() => {
        toastNotification.classList.remove('visible');
    }, 3000);
}

// Smooth scroll to section
function scrollToSection(sectionId) {
    const element = document.getElementById(sectionId);
    if (element) {
        const offsetTop = element.offsetTop - 80;
        window.scrollTo({
            top: offsetTop,
            behavior: 'smooth'
        });
    }
}

// Update active navigation link
function updateActiveNavLink(activeSection) {
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('data-section') === activeSection) {
            link.classList.add('active');
        }
    });
}

// Add animation classes to elements
function addAnimationClasses() {
    const heroContent = document.querySelector('.hero-content');
    if (heroContent) {
        heroContent.classList.add('fade-in');
    }
    
    const sectionHeaders = document.querySelectorAll('.section-header');
    sectionHeaders.forEach(header => {
        header.classList.add('fade-in');
    });
    
    const aboutText = document.querySelector('.about-text');
    const technologies = document.querySelector('.technologies');
    
    if (aboutText) aboutText.classList.add('slide-in-left');
    if (technologies) technologies.classList.add('slide-in-right');
    
    const projectCards = document.querySelectorAll('.project-card');
    projectCards.forEach((card, index) => {
        card.classList.add('fade-in');
        card.style.transitionDelay = `${index * 0.1}s`;
    });
    
    const contactInfo = document.querySelector('.contact-info');
    const contactFormContainer = document.querySelector('.contact-form-container');
    
    if (contactInfo) contactInfo.classList.add('slide-in-left');
    if (contactFormContainer) contactFormContainer.classList.add('slide-in-right');
    
    const footerContent = document.querySelector('.footer-content');
    if (footerContent) {
        footerContent.classList.add('fade-in');
    }
}

// Typing effect for hero title
function typeWriter(element, text, speed = 100) {
    let i = 0;
    element.innerHTML = '';
    
    function type() {
        if (i < text.length) {
            element.innerHTML += text.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    }
    
    type();
}

// Smooth reveal animations
function revealOnScroll() {
    const reveals = document.querySelectorAll('.fade-in:not(.visible)');
    
    reveals.forEach(element => {
        const windowHeight = window.innerHeight;
        const elementTop = element.getBoundingClientRect().top;
        const elementVisible = 150;
        
        if (elementTop < windowHeight - elementVisible) {
            element.classList.add('visible');
        }
    });
}

// Theme toggle
function toggleTheme() {
    document.body.classList.toggle('dark-mode');
    const isDark = document.body.classList.contains('dark-mode');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
    document.querySelector('.theme-toggle i').className = `fas fa-${isDark ? 'sun' : 'moon'}`;
}

// Load saved theme
if (localStorage.getItem('theme') === 'dark') {
    document.body.classList.add('dark-mode');
    document.querySelector('.theme-toggle i').className = 'fas fa-sun';
}

window.addEventListener('scroll', revealOnScroll);

document.addEventListener('DOMContentLoaded', revealOnScroll);

// Add click effects to buttons
document.addEventListener('click', function(e) {
    if (e.target.classList.contains('btn')) {
        e.target.style.transform = 'scale(0.98)';
        setTimeout(() => {
            e.target.style.transform = '';
        }, 150);
    }
});

// Preloader
window.addEventListener('load', function() {
    document.body.classList.add('loaded');
});

// Add floating animation to social links
function addFloatingAnimation() {
    const socialLinks = document.querySelectorAll('.social-links a');
    
    socialLinks.forEach((link, index) => {
        link.style.animationDelay = `${index * 0.2}s`;
    });
}

// Smooth appearance for elements
function smoothAppear() {
    const elements = document.querySelectorAll('section');
    
    elements.forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(20px)';
        element.style.transition = 'all 0.6s ease';
    });
    
    setTimeout(() => {
        elements.forEach((element, index) => {
            setTimeout(() => {
                element.style.opacity = '1';
                element.style.transform = 'translateY(0)';
            }, index * 200);
        });
    }, 100);
}

// Initialize all animations
document.addEventListener('DOMContentLoaded', function() {
    addFloatingAnimation();
    
    const projectCards = document.querySelectorAll('.project-card');
    projectCards.forEach((card, index) => {
        card.style.transitionDelay = `${index * 0.1}s`;
    });
    
    const expertiseItems = document.querySelectorAll('.expertise-item');
    expertiseItems.forEach((item, index) => {
        item.style.transitionDelay = `${index * 0.1}s`;
    });
    
    const contactItems = document.querySelectorAll('.contact-item');
    contactItems.forEach((item, index) => {
        item.style.transitionDelay = `${index * 0.1}s`;
    });
});

// Performance optimization: throttle scroll events
function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    }
}

const throttledScroll = throttle(function() {
    revealOnScroll();
}, 100);

window.addEventListener('scroll', throttledScroll);