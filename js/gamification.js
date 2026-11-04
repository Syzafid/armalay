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
      UIManager.setStatusBadge(`Artefak Baru Ditemukan! (+30 Poin)`, true);
    }
  },

  updateCollectionCountUI() {
    const el = document.getElementById('collection-count');
    if (el) {
      el.textContent = `${this.unlockedArtifacts.length}/7`;
    }
    const fill = document.getElementById('drawer-progress-fill');
    if (fill) {
      fill.style.width = `${(this.unlockedArtifacts.length / 7) * 100}%`;
    }
  },

  getLevelName() {
    if (this.score < 100) return 'Penjelajah Awam Adat';
    if (this.score < 250) return 'Pendekar Warisan Melayu';
    return 'Penghulu Khazanah Melayu';
  },

  openCollectionBook() {
    const allArtifacts = [
      { id: 'owl-marker', roman: 'I', title: 'Burung Hantu Ukiran', category: 'Ornamen Kayu' },
      { id: 'rumah-adat-marker', roman: 'II', title: 'Rumah Adat Selembayung', category: 'Arsitektur Adat' },
      { id: 'cerana-marker', roman: 'III', title: 'Cerana Tepak Sirih', category: 'Wadah Logam' },
      { id: 'perasapan-marker', roman: 'IV', title: 'Perasapan Setanggi', category: 'Peralatan Ritual' },
      { id: 'kampil-marker', roman: 'V', title: 'Kampil Sirih Kain', category: 'Wadah Tekstil' },
      { id: 'perhapuran-marker', roman: 'VI', title: 'Perhapuran Kuningan', category: 'Wadah Logam' },
      { id: 'ketur-marker', roman: 'VII', title: 'Ketur Adat Upacara', category: 'Perunggu Upacara' }
    ];

    let cardsHtml = '';
    allArtifacts.forEach((item) => {
      const isUnlocked = this.unlockedArtifacts.includes(item.id);
      const iconSvg = isUnlocked
        ? '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--color-gold)" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>'
        : '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.4)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>';

      cardsHtml += `
        <div class="collection-card ${isUnlocked ? 'unlocked' : ''}">
          <div class="collection-card-top">
            <span class="collection-card-roman">${item.roman}</span>
            <span class="collection-card-icon">${iconSvg}</span>
          </div>
          <div class="collection-card-cat">${item.category}</div>
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
        <p style="font-size:13px; color:#F5F2EB; margin-top:4px;">
          Poin Kearifan: <strong>${this.score} Poin</strong> | Khazanah: <strong>${this.unlockedArtifacts.length}/7 Ditemukan</strong>
        </p>
      </div>
      <div class="collection-grid">
        ${cardsHtml}
      </div>
      <p style="font-size:11px; color:#D4AF37; margin-top:16px; text-align:center; line-height:1.4;">
        Pindai kartu marker artefak pada kamera AR untuk melengkapi seluruh buku koleksi khazanah Melayu.
      </p>
    `;

    UIManager.openModal('Koleksi Khazanah Warisan Melayu', bodyHtml);
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
        UIManager.openModal('Jawaban Benar!', `<p style="text-align:center; font-size:14px; line-height:1.6;">Selamat! Pemahaman adat Anda tepat.<br/>Anda mendapatkan <strong>+50 Poin</strong> Kearifan Melayu.<br/><br/><span style="font-size:20px; color:var(--color-gold); font-weight:800;">Total Poin: ${this.score}</span><br/><span style="font-size:12px; color:#F5F2EB;">Gelar: ${this.getLevelName()}</span></p>`);
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
