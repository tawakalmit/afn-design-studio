// ===== Project Detail Page Logic =====

// Get project slug from URL params
function getProjectSlug() {
    const params = new URLSearchParams(window.location.search);
    return params.get('slug');
}

function getProjectCategory() {
    const params = new URLSearchParams(window.location.search);
    return params.get('category');
}

// Load project data and find the matching project
async function loadProjectDetail() {
    const slug = getProjectSlug();
    const category = getProjectCategory();

    if (!slug || !category) {
        showNotFound();
        return;
    }

    try {
        const response = await fetch('data/afn-design-data.json');
        const data = await response.json();

        let project = null;
        let categoryLabel = '';

        if (category === 'architecture') {
            project = data.architecture_projects.find(p => p.imageSlug === slug);
            categoryLabel = 'Architecture';
        } else if (category === 'interior') {
            project = data.interior_projects.find(p => p.imageSlug === slug);
            categoryLabel = 'Interior';
        } else if (category === 'animations') {
            project = data.animations_projects.find(p => p.imageSlug === slug);
            categoryLabel = 'Animations';
        }

        if (!project) {
            showNotFound();
            return;
        }

        renderProjectDetail(project, categoryLabel);
    } catch (error) {
        console.error('Error loading project detail:', error);
        showNotFound();
    }
}

// Render the project detail
function renderProjectDetail(project, categoryLabel) {
    // Update page title
    document.title = `${project.nama_project} | AFN Design Studio`;

    // Update meta description
    const description = project.deskripsi || `Detail proyek ${project.nama_project} oleh AFN Design Studio.`;
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) metaDesc.setAttribute('content', description);

    // Update Open Graph meta tags
    const ogTitle = document.getElementById('og-title');
    const ogDesc = document.getElementById('og-description');
    const ogImage = document.getElementById('og-image');
    if (ogTitle) ogTitle.setAttribute('content', `${project.nama_project} | AFN Design Studio`);
    if (ogDesc) ogDesc.setAttribute('content', description);
    if (ogImage) ogImage.setAttribute('content', `https://afndesign.vercel.app/images/projects/${project.imageSlug}1.jpeg`);

    // Update Twitter meta tags
    const twTitle = document.getElementById('twitter-title');
    const twDesc = document.getElementById('twitter-description');
    const twImage = document.getElementById('twitter-image');
    if (twTitle) twTitle.setAttribute('content', `${project.nama_project} | AFN Design Studio`);
    if (twDesc) twDesc.setAttribute('content', description);
    if (twImage) twImage.setAttribute('content', `https://afndesign.vercel.app/images/projects/${project.imageSlug}1.jpeg`);

    // Render header
    const headerEl = document.getElementById('projectHeader');
    const location = project.lokasi || '';
    headerEl.innerHTML = `
        <span class="detail-category">${categoryLabel}</span>
        <h1 class="detail-title">${project.nama_project}</h1>
        ${location ? `<p class="detail-location">${location}</p>` : ''}
    `;

    // Render gallery
    renderGallery(project);

    // Render info
    renderInfo(project, categoryLabel);

    // Add structured data for the project
    addProjectStructuredData(project, categoryLabel);
}

// Add JSON-LD structured data for the project
function addProjectStructuredData(project, categoryLabel) {
    const structuredData = {
        "@context": "https://schema.org",
        "@type": "CreativeWork",
        "name": project.nama_project,
        "description": project.deskripsi || '',
        "creator": {
            "@type": "Organization",
            "name": "AFN Design Studio",
            "url": "https://afndesign.vercel.app"
        },
        "genre": categoryLabel,
        "dateCreated": project.tahun || '',
        "image": []
    };

    if (project.lokasi) {
        structuredData.locationCreated = {
            "@type": "Place",
            "name": project.lokasi
        };
    }

    for (let i = 1; i <= project.totalImage; i++) {
        structuredData.image.push(`https://afndesign.vercel.app/images/projects/${project.imageSlug}${i}.jpeg`);
    }

    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.textContent = JSON.stringify(structuredData);
    document.head.appendChild(script);
}

