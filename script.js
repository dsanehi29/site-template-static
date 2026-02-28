function applyTheme(site) {
  const theme = site.theme || {};
  const root = document.documentElement;

  if (theme.primary_color) root.style.setProperty("--primary", theme.primary_color);
  if (theme.background_color) root.style.setProperty("--bg", theme.background_color);
  if (theme.text_color) root.style.setProperty("--text", theme.text_color);

  if (theme.font_family) {
    if (theme.font_family === "system") {
      root.style.setProperty("--font", "system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif");
    } else {
      root.style.setProperty("--font", `${theme.font_family}, system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif`);
    }
  }
}

function applyLayout(data) {
  const hero = document.getElementById("hero");
  if (!hero) return;

  let heroLayout = "image_right";
  if (data && data.layout && data.layout.hero_layout) {
    heroLayout = data.layout.hero_layout;
  }

  // Allow-list to prevent typos breaking layout
  const allowed = new Set(["image_right", "image_left", "stacked"]);
  const mode = allowed.has(heroLayout) ? heroLayout : "image_right";

  // Remove any existing layout mode classes
  hero.classList.remove("hero--image-right", "hero--image-left", "hero--stacked");

  // Apply selected mode
  if (mode === "image_left") hero.classList.add("hero--image-left");
  else if (mode === "stacked") hero.classList.add("hero--stacked");
  else hero.classList.add("hero--image-right");
}

async function loadSite() {
  const res = await fetch("site.json");
  const data = await res.json(); 
  applyTheme(data);
  applyLayout(data);

  // Basic fields
  document.getElementById("businessName").textContent = data.business_name || "";
  // Logo
const logoEl = document.getElementById("logo");
if (data.logo_url && data.logo_url.trim() !== "") {
  logoEl.src = data.logo_url;
  logoEl.style.display = "inline-block";
} else {
  logoEl.style.display = "none";
}

// Hero image
const heroImgEl = document.getElementById("heroImage");
const heroMediaEl = document.querySelector(".hero-media");
if (data.hero_image_url && data.hero_image_url.trim() !== "") {
  heroImgEl.src = data.hero_image_url;
  heroMediaEl.style.display = "block";
} else {
  heroMediaEl.style.display = "none";
}
  document.getElementById("footerName").textContent = data.business_name || "";
  document.getElementById("pageTitle").textContent = data.business_name || "Website";

  document.getElementById("headline").textContent = data.headline || "";
  document.getElementById("subheadline").textContent = data.subheadline || "";

  // CTA buttons
  const cta = document.getElementById("cta");
  cta.textContent = data.cta_text || "Contact";
  cta.href = data.cta_link || "#";

  const ctaTop = document.getElementById("ctaTop");
  ctaTop.textContent = data.cta_text || "Contact";
  ctaTop.href = data.cta_link || "#";

  // Template version
  document.getElementById("tplVer").textContent = data.template_version || "";

  // Services
  const servicesEl = document.getElementById("services");
  servicesEl.innerHTML = "";
  (data.services || []).forEach((s) => {
    const card = document.createElement("div");
    card.innerHTML = `<h3>${s.title}</h3><p>${s.desc}</p>`;
    servicesEl.appendChild(card);
  });

  // Testimonials
  const testEl = document.getElementById("testimonials");
  testEl.innerHTML = "";
  (data.testimonials || []).forEach((t) => {
    const card = document.createElement("div");
    card.innerHTML = `<p>"${t.text}"</p><p><strong>${t.name}</strong></p>`;
    testEl.appendChild(card);
  });

  // FAQs
  const faqEl = document.getElementById("faqs");
  faqEl.innerHTML = "";
  (data.faqs || []).forEach((f) => {
    const item = document.createElement("div");
    item.className = "faq-item";
    item.innerHTML = `<strong>${f.q}</strong><p>${f.a}</p>`;
    faqEl.appendChild(item);
  });

  // Contact
  const phoneText = document.getElementById("phoneText");
  const phoneLink = document.getElementById("phoneLink");
  const contact = data && data.contact ? data.contact : {};
  const phone = contact.phone ? String(contact.phone) : "";
  phoneText.textContent = phone;
  phoneLink.href = phone ? `tel:${phone.replace(/\s+/g, "")}` : "#";

  const emailText = document.getElementById("emailText");
  const emailLink = document.getElementById("emailLink");
  const email = contact.email ? String(contact.email) : "";
  emailText.textContent = email;
  emailLink.href = email ? `mailto:${email}` : "#";
  
  document.getElementById("addressText").textContent = contact.address ? String(contact.address) : "";
}

document.addEventListener("DOMContentLoaded", loadSite);
