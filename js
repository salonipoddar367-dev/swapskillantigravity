/**
 * SkillSwap - Core Application Logic
 * Manages marketplace feed, state persistence, match calculation, modals, and proposal workflows.
 */

// ============================================================================
// State Management & LocalStorage
// ============================================================================

const STORAGE_KEYS = {
  SWAPS: "skillswap_listings_v1",
  PROPOSALS: "skillswap_proposals_v1"
};

let swapsData = [];
let proposalsData = [];
let activeCategory = "all";
let currentSearchLearn = "";
let currentSearchTeach = "";
let currentSort = "rating";
let activeTargetSwap = null;

// Tag input arrays for "Post a Swap" modal
let newPostTeachTags = ["Frontend Development"];
let newPostLearnTags = ["Machine Learning Basics"];

// Initialize Data from Storage or Seed
function initData() {
  const savedSwaps = localStorage.getItem(STORAGE_KEYS.SWAPS);
  if (savedSwaps) {
    try {
      swapsData = JSON.parse(savedSwaps);
    } catch (e) {
      console.error("Error parsing saved swaps:", e);
      swapsData = [...INITIAL_SWAPS];
    }
  } else {
    swapsData = [...INITIAL_SWAPS];
    saveSwapsToStorage();
  }

  const savedProposals = localStorage.getItem(STORAGE_KEYS.PROPOSALS);
  if (savedProposals) {
    try {
      proposalsData = JSON.parse(savedProposals);
    } catch (e) {
      console.error("Error parsing saved proposals:", e);
      proposalsData = [...INITIAL_PROPOSALS];
    }
  } else {
    proposalsData = [...INITIAL_PROPOSALS];
    saveProposalsToStorage();
  }
}

function saveSwapsToStorage() {
  localStorage.setItem(STORAGE_KEYS.SWAPS, JSON.stringify(swapsData));
}

function saveProposalsToStorage() {
  localStorage.setItem(STORAGE_KEYS.PROPOSALS, JSON.stringify(proposalsData));
}

// ============================================================================
// UI Rendering Functions
// ============================================================================

// Render Category Tabs
function renderCategories() {
  const container = document.getElementById("categoryTabs");
  if (!container) return;

  container.innerHTML = DEFAULT_CATEGORIES.map(cat => `
    <button class="category-tab ${cat.id === activeCategory ? 'active' : ''}" data-category="${cat.id}">
      <span>${cat.name}</span>
    </button>
  `).join("");

  container.querySelectorAll(".category-tab").forEach(tab => {
    tab.addEventListener("click", () => {
      activeCategory = tab.dataset.category;
      renderCategories();
      renderSwapsGrid();
    });
  });
}

// Filter and Sort Swaps
function getFilteredSwaps() {
  return swapsData.filter(item => {
    // 1. Category Filter
    if (activeCategory !== "all" && item.category !== activeCategory) {
      return false;
    }

    // 2. Dual Search Logic:
    // If user wants to learn X, search for swappers who TEACH X.
    if (currentSearchLearn.trim()) {
      const query = currentSearchLearn.toLowerCase().trim();
      const teachesMatches = item.teaches.some(t => t.skill.toLowerCase().includes(query));
      const bioMatches = item.bio.toLowerCase().includes(query);
      if (!teachesMatches && !bioMatches) return false;
    }

    // If user can teach Y, search for swappers who WANT TO LEARN Y.
    if (currentSearchTeach.trim()) {
      const query = currentSearchTeach.toLowerCase().trim();
      const wantsMatches = item.wants.some(w => w.skill.toLowerCase().includes(query));
      if (!wantsMatches) return false;
    }

    return true;
  }).sort((a, b) => {
    if (currentSort === "rating") {
      return b.rating - a.rating;
    } else if (currentSort === "swaps") {
      return b.swapsCompleted - a.swapsCompleted;
    } else if (currentSort === "name") {
      return a.name.localeCompare(b.name);
    }
    return 0;
  });
}

