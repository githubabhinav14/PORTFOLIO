document.addEventListener('DOMContentLoaded', function() {
    // Initialize EmailJS with your Public Key
    try {
        emailjs.init('64eb5Xkc61yX_rmFe');
    } catch (error) {
        console.error('EmailJS initialization failed:', error);
    }
    
    // Theme Toggle
    function toggleTheme() {
        document.body.classList.toggle('dark-mode');
        const isDark = document.body.classList.contains('dark-mode');
        localStorage.setItem('theme', isDark ? 'dark' : 'light');
        const themeIcon = document.querySelector('.theme-toggle i');
        if (themeIcon) {
            themeIcon.className = `fas fa-${isDark ? 'sun' : 'moon'}`;
        }
    }
    
    // Load saved theme
    if (localStorage.getItem('theme') === 'dark') {
        document.body.classList.add('dark-mode');
        const themeIcon = document.querySelector('.theme-toggle i');
        if (themeIcon) themeIcon.className = 'fas fa-sun';
    }
    
    const themeButton = document.querySelector('.theme-toggle');
    if (themeButton) {
        themeButton.addEventListener('click', toggleTheme);
    }
    
    // Mobile menu toggle
    const hamburger = document.querySelector('.hamburger');
    const mobileMenu = document.querySelector('.mobile-menu');
    
    if (hamburger && mobileMenu) {
        hamburger.addEventListener('click', function() {
            mobileMenu.classList.toggle('active');
            hamburger.classList.toggle('active');
            const isExpanded = hamburger.classList.contains('active');
            hamburger.setAttribute('aria-expanded', isExpanded);
        });
    }
    
    // Navigation links
    const navLinks = document.querySelectorAll('.nav-link, .mobile-nav-link:not(.download-cv)');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetSection = this.getAttribute('data-section');
            scrollToSection(targetSection);
            
            // Close mobile menu if open
            if (mobileMenu && hamburger) {
                mobileMenu.classList.remove('active');
                hamburger.classList.remove('active');
                hamburger.setAttribute('aria-expanded', 'false');
            }
            
            // Update active link
            updateActiveNavLink(targetSection);
        });
        
        // Keyboard navigation for mobile menu
        link.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                const targetSection = this.getAttribute('data-section');
                scrollToSection(targetSection);
                if (mobileMenu && hamburger) {
                    mobileMenu.classList.remove('active');
                    hamburger.classList.remove('active');
                    hamburger.setAttribute('aria-expanded', 'false');
                }
                updateActiveNavLink(targetSection);
            }
        });
    });
    
    // Scroll indicator handling
    const scrollIndicator = document.querySelector('.scroll-indicator');
    if (scrollIndicator) {
        // Click event
        scrollIndicator.addEventListener('click', function() {
            scrollIndicator.classList.add('disappear');
            scrollToSection('about');
        });
        
        // Keyboard navigation
        scrollIndicator.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                scrollIndicator.classList.add('disappear');
                scrollToSection('about');
            }
        });
    }
    
    // Scroll spy for navigation
    const throttledScrollSpy = throttle(function() {
        const sections = ['home', 'about', 'projects', 'achievements', 'education', 'testimonials', 'contact'];
        const scrollPos = window.scrollY + 100; // Offset for navbar height
        
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
    }, 100);
    
    window.addEventListener('scroll', throttledScrollSpy);
    
    // Intersection Observer for animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target); // Unobserve after animation to improve performance
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
        const chartData = {
            labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
            datasets: [
                {
                    label: 'Typing Speed (WPM)',
                    data: [30, 45, 60, 75],
                    borderColor: '#7c3aed',
                    backgroundColor: 'rgba(124, 58, 237, 0.2)',
                    fill: true,
                    tension: 0.4
                },
                {
                    label: 'Typing Accuracy (%)',
                    data: [85, 90, 92, 95],
                    borderColor: '#10b981',
                    backgroundColor: 'rgba(16, 185, 129, 0.2)',
                    fill: true,
                    tension: 0.4,
                    hidden: true
                }
            ]
        };

        try {
            window.typingChart = new Chart(ctx, {
                type: 'line',
                data: chartData,
                options: {
                    responsive: true,
                    scales: {
                        y: { beginAtZero: true }
                    },
                    plugins: {
                        tooltip: { mode: 'index', intersect: false },
                        legend: {
                            onClick: (e, legendItem, legend) => {
                                const index = legendItem.datasetIndex;
                                const ci = legend.chart;
                                ci.data.datasets.forEach((ds, i) => {
                                    ds.hidden = i !== index;
                                });
                                ci.update();
                            }
                        }
                    }
                }
            });
        } catch (error) {
            console.error('Chart initialization failed:', error);
        }
    }
    
    // Contact form handling
    const contactForm = document.getElementById('contactForm');
    const toastNotification = document.getElementById('toastNotification');
    
    if (contactForm && toastNotification) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const formData = new FormData(this);
            const name = formData.get('name').trim();
            const email = formData.get('email').trim();
            const message = formData.get('message').trim();
            const honeypot = formData.get('honeypot')?.trim() || '';
            
            // Validation
            if (honeypot) {
                showToast('Spam detected!', false);
                return;
            }
            
            if (name.length < 2) {
                showToast('Name must be at least 2 characters long.', false);
                return;
            }
            
            if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
                showToast('Please enter a valid email address.', false);
                return;
            }
            
            if (message.length < 10) {
                showToast('Message must be at least 10 characters long.', false);
                return;
            }
            
            const submitBtn = this.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerHTML;
            
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
            submitBtn.disabled = true;
            
            emailjs.send('service_lt5mzf3', 'template_4odreih', {
                name,
                email,
                message
            }).then(() => {
                this.reset();
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
                showToast('Message Sent! I\'ll get back to you soon.', true);
            }).catch(error => {
                console.error('EmailJS send failed:', error);
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
                showToast('Failed to send message. Please try again.', false);
            });
        });
    }
    
    // Image and certificate popup for project, achievement, and testimonial images
    document.querySelectorAll('.project-image, .certificate-image, .certificate-view, .testimonial-image').forEach(item => {
        item.addEventListener('click', () => {
            const src = item.getAttribute('data-src') || item.src;
            const alt = item.alt || 'Image';
            if (src && !src.endsWith('.pdf')) { // Only open popups for non-PDF files
                const popup = document.createElement('div');
                popup.classList.add('popup');
                popup.innerHTML = `
                    <img src="${src}" alt="${alt}">
                    <span class="close-btn">✖</span>
                `;
                document.body.appendChild(popup);
                
                const closeBtn = popup.querySelector('.close-btn');
                if (closeBtn) {
                    closeBtn.addEventListener('click', () => popup.remove());
                }
                
                // Close popup on click outside image
                popup.addEventListener('click', (e) => {
                    if (e.target === popup) {
                        popup.remove();
                    }
                });
                
                // Close popup with Escape key
                document.addEventListener('keydown', function closeOnEsc(e) {
                    if (e.key === 'Escape') {
                        popup.remove();
                        document.removeEventListener('keydown', closeOnEsc);
                    }
                });
            }
        });
    });

    // Testimonial slider functionality
    const testimonialsTrack = document.querySelector('.testimonials-track');
    const testimonialCards = document.querySelectorAll('.testimonial-card');
    const prevBtn = document.querySelector('.testimonials-slider .prev-btn');
    const nextBtn = document.querySelector('.testimonials-slider .next-btn');
    
    if (testimonialsTrack && prevBtn && nextBtn && testimonialCards.length > 0) {
        let currentIndex = 0;
        let autoScrollInterval = null;
        const autoScrollDelay = 5000; // 5 seconds
        
        function updateSlider() {
            const isMobile = window.innerWidth < 768;
            const cardsPerView = isMobile ? 1 : 3;
            const maxIndex = Math.max(0, testimonialCards.length - cardsPerView);
            const cardWidth = testimonialCards[0].offsetWidth + parseInt(getComputedStyle(testimonialCards[0]).marginRight || 0);
            
            if (currentIndex > maxIndex) currentIndex = maxIndex;
            if (currentIndex < 0) currentIndex = 0;
            
            testimonialsTrack.style.transform = `translateX(-${currentIndex * cardWidth}px)`;
            
            // Update active card class
            testimonialCards.forEach((card, index) => {
                card.classList.toggle('active', Math.floor(index / cardsPerView) === currentIndex / cardsPerView);
            });
            
            prevBtn.disabled = currentIndex === 0;
            nextBtn.disabled = currentIndex >= maxIndex;
        }
        
        function goToSlide(index) {
            currentIndex = index;
            updateSlider();
        }
        
        function startAutoScroll() {
            autoScrollInterval = setInterval(() => {
                currentIndex++;
                const isMobile = window.innerWidth < 768;
                const cardsPerView = isMobile ? 1 : 3;
                const maxIndex = Math.max(0, testimonialCards.length - cardsPerView);
                if (currentIndex > maxIndex) currentIndex = 0;
                updateSlider();
            }, autoScrollDelay);
        }
        
        function stopAutoScroll() {
            clearInterval(autoScrollInterval);
        }
        
        nextBtn.addEventListener('click', () => {
            currentIndex++;
            updateSlider();
            stopAutoScroll();
            startAutoScroll();
        });
        
        prevBtn.addEventListener('click', () => {
            currentIndex--;
            updateSlider();
            stopAutoScroll();
            startAutoScroll();
        });
        
        // Keyboard navigation for slider
        testimonialsTrack.parentElement.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') {
                currentIndex--;
                updateSlider();
                stopAutoScroll();
                startAutoScroll();
            } else if (e.key === 'ArrowRight') {
                currentIndex++;
                updateSlider();
                stopAutoScroll();
                startAutoScroll();
            }
        });
        
        // Pause auto-scroll on hover
        testimonialsTrack.parentElement.addEventListener('mouseenter', stopAutoScroll);
        testimonialsTrack.parentElement.addEventListener('mouseleave', startAutoScroll);
        
        // Update slider on window resize
        window.addEventListener('resize', throttle(() => {
            updateSlider();
        }, 100));
        
        // Initialize slider and auto-scroll
        updateSlider();
        startAutoScroll();
    }

    // Add floating animation to social links
    addFloatingAnimation();
    
    // Smooth appearance for sections
    smoothAppear();
    
    // Initialize all animations
    const projectCards = document.querySelectorAll('.project-card');
    projectCards.forEach((card, index) => {
        card.style.transitionDelay = `${index * 0.1}s`;
    });
    
    const achievementCards = document.querySelectorAll('.achievement-card');
    achievementCards.forEach((card, index) => {
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
    
    // Reuse testimonialCards for animation
    testimonialCards.forEach((card, index) => {
        card.style.transitionDelay = `${index * 0.2}s`; // Increased delay for more dramatic effect
    });
});

