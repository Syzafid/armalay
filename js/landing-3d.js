const Landing3D = {
  scene: null,
  camera: null,
  renderer: null,
  currentModel: null,
  currentBaseBox: null,
  currentItemConfig: null,
  modelGroup: null,
  targetRotationX: 0,
  targetRotationY: 0,
  mouseX: 0,
  mouseY: 0,
  currentIndex: 0,
  loader: null,
  isUserInteracting: false,
  dragStartX: 0,
  dragStartY: 0,
  dragDeltaX: 0,
  dragDeltaY: 0,
  orbitRotX: 0,
  orbitRotY: 0,
  autoSpinSpeed: 0.005,

  artifacts: [
    {
      artifactCode: "MNM-01",
      museumId: "museum-negeri-medan",
      museumName: "Museum Negeri Medan",
      name: "Burung Hantu Ukiran Melayu",
      category: "Ornamen & Ukiran Woodcraft",
      era: "Abad Ke-15 Masehi",
      desc: "Motif hias kuno melambangkan keheningan malam, pengawasan tajam, dan kebijaksanaan para tetua adat dalam meramu hukum serta adat istiadat Melayu.",
      path: "assets/models/owl.glb",
      sizeMultiplier: 1.18,
      verticalOffset: 0.0
    },
    {
      artifactCode: "MNM-02",
      museumId: "museum-negeri-medan",
      museumName: "Museum Negeri Medan",
      name: "Rumah Adat Arsitektur Melayu",
      category: "Arsitektur & Hunian Adat",
      era: "Abad Ke-16 Masehi",
      desc: "Mahakarya arsitektur tradisional panggung dengan hiasan atap Selembayung yang menjulang tinggi, melambangkan kehormatan menyuguhkan tamu.",
      path: "assets/models/rumah_adat.glb",
      sizeMultiplier: 1.12,
      verticalOffset: 0.0
    },
    {
      artifactCode: "MNM-03",
      museumId: "museum-negeri-medan",
      museumName: "Museum Negeri Medan",
      name: "Artefak Cerana Tepak Sirih",
      category: "Wadah Tradisional & Perunggu",
      era: "Kerajaan Melayu Kuno",
      desc: "Bejana berukir perak dan kuningan sebagai simbol tertinggi penghormatan, pembuka kata musyawarah, dan penyambutan tamu kehormatan.",
      path: "assets/models/cerana.glb",
      sizeMultiplier: 1.00,
      verticalOffset: 0.0
    },
    {
      artifactCode: "MNM-04",
      museumId: "museum-negeri-medan",
      museumName: "Museum Negeri Medan",
      name: "Artefak Perasapan Setanggi",
      category: "Peralatan Ritual & Perunggu",
      era: "Kesultanan Melayu",
      desc: "Tempat pembakaran kemukus dan kayu gaharu berukir ventilasi harum untuk upacara adat istana dan pembersihan spiritual majlis.",
      path: "assets/models/perasapan.glb",
      sizeMultiplier: 0.95,
      verticalOffset: 0.0
    },
    {
      artifactCode: "MNM-05",
      museumId: "museum-negeri-medan",
      museumName: "Museum Negeri Medan",
      name: "Artefak Kampil Sirih Melayu",
      category: "Wadah Tradisional & Tekstil",
      era: "Kesultanan Melayu",
      desc: "Wadah tradisional kain anyaman songket berukir halus untuk menyimpan sirih dan barang berharga adat majlis Melayu.",
      path: "assets/models/kampil.glb",
      sizeMultiplier: 0.95,
      verticalOffset: 0.0
    },
    {
      artifactCode: "MNM-06",
      museumId: "museum-negeri-medan",
      museumName: "Museum Negeri Medan",
      name: "Artefak Perhapuran Melayu",
      category: "Wadah Tradisional & Logam",
      era: "Kerajaan Melayu Kuno",
      desc: "Bejana kuningan kecil penyimpan kapur sirih berhias motif ukiran Awan Larat sebagai lambang kerapian adat.",
      path: "assets/models/perhapuran.glb",
      sizeMultiplier: 0.86,
      verticalOffset: 0.0
    },
    {
      artifactCode: "MNM-07",
      museumId: "museum-negeri-medan",
      museumName: "Museum Negeri Medan",
      name: "Artefak Ketur Adat Melayu",
      category: "Peralatan Upacara & Perunggu",
      era: "Kesultanan Melayu Kuno",
      desc: "Bejana logam tempat pembuangan ampas sirih dengan leher dan kaki cawan kokoh dalam upacara istana Melayu.",
      path: "assets/models/ketur.glb",
      sizeMultiplier: 0.92,
      verticalOffset: 0.0
    },
    {
      artifactCode: "MNM-08",
      museumId: "museum-negeri-medan",
      museumName: "Museum Negeri Medan",
      name: "Artefak Tempat Gelas Adat Melayu",
      category: "Perangkat Jamuan & Logam",
      era: "Kesultanan Melayu",
      desc: "Perangkat penyangga cawan jamuan logam berukir untuk menyajikan minuman kehormatan kepada tetua adat dan tamu agung dalam perhelatan majlis Melayu.",
      path: "assets/models/Tempat_Gelas.glb",
      sizeMultiplier: 0.94,
      verticalOffset: 0.0
    },
    {
      artifactCode: "MTT-01",
      museumId: "museum-tebing-tinggi",
      museumName: "Museum Kota Tebing Tinggi",
      name: "Artefak Uang Logam Gulden Hindia Belanda",
      category: "Koleksi Numismatika",
      era: "Abad ke-19 – ke-20",
      desc: "Uang logam Gulden yang beredar luas dalam jaringan perdagangan dan perkebunan di kawasan Tebing Tinggi serta pesisir Sumatera Timur sebagai saksi sejarah ekonomi masyarakat Melayu.",
      path: "assets/models/logamguldenhindiabelanda.glb",
      sizeMultiplier: 0.90,
      verticalOffset: 0.0
    },
    {
      artifactCode: "MDS-01",
      museumId: "museum-deli-serdang",
      museumName: "Museum Deli Serdang",
      name: "Mangkuk Sup Keramik Kesultanan",
      category: "Keramik & Jamuan Istana",
      era: "Kesultanan Serdang",
      desc: "Mangkuk sup keramik bertutup dari perangkat jamuan makan kehormatan di lingkungan Kesultanan Serdang yang mencerminkan kemegahan tata krama jamuan Melayu pesisir.",
      path: "assets/models/MangkukSup.glb",
      sizeMultiplier: 0.94,
      verticalOffset: 0.0
    },
    {
      artifactCode: "MDS-02",
      museumId: "museum-deli-serdang",
      museumName: "Museum Deli Serdang",
      name: "Artefak Pasu Adonan Tepung",
      category: "Peralatan Kuliner & Gerabah",
      era: "Tradisi Melayu Serdang",
      desc: "Bejana cekung tradisional tempat menguleni adonan tepung saat mempersiapkan kue-muih adat dan hidangan kenduri besar masyarakat Melayu Deli Serdang.",
      path: "assets/models/ArtefakPasuAdonanTepung.glb",
      sizeMultiplier: 0.92,
      verticalOffset: 0.0
    },
    {
      artifactCode: "MDS-03",
      museumId: "museum-deli-serdang",
      museumName: "Museum Deli Serdang",
      name: "Artefak Pinggan Bendera Serdang",
      category: "Pusaka Keramik Kesultanan",
      era: "Kesultanan Serdang",
      desc: "Piring porselen kehormatan berlambang panji kebesaran Kesultanan Serdang yang dipesan khusus untuk perjamuan resmi istana dan simbol kedaulatan negeri.",
      path: "assets/models/ArtefakPingganBenderaSerdang.glb",
      sizeMultiplier: 0.94,
      verticalOffset: 0.0
    },
    {
      artifactCode: "MDS-04",
      museumId: "museum-deli-serdang",
      museumName: "Museum Deli Serdang",
      name: "Replika Pedang Bawar Serdang",
      category: "Senjata Tradisional & Pusaka",
      era: "Kesultanan Serdang",
      desc: "Senjata tajam kebesaran panglima Melayu dengan bilah lurus memanjang dan pelindung hulu khas sebagai simbol keberanian menjaga marwah Kesultanan Serdang.",
      path: "assets/models/ReplikaPedangBawar.glb",
      sizeMultiplier: 1.04,
      verticalOffset: 0.0
    },
    {
      artifactCode: "MDS-05",
      museumId: "museum-deli-serdang",
      museumName: "Museum Deli Serdang",
      name: "Replika Topi Dutch Style",
      category: "Koleksi Sejarah Kolonial",
      era: "Abad ke-19 – ke-20",
      desc: "Replika topi bergaya kolonial Belanda yang merekam jejak sejarah administrasi serta perkembangan pesat perkebunan di wilayah Deli Serdang.",
      path: "assets/models/ReplikaTopiDutchStyle.glb",
      sizeMultiplier: 0.92,
      verticalOffset: 0.0
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
    this.renderer.outputEncoding = THREE.sRGBEncoding;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.25;

    container.appendChild(this.renderer.domElement);

    this.modelGroup = new THREE.Group();
    this.scene.add(this.modelGroup);

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

    this.attachDragListeners();
    window.addEventListener('resize', () => this.onWindowResize());
    window.addEventListener('mousemove', (e) => this.onMouseMove(e));

    this.animate();
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

  showLoader(name) {
    this.hideError();
    let loader = document.getElementById('landing-3d-loader');
    if (!loader) {
      const container = document.getElementById('landing-3d-container');
      if (!container) return;
      loader = document.createElement('div');
      loader.id = 'landing-3d-loader';
      loader.className = 'landing-3d-loader';
      loader.innerHTML = '<div class="landing-3d-spinner" aria-hidden="true"></div><span class="landing-3d-progress" id="landing-3d-progress-text">Memuat 3D...</span>';
      container.appendChild(loader);
    }
    const textEl = document.getElementById('landing-3d-progress-text');
    if (textEl) textEl.textContent = 'Memuat ' + name + '...';
    loader.style.display = 'flex';
  },

  updateLoaderProgress(percent) {
    const textEl = document.getElementById('landing-3d-progress-text');
    if (textEl) textEl.textContent = 'Memuat 3D (' + percent + '%)...';
  },

  hideLoader() {
    const loader = document.getElementById('landing-3d-loader');
    if (loader) loader.style.display = 'none';
  },

  showError(name, retryFn) {
    this.hideLoader();
    let errorBox = document.getElementById('landing-3d-error');
    if (!errorBox) {
      const container = document.getElementById('landing-3d-container');
      if (!container) return;
      errorBox = document.createElement('div');
      errorBox.id = 'landing-3d-error';
      errorBox.className = 'landing-3d-error';
      errorBox.innerHTML = '<p id="landing-3d-error-msg">Gagal memuat model 3D.</p><button type="button" class="btn-retry-3d" id="btn-retry-3d-model">Coba Muat Ulang</button>';
      container.appendChild(errorBox);
    }
    const msg = document.getElementById('landing-3d-error-msg');
    if (msg) msg.textContent = 'Koneksi terhambat saat memuat ' + name + '.';
    const btn = document.getElementById('btn-retry-3d-model');
    if (btn) {
      btn.onclick = () => {
        this.hideError();
        if (typeof retryFn === 'function') retryFn();
      };
    }
    errorBox.style.display = 'block';
  },

  hideError() {
    const errorBox = document.getElementById('landing-3d-error');
    if (errorBox) errorBox.style.display = 'none';
  },

  loadArtifact(index) {
    if (index < 0 || index >= this.artifacts.length) return;
    this.currentIndex = index;

    const item = this.artifacts[index];

    const titleEl = document.getElementById('landing-artifact-title');
    const codeEl = document.getElementById('landing-artifact-code');
    const museumEl = document.getElementById('landing-artifact-museum');
    const catEl = document.getElementById('landing-artifact-category');
    const eraEl = document.getElementById('landing-artifact-era');
    const descEl = document.getElementById('landing-artifact-desc');
    const pageEl = document.getElementById('landing-pagination-num');
    const heroBox = document.querySelector('.landing-hero-content');
    const romanNumbers = ["I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X", "XI", "XII", "XIII", "XIV", "XV", "XVI", "XVII", "XVIII", "XIX", "XX"];
    const totalRoman = romanNumbers[this.artifacts.length - 1] || this.artifacts.length;

    const updateDomText = () => {
      if (titleEl) titleEl.textContent = item.name;
      if (codeEl) codeEl.textContent = item.artifactCode || 'MNM-01';
      if (museumEl) museumEl.textContent = item.museumName || 'Museum Negeri Medan';
      if (catEl) catEl.textContent = item.category;
      if (eraEl) eraEl.textContent = item.era;
      if (descEl) descEl.textContent = item.desc;
      if (pageEl) {
        pageEl.textContent = `${romanNumbers[index] || (index + 1)} / ${totalRoman}`;
      }
    };

    if (heroBox) {
      heroBox.classList.add('text-fade-out');
      setTimeout(() => {
        updateDomText();
        heroBox.classList.remove('text-fade-out');
        heroBox.classList.add('text-fade-in');
        setTimeout(() => heroBox.classList.remove('text-fade-in'), 350);
      }, 180);
    } else {
      updateDomText();
    }

    while (this.modelGroup.children.length > 0) {
      this.modelGroup.remove(this.modelGroup.children[0]);
    }

    this.showLoader(item.name);

    this.loader.load(
      item.path,
      (gltf) => {
        this.hideLoader();
        this.hideError();
        const model = gltf.scene;
        this.enhanceModelMaterials(model);

        const baseStats = this.measureBaseGeometry(model);
        this.currentModel = model;
        this.currentBaseBox = baseStats;
        this.currentItemConfig = item;

        this.modelGroup.add(model);

        let currentProgress = 0.78;
        this.applyAutoFitTransform(model, baseStats, item, currentProgress);

        const animateScale = () => {
          if (this.currentModel !== model) return;
          if (currentProgress < 1.0) {
            currentProgress = Math.min(1.0, currentProgress + 0.025);
            this.applyAutoFitTransform(model, baseStats, item, currentProgress);
            requestAnimationFrame(animateScale);
          }
        };
        animateScale();
      },
      (xhr) => {
        if (xhr.lengthComputable && xhr.total > 0) {
          const percent = Math.round((xhr.loaded / xhr.total) * 100);
          this.updateLoaderProgress(percent);
        }
      },
      (error) => {
        console.error('Error loading 3D model for landing:', error);
        this.showError(item.name, () => this.loadArtifact(index));
      }
    );
  },

  measureBaseGeometry(model) {
    model.scale.set(1, 1, 1);
    model.position.set(0, 0, 0);
    model.rotation.set(0, 0, 0);
    model.updateMatrixWorld(true);

    const box = new THREE.Box3().setFromObject(model);
    const size = new THREE.Vector3();
    const center = new THREE.Vector3();
    box.getSize(size);
    box.getCenter(center);

    const w = Math.max(size.x, 0.001);
    const h = Math.max(size.y, 0.001);
    const d = Math.max(size.z, 0.001);

    const maxDim = Math.max(w, h, d);
    const rmsDim = Math.sqrt((w * w + h * h + d * d) / 3);
    const effectiveDim = 0.65 * maxDim + 0.35 * rmsDim;

    return {
      size: { x: w, y: h, z: d },
      center: { x: center.x, y: center.y, z: center.z },
      maxDim: maxDim,
      effectiveDim: Math.max(effectiveDim, 0.001)
    };
  },

  computeAutoFitScale(baseStats, itemConfig) {
    if (!this.camera || !baseStats) return 1.0;

    const fovRad = (this.camera.fov * Math.PI) / 180;
    const cameraDist = Math.abs(this.camera.position.z) || 5.0;
    const visibleHeight = 2 * Math.tan(fovRad / 2) * cameraDist;
    const visibleWidth = visibleHeight * (this.camera.aspect || 1.0);

    const stageSpan = Math.min(visibleWidth, visibleHeight) * 0.56;
    const multiplier = (itemConfig && itemConfig.sizeMultiplier) ? itemConfig.sizeMultiplier : 1.0;

    let targetScale = (stageSpan / baseStats.effectiveDim) * multiplier;

    const maxAllowedWidth = visibleWidth * 0.78;
    const maxAllowedHeight = visibleHeight * 0.74;

    if (baseStats.size.x * targetScale > maxAllowedWidth) {
      targetScale = maxAllowedWidth / baseStats.size.x;
    }
    if (baseStats.size.y * targetScale > maxAllowedHeight) {
      targetScale = maxAllowedHeight / baseStats.size.y;
    }

    return targetScale;
  },

  applyAutoFitTransform(model, baseStats, itemConfig, progressRatio = 1.0) {
    if (!model || !baseStats) return;

    const targetScale = this.computeAutoFitScale(baseStats, itemConfig);
    const activeScale = targetScale * progressRatio;
    const verticalOffset = (itemConfig && itemConfig.verticalOffset) ? itemConfig.verticalOffset : 0.0;

    model.scale.set(activeScale, activeScale, activeScale);
    model.position.set(
      -baseStats.center.x * activeScale,
      -baseStats.center.y * activeScale + verticalOffset,
      -baseStats.center.z * activeScale
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
    if (width === 0 || height === 0) return;

    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height);

    if (this.currentModel && this.currentBaseBox && this.currentItemConfig) {
      this.applyAutoFitTransform(this.currentModel, this.currentBaseBox, this.currentItemConfig, 1.0);
    }
  },

  attachDragListeners() {
    const dom = this.renderer.domElement;
    dom.style.cursor = 'grab';

    dom.addEventListener('mousedown', (e) => {
      this.isUserInteracting = true;
      this.dragStartX = e.clientX;
      this.dragStartY = e.clientY;
      dom.style.cursor = 'grabbing';
    });

    window.addEventListener('mousemove', (e) => {
      if (!this.isUserInteracting) return;
      const deltaX = e.clientX - this.dragStartX;
      const deltaY = e.clientY - this.dragStartY;
      this.dragStartX = e.clientX;
      this.dragStartY = e.clientY;
      this.orbitRotY += deltaX * 0.009;
      this.orbitRotX = Math.max(-0.6, Math.min(0.6, this.orbitRotX + deltaY * 0.009));
      this.dragDeltaX = deltaX * 0.004;
      this.dragDeltaY = deltaY * 0.004;
    });

    window.addEventListener('mouseup', () => {
      if (this.isUserInteracting) {
        this.isUserInteracting = false;
        dom.style.cursor = 'grab';
      }
    });

    dom.addEventListener('touchstart', (e) => {
      if (e.touches.length === 1) {
        this.isUserInteracting = true;
        this.dragStartX = e.touches[0].clientX;
        this.dragStartY = e.touches[0].clientY;
      }
    }, { passive: true });

    dom.addEventListener('touchmove', (e) => {
      if (!this.isUserInteracting || e.touches.length !== 1) return;
      const deltaX = e.touches[0].clientX - this.dragStartX;
      const deltaY = e.touches[0].clientY - this.dragStartY;
      this.dragStartX = e.touches[0].clientX;
      this.dragStartY = e.touches[0].clientY;
      this.orbitRotY += deltaX * 0.009;
      this.orbitRotX = Math.max(-0.6, Math.min(0.6, this.orbitRotX + deltaY * 0.009));
      this.dragDeltaX = deltaX * 0.004;
      this.dragDeltaY = deltaY * 0.004;
    }, { passive: true });

    dom.addEventListener('touchend', () => {
      this.isUserInteracting = false;
    }, { passive: true });
  },

  animate() {
    requestAnimationFrame(() => this.animate());

    if (this.modelGroup) {
      if (!this.isUserInteracting) {
        this.dragDeltaX *= 0.92;
        this.dragDeltaY *= 0.92;
        this.orbitRotY += this.dragDeltaX + this.autoSpinSpeed;
        this.orbitRotX += this.dragDeltaY;
      }
      this.modelGroup.rotation.y = this.orbitRotY;
      this.modelGroup.rotation.x = this.orbitRotX;
    }

    if (this.renderer && this.scene && this.camera) {
      this.renderer.render(this.scene, this.camera);
    }
  }
};
