/* AR Melayu - UI Manager Module (Drawer, Header, Modals, Fullscreen) */

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
      btnResetAR: document.getElementById('btn-reset-ar'),
      modalOverlay: document.getElementById('modal-overlay'),
      modalTitle: document.getElementById('modal-title'),
      modalBody: document.getElementById('modal-body'),
      btnCloseModal: document.getElementById('btn-close-modal')
    };

    this.attachEvents();
  },

  attachEvents() {
    // Drawer Toggles
    if (this.elements.btnHamburger) {
      this.elements.btnHamburger.addEventListener('click', () => this.openDrawer());
    }
    if (this.elements.btnCloseDrawer) {
      this.elements.btnCloseDrawer.addEventListener('click', () => this.closeDrawer());
    }

    // Fullscreen Toggles
    if (this.elements.btnFullscreenToggle) {
      this.elements.btnFullscreenToggle.addEventListener('click', () => this.toggleFullscreen());
    }
    if (this.elements.btnDrawerFullscreen) {
      this.elements.btnDrawerFullscreen.addEventListener('click', () => {
        this.closeDrawer();
        this.toggleFullscreen();
      });
    }

    // Modal Close
    if (this.elements.btnCloseModal) {
      this.elements.btnCloseModal.addEventListener('click', () => this.closeModal());
    }

    // History Modal Button
    if (this.elements.btnHistory) {
      this.elements.btnHistory.addEventListener('click', () => {
        this.closeDrawer();
        const activeData = ARController.activeArtifact;
        if (activeData) {
          this.openModal(`📜 Sejarah ${activeData.title}`, `<p>${activeData.historyText}</p>`);
        } else {
          this.openModal('📜 Sejarah Artefak', '<p>Belum ada artefak yang ter-scan. Silakan pindai marker terlebih dahulu.</p>');
        }
      });
    }

    // Reset AR Button
    if (this.elements.btnResetAR) {
      this.elements.btnResetAR.addEventListener('click', () => {
        this.closeDrawer();
        ARController.resetScanState();
      });
    }
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