// Function to show toast notification
function showToast(message, isSuccess = true) {
    const toastNotification = document.getElementById('toastNotification');
    if (toastNotification) {
        toastNotification.querySelector('span').textContent = message;
        toastNotification.querySelector('i').className = `fas ${isSuccess ? 'fa-check-circle' : 'fa-exclamation-circle'} toast-icon`;
        toastNotification.style.background = isSuccess 
            ? 'linear-gradient(135deg, #7c3aed, #a855f7)' 
            : 'linear-gradient(135deg, #ef4444, #f87171)';
        
        toastNotification.classList.add('visible');
        
        setTimeout(() => {
            toastNotification.classList.remove('visible');
        }, 3000);
    }
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
        // Update active link after scrolling completes
        setTimeout(() => updateActiveNavLink(sectionId), 500);
    }
}

// Update active navigation
function updateActiveNavLink(activeSection) {
    const allLinks = document.querySelectorAll('.nav-link, .mobile-nav-link');
    allLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('data-section') === activeSection) {
            link.classList.add('active');
        }
    });
}

// Add animation classes to elements
function addAnimationClasses() {
    const heroContent = document.querySelector('.hero-content');
    if (heroContent) heroContent.classList.add('fade-in');
    
    const sectionHeaders = document.querySelectorAll('.section-header');
    sectionHeaders.forEach(header => header.classList.add('fade-in'));
    
    const aboutText = document.querySelector('.about-text');
    const technologies = document.querySelector('.technologies');
    
    if (aboutText) aboutText.classList.add('slide-in-left');
    if (technologies) technologies.classList.add('slide-in-right');
    
    const projectCards = document.querySelectorAll('.project-card');
    projectCards.forEach((card, index) => {
        card.classList.add('fade-in');
        card.style.transitionDelay = `${index * 0.1}s`;
    });
    
    const achievementCards = document.querySelectorAll('.achievement-card');
    achievementCards.forEach((card, index) => {
        card.classList.add('fade-in');
        card.style.transitionDelay = `${index * 0.1}s`;
    });
    
    const educationCards = document.querySelectorAll('.education-card');
    educationCards.forEach((card, index) => {
        card.classList.add('fade-in');
        card.style.transitionDelay = `${index * 0.1}s`;
    });
    
    const testimonialCards = document.querySelectorAll('.testimonial-card');
    testimonialCards.forEach((card, index) => {
        card.classList.add('fade-in');
        card.style.transitionDelay = `${index * 0.2}s`;
    });
    
    const contactInfo = document.querySelector('.contact-info');
    const contactFormContainer = document.querySelector('.contact-form-container');
    
    if (contactInfo) contactInfo.classList.add('slide-in-left');
    if (contactFormContainer) contactFormContainer.classList.add('slide-in-right');
    
    const footerContent = document.querySelector('.footer-content');
    if (footerContent) footerContent.classList.add('fade-in');
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
    const reveals = document.querySelectorAll('.fade-in:not(.visible), .slide-in-left:not(.visible), .slide-in-right:not(.visible)');
    
    reveals.forEach(element => {
        const windowHeight = window.innerHeight;
        const elementTop = element.getBoundingClientRect().top;
        const elementVisible = 150;
        
        if (elementTop < windowHeight - elementVisible) {
            element.classList.add('visible');
        }
    });
}

// Add click effects to buttons
document.addEventListener('click', function(e) {
    if (e.target.classList.contains('btn') || e.target.classList.contains('download-cv')) {
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
        link.style.animation = `float 3s ease-in-out infinite`;
        link.style.animationDelay = `${index * 0.2}s`;
    });
}

// Add keyframes for floating animation
const styleSheet = document.createElement('style');
styleSheet.textContent = `
    @keyframes float {
        0%, 100% { transform: translateY(0); }
        50% { transform: translateY(-10px); }
    }
`;
document.head.appendChild(styleSheet);

// Smooth appearance for sections
function smoothAppear() {
    const sections = document.querySelectorAll('section');
    
    sections.forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(20px)';
        element.style.transition = 'all 0.6s ease';
    });
    
    setTimeout(() => {
        sections.forEach((element, index) => {
            setTimeout(() => {
                element.style.opacity = '1';
                element.style.transform = 'translateY(0)';
            }, index * 100);
        });
    }, 100);
}

// Performance optimization: throttle function
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
    };
}

const throttledScroll = throttle(revealOnScroll, 100);
window.addEventListener('scroll', throttledScroll);