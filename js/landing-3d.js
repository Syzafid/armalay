const Landing3D = {
  scene: null,
  camera: null,
  renderer: null,
  currentModel: null,
  modelGroup: null,
  targetRotationX: 0,
  targetRotationY: 0,
  mouseX: 0,
  mouseY: 0,
  currentIndex: 0,
  loader: null,

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
      path: "assets/models/3D Rumah Adat.glb",
      scale: 0.55,
      posY: -1.2
    },
    {
      name: "Artefak Cerana Tepak Sirih",
      category: "Wadah Tradisional & Perunggu",
      era: "Kerajaan Melayu Kuno",
      desc: "Bejana berukir perak dan kuningan sebagai simbol tertinggi penghormatan, pembuka kata musyawarah, dan penyambutan tamu kehormatan.",
      path: "assets/models/Artefak Cerana.glb",
      scale: 1.3,
      posY: -0.9
    },
    {
      name: "Artefak Perasapan Setanggi",
      category: "Peralatan Ritual & Perunggu",
      era: "Kesultanan Melayu",
      desc: "Tempat pembakaran kemukus dan kayu gaharu berukir ventilasi harum untuk upacara adat istana dan pembersihan spiritual majlis.",
      path: "assets/models/Artefak Perasapan.glb",
      scale: 1.3,
      posY: -0.8
    }
  ],

  init() {
    const container = document.getElementById('landing-3d-container');
    if (!container) return;

    const width = container.clientWidth;
    const height = container.clientHeight;

    this.scene = new THREE.Scene();

    this.camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    this.camera.position.set(0, 0, 5);

    this.renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    this.renderer.setSize(width, height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.2;

    container.appendChild(this.renderer.domElement);

    this.modelGroup = new THREE.Group();
    this.scene.add(this.modelGroup);

    const ambientLight = new THREE.AmbientLight(0xffffff, 1.2);
    this.scene.add(ambientLight);

    const dirLight1 = new THREE.DirectionalLight(0xd4af37, 2.5);
    dirLight1.position.set(5, 8, 5);
    this.scene.add(dirLight1);

    const dirLight2 = new THREE.DirectionalLight(0xffffff, 1.5);
    dirLight2.position.set(-5, -2, -5);
    this.scene.add(dirLight2);

    const pointLight = new THREE.PointLight(0xd4af37, 2, 10);
    pointLight.position.set(0, 2, 2);
    this.scene.add(pointLight);

    this.loader = new THREE.GLTFLoader();

    this.loadArtifact(0);

    window.addEventListener('resize', () => this.onWindowResize());
    window.addEventListener('mousemove', (e) => this.onMouseMove(e));

    this.animate();
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

    if (titleEl) titleEl.textContent = item.name;
    if (catEl) catEl.textContent = item.category;
    if (eraEl) eraEl.textContent = item.era;
    if (descEl) descEl.textContent = item.desc;
    if (pageEl) {
      const romanNumbers = ["I", "II", "III", "IV"];
      pageEl.textContent = `${romanNumbers[index]} / IV`;
    }

    while (this.modelGroup.children.length > 0) {
      this.modelGroup.remove(this.modelGroup.children[0]);
    }

    this.loader.load(
      item.path,
      (gltf) => {
        const model = gltf.scene;
        model.scale.set(item.scale, item.scale, item.scale);
        model.position.set(0, item.posY, 0);

        this.modelGroup.add(model);
        this.currentModel = model;
      },
      undefined,
      (error) => {
        console.error('Error loading 3D model for landing:', error);
      }
    );
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

    this.targetRotationY = this.mouseX * 0.6;
    this.targetRotationX = this.mouseY * 0.4;
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

    if (this.modelGroup) {
      this.modelGroup.rotation.y += 0.006;

      this.modelGroup.rotation.y += (this.targetRotationY - this.modelGroup.rotation.y) * 0.05;
      this.modelGroup.rotation.x += (this.targetRotationX - this.modelGroup.rotation.x) * 0.05;
    }

    if (this.renderer && this.scene && this.camera) {
      this.renderer.render(this.scene, this.camera);
    }
  }
};
