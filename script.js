tailwind.config = {
    darkMode: 'class',
    theme: {
        fontFamily: {
            sans: ['Inter', 'sans-serif'],
        },
        extend: {
            colors: {
                primary: {
                    light: '#2563eb',
                    dark: '#3b82f6'
                },
                secondary: {
                    light: '#7c3aed',
                    dark: '#8b5cf6'
                }
            },
            animation: {
                'float': 'float 4s ease-in-out infinite',
                'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite'
            },
            keyframes: {
                float: {
                    '0%, 100%': { transform: 'translateY(0px)' },
                    '50%': { transform: 'translateY(-15px)' }
                }
            }
        }
    }
}

// Check for logged in user on page load
document.addEventListener('DOMContentLoaded', () => {
    checkAuthState();
    initializeAnimations();
});

// Authentication state management
function checkAuthState() {
    const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));
    const authButtons = document.getElementById('auth-buttons');
    const userProfile = document.getElementById('user-profile');
    const mobileAuthButtons = document.getElementById('mobile-auth-buttons');
    const mobileUserProfile = document.getElementById('mobile-user-profile');

    if (loggedInUser) {
        // Hide auth buttons, show user profile
        authButtons.classList.add('hidden');
        userProfile.classList.remove('hidden');
        mobileAuthButtons.classList.add('hidden');
        mobileUserProfile.classList.remove('hidden');

        // Update user info
        const userInitial = loggedInUser.firstName.charAt(0).toUpperCase();
        const userName = `${loggedInUser.firstName} ${loggedInUser.lastName}`;
        
        document.getElementById('user-initial').textContent = userInitial;
        document.getElementById('user-name').textContent = userName;
        document.getElementById('mobile-user-initial').textContent = userInitial;
        document.getElementById('mobile-user-name').textContent = userName;
    } else {
        // Show auth buttons, hide user profile
        authButtons.classList.remove('hidden');
        userProfile.classList.add('hidden');
        mobileAuthButtons.classList.remove('hidden');
        mobileUserProfile.classList.add('hidden');
    }
}

// Profile dropdown functionality
const profileDropdownBtn = document.getElementById('profile-dropdown-btn');
const profileDropdown = document.getElementById('profile-dropdown');

if (profileDropdownBtn && profileDropdown) {
    profileDropdownBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        profileDropdown.classList.toggle('hidden');
    });

    // Close dropdown when clicking outside
    document.addEventListener('click', (e) => {
        if (!profileDropdown.contains(e.target) && !profileDropdownBtn.contains(e.target)) {
            profileDropdown.classList.add('hidden');
        }
    });
}

// Logout functionality
const logoutBtn = document.getElementById('logout-btn');
const mobileLogoutBtn = document.getElementById('mobile-logout-btn');

function handleLogout() {
    // Show confirmation dialog
    if (confirm('Are you sure you want to logout?')) {
        localStorage.removeItem('loggedInUser');
        
        // Show logout animation/message
        const logoutMessage = document.createElement('div');
        logoutMessage.className = 'fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 transform translate-x-full transition-transform duration-300';
        logoutMessage.innerHTML = '<i class="fas fa-check-circle mr-2"></i>Logged out successfully!';
        document.body.appendChild(logoutMessage);
        
        // Animate in
        setTimeout(() => {
            logoutMessage.style.transform = 'translateX(0)';
        }, 100);
        
        // Animate out and remove
        setTimeout(() => {
            logoutMessage.style.transform = 'translateX(full)';
            setTimeout(() => {
                document.body.removeChild(logoutMessage);
            }, 300);
        }, 2000);
        
        // Update auth state
        checkAuthState();
        
        // Close mobile menu if open
        if (mobileMenu.classList.contains('open')) {
            mobileMenu.style.maxHeight = '0';
            mobileMenu.classList.remove('open');
        }
    }
}

if (logoutBtn) logoutBtn.addEventListener('click', handleLogout);
if (mobileLogoutBtn) mobileLogoutBtn.addEventListener('click', handleLogout);

// Mobile menu toggle
const mobileMenuButton = document.getElementById('mobile-menu-button');
const mobileMenu = document.getElementById('mobile-menu');

mobileMenuButton.addEventListener('click', () => {
    const isOpen = mobileMenu.classList.contains('open');
    mobileMenu.style.maxHeight = isOpen ? '0' : `${mobileMenu.scrollHeight}px`;
    mobileMenu.classList.toggle('open');
    
    // Animate hamburger icon
    const icon = mobileMenuButton.querySelector('i');
    if (isOpen) {
        icon.classList.remove('fa-times');
        icon.classList.add('fa-bars');
    } else {
        icon.classList.remove('fa-bars');
        icon.classList.add('fa-times');
    }
});

// Theme toggle with enhanced animation
const themeToggle = document.getElementById('theme-toggle');
const html = document.documentElement;
const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');

// Check for saved theme preference or use system preference
const currentTheme = localStorage.getItem('theme');
if (currentTheme === 'dark' || (!currentTheme && prefersDarkScheme.matches)) {
    html.classList.add('dark');
    updateThemeIcon(true);
}

