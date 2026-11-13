(() => {
  const boot = document.getElementById('boot');
  const art = document.getElementById('boot-art');
  const skip = document.getElementById('skip');
  const replay = document.getElementById('replay');
  const motion = matchMedia('(prefers-reduced-motion: reduce)');
  const mix = (a, b, t) => a + (b - a) * t;
  function ease(time, start, end) {
    const t = Math.min(1, Math.max(0, (time - start) / (end - start)));
    return t * t * (3 - 2 * t);
  }

  // Keep the actual portfolio in the CRT, including future edits to the page.
  const page = document.createElement('div');
  boot.after(page);
  while (page.nextElementSibling && page.nextElementSibling.tagName !== 'SCRIPT') {
    page.append(page.nextElementSibling);
  }

  let frame, timeout, previousFocus;
  let active = false;
  function seen() {
    try { return !!sessionStorage.getItem('reid_boot'); } catch { return false; }
  }
  function finish() {
    if (!active) return;
    active = false;
    cancelAnimationFrame(frame);
    clearTimeout(timeout);
    boot.hidden = true;
    page.inert = false;
    page.classList.remove('boot-page');
    page.style.transform = '';
    document.body.style.overflow = '';
    try { sessionStorage.setItem('reid_boot', 'seen'); } catch {}
    (previousFocus === document.body ? document.querySelector('header a') : previousFocus)?.focus({preventScroll:true});
  }

  function animate() {
    const svg = art.contentDocument;
    if (!active || !svg?.getElementById('camera')) return;
    clearTimeout(timeout);
    cancelAnimationFrame(frame);
    const part = id => svg.getElementById(id);
    const camera = part('camera'), disk = part('floppy'), sleeve = part('sleeve');
    const bios = [...part('bios').children], opening = part('opening');
    const power = part('power'), driveLed = part('drive-led');
    const start = performance.now();
    function draw(now) {
      const t = (now - start) / 1000;
      if (t >= 9.4) return finish();
      const w = boot.clientWidth, h = boot.clientHeight;
      const approach = ease(t, .85, 3.15), insert = ease(t, 3.25, 4.32);
      const pan = ease(t, 4.52, 6.24), zoom = ease(t, 8.12, 9.4);
      const tilt = mix(1, .21, approach);
      // y=340 is the slot lip. Clip there as the shutter edge travels inward.
      const x = mix(1040, 678, approach);
      const y = mix(70, 340, approach) - insert * 125 * tilt;
      sleeve.setAttribute('clip-path', t >= 3.15 ? 'url(#drive-mouth)' : 'none');
      disk.setAttribute('transform', `translate(${x} ${y}) rotate(${mix(-9, 0, approach)}) scale(1 ${tilt})`);
      driveLed.setAttribute('fill', t > 3.95 && t < 8 && Math.floor(t * 7) % 3 ? '#e6ba66' : '#646b53');
      power.setAttribute('fill', t > 5.85 ? '#9cf5a9' : '#586557');
      bios.forEach((line, i) => line.setAttribute('opacity', t >= [6,6,6.36,6.72,7.05,7.52][i] ? 1 : 0));

      const fit = (width, height) => Math.min(w / width, h / height);
      const pageScale = Math.min(318 / w, 226 / h);
      const showPage = ease(t, 7.88, 8.16);
      const pw = w * pageScale, ph = h * pageScale;
      const holeHeight = ph * showPage;
      opening.setAttribute('d', `M-10000 -10000h20000v20000h-20000Z M${304 - pw / 2} ${323.5 - holeHeight / 2}h${pw}v${holeHeight}h${-pw}Z`);
      const driveView = mix(fit(190, 185), fit(395, 335), approach);
      const monitorView = mix(driveView, fit(490, 391), pan);
      const scale = monitorView * Math.pow(1 / (pageScale * monitorView), zoom);
      const cx = mix(mix(1050, 678, approach), 304, pan);
      const cy = mix(mix(132, 339, approach), 323.5, pan);
      const tx = w / 2 - cx * scale, ty = h / 2 - cy * scale;
      camera.setAttribute('transform', `translate(${tx} ${ty}) scale(${scale})`);
      page.style.transform = `translate(${tx + (304 - pw / 2) * scale}px, ${ty + (323.5 - ph / 2) * scale}px) scale(${pageScale * scale})`;
      frame = requestAnimationFrame(draw);
    }
    draw(start);
  }

  function play() {
    if (active || motion.matches) return;
    active = true;
    previousFocus = document.activeElement;
    window.scrollTo({top:0, behavior:'instant'});
    document.body.style.overflow = 'hidden';
    page.inert = true;
    page.classList.add('boot-page');
    boot.hidden = false;
    skip.focus({preventScroll:true});
    timeout = setTimeout(finish, 2500);
    animate();
  }
  art.addEventListener('load', animate);
  art.addEventListener('error', finish);
  skip.addEventListener('click', finish);
  replay.addEventListener('click', play);
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape') finish();
  });
  motion.addEventListener('change', event => { if (event.matches) finish(); });
  if (!location.hash && !seen()) play();
})();
