document.addEventListener('DOMContentLoaded', async () => {
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

  window.sendToFlutter = function(msg) {
    if (window.FlutterApp && typeof window.FlutterApp.postMessage === 'function') {
      window.FlutterApp.postMessage(msg);
    }
  };

  window.sendToFlutter('SET_PORTRAIT');

  const splash = document.getElementById('splash');
  const startBtn = document.getElementById('btn-start-ar');
  const returnLandingBtn = document.getElementById('btn-return-landing');

  if (startBtn && splash) {
    startBtn.addEventListener('click', () => {
      window.sendToFlutter('SET_LANDSCAPE');

      if (screen.orientation && screen.orientation.lock) {
        screen.orientation.lock('landscape').catch(() => {});
      }

      const videos = document.querySelectorAll('video');
      videos.forEach(v => {
        v.setAttribute('playsinline', '');
        v.setAttribute('webkit-playsinline', '');
        v.play().catch(() => {});
      });

      UIManager.toggleFullscreen();

      splash.classList.add('hide');
      setTimeout(() => {
        splash.style.display = 'none';
        UIManager.setStatusBadge('Mencari Marker Melayu...', false);
      }, 600);
    });
  }

  if (returnLandingBtn && splash) {
    returnLandingBtn.addEventListener('click', () => {
      window.sendToFlutter('SET_PORTRAIT');
      if (screen.orientation && screen.orientation.unlock) {
        screen.orientation.unlock();
      }
      ARController.resetScanState();
      UIManager.closeDrawer();
      UIManager.closeModal();
      splash.style.display = 'flex';
      splash.classList.remove('hide');
    });
  }
});
