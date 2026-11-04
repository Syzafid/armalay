const ArtifactLoader = {
  data: {},

  async loadArtifactsData() {
    try {
      const response = await fetch('data/artifacts.json');
      if (!response.ok) throw new Error('Gagal membaca data artifacts.json');
      this.data = await response.json();
      console.log('Data Artefak Melayu berhasil dimuat:', Object.keys(this.data).length, 'artefak.');
      return this.data;
    } catch (err) {
      console.error('Error ArtifactLoader:', err);
      return null;
    }
  },

  getArtifactById(markerId) {
    return this.data[markerId] || null;
  },

  getCollectionArtifacts(museumIdFilter = 'all') {
    const list = Object.values(this.data || {}).filter(item => item && item.id !== 'hiro-marker');
    if (!museumIdFilter || museumIdFilter === 'all') {
      return list;
    }
    return list.filter(item => item.museumId === museumIdFilter);
  },

  getMuseumsList() {
    const map = {};
    const all = this.getCollectionArtifacts('all');
    all.forEach(item => {
      const mId = item.museumId || 'museum-negeri-medan';
      const mName = item.museumName || 'Museum Negeri Medan';
      if (!map[mId]) {
        map[mId] = { id: mId, name: mName, count: 0 };
      }
      map[mId].count += 1;
    });
    return Object.values(map);
  }
};
