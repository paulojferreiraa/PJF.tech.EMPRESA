// PJF.tech – efeitos modernos: 3D (Three.js), reveal, tilt, contadores
(() => {
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const fine = matchMedia('(pointer: fine)').matches;
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const hasIO = 'IntersectionObserver' in window;

  // Barra de progresso + header
  const bar = $('#scroll-bar'), header = $('header');
  const onScroll = () => {
    const h = document.documentElement, max = h.scrollHeight - h.clientHeight;
    if (bar && max > 0) bar.style.transform = `scaleX(${h.scrollTop / max})`;
    if (header) header.classList.toggle('is-scrolled', h.scrollTop > 40);
  };
  addEventListener('scroll', onScroll, { passive: true }); onScroll();

  // Reveal ao rolar
  $$('main section h2, main section h2 + p, main .grid > *, .cta-banner, #contato form').forEach((el, i) => {
    if (el.closest('form') && el.tagName !== 'FORM') return;
    el.classList.add('reveal'); el.style.setProperty('--d', (i % 4) * 90 + 'ms');
  });
  const reveals = $$('.reveal');
  if (hasIO && !reduce) {
    const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }), { threshold: .12, rootMargin: '0px 0px -40px 0px' });
    reveals.forEach(el => io.observe(el));
  } else reveals.forEach(el => el.classList.add('in'));

  // Contadores
  const count = el => {
    const m = el.textContent.trim().match(/^(\D*)(\d+)(.*)$/); if (!m || reduce) return;
    const [, p, n, s] = m, end = +n, t0 = performance.now();
    const tick = t => { const k = Math.min((t - t0) / 1400, 1); el.textContent = p + Math.round(end * (1 - Math.pow(1 - k, 3))) + s; if (k < 1) requestAnimationFrame(tick); };
    requestAnimationFrame(tick);
  };
  if (hasIO) {
    const cio = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { count(e.target); cio.unobserve(e.target); } }), { threshold: .6 });
    $$('.stat-number').forEach(el => cio.observe(el));
  }

  // Tilt 3D nos cards + brilho que segue o mouse
  $$('.project-card,.benefit-card,#servicos .bg-darkCard,.value-feature,.stat-card').forEach(el => el.classList.add('tilt'));
  if (fine && !reduce) {
    $$('.tilt,.hero-visual').forEach(el => {
      const deg = el.classList.contains('hero-visual') ? 12 : 8;
      el.addEventListener('pointermove', e => {
        const r = el.getBoundingClientRect(), x = (e.clientX - r.left) / r.width, y = (e.clientY - r.top) / r.height;
        el.style.setProperty('--mx', x * 100 + '%'); el.style.setProperty('--my', y * 100 + '%');
        el.style.transform = `perspective(900px) rotateX(${(.5 - y) * deg}deg) rotateY(${(x - .5) * deg * 1.2}deg)`;
      });
      el.addEventListener('pointerleave', () => { el.style.transform = ''; });
    });
    // Brilho que acompanha o cursor
    const glow = $('#cursor-glow'); let gx = 0, gy = 0, tx = 0, ty = 0;
    if (glow) {
      addEventListener('pointermove', e => { tx = e.clientX; ty = e.clientY; glow.style.opacity = 1; }, { passive: true });
      (function f() { gx += (tx - gx) * .12; gy += (ty - gy) * .12; glow.style.transform = `translate(${gx}px,${gy}px)`; requestAnimationFrame(f); })();
    }
  }

  // Cena 3D do hero
  const canvas = $('#hero-canvas'), hero = $('#inicio');
  if (!canvas || !hero || !window.THREE || reduce) return;
  let renderer;
  try { renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true }); } catch (e) { canvas.remove(); return; }
  renderer.setPixelRatio(Math.min(devicePixelRatio, 1.75));
  const scene = new THREE.Scene(), cam = new THREE.PerspectiveCamera(50, 1, .1, 100); cam.position.z = 7;
  const group = new THREE.Group(); scene.add(group);

  const wire = new THREE.Mesh(new THREE.IcosahedronGeometry(1.8, 1), new THREE.MeshBasicMaterial({ color: 0x818cf8, wireframe: true, transparent: true, opacity: .35 }));
  const core = new THREE.Mesh(new THREE.IcosahedronGeometry(1.2, 0), new THREE.MeshStandardMaterial({ color: 0x6366f1, metalness: .7, roughness: .25, emissive: 0x3730a3, emissiveIntensity: .6, flatShading: true }));
  const ring = new THREE.Mesh(new THREE.TorusGeometry(2.7, .016, 8, 180), new THREE.MeshBasicMaterial({ color: 0xa78bfa }));
  const ring2 = new THREE.Mesh(new THREE.TorusGeometry(3.2, .012, 8, 180), new THREE.MeshBasicMaterial({ color: 0x3b82f6, transparent: true, opacity: .7 }));
  ring.rotation.x = 1.2; ring2.rotation.x = 1.9; ring2.rotation.y = .5;
  group.add(wire, core, ring, ring2);
  scene.add(new THREE.AmbientLight(0xffffff, .6));
  const l1 = new THREE.PointLight(0x8b5cf6, 2.2); l1.position.set(4, 3, 5);
  const l2 = new THREE.PointLight(0x3b82f6, 1.6); l2.position.set(-4, -2, 3); scene.add(l1, l2);

  const N = innerWidth < 768 ? 120 : 320, pos = new Float32Array(N * 3);
  for (let i = 0; i < N; i++) {
    const r = 4 + Math.random() * 9, a = Math.random() * 6.283, b = Math.acos(2 * Math.random() - 1);
    pos.set([r * Math.sin(b) * Math.cos(a), r * Math.sin(b) * Math.sin(a), r * Math.cos(b)], i * 3);
  }
  const geo = new THREE.BufferGeometry(); geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  const stars = new THREE.Points(geo, new THREE.PointsMaterial({ color: 0xa5b4fc, size: .035, transparent: true, opacity: .8 })); scene.add(stars);

  const resize = () => {
    const w = hero.clientWidth, h = hero.clientHeight; renderer.setSize(w, h, false);
    cam.aspect = w / h; cam.updateProjectionMatrix();
    const wide = w > 1024; group.position.x = wide ? 3 : 0; group.scale.setScalar(wide ? 1 : .75);
  };
  resize(); addEventListener('resize', resize);

  let mx = 0, my = 0, visible = true;
  addEventListener('pointermove', e => { mx = e.clientX / innerWidth - .5; my = e.clientY / innerHeight - .5; }, { passive: true });
  if (hasIO) new IntersectionObserver(([e]) => { visible = e.isIntersecting; }).observe(hero);
  const clock = new THREE.Clock();
  (function loop() {
    requestAnimationFrame(loop);
    if (!visible || document.hidden) return;
    const t = clock.getElapsedTime();
    wire.rotation.set(t * .12, t * .25, 0); core.rotation.set(t * .2, -t * .4, 0);
    ring.rotation.z = t * .3; ring2.rotation.z = -t * .2; stars.rotation.y = t * .02;
    group.rotation.y += (mx * .8 - group.rotation.y) * .05; group.rotation.x += (my * .6 - group.rotation.x) * .05;
    group.position.y = Math.sin(t) * .15;
    renderer.render(scene, cam);
  })();
})();
