/* AR Melayu - Artifact Data Loader Module */

const ArtifactLoader = {
  data: {},

  async loadArtifactsData() {
    try {
      const response = await fetch('data/artifacts.json');
      if (!response.ok) throw new Error('Gagal membaca data artifacts.json');
      this.data = await response.json();
      console.log('✅ Data Artefak Melayu berhasil dimuat:', Object.keys(this.data).length, 'artefak.');
      return this.data;
    } catch (err) {
      console.error('❌ Error ArtifactLoader:', err);
      return null;
    }
  },

  getArtifactById(markerId) {
    return this.data[markerId] || null;
  }
};
