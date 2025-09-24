/**
 * Suraksha Learn - Main JavaScript
 * Handles navigation, internationalization, and core site functionality
 */

// Global application state
const SurakshaLearn = {
  // Current language
  currentLang: 'en',
  
  // Available languages
  languages: {
    en: 'English',
    hi: 'हिंदी'
  },
  
  // Translation data
  translations: {
    en: {
      // Navigation
      'nav.home': 'Home',
      'nav.lessons': 'Lessons',
      'nav.simulate': 'Simulate',
      'nav.quiz': 'Quiz',
      'nav.dashboard': 'Dashboard',
      'nav.skip': 'Skip to main content',
      
      // Site info
      'site.name': 'Suraksha Learn',
      'site.title': 'Suraksha Learn - Disaster Preparedness for Schools',
      
      // Hero section
      'hero.title': 'Be Prepared.<br><span class="hero__title--accent">Stay Safe.</span>',
      'hero.subtitle': 'Interactive disaster preparedness training for schools and colleges. Learn life-saving skills through immersive simulations and expert guidance.',
      'hero.cta': 'Start Learning',
      'hero.demo': 'Watch Demo',
      'hero.stat1': 'Students Trained',
      'hero.stat2': 'Schools',
      'hero.stat3': 'Pass Rate',
      'hero.scroll': 'Scroll to explore',
      
      // Features section
      'features.title': 'Why Choose Suraksha Learn?',
      'features.subtitle': 'Our platform combines cutting-edge technology with proven safety protocols',
      'features.interactive.title': 'Interactive Simulations',
      'features.interactive.text': 'Practice real-world scenarios in a safe, controlled environment with immediate feedback.',
      'features.expert.title': 'Expert Content',
      'features.expert.text': 'Content developed by disaster management experts and educational specialists.',
      'features.certificate.title': 'Certification',
      'features.certificate.text': 'Earn recognized certificates upon successful completion of training modules.',
      'features.offline.title': 'Offline Access',
      'features.offline.text': 'Download lessons and materials for offline learning and reference.',
      
      // Modules section
      'modules.title': 'Training Modules',
      'modules.subtitle': 'Comprehensive preparedness training for all major disasters',
      'modules.earthquake.title': 'Earthquake Safety',
      'modules.earthquake.text': 'Learn Drop, Cover, and Hold techniques. Practice evacuation procedures.',
      'modules.fire.title': 'Fire Safety',
      'modules.fire.text': 'Fire prevention, evacuation routes, and proper use of safety equipment.',
      'modules.flood.title': 'Flood Preparedness',
      'modules.flood.text': 'Emergency kits, safe evacuation, and post-flood safety measures.',
      'modules.start': 'Start Module',
      
      // CTA section
      'cta.title': 'Ready to Get Started?',
      'cta.text': 'Join thousands of students already learning life-saving skills',
      'cta.primary': 'Start Your First Lesson',
      'cta.secondary': 'View Progress Dashboard',
      
      // Footer
      'footer.tagline': 'Empowering communities through disaster preparedness education',
      'footer.platform': 'Platform',
      'footer.resources': 'Resources',
      'footer.guides': 'Safety Guides',
      'footer.downloads': 'Downloads',
      'footer.help': 'Help Center',
      'footer.contact': 'Contact Us',
      'footer.copyright': '© 2025 Suraksha Learn. All rights reserved.',
      'footer.privacy': 'Privacy Policy',
      'footer.terms': 'Terms of Service'
    },
    
    hi: {
      // Navigation
      'nav.home': 'मुख्य पृष्ठ',
      'nav.lessons': 'पाठ',
      'nav.simulate': 'अभ्यास',
      'nav.quiz': 'प्रश्नोत्तरी',
      'nav.dashboard': 'डैशबोर्ड',
      'nav.skip': 'मुख्य सामग्री पर जाएं',
      
      // Site info
      'site.name': 'सुरक्षा लर्न',
      'site.title': 'सुरक्षा लर्न - स्कूलों के लिए आपदा तैयारी',
      
      // Hero section
      'hero.title': 'तैयार रहें।<br><span class="hero__title--accent">सुरक्षित रहें।</span>',
      'hero.subtitle': 'स्कूलों और कॉलेजों के लिए इंटरैक्टिव आपदा तैयारी प्रशिक्षण। इमर्सिव सिमुलेशन और विशेषज्ञ मार्गदर्शन के माध्यम से जीवन बचाने वाले कौशल सीखें।',
      'hero.cta': 'सीखना शुरू करें',
      'hero.demo': 'डेमो देखें',
      'hero.stat1': 'प्रशिक्षित छात्र',
      'hero.stat2': 'स्कूल',
      'hero.stat3': 'उत्तीर्ण दर',
      'hero.scroll': 'खोजने के लिए स्क्रॉल करें',
      
      // Features section
      'features.title': 'सुरक्षा लर्न क्यों चुनें?',
      'features.subtitle': 'हमारा प्लेटफॉर्म अत्याधुनिक तकनीक को सिद्ध सुरक्षा प्रोटोकॉल के साथ जोड़ता है',
      'features.interactive.title': 'इंटरैक्टिव सिमुलेशन',
      'features.interactive.text': 'तत्काल फीडबैक के साथ सुरक्षित, नियंत्रित वातावरण में वास्तविक परिस्थितियों का अभ्यास करें।',
      'features.expert.title': 'विशेषज्ञ सामग्री',
      'features.expert.text': 'आपदा प्रबंधन विशेषज्ञों और शैक्षिक विशेषज्ञों द्वारा विकसित सामग्री।',
      'features.certificate.title': 'प्रमाणन',
      'features.certificate.text': 'प्रशिक्षण मॉड्यूल के सफल पूरा होने पर मान्यता प्राप्त प्रमाणपत्र अर्जित करें।',
      'features.offline.title': 'ऑफ़लाइन पहुंच',
      'features.offline.text': 'ऑफ़लाइन सीखने और संदर्भ के लिए पाठ और सामग्री डाउनलोड करें।',
      
      // Modules section
      'modules.title': 'प्रशिक्षण मॉड्यूल',
      'modules.subtitle': 'सभी प्रमुख आपदाओं के लिए व्यापक तैयारी प्रशिक्षण',
      'modules.earthquake.title': 'भूकंप सुरक्षा',
      'modules.earthquake.text': 'ड्रॉप, कवर, और होल्ड तकनीक सीखें। निकासी प्रक्रियाओं का अभ्यास करें।',
      'modules.fire.title': 'अग्नि सुरक्षा',
      'modules.fire.text': 'अग्नि रोकथाम, निकासी मार्ग, और सुरक्षा उपकरण का उचित उपयोग।',
      'modules.flood.title': 'बाढ़ की तैयारी',
      'modules.flood.text': 'आपातकालीन किट, सुरक्षित निकासी, और बाढ़ के बाद सुरक्षा उपाय।',
      'modules.start': 'मॉड्यूल शुरू करें',
      
      // CTA section
      'cta.title': 'शुरू करने के लिए तैयार हैं?',
      'cta.text': 'हजारों छात्र पहले से ही जीवन बचाने वाले कौशल सीख रहे हैं',
      'cta.primary': 'अपना पहला पाठ शुरू करें',
      'cta.secondary': 'प्रगति डैशबोर्ड देखें',
      
      // Footer
      'footer.tagline': 'आपदा तैयारी शिक्षा के माध्यम से समुदायों को सशक्त बनाना',
      'footer.platform': 'प्लेटफॉर्म',
      'footer.resources': 'संसाधन',
      'footer.guides': 'सुरक्षा गाइड',
      'footer.downloads': 'डाउनलोड',
      'footer.help': 'सहायता केंद्र',
      'footer.contact': 'संपर्क करें',
      'footer.copyright': '© 2025 सुरक्षा लर्न। सभी अधिकार सुरक्षित।',
      'footer.privacy': 'गोपनीयता नीति',
      'footer.terms': 'सेवा की शर्तें'
    }
  }
};

