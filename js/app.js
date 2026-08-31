/* AR Melayu - Main Application Initialiser */

document.addEventListener('DOMContentLoaded', async () => {
  console.log('🚀 Initializing AR Melayu Multi-Marker Prototype...');

  // Initialize UI & Gamification Modules
  UIManager.init();
  Gamification.init();

  // Load JSON Artifact Database
  await ArtifactLoader.loadArtifactsData();

  // Initialize AR Controller
  ARController.init();

  // Splash Screen Button Event
  const splash = document.getElementById('splash');
  const startBtn = document.getElementById('btn-start-ar');
  const arScene = document.getElementById('ar-scene');

  if (startBtn && splash) {
    startBtn.addEventListener('click', () => {
      splash.classList.add('hide');
      setTimeout(() => {
        splash.style.display = 'none';
        if (arScene) arScene.style.display = '';
        UIManager.setStatusBadge('🔍 Mencari Marker Melayu...', false);
      }, 500);
    });
  }
});
