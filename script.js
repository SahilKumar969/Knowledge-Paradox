// --- APP LOGIC ---

const navList = document.getElementById('nav-list');
const contentDisplay = document.getElementById('content-display');
const quizContainer = document.getElementById('quiz-container');

// Elements for Quiz
const quizBox = document.getElementById('quiz-box');
const questionText = document.getElementById('question-text');
const optionsContainer = document.getElementById('options-container');
const nextBtn = document.getElementById('next-btn');
const restartBtn = document.getElementById('restart-btn');
const scoreDisplay = document.getElementById('score-display');
const quizNavBtn = document.getElementById('quiz-nav-btn'); // Top right button

// Initialize arrays to hold data
let topicsData = [];
let quizData = [];
let currentQuestionIndex = 0;
let score = 0;

// --- DATA FETCHING ---

// Fetch Topics
async function loadTopics() {
    try {
        const response = await fetch('topics.json');
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        topicsData = await response.json();
        initNavigation();
    } catch (error) {
        console.error("Could not load topics.json:", error);
        contentDisplay.innerHTML = `<h2 style="text-align:center; color: red; margin-top:50px;">Error loading data.<br>Please ensure you are using a Local Server (e.g. Live Server).</h2>`;
    }
}

// Fetch Quiz Data (NEW)
async function loadQuizData() {
    try {
        const response = await fetch('quiz.json');
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        quizData = await response.json();
        console.log("Quiz data loaded:", quizData.length, "questions");
    } catch (error) {
        console.error("Could not load quiz.json:", error);
    }
}

// --- NAVIGATION & CONTENT ---

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
    
    // Automatically load the first topic if available
    if (topicsData.length > 0) {
        loadTopic(0);
    }
}

function loadTopic(index) {
    // Hide quiz, show content
    quizContainer.classList.add('hidden');
    contentDisplay.classList.remove('hidden');

    // Update active sidebar button
    const btns = document.querySelectorAll('.topic-btn');
    btns.forEach(btn => btn.classList.remove('active'));
    if(btns[index]) btns[index].classList.add('active');

    const data = topicsData[index];
    contentDisplay.classList.remove('visible');

    setTimeout(() => {
        let videoHTML = '';
        const containerId = `video-container-${index}`;
        
        // Video Facade
        if(data.videoId && data.videoId.length > 2) {
            videoHTML = `
                <div class="video-container" id="${containerId}" onclick="activateVideo('${data.videoId}', '${containerId}')">
                    <img src="https://img.youtube.com/vi/${data.videoId}/maxresdefault.jpg" class="video-thumbnail" alt="Video Thumbnail">
                    <div class="play-button"></div>
                </div>
            `;
        } else {
             videoHTML = `<div class="video-wrapper" style="background: #222; display: flex; justify-content: center; align-items: center; color: #666; height: 300px; border-radius: 12px;">Video Unavailable</div>`;
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
        
        // Mobile scroll reset
        if(window.innerWidth < 900) {
             document.querySelector('.content-area').scrollTop = 0;
        }
    }, 300);
}

// Function to activate video iframe
function activateVideo(videoId, containerId) {
    const container = document.getElementById(containerId);
    container.innerHTML = `<iframe src="https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1" title="YouTube video player" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`;
}


// --- QUIZ LOGIC ---

// Event Listener for the "Take Quiz" button
if (quizNavBtn) {
    quizNavBtn.addEventListener('click', startQuiz);
}

function startQuiz() {
    // Check if data is loaded
    if (quizData.length === 0) {
        alert("Quiz data is still loading... please try again in a moment.");
        return;
    }

    // UI Updates: Hide Content, Show Quiz
    contentDisplay.classList.add('hidden');
    quizContainer.classList.remove('hidden');
    
    // Deactivate sidebar buttons
    document.querySelectorAll('.topic-btn').forEach(btn => btn.classList.remove('active'));

    // Reset Quiz State
    currentQuestionIndex = 0;
    score = 0;
    scoreDisplay.classList.add('hidden');
    quizBox.classList.remove('hidden');
    restartBtn.classList.add('hidden');
    nextBtn.classList.add('hidden');

    loadQuestion();
}

function loadQuestion() {
    resetState();
    let currentQuestion = quizData[currentQuestionIndex];
    questionText.innerText = `${currentQuestionIndex + 1}. ${currentQuestion.question}`;

    currentQuestion.options.forEach((option, index) => {
        const button = document.createElement('button');
        button.innerText = option;
        button.classList.add('option-btn');
        button.addEventListener('click', () => selectAnswer(index, currentQuestion.correct, button));
        optionsContainer.appendChild(button);
    });
}

function resetState() {
    nextBtn.classList.add('hidden');
    while (optionsContainer.firstChild) {
        optionsContainer.removeChild(optionsContainer.firstChild);
    }
}

function selectAnswer(selectedIndex, correctIndex, selectedButton) {
    const allButtons = optionsContainer.children;
    
    // Disable all buttons to prevent re-selection
    Array.from(allButtons).forEach(btn => btn.disabled = true);

    if (selectedIndex === correctIndex) {
        selectedButton.classList.add('correct');
        score++;
    } else {
        selectedButton.classList.add('wrong');
        // Highlight the correct answer so they learn
        if(allButtons[correctIndex]) {
            allButtons[correctIndex].classList.add('correct');
        }
    }

    // Logic for Next Button or Finish
    if (currentQuestionIndex < quizData.length - 1) {
        nextBtn.classList.remove('hidden');
    } else {
        setTimeout(showScore, 1000); // Small delay before showing score
    }
}

function showScore() {
    quizBox.classList.add('hidden');
    nextBtn.classList.add('hidden');
    scoreDisplay.classList.remove('hidden');
    restartBtn.classList.remove('hidden');
    
    let message = "";
    if (score === quizData.length) message = "Perfect Score! You are a Genius! 🌌";
    else if (score > quizData.length / 2) message = "Great job! You know your paradoxes! 🚀";
    else message = "Keep learning! The universe is full of mysteries. 📚";

    scoreDisplay.innerHTML = `
        <h3>Quiz Completed!</h3>
        <p>You scored <strong>${score}</strong> out of <strong>${quizData.length}</strong></p>
        <p style="margin-top:10px; color: #a29bfe;">${message}</p>
    `;
}

// Next Button Click
nextBtn.addEventListener('click', () => {
    currentQuestionIndex++;
    loadQuestion();
});

// Restart Button Click
restartBtn.addEventListener('click', startQuiz);


// --- INITIALIZATION ---

// Load both data files on startup
loadTopics();
loadQuizData();


// --- THREE.JS BACKGROUND ---
try {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / 200, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ alpha: true });
    
    // Initial size setting
    renderer.setSize(window.innerWidth, 200); // Height matches CSS usually
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
        // Adjust height dynamically or keep fixed
        const height = document.getElementById('hero-container') ? document.getElementById('hero-container').clientHeight : 200;
        renderer.setSize(width, height);
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
    });
} catch(e) { console.log("Three.js error", e); }