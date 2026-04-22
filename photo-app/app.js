// ─── TELEGRAM WEBAPP ──────────────────────────────────────────────────────────

const tg = window.Telegram?.WebApp ?? {
  ready:    () => {},
  expand:   () => {},
  openLink: (url) => window.open(url, '_blank'),
  BackButton: {
    show: () => {}, hide: () => {},
    onClick: (fn) => document.addEventListener('keydown', e => e.key === 'Escape' && fn()),
    offClick: () => {}
  },
  MainButton: { show: () => {}, hide: () => {}, setText: () => {}, onClick: () => {}, offClick: () => {} },
  HapticFeedback: { impactOccurred: () => {}, notificationOccurred: () => {} },
};

tg.ready();
tg.expand();

// ─── НАВИГАЦИЯ ────────────────────────────────────────────────────────────────

const stack = [];
let currentTab = 'home';

function navigate(screen, params) {
  stack.push({ screen, params: params ?? null });
  render(screen, params, 'forward');
  tg.BackButton[stack.length > 1 ? 'show' : 'hide']();
}

function tabNavigate(tab) {
  currentTab = tab;
  setActiveTab(tab);
  stack.length = 0;
  tg.HapticFeedback.impactOccurred('light');
  const screenMap = { home: 'home', feed: 'feed', course: 'course' };
  navigate(screenMap[tab] || 'home');
}

function setActiveTab(tab) {
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.tab === tab);
  });
}

function goBack() {
  if (stack.length <= 1) return;
  stack.pop();
  const top = stack[stack.length - 1];
  render(top.screen, top.params, 'back');
  tg.BackButton[stack.length > 1 ? 'show' : 'hide']();
  tg.HapticFeedback.impactOccurred('light');
}

tg.BackButton.onClick(goBack);

// ─── РЕНДЕРЕР ─────────────────────────────────────────────────────────────────

function render(screen, params, direction) {
  const app = document.getElementById('app');
  const prev = app.querySelector('.screen');

  if (prev && direction === 'forward') {
    prev.classList.add('exit');
    prev.addEventListener('animationend', () => prev.remove(), { once: true });
  } else if (prev) {
    prev.remove();
  }

  const el = document.createElement('div');
  el.className = 'screen';

  switch (screen) {
    case 'home':     el.innerHTML = screenHome(); break;
    case 'feed':     el.innerHTML = screenFeed(); break;
    case 'category': el.innerHTML = screenCategory(params); break;
    case 'post':     el.innerHTML = screenPost(params); break;
    case 'course':   el.innerHTML = screenCourse(); break;
    case 'lesson':   el.innerHTML = screenLesson(params); break;
    default:         el.innerHTML = screenHome();
  }

  if (direction === 'forward' && stack.length > 1) {
    el.classList.add('enter');
    el.addEventListener('animationend', () => el.classList.remove('enter'), { once: true });
  }

  app.appendChild(el);

  // Запускаем 3D эффект только на главной
  if (screen === 'home') init3D();
}

// ─── 3D ЭФФЕКТ НА ФОТО ───────────────────────────────────────────────────────

function init3D() {
  const img = document.querySelector('.photo-cutout');
  if (!img) return;

  const handleOrientation = (e) => {
    if (!document.querySelector('.photo-cutout')) return;
    const x = Math.max(-1, Math.min(1, (e.gamma || 0) / 30));
    const y = Math.max(-1, Math.min(1, ((e.beta || 45) - 45) / 30));
    img.style.transform = `translate(${x * 8}px, ${y * 4}px) scale(1.02)`;
  };

  const handleMouse = (e) => {
    if (!document.querySelector('.photo-cutout')) return;
    const x = (e.clientX / window.innerWidth - 0.5) * 2;
    const y = (e.clientY / window.innerHeight - 0.5) * 2;
    img.style.transform = `translate(${x * 12}px, ${y * 6}px) scale(1.02)`;
  };

  if (window.DeviceOrientationEvent) {
    if (typeof DeviceOrientationEvent.requestPermission === 'function') {
      DeviceOrientationEvent.requestPermission().then(state => {
        if (state === 'granted') window.addEventListener('deviceorientation', handleOrientation);
      }).catch(() => {});
    } else {
      window.addEventListener('deviceorientation', handleOrientation);
    }
  }

  document.addEventListener('mousemove', handleMouse);
}

// ─── ГЛАВНАЯ ──────────────────────────────────────────────────────────────────

function getCatIcon(catId) {
  const map = {
    recipes_photo:   '<div class="cicon icon-lens"></div>',
    recipes_editing: '<div class="cicon icon-diamond"></div>',
    video_lessons:   '<div class="cicon icon-play"></div>',
    watched:         '<div class="cicon icon-eye"></div>',
  };
  return map[catId] || '<div class="cicon icon-lens"></div>';
}

