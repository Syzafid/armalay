const UIManager = {
  elements: {},

  init() {
    this.elements = {
      headerBadge: document.getElementById('artifact-header-badge'),
      titleEl: document.getElementById('artifact-title'),
      subtitleEl: document.getElementById('artifact-subtitle'),
      statusBadge: document.getElementById('marker-status-badge'),
      btnHamburger: document.getElementById('btn-hamburger'),
      btnFullscreenToggle: document.getElementById('btn-fullscreen-toggle'),
      btnDrawerFullscreen: document.getElementById('btn-drawer-fullscreen'),
      drawerMenu: document.getElementById('drawer-menu'),
      btnCloseDrawer: document.getElementById('btn-close-drawer'),
      btnHistory: document.getElementById('btn-history'),
      btnQuiz: document.getElementById('btn-quiz'),
      btnMarkerGallery: document.getElementById('btn-marker-gallery'),
      btnResetAR: document.getElementById('btn-reset-ar'),
      modalOverlay: document.getElementById('modal-overlay'),
      modalTitle: document.getElementById('modal-title'),
      modalBody: document.getElementById('modal-body'),
      btnCloseModal: document.getElementById('btn-close-modal')
    };

    this.attachEvents();
  },

  attachEvents() {
    if (this.elements.btnHamburger) {
      this.elements.btnHamburger.addEventListener('click', () => this.openDrawer());
    }
    if (this.elements.btnCloseDrawer) {
      this.elements.btnCloseDrawer.addEventListener('click', () => this.closeDrawer());
    }

    if (this.elements.btnFullscreenToggle) {
      this.elements.btnFullscreenToggle.addEventListener('click', () => this.toggleFullscreen());
    }
    if (this.elements.btnDrawerFullscreen) {
      this.elements.btnDrawerFullscreen.addEventListener('click', () => {
        this.closeDrawer();
        this.toggleFullscreen();
      });
    }

    if (this.elements.btnCloseModal) {
      this.elements.btnCloseModal.addEventListener('click', () => this.closeModal());
    }

    if (this.elements.btnHistory) {
      this.elements.btnHistory.addEventListener('click', () => {
        this.closeDrawer();
        const activeData = ARController.activeArtifact;
        if (activeData) {
          this.openModal(`Sejarah ${activeData.title}`, `<p>${activeData.historyText}</p>`);
        } else {
          this.openModal('Sejarah Artefak', '<p>Belum ada artefak yang ter-scan. Silakan pindai marker terlebih dahulu.</p>');
        }
      });
    }

    if (this.elements.btnMarkerGallery) {
      this.elements.btnMarkerGallery.addEventListener('click', () => {
        this.openMarkerGallery();
      });
    }

    if (this.elements.btnResetAR) {
      this.elements.btnResetAR.addEventListener('click', () => {
        this.closeDrawer();
        ARController.resetScanState();
        if (window.sendToFlutter) {
          window.sendToFlutter('SET_LANDSCAPE');
        }
      });
    }
  },

  openMarkerGallery() {
    this.closeDrawer();
    const artifacts = ArtifactLoader.data;
    if (!artifacts || Object.keys(artifacts).length === 0) {
      this.openModal('Galeri Marker AR Melayu', '<p>Data marker belum siap.</p>');
      return;
    }

    let cardsHtml = '';
    const keys = ['owl-marker', 'rumah-adat-marker', 'cerana-marker', 'perasapan-marker'];

    keys.forEach(key => {
      const item = artifacts[key];
      if (item) {
        cardsHtml += `
          <div class="marker-card">
            <div class="marker-card-img-wrapper">
              <img src="${item.markerImg}" alt="${item.title}" />
            </div>
            <div class="marker-card-title">${item.title}</div>
            <div class="marker-card-sub">${item.category}</div>
            <a href="${item.markerImg}" download="${key}.png" class="btn-download-marker">
              Unduh Marker PNG
            </a>
          </div>
        `;
      }
    });

    const bodyHtml = `
      <p style="margin-bottom: 12px; font-size: 11px; color: var(--color-text-muted); line-height: 1.4;">
        Arahkan kamera ke salah satu gambar marker PNG di bawah ini. Anda dapat mengunduh PNG marker untuk dicetak/discan langsung dari layar lain. Untuk mengubah PNG menjadi file <code>.patt</code> custom, unggah gambar ke <a href="https://ar-js-org.github.io/AR.js/three.js/examples/marker-training/examples/generator.html" target="_blank" style="color:var(--color-gold); font-weight:bold;">AR.js Marker Training Generator</a>.
      </p>
      <div class="marker-grid">
        ${cardsHtml}
      </div>
    `;

    this.openModal('Galeri Marker AR Melayu', bodyHtml);
  },

  toggleFullscreen() {
    if (!document.fullscreenElement && !document.webkitFullscreenElement && !document.mozFullScreenElement && !document.msFullscreenElement) {
      const docEl = document.documentElement;
      if (docEl.requestFullscreen) {
        docEl.requestFullscreen().catch(err => console.log('Fullscreen blocked:', err));
      } else if (docEl.webkitRequestFullscreen) {
        docEl.webkitRequestFullscreen();
      } else if (docEl.mozRequestFullScreen) {
        docEl.mozRequestFullScreen();
      } else if (docEl.msRequestFullscreen) {
        docEl.msRequestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
      } else if (document.mozCancelFullScreen) {
        document.mozCancelFullScreen();
      } else if (document.msExitFullscreen) {
        document.msExitFullscreen();
      }
    }
  },

  setHeaderInfo(title, subtitle) {
    if (this.elements.titleEl) this.elements.titleEl.textContent = title;
    if (this.elements.subtitleEl) this.elements.subtitleEl.textContent = subtitle;
    if (this.elements.headerBadge) this.elements.headerBadge.style.display = 'flex';
  },

  hideHeaderInfo() {
    if (this.elements.headerBadge) this.elements.headerBadge.style.display = 'none';
  },

  setStatusBadge(text, isLocked = false) {
    if (!this.elements.statusBadge) return;
    this.elements.statusBadge.textContent = text;
    if (isLocked) {
      this.elements.statusBadge.classList.add('locked');
    } else {
      this.elements.statusBadge.classList.remove('locked');
    }
  },

  openDrawer() {
    if (this.elements.drawerMenu) this.elements.drawerMenu.classList.add('open');
    ARController.hideControllerPad();
  },

  closeDrawer() {
    if (this.elements.drawerMenu) this.elements.drawerMenu.classList.remove('open');
    if (!this.isModalActive() && ARController.isScannedLocked) {
      ARController.showControllerPad();
    }
  },

  openModal(title, htmlBody) {
    if (this.elements.modalTitle) this.elements.modalTitle.innerHTML = title;
    if (this.elements.modalBody) this.elements.modalBody.innerHTML = htmlBody;
    if (this.elements.modalOverlay) this.elements.modalOverlay.classList.add('active');
    ARController.hideControllerPad();
  },

  closeModal() {
    if (this.elements.modalOverlay) this.elements.modalOverlay.classList.remove('active');
    if (!this.isDrawerOpen() && ARController.isScannedLocked) {
      ARController.showControllerPad();
    }
  },

  isDrawerOpen() {
    return this.elements.drawerMenu && this.elements.drawerMenu.classList.contains('open');
  },

  isModalActive() {
    return this.elements.modalOverlay && this.elements.modalOverlay.classList.contains('active');
  }
};
