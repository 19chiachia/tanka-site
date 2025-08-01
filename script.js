function toggleMenu() {
    document.getElementById("sideMenu").classList.toggle("open");
  }
  
  function toggleMenu() {
    document.getElementById("sideMenu")?.classList.toggle("open");
  }
  
  class TankaCard {
    constructor({ img, text, reverse }) {
      this.img = img;
      this.text = text;
      this.reverse = reverse;
      this.element = null;
    }
  
    createElement() {
      const card = document.createElement('div');
      card.className = 'tanka-card' + (this.reverse ? ' reverse' : '');
      card.innerHTML = `
        <img src="${this.img}" alt="短歌のイメージ">
        <p class="tanka-text">${this.text}</p>
      `;
      this.element = card;
      return card;
    }
  }
  
  // 現在のページ名からカテゴリを決める（例: favorite.html -> "favorite"）
  function currentCategory() {
    const path = window.location.pathname;
    const file = path.substring(path.lastIndexOf('/') + 1);
    return file.split('.')[0]; // favorite, cute, programmer など
  }
  
  function shuffleArray(arr) {
    // Fisher-Yates
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
  }
  
  async function loadTanka() {
    const res = await fetch('tanka.json');
    if (!res.ok) {
      console.error('tanka.json を読み込めませんでした');
      return;
    }
    const all = await res.json();
    const category = currentCategory(); // "favorite" なら favorite のものだけ
    const filteredData = all.filter(item => Array.isArray(item.categories) && item.categories.includes(category));
    const container = document.querySelector('.tanka-list');
    container.innerHTML = '';
    if (filteredData.length === 0) {
      container.innerHTML = '<p style="text-align:center;">表示する短歌が見つかりません</p>';
      return;
    }
  
    // カードインスタンスを順序どおりに作る。ただし reverse は位置（1-based）で偶数なら true
    const cards = filteredData.map((data, idx) => {
      const reverse = ((idx + 1) % 2 === 0); // ①奇数なら false、偶数なら true
      return new TankaCard({ img: data.img, text: data.text, reverse });
    });
  
    // フル一覧表示
    function renderAll() {
      container.innerHTML = '';
      cards.forEach(card => {
        container.appendChild(card.createElement());
      });
    }
  
    // 初期表示
    renderAll();
  
    // ランダム表示ボタン（③）
    const randomBtn = document.getElementById('randomBtn');
    if (randomBtn) {
      randomBtn.addEventListener('click', () => {
        container.innerHTML = '';
        const copy = [...cards];
        shuffleArray(copy);
        container.appendChild(copy[0].createElement());
      });
    }
  }
  
  document.addEventListener('DOMContentLoaded', loadTanka);
  