function screenHome() {
  const totalPosts  = CATEGORIES.reduce((s, c) => s + c.posts.length, 0);
  const freeLessons = COURSE.lessons.filter(l => l.free).length;

  return `
    <div class="home-red">
      <!-- Баннер -->
      <div class="banner">
        <div class="banner-tag">VER. 1.0</div>
        <div class="banner-title">
          <div><span class="fill">РАЗДАЧА</span></div>
          <div><span class="outline">СТИЛЯ</span></div>
        </div>
      </div>

      <!-- Editorial-сетка -->
      <div class="editorial">
        <!-- Левая колонка — статы -->
        <div class="home-stats">
          <div>
            <div class="home-stat-num">0${CATEGORIES.length}</div>
            <div class="home-stat-lbl">ТЕМЫ</div>
          </div>
          <div>
            <div class="home-stat-num">${String(totalPosts).padStart(2, '0')}</div>
            <div class="home-stat-lbl">ПОСТОВ</div>
          </div>
          <div>
            <div class="home-stat-num">0${freeLessons}</div>
            <div class="home-stat-lbl">FREE</div>
          </div>
        </div>

        <!-- Правая колонка — фото -->
        <div class="photo-cell">
          <img class="photo-cutout" src="hero-cutout.png" alt="">
        </div>

        <!-- Иконка -->
        <div class="icon-cell">
          <div class="circle-icon"></div>
        </div>

        <!-- Описание -->
        <div class="desc-cell">
          Авторский блог про фотографию. Рецепты съёмки, обработка, видеоуроки и полный курс «Сам себе фотограф» — от нуля до уверенной работы с камерой.
        </div>
      </div>

      <!-- Тайлы категорий -->
      <div class="cat-tiles">
        ${CATEGORIES.map(cat => `
          <div class="cat-tile" onclick="navigate('category','${cat.id}')">
            <div class="cat-tile-icon">${getCatIcon(cat.id)}</div>
            <div class="cat-tile-name">${cat.name.toUpperCase()}</div>
            <div class="cat-tile-count">${cat.posts.length} ${plural(cat.posts.length, 'пост', 'поста', 'постов')}</div>
          </div>
        `).join('')}
      </div>

      <!-- Нижний бар -->
      <div class="bottom-bar">
        <button class="tech-button" onclick="tabNavigate('course')">
          <span class="br tl"></span><span class="br tr"></span>
          <span class="br bl"></span><span class="br br"></span>
          &gt;_VIEW_COURSE
        </button>
        <div class="version">V.1.0.0 · ${COURSE.lessons.length}LSN</div>
      </div>
    </div>

    <!-- Глитч-фото -->
    <div class="glitch-section">
      <div class="glitch-photo">
        <div class="glitch-scanlines"></div>
        <div class="glitch-gradient"></div>
        <div class="glitch-caption">
          <span class="glitch-caption-name">РАЗДАЧА·СТИЛЯ</span>
          <span class="glitch-caption-tag">&gt;_PHOTO.BLOG<br>© 2025—∞</span>
        </div>
      </div>
    </div>
  `;
}

// ─── КОНТЕНТ (ГРИД КАТЕГОРИЙ) ─────────────────────────────────────────────────

function screenFeed() {
  return `
    <div class="page-header">
      <div class="page-header-eyebrow">// контент</div>
      <div class="page-header-title">КАТЕГОРИИ</div>
      <div class="page-header-desc">Выбери раздел</div>
    </div>
    <div class="feed-grid">
      ${CATEGORIES.map((cat, i) => `
        <div class="feed-cat-card" onclick="navigate('category','${cat.id}')">
          <div class="feed-cat-num">0${i + 1}</div>
          <div class="feed-cat-emoji">${cat.emoji}</div>
          <div class="feed-cat-name">${cat.name.toUpperCase()}</div>
          <div class="feed-cat-desc">${cat.desc}</div>
          <div class="feed-cat-count">${cat.posts.length} ${plural(cat.posts.length, 'пост', 'поста', 'постов')}</div>
        </div>
      `).join('')}
    </div>
  `;
}

// ─── КАТЕГОРИЯ ────────────────────────────────────────────────────────────────

function screenCategory(catId) {
  const cat = CATEGORIES.find(c => c.id === catId);
  if (!cat) return screenHome();

  const body = cat.posts.length === 0
    ? `<div class="empty-state">
         <div class="empty-state-emoji">${cat.emoji}</div>
         <div class="empty-state-title">Скоро будет контент</div>
         <div class="empty-state-desc">Посты из канала появятся здесь</div>
       </div>`
    : cat.posts.map(postItem).join('');

  return `
    <div class="page-header">
      <div class="page-header-eyebrow">${cat.emoji} категория</div>
      <div class="page-header-title">${cat.name}</div>
      <div class="page-header-desc">${cat.desc}</div>
    </div>
    ${body}
  `;
}

