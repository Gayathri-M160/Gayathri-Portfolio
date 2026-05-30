const roles = ["Java Developer", "Full Stack Developer", "Problem Solver"];
const typedText = document.getElementById("typedText");
const themeToggle = document.getElementById("themeToggle");
const mobileToggle = document.getElementById("mobileToggle");
const navLinks = document.getElementById("navLinks");
const loader = document.getElementById("loader");
const form = document.getElementById("contactForm");
const formStatus = document.getElementById("formStatus");

let roleIndex = 0;
let charIndex = 0;
let deleting = false;

function typeRole() {
  const currentRole = roles[roleIndex];
  typedText.textContent = currentRole.slice(0, charIndex);

  if (!deleting && charIndex < currentRole.length) {
    charIndex += 1;
    setTimeout(typeRole, 90);
    return;
  }

  if (!deleting && charIndex === currentRole.length) {
    deleting = true;
    setTimeout(typeRole, 1200);
    return;
  }

  if (deleting && charIndex > 0) {
    charIndex -= 1;
    setTimeout(typeRole, 45);
    return;
  }

  deleting = false;
  roleIndex = (roleIndex + 1) % roles.length;
  setTimeout(typeRole, 220);
}

function setTheme(mode) {
  document.documentElement.classList.toggle("dark", mode === "dark");
  localStorage.setItem("portfolio-theme", mode);
  themeToggle.innerHTML = mode === "dark" ? '<i data-lucide="moon"></i>' : '<i data-lucide="sun"></i>';
  lucide.createIcons();
}

function revealOnScroll() {
  const revealItems = document.querySelectorAll(".reveal");
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("active");

      // Animate progress bars only when their cards enter the viewport.
      if (entry.target.classList.contains("skill-card")) {
        const bar = entry.target.querySelector("b");
        bar.style.width = `${entry.target.dataset.skill}%`;
      }
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.16 });

  revealItems.forEach((item) => observer.observe(item));
}

function addCardTilt() {
  const cards = document.querySelectorAll(".project-card, .skill-card, .cert-card, .achievement-card, .profile-card");

  cards.forEach((card) => {
    card.classList.add("tilt-ready");

    card.addEventListener("mousemove", (event) => {
      const rect = card.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      const rotateY = ((x / rect.width) - 0.5) * 8;
      const rotateX = ((0.5 - y / rect.height)) * 8;
      card.style.setProperty("--tilt-x", `${rotateX}deg`);
      card.style.setProperty("--tilt-y", `${rotateY}deg`);
    });

    card.addEventListener("mouseleave", () => {
      card.style.removeProperty("--tilt-x");
      card.style.removeProperty("--tilt-y");
    });
  });
}

function highlightActiveNav() {
  const sections = document.querySelectorAll("main section[id]");
  const links = document.querySelectorAll(".nav-links a");
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      links.forEach((link) => {
        link.classList.toggle("active", link.getAttribute("href") === `#${entry.target.id}`);
      });
    });
  }, { rootMargin: "-35% 0px -55% 0px" });

  sections.forEach((section) => observer.observe(section));
}

function addCursorGlow() {
  if (window.matchMedia("(pointer: coarse)").matches) return;

  const glow = document.createElement("div");
  glow.className = "cursor-glow";
  document.body.appendChild(glow);

  window.addEventListener("mousemove", (event) => {
    glow.style.opacity = "1";
    glow.style.transform = `translate(${event.clientX - glow.offsetWidth / 2}px, ${event.clientY - glow.offsetHeight / 2}px)`;
  });

  document.addEventListener("mouseleave", () => {
    glow.style.opacity = "0";
  });
}

window.addEventListener("load", () => {
  setTimeout(() => loader.classList.add("hidden"), 450);
});

themeToggle.addEventListener("click", () => {
  const nextMode = document.documentElement.classList.contains("dark") ? "light" : "dark";
  setTheme(nextMode);
});

mobileToggle.addEventListener("click", () => {
  const isOpen = navLinks.classList.toggle("open");
  mobileToggle.setAttribute("aria-expanded", String(isOpen));
  mobileToggle.innerHTML = isOpen ? '<i data-lucide="x"></i>' : '<i data-lucide="menu"></i>';
  lucide.createIcons();
});

navLinks.addEventListener("click", (event) => {
  if (event.target.tagName !== "A") return;
  navLinks.classList.remove("open");
  mobileToggle.setAttribute("aria-expanded", "false");
  mobileToggle.innerHTML = '<i data-lucide="menu"></i>';
  lucide.createIcons();
});

form.addEventListener("submit", (event) => {
  event.preventDefault();
  const data = new FormData(form);
  const subject = encodeURIComponent(`Portfolio enquiry from ${data.get("name")}`);
  const body = encodeURIComponent(`${data.get("message")}\n\nReply to: ${data.get("email")}`);
  formStatus.textContent = "Opening your email app...";
  window.location.href = `mailto:gayathrim3075@gmail.com?subject=${subject}&body=${body}`;
  setTimeout(() => {
    formStatus.textContent = "Thank you. Your message is ready to send.";
    form.reset();
  }, 700);
});

document.getElementById("year").textContent = new Date().getFullYear();
setTheme(localStorage.getItem("portfolio-theme") || "light");
lucide.createIcons();
typeRole();
revealOnScroll();
addCardTilt();
highlightActiveNav();
addCursorGlow();
