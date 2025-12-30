const MESSAGE =
"ბებერ გილოცავ ახალ წელს და დავაჯვი ამიკოს, მიყვარხარ ძაან და მინდა რომ ბედნიერი და გახარებული იყო სულ შენს საყვარელ ადამიანებთან ერთად ისე ტვინი რო გაგეხსნას და მითხრა მეც მიყვარხარო კაი იქნება";

document.querySelector("[data-enter]")?.addEventListener("click", () => {
  document.getElementById("album").scrollIntoView({ behavior: "smooth" });
});

document.querySelector("[data-copy]")?.addEventListener("click", async () => {
  try {
    await navigator.clipboard.writeText(MESSAGE);
  } catch {
    alert("კოპირება ვერ მოხერხდა. ხელით მონიშნე და დაკოპირე 🙂");
  }
});

/* ===== Snow animation (canvas) ===== */
const canvas = document.getElementById("snow");
const ctx = canvas.getContext("2d", { alpha: true });

let W = 0, H = 0, DPR = 1;
function resize() {
  DPR = Math.min(2, window.devicePixelRatio || 1);
  W = canvas.clientWidth;
  H = canvas.clientHeight;
  canvas.width = Math.floor(W * DPR);
  canvas.height = Math.floor(H * DPR);
  ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
}
window.addEventListener("resize", resize);
resize();

const flakes = [];
const rand = (min, max) => Math.random() * (max - min) + min;

function seedFlakes() {
  flakes.length = 0;
  const count = Math.round((W * H) / 14000);
  for (let i = 0; i < count; i++) {
    flakes.push({
      x: rand(0, W),
      y: rand(0, H),
      r: rand(0.8, 3.2),
      vx: rand(-0.5, 0.6),
      vy: rand(0.9, 2.2),
      wobble: rand(0, Math.PI * 2),
      wobbleSpeed: rand(0.008, 0.02),
      opacity: rand(0.35, 0.95),
    });
  }
}
seedFlakes();
window.addEventListener("resize", seedFlakes);

function tick() {
  ctx.clearRect(0, 0, W, H);

  for (const f of flakes) {
    f.wobble += f.wobbleSpeed;
    f.x += f.vx + Math.sin(f.wobble) * 0.35;
    f.y += f.vy;

    if (f.y - f.r > H) {
      f.y = -f.r;
      f.x = rand(0, W);
    }
    if (f.x < -10) f.x = W + 10;
    if (f.x > W + 10) f.x = -10;

    ctx.beginPath();
    ctx.globalAlpha = f.opacity;
    ctx.arc(f.x, f.y, f.r, 0, Math.PI * 2);
    ctx.fillStyle = "rgba(255,255,255,0.9)";
    ctx.fill();
  }
  ctx.globalAlpha = 1;
  requestAnimationFrame(tick);
}
tick();

/* ===== Lightbox ===== */
const tiles = Array.from(document.querySelectorAll(".tile[data-src]"));
const lb = document.getElementById("lightbox");
const lbImg = document.getElementById("lbImg");
const lbTitle = document.getElementById("lbTitle");
const btnClose = document.getElementById("lbClose");
const btnPrev = document.getElementById("lbPrev");
const btnNext = document.getElementById("lbNext");

let idx = 0;

function openLB(i) {
  idx = i;
  const t = tiles[idx];
  lbImg.src = t.dataset.src;
  lbTitle.textContent = t.dataset.title || `ფოტო ${idx + 1}`;
  lb.classList.add("open");
  document.body.style.overflow = "hidden";
}

function closeLB() {
  lb.classList.remove("open");
  document.body.style.overflow = "";
}

function prev() {
  openLB((idx - 1 + tiles.length) % tiles.length);
}
function next() {
  openLB((idx + 1) % tiles.length);
}

tiles.forEach((t, i) => {
  t.addEventListener("click", () => openLB(i));
  t.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") openLB(i);
  });
});

btnClose.addEventListener("click", closeLB);
lb.addEventListener("click", (e) => {
  if (e.target === lb) closeLB();
});

btnPrev.addEventListener("click", (e) => {
  e.stopPropagation();
  prev();
});
btnNext.addEventListener("click", (e) => {
  e.stopPropagation();
  next();
});

window.addEventListener("keydown", (e) => {
  if (!lb.classList.contains("open")) return;
  if (e.key === "Escape") closeLB();
  if (e.key === "ArrowLeft") prev();
  if (e.key === "ArrowRight") next();
});
