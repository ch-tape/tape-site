// ===== DOM Ready =====
document.addEventListener('DOMContentLoaded', () => {
  initNavigation();
  initBackToTop();
  initStatCounter();
  renderCompanyNews();
  renderApplications();
  renderProducts();
  initProductFilter();
  renderExhibitions();
  renderDomesticEnterprises();
  renderTalentJobs();
  initTalentForm();
  initModals();
});

// ===== 导航 =====
function initNavigation() {
  const nav = document.getElementById('nav');
  const menuToggle = document.getElementById('menuToggle');
  const navLinks = nav.querySelectorAll('.nav-link');

  menuToggle.addEventListener('click', () => {
    nav.classList.toggle('open');
  });

  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      navLinks.forEach(l => l.classList.remove('active'));
      link.classList.add('active');
      nav.classList.remove('open');
    });
  });

  // 滚动高亮
  window.addEventListener('scroll', () => {
    const sections = document.querySelectorAll('section[id]');
    let current = '';
    sections.forEach(section => {
      const top = section.offsetTop - 100;
      if (window.scrollY >= top) {
        current = section.getAttribute('id');
      }
    });
    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === '#' + current) {
        link.classList.add('active');
      }
    });
    // 如果没有匹配，激活首页
    if (!current || current === 'home') {
      navLinks[0].classList.add('active');
    }
  });
}

// ===== 回到顶部 =====
function initBackToTop() {
  const btn = document.getElementById('backToTop');
  window.addEventListener('scroll', () => {
    btn.classList.toggle('visible', window.scrollY > 400);
  });
  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

// ===== 统计数字动画 =====
function initStatCounter() {
  const nums = document.querySelectorAll('.stat-num');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = parseInt(el.dataset.target);
        animateCount(el, target);
        observer.unobserve(el);
      }
    });
  }, { threshold: 0.5 });
  nums.forEach(n => observer.observe(n));
}

function animateCount(el, target) {
  let current = 0;
  const duration = 1500;
  const step = Math.ceil(target / (duration / 16));
  const timer = setInterval(() => {
    current += step;
    if (current >= target) {
      el.textContent = target;
      clearInterval(timer);
    } else {
      el.textContent = current;
    }
  }, 16);
}

// ===== 渲染工具函数 =====
function createNewsCard(item) {
  return `
    <div class="news-card" data-id="${item.id}" data-section="${item.tag || ''}">
      <div class="news-card-img" style="background: linear-gradient(135deg, ${randomGradient()});">
        <span>${item.icon || '📰'}</span>
      </div>
      <div class="news-card-body">
        <span class="news-card-tag">${item.tag}</span>
        <h3>${item.title}</h3>
        <p>${item.summary}</p>
        <div class="news-card-meta">
          <span>${item.date}</span>
          <span>${item.source || ''}</span>
        </div>
      </div>
    </div>
  `;
}

function randomGradient() {
  const gradients = [
    '#667eea, #764ba2',
    '#f093fb, #f5576c',
    '#4facfe, #00f2fe',
    '#43e97b, #38f9d7',
    '#fa709a, #fee140',
    '#a18cd1, #fbc2eb',
    '#fad0c4, #ffd1ff',
    '#ffecd2, #fcb69f'
  ];
  return gradients[Math.floor(Math.random() * gradients.length)];
}

// ===== 板块一：公司动态 =====
function renderCompanyNews() {
  const grid = document.getElementById('companyNewsGrid');
  grid.innerHTML = companyNews.map(item => createNewsCard(item)).join('');
}

// ===== 板块二：行业应用 =====
function renderApplications() {
  const grid = document.getElementById('applicationsGrid');
  grid.innerHTML = applications.map(item => createNewsCard(item)).join('');
}

// ===== 板块三：新品发布 =====
function renderProducts(filter = 'all') {
  const grid = document.getElementById('productsGrid');
  const filtered = filter === 'all' ? products : products.filter(p => p.tag === filter);
  grid.innerHTML = filtered.map(item => createNewsCard(item)).join('');
}

function initProductFilter() {
  const buttons = document.querySelectorAll('#productFilter .filter-btn');
  buttons.forEach(btn => {
    btn.addEventListener('click', () => {
      buttons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      renderProducts(btn.dataset.filter);
    });
  });
}

// ===== 板块四：展会动态 =====
function renderExhibitions() {
  const timeline = document.getElementById('exhibitionTimeline');
  timeline.innerHTML = exhibitions.map(ex => `
    <div class="exhibition-card" data-id="${ex.id}" data-section="exhibition">
      <div class="exhibition-date">
        <span class="month">${ex.month}</span>
        <span class="day">${ex.day}</span>
      </div>
      <div class="exhibition-info">
        <h3>${ex.title}</h3>
        <div class="location">📍 ${ex.location}</div>
        <div class="desc">${ex.desc}</div>
        <span class="exhibition-status ${ex.status}">${statusLabel(ex.status)}</span>
      </div>
    </div>
  `).join('');
}

