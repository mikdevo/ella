document.addEventListener('DOMContentLoaded', function() {
    if (window.requestIdleCallback) {
        requestIdleCallback(function() {
            initPortfolio();
            initScrollAnimations();
            initLanguageSwitcher();
        });
    } else {
        setTimeout(function() {
            initPortfolio();
            initScrollAnimations();
            initLanguageSwitcher();
        }, 100);
    }
    
    document.getElementById('currentYear').textContent = new Date().getFullYear();
    
    setTimeout(() => {
        document.body.classList.add('page-loaded');
    }, 400);
});

function initPortfolio() {
    document.querySelector('.profile-name').textContent = config.name;
    document.querySelector('.profile-tagline').textContent = config.tagline;
    
    const bioElement = document.querySelector('.bio-text');
    if (bioElement) {
        bioElement.innerHTML = config.shortBio.replace(/\n/g, '<br>');
    }
    
    const profileImage = document.getElementById('profileImage');
    if (profileImage) {
        profileImage.src = config.profileImage;
        profileImage.alt = config.name;
    }
    
    const discordLink = document.getElementById('discordLink');
    if (discordLink) discordLink.href = config.social.discord.inviteUrl;
    
    const spotifyLink = document.getElementById('spotifyLink');
    if (spotifyLink) spotifyLink.href = config.social.spotify.url;
    
    const instagramLink = document.getElementById('instagramLink');
    if (instagramLink) instagramLink.href = config.social.instagram.url;
    
    applyCustomColors();
}

function applyCustomColors() {
    const root = document.documentElement;
    
    root.style.setProperty('--primary-color', config.colors.primary);
    root.style.setProperty('--secondary-color', config.colors.secondary);
    root.style.setProperty('--accent-color', config.colors.accent);
    root.style.setProperty('--background-color', config.colors.background);
    root.style.setProperty('--text-color', config.colors.text);
    
    if (config.colors.cardBackground) {
        root.style.setProperty('--card-background', config.colors.cardBackground);
    }
}

function initScrollAnimations() {
    const sections = document.querySelectorAll('.section');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate');
                observer.unobserve(entry.target);
            }
        });
    }, { 
        threshold: 0.1,
        rootMargin: '50px'
    });
    
    sections.forEach(section => {
        observer.observe(section);
    });
    
    const socialIcons = document.querySelectorAll('.social-icon');
    socialIcons.forEach(icon => {
        icon.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-5px) scale(1.1)';
        }, { passive: true });
        
        icon.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        }, { passive: true });
    });
}

function initLanguageSwitcher() {
    const langToggle = document.getElementById('langToggle');
    const languageMenu = document.getElementById('languageMenu');
    const languageItems = document.querySelectorAll('.language-menu-item');
    
    if (!langToggle || !languageMenu) return;
    
    langToggle.addEventListener('click', function(e) {
        e.stopPropagation();
        languageMenu.classList.toggle('active');
    });
    
    document.addEventListener('click', function(e) {
        if (languageMenu.classList.contains('active') && !languageMenu.contains(e.target)) {
            languageMenu.classList.remove('active');
        }
    }, { passive: true });
    
    languageItems.forEach(item => {
        item.addEventListener('click', function() {
            const lang = this.getAttribute('data-lang');
            
            languageItems.forEach(i => i.classList.remove('active'));
            this.classList.add('active');
            
            switchLanguage(lang);
            languageMenu.classList.remove('active');
        });
    });
    
    const currentLang = localStorage.getItem('ellaLanguage') || 'en';
    switchLanguage(currentLang);
    
    const activeLangItem = document.querySelector(`.language-menu-item[data-lang="${currentLang}"]`);
    if (activeLangItem) {
        languageItems.forEach(i => i.classList.remove('active'));
        activeLangItem.classList.add('active');
    }
}

function switchLanguage(lang) {
    if (!config.translations || !config.translations[lang]) return;
    
    localStorage.setItem('ellaLanguage', lang);
    
    const translations = config.translations[lang];
    
    if (lang === 'ar') {
        document.documentElement.setAttribute('lang', 'ar');
        document.documentElement.style.direction = 'rtl';
    } else {
        document.documentElement.setAttribute('lang', 'en');
        document.documentElement.style.direction = 'ltr';
    }
    
    const elements = document.querySelectorAll('[data-i18n]');
    const fragment = document.createDocumentFragment();
    
    elements.forEach(element => {
        const key = element.getAttribute('data-i18n');
        if (translations[key]) {
            if (key === 'shortBio') {
                element.innerHTML = translations[key].replace(/\n/g, '<br>');
            } else {
                element.textContent = translations[key];
            }
        }
    });
    
    const welcomeContent = document.querySelector('.welcome-content');
    if (welcomeContent) {
        welcomeContent.innerHTML = `
            <p>${translations.welcomeP1 || ''}</p>
            <p>${translations.welcomeP2 || ''}</p>
            <p>${translations.welcomeP3 || ''}</p>
            <p>${translations.welcomeP4 || ''}</p>
        `;
    }
    
    updateElementContent('.welcome-section .section-title', `${translations.welcomeTitle} ✨`);
    updateElementContent('.hobbies-section .section-title', `${translations.hobbiesTitle} 🎨`);
    updateElementContent('.games-section .section-title', `${translations.gamesTitle} 🎮`);
    updateElementContent('.contact-section .section-title', `${translations.contactTitle} ✉️`);
    
    updateElementContent('.contact-info h3', translations.contactInfo);
    updateElementContent('.contact-text h4', translations.emailTitle);
    updateElementContent('.contact-platforms h3', translations.bestWays);
    updateElementContent('.platform-link.discord', `Discord`);
    updateElementContent('.platform-link.email', `Email`);
    updateElementContent('.platform-link.instagram', `Instagram`);
    
    document.querySelector('.footer p').innerHTML = `&copy; <span id="currentYear">${new Date().getFullYear()}</span> ${config.name}. ${translations.allRights}`;
    updateElementContent('.footer-link:nth-child(1)', translations.privacy);
    updateElementContent('.footer-link:nth-child(3)', translations.contact);
    updateElementContent('.footer-link:nth-child(5)', translations.terms);
}

function updateElementContent(selector, text) {
    const element = document.querySelector(selector);
    if (element && text) {
        if (selector.includes('section-title')) {
            const parts = text.split(' ');
            const emoji = parts[parts.length - 1];
            const title = parts.slice(0, -1).join(' ');
            element.innerHTML = `${title} <span class="accent-emoji">${emoji}</span>`;
        } else {
            element.textContent = text;
        }
    }
}

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

function preloadCriticalImages() {
    const criticalImages = [config.profileImage];
    
    criticalImages.forEach(src => {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.as = 'image';
        link.href = src;
        document.head.appendChild(link);
    });
}

preloadCriticalImages();