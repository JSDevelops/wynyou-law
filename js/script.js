// CONFIGURATION: Paste your Google Apps Script Web App URL here to connect the form to Google Sheets
const GOOGLE_SHEET_APP_URL = "https://script.google.com/macros/s/AKfycbzxHbYZiGaFFESgVPL7SCZVsze83IhFzOB5xD5yCTrp6yghDb2NYAIz-8WpeHbiPm8SDQ/exec";

document.addEventListener('DOMContentLoaded', () => {
  
  // ==========================================
  // HEADER SCROLL EVENT
  // ==========================================
  const header = document.querySelector('.header');
  const handleScroll = () => {
    if (window.scrollY > 50) {
      header.classList.add('header--scrolled');
    } else {
      header.classList.remove('header--scrolled');
    }
  };
  window.addEventListener('scroll', handleScroll);
  handleScroll(); // Run on init in case page is refreshed down

  // ==========================================
  // MOBILE MENU TOGGLE
  // ==========================================
  const burger = document.querySelector('.header__burger');
  const sidebar = document.querySelector('.sidebar');
  const sidebarLinks = document.querySelectorAll('.sidebar__link');

  const toggleMenu = () => {
    burger.classList.toggle('header__burger--active');
    sidebar.classList.toggle('sidebar--active');
    document.body.classList.toggle('overflow-hidden');
  };

  burger.addEventListener('click', toggleMenu);

  // Close sidebar when clicking any link
  sidebarLinks.forEach(link => {
    link.addEventListener('click', () => {
      burger.classList.remove('header__burger--active');
      sidebar.classList.remove('sidebar--active');
      document.body.classList.remove('overflow-hidden');
    });
  });

  // ==========================================
  // SCROLL REVEAL (INTERSECTION OBSERVER)
  // ==========================================
  const revealElements = document.querySelectorAll('.reveal, .reveal-grid');
  
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        if (entry.target.classList.contains('reveal-grid')) {
          entry.target.classList.add('reveal-grid--active');
        } else {
          entry.target.classList.add('reveal--active');
        }
        observer.unobserve(entry.target); // Reveal only once
      }
    });
  }, {
    threshold: 0.15,
    rootMargin: '0px 0px -50px 0px'
  });

  revealElements.forEach(el => revealObserver.observe(el));

  // ==========================================
  // STATS COUNTER ANIMATION
  // ==========================================
  const statNumbers = document.querySelectorAll('.stats__number');
  
  const countUp = (element) => {
    const target = parseInt(element.getAttribute('data-target'), 10);
    const duration = 1500; // 1.5 seconds duration
    const stepTime = 15;
    const steps = duration / stepTime;
    const increment = target / steps;
    let current = 0;

    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        element.textContent = target + (element.getAttribute('data-suffix') || '');
        clearInterval(timer);
      } else {
        element.textContent = Math.floor(current) + (element.getAttribute('data-suffix') || '');
      }
    }, stepTime);
  };

  const statsObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        countUp(entry.target);
        observer.unobserve(entry.target); // Count only once
      }
    });
  }, {
    threshold: 0.5
  });

  statNumbers.forEach(num => statsObserver.observe(num));

  // ==========================================
  // ACTIVE NAVIGATION LINK IN VIEWPORT (Articles removed)
  // ==========================================
  const sections = document.querySelectorAll('section[id], header[id]');
  const navLinks = document.querySelectorAll('.header__link');
  const mobLinks = document.querySelectorAll('.sidebar__link');

  const highlightNav = () => {
    let scrollY = window.pageYOffset;

    sections.forEach(section => {
      const sectionHeight = section.offsetHeight;
      const sectionTop = section.offsetTop - 120; // offset for fixed header
      const sectionId = section.getAttribute('id');

      if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
        // Desktop Active Link
        navLinks.forEach(link => {
          link.classList.remove('header__link--active');
          if (link.getAttribute('href') === `#${sectionId}`) {
            link.classList.add('header__link--active');
          }
        });
        // Mobile Active Link
        mobLinks.forEach(link => {
          link.classList.remove('sidebar__link--active');
          if (link.getAttribute('href') === `#${sectionId}`) {
            link.classList.add('sidebar__link--active');
          }
        });
      }
    });
  };

  window.addEventListener('scroll', highlightNav);
  highlightNav(); // Run once on init

  // ==========================================
  // SMOOTH SCROLL TO TOP FOR HOME LINKS
  // ==========================================
  const homeLinks = document.querySelectorAll('a[href="#top-header"]');
  homeLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
      // Remove hash from URL to keep it clean
      if (window.history.pushState) {
        window.history.pushState(null, null, ' ');
      }
    });
  });

  // ==========================================
  // INTERACTIVE CONSULT FORM & SUCCESS MODAL
  // ==========================================
  const form = document.getElementById('law-consult-form');
  const modal = document.getElementById('success-modal');
  const closeModalBtn = document.getElementById('btn-close-modal');

  if (form && modal) {
    form.addEventListener('submit', (e) => {
      e.preventDefault(); // Prevent page reload
      
      // Basic validation
      const name = document.getElementById('contact-name').value.trim();
      const phone = document.getElementById('contact-phone').value.trim();
      const email = document.getElementById('contact-email') ? document.getElementById('contact-email').value.trim() : '';
      const service = document.getElementById('contact-service').value;
      const message = document.getElementById('contact-message').value.trim();

      if (name && phone && service && message) {
        // If Google Sheets App URL is configured, submit the data
        if (GOOGLE_SHEET_APP_URL) {
          const submitBtn = form.querySelector('button[type="submit"]');
          const originalBtnText = submitBtn.innerHTML;
          
          // Disable button and show loading state
          submitBtn.disabled = true;
          submitBtn.innerHTML = 'กำลังส่งข้อมูล...';
          
          // Create form params
          const params = new URLSearchParams();
          params.append('name', name);
          params.append('phone', phone);
          params.append('email', email);
          params.append('service', service);
          params.append('message', message);
          
          fetch(GOOGLE_SHEET_APP_URL, {
            method: 'POST',
            body: params,
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded'
            },
            mode: 'no-cors' // Google Apps Script Web App redirection requires no-cors mode
          })
          .then(() => {
            // Re-enable button
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalBtnText;
            
            // Show success modal
            modal.classList.add('modal--active');
            document.body.classList.add('overflow-hidden');
            form.reset();
          })
          .catch((error) => {
            console.error('Error sending to Google Sheet:', error);
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalBtnText;
            
            // Fallback: Show success modal anyway to not break user flow
            modal.classList.add('modal--active');
            document.body.classList.add('overflow-hidden');
            form.reset();
          });
        } else {
          // Standard modal display if URL is not configured
          modal.classList.add('modal--active');
          document.body.classList.add('overflow-hidden');
          form.reset();
        }
      }
    });

    // Close Modal Button
    closeModalBtn.addEventListener('click', () => {
      modal.classList.remove('modal--active');
      document.body.classList.remove('overflow-hidden');
    });

    // Close Modal by Clicking Background Backdrop
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.classList.remove('modal--active');
        document.body.classList.remove('overflow-hidden');
      }
    });
  }
});
