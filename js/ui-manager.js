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
      btnDocs: document.getElementById('btn-docs'),
      navDocsLink: document.getElementById('nav-docs-link'),
      btnResetAR: document.getElementById('btn-reset-ar'),
      modalOverlay: document.getElementById('modal-overlay'),
      modalTitle: document.getElementById('modal-title'),
      modalBody: document.getElementById('modal-body'),
      btnCloseModal: document.getElementById('btn-close-modal'),
      markerPresentationModal: document.getElementById('marker-presentation-modal'),
      markerPresentationImg: document.getElementById('marker-presentation-img'),
      markerPresentationTitle: document.getElementById('marker-presentation-title'),
      btnCloseMarkerPresentation: document.getElementById('btn-close-marker-presentation')
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

    if (this.elements.modalOverlay) {
      this.elements.modalOverlay.addEventListener('click', (e) => {
        if (e.target === this.elements.modalOverlay) {
          this.closeModal();
        }
      });
    }

    if (this.elements.btnCloseMarkerPresentation) {
      this.elements.btnCloseMarkerPresentation.addEventListener('click', () => this.closeMarkerPresentation());
    }

    if (this.elements.markerPresentationModal) {
      this.elements.markerPresentationModal.addEventListener('click', (e) => {
        if (e.target === this.elements.markerPresentationModal) {
          this.closeMarkerPresentation();
        }
      });
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

    if (this.elements.btnDocs) {
      this.elements.btnDocs.addEventListener('click', () => {
        this.openDocsModal();
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

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        if (this.isMarkerPresentationActive()) {
          this.closeMarkerPresentation();
        } else if (this.isModalActive()) {
          this.closeModal();
        } else if (this.isDrawerOpen()) {
          this.closeDrawer();
        }
      }
    });
  },

  openMarkerGallery() {
    this.closeDrawer();
    const artifacts = ArtifactLoader.data;
    if (!artifacts || Object.keys(artifacts).length === 0) {
      this.openModal('Galeri Marker AR Melayu', '<p>Data marker belum siap.</p>');
      return;
    }

    let cardsHtml = '';
    const keys = ['owl-marker', 'rumah-adat-marker', 'cerana-marker', 'perasapan-marker', 'kampil-marker', 'perhapuran-marker', 'ketur-marker'];

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
            <button type="button" class="btn-inspect-marker" onclick="UIManager.presentMarkerFullscreen('${item.markerImg}', '${item.title}')">
              Tampilkan di Layar
            </button>
            <a href="${item.markerImg}" download="${key}.png" class="btn-download-marker">
              Unduh Marker PNG
            </a>
          </div>
        `;
      }
    });

    const bodyHtml = `
      <p style="margin-bottom: 14px; font-size: 12px; color: #E2DDD2; line-height: 1.5;">
        Arahkan kamera ke salah satu gambar marker di bawah ini. Anda dapat mengklik tombol <strong>Tampilkan di Layar</strong> untuk menampilkan gambar besar di monitor laptop/PC lalu memindainya langsung dari HP Anda.
      </p>
      <div class="marker-grid">
        ${cardsHtml}
      </div>
    `;

    this.openModal('Galeri Marker AR Melayu', bodyHtml);
  },

  presentMarkerFullscreen(imgSrc, title) {
    if (this.elements.markerPresentationImg) {
      this.elements.markerPresentationImg.src = imgSrc;
    }
    if (this.elements.markerPresentationTitle) {
      this.elements.markerPresentationTitle.textContent = title;
    }
    if (this.elements.markerPresentationModal) {
      this.elements.markerPresentationModal.classList.add('active');
    }
  },

  closeMarkerPresentation() {
    if (this.elements.markerPresentationModal) {
      this.elements.markerPresentationModal.classList.remove('active');
    }
  },

  isMarkerPresentationActive() {
    return this.elements.markerPresentationModal && this.elements.markerPresentationModal.classList.contains('active');
  },

  openDocsModal() {
    this.closeDrawer();
    const bodyHtml = `
      <div style="font-size:13px; line-height:1.6; color:#F0ECE1;">
        <p style="margin-bottom:12px;">
          Pelajari seluk-beluk arsitektur sistem, teknologi <strong>One-Time Scan &amp; Persistent Lock</strong>, integrasi <strong>Android Hybrid Container Shell</strong>, serta katalog lengkap 7 artefak budaya Melayu dan pengujian sistem.
        </p>
        <div style="display:flex; flex-direction:column; gap:10px; margin-top:16px;">
          <a href="https://armalay-docs.vercel.app" target="_blank" rel="noopener noreferrer" class="btn-download-marker" style="display:block; text-align:center; text-decoration:none; padding:10px; font-weight:700;">
            Buka Portal Dokumentasi (Docusaurus)
          </a>
          <a href="https://github.com/Syzafid/armalay" target="_blank" rel="noopener noreferrer" style="display:block; text-align:center; text-decoration:none; color:var(--color-gold); font-size:12px; font-weight:600; padding:6px;">
            Lihat Repositori Source Code GitHub
          </a>
        </div>
      </div>
    `;
    this.openModal('Dokumentasi &amp; Arsitektur Sistem', bodyHtml);
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
    if (typeof ARController !== 'undefined' && typeof ARController.updateSmartPlacement === 'function') {
      ARController.updateSmartPlacement();
    }
  },

  closeDrawer() {
    if (this.elements.drawerMenu) this.elements.drawerMenu.classList.remove('open');
    if (!this.isModalActive() && !this.isMarkerPresentationActive() && ARController.isScannedLocked) {
      ARController.showControllerPad();
    }
    if (typeof ARController !== 'undefined' && typeof ARController.updateSmartPlacement === 'function') {
      ARController.updateSmartPlacement();
    }
  },

  openModal(title, htmlBody) {
    if (this.elements.modalTitle) this.elements.modalTitle.innerHTML = title;
    if (this.elements.modalBody) this.elements.modalBody.innerHTML = htmlBody;
    if (this.elements.modalOverlay) this.elements.modalOverlay.classList.add('active');
    ARController.hideControllerPad();
    if (typeof ARController !== 'undefined' && typeof ARController.updateSmartPlacement === 'function') {
      ARController.updateSmartPlacement();
    }
  },

  closeModal() {
    if (this.elements.modalOverlay) this.elements.modalOverlay.classList.remove('active');
    if (!this.isDrawerOpen() && !this.isMarkerPresentationActive() && ARController.isScannedLocked) {
      ARController.showControllerPad();
    }
    if (typeof ARController !== 'undefined' && typeof ARController.updateSmartPlacement === 'function') {
      ARController.updateSmartPlacement();
    }
  },

  isDrawerOpen() {
    return this.elements.drawerMenu && this.elements.drawerMenu.classList.contains('open');
  },

  isModalActive() {
    return this.elements.modalOverlay && this.elements.modalOverlay.classList.contains('active');
  }
};
