/**
 * ModernOS - Authentication System
 * Handles login, register, and user session management
 */

class AuthSystem {
    constructor() {
        this.users = this.loadUsers();
        this.currentUser = null;
        this.sessionTimeout = 24 * 60 * 60 * 1000; // 24 hours
        
        this.init();
    }
    
    init() {
        this.setupEventListeners();
        this.checkExistingSession();
        this.initializePasswordStrength();
    }
    
    loadUsers() {
        try {
            const users = localStorage.getItem('modernos-users');
            return users ? JSON.parse(users) : this.getDefaultUsers();
        } catch (error) {
            console.error('Failed to load users:', error);
            return this.getDefaultUsers();
        }
    }
    
    getDefaultUsers() {
        return {
            'admin': {
                id: 'admin',
                username: 'admin',
                email: 'admin@modernos.com',
                firstName: 'Admin',
                lastName: 'User',
                password: this.hashPassword('admin123'),
                role: 'admin',
                avatar: null,
                preferences: {
                    theme: 'light',
                    wallpaper: 'gradient-blue',
                    accentColor: '#2563eb'
                },
                createdAt: new Date().toISOString(),
                lastLogin: null
            },
            'user': {
                id: 'user',
                username: 'user',
                email: 'user@modernos.com',
                firstName: 'Regular',
                lastName: 'User',
                password: this.hashPassword('user123'),
                role: 'user',
                avatar: null,
                preferences: {
                    theme: 'light',
                    wallpaper: 'gradient-purple',
                    accentColor: '#9333ea'
                },
                createdAt: new Date().toISOString(),
                lastLogin: null
            },
            'guest': {
                id: 'guest',
                username: 'guest',
                email: 'guest@modernos.com',
                firstName: 'Guest',
                lastName: 'User',
                password: this.hashPassword('guest123'),
                role: 'guest',
                avatar: null,
                preferences: {
                    theme: 'light',
                    wallpaper: 'gradient-green',
                    accentColor: '#16a34a'
                },
                createdAt: new Date().toISOString(),
                lastLogin: null
            }
        };
    }
    
    saveUsers() {
        try {
            localStorage.setItem('modernos-users', JSON.stringify(this.users));
        } catch (error) {
            console.error('Failed to save users:', error);
        }
    }
    
