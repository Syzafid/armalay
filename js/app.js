document.addEventListener('DOMContentLoaded', async () => {
  console.log('Initializing AR Melayu Multi-Marker Application...');

  UIManager.init();
  Gamification.init();

  await ArtifactLoader.loadArtifactsData();

  ARController.init();

  Landing3D.init();

  const prevBtn = document.getElementById('btn-landing-prev');
  const nextBtn = document.getElementById('btn-landing-next');
  if (prevBtn) {
    prevBtn.addEventListener('click', () => Landing3D.prevArtifact());
  }
  if (nextBtn) {
    nextBtn.addEventListener('click', () => Landing3D.nextArtifact());
  }

  const navMarkerLink = document.getElementById('nav-marker-link');
  if (navMarkerLink) {
    navMarkerLink.addEventListener('click', (e) => {
      e.preventDefault();
      UIManager.openMarkerGallery();
    });
  }

  const splash = document.getElementById('splash');
  const startBtn = document.getElementById('btn-start-ar');

  if (startBtn && splash) {
    startBtn.addEventListener('click', () => {
      UIManager.toggleFullscreen();

      splash.classList.add('hide');
      setTimeout(() => {
        splash.style.display = 'none';
        UIManager.setStatusBadge('Mencari Marker Melayu...', false);
      }, 600);
    });
  }
});
