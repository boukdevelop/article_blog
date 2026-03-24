// ==================== Initialisation ==================== 
let articles = [];
let editingId = null;

const modal = document.getElementById('modal');
const articleForm = document.getElementById('articleForm');
const addBtn = document.getElementById('addBtn');
const closeBtn = document.getElementById('closeBtn');
const cancelBtn = document.getElementById('cancelBtn');
const articlesContainer = document.getElementById('articlesContainer');
const emptyMessage = document.getElementById('emptyMessage');
const categoryFilter = document.getElementById('categoryFilter');
const themeToggle = document.getElementById('themeToggle');
const modalTitle = document.getElementById('modalTitle');

// ==================== LocalStorage ==================== 
function loadArticles() {
  const saved = localStorage.getItem('articles');
  articles = saved ? JSON.parse(saved) : [];
}

function saveArticles() {
  localStorage.setItem('articles', JSON.stringify(articles));
}

function loadTheme() {
  const theme = localStorage.getItem('theme') || 'light';
  if (theme === 'dark') {
    document.body.classList.add('dark-mode');
    themeToggle.textContent = '☀️';
  }
}

function saveTheme(isDark) {
  localStorage.setItem('theme', isDark ? 'dark' : 'light');
}

// ==================== Ajouter/Modifier Article ==================== 
function openModal(id = null) {
  editingId = id;
  
  if (id) {
    const article = articles.find(a => a.id === id);
    modalTitle.textContent = 'Modifier l\'Article';
    document.getElementById('title').value = article.title;
    document.getElementById('content').value = article.content;
    document.getElementById('author').value = article.author;
    document.getElementById('category').value = article.category;
    document.getElementById('tag').value = article.tag;
  } else {
    modalTitle.textContent = 'Ajouter un Article';
    articleForm.reset();
  }
  
  modal.style.display = 'flex';
}

function closeModal() {
  modal.style.display = 'none';
  articleForm.reset();
  editingId = null;
}

addBtn.addEventListener('click', () => openModal());
closeBtn.addEventListener('click', closeModal);
cancelBtn.addEventListener('click', closeModal);

window.addEventListener('click', (event) => {
  if (event.target === modal) {
    closeModal();
  }
});

articleForm.addEventListener('submit', (event) => {
  event.preventDefault();
  
  const title = document.getElementById('title').value;
  const content = document.getElementById('content').value;
  const author = document.getElementById('author').value;
  const category = document.getElementById('category').value;
  const tag = document.getElementById('tag').value;
  const date = new Date().toLocaleDateString('fr-FR');
  
  if (editingId) {
    // Modifier article
    const article = articles.find(a => a.id === editingId);
    article.title = title;
    article.content = content;
    article.author = author;
    article.category = category;
    article.tag = tag;
  } else {
    // Ajouter article
    const newArticle = {
      id: Date.now(),
      title,
      content,
      author,
      category,
      tag,
      date
    };
    articles.unshift(newArticle);
  }
  
  saveArticles();
  renderArticles();
  closeModal();
});

// ==================== Afficher Articles ==================== 
function renderArticles() {
  const selectedCategory = categoryFilter.value;
  
  let filteredArticles = articles;
  if (selectedCategory) {
    filteredArticles = articles.filter(a => a.category === selectedCategory);
  }
  
  articlesContainer.innerHTML = '';
  
  if (filteredArticles.length === 0) {
    emptyMessage.style.display = 'block';
    return;
  }
  
  emptyMessage.style.display = 'none';
  
  filteredArticles.forEach(article => {
    const articleCard = document.createElement('div');
    articleCard.className = 'article-card';
    
    articleCard.innerHTML = `
      <div class="article-header">
        <h3 class="article-title">${escapeHtml(article.title)}</h3>
        <div class="article-actions">
          <button class="btn-icon btn-edit" onclick="editArticle(${article.id})" title="Modifier">
            ✏️
          </button>
          <button class="btn-icon btn-delete" onclick="deleteArticle(${article.id})" title="Supprimer">
            🗑️
          </button>
        </div>
      </div>
      
      <div class="article-meta">
        📅 ${article.date}
      </div>
      
      <div>
        <span class="article-category">${article.category}</span>
        ${article.tag ? `<span class="article-tag">${escapeHtml(article.tag)}</span>` : ''}
      </div>
      
      <p class="article-content truncated">${escapeHtml(article.content)}</p>
      
      <div class="article-author">
        ✍️ Par ${escapeHtml(article.author)}
      </div>
    `;
    
    articlesContainer.appendChild(articleCard);
  });
}

// ==================== Supprimer Article ==================== 
function deleteArticle(id) {
  if (confirm('Êtes-vous sûr de vouloir supprimer cet article?')) {
    articles = articles.filter(a => a.id !== id);
    saveArticles();
    renderArticles();
  }
}

// ==================== Modifier Article ==================== 
function editArticle(id) {
  openModal(id);
}

// ==================== Filtre par Catégorie ==================== 
categoryFilter.addEventListener('change', () => {
  renderArticles();
});

// ==================== Dark Mode ==================== 
themeToggle.addEventListener('click', () => {
  document.body.classList.toggle('dark-mode');
  const isDark = document.body.classList.contains('dark-mode');
  saveTheme(isDark);
  themeToggle.textContent = isDark ? '☀️' : '🌙';
});

// ==================== Sécurité XSS ==================== 
function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

// ==================== Initialisation ==================== 
loadArticles();
loadTheme();
renderArticles();