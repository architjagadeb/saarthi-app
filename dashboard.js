// Dashboard JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // Initialize dashboard
    initializeDashboard();
    
    function initializeDashboard() {
        // Load user data
        loadUserData();
        
        // Initialize sidebar
        initializeSidebar();
        
        // Initialize stats animation
        initializeStatsAnimation();
        
        // Initialize profile editing
        initializeProfileEditing();
        
        // Initialize quick actions
        initializeQuickActions();

        // Initialize mobile menu
        initializeMobileMenu();

        // Initialize community help section
        initializeCommunityHelp();

        // Set active navigation
        setActiveNavigation();
    }
    
    function loadUserData() {
        // Simulate loading user data from localStorage or API
        const userData = {
            name: 'Priya Sharma',
            email: 'priya.sharma@example.com',
            location: 'Bihar, India',
            stats: {
                campaignsCreated: 12,
                underReview: 3,
                audioBroadcasted: 847,
                estimatedListeners: 15420
            },
            notifications: {
                email: true,
                campaignUpdates: true,
                weeklyReports: false
            }
        };
        
        // Store in localStorage for persistence
        localStorage.setItem('saarthiUserData', JSON.stringify(userData));
        
        // Update UI with user data
        updateUserInterface(userData);
    }
    
    function updateUserInterface(userData) {
        // Update welcome message
        const userNameElement = document.getElementById('user-name');
        if (userNameElement) {
            userNameElement.textContent = userData.name.split(' ')[0];
        }
        
        // Update profile form
        const profileName = document.getElementById('profile-name');
        const profileEmail = document.getElementById('profile-email');
        const profileLocation = document.getElementById('profile-location');
        
        if (profileName) profileName.value = userData.name;
        if (profileEmail) profileEmail.value = userData.email;
        if (profileLocation) profileLocation.value = userData.location;
        
        // Update notification preferences
        updateNotificationToggles(userData.notifications);
    }
    
    function updateNotificationToggles(notifications) {
        const toggles = document.querySelectorAll('.toggle-switch input');
        toggles.forEach((toggle, index) => {
            const keys = Object.keys(notifications);
            if (keys[index]) {
                toggle.checked = notifications[keys[index]];
            }
        });
    }
    
    function initializeSidebar() {
        const sidebar = document.getElementById('sidebar');
        const sidebarToggle = document.getElementById('sidebar-toggle');
        const overlay = document.getElementById('overlay');
        
        // Desktop sidebar toggle
        if (sidebarToggle) {
            sidebarToggle.addEventListener('click', () => {
                sidebar.classList.toggle('collapsed');
                
                // Save sidebar state
                const isCollapsed = sidebar.classList.contains('collapsed');
                localStorage.setItem('sidebarCollapsed', isCollapsed);
            });
        }
        
        // Load saved sidebar state
        const savedState = localStorage.getItem('sidebarCollapsed');
        if (savedState === 'true') {
            sidebar.classList.add('collapsed');
        }
        
        // Close sidebar when clicking overlay
        if (overlay) {
            overlay.addEventListener('click', () => {
                sidebar.classList.remove('mobile-open');
                overlay.classList.remove('active');
            });
        }
        
        // Handle navigation clicks
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                // Don't prevent default for external links
                if (link.getAttribute('href').startsWith('#')) {
                    e.preventDefault();
                }
                
                // Update active state
                navLinks.forEach(l => l.classList.remove('active'));
                link.classList.add('active');
                
                // Close mobile menu
                if (window.innerWidth <= 768) {
                    sidebar.classList.remove('mobile-open');
                    overlay.classList.remove('active');
                }
                
                // Handle page navigation
                const page = link.getAttribute('data-page');
                if (page) {
                    handlePageNavigation(page);
                }
            });
        });
        
        // Sign out functionality
        const signOutBtn = document.getElementById('sign-out');
        if (signOutBtn) {
            signOutBtn.addEventListener('click', (e) => {
                e.preventDefault();
                handleSignOut();
            });
        }
    }
    
    function initializeMobileMenu() {
        const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
        const sidebar = document.getElementById('sidebar');
        const overlay = document.getElementById('overlay');
        
        if (mobileMenuToggle) {
            mobileMenuToggle.addEventListener('click', () => {
                sidebar.classList.toggle('mobile-open');
                overlay.classList.toggle('active');
            });
        }
    }
    
    function initializeStatsAnimation() {
        const statNumbers = document.querySelectorAll('.stat-number');
        
        // Animate numbers on page load
        statNumbers.forEach(stat => {
            const target = parseInt(stat.getAttribute('data-target'));
            animateNumber(stat, target);
        });
    }
    
    function animateNumber(element, target) {
        const duration = 2000; // 2 seconds
        const increment = target / (duration / 16); // 60fps
        let current = 0;
        
        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                current = target;
                clearInterval(timer);
            }
            
            // Format number with commas for large numbers
            element.textContent = Math.floor(current).toLocaleString();
        }, 16);
    }
    
    function initializeProfileEditing() {
        const editBtn = document.getElementById('edit-profile');
        const profileInputs = document.querySelectorAll('#profile-name, #profile-email, #profile-location');
        let isEditing = false;
        
        if (editBtn) {
            editBtn.addEventListener('click', () => {
                isEditing = !isEditing;
                
                if (isEditing) {
                    // Enable editing
                    profileInputs.forEach(input => {
                        input.removeAttribute('readonly');
                        input.style.background = 'var(--white)';
                        input.style.color = 'var(--text-dark)';
                    });
                    editBtn.textContent = 'Save';
                    editBtn.classList.remove('btn-secondary');
                    editBtn.classList.add('btn-primary');
                } else {
                    // Save changes
                    profileInputs.forEach(input => {
                        input.setAttribute('readonly', true);
                        input.style.background = 'var(--background-light)';
                        input.style.color = 'var(--text-gray)';
                    });
                    editBtn.textContent = 'Edit';
                    editBtn.classList.remove('btn-primary');
                    editBtn.classList.add('btn-secondary');
                    
                    // Save to localStorage
                    saveProfileData();
                    showNotification('Profile updated successfully!', 'success');
                }
            });
        }
        
        // Handle notification toggle changes
        const notificationToggles = document.querySelectorAll('.toggle-switch input');
        notificationToggles.forEach(toggle => {
            toggle.addEventListener('change', () => {
                saveNotificationPreferences();
                showNotification('Notification preferences updated!', 'success');
            });
        });
    }
    
    function saveProfileData() {
        const userData = JSON.parse(localStorage.getItem('saarthiUserData') || '{}');
        
        userData.name = document.getElementById('profile-name').value;
        userData.email = document.getElementById('profile-email').value;
        userData.location = document.getElementById('profile-location').value;
        
        localStorage.setItem('saarthiUserData', JSON.stringify(userData));
        
        // Update welcome message
        const userNameElement = document.getElementById('user-name');
        if (userNameElement) {
            userNameElement.textContent = userData.name.split(' ')[0];
        }
    }
    
    function saveNotificationPreferences() {
        const userData = JSON.parse(localStorage.getItem('saarthiUserData') || '{}');
        const toggles = document.querySelectorAll('.toggle-switch input');
        
        userData.notifications = {
            email: toggles[0]?.checked || false,
            campaignUpdates: toggles[1]?.checked || false,
            weeklyReports: toggles[2]?.checked || false
        };
        
        localStorage.setItem('saarthiUserData', JSON.stringify(userData));
    }
    
    function initializeQuickActions() {
        const actionCards = document.querySelectorAll('.action-card');

        actionCards.forEach(card => {
            card.addEventListener('click', () => {
                const actionText = card.querySelector('span').textContent;
                handleQuickAction(actionText);
            });
        });

        // Welcome banner button
        const welcomeBtn = document.querySelector('.welcome-actions .btn');
        if (welcomeBtn) {
            welcomeBtn.addEventListener('click', () => {
                window.location.href = 'start-campaign.html';
            });
        }
    }

    function initializeCommunityHelp() {
        // Initialize help navigation
        const helpNavBtns = document.querySelectorAll('.help-nav-btn');
        const helpSections = document.querySelectorAll('.help-section');

        helpNavBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                if (btn.disabled) return;

                const targetSection = btn.getAttribute('data-section');
                showHelpSection(targetSection);

                // Update active state
                helpNavBtns.forEach(b => b.setAttribute('aria-selected', 'false'));
                btn.setAttribute('aria-selected', 'true');
            });
        });

        // Initialize FAQ accordion
        initializeFAQ();

        // Initialize feedback form
        initializeFeedbackForm();

        // Show welcome section by default
        showHelpSection('welcome');
    }

    function showHelpSection(sectionName) {
        const helpSections = document.querySelectorAll('.help-section');

        helpSections.forEach(section => {
            section.classList.remove('active');
        });

        const targetSection = document.getElementById(`${sectionName}-section`);
        if (targetSection) {
            targetSection.classList.add('active');
        }
    }

    function initializeFAQ() {
        const faqQuestions = document.querySelectorAll('.faq-question');

        faqQuestions.forEach(question => {
            question.addEventListener('click', () => {
                const isExpanded = question.getAttribute('aria-expanded') === 'true';
                const answer = question.nextElementSibling;

                // Close all other FAQ items
                faqQuestions.forEach(q => {
                    if (q !== question) {
                        q.setAttribute('aria-expanded', 'false');
                        q.nextElementSibling.classList.remove('open');
                    }
                });

                // Toggle current item
                question.setAttribute('aria-expanded', !isExpanded);
                answer.classList.toggle('open', !isExpanded);
            });
        });
    }

    function initializeFeedbackForm() {
        const feedbackForm = document.getElementById('feedback-form');
        const feedbackSuccess = document.getElementById('feedback-success');

        if (feedbackForm) {
            feedbackForm.addEventListener('submit', (e) => {
                e.preventDefault();

                // Get form data
                const formData = new FormData(feedbackForm);
                const feedbackData = {
                    name: formData.get('name'),
                    email: formData.get('email'),
                    type: formData.get('type'),
                    message: formData.get('message')
                };

                // Simulate form submission
                submitFeedback(feedbackData);
            });
        }
    }

    function submitFeedback(data) {
        const feedbackForm = document.getElementById('feedback-form');
        const feedbackSuccess = document.getElementById('feedback-success');
        const submitBtn = feedbackForm.querySelector('button[type="submit"]');

        // Show loading state
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Submitting...';

        // Simulate API call
        setTimeout(() => {
            // Hide form and show success message
            feedbackForm.style.display = 'none';
            feedbackSuccess.style.display = 'block';

            // Store feedback in localStorage (simulate backend)
            const existingFeedback = JSON.parse(localStorage.getItem('saarthiFeedback') || '[]');
            existingFeedback.push({
                ...data,
                timestamp: new Date().toISOString(),
                id: Date.now()
            });
            localStorage.setItem('saarthiFeedback', JSON.stringify(existingFeedback));

            // Reset form after 5 seconds
            setTimeout(() => {
                feedbackForm.style.display = 'block';
                feedbackSuccess.style.display = 'none';
                feedbackForm.reset();
                submitBtn.disabled = false;
                submitBtn.innerHTML = '<i class="fas fa-paper-plane"></i> Submit Feedback';
            }, 5000);

            showNotification('Thank you for your feedback!', 'success');
        }, 2000);
    }
    
    function handleQuickAction(action) {
        switch (action) {
            case 'Start New Campaign':
                window.location.href = 'start-campaign.html';
                break;
            case 'Share via WhatsApp':
                showNotification('WhatsApp sharing feature coming soon!', 'info');
                break;
            case 'View Analytics':
                showNotification('Analytics dashboard coming soon!', 'info');
                break;
            case 'Download Report':
                showNotification('Report download feature coming soon!', 'info');
                break;
            default:
                showNotification('Feature coming soon!', 'info');
        }
    }
    
    function handlePageNavigation(page) {
        // Handle different page navigations
        switch (page) {
            case 'dashboard':
                // Already on dashboard
                break;
            case 'my-campaigns':
                showNotification('My Campaigns page coming soon!', 'info');
                break;
            case 'start-campaign':
                window.location.href = 'start-campaign.html';
                break;
            case 'explore-campaigns':
                window.location.href = 'campaigns.html';
                break;
            case 'profile':
                // Scroll to profile section
                document.querySelector('.profile-settings').scrollIntoView({ 
                    behavior: 'smooth' 
                });
                break;
            case 'inbox':
                showNotification('Inbox feature coming soon!', 'info');
                break;
        }
    }
    
    function setActiveNavigation() {
        // Set active navigation based on current page
        const currentPage = window.location.pathname.split('/').pop();
        const navLinks = document.querySelectorAll('.nav-link');
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            
            const href = link.getAttribute('href');
            if (href === currentPage || 
                (currentPage === 'dashboard.html' && link.getAttribute('data-page') === 'dashboard')) {
                link.classList.add('active');
            }
        });
    }
    
    function handleSignOut() {
        if (confirm('Are you sure you want to sign out?')) {
            // Clear user data
            localStorage.removeItem('saarthiUserData');
            localStorage.removeItem('sidebarCollapsed');
            
            // Redirect to home page
            window.location.href = 'index.html';
        }
    }
    
    function showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.style.cssText = `
            position: fixed;
            top: 2rem;
            right: 2rem;
            padding: 1rem 1.5rem;
            border-radius: 0.5rem;
            color: white;
            font-weight: 500;
            z-index: 10000;
            transform: translateX(100%);
            transition: transform 0.3s ease;
            max-width: 300px;
            box-shadow: var(--shadow-lg);
        `;
        
        // Set background color based on type
        switch (type) {
            case 'success':
                notification.style.background = 'var(--success)';
                break;
            case 'error':
                notification.style.background = 'var(--error)';
                break;
            case 'warning':
                notification.style.background = 'var(--warning)';
                break;
            default:
                notification.style.background = 'var(--info)';
        }
        
        notification.textContent = message;
        
        // Add to page
        document.body.appendChild(notification);
        
        // Animate in
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);
        
        // Remove after 3 seconds
        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 3000);
    }
    
    // Handle window resize
    window.addEventListener('resize', () => {
        const sidebar = document.getElementById('sidebar');
        const overlay = document.getElementById('overlay');
        
        if (window.innerWidth > 768) {
            sidebar.classList.remove('mobile-open');
            overlay.classList.remove('active');
        }
    });
    
    // Handle campaign item clicks
    const campaignItems = document.querySelectorAll('.campaign-item');
    campaignItems.forEach(item => {
        item.addEventListener('click', () => {
            const campaignTitle = item.querySelector('.campaign-title').textContent;
            showNotification(`Opening campaign: ${campaignTitle}`, 'info');
        });
    });
    
    // Handle keyboard navigation for help section
    document.addEventListener('keydown', (e) => {
        if (e.target.closest('.help-container')) {
            const helpNavBtns = document.querySelectorAll('.help-nav-btn:not(:disabled)');
            const currentIndex = Array.from(helpNavBtns).findIndex(btn =>
                btn.getAttribute('aria-selected') === 'true'
            );

            if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
                e.preventDefault();
                const nextIndex = (currentIndex + 1) % helpNavBtns.length;
                helpNavBtns[nextIndex].click();
                helpNavBtns[nextIndex].focus();
            } else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
                e.preventDefault();
                const prevIndex = currentIndex === 0 ? helpNavBtns.length - 1 : currentIndex - 1;
                helpNavBtns[prevIndex].click();
                helpNavBtns[prevIndex].focus();
            }
        }
    });
    
    // Initialize tooltips for collapsed sidebar
    function initializeTooltips() {
        const navLinks = document.querySelectorAll('.nav-link');
        
        navLinks.forEach(link => {
            const text = link.querySelector('.nav-text')?.textContent;
            if (text) {
                link.setAttribute('title', text);
            }
        });
    }
    
    initializeTooltips();
});
