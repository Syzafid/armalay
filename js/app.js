document.addEventListener('DOMContentLoaded', async () => {
  UIManager.init();
  Gamification.init();

  await ArtifactLoader.loadArtifactsData();

  ARController.init();

  Landing3D.init();

  const prevBtn = document.getElementById('btn-landing-prev');
  const nextBtn = document.getElementById('btn-landing-next');
  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      Landing3D.prevArtifact();
      window.sendToFlutter('HAPTIC_FEEDBACK');
    });
  }
  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      Landing3D.nextArtifact();
      window.sendToFlutter('HAPTIC_FEEDBACK');
    });
  }

  window.addEventListener('keydown', (e) => {
    const splash = document.getElementById('splash');
    if (splash && splash.style.display !== 'none' && !splash.classList.contains('hide')) {
      if (e.key === 'ArrowLeft') {
        Landing3D.prevArtifact();
        window.sendToFlutter('HAPTIC_FEEDBACK');
      } else if (e.key === 'ArrowRight') {
        Landing3D.nextArtifact();
        window.sendToFlutter('HAPTIC_FEEDBACK');
      }
    }
  });

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
  if (screen.orientation && typeof screen.orientation.lock === 'function') {
    screen.orientation.lock('portrait').catch(() => {});
  }

  const guardBodyViewport = () => {
    const b = document.body;
    if (!b) return;
    if (b.style.marginLeft || b.style.marginTop || (b.style.width && b.style.width !== '100vw')) {
      b.style.marginLeft = '0px';
      b.style.marginTop = '0px';
      b.style.width = '100vw';
      b.style.height = '100dvh';
      if (typeof Landing3D !== 'undefined' && typeof Landing3D.onWindowResize === 'function') {
        Landing3D.onWindowResize();
      }
    }
  };

  if (typeof MutationObserver !== 'undefined' && document.body) {
    const bodyObserver = new MutationObserver(() => {
      guardBodyViewport();
    });
    bodyObserver.observe(document.body, { attributes: true, attributeFilter: ['style'] });
  }
  window.addEventListener('resize', guardBodyViewport);

  const splash = document.getElementById('splash');
  const startBtn = document.getElementById('btn-start-ar');
  const returnLandingBtn = document.getElementById('btn-return-landing');

  if (startBtn && splash) {
    startBtn.addEventListener('click', () => {
      document.body.classList.add('ar-mode-active');
      window.sendToFlutter('SET_LANDSCAPE');

      const videos = document.querySelectorAll('video');
      videos.forEach(v => {
        v.setAttribute('playsinline', '');
        v.setAttribute('webkit-playsinline', '');
        v.play().catch(() => {});
      });

      UIManager.toggleFullscreen();
      if (screen.orientation && typeof screen.orientation.lock === 'function') {
        screen.orientation.lock('landscape').catch(() => {});
      }

      splash.classList.add('hide');
      setTimeout(() => {
        splash.style.display = 'none';
        UIManager.setStatusBadge('Mencari Marker Melayu...', false);
        if (typeof ARController !== 'undefined' && typeof ARController.updateSmartPlacement === 'function') {
          ARController.updateSmartPlacement();
        }
      }, 600);
    });
  }

  if (returnLandingBtn && splash) {
    returnLandingBtn.addEventListener('click', () => {
      document.body.classList.remove('ar-mode-active');
      window.sendToFlutter('SET_PORTRAIT');
      if (screen.orientation && typeof screen.orientation.lock === 'function') {
        screen.orientation.lock('portrait').catch(() => {
          if (screen.orientation && typeof screen.orientation.unlock === 'function') {
            screen.orientation.unlock();
          }
        });
      } else if (screen.orientation && typeof screen.orientation.unlock === 'function') {
        screen.orientation.unlock();
      }
      ARController.resetScanState();
      UIManager.closeDrawer();
      UIManager.closeModal();
      splash.style.display = 'flex';
      splash.classList.remove('hide');
      setTimeout(() => {
        if (typeof Landing3D !== 'undefined' && typeof Landing3D.onWindowResize === 'function') {
          Landing3D.onWindowResize();
        }
      }, 250);
    });
  }
});
