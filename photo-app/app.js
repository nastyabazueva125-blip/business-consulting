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

  // Запускаем 3D эффект только на главной
  if (screen === 'home') init3D();
}

// ─── 3D ЭФФЕКТ НА ФОТО ───────────────────────────────────────────────────────

function init3D() {
  const img = document.querySelector('.hero-img');
  if (!img) return;

  // Мобильный: наклон телефона
  const handleOrientation = (e) => {
    if (!document.querySelector('.hero-img')) return; // экран сменился
    const x = Math.max(-1, Math.min(1, (e.gamma || 0) / 25));
    const y = Math.max(-1, Math.min(1, ((e.beta || 45) - 45) / 25));
    img.style.transform = `perspective(600px) rotateX(${-y * 10}deg) rotateY(${x * 10}deg) scale(1.08)`;
  };

  // Десктоп: движение мыши
  const handleMouse = (e) => {
    if (!document.querySelector('.hero-img')) return;
    const wrap = img.closest('.hero-img-wrap');
    if (!wrap) return;
    const rect = wrap.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
    const y = ((e.clientY - rect.top)  / rect.height - 0.5) * 2;
    img.style.transform = `perspective(600px) rotateX(${-y * 8}deg) rotateY(${x * 8}deg) scale(1.08)`;
  };

  if (window.DeviceOrientationEvent) {
    // Запрашиваем разрешение на iOS 13+
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

function screenHome() {
  const free = COURSE.lessons.filter(l => l.free).length;

  return `
    <!-- Топбар -->
    <div class="topbar">
      <div class="topbar-logo">Раздача Стиля</div>
      <div class="topbar-tag">VER. 1.0</div>
    </div>

    <!-- Hero tile: фото слева, текст справа -->
    <div class="hero-tile">
      <div class="hero-img-wrap">
        <img class="hero-img" src="hero.jpg" alt="" onerror="this.style.opacity='0'">
      </div>
      <div class="hero-content">
        <div class="hero-eyebrow">── VISUAL STYLE</div>
        <div class="hero-big">РАЗ<br>ДА<em>ЧА</em><br>СТИ<em>ЛЯ</em></div>
        <div class="hero-bottom">фотография<br>стиль · обработка<br>курсы</div>
      </div>
    </div>

    <!-- 2×2 тайловая сетка категорий -->
    <div class="cats-grid">
      ${CATEGORIES.map((cat, i) => `
        <div class="cat-tile" onclick="navigate('category','${cat.id}')">
          <div class="ct-num">0${i + 1}</div>
          <span class="ct-emoji">${cat.emoji}</span>
          <div class="ct-name">${cat.name}</div>
          <div class="ct-arrow">${cat.posts.length} ${plural(cat.posts.length,'пост','поста','постов')} →</div>
        </div>
      `).join('')}
    </div>

    <!-- Тайл курса на полную ширину -->
    <div class="course-tile" onclick="navigate('course')">
      <div class="ct-label">── Видеокурс</div>
      <div class="ct-title">Сам себе<br>Фотограф</div>
      <div class="ct-line"></div>
      <div class="ct-meta">
        <span>${COURSE.lessons.length} уроков · ${free} бесплатно</span>
        <span class="ct-cta">Смотреть →</span>
      </div>
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
