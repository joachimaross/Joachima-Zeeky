// Zeeky AI Assistant - Interactive Web Interface JavaScript

class ZeekyInterface {
    constructor() {
        this.currentSection = 'dashboard';
        this.voiceActive = false;
        this.init();
    }

    init() {
        this.setupNavigation();
        this.setupVoiceInterface();
        this.setupPluginFilters();
        this.setupQuickActions();
        this.setupAnimations();
        this.loadSystemStatus();
    }

    setupNavigation() {
        const navLinks = document.querySelectorAll('.nav-link');
        const sections = document.querySelectorAll('.content-section');

        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetSection = link.getAttribute('href').substring(1);
                this.showSection(targetSection);
                
                // Update active nav link
                navLinks.forEach(nl => nl.classList.remove('active'));
                link.classList.add('active');
            });
        });
    }

    showSection(sectionId) {
        const sections = document.querySelectorAll('.content-section');
        sections.forEach(section => {
            section.classList.remove('active');
        });

        const targetSection = document.getElementById(sectionId);
        if (targetSection) {
            targetSection.classList.add('active');
            this.currentSection = sectionId;
        }
    }

    setupVoiceInterface() {
        const voiceBtn = document.getElementById('voiceBtn');
        const voiceModal = document.getElementById('voiceModal');
        const closeVoice = document.getElementById('closeVoice');

        voiceBtn.addEventListener('click', () => {
            this.openVoiceInterface();
        });

        closeVoice.addEventListener('click', () => {
            this.closeVoiceInterface();
        });

        // Close modal when clicking outside
        voiceModal.addEventListener('click', (e) => {
            if (e.target === voiceModal) {
                this.closeVoiceInterface();
            }
        });

        // Simulate voice recognition
        this.setupVoiceRecognition();
    }

    openVoiceInterface() {
        const voiceModal = document.getElementById('voiceModal');
        voiceModal.style.display = 'block';
        this.voiceActive = true;
        
        // Start voice recognition simulation
        this.simulateVoiceRecognition();
    }

    closeVoiceInterface() {
        const voiceModal = document.getElementById('voiceModal');
        voiceModal.style.display = 'none';
        this.voiceActive = false;
    }

    setupVoiceRecognition() {
        // Simulate voice recognition with Web Speech API
        if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
            const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
            this.recognition = new SpeechRecognition();
            this.recognition.continuous = false;
            this.recognition.interimResults = false;
            this.recognition.lang = 'en-US';

            this.recognition.onresult = (event) => {
                const command = event.results[0][0].transcript.toLowerCase();
                this.processVoiceCommand(command);
            };

            this.recognition.onerror = (event) => {
                console.log('Voice recognition error:', event.error);
            };
        }
    }

    simulateVoiceRecognition() {
        // Simulate voice recognition for demo purposes
        const commands = [
            "Aye Zeeky, turn on the living room lights",
            "Aye Zeeky, schedule a meeting for tomorrow at 2 PM",
            "Aye Zeeky, play some relaxing music",
            "Aye Zeeky, what's the weather like today?",
            "Aye Zeeky, set the thermostat to 72 degrees"
        ];

        let commandIndex = 0;
        const interval = setInterval(() => {
            if (!this.voiceActive) {
                clearInterval(interval);
                return;
            }

            const command = commands[commandIndex % commands.length];
            this.processVoiceCommand(command);
            commandIndex++;
        }, 5000);
    }

    processVoiceCommand(command) {
        console.log('Processing voice command:', command);
        
        // Simulate command processing
        this.showCommandFeedback(command);
        
        // Add to recent activity
        this.addRecentActivity(command);
        
        // Simulate system response
        setTimeout(() => {
            this.showSystemResponse(command);
        }, 1500);
    }

    showCommandFeedback(command) {
        const voiceInterface = document.querySelector('.voice-interface h2');
        const originalText = voiceInterface.textContent;
        
        voiceInterface.textContent = 'Processing...';
        voiceInterface.style.color = '#10B981';
        
        setTimeout(() => {
            voiceInterface.textContent = originalText;
            voiceInterface.style.color = '';
        }, 2000);
    }

    showSystemResponse(command) {
        // Create a temporary notification
        this.showNotification(`Command executed: ${command}`, 'success');
    }

    addRecentActivity(command) {
        const activityList = document.querySelector('.activity-list');
        const activityItem = document.createElement('div');
        activityItem.className = 'activity-item';
        
        const icon = this.getActivityIcon(command);
        const description = this.getActivityDescription(command);
        
        activityItem.innerHTML = `
            <div class="activity-icon">
                <i class="${icon}"></i>
            </div>
            <div class="activity-content">
                <h4>${description}</h4>
                <p>Just now via voice command</p>
            </div>
        `;
        
        activityList.insertBefore(activityItem, activityList.firstChild);
        
        // Remove old activities if more than 5
        const activities = activityList.querySelectorAll('.activity-item');
        if (activities.length > 5) {
            activities[activities.length - 1].remove();
        }
    }

    getActivityIcon(command) {
        if (command.includes('light')) return 'fas fa-lightbulb';
        if (command.includes('meeting') || command.includes('schedule')) return 'fas fa-calendar';
        if (command.includes('music')) return 'fas fa-music';
        if (command.includes('weather')) return 'fas fa-cloud-sun';
        if (command.includes('thermostat') || command.includes('temperature')) return 'fas fa-thermometer-half';
        return 'fas fa-microphone';
    }

    getActivityDescription(command) {
        if (command.includes('light')) return 'Adjusted lighting';
        if (command.includes('meeting') || command.includes('schedule')) return 'Scheduled appointment';
        if (command.includes('music')) return 'Started music playback';
        if (command.includes('weather')) return 'Checked weather conditions';
        if (command.includes('thermostat') || command.includes('temperature')) return 'Adjusted temperature';
        return 'Executed voice command';
    }

    setupPluginFilters() {
        const filterBtns = document.querySelectorAll('.filter-btn');
        const pluginCards = document.querySelectorAll('.plugin-card');

        filterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const category = btn.getAttribute('data-category');
                
                // Update active filter
                filterBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                
                // Filter plugins
                pluginCards.forEach(card => {
                    if (category === 'all' || card.getAttribute('data-category') === category) {
                        card.style.display = 'block';
                        card.style.animation = 'fadeIn 0.3s ease-in-out';
                    } else {
                        card.style.display = 'none';
                    }
                });
            });
        });
    }

    setupQuickActions() {
        const actionBtns = document.querySelectorAll('.action-btn');
        
        actionBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const action = btn.getAttribute('data-action');
                this.handleQuickAction(action);
            });
        });
    }

    handleQuickAction(action) {
        const actions = {
            'smart-home': () => {
                this.showSection('features');
                this.showNotification('Opening Smart Home features...', 'info');
            },
            'productivity': () => {
                this.showSection('plugins');
                this.showNotification('Loading Productivity plugins...', 'info');
            },
            'creative': () => {
                this.showSection('plugins');
                this.showNotification('Opening Creative tools...', 'info');
            },
            'healthcare': () => {
                this.showNotification('Healthcare features coming soon!', 'info');
            },
            'security': () => {
                this.showSection('integrations');
                this.showNotification('Security integrations loaded', 'success');
            },
            'enterprise': () => {
                this.showSection('integrations');
                this.showNotification('Enterprise features activated', 'success');
            }
        };

        if (actions[action]) {
            actions[action]();
        }
    }

    setupAnimations() {
        // Animate status cards on load
        const statusCards = document.querySelectorAll('.status-card');
        statusCards.forEach((card, index) => {
            card.style.animationDelay = `${index * 0.1}s`;
            card.classList.add('animate-in');
        });

        // Animate action buttons
        const actionBtns = document.querySelectorAll('.action-btn');
        actionBtns.forEach((btn, index) => {
            btn.style.animationDelay = `${index * 0.05}s`;
            btn.classList.add('animate-in');
        });
    }

    loadSystemStatus() {
        // Simulate loading system status
        this.updateSystemMetrics();
        
        // Update metrics every 30 seconds
        setInterval(() => {
            this.updateSystemMetrics();
        }, 30000);
    }

    updateSystemMetrics() {
        // Simulate real-time metrics updates
        const metrics = {
            plugins: Math.floor(Math.random() * 200) + 1200,
            devices: Math.floor(Math.random() * 10) + 20,
            commands: Math.floor(Math.random() * 100) + 800
        };

        // Update plugin count
        const pluginCount = document.querySelector('.status-card:nth-child(2) .status-value');
        if (pluginCount) {
            this.animateNumber(pluginCount, metrics.plugins);
        }

        // Update device count
        const deviceCount = document.querySelector('.status-card:nth-child(3) .status-value');
        if (deviceCount) {
            this.animateNumber(deviceCount, metrics.devices);
        }

        // Update command count
        const commandCount = document.querySelector('.status-card:nth-child(4) .status-value');
        if (commandCount) {
            this.animateNumber(commandCount, metrics.commands);
        }
    }

    animateNumber(element, targetValue) {
        const currentValue = parseInt(element.textContent.replace(/,/g, ''));
        const increment = (targetValue - currentValue) / 20;
        let current = currentValue;

        const timer = setInterval(() => {
            current += increment;
            if ((increment > 0 && current >= targetValue) || (increment < 0 && current <= targetValue)) {
                current = targetValue;
                clearInterval(timer);
            }
            element.textContent = Math.floor(current).toLocaleString();
        }, 50);
    }

    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas fa-${this.getNotificationIcon(type)}"></i>
                <span>${message}</span>
            </div>
        `;

        // Add styles
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${this.getNotificationColor(type)};
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 0.5rem;
            box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
            z-index: 3000;
            animation: slideIn 0.3s ease-out;
            max-width: 400px;
        `;

        document.body.appendChild(notification);

        // Remove after 3 seconds
        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease-in';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 3000);
    }

    getNotificationIcon(type) {
        const icons = {
            'success': 'check-circle',
            'error': 'exclamation-circle',
            'warning': 'exclamation-triangle',
            'info': 'info-circle'
        };
        return icons[type] || 'info-circle';
    }

    getNotificationColor(type) {
        const colors = {
            'success': '#10B981',
            'error': '#EF4444',
            'warning': '#F59E0B',
            'info': '#3B82F6'
        };
        return colors[type] || '#3B82F6';
    }
}

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }

    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }

    .animate-in {
        animation: fadeInUp 0.6s ease-out forwards;
        opacity: 0;
        transform: translateY(20px);
    }

    @keyframes fadeInUp {
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }

    .notification-content {
        display: flex;
        align-items: center;
        gap: 0.75rem;
    }

    .notification-content i {
        font-size: 1.25rem;
    }
`;
document.head.appendChild(style);

// Initialize the interface when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new ZeekyInterface();
});

// Add keyboard shortcuts
document.addEventListener('keydown', (e) => {
    // Ctrl/Cmd + K to open voice interface
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        const voiceBtn = document.getElementById('voiceBtn');
        if (voiceBtn) {
            voiceBtn.click();
        }
    }
    
    // Escape to close voice interface
    if (e.key === 'Escape') {
        const voiceModal = document.getElementById('voiceModal');
        if (voiceModal && voiceModal.style.display === 'block') {
            const closeBtn = document.getElementById('closeVoice');
            if (closeBtn) {
                closeBtn.click();
            }
        }
    }
});

// Add service worker for offline functionality
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => {
                console.log('SW registered: ', registration);
            })
            .catch(registrationError => {
                console.log('SW registration failed: ', registrationError);
            });
    });
}