// Render image gallery
function renderGallery(project) {
    const galleryEl = document.getElementById('projectGallery');
    const images = [];

    for (let i = 1; i <= project.totalImage; i++) {
        const src = `/images/projects/${project.imageSlug}${i}.jpeg`;
        images.push(src);
    }

    if (images.length === 0) {
        galleryEl.innerHTML = '<p>No images available.</p>';
        return;
    }

    let thumbsHTML = images.map((src, idx) => `
        <div class="gallery-thumb ${idx === 0 ? 'active' : ''}" data-index="${idx}">
            <img src="${src}" alt="${project.nama_project} - Image ${idx + 1}" loading="lazy">
        </div>
    `).join('');

    galleryEl.innerHTML = `
        <div class="gallery-main">
            <img src="${images[0]}" alt="${project.nama_project}" id="galleryMainImg">
        </div>
        <div class="gallery-thumbnails">
            ${thumbsHTML}
        </div>
    `;

    // Add click events to thumbnails
    const thumbs = galleryEl.querySelectorAll('.gallery-thumb');
    const mainImg = document.getElementById('galleryMainImg');

    thumbs.forEach(thumb => {
        thumb.addEventListener('click', () => {
            const index = parseInt(thumb.dataset.index);
            mainImg.src = images[index];
            mainImg.alt = `${project.nama_project} - Image ${index + 1}`;

            thumbs.forEach(t => t.classList.remove('active'));
            thumb.classList.add('active');
        });
    });
}

// Render project info section
function renderInfo(project, categoryLabel) {
    const infoEl = document.getElementById('projectInfo');

    // Build specs
    let specsHTML = '';

    if (project.tahun) {
        specsHTML += `
            <div class="spec-item">
                <span class="spec-label">Tahun</span>
                <span class="spec-value">${project.tahun}</span>
            </div>
        `;
    }

    if (project.lokasi) {
        specsHTML += `
            <div class="spec-item">
                <span class="spec-label">Lokasi</span>
                <span class="spec-value">${project.lokasi}</span>
            </div>
        `;
    }

    if (project.luas_tanah && project.luas_tanah !== '-') {
        specsHTML += `
            <div class="spec-item">
                <span class="spec-label">Luas Tanah</span>
                <span class="spec-value">${project.luas_tanah}</span>
            </div>
        `;
    }

    if (project.luas_bangunan && project.luas_bangunan !== '-') {
        specsHTML += `
            <div class="spec-item">
                <span class="spec-label">Luas Bangunan</span>
                <span class="spec-value">${project.luas_bangunan}</span>
            </div>
        `;
    }

    if (project.konsep && project.konsep !== '-') {
        specsHTML += `
            <div class="spec-item">
                <span class="spec-label">Konsep</span>
                <span class="spec-value">${project.konsep}</span>
            </div>
        `;
    }

    if (project.client) {
        specsHTML += `
            <div class="spec-item">
                <span class="spec-label">Client</span>
                <span class="spec-value">${project.client}</span>
            </div>
        `;
    }

    specsHTML += `
        <div class="spec-item">
            <span class="spec-label">Kategori</span>
            <span class="spec-value">${categoryLabel}</span>
        </div>
    `;

    // Build description
    const concept = project.konsep && project.konsep !== '-' ? project.konsep : '';
    const description = project.deskripsi || 'No description available.';

    infoEl.innerHTML = `
        <div class="info-specs">
            <h3>Project Details</h3>
            ${specsHTML}
        </div>
        <div class="info-description">
            <h3>Deskripsi</h3>
            ${concept ? `<span class="detail-concept">${concept}</span>` : ''}
            <p>${description}</p>
        </div>
    `;
}

// Show not found state
function showNotFound() {
    const headerEl = document.getElementById('projectHeader');
    const galleryEl = document.getElementById('projectGallery');
    const infoEl = document.getElementById('projectInfo');

    headerEl.innerHTML = '';
    galleryEl.innerHTML = '';
    infoEl.innerHTML = `
        <div class="project-not-found" style="grid-column: 1 / -1;">
            <h2>Project Not Found</h2>
            <p>The project you're looking for doesn't exist or has been removed.</p>
            <a href="projects.html" class="btn btn-primary">Back to Projects</a>
        </div>
    `;
}

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
    loadProjectDetail();
});