// Render the Swaps Marketplace Grid
function renderSwapsGrid() {
  const grid = document.getElementById("swapsGrid");
  const countEl = document.getElementById("feedCountNum");
  if (!grid) return;

  const filtered = getFilteredSwaps();
  if (countEl) countEl.textContent = filtered.length;

  if (filtered.length === 0) {
    grid.innerHTML = `
      <div class="empty-state">
        <svg class="empty-state-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="11" cy="11" r="8"></circle>
          <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
        </svg>
        <h3 class="empty-state-title">No matching swappers found</h3>
        <p class="empty-state-desc">Try loosening your search terms or exploring all categories to discover new partners.</p>
        <button id="resetFiltersBtn" class="btn-secondary">Reset Search Filters</button>
      </div>
    `;

    document.getElementById("resetFiltersBtn")?.addEventListener("click", resetAllFilters);
    return;
  }

  grid.innerHTML = filtered.map(swap => `
    <article class="swap-card" id="card-${swap.id}">
      <div class="swap-card-header">
        <div class="user-profile-meta">
          <div class="user-avatar-wrapper">
            <img src="${swap.avatar}" alt="${swap.name}" class="user-avatar" loading="lazy" />
            <span class="user-status-online" title="Active member"></span>
          </div>
          <div class="user-name-role">
            <h3 class="user-name">${swap.name}</h3>
            <span class="user-title">${swap.title}</span>
          </div>
        </div>

        <div class="user-rating-pill" title="${swap.rating} out of 5 stars based on ${swap.swapsCompleted} swaps">
          <svg width="13" height="13" viewBox="0 0 24 24">
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
          </svg>
          <span>${swap.rating.toFixed(2)}</span>
          <span style="font-weight: 500; opacity: 0.7;">(${swap.swapsCompleted})</span>
        </div>
      </div>

      <p class="swap-card-bio">"${escapeHtml(swap.bio)}"</p>

      <div class="swap-exchange-box">
        <!-- Offering / Teaching -->
        <div class="exchange-row">
          <div class="exchange-header">
            <span class="exchange-tag-title teach">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                <circle cx="12" cy="12" r="10"></circle>
                <path d="m8 12 2 2 4-4"></path>
              </svg>
              Teaches
            </span>
          </div>
          <div class="skills-chip-list">
            ${swap.teaches.map(t => `
              <span class="skill-chip teach">
                ${escapeHtml(t.skill)}
                <span class="skill-level-badge">${escapeHtml(t.level)}</span>
              </span>
            `).join("")}
          </div>
        </div>

        <!-- Mutual Swap Indicator -->
        <div class="exchange-divider-strip">
          <span>reciprocal exchange</span>
        </div>

        <!-- Seeking / Learning -->
        <div class="exchange-row">
          <div class="exchange-header">
            <span class="exchange-tag-title learn">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="8" x2="12" y2="12"></line>
                <line x1="12" y1="16" x2="12.01" y2="16"></line>
              </svg>
              Wants to Learn
            </span>
          </div>
          <div class="skills-chip-list">
            ${swap.wants.map(w => `
              <span class="skill-chip learn">
                ${escapeHtml(w.skill)}
                <span class="skill-level-badge">${escapeHtml(w.level)}</span>
              </span>
            `).join("")}
          </div>
        </div>
      </div>

      <div class="swap-card-footer">
        <div class="card-location-meta">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="10"></circle>
            <polyline points="12 6 12 12 16 14"></polyline>
          </svg>
          <span>${escapeHtml(swap.availability || swap.location)}</span>
        </div>

        <button class="btn-propose-swap" data-swap-id="${swap.id}">
          <span>Propose Swap</span>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <path d="M5 12h14"></path>
            <path d="m12 5 7 7-7 7"></path>
          </svg>
        </button>
      </div>
    </article>
  `).join("");

  // Attach Propose button click listeners
  grid.querySelectorAll(".btn-propose-swap").forEach(btn => {
    btn.addEventListener("click", (e) => {
      const id = btn.dataset.swapId;
      openProposeModal(id);
    });
  });
}

