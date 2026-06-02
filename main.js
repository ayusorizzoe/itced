// ─── CLOCK ────────────────────────────────────────────────────────────────────

function updateTime() {
  const now = new Date();

  let h = now.getHours();
  let ampm = h >= 12 ? "PM" : "AM";
  let m = now.getMinutes();
  let s = now.getSeconds();

  h = h % 12;
  if (h === 0) h = 12;

  h = h < 10 ? "0" + h : "" + h;
  m = m < 10 ? "0" + m : "" + m;
  s = s < 10 ? "0" + s : "" + s;

  const days = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
  const months = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
  const dateStr = `${days[now.getDay()]} ${months[now.getMonth()]} ${now.getDate()}, ${now.getFullYear()}`;

  document.querySelectorAll(".hrs").forEach(el => (el.textContent = h));
  document.querySelectorAll(".min").forEach(el => (el.textContent = m));
  document.querySelectorAll(".sec").forEach(el => (el.textContent = s));
  document.querySelectorAll(".ampm").forEach(el => (el.textContent = ampm));
  document.querySelectorAll(".date").forEach(el => (el.textContent = dateStr));
}

setInterval(updateTime, 1000);
updateTime();


// ─── CURSOR ───────────────────────────────────────────────────────────────────

const cursor = document.querySelector(".cursor");

if (cursor) {
  document.addEventListener("mousemove", (e) => {
    cursor.style.left = `${e.clientX}px`;
    cursor.style.top = `${e.clientY}px`;
  });

  const hoverTargets = document.querySelectorAll(
    "a, button, .workButton, .projectGridImg, .archiveRow"
  );

  hoverTargets.forEach(el => {
    el.addEventListener("mouseenter", () => cursor.classList.add("is-hovering"));
    el.addEventListener("mouseleave", () => cursor.classList.remove("is-hovering"));
  });
}


// ─── BOUNCING IMAGE ───────────────────────────────────────────────────────────

const bouncingItem = document.querySelector(".bouncingImg");
let defaultImg = "";

const bounceState = { x: 20, y: 20, vx: 1.5, vy: 1.0 };

if (bouncingItem) {
  const bounceImgs = [
    "./images/huhBlue.png",
    "./images/huhGreen.png",
    "./images/huhYellow.png",
    "./images/huhPink.png",
    "./images/huhLBlue.png",
  ];

  bounceImgs.forEach((src) => {
    const img = new Image();
    img.src = src;
  });

  defaultImg = bouncingItem.src;

  function setRandomBounceImage() {
    const current = bouncingItem.getAttribute("src");
    const options = bounceImgs.filter((s) => s !== current);
    const next = options[Math.floor(Math.random() * options.length)];
    bouncingItem.src = next;
    defaultImg = next;
  }

  function bounceAnimation() {
    const w = bouncingItem.offsetWidth;
    const h = bouncingItem.offsetHeight;

    bounceState.x += bounceState.vx;
    bounceState.y += bounceState.vy;

    let bounced = false;

    if (bounceState.x <= 0 || bounceState.x >= window.innerWidth - w) {
      bounceState.vx *= -1;
      bounced = true;
    }
    if (bounceState.y <= 0 || bounceState.y >= window.innerHeight - h) {
      bounceState.vy *= -1;
      bounced = true;
    }

    bounceState.x = Math.min(Math.max(bounceState.x, 0), window.innerWidth - w);
    bounceState.y = Math.min(Math.max(bounceState.y, 0), window.innerHeight - h);

    if (bounced && !bouncingItem.classList.contains("is-hovering")) {
      setRandomBounceImage();
    }

    bouncingItem.style.transform = `translate(${bounceState.x}px, ${bounceState.y}px)`;
    requestAnimationFrame(bounceAnimation);
  }

  setTimeout(() => {
    bouncingItem.classList.add("active");
    bounceAnimation();
  }, 1000);
}


// ─── CAROUSEL ─────────────────────────────────────────────────────────────────

document.addEventListener("DOMContentLoaded", () => {
  const slides = document.querySelectorAll(".carousel .mySlide");
  const thumbs = document.querySelectorAll(".carousel .thumb");

  if (!slides.length || !thumbs.length) return;

  thumbs.forEach((thumb, i) => {
    thumb.addEventListener("click", () => {
      slides.forEach((s) => s.classList.remove("active"));
      thumbs.forEach((t) => t.classList.remove("active"));
      slides[i].classList.add("active");
      thumbs[i].classList.add("active");
    });
  });
});

// ─── IMAGE SLIDER ───────────────────────────────────────────────────────────────