function updateThemeIcon(isDark) {
    const moonIcon = themeToggle.querySelector('.fa-moon');
    const sunIcon = themeToggle.querySelector('.fa-sun');
    
    if (isDark) {
        moonIcon.classList.add('hidden');
        sunIcon.classList.remove('hidden');
    } else {
        moonIcon.classList.remove('hidden');
        sunIcon.classList.add('hidden');
    }
}

themeToggle.addEventListener('click', () => {
    // Add rotation animation
    themeToggle.style.transform = 'rotate(180deg)';
    setTimeout(() => {
        themeToggle.style.transform = 'rotate(0deg)';
    }, 300);
    
    html.classList.toggle('dark');
    const isDark = html.classList.contains('dark');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
    updateThemeIcon(isDark);
});

// Enhanced navbar scroll effects
const header = document.querySelector('header');
const homeSection = document.getElementById('home');

function updateNavbar() {
    const scrollPosition = window.scrollY;

    if (scrollPosition > 50) {
        header.classList.add('scrolled');
        header.style.background = 'rgba(255, 255, 255, 0.95)';
        if (html.classList.contains('dark')) {
            header.style.background = 'rgba(17, 24, 39, 0.95)';
        }
    } else {
        header.classList.remove('scrolled');
        header.style.background = 'rgba(255, 255, 255, 0.8)';
        if (html.classList.contains('dark')) {
            header.style.background = 'rgba(17, 24, 39, 0.8)';
        }
    }

    // Show/hide back to top button with animation
    const fabTop = document.getElementById('fab-top');
    if (scrollPosition > 300) {
        fabTop.classList.add('visible');
    } else {
        fabTop.classList.remove('visible');
    }
}

window.addEventListener('scroll', updateNavbar);
updateNavbar(); // Initialize

// Back to top button with smooth animation
document.getElementById('fab-top').addEventListener('click', () => {
    // Add click animation
    const fabTop = document.getElementById('fab-top');
    fabTop.style.transform = 'scale(0.9)';
    setTimeout(() => {
        fabTop.style.transform = 'scale(1)';
    }, 150);
    
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

// Enhanced scroll animation for elements
const animateElements = document.querySelectorAll('.animate-on-scroll');

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animated');

            // Animate skill bars with stagger effect
            if (entry.target.querySelector('.skill-progress')) {
                const skillBars = entry.target.querySelectorAll('.skill-progress');
                skillBars.forEach((bar, index) => {
                    setTimeout(() => {
                        const width = bar.getAttribute('data-width');
                        bar.style.width = width + '%';
                    }, index * 200);
                });
            }

            // Animate project cards with stagger
            if (entry.target.classList.contains('project-card')) {
                const cards = document.querySelectorAll('.project-card');
                const cardIndex = Array.from(cards).indexOf(entry.target);
                entry.target.style.animationDelay = `${cardIndex * 0.1}s`;
            }
        }
    });
}, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
});

animateElements.forEach(element => {
    observer.observe(element);
});

// Enhanced smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();

        // Close mobile menu if open
        if (mobileMenu.classList.contains('open')) {
            mobileMenu.style.maxHeight = '0';
            mobileMenu.classList.remove('open');
            const icon = mobileMenuButton.querySelector('i');
            icon.classList.remove('fa-times');
            icon.classList.add('fa-bars');
        }

        const targetId = this.getAttribute('href');
        const targetElement = document.querySelector(targetId);

        if (targetElement) {
            // Add smooth scroll with offset for fixed header
            const headerHeight = header.offsetHeight;
            const targetPosition = targetElement.offsetTop - headerHeight - 20;
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });

            // Update active nav link with animation
            document.querySelectorAll('.nav-link').forEach(link => {
                link.classList.remove('active-nav');
            });

            if (this.classList.contains('nav-link')) {
                this.classList.add('active-nav');
            }
        }
    });
});

// Enhanced active nav link on scroll
const sections = document.querySelectorAll('section');

window.addEventListener('scroll', () => {
    let current = '';
    const scrollPosition = window.pageYOffset + 100;

    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;

        if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
            current = section.getAttribute('id');
        }
    });

    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active-nav');
        if (link.getAttribute('href') === '#' + current) {
            link.classList.add('active-nav');
        }
    });
});

// Enhanced contact form submission
const contactForm = document.getElementById('contact-form');
const formMessage = document.getElementById('form-message');

contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const formData = new FormData(contactForm);
    const submitButton = contactForm.querySelector('button[type="submit"]');
    const originalButtonText = submitButton.innerHTML;

    try {
        // Show loading state with animation
        submitButton.disabled = true;
        submitButton.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i> Sending...';
        submitButton.style.transform = 'scale(0.98)';

        // Simulate form submission (replace with actual form submission)
        await new Promise(resolve => setTimeout(resolve, 2000));

        // Show success message with animation
        formMessage.textContent = 'Message sent successfully! I will get back to you soon.';
        formMessage.className = 'form-message success';

        // Reset form with animation
        contactForm.reset();
        
        // Add success animation to form
        contactForm.style.transform = 'scale(1.02)';
        setTimeout(() => {
            contactForm.style.transform = 'scale(1)';
        }, 200);

    } catch (error) {
        console.error('Error:', error);
        formMessage.textContent = 'Failed to send message. Please try again later.';
        formMessage.className = 'form-message error';
    } finally {
        // Reset button state with animation
        submitButton.disabled = false;
        submitButton.innerHTML = originalButtonText;
        submitButton.style.transform = 'scale(1)';

        // Hide message after 5 seconds
        setTimeout(() => {
            formMessage.textContent = '';
            formMessage.className = 'form-message';
        }, 5000);
    }
});

// Enhanced View All Projects toggle functionality
const viewAllProjectsBtn = document.getElementById('view-all-projects-btn');
const hiddenProjects = document.querySelectorAll('.hidden-project');

viewAllProjectsBtn.addEventListener('click', (e) => {
    e.preventDefault();
    const isHidden = hiddenProjects[0].style.display === 'none' || hiddenProjects[0].classList.contains('hidden-project');

    // Add button animation
    viewAllProjectsBtn.style.transform = 'scale(0.95)';
    setTimeout(() => {
        viewAllProjectsBtn.style.transform = 'scale(1)';
    }, 150);

    hiddenProjects.forEach((project, index) => {
        if (isHidden) {
            setTimeout(() => {
                project.style.display = 'block';
                project.classList.remove('hidden-project');
                project.style.opacity = '0';
                project.style.transform = 'translateY(20px)';
                
                setTimeout(() => {
                    project.style.opacity = '1';
                    project.style.transform = 'translateY(0)';
                }, 50);
            }, index * 100);
        } else {
            setTimeout(() => {
                project.style.opacity = '0';
                project.style.transform = 'translateY(-20px)';
                
                setTimeout(() => {
                    project.style.display = 'none';
                    project.classList.add('hidden-project');
                }, 300);
            }, index * 50);
        }
    });

    // Update button text with animation
    setTimeout(() => {
        if (isHidden) {
            viewAllProjectsBtn.innerHTML = 'View Less <i class="fas fa-arrow-up ml-2"></i>';
        } else {
            viewAllProjectsBtn.innerHTML = 'View All Projects <i class="fas fa-arrow-right ml-2"></i>';
        }
    }, 200);
});

// Enhanced text rotation for job title
const jobTitleElement = document.getElementById('jobTitle');
const jobTitles = ["Frontend Developer", "Software Engineer", "Data Analyst", "UI/UX Designer"];
let currentJobIndex = 0;

function rotateJobTitle() {
    jobTitleElement.style.opacity = 0;
    jobTitleElement.style.transform = 'translateY(-10px)';
    
    setTimeout(() => {
        currentJobIndex = (currentJobIndex + 1) % jobTitles.length;
        jobTitleElement.textContent = jobTitles[currentJobIndex];
        jobTitleElement.style.opacity = 1;
        jobTitleElement.style.transform = 'translateY(0)';
    }, 300);
}

// Initialize job title rotation
if (jobTitleElement) {
    setInterval(rotateJobTitle, 2000);
    jobTitleElement.style.transition = 'opacity 0.3s ease-in-out, transform 0.3s ease-in-out';
}

// Initialize animations
function initializeAnimations() {
    // Add entrance animations to hero elements
    const heroElements = document.querySelectorAll('#home .animate-on-scroll > *');
    heroElements.forEach((element, index) => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(30px)';
        
        setTimeout(() => {
            element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
        }, index * 200);
    });

    // Add hover effects to social links
    document.querySelectorAll('a[href="#"]').forEach(link => {
        if (link.querySelector('i.fab')) {
            link.addEventListener('mouseenter', function() {
                this.style.transform = 'translateY(-3px) scale(1.1)';
            });
            
            link.addEventListener('mouseleave', function() {
                this.style.transform = 'translateY(0) scale(1)';
            });
        }
    });

    // Add parallax effect to floating elements
    const floatingElements = document.querySelectorAll('.animate-float');
    
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        floatingElements.forEach((element, index) => {
            const rate = scrolled * -0.5 * (index + 1);
            element.style.transform = `translateY(${rate}px)`;
        });
    });
}

// Add loading animation
window.addEventListener('load', () => {
    document.body.classList.add('loaded');
    
    // Remove any loading overlays
    const loader = document.querySelector('.loader');
    if (loader) {
        loader.style.opacity = '0';
        setTimeout(() => {
            loader.remove();
        }, 500);
    }
});

// Add custom cursor effect (optional)
document.addEventListener('mousemove', (e) => {
    const cursor = document.querySelector('.custom-cursor');
    if (cursor) {
        cursor.style.left = e.clientX + 'px';
        cursor.style.top = e.clientY + 'px';
    }
});

// Performance optimization: Debounce scroll events
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Apply debouncing to scroll-heavy functions
window.addEventListener('scroll', debounce(updateNavbar, 10));