// Render "My Swaps" in Slide-over Drawer
function renderDrawerProposals() {
  const container = document.getElementById("drawerProposalsList");
  const countEl = document.getElementById("drawerCountNum");
  const navBadgeEl = document.getElementById("navProposalBadge");

  if (!container) return;

  if (countEl) countEl.textContent = proposalsData.length;
  if (navBadgeEl) navBadgeEl.textContent = proposalsData.length;

  if (proposalsData.length === 0) {
    container.innerHTML = `
      <div style="text-align: center; padding: 2rem 1rem; color: var(--slate-500); font-size: 0.9rem;">
        No active swap proposals yet.<br />Explore swappers and propose your first exchange!
      </div>
    `;
    return;
  }

  container.innerHTML = proposalsData.map(prop => `
    <div class="proposal-item">
      <div class="proposal-item-header">
        <strong style="color: var(--slate-900); font-size: 0.95rem;">${escapeHtml(prop.partnerName)}</strong>
        <span class="proposal-status-badge">${escapeHtml(prop.status || 'Pending Review')}</span>
      </div>
      <div style="font-size: 0.85rem; color: var(--slate-600);">
        <div><strong>They teach:</strong> ${escapeHtml(prop.partnerTeaches)}</div>
        <div><strong>You teach:</strong> ${escapeHtml(prop.offeredSkill)}</div>
        <div><strong>Schedule:</strong> ${escapeHtml(prop.hoursPerWeek)}</div>
      </div>
      <p style="font-size: 0.8rem; color: var(--slate-500); font-style: italic; background: #fff; padding: 0.5rem; border-radius: 6px; border: 1px solid var(--border-color);">
        "${escapeHtml(prop.message)}"
      </p>
      <div class="proposal-actions">
        <button class="btn-cancel-prop" data-prop-id="${prop.id}">Cancel Proposal</button>
      </div>
    </div>
  `).join("");

  container.querySelectorAll(".btn-cancel-prop").forEach(btn => {
    btn.addEventListener("click", () => {
      const id = btn.dataset.propId;
      cancelProposal(id);
    });
  });
}

// ============================================================================
// Modal & Drawer Interactions
// ============================================================================

// Propose Modal
function openProposeModal(swapId) {
  const target = swapsData.find(s => s.id === swapId);
  if (!target) return;

  activeTargetSwap = target;
  const preview = document.getElementById("targetPartnerPreview");
  const modal = document.getElementById("proposeModal");

  if (preview) {
    preview.innerHTML = `
      <img src="${target.avatar}" alt="${target.name}" />
      <div>
        <h4 style="font-weight: 700; color: var(--slate-900);">${target.name}</h4>
        <div style="font-size: 0.82rem; color: var(--slate-500);">${target.title}</div>
        <div style="font-size: 0.82rem; color: var(--accent-teach-text); font-weight: 600; margin-top: 2px;">
          Teaches: ${target.teaches.map(t => t.skill).join(", ")}
        </div>
      </div>
    `;
  }

  // Pre-fill default suggested offer if available
  const offerInput = document.getElementById("proposeOfferedSkill");
  if (offerInput && target.wants && target.wants.length > 0) {
    offerInput.placeholder = `e.g. ${target.wants[0].skill}`;
  }

  if (modal) {
    modal.classList.add("active");
    document.body.style.overflow = "hidden";
  }
}

function closeProposeModal() {
  const modal = document.getElementById("proposeModal");
  if (modal) {
    modal.classList.remove("active");
    document.body.style.overflow = "";
    activeTargetSwap = null;
    document.getElementById("proposeForm")?.reset();
  }
}

// Post a Swap Modal
function openPostSwapModal() {
  const modal = document.getElementById("postSwapModal");
  if (modal) {
    modal.classList.add("active");
    document.body.style.overflow = "hidden";
    renderTags();
  }
}

function closePostSwapModal() {
  const modal = document.getElementById("postSwapModal");
  if (modal) {
    modal.classList.remove("active");
    document.body.style.overflow = "";
  }
}

