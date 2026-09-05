const Landing3D = {
  scene: null,
  camera: null,
  renderer: null,
  currentModel: null,
  modelGroup: null,
  particlesGroup: null,
  targetRotationX: 0,
  targetRotationY: 0,
  dragRotationX: 0,
  dragRotationY: 0,
  isDragging: false,
  previousMousePosition: { x: 0, y: 0 },
  mouseX: 0,
  mouseY: 0,
  currentIndex: 0,
  loader: null,
  clock: null,

  artifacts: [
    {
      name: "Burung Hantu Ukiran Melayu",
      category: "Ornamen & Ukiran Woodcraft",
      era: "Abad Ke-15 Masehi",
      desc: "Motif hias kuno melambangkan keheningan malam, pengawasan tajam, dan kebijaksanaan para tetua adat dalam meramu hukum serta adat istiadat Melayu.",
      path: "assets/models/owl.glb",
      scale: 2.2,
      posY: -0.8
    },
    {
      name: "Rumah Adat Arsitektur Melayu",
      category: "Arsitektur & Hunian Adat",
      era: "Abad Ke-16 Masehi",
      desc: "Mahakarya arsitektur tradisional panggung dengan hiasan atap Selembayung yang menjulang tinggi, melambangkan kehormatan menyuguhkan tamu.",
      path: "assets/models/rumah_adat.glb",
      scale: 0.55,
      posY: -1.2
    },
    {
      name: "Artefak Cerana Tepak Sirih",
      category: "Wadah Tradisional & Perunggu",
      era: "Kerajaan Melayu Kuno",
      desc: "Bejana berukir perak dan kuningan sebagai simbol tertinggi penghormatan, pembuka kata musyawarah, dan penyambutan tamu kehormatan.",
      path: "assets/models/cerana.glb",
      scale: 1.3,
      posY: -0.9
    },
    {
      name: "Artefak Perasapan Setanggi",
      category: "Peralatan Ritual & Perunggu",
      era: "Kesultanan Melayu",
      desc: "Tempat pembakaran kemukus dan kayu gaharu berukir ventilasi harum untuk upacara adat istana dan pembersihan spiritual majlis.",
      path: "assets/models/perasapan.glb",
      scale: 1.3,
      posY: -0.8
    }
  ],

  init() {
    const container = document.getElementById('landing-3d-container');
    if (!container) return;

    const width = container.clientWidth;
    const height = container.clientHeight;

    this.clock = new THREE.Clock();
    this.scene = new THREE.Scene();

    this.camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    this.camera.position.set(0, 0, 5);

    this.renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    this.renderer.setSize(width, height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.outputEncoding = THREE.sRGBEncoding;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.25;

    container.appendChild(this.renderer.domElement);

    this.modelGroup = new THREE.Group();
    this.scene.add(this.modelGroup);

    this.createGoldenParticles();

    const ambientLight = new THREE.AmbientLight(0xffffff, 1.5);
    this.scene.add(ambientLight);

    const dirLight1 = new THREE.DirectionalLight(0xe5a93c, 2.8);
    dirLight1.position.set(5, 8, 5);
    this.scene.add(dirLight1);

    const dirLight2 = new THREE.DirectionalLight(0xffffff, 1.6);
    dirLight2.position.set(-5, -2, -5);
    this.scene.add(dirLight2);

    const pointLight = new THREE.PointLight(0xe5a93c, 2.2, 10);
    pointLight.position.set(0, 2, 2);
    this.scene.add(pointLight);

    this.loader = new THREE.GLTFLoader();

    this.loadArtifact(0);

    window.addEventListener('resize', () => this.onWindowResize());
    window.addEventListener('mousemove', (e) => this.onMouseMove(e));

    this.attachDragListeners(container);

    this.animate();
  },

  createGoldenParticles() {
    const particleCount = 75;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const scales = new Float32Array(particleCount);

    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 8;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 8;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 5;
      scales[i] = Math.random() * 0.05 + 0.02;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    const material = new THREE.PointsMaterial({
      color: 0xe5a93c,
      size: 0.06,
      transparent: true,
      opacity: 0.65,
      blending: THREE.AdditiveBlending
    });

    this.particlesGroup = new THREE.Points(geometry, material);
    this.scene.add(this.particlesGroup);
  },

  attachDragListeners(container) {
    container.addEventListener('mousedown', (e) => {
      this.isDragging = true;
      this.previousMousePosition = { x: e.clientX, y: e.clientY };
    });

    window.addEventListener('mousemove', (e) => {
      if (!this.isDragging) return;
      const deltaX = e.clientX - this.previousMousePosition.x;
      const deltaY = e.clientY - this.previousMousePosition.y;

      this.dragRotationY += deltaX * 0.008;
      this.dragRotationX += deltaY * 0.008;

      this.previousMousePosition = { x: e.clientX, y: e.clientY };
    });

    window.addEventListener('mouseup', () => {
      this.isDragging = false;
    });

    container.addEventListener('touchstart', (e) => {
      if (e.touches.length === 1) {
        this.isDragging = true;
        this.previousMousePosition = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      }
    }, { passive: true });

    window.addEventListener('touchmove', (e) => {
      if (!this.isDragging || e.touches.length !== 1) return;
      const deltaX = e.touches[0].clientX - this.previousMousePosition.x;
      const deltaY = e.touches[0].clientY - this.previousMousePosition.y;

      this.dragRotationY += deltaX * 0.008;
      this.dragRotationX += deltaY * 0.008;

      this.previousMousePosition = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    }, { passive: true });

    window.addEventListener('touchend', () => {
      this.isDragging = false;
    });
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
          node.material.metalness = 0.35;
        }
        if (node.material.roughness < 0.3) {
          node.material.roughness = 0.45;
        }
        node.material.needsUpdate = true;
      }
    });
  },

  loadArtifact(index) {
    if (index < 0 || index >= this.artifacts.length) return;
    this.currentIndex = index;

    const item = this.artifacts[index];

    const titleEl = document.getElementById('landing-artifact-title');
    const catEl = document.getElementById('landing-artifact-category');
    const eraEl = document.getElementById('landing-artifact-era');
    const descEl = document.getElementById('landing-artifact-desc');
    const pageEl = document.getElementById('landing-pagination-num');
    const heroBox = document.querySelector('.landing-hero-content');

    if (heroBox) {
      heroBox.classList.add('text-fade-out');
      setTimeout(() => {
        if (titleEl) titleEl.textContent = item.name;
        if (catEl) catEl.textContent = item.category;
        if (eraEl) eraEl.textContent = item.era;
        if (descEl) descEl.textContent = item.desc;
        if (pageEl) {
          const romanNumbers = ["I", "II", "III", "IV"];
          pageEl.textContent = `${romanNumbers[index]} / IV`;
        }
        heroBox.classList.remove('text-fade-out');
        heroBox.classList.add('text-fade-in');
        setTimeout(() => heroBox.classList.remove('text-fade-in'), 400);
      }, 200);
    } else {
      if (titleEl) titleEl.textContent = item.name;
      if (catEl) catEl.textContent = item.category;
      if (eraEl) eraEl.textContent = item.era;
      if (descEl) descEl.textContent = item.desc;
      if (pageEl) {
        const romanNumbers = ["I", "II", "III", "IV"];
        pageEl.textContent = `${romanNumbers[index]} / IV`;
      }
    }

    this.updateActiveThumbnail(index);

    while (this.modelGroup.children.length > 0) {
      this.modelGroup.remove(this.modelGroup.children[0]);
    }

    this.loader.load(
      item.path,
      (gltf) => {
        const model = gltf.scene;
        this.enhanceModelMaterials(model);
        model.scale.set(item.scale * 0.7, item.scale * 0.7, item.scale * 0.7);
        model.position.set(0, item.posY, 0);

        this.modelGroup.add(model);
        this.currentModel = model;

        let scaleProgress = 0.7;
        const animateScale = () => {
          if (scaleProgress < 1.0) {
            scaleProgress += 0.03;
            const currentScale = item.scale * scaleProgress;
            model.scale.set(currentScale, currentScale, currentScale);
            requestAnimationFrame(animateScale);
          }
        };
        animateScale();
      },
      undefined,
      (error) => {
        console.error('Error loading 3D model for landing:', error);
      }
    );
  },

  updateActiveThumbnail(index) {
    const thumbs = document.querySelectorAll('.landing-thumb-card');
    thumbs.forEach((thumb, idx) => {
      if (idx === index) {
        thumb.classList.add('active');
      } else {
        thumb.classList.remove('active');
      }
    });
  },

  nextArtifact() {
    const nextIdx = (this.currentIndex + 1) % this.artifacts.length;
    this.loadArtifact(nextIdx);
  },

  prevArtifact() {
    const prevIdx = (this.currentIndex - 1 + this.artifacts.length) % this.artifacts.length;
    this.loadArtifact(prevIdx);
  },

  onMouseMove(event) {
    this.mouseX = (event.clientX / window.innerWidth) * 2 - 1;
    this.mouseY = -(event.clientY / window.innerHeight) * 2 + 1;

    this.targetRotationY = this.mouseX * 0.5;
    this.targetRotationX = this.mouseY * 0.3;
  },

  onWindowResize() {
    const container = document.getElementById('landing-3d-container');
    if (!container || !this.renderer || !this.camera) return;

    const width = container.clientWidth;
    const height = container.clientHeight;

    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height);
  },

  animate() {
    requestAnimationFrame(() => this.animate());

    const elapsedTime = this.clock ? this.clock.getElapsedTime() : 0;

    if (this.modelGroup) {
      this.modelGroup.rotation.y += 0.005;

      this.modelGroup.rotation.y += (this.targetRotationY + this.dragRotationY - this.modelGroup.rotation.y) * 0.06;
      this.modelGroup.rotation.x += (this.targetRotationX + this.dragRotationX - this.modelGroup.rotation.x) * 0.06;

      this.modelGroup.position.y = Math.sin(elapsedTime * 1.5) * 0.12;
    }

    if (this.particlesGroup) {
      this.particlesGroup.rotation.y = elapsedTime * 0.03;
      this.particlesGroup.rotation.x = Math.sin(elapsedTime * 0.02) * 0.1;
    }

    if (this.renderer && this.scene && this.camera) {
      this.renderer.render(this.scene, this.camera);
    }
  }
};
