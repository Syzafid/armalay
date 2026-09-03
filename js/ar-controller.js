const ARController = {
  isScannedLocked: false,
  activeArtifact: null,
  activeModelEl: null,
  controllerPadEl: null,

  rotX: 0,
  rotY: 30,
  scaleFactor: 0.6,
  lightIntensity: 0.9,

  init() {
    this.activeModelEl = document.getElementById('fixed-3d-model');
    this.controllerPadEl = document.getElementById('model-controller-pad');
    if (this.activeModelEl) {
      this.activeModelEl.addEventListener('model-loaded', (e) => {
        this.enhanceModelMaterials(e.detail.model);
      });
    }
    this.attachMarkerListeners();
    this.attachDPadListeners();
  },

  enhanceModelMaterials(model) {
    if (!model) return;
    model.traverse((node) => {
      if (node.isMesh && node.material) {
        if (node.material.map) {
          node.material.map.encoding = THREE.sRGBEncoding;
          node.material.map.needsUpdate = true;
        }
        if (node.material.metalness > 0.4) {
          node.material.metalness = 0.30;
        }
        if (node.material.roughness < 0.3) {
          node.material.roughness = 0.50;
        }
        node.material.needsUpdate = true;
      }
    });
  },

  attachMarkerListeners() {
    const markers = document.querySelectorAll('a-marker');
    markers.forEach(marker => {
      marker.addEventListener('markerFound', () => {
        if (this.isScannedLocked) {
          console.log('System locked. Ignoring re-scan of marker:', marker.id);
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
          console.log('Marker lost, but 3D model remains locked on screen.');
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
    const btnLightUp = document.getElementById('btn-light-up');
    const btnLightDown = document.getElementById('btn-light-down');

    if (btnUp) btnUp.addEventListener('click', () => this.rotateModel(-15, 0));
    if (btnDown) btnDown.addEventListener('click', () => this.rotateModel(15, 0));
    if (btnLeft) btnLeft.addEventListener('click', () => this.rotateModel(0, -15));
    if (btnRight) btnRight.addEventListener('click', () => this.rotateModel(0, 15));
    if (btnReset) btnReset.addEventListener('click', () => this.resetTransform());
    if (btnZoomIn) btnZoomIn.addEventListener('click', () => this.zoomModel(0.1));
    if (btnZoomOut) btnZoomOut.addEventListener('click', () => this.zoomModel(-0.1));
    if (btnLightUp) btnLightUp.addEventListener('click', () => this.adjustLighting(0.3));
    if (btnLightDown) btnLightDown.addEventListener('click', () => this.adjustLighting(-0.3));
  },

  lockArtifact(artifactData) {
    this.isScannedLocked = true;
    this.activeArtifact = artifactData;

    console.log('Locking Artifact:', artifactData.title);

    let defaultScale = 0.6;
    if (artifactData.scale) {
      defaultScale = parseFloat(artifactData.scale.split(' ')[0]) || 0.6;
    }

    this.rotX = 0;
    this.rotY = 30;
    this.scaleFactor = defaultScale;
    this.lightIntensity = 0.9;
    this.adjustLighting(0);

    UIManager.setHeaderInfo(artifactData.title, artifactData.subtitle);
    UIManager.setStatusBadge(`Terkunci: ${artifactData.title}`, true);

    if (this.activeModelEl) {
      this.activeModelEl.setAttribute('gltf-model', artifactData.modelPath);
      this.activeModelEl.setAttribute('scale', `${this.scaleFactor} ${this.scaleFactor} ${this.scaleFactor}`);
      this.activeModelEl.setAttribute('position', artifactData.position || '-0.55 -0.05 -1.8');
      this.activeModelEl.setAttribute('rotation', `${this.rotX} ${this.rotY} 0`);
      this.activeModelEl.setAttribute('visible', 'true');
    }

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

    this.scaleFactor = Math.min(Math.max(0.2, this.scaleFactor + deltaScale), 1.8);
    const s = this.scaleFactor.toFixed(2);
    this.activeModelEl.setAttribute('scale', `${s} ${s} ${s}`);
  },

  adjustLighting(delta) {
    this.lightIntensity = Math.min(Math.max(0.3, this.lightIntensity + delta), 3.5);
    const val = this.lightIntensity.toFixed(1);

    const ambient = document.getElementById('ar-ambient-light');
    const directional = document.getElementById('ar-directional-light');

    if (ambient) ambient.setAttribute('light', `type: ambient; color: #ffffff; intensity: ${val}`);
    if (directional) directional.setAttribute('light', `type: directional; color: #ffffff; intensity: ${parseFloat(val) * 1.1}; castShadow: false`);

    if (this.isScannedLocked && this.activeArtifact) {
      UIManager.setStatusBadge(`Cahaya: ${val}x | ${this.activeArtifact.title}`, true);
    }
  },

  resetTransform() {
    if (!this.activeModelEl || !this.isScannedLocked) return;

    let defaultScale = 0.6;
    if (this.activeArtifact && this.activeArtifact.scale) {
      defaultScale = parseFloat(this.activeArtifact.scale.split(' ')[0]) || 0.6;
    }

    this.rotX = 0;
    this.rotY = 30;
    this.scaleFactor = defaultScale;
    this.lightIntensity = 0.9;
    this.adjustLighting(0);
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
    console.log('Resetting AR Scan State...');
    this.isScannedLocked = false;
    this.activeArtifact = null;
    this.rotX = 0;
    this.rotY = 30;
    this.scaleFactor = 0.6;
    this.lightIntensity = 0.9;
    this.adjustLighting(0);

    if (this.activeModelEl) {
      this.activeModelEl.setAttribute('visible', 'false');
      this.activeModelEl.removeAttribute('gltf-model');
    }

    this.hideControllerPad();
    if (this.controllerPadEl) {
      this.controllerPadEl.style.display = 'none';
    }

    UIManager.hideHeaderInfo();
    UIManager.setStatusBadge('Mencari Marker Melayu...', false);
  }
};