(function initSlider() {
  const slider = document.querySelector('.imgSlider');
  const track = slider?.querySelector('.track');
  if (!slider || !track) return;

  const totalSlides = track.children.length;
  let currentX = 0;
  let targetX = 0;
  let autoSpeed = -0.5;
  let isDragging = false;
  let startX = 0;
  let dragStartX = 0;
  let isPaused = false;
  let pauseTimeout;
  let rafId;

  function getMaxScroll() {
    return -(track.scrollWidth - slider.offsetWidth);
  }

  function tick() {
    if (!isDragging && !isPaused) {
      targetX += autoSpeed;
      if (targetX <= getMaxScroll()) {
        targetX = 0;
      }
    }
    currentX += (targetX - currentX) * 0.08;
    track.style.transform = `translateX(${currentX}px)`;
    rafId = requestAnimationFrame(tick);
  }

  function pauseAuto(ms) {
    isPaused = true;
    clearTimeout(pauseTimeout);
    pauseTimeout = setTimeout(() => { isPaused = false; }, ms || 2000);
  }

  slider.addEventListener('mousedown', (e) => {
    isDragging = true;
    startX = e.pageX;
    dragStartX = targetX;
    clearTimeout(pauseTimeout);
    isPaused = true;
    slider.style.cursor = 'grabbing';
  });

  window.addEventListener('mousemove', (e) => {
    if (!isDragging) return;
    const delta = e.pageX - startX;
    targetX = dragStartX + delta;
    targetX = Math.min(0, Math.max(getMaxScroll(), targetX));
  });

  window.addEventListener('mouseup', () => {
    if (!isDragging) return;
    isDragging = false;
    slider.style.cursor = 'grab';
    pauseAuto(2000);
  });

  slider.addEventListener('mouseleave', () => {
    if (isDragging) {
      isDragging = false;
      slider.style.cursor = 'grab';
      pauseAuto(2000);
    }
  });

  tick();
})();

// ─── MISC ─────────────────────────────────────────────────────────────────────

function toggleSize(element) {
  element.classList.toggle("expanded");
}


// ─── MOBILE POPUP ─────────────────────────────────────────────────────────────

function detectAndShowPopup() {
  const popupOverlay = document.getElementById("popupOverlay");
  const closeButton = document.getElementById("closeButton");

  if (!popupOverlay || !closeButton) return;

  if (window.matchMedia("(max-width: 768px)").matches) {
    popupOverlay.style.display = "flex";
  }

  closeButton.addEventListener("click", () => {
    popupOverlay.style.display = "none";
  });

  popupOverlay.addEventListener("click", (event) => {
    if (event.target === popupOverlay) {
      popupOverlay.style.display = "none";
    }
  });
}

window.addEventListener("load", detectAndShowPopup);

// ─── THREE.JS SPATIAL NAVIGATION ──────────────────────────────────────────────