function statusLabel(status) {
  const map = { upcoming: '即将举办', ongoing: '进行中', past: '已结束' };
  return map[status] || status;
}

// ===== 板块五：国内企业 =====
function renderDomesticEnterprises() {
  const list = document.getElementById('domesticEnterpriseList');
  list.innerHTML = domesticEnterprises.map(ent => `
    <div class="enterprise-card" data-id="${ent.id}" data-section="domestic">
      <div class="enterprise-logo" style="background: ${ent.logo_bg};">
        ${ent.logo_icon}
      </div>
      <div class="enterprise-info">
        <h3>${ent.name}</h3>
        <div class="industry">${ent.industry}</div>
        <div class="enterprise-news">${ent.news}</div>
        <div class="enterprise-meta">📅 ${ent.date}</div>
      </div>
      <span class="arrow">›</span>
    </div>
  `).join('');
}

// ===== 弹窗详情 =====
function initModals() {
  // 创建弹窗容器
  const overlay = document.createElement('div');
  overlay.className = 'modal-overlay';
  overlay.id = 'modalOverlay';
  overlay.innerHTML = `
    <div class="modal">
      <button class="modal-close" id="modalClose">&times;</button>
      <div class="modal-content" id="modalContent"></div>
    </div>
  `;
  document.body.appendChild(overlay);

  const modalContent = document.getElementById('modalContent');
  const modalClose = document.getElementById('modalClose');

  // 点击卡片打开弹窗
  document.addEventListener('click', (e) => {
    const card = e.target.closest('.news-card, .exhibition-card, .enterprise-card');
    if (!card) return;
    const section = card.dataset.section;
    const id = parseInt(card.dataset.id);
    let data;
    if (section === 'exhibition') {
      data = exhibitions.find(item => item.id === id);
    } else if (section === 'domestic') {
      data = domesticEnterprises.find(item => item.id === id);
    } else {
      data = [...companyNews, ...applications, ...products].find(item => item.id === id);
    }
    if (data && data.content) {
      modalContent.innerHTML = `
        <h2>${data.title}</h2>
        <div class="modal-date">📅 ${data.date}  |  来源：${data.source || '官方'}</div>
        <div class="modal-body">${data.content}</div>
        <div class="modal-source">${data.location ? '📍 ' + data.location : ''}</div>
      `;
      overlay.classList.add('active');
      document.body.style.overflow = 'hidden';
    }
  });

  // 关闭弹窗
  const closeModal = () => {
    overlay.classList.remove('active');
    document.body.style.overflow = '';
  };
  modalClose.addEventListener('click', closeModal);
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) closeModal();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeModal();
  });
}

// ===== 板块六：人才交流中心 =====
function renderTalentJobs() {
  const grid = document.getElementById('talentGrid');
  grid.innerHTML = talentJobs.map(job => `
    <div class="talent-card" data-id="${job.id}" data-section="talent">
      <div class="talent-card-header">
        <div class="talent-card-logo" style="background: ${job.logo_bg};">${job.logo_icon}</div>
        <div>
          <div class="talent-card-company">${job.company}</div>
          <div class="talent-card-title">${job.title}</div>
        </div>
      </div>
      <div class="talent-card-meta">
        <span>📍 ${job.location}</span>
        <span>💰 ${job.salary}</span>
      </div>
      <div class="talent-card-tags">
        ${job.tags.map(t => `<span class="talent-tag">${t}</span>`).join('')}
      </div>
      <div class="talent-card-desc">${job.desc}</div>
    </div>
  `).join('');
}

function initTalentForm() {
  const wrapper = document.getElementById('talentFormWrapper');
  const formTitle = document.getElementById('formTitle');
  const form = document.getElementById('jobForm');
  const btnRecruit = document.getElementById('btnRecruit');
  const btnApply = document.getElementById('btnApply');

  let mode = 'recruit';

  btnRecruit.addEventListener('click', () => {
    mode = 'recruit';
    formTitle.textContent = '📋 发布招聘信息';
    form.querySelector('button[type="submit"]').textContent = '发布招聘';
    wrapper.classList.toggle('open');
  });

  btnApply.addEventListener('click', () => {
    mode = 'apply';
    formTitle.textContent = '📄 提交求职信息';
    form.querySelector('button[type="submit"]').textContent = '提交简历';
    wrapper.classList.toggle('open');
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const inputs = form.querySelectorAll('input, textarea');
    const data = {};
    inputs.forEach(inp => { data[inp.placeholder] = inp.value; });
    const msg = mode === 'recruit'
      ? '🎉 招聘信息已提交！我们将在 1-2 个工作日内审核发布。'
      : '🎉 求职信息已提交！匹配到合适岗位后我们将第一时间联系您。';
    alert(msg);
    form.reset();
    wrapper.classList.remove('open');
  });
}
