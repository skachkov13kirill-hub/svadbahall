// ===== Аврора Холл — интерактив =====

(function() {
  'use strict';

  // ===== Mobile nav =====
  const navToggle = document.getElementById('navToggle');
  const nav = document.getElementById('nav');
  if (navToggle && nav) {
    navToggle.addEventListener('click', () => {
      nav.classList.toggle('open');
    });
    nav.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => nav.classList.remove('open'));
    });
  }

  // ===== FAQ accordion =====
  document.querySelectorAll('.faq-item').forEach(item => {
    const question = item.querySelector('.faq-question');
    if (question) {
      question.addEventListener('click', () => {
        const isOpen = item.classList.contains('open');
        document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('open'));
        if (!isOpen) item.classList.add('open');
      });
    }
  });

  // ===== Fade-up on scroll =====
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

    document.querySelectorAll('.fade-up').forEach(el => observer.observe(el));
  } else {
    // Fallback for old browsers
    document.querySelectorAll('.fade-up').forEach(el => el.classList.add('visible'));
  }

  // ===== Header opaque on scroll =====
  const header = document.getElementById('header');
  if (header) {
    const onScroll = () => {
      if (window.scrollY > 30) {
        header.style.background = 'rgba(250, 248, 245, 0.95)';
        header.style.boxShadow = '0 1px 0 rgba(232, 226, 216, 0.5)';
      } else {
        header.style.background = 'rgba(250, 248, 245, 0.85)';
        header.style.boxShadow = 'none';
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  // ===== Form submission =====
  // ВАЖНО: в продакшене токен бота НЕ хранится на клиенте.
  // Это демо-форма: отправляет на безопасный прокси-эндпоинт.
  // В демо-режиме — показывает успех без реальной отправки.
  const FORM_ENDPOINT = ''; // оставлено пустым для демо-режима

  const form = document.getElementById('contactForm');
  if (form) {
    const status = document.getElementById('formStatus');
    const submitBtn = document.getElementById('submitBtn');

    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      submitBtn.disabled = true;
      submitBtn.textContent = 'Отправляем…';
      status.className = 'form-status';
      status.textContent = '';

      const data = Object.fromEntries(new FormData(form).entries());

      try {
        if (FORM_ENDPOINT) {
          const response = await fetch(FORM_ENDPOINT, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
          });
          if (!response.ok) throw new Error('Server error');
        } else {
          // Демо-режим: эмулируем сетевую задержку
          await new Promise(r => setTimeout(r, 800));
        }

        status.classList.add('success');
        status.textContent = 'Заявка получена. Юлия свяжется в течение суток.';
        form.reset();
      } catch (err) {
        status.classList.add('error');
        status.textContent = 'Что-то пошло не так. Напишите нам в Telegram: @aurorahall_spb';
      } finally {
        setTimeout(() => {
          submitBtn.disabled = false;
          submitBtn.textContent = 'Отправить заявку';
        }, 1500);
      }
    });
  }

  // ===== Smooth scroll for anchor links =====
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', (e) => {
      const targetId = link.getAttribute('href');
      if (targetId === '#') return;
      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        const offset = 70;
        const top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

})();
