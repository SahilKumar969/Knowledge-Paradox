// --- APP LOGIC ---

const navList = document.getElementById('nav-list');
const contentDisplay = document.getElementById('content-display');

// Initialize an empty array to hold the data
let topicsData = [];

// NEW: Function to Fetch Data from JSON file
async function loadData() {
    try {
        const response = await fetch('topics.json');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        topicsData = await response.json();
        
        // Only start the app after data is received
        initNavigation();
    } catch (error) {
        console.error("Could not load topics.json:", error);
        contentDisplay.innerHTML = `<h2 style="text-align:center; color: red; margin-top:50px;">Error loading data.<br>Please ensure you are using a Local Server (e.g. Live Server).</h2>`;
    }
}

function initNavigation() {
    navList.innerHTML = ''; // Clear existing items
    topicsData.forEach((topic, index) => {
        const li = document.createElement('li');
        const button = document.createElement('button');
        button.className = 'topic-btn';
        button.innerHTML = `<span class="topic-number">${index + 1}.</span> ${topic.title}`;
        button.addEventListener('click', () => loadTopic(index));
        li.appendChild(button);
        navList.appendChild(li);
    });
    // Automatically load the first topic
    if (topicsData.length > 0) {
        loadTopic(0);
    }
}

// Function to activate video only when clicked
function activateVideo(videoId, containerId) {
    const container = document.getElementById(containerId);
    container.innerHTML = `<iframe src="https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1" title="YouTube video player" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`;
}

function loadTopic(index) {
    const btns = document.querySelectorAll('.topic-btn');
    btns.forEach(btn => btn.classList.remove('active'));
    if(btns[index]) btns[index].classList.add('active');

    const data = topicsData[index];
    contentDisplay.classList.remove('visible');

    setTimeout(() => {
        let videoHTML = '';
        const containerId = `video-container-${index}`;
        
        // Use the "Facade" (Image + Play Button)
        if(data.videoId && data.videoId.length > 2) {
            videoHTML = `
                <div class="video-container" id="${containerId}" onclick="activateVideo('${data.videoId}', '${containerId}')">
                    <img src="https://img.youtube.com/vi/${data.videoId}/maxresdefault.jpg" class="video-thumbnail" alt="Video Thumbnail">
                    <div class="play-button"></div>
                </div>
            `;
        } else {
             videoHTML = `<div class="video-wrapper" style="background: #222; display: flex; justify-content: center; align-items: center; color: #666;">Video Unavailable</div>`;
        }

        contentDisplay.innerHTML = `
            <h2 class="content-title">${data.title}</h2>
            <p class="concept-tagline">${data.tagline}</p>
            
            <div class="visual-container">
                <img src="${data.imageUrl}" alt="${data.title}" class="main-image">
            </div>
             <div class="description-text">
                ${data.description}
            </div>
            ${videoHTML}
        `;
        contentDisplay.classList.add('visible');
        
        if(window.innerWidth < 900) {
             document.querySelector('.content-area').scrollTop = 0;
        }
    }, 300);
}

// Start the loading process
loadData();

// --- THREE.JS BACKGROUND ---
try {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / 200, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ alpha: true });
    renderer.setSize(window.innerWidth, 200);
    document.getElementById('canvas-container').appendChild(renderer.domElement);

    const geometry = new THREE.BufferGeometry();
    const vertices = [];
    for (let i = 0; i < 600; i++) {
        vertices.push(THREE.MathUtils.randFloatSpread(600)); 
        vertices.push(THREE.MathUtils.randFloatSpread(600)); 
        vertices.push(THREE.MathUtils.randFloatSpread(600)); 
    }
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
    const material = new THREE.PointsMaterial({ color: 0x00d2ff, size: 3, transparent: true, opacity: 0.5 });
    const points = new THREE.Points(geometry, material);
    scene.add(points);

    camera.position.z = 400;

    function animate() {
        requestAnimationFrame(animate);
        points.rotation.x += 0.001;
        points.rotation.y += 0.002;
        renderer.render(scene, camera);
    }
    animate();

    window.addEventListener('resize', () => {
        const width = window.innerWidth;
        const height = document.getElementById('hero-container').clientHeight;
        renderer.setSize(width, height);
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
    });
} catch(e) { console.log("Three.js error", e); }