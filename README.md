# 🧠 The Knowledge Paradox

**An interactive web experience exploring 10 mind-bending scientific and philosophical concepts.**

![Project Banner](https://via.placeholder.com/1000x400?text=The+Knowledge+Paradox+Screenshot)

## 📖 Overview

The Knowledge Paradox is a responsive Single Page Application (SPA) designed to make complex topics—like Quantum Tunneling and The Ship of Theseus—accessible and engaging. 

The project utilizes a clean, dark-themed UI with interactive 3D background elements to create an immersive learning environment. It features dynamic content loading to ensure a smooth user experience without page reloads.

## 🚀 Features

* **⚡ Single Page Application (SPA) Architecture:** Content updates dynamically using JavaScript DOM manipulation, eliminating page reloads.
* **✨ 3D Particle Background:** A custom interactive background built with **Three.js** that responds to window resizing.
* **📱 Fully Responsive:** Optimized layout for both desktop (sidebar navigation) and mobile devices (scrollable content).
* **🎥 Smart Video Facade:** Implements a "Click-to-Load" video pattern. Instead of loading heavy Iframe embeds immediately, light thumbnails are loaded first. The YouTube Iframe is only injected when the user clicks play, significantly improving page load speed and performance.
* **🎨 Modern UI/UX:** Glassmorphism effects, gradient text, and smooth CSS transitions.

## 📚 Topics Covered

1.  **Baader–Meinhof Phenomenon** (The Frequency Illusion)
2.  **Quantum Tunneling**
3.  **Semantic Satiation**
4.  **Emergence Theory**
5.  **The Fermi Paradox**
6.  **Cryptomnesia**
7.  **Pareto Principle** (80/20 Rule)
8.  **Cognitive Load Theory**
9.  **Heisenberg’s Uncertainty Principle**
10. **The Ship of Theseus**

## 🛠️ Technologies Used

* **HTML5** (Semantic Structure)
* **CSS3** (Flexbox, Grid, CSS Variables, Animations)
* **JavaScript (ES6+)** (DOM Manipulation, Logic)
* **Three.js** (WebGL 3D Rendering)

## ⚙️ Installation & Usage

Since this project uses vanilla web technologies, no build step (like npm or webpack) is strictly required.

### Method 1: The Best Way (VS Code Live Server)
To ensure video embeds and 3D textures load correctly without browser security restrictions:

1.  Clone this repository.
2.  Open the folder in **VS Code**.
3.  Install the **Live Server** extension.
4.  Right-click `index.html` and select **"Open with Live Server"**.

### Method 2: Direct Open
1.  Simply double-click `index.html` to open it in your browser.
    * *Note: Some browsers may restrict local file access, which might affect the 3D background or video autoplay.*

## 📂 Project Structure

```text
/
├── index.html      # Contains HTML, CSS, and JS logic
├── README.md       # Project Documentation
└── (assets)        # Images are currently hosted via CDN/Wikipedia