    setupEventListeners() {
        // Form switching
        document.getElementById('show-register').addEventListener('click', (e) => {
            e.preventDefault();
            this.showRegisterForm();
        });
        
        document.getElementById('show-login').addEventListener('click', (e) => {
            e.preventDefault();
            this.showLoginForm();
        });
        
        // Form submissions
        document.getElementById('login-form-element').addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleLogin();
        });
        
        document.getElementById('register-form-element').addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleRegister();
        });
        
        // Password visibility toggles
        document.querySelectorAll('.toggle-password').forEach(button => {
            button.addEventListener('click', (e) => {
                this.togglePasswordVisibility(e.target.closest('button').dataset.target);
            });
        });
        
        // Demo users
        document.querySelectorAll('.demo-user').forEach(button => {
            button.addEventListener('click', (e) => {
                const username = e.currentTarget.dataset.username;
                const password = e.currentTarget.dataset.password;
                this.fillDemoCredentials(username, password);
            });
        });
        
        // Password strength
        document.getElementById('register-password').addEventListener('input', (e) => {
            this.updatePasswordStrength(e.target.value);
        });
        
        // Password confirmation
        document.getElementById('register-confirm-password').addEventListener('input', (e) => {
            this.validatePasswordConfirmation();
        });
        
        // Social login buttons
        document.querySelectorAll('.btn-social').forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                const provider = button.classList.contains('btn-google') ? 'Google' : 'GitHub';
                this.showToast('info', 'Social Login', `${provider} login is not available in demo mode`);
            });
        });
    }
    
    showLoginForm() {
        document.getElementById('login-form').classList.add('active');
        document.getElementById('register-form').classList.remove('active');
        this.clearForms();
    }
    
    showRegisterForm() {
        document.getElementById('register-form').classList.add('active');
        document.getElementById('login-form').classList.remove('active');
        this.clearForms();
    }
    
    clearForms() {
        document.querySelectorAll('input').forEach(input => {
            if (input.type !== 'checkbox') {
                input.value = '';
            } else {
                input.checked = false;
            }
        });
        this.updatePasswordStrength('');
    }
    
    togglePasswordVisibility(targetId) {
        const input = document.getElementById(targetId);
        const button = document.querySelector(`[data-target="${targetId}"]`);
        const icon = button.querySelector('i');
        
        if (input.type === 'password') {
            input.type = 'text';
            icon.className = 'fas fa-eye-slash';
        } else {
            input.type = 'password';
            icon.className = 'fas fa-eye';
        }
    }
    
    fillDemoCredentials(username, password) {
        document.getElementById('login-username').value = username;
        document.getElementById('login-password').value = password;
        this.showLoginForm();
        this.showToast('info', 'Demo Account', `Credentials filled for ${username}`);
    }
    
    initializePasswordStrength() {
        this.updatePasswordStrength('');
    }
    
    updatePasswordStrength(password) {
        const strengthBar = document.querySelector('.strength-fill');
        const strengthText = document.querySelector('.strength-text');
        
        if (!password) {
            strengthBar.className = 'strength-fill';
            strengthBar.style.width = '0%';
            strengthText.textContent = 'Password strength';
            return;
        }
        
        let score = 0;
        let feedback = [];
        
        // Length check
        if (password.length >= 8) score += 1;
        else feedback.push('at least 8 characters');
        
        // Lowercase check
        if (/[a-z]/.test(password)) score += 1;
        else feedback.push('lowercase letters');
        
        // Uppercase check
        if (/[A-Z]/.test(password)) score += 1;
        else feedback.push('uppercase letters');
        
        // Number check
        if (/\d/.test(password)) score += 1;
        else feedback.push('numbers');
        
        // Special character check
        if (/[^A-Za-z0-9]/.test(password)) score += 1;
        else feedback.push('special characters');
        
        // Update UI
        strengthBar.className = 'strength-fill';
        
        if (score <= 2) {
            strengthBar.classList.add('weak');
            strengthText.textContent = 'Weak password';
        } else if (score === 3) {
            strengthBar.classList.add('fair');
            strengthText.textContent = 'Fair password';
        } else if (score === 4) {
            strengthBar.classList.add('good');
            strengthText.textContent = 'Good password';
        } else {
            strengthBar.classList.add('strong');
            strengthText.textContent = 'Strong password';
        }
    }
    
    validatePasswordConfirmation() {
        const password = document.getElementById('register-password').value;
        const confirmPassword = document.getElementById('register-confirm-password').value;
        const confirmInput = document.getElementById('register-confirm-password');
        
        if (confirmPassword && password !== confirmPassword) {
            confirmInput.style.borderColor = '#ef4444';
        } else {
            confirmInput.style.borderColor = '';
        }
    }
    
    async handleLogin() {
        const username = document.getElementById('login-username').value.trim();
        const password = document.getElementById('login-password').value;
        const rememberMe = document.getElementById('remember-me').checked;
        
        if (!username || !password) {
            this.showToast('error', 'Login Failed', 'Please enter both username and password');
            return;
        }
        
        // Find user by username or email
        const user = Object.values(this.users).find(u => 
            u.username.toLowerCase() === username.toLowerCase() || 
            u.email.toLowerCase() === username.toLowerCase()
        );
        
        if (!user || !this.verifyPassword(password, user.password)) {
            this.showToast('error', 'Login Failed', 'Invalid username or password');
            return;
        }
        
        // Update last login
        user.lastLogin = new Date().toISOString();
        this.saveUsers();
        
        // Create session
        this.createSession(user, rememberMe);
        
        this.showToast('success', 'Login Successful', `Welcome back, ${user.firstName}!`);
        
        // Redirect to desktop
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 1500);
    }
    
    async handleRegister() {
        const firstName = document.getElementById('register-firstname').value.trim();
        const lastName = document.getElementById('register-lastname').value.trim();
        const email = document.getElementById('register-email').value.trim();
        const username = document.getElementById('register-username').value.trim();
        const password = document.getElementById('register-password').value;
        const confirmPassword = document.getElementById('register-confirm-password').value;
        const acceptTerms = document.getElementById('accept-terms').checked;
        
        // Validation
        if (!firstName || !lastName || !email || !username || !password || !confirmPassword) {
            this.showToast('error', 'Registration Failed', 'Please fill in all fields');
            return;
        }
        
        if (!acceptTerms) {
            this.showToast('error', 'Registration Failed', 'Please accept the terms of service');
            return;
        }
        
        if (password !== confirmPassword) {
            this.showToast('error', 'Registration Failed', 'Passwords do not match');
            return;
        }
        
        if (password.length < 8) {
            this.showToast('error', 'Registration Failed', 'Password must be at least 8 characters long');
            return;
        }
        
        // Check if username or email already exists
        const existingUser = Object.values(this.users).find(u => 
            u.username.toLowerCase() === username.toLowerCase() || 
            u.email.toLowerCase() === email.toLowerCase()
        );
        
        if (existingUser) {
            this.showToast('error', 'Registration Failed', 'Username or email already exists');
            return;
        }
        
        // Create new user
        const userId = this.generateUserId();
        const newUser = {
            id: userId,
            username: username,
            email: email,
            firstName: firstName,
            lastName: lastName,
            password: this.hashPassword(password),
            role: 'user',
            avatar: null,
            preferences: {
                theme: 'light',
                wallpaper: 'gradient-blue',
                accentColor: '#2563eb'
            },
            createdAt: new Date().toISOString(),
            lastLogin: null
        };
        
        // Save user
        this.users[userId] = newUser;
        this.saveUsers();
        
        this.showToast('success', 'Registration Successful', 'Account created successfully! Please login.');
        
        // Switch to login form
        setTimeout(() => {
            this.showLoginForm();
            document.getElementById('login-username').value = username;
        }, 1500);
    }
    
    createSession(user, rememberMe) {
        const session = {
            userId: user.id,
            username: user.username,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            role: user.role,
            preferences: user.preferences,
            createdAt: new Date().toISOString(),
            expiresAt: new Date(Date.now() + this.sessionTimeout).toISOString()
        };
        
        const storageKey = rememberMe ? 'modernos-session' : 'modernos-session-temp';
        const storage = rememberMe ? localStorage : sessionStorage;
        
        try {
            storage.setItem(storageKey, JSON.stringify(session));
        } catch (error) {
            console.error('Failed to create session:', error);
        }
    }
    
    checkExistingSession() {
        // Check for existing session
        let session = null;
        
        try {
            session = JSON.parse(localStorage.getItem('modernos-session')) ||
                     JSON.parse(sessionStorage.getItem('modernos-session-temp'));
        } catch (error) {
            console.error('Failed to check session:', error);
        }
        
        if (session && new Date(session.expiresAt) > new Date()) {
            // Valid session exists, redirect to desktop
            window.location.href = 'index.html';
        }
    }
    
    generateUserId() {
        return 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }
    
    hashPassword(password) {
        // Simple hash for demo purposes (use proper hashing in production)
        let hash = 0;
        for (let i = 0; i < password.length; i++) {
            const char = password.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash; // Convert to 32-bit integer
        }
        return hash.toString();
    }
    
    verifyPassword(password, hashedPassword) {
        return this.hashPassword(password) === hashedPassword;
    }
    
    showToast(type, title, message) {
        const container = document.getElementById('toast-container');
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        
        const iconMap = {
            success: 'fas fa-check-circle',
            error: 'fas fa-exclamation-circle',
            warning: 'fas fa-exclamation-triangle',
            info: 'fas fa-info-circle'
        };
        
        toast.innerHTML = `
            <i class="${iconMap[type]}"></i>
            <div class="toast-content">
                <div class="toast-title">${title}</div>
                <div class="toast-message">${message}</div>
            </div>
            <button class="toast-close">
                <i class="fas fa-times"></i>
            </button>
        `;
        
        container.appendChild(toast);
        
        // Auto remove after 5 seconds
        setTimeout(() => {
            toast.remove();
        }, 5000);
        
        // Close button
        toast.querySelector('.toast-close').addEventListener('click', () => {
            toast.remove();
        });
    }
    
    // Public API for getting current session
    static getCurrentSession() {
        try {
            const session = JSON.parse(localStorage.getItem('modernos-session')) ||
                           JSON.parse(sessionStorage.getItem('modernos-session-temp'));
            
            if (session && new Date(session.expiresAt) > new Date()) {
                return session;
            }
        } catch (error) {
            console.error('Failed to get current session:', error);
        }
        
        return null;
    }
    
    static logout() {
        localStorage.removeItem('modernos-session');
        sessionStorage.removeItem('modernos-session-temp');
        window.location.href = 'auth.html';
    }
}

// Initialize authentication system
document.addEventListener('DOMContentLoaded', () => {
    new AuthSystem();
});

// Make AuthSystem available globally
window.AuthSystem = AuthSystem;