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
  MainButton: {
    show: () => {}, hide: () => {},
    setText: () => {}, onClick: () => {}, offClick: () => {},
    isVisible: false
  },
  HapticFeedback: { impactOccurred: () => {}, notificationOccurred: () => {} },
  colorScheme: 'dark',
};

tg.ready();
tg.expand();

// ─── НАВИГАЦИЯ ────────────────────────────────────────────────────────────────

const stack = []; // [{ screen, params }]

function navigate(screen, params) {
  stack.push({ screen, params: params ?? null });
  render(screen, params, 'forward');
  tg.BackButton[stack.length > 1 ? 'show' : 'hide']();
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
}

// ─── ГЛАВНАЯ СТРАНИЦА ─────────────────────────────────────────────────────────

function screenHome() {
  const free = COURSE.lessons.filter(l => l.free).length;

  return `
    <div class="home-hero">
      <div class="home-title">раздача<br><span>стиля</span></div>
      <div class="home-sub">фотография · стиль · обработка</div>
    </div>

    <div class="section-label">Категории</div>
    <div class="category-grid">
      ${CATEGORIES.map(cat => `
        <div class="cat-card" onclick="navigate('category','${cat.id}')">
          <span class="cat-emoji">${cat.emoji}</span>
          <div class="cat-name">${cat.name}</div>
          <div class="cat-count">${cat.posts.length} ${plural(cat.posts.length,'пост','поста','постов')}</div>
        </div>
      `).join('')}
    </div>

    <div class="section-label">Курс</div>
    <div class="course-banner" onclick="navigate('course')">
      <div>
        <div class="course-banner-tag">Видеокурс</div>
        <div class="course-banner-title">${COURSE.title}</div>
        <div class="course-banner-desc">${COURSE.lessons.length} уроков · ${free} бесплатно</div>
      </div>
      <div class="course-banner-arrow">›</div>
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
         <div class="empty-state-desc">Посты из закрытого канала<br>появятся здесь после загрузки</div>
       </div>`
    : `<div class="post-list">${cat.posts.map(postItem).join('')}</div>`;

  return `
    <div class="page-header">
      <div class="page-header-emoji">${cat.emoji}</div>
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
      <div class="page-header-emoji">${cat.emoji}</div>
      <div class="page-header-title">${cat.name}</div>
    </div>
    <div class="post-detail">
      <div class="post-detail-date">${fmtDate(post.date)}</div>
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
      <div class="page-header-emoji">🎓</div>
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
      <div class="buy-note">Полный доступ ко всем урокам</div>
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
      <div class="page-header-emoji">▶</div>
      <div class="page-header-title">Урок ${idx + 1}. ${lesson.title}</div>
      <div class="page-header-desc">${lesson.duration}</div>
    </div>
    <div class="video-placeholder">
      <div class="video-placeholder-icon">🎬</div>
      <div class="video-placeholder-text">Видео будет добавлено скоро</div>
    </div>
  `;
}

// ─── УТИЛИТЫ ──────────────────────────────────────────────────────────────────

function fmtDate(str) {
  return new Date(str).toLocaleDateString('ru-RU', {
    day: 'numeric', month: 'long', year: 'numeric'
  });
}

function esc(str) {
  return String(str || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/\n/g, '<br>');
}

function plural(n, one, few, many) {
  const mod10 = n % 10, mod100 = n % 100;
  if (mod10 === 1 && mod100 !== 11) return `${n} ${one}`;
  if ([2,3,4].includes(mod10) && ![12,13,14].includes(mod100)) return `${n} ${few}`;
  return `${n} ${many}`;
}

// ─── СТАРТ ────────────────────────────────────────────────────────────────────

navigate('home');
