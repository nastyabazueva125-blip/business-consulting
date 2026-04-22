/* ============================================
   ANASTASIA BAZUEVA - Business Consulting
   JavaScript - Эффект шума и анимации
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
    
    // ============================================
    // CANVAS NOISE EFFECT (усиленный эффект ряби/шума)
    // ============================================
    const canvas = document.getElementById('noise-canvas');
    const ctx = canvas.getContext('2d');
    
    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    
    // Генерация шума с вариациями интенсивности
    function generateNoise() {
        const imageData = ctx.createImageData(canvas.width, canvas.height);
        const data = imageData.data;
        
        // Случайная интенсивность для эффекта "мерцания"
        const intensity = 0.8 + Math.random() * 0.4;
        
        for (let i = 0; i < data.length; i += 4) {
            // Добавляем вариации для более реалистичного шума
            const value = Math.random() * 255 * intensity;
            
            // Иногда добавляем цветные помехи
            if (Math.random() > 0.995) {
                // Редкие цветные пиксели (глитч)
                data[i] = Math.random() * 255;     // R
                data[i + 1] = Math.random() * 100; // G
                data[i + 2] = Math.random() * 255; // B
            } else {
                data[i] = value;     // R
                data[i + 1] = value; // G
                data[i + 2] = value; // B
            }
            data[i + 3] = 255;   // A
        }
        
        // Добавляем горизонтальные линии помех
        const lineCount = Math.floor(Math.random() * 3);
        for (let l = 0; l < lineCount; l++) {
            const y = Math.floor(Math.random() * canvas.height);
            const lineWidth = Math.floor(Math.random() * 3) + 1;
            
            for (let ly = 0; ly < lineWidth; ly++) {
                const rowStart = ((y + ly) * canvas.width) * 4;
                for (let x = 0; x < canvas.width * 4; x += 4) {
                    const idx = rowStart + x;
                    if (idx < data.length - 3) {
                        data[idx] = 255;
                        data[idx + 1] = 255;
                        data[idx + 2] = 255;
                    }
                }
            }
        }
        
        ctx.putImageData(imageData, 0, 0);
    }
    
    // Анимация шума с переменной частотой
    let noiseInterval;
    let frameCount = 0;
    
    function animateNoise() {
        frameCount++;
        
        // Генерируем шум каждые несколько кадров для производительности
        if (frameCount % 2 === 0) {
            generateNoise();
        }
        
        requestAnimationFrame(animateNoise);
    }
    
    animateNoise();
    
    // ============================================
    // GLITCH EFFECT - периодический глитч
    // ============================================
    function triggerGlitch() {
        const glitchElements = document.querySelectorAll('.glitch-decor__shape');
        
        glitchElements.forEach(el => {
            // Случайное смещение
            const offsetX = (Math.random() - 0.5) * 20;
            const offsetY = (Math.random() - 0.5) * 10;
            const skew = (Math.random() - 0.5) * 5;
            
            el.style.transform = `translate(${offsetX}px, ${offsetY}px) skewX(${skew}deg)`;
            
            setTimeout(() => {
                el.style.transform = '';
            }, 100);
        });
    }
    
    // Периодический глитч
    setInterval(() => {
        if (Math.random() > 0.7) {
            triggerGlitch();
        }
    }, 2000);
    
    // ============================================
    // SMOOTH SCROLL
    // ============================================
    const anchors = document.querySelectorAll('a[href^="#"]');
    
    anchors.forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
    
    // ============================================
    // HEADER HIDE/SHOW ON SCROLL
    // ============================================
    let lastScrollY = 0;
    const header = document.querySelector('.header');
    
    if (header) {
        header.style.transition = 'transform 0.3s ease';
        
        window.addEventListener('scroll', () => {
            const currentScrollY = window.scrollY;
            
            if (currentScrollY > lastScrollY && currentScrollY > 100) {
                header.style.transform = 'translateY(-100%)';
            } else {
                header.style.transform = 'translateY(0)';
            }
            
            lastScrollY = currentScrollY;
        });
    }
    
    // ============================================
    // TITLE GLITCH ON HOVER
    // ============================================
    const heroTitle = document.querySelector('.hero__title');
    
    if (heroTitle) {
        heroTitle.addEventListener('mouseenter', () => {
            heroTitle.style.textShadow = '2px 0 #8B5CF6, -2px 0 #EC4899';
            setTimeout(() => {
                heroTitle.style.textShadow = '-1px 0 #3B82F6, 1px 0 #8B5CF6';
            }, 50);
            setTimeout(() => {
                heroTitle.style.textShadow = 'none';
            }, 150);
        });
    }
    
    // ============================================
    // CONTACT FORM HANDLER - Отправка в Telegram
    // ============================================
    const contactForm = document.getElementById('contactForm');
    
    // Отправка формы напрямую в Telegram Bot API
    async function sendToTelegram(data) {
        const BOT_TOKEN = '8500350195:AAFdvZoModGXIYqVjLZ2LiYaB6Goakocr58';
        const CHAT_ID = '318891687';
        
        const text = `📩 *Новая заявка с сайта*

👤 *Имя:* ${data.name}
💬 *Telegram:* ${data.telegram}
🎯 *Цель/боль:* ${data.goal}`;
        
        try {
            const response = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    chat_id: CHAT_ID,
                    text: text,
                    parse_mode: 'Markdown'
                })
            });
            
            const result = await response.json();
            return result.ok;
        } catch (error) {
            console.error('Ошибка отправки:', error);
            return false;
        }
    }
    
    if (contactForm) {
        contactForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const formData = new FormData(this);
            const data = Object.fromEntries(formData);
            
            const submitBtn = this.querySelector('.form__submit');
            const originalText = submitBtn.textContent;
            
            // Показываем статус отправки
            submitBtn.textContent = 'ОТПРАВКА...';
            submitBtn.disabled = true;
            
            // Отправляем в Telegram
            const success = await sendToTelegram(data);
            
            if (success) {
                submitBtn.textContent = 'ОТПРАВЛЕНО!';
                submitBtn.style.background = 'var(--color-accent)';
                submitBtn.style.borderColor = 'var(--color-accent)';
                submitBtn.style.color = 'var(--color-dark)';
                
                // Очищаем форму
                this.reset();
            } else {
                submitBtn.textContent = 'ОШИБКА';
                submitBtn.style.background = '#ef4444';
                submitBtn.style.borderColor = '#ef4444';
                submitBtn.style.color = 'white';
            }
            
            // Возвращаем кнопку в исходное состояние через 3 секунды
            setTimeout(() => {
                submitBtn.textContent = originalText;
                submitBtn.style.background = '';
                submitBtn.style.borderColor = '';
                submitBtn.style.color = '';
                submitBtn.disabled = false;
            }, 3000);
        });
    }
});