/**
 * Initialize the application
 */
function init() {
  console.log('🚀 Suraksha Learn initialized');
  
  // Load saved language preference
  const savedLang = localStorage.getItem('suraksha-lang') || 'en';
  SurakshaLearn.currentLang = savedLang;
  
  // Initialize all components
  initNavigation();
  initLanguageToggle();
  initSmoothScrolling();
  initLazyLoading();
  initAccessibility();
  initAnimations();
  
  // Apply current language
  applyTranslations();
  
  // Update language toggle display
  updateLanguageToggle();
  
  console.log(`✅ Language set to: ${SurakshaLearn.currentLang}`);
}

/**
 * Initialize navigation functionality
 */
function initNavigation() {
  const nav = document.querySelector('.nav');
  const mobileToggle = document.querySelector('.nav__mobile-toggle');
  const navMenu = document.querySelector('.nav__menu');
  
  // Handle mobile navigation toggle
  if (mobileToggle && navMenu) {
    mobileToggle.addEventListener('click', () => {
      const isOpen = navMenu.classList.contains('nav__menu--open');
      
      if (isOpen) {
        navMenu.classList.remove('nav__menu--open');
        mobileToggle.classList.remove('nav__mobile-toggle--active');
        document.body.classList.remove('nav-open');
      } else {
        navMenu.classList.add('nav__menu--open');
        mobileToggle.classList.add('nav__mobile-toggle--active');
        document.body.classList.add('nav-open');
      }
    });
    
    // Close mobile nav when clicking outside
    document.addEventListener('click', (e) => {
      if (!nav.contains(e.target) && navMenu.classList.contains('nav__menu--open')) {
        navMenu.classList.remove('nav__menu--open');
        mobileToggle.classList.remove('nav__mobile-toggle--active');
        document.body.classList.remove('nav-open');
      }
    });
    
    // Close mobile nav on escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && navMenu.classList.contains('nav__menu--open')) {
        navMenu.classList.remove('nav__menu--open');
        mobileToggle.classList.remove('nav__mobile-toggle--active');
        document.body.classList.remove('nav-open');
      }
    });
  }
  
  // Handle scroll-based nav styling
  let lastScroll = 0;
  window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll > 100) {
      nav.classList.add('nav--scrolled');
    } else {
      nav.classList.remove('nav--scrolled');
    }
    
    // Hide nav on scroll down, show on scroll up
    if (currentScroll > lastScroll && currentScroll > 200) {
      nav.classList.add('nav--hidden');
    } else {
      nav.classList.remove('nav--hidden');
    }
    
    lastScroll = currentScroll;
  });
}