(function initSpatialNav() {
  if (typeof THREE === "undefined") return;

  const projects = [
    { href: "01.html", img: "./images/sanctTN.png", label: "1", hover: "Sanct" },
    { href: "02.html", img: "./images/whatNowTN.png", label: "2", hover: "What Now?" },
    { href: "03.html", img: "./images/ossuaryTN.png", label: "3", hover: "Ossuary" },
    { href: "04.html", img: "./images/relicTN.png", label: "4", hover: "Without Kingdom" },
    { href: "05.html", img: "./images/runaTN.png", label: "5", hover: "Runa" },
    { href: "06.html", img: "./images/blueDogTN.png", label: "6", hover: "Eyes of a Blue Dog" },
    { href: "07.html", img: "./images/hangoutTN.png", label: "7", hover: "Hangout" },
    { href: "08.html", img: "./images/marsTN.png", label: "8", hover: "MARS" },
  ];

  // ── Canvas setup ──────────────────────────────────────────────────────────

  const canvas = document.getElementById("threeCanvas");
  if (!canvas) return;

  Object.assign(canvas.style, {
    position: "fixed",
    top: "0",
    left: "0",
    width: "100vw",
    height: "100vh",
    zIndex: "0",
    display: "block",
  });

  const W = () => window.innerWidth;
  const H = () => window.innerHeight;

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
  renderer.setClearColor(0xffffff, 1);
  renderer.setSize(W(), H());

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(50, W() / H(), 0.1, 200);
  camera.position.set(0, 0, 18);

  const getNavMaxY = () => {
    const vH = 2 * Math.tan((50 * Math.PI / 180) * 0.5) * 18;
    const navHeight = document.querySelector('.glassPanel')?.offsetHeight || 80;
    const navWorldUnits = (navHeight / H()) * vH;
    return (vH * 0.5) - navWorldUnits - 0.8;
  };

  window.addEventListener("resize", () => {
    renderer.setSize(W(), H());
    camera.aspect = W() / H();
    camera.updateProjectionMatrix();

    const newPositions = randomPositions(projects.length)
      .sort((a, b) => {
        const rowA = Math.round(a.y * 2);
        const rowB = Math.round(b.y * 2);
        if (rowA !== rowB) return rowB - rowA;
        return a.x - b.x;
      });

    meshes.forEach((mesh, i) => {
      const sp = newPositions[i];
      mesh.position.copy(sp);
      mesh.userData.origPos = sp.clone();
      repulseOffset[i].set(0, 0, 0);
    });
  });

  // ── Random non-overlapping scatter positions ───────────────────────────────

  function randomPositions(count) {
    const positions = [];
    const minDist = 2.2;
    const maxTries = 300;

    const aspect = W() / H();
    const vHeight = 2 * Math.tan((50 * Math.PI / 180) * 0.5) * 18;
    const vWidth = vHeight * aspect;

    const xRange = [-(vWidth * 0.42), vWidth * 0.42];
    const navHeight = document.querySelector('.glassPanel')?.offsetHeight || 80;
    const navWorldUnits = (navHeight / H()) * vHeight;
    const yRange = [-(vHeight * 0.44), (vHeight * 0.5) - navWorldUnits - 0.8];

    for (let i = 0; i < count; i++) {
      let pos, attempts = 0;
      do {
        pos = new THREE.Vector3(
          xRange[0] + Math.random() * (xRange[1] - xRange[0]),
          yRange[0] + Math.random() * (yRange[1] - yRange[0]),
          (Math.random() - 0.5) * 1.2
        );
        attempts++;
      } while (
        attempts < maxTries &&
        positions.some(p => p.distanceTo(pos) < minDist)
      );
      positions.push(pos);
    }
    return positions;
  }

  const spawnPositions = randomPositions(projects.length)
    .sort((a, b) => {
      const rowA = Math.round(a.y * 2);
      const rowB = Math.round(b.y * 2);
      if (rowA !== rowB) return rowB - rowA;
      return a.x - b.x;
    });

  // ── Per-mesh drift params ─────────────────────────────────────────────────

  const driftParams = projects.map(() => ({
    ax: 0.10 + Math.random() * 0.12,
    ay: 0.08 + Math.random() * 0.10,
    az: 0.05 + Math.random() * 0.07,
    fx: 0.38 + Math.random() * 0.48,
    fy: 0.28 + Math.random() * 0.38,
    fz: 0.16 + Math.random() * 0.22,
    px: Math.random() * Math.PI * 2,
    py: Math.random() * Math.PI * 2,
    pz: Math.random() * Math.PI * 2,
    rrx: (Math.random() - 0.5) * 0.045,
    rry: (Math.random() - 0.5) * 0.045,
    rpx: Math.random() * Math.PI * 2,
    rpy: Math.random() * Math.PI * 2,
  }));

  // ── Per-mesh repulsion offset (world units, lerped each frame) ───────────

  const repulseOffset = projects.map(() => new THREE.Vector3());

  // ── Textures — number (default) and name (hover) ─────────────────────────

  function makeTexture(text, isName) {
    const cvs = document.createElement("canvas");
    cvs.width = isName ? 768 : 96;
    cvs.height = 96;
    const ctx = cvs.getContext("2d");
    ctx.clearRect(0, 0, cvs.width, cvs.height);
    ctx.fillStyle = "rgba(17,17,17,0.80)";
    ctx.font = '200 70px "IBM Plex Mono", monospace';
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(text, cvs.width / 2, cvs.height / 2);
    return cvs;
  }

  // ── Meshes ────────────────────────────────────────────────────────────────

  const cardGroup = new THREE.Group();
  scene.add(cardGroup);

  const meshes = [];
  const raycaster = new THREE.Raycaster();
  const mouse = new THREE.Vector2(9999, 9999);
  let hoveredMesh = null;

  const HIT_SIZE = 1.4;
  const NUM_SIZE = 0.50;
  const NAME_WIDTH = 4.2;
  const NAME_HEIGHT = 0.55;

  projects.forEach((proj, i) => {
    const numTex = new THREE.CanvasTexture(makeTexture(proj.label, false));
    const nameTex = new THREE.CanvasTexture(makeTexture(proj.hover, true));
    numTex.minFilter = THREE.LinearFilter;
    nameTex.minFilter = THREE.LinearFilter;

    const hitGeo = new THREE.PlaneGeometry(HIT_SIZE, HIT_SIZE);
    const hitMat = new THREE.MeshBasicMaterial({ transparent: true, opacity: 0, depthWrite: false });
    const hitMesh = new THREE.Mesh(hitGeo, hitMat);

    const glyphGeo = new THREE.PlaneGeometry(NUM_SIZE, NUM_SIZE);
    const glyphMat = new THREE.MeshBasicMaterial({ map: numTex, transparent: true, depthWrite: false });
    const glyphMesh = new THREE.Mesh(glyphGeo, glyphMat);
    hitMesh.add(glyphMesh);

    const sp = spawnPositions[i];
    hitMesh.position.copy(sp);
    hitMesh.userData = {
      project: proj,
      origPos: sp.clone(),
      idx: i,
      isHovered: false,
      glyphMesh,
      numTex,
      nameTex,
      NUM_SIZE,
      NAME_WIDTH,
      NAME_HEIGHT,
    };

    cardGroup.add(hitMesh);
    meshes.push(hitMesh);
  });

  // ── Mouse / touch tracking ────────────────────────────────────────────────

  let rawMx = 0, rawMy = 0;
  let smMx = 0, smMy = 0;
  let camX = 0, camY = 0;

  window.addEventListener("mousemove", (e) => {
    rawMx = (e.clientX / W()) * 2 - 1;
    rawMy = -((e.clientY / H()) * 2 - 1);
    mouse.set(rawMx, rawMy);
    if (cursor) {
      cursor.style.left = `${e.clientX}px`;
      cursor.style.top = `${e.clientY}px`;
    }
  });

  canvas.addEventListener("touchend", (e) => {
    const touch = e.changedTouches[0];
    const tx = (touch.clientX / W()) * 2 - 1;
    const ty = -((touch.clientY / H()) * 2 - 1);
    mouse.set(tx, ty);
    raycaster.setFromCamera(mouse, camera);
    const hits = raycaster.intersectObjects(meshes);
    if (hits.length) {
      window.location.href = hits[0].object.userData.project.href;
    }
    mouse.set(9999, 9999);
  });

  canvas.addEventListener("click", () => {
    if (hoveredMesh) window.location.href = hoveredMesh.userData.project.href;
  });

  // ── Hover ↔ bouncing image + label swap ───────────────────────────────────

  function onProjectHoverEnter(mesh) {
    const { project, glyphMesh, nameTex, NAME_WIDTH, NAME_HEIGHT } = mesh.userData;

    glyphMesh.material.map = nameTex;
    glyphMesh.material.needsUpdate = true;
    glyphMesh.geometry.dispose();
    glyphMesh.geometry = new THREE.PlaneGeometry(NAME_WIDTH, NAME_HEIGHT);

    if (bouncingItem) {
      bouncingItem.src = project.img;
      bouncingItem.classList.add("is-hovering");
    }
    if (cursor) cursor.classList.add("is-hovering");
  }

  function onProjectHoverLeave(mesh) {
    const { numTex, glyphMesh, NUM_SIZE } = mesh.userData;

    glyphMesh.material.map = numTex;
    glyphMesh.material.needsUpdate = true;
    glyphMesh.geometry.dispose();
    glyphMesh.geometry = new THREE.PlaneGeometry(NUM_SIZE, NUM_SIZE);

    if (bouncingItem) {
      bouncingItem.classList.remove("is-hovering");
      bouncingItem.src = defaultImg;
    }
    if (cursor) cursor.classList.remove("is-hovering");
  }

  // ── Project world pos → screen px (for repulsion calc) ───────────────────

  const _sv = new THREE.Vector3();

  function worldToScreen(mesh) {
    _sv.setFromMatrixPosition(mesh.matrixWorld);
    _sv.project(camera);
    return {
      x: (_sv.x * 0.5 + 0.5) * W(),
      y: (_sv.y * -0.5 + 0.5) * H(),
    };
  }

  const pxToWorld = () => (2 * Math.tan((50 * Math.PI / 180) * 0.5) * 18) / H();

  // ── Repulsion config ──────────────────────────────────────────────────────

  const REPULSE_RADIUS = 130;
  const REPULSE_STRENGTH = 4.0;
  const REPULSE_SMOOTH = 0.07;

  // ── Scales ───────────────────────────────────────────────────────────────

  const normScale = new THREE.Vector3(1, 1, 1);
  const hoverScale = new THREE.Vector3(1.0, 1.0, 1.0);

  // ── Render loop ───────────────────────────────────────────────────────────

  let t = 0;

  function animate() {
    requestAnimationFrame(animate);
    t += 0.016;

    smMx += (rawMx - smMx) * 0.07;
    smMy += (rawMy - smMy) * 0.07;
    camX += (smMx * 0.55 - camX) * 0.04;
    camY += (smMy * 0.35 - camY) * 0.04;
    camera.position.x = camX;
    camera.position.y = camY;
    camera.lookAt(0, 0, 0);

    const bW = bouncingItem ? bouncingItem.offsetWidth : 0;
    const bH = bouncingItem ? bouncingItem.offsetHeight : 0;
    const bCx = bounceState.x + bW * 0.5;
    const bCy = bounceState.y + bH * 0.5;
    const ptw = pxToWorld();
    const maxY = getNavMaxY();

    meshes.forEach((mesh, i) => {
      const d = driftParams[i];
      const op = mesh.userData.origPos;

      const driftX = op.x + Math.sin(t * d.fx + d.px) * d.ax;
      const driftY = op.y + Math.cos(t * d.fy + d.py) * d.ay;
      const driftZ = op.z + Math.sin(t * d.fz + d.pz) * d.az;

      const sc = worldToScreen(mesh);
      const dx = sc.x - bCx;
      const dy = sc.y - bCy;
      const dist = Math.sqrt(dx * dx + dy * dy);

      let targetRX = 0, targetRY = 0;

      if (dist < REPULSE_RADIUS && dist > 0.5) {
        const force = (1 - dist / REPULSE_RADIUS) * REPULSE_STRENGTH;
        targetRX = (dx / dist) * force * ptw * 55;
        targetRY = -(dy / dist) * force * ptw * 55;
      }

      repulseOffset[i].x += (targetRX - repulseOffset[i].x) * REPULSE_SMOOTH;
      repulseOffset[i].y += (targetRY - repulseOffset[i].y) * REPULSE_SMOOTH;

      mesh.position.x = driftX + repulseOffset[i].x;
      mesh.position.y = Math.min(driftY + repulseOffset[i].y, maxY);
      mesh.position.z = driftZ;

      mesh.rotation.y = smMx * 0.08 + Math.sin(t * d.fx * 0.6 + d.rpx) * d.rrx;
      mesh.rotation.x = -smMy * 0.06 + Math.cos(t * d.fy * 0.6 + d.rpy) * d.rry;
    });

    raycaster.setFromCamera(mouse, camera);
    const hits = raycaster.intersectObjects(meshes);

    if (hits.length) {
      const hit = hits[0].object;
      if (hoveredMesh !== hit) {
        if (hoveredMesh) {
          hoveredMesh.userData.isHovered = false;
          onProjectHoverLeave(hoveredMesh);
        }
        hoveredMesh = hit;
        hoveredMesh.userData.isHovered = true;
        onProjectHoverEnter(hit);
      }
    } else {
      if (hoveredMesh) {
        hoveredMesh.userData.isHovered = false;
        onProjectHoverLeave(hoveredMesh);
        hoveredMesh = null;
      }
    }

    meshes.forEach(mesh => {
      const target = mesh.userData.isHovered ? hoverScale : normScale;
      mesh.scale.lerp(target, 0.1);
    });

    renderer.render(scene, camera);
  }

  animate();
})();

