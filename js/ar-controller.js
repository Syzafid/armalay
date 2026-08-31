/* AR Melayu - AR Controller Module (Multi-Marker & Persistent Lock) */

const ARController = {
  isScannedLocked: false,
  activeArtifact: null,
  activeModelEl: null,

  init() {
    this.activeModelEl = document.getElementById('fixed-3d-model');
    this.attachMarkerListeners();
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

  lockArtifact(artifactData) {
    this.isScannedLocked = true;
    this.activeArtifact = artifactData;

    console.log('📌 Locking Artifact:', artifactData.title);

    // Update Header Text Minimalis
    UIManager.setHeaderInfo(artifactData.title, artifactData.subtitle);
    UIManager.setStatusBadge(`🔒 Terkunci: ${artifactData.title}`, true);

    // Load & Render 3D Model on Camera Anchor (Left Viewport)
    if (this.activeModelEl) {
      this.activeModelEl.setAttribute('gltf-model', artifactData.modelPath);
      this.activeModelEl.setAttribute('scale', artifactData.scale || '0.7 0.7 0.7');
      this.activeModelEl.setAttribute('position', artifactData.position || '-0.9 0.1 -1.8');
      this.activeModelEl.setAttribute('rotation', artifactData.rotation || '0 45 0');
      this.activeModelEl.setAttribute('visible', 'true');
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

    UIManager.hideHeaderInfo();
    UIManager.setStatusBadge('🔍 Mencari Marker Melayu...', false);
  }
};