/**
 * Initialize language toggle functionality
 */
function initLanguageToggle() {
  const langToggle = document.querySelector('.lang-toggle');
  
  if (langToggle) {
    langToggle.addEventListener('click', () => {
      // Toggle between languages
      SurakshaLearn.currentLang = SurakshaLearn.currentLang === 'en' ? 'hi' : 'en';
      
      // Save preference
      localStorage.setItem('suraksha-lang', SurakshaLearn.currentLang);
      
      // Apply translations
      applyTranslations();
      
      // Update toggle display
      updateLanguageToggle();
      
      // Announce change to screen readers
      announceToScreenReader(`Language changed to ${SurakshaLearn.languages[SurakshaLearn.currentLang]}`);
      
      console.log(`🌐 Language switched to: ${SurakshaLearn.currentLang}`);
    });
  }
}

/**
 * Update language toggle button text
 */
function updateLanguageToggle() {
  const langToggleText = document.querySelector('.lang-toggle__text');
  
  if (langToggleText) {
    langToggleText.textContent = SurakshaLearn.currentLang.toUpperCase();
  }
}

/**
 * Apply translations to all elements with data-i18n attribute
 */
function applyTranslations() {
  const elements = document.querySelectorAll('[data-i18n]');
  const currentTranslations = SurakshaLearn.translations[SurakshaLearn.currentLang];
  
  elements.forEach(element => {
    const key = element.getAttribute('data-i18n');
    const translation = currentTranslations[key];
    
    if (translation) {
      // Handle HTML content vs text content
      if (translation.includes('<')) {
        element.innerHTML = translation;
      } else {
        element.textContent = translation;
      }
    }
  });
  
  // Handle placeholder text
  const placeholderElements = document.querySelectorAll('[data-i18n-placeholder]');
  placeholderElements.forEach(element => {
    const key = element.getAttribute('data-i18n-placeholder');
    const translation = currentTranslations[key];
    
    if (translation) {
      element.placeholder = translation;
    }
  });
  
  // Update document title
  const titleElement = document.querySelector('title[data-i18n]');
  if (titleElement) {
    const key = titleElement.getAttribute('data-i18n');
    const translation = currentTranslations[key];
    if (translation) {
      document.title = translation;
    }
  }
  
  // Update HTML lang attribute
  document.documentElement.lang = SurakshaLearn.currentLang;
}

/**
 * Initialize smooth scrolling for anchor links
 */
function initSmoothScrolling() {
  const smoothScrollLinks = document.querySelectorAll('a[href^="#"]');
  
  smoothScrollLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      const targetId = link.getAttribute('href').substring(1);
      const targetElement = document.getElementById(targetId);
      
      if (targetElement) {
        e.preventDefault();
        
        const headerOffset = 80; // Account for fixed header
        const elementPosition = targetElement.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
        
        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
        
        // Update focus for accessibility
        targetElement.focus({ preventScroll: true });
      }
    });
  });
}

/**
 * Initialize lazy loading for images
 */
function initLazyLoading() {
  // Only initialize if IntersectionObserver is supported
  if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = img.dataset.src;
          img.classList.remove('lazy');
          imageObserver.unobserve(img);
        }
      });
    });
    
    const lazyImages = document.querySelectorAll('img[data-src]');
    lazyImages.forEach(img => {
      img.classList.add('lazy');
      imageObserver.observe(img);
    });
  } else {
    // Fallback for browsers without IntersectionObserver
    const lazyImages = document.querySelectorAll('img[data-src]');
    lazyImages.forEach(img => {
      img.src = img.dataset.src;
    });
  }
}

/**
 * Initialize accessibility enhancements
 */
