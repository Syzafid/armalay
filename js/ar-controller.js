const ARController = {
  isScannedLocked: false,
  activeArtifact: null,
  activeModelEl: null,
  controllerPadEl: null,

  rotX: 0,
  rotY: 30,
  baseAutoScale: 0.5,
  zoomMultiplier: 1.0,
  scaleFactor: 0.5,
  lightIntensity: 0.9,
  measuredModelStats: null,

  touchState: {
    isDragging: false,
    startX: 0,
    startY: 0,
    startRotX: 0,
    startRotY: 0,
    startScale: 0.5,
    startZoomMultiplier: 1.0,
    initialPinchDistance: 0
  },

  init() {
    this.activeModelEl = document.getElementById('fixed-3d-model');
    this.controllerPadEl = document.getElementById('model-controller-pad');
    if (this.activeModelEl) {
      this.activeModelEl.addEventListener('model-loaded', (e) => {
        this.enhanceModelMaterials(e.detail.model);
        this.calibrateLoadedModel(e.detail.model);
      });
    }
    this.attachMarkerListeners();
    this.attachDPadListeners();
    this.attachTouchListeners();

    window.addEventListener('resize', () => {
      if (this.isScannedLocked) {
        this.recalculateResponsiveScale();
        this.updateSmartPlacement();
      }
    });

    const btnCapture = document.getElementById('btn-capture-ar');
    if (btnCapture) {
      btnCapture.addEventListener('click', () => this.takeSnapshot());
    }
  },

  calibrateLoadedModel(threeModel) {
    if (!threeModel) return;

    threeModel.position.set(0, 0, 0);
    threeModel.rotation.set(0, 0, 0);
    threeModel.scale.set(1, 1, 1);
    threeModel.updateMatrixWorld(true);

    const invParent = new THREE.Matrix4();
    if (threeModel.parent) {
      threeModel.parent.updateMatrixWorld(true);
      invParent.copy(threeModel.parent.matrixWorld).invert();
    }

    const box = new THREE.Box3();
    let hasMesh = false;
    threeModel.traverse((node) => {
      if (node.isMesh && node.geometry) {
        if (!node.geometry.boundingBox) {
          node.geometry.computeBoundingBox();
        }
        if (node.geometry.boundingBox) {
          const meshBox = node.geometry.boundingBox.clone();
          const relMatrix = new THREE.Matrix4().multiplyMatrices(invParent, node.matrixWorld);
          meshBox.applyMatrix4(relMatrix);
          box.union(meshBox);
          hasMesh = true;
        }
      }
    });

    if (!hasMesh || box.isEmpty()) {
      box.setFromObject(threeModel);
    }

    const size = new THREE.Vector3();
    const center = new THREE.Vector3();
    box.getSize(size);
    box.getCenter(center);

    threeModel.position.set(-center.x, -center.y, -center.z);

    const w = Math.max(size.x, 0.001);
    const h = Math.max(size.y, 0.001);
    const d = Math.max(size.z, 0.001);
    const maxDim = Math.max(w, h, d);
    const rmsDim = Math.sqrt((w * w + h * h + d * d) / 3);
    const effectiveDim = Math.max(0.65 * maxDim + 0.35 * rmsDim, 0.001);

    this.measuredModelStats = {
      size: { x: w, y: h, z: d },
      center: { x: center.x, y: center.y, z: center.z },
      maxDim: maxDim,
      effectiveDim: effectiveDim
    };

    this.recalculateResponsiveScale();
    this.updateSmartPlacement();
  },

  recalculateResponsiveScale() {
    if (!this.measuredModelStats) return;

    const stats = this.measuredModelStats;
    const vw = window.innerWidth || 390;
    const vh = window.innerHeight || 844;
    const aspect = vw / vh;

    const baseTargetSpan = aspect < 1.0
      ? Math.max(0.66, Math.min(0.86, aspect * 1.18))
      : 0.88;

    const itemMultiplier = (this.activeArtifact && this.activeArtifact.sizeMultiplier)
      ? parseFloat(this.activeArtifact.sizeMultiplier)
      : 1.0;

    let computedScale = (baseTargetSpan / stats.effectiveDim) * itemMultiplier;

    const maxAllowedWidth = aspect < 1.0 ? Math.max(0.72, aspect * 1.35) : 1.35;
    const maxAllowedHeight = 1.05;

    if (stats.size.x * computedScale > maxAllowedWidth) {
      computedScale = maxAllowedWidth / stats.size.x;
    }
    if (stats.size.y * computedScale > maxAllowedHeight) {
      computedScale = maxAllowedHeight / stats.size.y;
    }

    this.baseAutoScale = computedScale;
    this.scaleFactor = this.baseAutoScale * this.zoomMultiplier;
    this.applyCurrentScale();
  },

  applyCurrentScale() {
    if (!this.activeModelEl) return;
    const s = this.scaleFactor.toFixed(4);
    this.activeModelEl.setAttribute('scale', `${s} ${s} ${s}`);
  },

  updateSmartPlacement() {
    if (!this.activeModelEl || !this.isScannedLocked) return;

    const vw = window.innerWidth || 390;
    const vh = window.innerHeight || 844;
    const isLandscape = vw >= vh;
    const isModalOpen = typeof UIManager !== 'undefined' && typeof UIManager.isModalActive === 'function' && UIManager.isModalActive();
    const isDrawerOpen = typeof UIManager !== 'undefined' && typeof UIManager.isDrawerOpen === 'function' && UIManager.isDrawerOpen();
    const isPanelOpen = isModalOpen || isDrawerOpen;

    const extraY = (this.activeArtifact && this.activeArtifact.verticalOffset)
      ? parseFloat(this.activeArtifact.verticalOffset)
      : 0.0;

    let posX = 0.0;
    let posY = isLandscape ? 0.02 : 0.06;
    let posZ = vw < 380 ? -1.95 : -1.85;

    if (isPanelOpen) {
      if (isLandscape || isDrawerOpen || vw > 768) {
        posX = -0.44;
        posY = 0.02;
      } else {
        posX = 0.0;
        posY = 0.32;
      }
    }

    posY += extraY;
    this.activeModelEl.setAttribute('position', `${posX.toFixed(3)} ${posY.toFixed(3)} ${posZ.toFixed(3)}`);
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

  attachTouchListeners() {
    const sceneEl = document.getElementById('ar-scene');
    if (!sceneEl) return;

    sceneEl.addEventListener('touchstart', (e) => this.handleTouchStart(e), { passive: false });
    sceneEl.addEventListener('touchmove', (e) => this.handleTouchMove(e), { passive: false });
    sceneEl.addEventListener('touchend', (e) => this.handleTouchEnd(e), { passive: false });

    sceneEl.addEventListener('mousedown', (e) => this.handleMouseDown(e));
    window.addEventListener('mousemove', (e) => this.handleMouseMove(e));
    window.addEventListener('mouseup', (e) => this.handleMouseUp(e));
    sceneEl.addEventListener('wheel', (e) => this.handleWheel(e), { passive: false });
  },

  isUiEvent(e) {
    if (!e.target) return false;
    return !!e.target.closest('#hud-header, #drawer-menu, .modal-overlay, #model-controller-pad, #landscape-prompt, #splash');
  },

  handleTouchStart(e) {
    if (!this.isScannedLocked || this.isUiEvent(e)) return;

    if (e.touches.length === 1) {
      this.touchState.isDragging = true;
      this.touchState.startX = e.touches[0].clientX;
      this.touchState.startY = e.touches[0].clientY;
      this.touchState.startRotX = this.rotX;
      this.touchState.startRotY = this.rotY;
    } else if (e.touches.length === 2) {
      this.touchState.isDragging = false;
      const dx = e.touches[0].clientX - e.touches[1].clientX;
      const dy = e.touches[0].clientY - e.touches[1].clientY;
      this.touchState.initialPinchDistance = Math.hypot(dx, dy);
      this.touchState.startScale = this.scaleFactor;
      this.touchState.startZoomMultiplier = this.zoomMultiplier;
    }
  },

  handleTouchMove(e) {
    if (!this.isScannedLocked || this.isUiEvent(e)) return;

    if (e.touches.length === 1 && this.touchState.isDragging) {
      if (e.cancelable) e.preventDefault();
      const deltaX = e.touches[0].clientX - this.touchState.startX;
      const deltaY = e.touches[0].clientY - this.touchState.startY;

      this.rotY = (this.touchState.startRotY + deltaX * 0.5) % 360;
      this.rotX = (this.touchState.startRotX + deltaY * 0.5) % 360;

      if (this.activeModelEl) {
        this.activeModelEl.setAttribute('rotation', `${this.rotX} ${this.rotY} 0`);
      }
    } else if (e.touches.length === 2 && this.touchState.initialPinchDistance > 0) {
      if (e.cancelable) e.preventDefault();
      const dx = e.touches[0].clientX - e.touches[1].clientX;
      const dy = e.touches[0].clientY - e.touches[1].clientY;
      const currentDistance = Math.hypot(dx, dy);

      const ratio = currentDistance / this.touchState.initialPinchDistance;
      this.zoomMultiplier = Math.min(Math.max(0.45, this.touchState.startZoomMultiplier * ratio), 2.25);
      this.scaleFactor = this.baseAutoScale * this.zoomMultiplier;
      this.applyCurrentScale();
    }
  },

  handleTouchEnd(e) {
    if (e.touches.length < 2) {
      this.touchState.initialPinchDistance = 0;
    }
    if (e.touches.length === 0) {
      this.touchState.isDragging = false;
    }
  },

  handleMouseDown(e) {
    if (!this.isScannedLocked || this.isUiEvent(e)) return;
    this.touchState.isDragging = true;
    this.touchState.startX = e.clientX;
    this.touchState.startY = e.clientY;
    this.touchState.startRotX = this.rotX;
    this.touchState.startRotY = this.rotY;
  },

  handleMouseMove(e) {
    if (!this.isScannedLocked || !this.touchState.isDragging) return;
    const deltaX = e.clientX - this.touchState.startX;
    const deltaY = e.clientY - this.touchState.startY;

    this.rotY = (this.touchState.startRotY + deltaX * 0.5) % 360;
    this.rotX = (this.touchState.startRotX + deltaY * 0.5) % 360;

    if (this.activeModelEl) {
      this.activeModelEl.setAttribute('rotation', `${this.rotX} ${this.rotY} 0`);
    }
  },

  handleMouseUp(e) {
    this.touchState.isDragging = false;
  },

  handleWheel(e) {
    if (!this.isScannedLocked || this.isUiEvent(e)) return;
    if (e.cancelable) e.preventDefault();
    const zoomDelta = e.deltaY < 0 ? 0.08 : -0.08;
    this.zoomModel(zoomDelta);
  },

  lockArtifact(artifactData) {
    this.isScannedLocked = true;
    this.activeArtifact = artifactData;
    this.measuredModelStats = null;

    console.log('Locking Artifact:', artifactData.title);

    let fallbackScale = 0.5;
    if (artifactData.scale) {
      fallbackScale = parseFloat(artifactData.scale.split(' ')[0]) || 0.5;
    }

    this.rotX = 0;
    this.rotY = 30;
    this.baseAutoScale = fallbackScale;
    this.zoomMultiplier = 1.0;
    this.scaleFactor = fallbackScale;
    this.lightIntensity = 0.9;
    this.adjustLighting(0);

    UIManager.setHeaderInfo(artifactData.title, artifactData.subtitle);
    UIManager.setStatusBadge(`Terkunci: ${artifactData.title}`, true);

    const reticle = document.getElementById('ar-reticle');
    if (reticle) reticle.classList.add('locked');

    this.showGestureHint();

    if (window.sendToFlutter) {
      window.sendToFlutter('HAPTIC_FEEDBACK');
    }

    if (typeof Gamification !== 'undefined' && typeof Gamification.unlockArtifact === 'function') {
      Gamification.unlockArtifact(artifactData.id);
    }

    if (this.activeModelEl) {
      this.activeModelEl.setAttribute('gltf-model', artifactData.modelPath);
      this.applyCurrentScale();
      this.updateSmartPlacement();
      this.activeModelEl.setAttribute('rotation', `${this.rotX} ${this.rotY} 0`);
      this.activeModelEl.setAttribute('visible', 'true');

      const existingMesh = this.activeModelEl.getObject3D('mesh');
      if (existingMesh) {
        this.enhanceModelMaterials(existingMesh);
        this.calibrateLoadedModel(existingMesh);
      }
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

    const step = deltaScale * 1.4;
    this.zoomMultiplier = Math.min(Math.max(0.45, this.zoomMultiplier + step), 2.25);
    this.scaleFactor = this.baseAutoScale * this.zoomMultiplier;
    this.applyCurrentScale();
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

    this.rotX = 0;
    this.rotY = 30;
    this.zoomMultiplier = 1.0;
    this.scaleFactor = this.baseAutoScale * this.zoomMultiplier;
    this.lightIntensity = 0.9;
    this.adjustLighting(0);
    this.activeModelEl.setAttribute('rotation', `${this.rotX} ${this.rotY} 0`);
    this.applyCurrentScale();
    this.updateSmartPlacement();
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
    this.measuredModelStats = null;
    this.rotX = 0;
    this.rotY = 30;
    this.baseAutoScale = 0.5;
    this.zoomMultiplier = 1.0;
    this.scaleFactor = 0.5;
    this.lightIntensity = 0.9;
    this.touchState.isDragging = false;
    this.touchState.initialPinchDistance = 0;
    this.adjustLighting(0);

    this.hideGestureHint();

    const reticle = document.getElementById('ar-reticle');
    if (reticle) reticle.classList.remove('locked');

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
  },

  showGestureHint() {
    const tooltip = document.getElementById('gesture-hint-tooltip');
    if (!tooltip) return;
    tooltip.style.display = 'block';
    clearTimeout(this._gestureTimeout);
    this._gestureTimeout = setTimeout(() => {
      this.hideGestureHint();
    }, 3800);
  },

  hideGestureHint() {
    const tooltip = document.getElementById('gesture-hint-tooltip');
    if (tooltip) tooltip.style.display = 'none';
  },

  takeSnapshot() {
    const video = document.getElementById('arjs-video') || document.querySelector('video');
    const scene = document.getElementById('ar-scene');
    if (!scene) return;

    const aCanvas = scene.querySelector('canvas.a-canvas');
    const canvas = document.createElement('canvas');
    const w = window.innerWidth;
    const h = window.innerHeight;
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext('2d');

    if (video && video.videoWidth) {
      ctx.drawImage(video, 0, 0, w, h);
    }
    if (aCanvas) {
      ctx.drawImage(aCanvas, 0, 0, w, h);
    }

    ctx.fillStyle = 'rgba(15, 15, 20, 0.88)';
    ctx.fillRect(w - 240, h - 52, 222, 38);
    ctx.strokeStyle = '#E5A93C';
    ctx.lineWidth = 1.5;
    ctx.strokeRect(w - 240, h - 52, 222, 38);

    ctx.fillStyle = '#E5A93C';
    ctx.font = 'bold 12px sans-serif';
    ctx.fillText('AR MELAYU : WARISAN ADAT', w - 225, h - 28);

    const dataUrl = canvas.toDataURL('image/png');
    const a = document.createElement('a');
    a.href = dataUrl;
    const filename = (this.activeArtifact ? this.activeArtifact.id : 'ar-melayu-snapshot') + '.png';
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

    UIManager.setStatusBadge('Foto AR Berhasil Disimpan', true);
    setTimeout(() => {
      if (this.activeArtifact) {
        UIManager.setStatusBadge(`Terkunci: ${this.activeArtifact.title}`, true);
      }
    }, 2000);
  }
};
