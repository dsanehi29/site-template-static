const DEFAULT_LAYOUT = {
  hero_layout: "image_right",
  spacing: "normal",
  section_order: ["services", "testimonials", "faqs", "contact"],
};

const DEFAULT_COMPONENTS = {
  show_services: true,
  show_testimonials: true,
  show_faqs: true,
  show_contact: true,
};

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
  const layout = data && data.layout ? data.layout : {};
  const hero = document.getElementById("hero");

  if (hero) {
    const allowedHeroLayouts = new Set(["image_right", "image_left", "stacked"]);
    const heroMode = allowedHeroLayouts.has(layout.hero_layout) ? layout.hero_layout : DEFAULT_LAYOUT.hero_layout;

    hero.classList.remove("hero--image-right", "hero--image-left", "hero--stacked");

    if (heroMode === "image_left") hero.classList.add("hero--image-left");
    else if (heroMode === "stacked") hero.classList.add("hero--stacked");
    else hero.classList.add("hero--image-right");
  }

  const body = document.body;
  const allowedSpacing = new Set(["compact", "normal", "relaxed"]);
  const spacingMode = allowedSpacing.has(layout.spacing) ? layout.spacing : DEFAULT_LAYOUT.spacing;

  body.classList.remove("spacing--compact", "spacing--normal", "spacing--relaxed");
  body.classList.add(`spacing--${spacingMode}`);

  applySectionOrder(layout.section_order);
}

function applySectionOrder(sectionOrder) {
  const container = document.getElementById("sectionContainer");
  if (!container) return;

  const allowedSections = DEFAULT_LAYOUT.section_order;
  const provided = Array.isArray(sectionOrder) ? sectionOrder : [];

  const sanitizedOrder = provided.filter(
    (sectionName, index) =>
      typeof sectionName === "string" && allowedSections.includes(sectionName) && provided.indexOf(sectionName) === index,
  );

  const finalOrder = [...sanitizedOrder, ...allowedSections.filter((name) => !sanitizedOrder.includes(name))];

  finalOrder.forEach((sectionName) => {
    const sectionNode = container.querySelector(`[data-section="${sectionName}"]`);
    if (sectionNode) {
      container.appendChild(sectionNode);
    }
  });
}

function applySectionToggles(data) {
  const components = data && data.components ? data.components : {};
  const toggleConfig = {
    services: components.show_services,
    testimonials: components.show_testimonials,
    faqs: components.show_faqs,
    contact: components.show_contact,
  };

  const defaults = {
    services: DEFAULT_COMPONENTS.show_services,
    testimonials: DEFAULT_COMPONENTS.show_testimonials,
    faqs: DEFAULT_COMPONENTS.show_faqs,
    contact: DEFAULT_COMPONENTS.show_contact,
  };

  Object.entries(defaults).forEach(([sectionName, defaultValue]) => {
    const section = document.querySelector(`[data-section="${sectionName}"]`);
    if (!section) return;

    const configuredValue = toggleConfig[sectionName];
    const shouldShow = typeof configuredValue === "boolean" ? configuredValue : defaultValue;

    section.style.display = shouldShow ? "" : "none";
  });
}

async function loadSite() {
  const res = await fetch("site.json");
  const data = await res.json();

  applyTheme(data);
  applyLayout(data);
  applySectionToggles(data);

  document.getElementById("businessName").textContent = data.business_name || "";

  const logoEl = document.getElementById("logo");
  if (data.logo_url && data.logo_url.trim() !== "") {
    logoEl.src = data.logo_url;
    logoEl.style.display = "inline-block";
  } else {
    logoEl.style.display = "none";
  }

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

  const cta = document.getElementById("cta");
  cta.textContent = data.cta_text || "Contact";
  cta.href = data.cta_link || "#";

  const ctaTop = document.getElementById("ctaTop");
  ctaTop.textContent = data.cta_text || "Contact";
  ctaTop.href = data.cta_link || "#";

  document.getElementById("tplVer").textContent = data.template_version || "";

  const servicesEl = document.getElementById("services");
  servicesEl.innerHTML = "";
  (data.services || []).forEach((s) => {
    const card = document.createElement("div");
    card.innerHTML = `<h3>${s.title}</h3><p>${s.desc}</p>`;
    servicesEl.appendChild(card);
  });

  const testEl = document.getElementById("testimonials");
  testEl.innerHTML = "";
  (data.testimonials || []).forEach((t) => {
    const card = document.createElement("div");
    card.innerHTML = `<p>"${t.text}"</p><p><strong>${t.name}</strong></p>`;
    testEl.appendChild(card);
  });

  const faqEl = document.getElementById("faqs");
  faqEl.innerHTML = "";
  (data.faqs || []).forEach((f) => {
    const item = document.createElement("div");
    item.className = "faq-item";
    item.innerHTML = `<strong>${f.q}</strong><p>${f.a}</p>`;
    faqEl.appendChild(item);
  });

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
