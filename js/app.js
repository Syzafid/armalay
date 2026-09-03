document.addEventListener('DOMContentLoaded', async () => {
  console.log('Initializing AR Melayu Multi-Marker Prototype...');

  UIManager.init();
  Gamification.init();

  await ArtifactLoader.loadArtifactsData();

  ARController.init();

  const splash = document.getElementById('splash');
  const startBtn = document.getElementById('btn-start-ar');

  if (startBtn && splash) {
    startBtn.addEventListener('click', () => {
      UIManager.toggleFullscreen();

      splash.classList.add('hide');
      setTimeout(() => {
        splash.style.display = 'none';
        UIManager.setStatusBadge('Mencari Marker Melayu...', false);
      }, 500);
    });
  }
});
