// ===== NAVBAR SCROLL EFFECT =====
const navbar = document.getElementById('navbar');

window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// ===== MOBILE NAV TOGGLE =====
const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');

navToggle.addEventListener('click', () => {
    navLinks.classList.toggle('active');
    navToggle.classList.toggle('active');
});

// Close mobile nav on link click
document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
        navLinks.classList.remove('active');
        navToggle.classList.remove('active');
    });
});

// ===== SCROLL REVEAL =====
const revealElements = document.querySelectorAll('.service-card, .project-card, .about-content, .about-image, .contact-info, .contact-form-wrapper');

const revealOnScroll = () => {
    revealElements.forEach(el => {
        const elementTop = el.getBoundingClientRect().top;
        const windowHeight = window.innerHeight;
        
        if (elementTop < windowHeight - 100) {
            el.classList.add('revealed');
            el.style.opacity = '1';
            el.style.transform = 'translateY(0)';
        }
    });
};

// Set initial state
revealElements.forEach((el, index) => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = `opacity 0.6s ease ${index % 3 * 0.1}s, transform 0.6s ease ${index % 3 * 0.1}s`;
});

window.addEventListener('scroll', revealOnScroll);
window.addEventListener('load', revealOnScroll);

// ===== COUNTER ANIMATION =====
const counters = document.querySelectorAll('.stat-number');
let counterAnimated = false;

const animateCounters = () => {
    if (counterAnimated) return;
    
    const aboutSection = document.querySelector('.about');
    const sectionTop = aboutSection.getBoundingClientRect().top;
    
    if (sectionTop < window.innerHeight - 200) {
        counterAnimated = true;
        
        counters.forEach(counter => {
            const target = parseInt(counter.getAttribute('data-count'));
            const duration = 2000;
            const step = target / (duration / 16);
            let current = 0;
            
            const updateCounter = () => {
                current += step;
                if (current < target) {
                    counter.textContent = Math.floor(current);
                    requestAnimationFrame(updateCounter);
                } else {
                    counter.textContent = target;
                }
            };
            
            updateCounter();
        });
    }
};

window.addEventListener('scroll', animateCounters);

// ===== PROJECT FILTER =====
const filterBtns = document.querySelectorAll('.filter-btn');
let homeProjects = { architecture: [], interior: [], animations: [] };
let currentHomeFilter = 'all';

// Load projects from JSON for homepage
async function loadHomeProjects() {
    try {
        const response = await fetch('data/afn-design-data.json');
        const data = await response.json();

        // Take first 5 from each category
        homeProjects.architecture = (data.architecture_projects || []).slice(0, 5).map(p => ({ ...p, category: 'architecture' }));
        homeProjects.interior = (data.interior_projects || []).slice(0, 5).map(p => ({ ...p, category: 'interior' }));
        homeProjects.animations = (data.animations_projects || []).slice(0, 5).map(p => ({ ...p, category: 'animations' }));

        renderHomeProjects('all');
    } catch (error) {
        console.error('Error loading projects:', error);
    }
}

function renderHomeProjects(filter) {
    const grid = document.getElementById('homeProjectsGrid');
    if (!grid) return;

    let projects = [];
    if (filter === 'all') {
        projects = [...homeProjects.architecture, ...homeProjects.interior, ...homeProjects.animations];
    } else {
        projects = homeProjects[filter] || [];
    }

    grid.innerHTML = '';

    projects.forEach((project, index) => {
        const card = document.createElement('div');
        card.className = 'project-card';
        card.setAttribute('data-category', project.category);
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        card.style.transition = `opacity 0.5s ease ${index * 0.08}s, transform 0.5s ease ${index * 0.08}s`;

        const categoryLabel = project.category.charAt(0).toUpperCase() + project.category.slice(1);
        const location = project.lokasi || '';
        const luasBangunan = project.luas_bangunan && project.luas_bangunan !== '-' ? project.luas_bangunan : '';
        const konsep = project.konsep && project.konsep !== '-' ? project.konsep : '';
        const meta = [luasBangunan, konsep].filter(Boolean).join(' · ');
        const client = project.client ? `Client: ${project.client}` : '';
        const displayMeta = meta || client;

        const detailUrl = `project-detail.html?slug=${encodeURIComponent(project.imageSlug)}&category=${encodeURIComponent(project.category)}`;

        card.innerHTML = `
            <a href="${detailUrl}" class="card-link" style="color:inherit;text-decoration:none;display:block;">
                <div class="project-image" style="background: linear-gradient(135deg, #2d2d2d, #1a1a1a);">
                    <div class="project-overlay">
                        <span class="project-category">${categoryLabel}</span>
                    </div>
                    <img src="${'/images/projects/' + project.imageSlug + '1.jpeg'}" />
                </div>
                <div class="project-info">
                    <h3>${project.nama_project}</h3>
                    ${location ? `<p class="project-location">${location}</p>` : ''}
                    ${displayMeta ? `<p class="project-meta">${displayMeta}</p>` : ''}
                </div>
            </a>
        `;

        grid.appendChild(card);

        // Trigger animation
        setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, 50);
    });
}

// Filter button events
filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const filter = btn.getAttribute('data-filter');
        currentHomeFilter = filter;
        renderHomeProjects(filter);
    });
});

// Initialize home projects
document.addEventListener('DOMContentLoaded', () => {
    loadHomeProjects();
});

// ===== SMOOTH SCROLL FOR NAV LINKS =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const offset = 80;
            const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - offset;
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// ===== FORM SUBMISSION =====
const contactForm = document.getElementById('contactForm');

contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const name = document.getElementById('formName').value;
    const email = document.getElementById('formEmail').value;
    const projectType = document.getElementById('formProjectType').value;
    const message = document.getElementById('formMessage').value;

    // Build WhatsApp message text
    let waText = `Halo AFN Design Studio!%0A%0A`;
    waText += `Nama: ${encodeURIComponent(name)}%0A`;
    waText += `Email: ${encodeURIComponent(email)}%0A`;
    if (projectType) {
        waText += `Tipe Project: ${encodeURIComponent(projectType)}%0A`;
    }
    waText += `Pesan: ${encodeURIComponent(message)}`;

    const waUrl = `https://api.whatsapp.com/send/?phone=%2B628567934204&text=${waText}&type=phone_number&app_absent=0`;
    
    window.open(waUrl, '_blank');
});

// ===== PARALLAX EFFECT ON HERO =====
window.addEventListener('scroll', () => {
    const heroContent = document.querySelector('.hero-content');
    const heroCollage = document.querySelector('.hero-collage');
    const scrolled = window.scrollY;
    if (scrolled < window.innerHeight) {
        if (heroContent) {
            heroContent.style.transform = `translateY(${scrolled * 0.2}px)`;
            heroContent.style.opacity = 1 - (scrolled / window.innerHeight);
        }
        if (heroCollage) {
            heroCollage.style.transform = `translateY(${scrolled * 0.1}px)`;
            heroCollage.style.opacity = 1 - (scrolled / (window.innerHeight * 1.2));
        }
    }
});