// ─── CAROUSEL ────────────────────────────────────────────────────────────────

if (window.location.hash && document.querySelector(window.location.hash)) {
  history.replaceState(null, '', window.location.pathname);
}

function syncActiveThumb() {
  document.querySelectorAll('.carousel').forEach(carousel => {
    const thumbs = carousel.querySelectorAll('.thumb');
    const hash = window.location.hash;
    thumbs.forEach((thumb, i) => {
      const isActive = hash ? thumb.getAttribute('href') === hash : i === 0;
      thumb.classList.toggle('active', isActive);
    });
  });
}

function syncImageFit() {
  document.querySelectorAll('.carousel').forEach(carousel => {
    const imgs = carousel.querySelectorAll('.carousel-slide img');
    const ratios = Array.from(imgs).map(img => img.naturalWidth / img.naturalHeight);
    const avg = ratios.reduce((a, b) => a + b, 0) / ratios.length;
    imgs.forEach((img, i) => {
      const deviation = Math.abs(ratios[i] - avg) / avg;
      if (deviation > 0.3) {
        img.style.objectFit = 'contain';
        img.style.objectPosition = 'center';
        img.style.background = '#f9f9f9';
      } else {
        img.style.objectFit = 'cover';
        img.style.objectPosition = 'center';
        img.style.background = '';
      }
    });
  });
}

window.addEventListener('load', () => {
  syncActiveThumb();
  syncImageFit();
});
window.addEventListener('hashchange', syncActiveThumb);