// Drawer
function toggleDrawer(open) {
  const drawer = document.getElementById("mySwapsDrawer");
  if (!drawer) return;

  if (open) {
    drawer.classList.add("active");
    document.body.style.overflow = "hidden";
    renderDrawerProposals();
  } else {
    drawer.classList.remove("active");
    document.body.style.overflow = "";
  }
}

// Tag Management for Post Modal
function renderTags() {
  const teachBox = document.getElementById("teachTagBox");
  const learnBox = document.getElementById("learnTagBox");
  const teachInput = document.getElementById("teachTagInput");
  const learnInput = document.getElementById("learnTagInput");

  if (teachBox && teachInput) {
    // Retain only the input, re-add badges before it
    teachBox.querySelectorAll(".tag-badge").forEach(b => b.remove());
    newPostTeachTags.forEach((tag, idx) => {
      const badge = document.createElement("span");
      badge.className = "tag-badge teach";
      badge.innerHTML = `${escapeHtml(tag)} <button type="button" class="tag-remove-btn" data-type="teach" data-idx="${idx}">&times;</button>`;
      teachBox.insertBefore(badge, teachInput);
    });
  }

  if (learnBox && learnInput) {
    learnBox.querySelectorAll(".tag-badge").forEach(b => b.remove());
    newPostLearnTags.forEach((tag, idx) => {
      const badge = document.createElement("span");
      badge.className = "tag-badge learn";
      badge.innerHTML = `${escapeHtml(tag)} <button type="button" class="tag-remove-btn" data-type="learn" data-idx="${idx}">&times;</button>`;
      learnBox.insertBefore(badge, learnInput);
    });
  }

  // Remove tag handlers
  document.querySelectorAll(".tag-remove-btn").forEach(btn => {
    btn.onclick = () => {
      const type = btn.dataset.type;
      const idx = parseInt(btn.dataset.idx, 10);
      if (type === "teach") {
        newPostTeachTags.splice(idx, 1);
      } else {
        newPostLearnTags.splice(idx, 1);
      }
      renderTags();
    };
  });
}

function addTagFromInput(inputEl, type) {
  const val = inputEl.value.trim().replace(/,/g, "");
  if (!val) return;

  if (type === "teach") {
    if (!newPostTeachTags.includes(val)) newPostTeachTags.push(val);
  } else {
    if (!newPostLearnTags.includes(val)) newPostLearnTags.push(val);
  }

  inputEl.value = "";
  renderTags();
}

// Cancel Proposal
function cancelProposal(propId) {
  proposalsData = proposalsData.filter(p => p.id !== propId);
  saveProposalsToStorage();
  renderDrawerProposals();
  showToast("Proposal Removed", "The swap request has been cancelled.", "info");
}

// Reset Filters
function resetAllFilters() {
  activeCategory = "all";
  currentSearchLearn = "";
  currentSearchTeach = "";
  const heroLearn = document.getElementById("heroLearnInput");
  const heroTeach = document.getElementById("heroTeachInput");
  if (heroLearn) heroLearn.value = "";
  if (heroTeach) heroTeach.value = "";

  renderCategories();
  renderSwapsGrid();
}

// ============================================================================
// Toast Notification
// ============================================================================

function showToast(title, message, type = "success") {
  const container = document.getElementById("toastContainer");
  if (!container) return;

  const toast = document.createElement("div");
  toast.className = "toast";

  const iconSvg = type === "success" 
    ? `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M20 6L9 17l-5-5"></path></svg>`
    : `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>`;

  toast.innerHTML = `
    <div class="toast-icon">${iconSvg}</div>
    <div class="toast-body">
      <div class="toast-title">${escapeHtml(title)}</div>
      <div class="toast-msg">${escapeHtml(message)}</div>
    </div>
  `;

  container.appendChild(toast);

  setTimeout(() => {
    toast.classList.add("toast-out");
    setTimeout(() => toast.remove(), 250);
  }, 4000);
}

