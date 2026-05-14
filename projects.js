// ===== Projects Page Logic =====

let allProjects = [];
let filteredProjects = [];
let currentFilter = 'all';
let visibleCount = 0;
const LOAD_COUNT = 4;

// Fetch data from JSON
async function loadProjectData() {
    try {
        const response = await fetch('data/afn-design-data.json');
        const data = await response.json();

        // Normalize all projects into a single array with category
        const archProjects = (data.architecture_projects || []).map(p => ({
            ...p,
            category: 'architecture'
        }));

        const intProjects = (data.interior_projects || []).map(p => ({
            ...p,
            category: 'interior'
        }));

        const animProjects = (data.animations_projects || []).map(p => ({
            ...p,
            category: 'animations'
        }));

        allProjects = [...archProjects, ...intProjects, ...animProjects];
        filteredProjects = [...allProjects];

        updateProjectCount();
        showProjects();
    } catch (error) {
        console.error('Error loading project data:', error);
        document.getElementById('projectsGrid').innerHTML = '<p style="text-align:center;color:#666;">Failed to load projects. Please try again.</p>';
    }
}

// Render project cards
function showProjects() {
    const grid = document.getElementById('projectsGrid');
    const startIndex = visibleCount;
    const endIndex = Math.min(visibleCount + LOAD_COUNT, filteredProjects.length);

    for (let i = startIndex; i < endIndex; i++) {
        const project = filteredProjects[i];
        const card = createProjectCard(project, i);
        grid.appendChild(card);
    }

    visibleCount = endIndex;
    updateLoadMoreButton();
}

// Create a single project card element
function createProjectCard(project, index) {
    const card = document.createElement('div');
    card.className = 'project-card-page';
    card.style.animationDelay = `${(index % LOAD_COUNT) * 0.1}s`;

    const categoryLabel = project.category.charAt(0).toUpperCase() + project.category.slice(1);
    const location = project.lokasi || '-';
    const year = project.tahun || '-';
    const concept = project.konsep || '-';
    const description = project.deskripsi || '';
    const luasTanah = project.luas_tanah || null;
    const luasBangunan = project.luas_bangunan || null;
    const client = project.client || null;

    // Build details section
    let detailsHTML = '';
    if (luasTanah && luasTanah !== '-') {
        detailsHTML += `<div class="card-detail"><strong>Luas Tanah:</strong> ${luasTanah}</div>`;
    }
    if (luasBangunan && luasBangunan !== '-') {
        detailsHTML += `<div class="card-detail"><strong>Luas Bangunan:</strong> ${luasBangunan}</div>`;
    }
    if (client) {
        detailsHTML += `<div class="card-detail"><strong>Client:</strong> ${client}</div>`;
    }

    const detailUrl = `project-detail.html?slug=${encodeURIComponent(project.imageSlug)}&category=${encodeURIComponent(project.category)}`;

    card.innerHTML = `
        <a href="${detailUrl}" class="card-link">
            <div class="card-image" data-project-name="${project.nama_project}">
                <img src="${'/images/projects/' + project.imageSlug + '1.jpeg'}" />
                <span class="card-badge">${categoryLabel}</span>
                <span class="card-year">${year}</span>
            </div>
            <div class="card-content">
                <h3>${project.nama_project}</h3>
                <p class="card-location">${location}</p>
                ${detailsHTML ? `<div class="card-details">${detailsHTML}</div>` : ''}
                ${concept !== '-' ? `<span class="card-concept">${concept}</span>` : ''}
                <p class="card-desc">${description}</p>
            </div>
        </a>
    `;

    return card;
}

// Update project count display
function updateProjectCount() {
    document.getElementById('projectCount').textContent = filteredProjects.length;
}

// Show/hide load more button
function updateLoadMoreButton() {
    const wrapper = document.getElementById('loadMoreWrapper');
    if (visibleCount >= filteredProjects.length) {
        wrapper.classList.add('hidden');
    } else {
        wrapper.classList.remove('hidden');
    }
}

// Filter projects
function filterProjects(category) {
    currentFilter = category;
    visibleCount = 0;

    if (category === 'all') {
        filteredProjects = [...allProjects];
    } else {
        filteredProjects = allProjects.filter(p => p.category === category);
    }

    // Clear grid
    const grid = document.getElementById('projectsGrid');
    grid.innerHTML = '';

    updateProjectCount();
    showProjects();
}

// ===== Event Listeners =====

// Filter buttons
document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        filterProjects(btn.dataset.filter);
    });
});

// Load more button
document.getElementById('loadMoreBtn').addEventListener('click', () => {
    showProjects();
});

// Mobile nav toggle
const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');

navToggle.addEventListener('click', () => {
    navLinks.classList.toggle('active');
});

document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
        navLinks.classList.remove('active');
    });
});

// ===== Initialize =====
document.addEventListener('DOMContentLoaded', () => {
    loadProjectData();
});