function initAccessibility() {
  // Add keyboard navigation for custom interactive elements
  const interactiveElements = document.querySelectorAll('[role="button"], .btn, .nav__link');
  
  interactiveElements.forEach(element => {
    element.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        element.click();
      }
    });
  });
  
  // Improve focus management for modals and overlays
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Tab') {
      trapFocusInModal(e);
    }
  });
  
  // Add skip link functionality
  const skipLink = document.querySelector('.skip-link');
  if (skipLink) {
    skipLink.addEventListener('click', (e) => {
      e.preventDefault();
      const mainContent = document.getElementById('main');
      if (mainContent) {
        mainContent.focus();
        mainContent.scrollIntoView();
      }
    });
  }
}

/**
 * Trap focus within modals for accessibility
 */
function trapFocusInModal(e) {
  const activeModal = document.querySelector('.modal:not([hidden]), .simulation-overlay:not([hidden])');
  
  if (activeModal) {
    const focusableElements = activeModal.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];
    
    if (e.shiftKey) {
      if (document.activeElement === firstElement) {
        lastElement.focus();
        e.preventDefault();
      }
    } else {
      if (document.activeElement === lastElement) {
        firstElement.focus();
        e.preventDefault();
      }
    }
  }
}

/**
 * Initialize GSAP animations if available
 */
function initAnimations() {
  if (typeof gsap !== 'undefined') {
    // Fade in elements on scroll
    gsap.registerPlugin(ScrollTrigger);
    
    // Animate feature cards
    gsap.from('.feature-card', {
      scrollTrigger: {
        trigger: '.features',
        start: 'top 80%'
      },
      y: 50,
      opacity: 0,
      duration: 0.8,
      stagger: 0.2,
      ease: 'power2.out'
    });
    
    // Animate module cards
    gsap.from('.module-card', {
      scrollTrigger: {
        trigger: '.modules',
        start: 'top 80%'
      },
      y: 50,
      opacity: 0,
      duration: 0.8,
      stagger: 0.2,
      ease: 'power2.out'
    });
    
    // Animate stats
    gsap.from('.stat', {
      scrollTrigger: {
        trigger: '.hero__stats',
        start: 'top 80%'
      },
      scale: 0.8,
      opacity: 0,
      duration: 0.6,
      stagger: 0.1,
      ease: 'back.out(1.7)'
    });
  }
}

/**
 * Announce text to screen readers
 */
function announceToScreenReader(message) {
  const announcement = document.createElement('div');
  announcement.setAttribute('aria-live', 'polite');
  announcement.setAttribute('aria-atomic', 'true');
  announcement.className = 'sr-only';
  announcement.textContent = message;
  
  document.body.appendChild(announcement);
  
  // Remove after announcement
  setTimeout(() => {
    document.body.removeChild(announcement);
  }, 1000);
}

/**
 * Utility function to format time
 */
function formatTime(seconds) {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
}

/**
 * Utility function to format date
 */
function formatDate(date, locale = 'en-US') {
  return new Intl.DateTimeFormat(locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }).format(new Date(date));
}

/**
 * Utility function to debounce function calls
 */
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

/**
 * Utility function to throttle function calls
 */
function throttle(func, limit) {
  let inThrottle;
  return function(...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}

/**
 * Check if user prefers reduced motion
 */
function prefersReducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/**
 * Save user progress to localStorage
 */
function saveProgress(module, data) {
  const progressKey = `suraksha-progress-${module}`;
  const existingProgress = JSON.parse(localStorage.getItem(progressKey) || '{}');
  
  const updatedProgress = {
    ...existingProgress,
    ...data,
    lastUpdated: new Date().toISOString()
  };
  
  localStorage.setItem(progressKey, JSON.stringify(updatedProgress));
  
  console.log(`💾 Progress saved for ${module}:`, updatedProgress);
}

/**
 * Load user progress from localStorage
 */
function loadProgress(module) {
  const progressKey = `suraksha-progress-${module}`;
  const progress = JSON.parse(localStorage.getItem(progressKey) || '{}');
  
  console.log(`📂 Progress loaded for ${module}:`, progress);
  return progress;
}

/**
 * Export data as CSV
 */
function exportToCSV(data, filename = 'data.csv') {
  const csvContent = data.map(row => 
    Object.values(row).map(val => 
      typeof val === 'string' && val.includes(',') ? `"${val}"` : val
    ).join(',')
  ).join('\n');
  
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  
  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}

// Initialize when DOM is loaded
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}

// Export for use by other modules
window.SurakshaLearn = SurakshaLearn;
window.saveProgress = saveProgress;
window.loadProgress = loadProgress;
window.exportToCSV = exportToCSV;
window.formatTime = formatTime;
window.formatDate = formatDate;
window.announceToScreenReader = announceToScreenReader;