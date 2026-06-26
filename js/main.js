/* ============================================
   易境通 - 全站交互脚本
   ============================================ */
(function () {
  'use strict';

  /* ===== 导航栏滚动效果 ===== */
  const navbar = document.getElementById('navbar');
  if (navbar) {
    const onScroll = () => {
      if (window.scrollY > 20) navbar.classList.add('scrolled');
      else navbar.classList.remove('scrolled');
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* ===== 移动端菜单 ===== */
  const navToggle = document.getElementById('navToggle');
  const navMenu = document.getElementById('navMenu');
  if (navToggle && navMenu) {
    navToggle.addEventListener('click', () => {
      navToggle.classList.toggle('active');
      navMenu.classList.toggle('open');
    });
    navMenu.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => {
        navToggle.classList.remove('active');
        navMenu.classList.remove('open');
      });
    });
  }

  /* ===== 滚动揭示动画 ===== */
  const reveals = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && reveals.length) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    reveals.forEach(el => io.observe(el));
  } else {
    reveals.forEach(el => el.classList.add('in'));
  }

  /* ===== 数字计数动画 ===== */
  const counters = document.querySelectorAll('[data-count]');
  if ('IntersectionObserver' in window && counters.length) {
    const animateCount = (el) => {
      const target = parseInt(el.dataset.count, 10);
      const unitEl = el.querySelector('.unit');
      const unit = unitEl ? unitEl.outerHTML : '';
      const duration = 1600;
      const start = performance.now();
      const tick = (now) => {
        const p = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - p, 3);
        const val = Math.floor(eased * target);
        el.innerHTML = val + unit;
        if (p < 1) requestAnimationFrame(tick);
        else el.innerHTML = target + unit;
      };
      requestAnimationFrame(tick);
    };
    const countIO = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCount(entry.target);
          countIO.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });
    counters.forEach(el => countIO.observe(el));
  }

  /* ===== 平台/渠道 Tab 切换 ===== */
  const ecoTabs = document.querySelectorAll('.eco-tab');
  const ecoPanels = document.querySelectorAll('.eco-panel');
  if (ecoTabs.length) {
    ecoTabs.forEach(tab => {
      tab.addEventListener('click', () => {
        const target = tab.dataset.tab;
        ecoTabs.forEach(t => t.classList.remove('active'));
        ecoPanels.forEach(p => p.classList.remove('active'));
        tab.classList.add('active');
        const panel = document.getElementById(target);
        if (panel) {
          panel.classList.add('active');
          // 重新触发 reveal 动画
          panel.querySelectorAll('.reveal').forEach(el => {
            el.classList.remove('in');
            requestAnimationFrame(() => el.classList.add('in'));
          });
        }
      });
    });
  }

  /* ===== 预约表单提交 ===== */
  const demoForm = document.getElementById('demoForm');
  const formSuccess = document.getElementById('formSuccess');
  if (demoForm) {
    demoForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const phone = demoForm.phone.value.trim();
      if (!/^1[3-9]\d{9}$/.test(phone)) {
        alert('请输入正确的手机号');
        demoForm.phone.focus();
        return;
      }
      demoForm.style.display = 'none';
      if (formSuccess) formSuccess.classList.add('show');
    });
  }

  /* ===== 平滑滚动到锚点 ===== */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const href = this.getAttribute('href');
      if (href === '#' || href.length < 2) return;
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        const offset = 80;
        const top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

})();
