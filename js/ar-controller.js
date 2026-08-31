/* AR Melayu - AR Controller Module (Multi-Marker, Persistent Lock, D-Pad Controls) */

const ARController = {
  isScannedLocked: false,
  activeArtifact: null,
  activeModelEl: null,
  controllerPadEl: null,

  // Transform States
  rotX: 0,
  rotY: 30,
  scaleFactor: 0.6,

  init() {
    this.activeModelEl = document.getElementById('fixed-3d-model');
    this.controllerPadEl = document.getElementById('model-controller-pad');
    this.attachMarkerListeners();
    this.attachDPadListeners();
  },

  attachMarkerListeners() {
    const markers = document.querySelectorAll('a-marker');
    markers.forEach(marker => {
      marker.addEventListener('markerFound', () => {
        if (this.isScannedLocked) {
          console.log('🔒 System locked. Ignoring re-scan of marker:', marker.id);
          return;
        }

        const markerId = marker.getAttribute('id');
        const artifactData = ArtifactLoader.getArtifactById(markerId);

        if (artifactData) {
          this.lockArtifact(artifactData);
        }
      });

      marker.addEventListener('markerLost', () => {
        if (this.isScannedLocked) {
          console.log('🔒 Marker lost, but 3D model remains locked on screen.');
          return;
        }
      });
    });
  },

  attachDPadListeners() {
    const btnUp = document.getElementById('btn-rot-up');
    const btnDown = document.getElementById('btn-rot-down');
    const btnLeft = document.getElementById('btn-rot-left');
    const btnRight = document.getElementById('btn-rot-right');
    const btnReset = document.getElementById('btn-rot-reset');
    const btnZoomIn = document.getElementById('btn-zoom-in');
    const btnZoomOut = document.getElementById('btn-zoom-out');

    if (btnUp) btnUp.addEventListener('click', () => this.rotateModel(-15, 0));
    if (btnDown) btnDown.addEventListener('click', () => this.rotateModel(15, 0));
    if (btnLeft) btnLeft.addEventListener('click', () => this.rotateModel(0, -15));
    if (btnRight) btnRight.addEventListener('click', () => this.rotateModel(0, 15));
    if (btnReset) btnReset.addEventListener('click', () => this.resetTransform());
    if (btnZoomIn) btnZoomIn.addEventListener('click', () => this.zoomModel(0.1));
    if (btnZoomOut) btnZoomOut.addEventListener('click', () => this.zoomModel(-0.1));
  },

  lockArtifact(artifactData) {
    this.isScannedLocked = true;
    this.activeArtifact = artifactData;

    console.log('📌 Locking Artifact:', artifactData.title);

    // Reset initial transform states
    this.rotX = 0;
    this.rotY = 30;
    this.scaleFactor = 0.6;

    // Update Header Text Minimalis
    UIManager.setHeaderInfo(artifactData.title, artifactData.subtitle);
    UIManager.setStatusBadge(`🔒 Terkunci: ${artifactData.title}`, true);

    // Load & Render 3D Model on Left Side Camera Anchor Viewport (-0.55 -0.05 -1.8)
    if (this.activeModelEl) {
      this.activeModelEl.setAttribute('gltf-model', artifactData.modelPath);
      this.activeModelEl.setAttribute('scale', `${this.scaleFactor} ${this.scaleFactor} ${this.scaleFactor}`);
      this.activeModelEl.setAttribute('position', artifactData.position || '-0.55 -0.05 -1.8');
      this.activeModelEl.setAttribute('rotation', `${this.rotX} ${this.rotY} 0`);
      this.activeModelEl.setAttribute('visible', 'true');
    }

    // Show D-Pad Controller
    this.showControllerPad();
  },

  rotateModel(deltaX, deltaY) {
    if (!this.activeModelEl || !this.isScannedLocked) return;

    this.rotX = (this.rotX + deltaX) % 360;
    this.rotY = (this.rotY + deltaY) % 360;

    this.activeModelEl.setAttribute('rotation', `${this.rotX} ${this.rotY} 0`);
  },

  zoomModel(deltaScale) {
    if (!this.activeModelEl || !this.isScannedLocked) return;

    this.scaleFactor = Math.min(Math.max(0.2, this.scaleFactor + deltaScale), 1.5);
    const s = this.scaleFactor.toFixed(2);
    this.activeModelEl.setAttribute('scale', `${s} ${s} ${s}`);
  },

  resetTransform() {
    if (!this.activeModelEl || !this.isScannedLocked) return;

    this.rotX = 0;
    this.rotY = 30;
    this.scaleFactor = 0.6;
    this.activeModelEl.setAttribute('rotation', `${this.rotX} ${this.rotY} 0`);
    this.activeModelEl.setAttribute('scale', `${this.scaleFactor} ${this.scaleFactor} ${this.scaleFactor}`);
  },

  showControllerPad() {
    if (this.controllerPadEl && this.isScannedLocked) {
      this.controllerPadEl.style.display = 'flex';
      this.controllerPadEl.classList.remove('hide-pad');
    }
  },

  hideControllerPad() {
    if (this.controllerPadEl) {
      this.controllerPadEl.classList.add('hide-pad');
    }
  },

  resetScanState() {
    console.log('🔄 Resetting AR Scan State...');
    this.isScannedLocked = false;
    this.activeArtifact = null;

    if (this.activeModelEl) {
      this.activeModelEl.setAttribute('visible', 'false');
      this.activeModelEl.removeAttribute('gltf-model');
    }

    this.hideControllerPad();
    if (this.controllerPadEl) {
      this.controllerPadEl.style.display = 'none';
    }

    UIManager.hideHeaderInfo();
    UIManager.setStatusBadge('🔍 Mencari Marker Melayu...', false);
  }
};