function postItem(post) {
  const thumb = post.media_type === 'photo' && post.media_path
    ? `<div class="post-thumb"><img src="${post.media_path}" loading="lazy"></div>`
    : post.media_type === 'video'
    ? `<div class="post-thumb">🎬</div>`
    : '';

  return `
    <div class="post-item" onclick="navigate('post',${post.id})">
      ${thumb}
      <div class="post-text">${esc(post.text)}</div>
      <div class="post-meta">
        <span>${fmtDate(post.date)}</span>
        ${post.media_type === 'video' ? '<span class="post-badge">видео</span>' : ''}
        ${post.media_type === 'photo' ? '<span class="post-badge">фото</span>' : ''}
      </div>
    </div>
  `;
}

// ─── ПОСТ ─────────────────────────────────────────────────────────────────────

function screenPost(postId) {
  let post = null, cat = null;
  for (const c of CATEGORIES) {
    const found = c.posts.find(p => p.id === postId);
    if (found) { post = found; cat = c; break; }
  }
  if (!post) return '';

  const media = post.media_type === 'photo' && post.media_path
    ? `<div class="post-detail-media"><img src="${post.media_path}"></div>`
    : post.media_type === 'video'
    ? `<div class="post-detail-media">🎬</div>`
    : '';

  return `
    <div class="page-header">
      <div class="page-header-eyebrow">${cat.emoji} ${cat.name}</div>
      <div class="page-header-title">${fmtDate(post.date)}</div>
    </div>
    <div class="post-detail">
      ${media}
      <div class="post-detail-text">${esc(post.text)}</div>
    </div>
  `;
}

// ─── КУРС ─────────────────────────────────────────────────────────────────────

function screenCourse() {
  const free   = COURSE.lessons.filter(l => l.free).length;
  const locked = COURSE.lessons.length - free;

  const lessons = COURSE.lessons.map((l, i) => `
    <div class="lesson-item" onclick="lessonTap(${l.id})">
      <div class="lesson-icon ${l.free ? 'free' : 'locked'}">${l.free ? '▶' : '🔒'}</div>
      <div class="lesson-info">
        <div class="lesson-title${l.free ? '' : ' dimmed'}">${i + 1}. ${l.title}</div>
        <div class="lesson-meta">
          <span>${l.duration}</span>
          ${l.free ? '<span class="free-badge">Бесплатно</span>' : ''}
        </div>
      </div>
    </div>
  `).join('');

  return `
    <div class="page-header">
      <div class="page-header-eyebrow">🎓 видеокурс</div>
      <div class="page-header-title">${COURSE.title}</div>
      <div class="page-header-desc">${COURSE.desc}</div>
    </div>

    <div class="course-stats">
      <div class="course-stat"><strong>${COURSE.lessons.length}</strong><span>уроков</span></div>
      <div class="course-stat"><strong>${free}</strong><span>бесплатно</span></div>
      <div class="course-stat"><strong>${locked}</strong><span>в курсе</span></div>
    </div>

    <div class="lesson-list">${lessons}</div>

    <div class="buy-section">
      <div class="buy-price">${COURSE.price.toLocaleString('ru-RU')} ${COURSE.currency}</div>
      <div class="buy-note">Полный доступ ко всем урокам навсегда</div>
      <button class="buy-btn" onclick="buyCourse()">Купить курс</button>
    </div>
  `;
}

function lessonTap(id) {
  const lesson = COURSE.lessons.find(l => l.id === id);
  if (!lesson) return;
  if (lesson.free) {
    navigate('lesson', id);
  } else {
    tg.HapticFeedback.notificationOccurred('warning');
    document.querySelector('.buy-section')?.scrollIntoView({ behavior: 'smooth' });
  }
}

function buyCourse() {
  tg.HapticFeedback.impactOccurred('medium');
  tg.openLink(COURSE.payLink);
}

// ─── УРОК ─────────────────────────────────────────────────────────────────────

function screenLesson(id) {
  const lesson = COURSE.lessons.find(l => l.id === id);
  const idx    = COURSE.lessons.indexOf(lesson);
  if (!lesson || !lesson.free) return '';

  return `
    <div class="page-header">
      <div class="page-header-eyebrow">▶ урок ${idx + 1}</div>
      <div class="page-header-title">${lesson.title}</div>
      <div class="page-header-desc">${lesson.duration}</div>
    </div>
    <div class="video-placeholder">
      <div class="video-placeholder-icon">🎬</div>
      <div class="video-placeholder-text">Видео скоро появится</div>
    </div>
  `;
}

// ─── УТИЛИТЫ ──────────────────────────────────────────────────────────────────

function fmtDate(str) {
  return new Date(str).toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' });
}

function esc(str) {
  return String(str || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/\n/g, '<br>');
}

function plural(n, one, few, many) {
  const m10 = n % 10, m100 = n % 100;
  if (m10 === 1 && m100 !== 11) return `${n} ${one}`;
  if ([2,3,4].includes(m10) && ![12,13,14].includes(m100)) return `${n} ${few}`;
  return `${n} ${many}`;
}

// ─── СТАРТ ────────────────────────────────────────────────────────────────────

navigate('home');
