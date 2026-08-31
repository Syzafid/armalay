/* AR Melayu - Gamification Module (Quiz & XP System) */

const Gamification = {
  score: 0,

  init() {
    const btnQuiz = document.getElementById('btn-quiz');
    if (btnQuiz) {
      btnQuiz.addEventListener('click', () => {
        UIManager.closeDrawer();
        this.startQuiz();
      });
    }
  },

  startQuiz() {
    const activeData = ARController.activeArtifact;
    if (!activeData || !activeData.quizData || activeData.quizData.length === 0) {
      UIManager.openModal('🎮 Kuis Kebudayaan Melayu', '<p>Pindai marker artefak terlebih dahulu untuk memulai tantangan kuis!</p>');
      return;
    }

    const q = activeData.quizData[0];
    let html = `<p style="font-weight:700; margin-bottom:12px; color:var(--color-gold);">${q.question}</p>`;
    
    q.options.forEach((opt, idx) => {
      html += `<button class="quiz-option-btn" onclick="Gamification.checkAnswer(${idx}, ${q.correctIndex})">${String.fromCharCode(65 + idx)}. ${opt}</button>`;
    });

    UIManager.openModal(`🎮 Kuis: ${activeData.title}`, html);
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
        UIManager.openModal('🎉 Jawaban Benar!', `<p style="text-align:center;">Selamat! Anda mendapatkan <strong>+50 XP</strong> Kebudayaan Melayu.<br/><br/><span style="font-size:24px;">🏆 Total XP: ${this.score}</span></p>`);
      } else {
        UIManager.openModal('❌ Jawaban Kurang Tepat', `<p style="text-align:center;">Tetap semangat! Pelajari lebih lanjut pada menu <strong>Sejarah Artefak</strong> dan coba kembali.</p>`);
      }
    }, 1200);
  }
};