// ============================================================================
// Matchmaker Tool
// ============================================================================

function runMatchmaker() {
  const teachSelect = document.getElementById("matchmakerTeachSelect");
  const learnSelect = document.getElementById("matchmakerLearnSelect");

  const teachVal = teachSelect?.value;
  const learnVal = learnSelect?.value;

  if (!teachVal && !learnVal) {
    showToast("Select Skills", "Please pick at least one skill to calculate compatibility.", "warning");
    return;
  }

  // Find users who teach what you want OR want what you teach
  currentSearchLearn = learnVal || "";
  currentSearchTeach = teachVal || "";

  activeCategory = "all";
  renderCategories();
  renderSwapsGrid();

  const matchingResults = getFilteredSwaps();

  // Scroll to explore section
  document.getElementById("explore")?.scrollIntoView({ behavior: "smooth" });

  if (matchingResults.length > 0) {
    showToast(
      "Matches Found!",
      `Found ${matchingResults.length} perfect reciprocal swap match${matchingResults.length > 1 ? 'es' : ''} for your skillset!`,
      "success"
    );
  } else {
    showToast(
      "No Direct Matches",
      "No exact direct match found for this pair. Explore our general listings below or post your swap!",
      "warning"
    );
  }
}

// Utility: HTML Escaping
function escapeHtml(str) {
  if (!str) return "";
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

// ============================================================================
// Event Listeners & Bootstrapping
// ============================================================================

document.addEventListener("DOMContentLoaded", () => {
  initData();
  renderCategories();
  renderSwapsGrid();
  renderDrawerProposals();

  // Hero Search Event
  const searchBtn = document.getElementById("heroSearchBtn");
  const heroLearn = document.getElementById("heroLearnInput");
  const heroTeach = document.getElementById("heroTeachInput");

  const executeSearch = () => {
    currentSearchLearn = heroLearn ? heroLearn.value : "";
    currentSearchTeach = heroTeach ? heroTeach.value : "";
    renderSwapsGrid();
    document.getElementById("explore")?.scrollIntoView({ behavior: "smooth" });
  };

  searchBtn?.addEventListener("click", executeSearch);
  heroLearn?.addEventListener("keydown", (e) => { if (e.key === "Enter") executeSearch(); });
  heroTeach?.addEventListener("keydown", (e) => { if (e.key === "Enter") executeSearch(); });

  // Quick Trending Tags
  document.querySelectorAll(".quick-tag-chip").forEach(chip => {
    chip.addEventListener("click", () => {
      const skill = chip.dataset.skill;
      if (heroLearn) heroLearn.value = skill;
      currentSearchLearn = skill;
      renderSwapsGrid();
      document.getElementById("explore")?.scrollIntoView({ behavior: "smooth" });
      showToast("Filtered by Skill", `Showing swappers who teach ${skill}`, "success");
    });
  });

  // Sort change listener
  document.getElementById("feedSortSelect")?.addEventListener("change", (e) => {
    currentSort = e.target.value;
    renderSwapsGrid();
  });

  // Matchmaker Button
  document.getElementById("runMatchmakerBtn")?.addEventListener("click", runMatchmaker);

  // Drawer Toggles
  document.getElementById("openMySwapsBtn")?.addEventListener("click", () => toggleDrawer(true));
  document.getElementById("closeDrawerBtn")?.addEventListener("click", () => toggleDrawer(false));
  document.getElementById("mySwapsDrawer")?.addEventListener("click", (e) => {
    if (e.target.id === "mySwapsDrawer") toggleDrawer(false);
  });

  // Propose Modal Handlers
  document.getElementById("closeProposeModalBtn")?.addEventListener("click", closeProposeModal);
  document.getElementById("cancelProposeBtn")?.addEventListener("click", closeProposeModal);
  document.getElementById("proposeModal")?.addEventListener("click", (e) => {
    if (e.target.id === "proposeModal") closeProposeModal();
  });

  document.getElementById("proposeForm")?.addEventListener("submit", (e) => {
    e.preventDefault();
    if (!activeTargetSwap) return;

    const offeredSkill = document.getElementById("proposeOfferedSkill").value.trim();
    const hoursPerWeek = document.getElementById("proposeHours").value;
    const message = document.getElementById("proposeMessage").value.trim();

    const newProposal = {
      id: "prop-" + Date.now(),
      targetSwapId: activeTargetSwap.id,
      partnerName: activeTargetSwap.name,
      partnerTeaches: activeTargetSwap.teaches.map(t => t.skill).join(", "),
      offeredSkill,
      hoursPerWeek,
      message,
      status: "Pending Review",
      date: "Just now"
    };

    proposalsData.unshift(newProposal);
    saveProposalsToStorage();
    renderDrawerProposals();
    closeProposeModal();

    showToast(
      "Swap Proposal Sent!",
      `Your proposal to ${activeTargetSwap.name} has been submitted. Check "My Swaps" for updates.`
    );
  });

  // Post Swap Modal Handlers
  document.getElementById("openPostModalBtn")?.addEventListener("click", openPostSwapModal);
  document.getElementById("ctaPostBtn")?.addEventListener("click", openPostSwapModal);
  document.getElementById("closePostModalBtn")?.addEventListener("click", closePostSwapModal);
  document.getElementById("cancelPostBtn")?.addEventListener("click", closePostSwapModal);
  document.getElementById("postSwapModal")?.addEventListener("click", (e) => {
    if (e.target.id === "postSwapModal") closePostSwapModal();
  });

  // Tag inputs for Post Modal
  const teachInput = document.getElementById("teachTagInput");
  const learnInput = document.getElementById("learnTagInput");

  teachInput?.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addTagFromInput(teachInput, "teach");
    }
  });

  learnInput?.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addTagFromInput(learnInput, "learn");
    }
  });

  // Post Swap Form Submission
  document.getElementById("postSwapForm")?.addEventListener("submit", (e) => {
    e.preventDefault();

    if (newPostTeachTags.length === 0) {
      showToast("Missing Skill", "Please add at least one skill you can teach.", "warning");
      return;
    }
    if (newPostLearnTags.length === 0) {
      showToast("Missing Skill", "Please add at least one skill you want to learn.", "warning");
      return;
    }

    const name = document.getElementById("postName").value.trim();
    const title = document.getElementById("postTitle").value.trim();
    const category = document.getElementById("postCategory").value;
    const bio = document.getElementById("postBio").value.trim();
    const availability = document.getElementById("postAvailability").value.trim();

    const randomAvatars = [
      "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=150&auto=format&fit=crop&q=80"
    ];
    const avatar = randomAvatars[Math.floor(Math.random() * randomAvatars.length)];

    const newSwapListing = {
      id: "swap-" + Date.now(),
      name,
      title,
      avatar,
      category,
      rating: 5.0,
      swapsCompleted: 0,
      location: availability,
      bio,
      teaches: newPostTeachTags.map(t => ({ skill: t, level: "Competent" })),
      wants: newPostLearnTags.map(l => ({ skill: l, level: "Beginner" })),
      availability,
      featured: false
    };

    swapsData.unshift(newSwapListing);
    saveSwapsToStorage();
    renderSwapsGrid();
    closePostSwapModal();
    document.getElementById("postSwapForm").reset();

    showToast("Swap Published!", "Your swap profile is now visible to the entire community.");
    document.getElementById("explore")?.scrollIntoView({ behavior: "smooth" });
  });

  // FAQ Accordion
  document.querySelectorAll(".faq-question").forEach(btn => {
    btn.addEventListener("click", () => {
      const parent = btn.parentElement;
      const isOpen = parent.classList.contains("open");

      document.querySelectorAll(".faq-item").forEach(item => item.classList.remove("open"));
      if (!isOpen) {
        parent.classList.add("open");
      }
    });
  });

  // Global Keyboard Shortcuts (Escape to close modals)
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      closeProposeModal();
      closePostSwapModal();
      toggleDrawer(false);
    }
  });
});
