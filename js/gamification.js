const Gamification = {
  score: 0,
  unlockedArtifacts: [],
  audioCtx: null,
  isAudioPlaying: false,
  soundTimer: null,

  init() {
    this.loadState();
    this.updateCollectionCountUI();

    const btnQuiz = document.getElementById('btn-quiz');
    if (btnQuiz) {
      btnQuiz.addEventListener('click', () => {
        UIManager.closeDrawer();
        this.startQuiz();
      });
    }

    const btnCollection = document.getElementById('btn-collection-book');
    if (btnCollection) {
      btnCollection.addEventListener('click', () => {
        UIManager.closeDrawer();
        this.openCollectionBook();
      });
    }

    const btnSound = document.getElementById('btn-sound-toggle');
    if (btnSound) {
      btnSound.addEventListener('click', () => {
        this.toggleSoundscape();
      });
    }
  },

  loadState() {
    try {
      const savedScore = localStorage.getItem('ar_melayu_score');
      if (savedScore) this.score = parseInt(savedScore, 10) || 0;

      const savedUnlocked = localStorage.getItem('ar_melayu_unlocked');
      if (savedUnlocked) {
        this.unlockedArtifacts = JSON.parse(savedUnlocked) || [];
      }
    } catch (e) {
      console.error('Error loading gamification state:', e);
    }
  },

  saveState() {
    try {
      localStorage.setItem('ar_melayu_score', this.score.toString());
      localStorage.setItem('ar_melayu_unlocked', JSON.stringify(this.unlockedArtifacts));
    } catch (e) {
      console.error('Error saving gamification state:', e);
    }
  },

  unlockArtifact(artifactId) {
    if (!artifactId) return;
    if (!this.unlockedArtifacts.includes(artifactId)) {
      this.unlockedArtifacts.push(artifactId);
      this.score += 30;
      this.saveState();
      this.updateCollectionCountUI();
      UIManager.setStatusBadge(`Artefak Baru Ditemukan! (+30 XP)`, true);
    }
  },

  updateCollectionCountUI() {
    const el = document.getElementById('collection-count');
    if (el) {
      el.textContent = `${this.unlockedArtifacts.length}/7`;
    }
  },

  getLevelName() {
    if (this.score < 100) return 'Penjelajah Pemula';
    if (this.score < 250) return 'Kolektor Warisan Melayu';
    return 'Pakar Adat Mahkota Melayu';
  },

  openCollectionBook() {
    const allArtifacts = [
      { id: 'owl-marker', title: 'Burung Hantu Ukiran', category: 'Ornamen Kayu' },
      { id: 'rumah-adat-marker', title: 'Rumah Adat Selembayung', category: 'Arsitektur Adat' },
      { id: 'cerana-marker', title: 'Cerana Tepak Sirih', category: 'Wadah Logam' },
      { id: 'perasapan-marker', title: 'Perasapan Setanggi', category: 'Peralatan Ritual' },
      { id: 'kampil-marker', title: 'Kampil Sirih Kain', category: 'Wadah Tekstil' },
      { id: 'perhapuran-marker', title: 'Perhapuran Kuningan', category: 'Wadah Logam' },
      { id: 'ketur-marker', title: 'Ketur Adat Upacara', category: 'Perunggu Upacara' }
    ];

    let cardsHtml = '';
    allArtifacts.forEach((item) => {
      const isUnlocked = this.unlockedArtifacts.includes(item.id);
      cardsHtml += `
        <div class="collection-card ${isUnlocked ? 'unlocked' : ''}">
          <div class="collection-card-icon">${isUnlocked ? '[OK]' : '[?]'}</div>
          <div class="collection-card-title">${item.title}</div>
          <div class="collection-card-status">${isUnlocked ? 'Terbuka' : 'Terkunci'}</div>
        </div>
      `;
    });

    const bodyHtml = `
      <div style="margin-bottom:14px; text-align:center;">
        <span style="font-size:12px; font-weight:800; color:var(--color-gold); letter-spacing:1px; text-transform:uppercase;">
          ${this.getLevelName()}
        </span>
        <p style="font-size:13px; color:#F0ECE1; margin-top:4px;">
          Total Poin: <strong>${this.score} XP</strong> | Koleksi: <strong>${this.unlockedArtifacts.length}/7 Ditemukan</strong>
        </p>
      </div>
      <div class="collection-grid">
        ${cardsHtml}
      </div>
      <p style="font-size:11px; color:#A39B8B; margin-top:16px; text-align:center; line-height:1.4;">
        Pindai marker artefak di kamera AR untuk melengkapi seluruh buku koleksi warisan Melayu.
      </p>
    `;

    UIManager.openModal('Buku Koleksi Warisan Melayu', bodyHtml);
  },

  startQuiz() {
    const activeData = ARController.activeArtifact;
    if (!activeData || !activeData.quizData || activeData.quizData.length === 0) {
      UIManager.openModal('Kuis Kebudayaan Melayu', '<p>Pindai marker artefak terlebih dahulu untuk memulai tantangan kuis!</p>');
      return;
    }

    const q = activeData.quizData[0];
    let html = `<p style="font-weight:700; margin-bottom:14px; color:var(--color-gold); font-size:14px; line-height:1.5;">${q.question}</p>`;

    q.options.forEach((opt, idx) => {
      html += `<button type="button" class="quiz-option-btn" onclick="Gamification.checkAnswer(${idx}, ${q.correctIndex})">${String.fromCharCode(65 + idx)}. ${opt}</button>`;
    });

    UIManager.openModal(`Kuis: ${activeData.title}`, html);
  },

  checkAnswer(selectedIndex, correctIndex) {
    const btns = document.querySelectorAll('.quiz-option-btn');
    btns.forEach((btn, idx) => {
      btn.disabled = true;
      if (idx === correctIndex) {
        btn.classList.add('correct');
      } else if (idx === selectedIndex) {
        btn.classList.add('wrong');
      }
    });

    setTimeout(() => {
      if (selectedIndex === correctIndex) {
        this.score += 50;
        this.saveState();
        UIManager.openModal('Jawaban Benar!', `<p style="text-align:center; font-size:14px; line-height:1.6;">Selamat! Jawaban Anda tepat.<br/>Anda mendapatkan <strong>+50 XP</strong> Kebudayaan Melayu.<br/><br/><span style="font-size:20px; color:var(--color-gold); font-weight:800;">Total Poin: ${this.score} XP</span><br/><span style="font-size:12px; color:#A39B8B;">Gelar: ${this.getLevelName()}</span></p>`);
      } else {
        UIManager.openModal('Jawaban Belum Tepat', `<p style="text-align:center; font-size:13px; line-height:1.6;">Tetap semangat! Anda dapat mempelajari filosofi artefak ini pada menu <strong>Sejarah &amp; Detail Artefak</strong> dan mencoba kembali.</p>`);
      }
    }, 1200);
  },

  toggleSoundscape() {
    if (this.isAudioPlaying) {
      this.stopSoundscape();
    } else {
      this.playSoundscape();
    }
  },

  playSoundscape() {
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (!AudioContext) return;
      if (!this.audioCtx) {
        this.audioCtx = new AudioContext();
      }
      if (this.audioCtx.state === 'suspended') {
        this.audioCtx.resume();
      }

      this.isAudioPlaying = true;
      const btn = document.getElementById('btn-sound-toggle');
      if (btn) btn.textContent = 'Audio: Aktif';

      const scaleFrequencies = [220.00, 247.50, 275.00, 330.00, 366.67, 440.00];

      const playChime = () => {
        if (!this.isAudioPlaying || !this.audioCtx) return;
        const note = scaleFrequencies[Math.floor(Math.random() * scaleFrequencies.length)];
        const osc = this.audioCtx.createOscillator();
        const gain = this.audioCtx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(note, this.audioCtx.currentTime);

        gain.gain.setValueAtTime(0.001, this.audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.04, this.audioCtx.currentTime + 0.15);
        gain.gain.exponentialRampToValueAtTime(0.0001, this.audioCtx.currentTime + 2.8);

        osc.connect(gain);
        gain.connect(this.audioCtx.destination);

        osc.start();
        osc.stop(this.audioCtx.currentTime + 3.0);

        const nextDelay = 1800 + Math.random() * 2200;
        this.soundTimer = setTimeout(playChime, nextDelay);
      };

      playChime();
    } catch (e) {
      console.error('Web Audio error:', e);
    }
  },

  stopSoundscape() {
    this.isAudioPlaying = false;
    clearTimeout(this.soundTimer);
    const btn = document.getElementById('btn-sound-toggle');
    if (btn) btn.textContent = 'Audio: Tutup';
  }
};
