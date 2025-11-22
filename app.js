const STORAGE_KEY = 'bavaro-market-state';

const categories = [
  {
    id: 'electronics',
    name: 'Electronics & Gadgets',
    icon: '📱',
    description: 'Phones, consoles, laptops, smart home tech.',
  },
  {
    id: 'home',
    name: 'Home & Furniture',
    icon: '🛋️',
    description: 'Appliances, decor, handcrafted pieces.',
  },
  {
    id: 'services',
    name: 'Local Services',
    icon: '🧰',
    description: 'Cleaning, repairs, tutoring, wellness pros.',
  },
  {
    id: 'fashion',
    name: 'Fashion & Beauty',
    icon: '👗',
    description: 'Sneakers, vintage apparel, salon services.',
  },
  {
    id: 'experiences',
    name: 'Experiences',
    icon: '🎟️',
    description: 'Tours, classes, pop-up dinners, workshops.',
  },
  {
    id: 'auto',
    name: 'Auto & Transport',
    icon: '🚗',
    description: 'Car parts, detailing, drivers on-demand.',
  },
];

const defaultProfiles = [
  {
    id: crypto.randomUUID(),
    name: 'Lola García',
    headline: 'Handmade decor & staging',
    city: 'Bávaro',
    category: 'home',
    format: 'product',
    bio: 'Upcycled furniture artist bringing boho energy to every space.',
  },
  {
    id: crypto.randomUUID(),
    name: 'Miguel Santos',
    headline: 'Surf lessons & paddle tours',
    city: 'Macao Beach',
    category: 'experiences',
    format: 'service',
    bio: 'Certified local instructor with gear for all ages and levels.',
  },
  {
    id: crypto.randomUUID(),
    name: 'DripTech Repairs',
    headline: 'Same-day phone rescue',
    city: 'Santo Domingo',
    category: 'electronics',
    format: 'both',
    bio: 'Screen swaps, water damage recovery, and trade-ins with warranty.',
  },
];

const defaultListings = [
  {
    id: crypto.randomUUID(),
    title: 'Pixel 7 Pro (Unlocked)',
    description: 'Mint condition, includes two cases and original charger.',
    price: 540,
    category: 'electronics',
    type: 'product',
    seller: defaultProfiles[2].id,
    availability: 'Pickup in Naco · delivery available',
  },
  {
    id: crypto.randomUUID(),
    title: 'Sunrise Surf Coaching Pack',
    description: '3 private sessions with board rental and drone footage recap.',
    price: 220,
    category: 'experiences',
    type: 'service',
    seller: defaultProfiles[1].id,
    availability: 'Daily 6am-11am',
  },
  {
    id: crypto.randomUUID(),
    title: 'Custom Macramé Wall Hanging',
    description: 'Made-to-order statement pieces sized to your wall.',
    price: 180,
    category: 'home',
    type: 'product',
    seller: defaultProfiles[0].id,
    availability: 'Two-week turnaround',
  },
];

const state = {
  profiles: [],
  listings: [],
};

const dom = {
  categoryGrid: document.getElementById('categoryGrid'),
  categoryFilter: document.getElementById('categoryFilter'),
  listingCategory: document.getElementById('listingCategory'),
  profileCategory: document.getElementById('profileCategory'),
  listingGrid: document.getElementById('listingGrid'),
  resultsCount: document.getElementById('resultsCount'),
  sellerSelect: document.getElementById('sellerSelect'),
  profileList: document.getElementById('profileList'),
  profileStatus: document.getElementById('profileStatus'),
  listingStatus: document.getElementById('listingStatus'),
  searchInput: document.getElementById('searchInput'),
  typeFilter: document.getElementById('typeFilter'),
};

document.getElementById('year').textContent = new Date().getFullYear();

function loadState() {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) {
    try {
      const parsed = JSON.parse(stored);
      state.profiles = parsed.profiles ?? defaultProfiles;
      state.listings = parsed.listings ?? defaultListings;
      return;
    } catch (error) {
      console.warn('Unable to parse saved state', error);
    }
  }
  state.profiles = [...defaultProfiles];
  state.listings = [...defaultListings];
}

function persistState() {
  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify({ profiles: state.profiles, listings: state.listings })
  );
}

function renderCategoryOptions(selectEl, includeAll = false) {
  const options = includeAll
    ? [`<option value="all">All categories</option>`]
    : [];
  options.push(
    ...categories.map(
      (category) =>
        `<option value="${category.id}">${category.name}</option>`
    )
  );
  selectEl.innerHTML = options.join('');
}

function renderCategories() {
  dom.categoryGrid.innerHTML = categories
    .map((category) => {
      const totalListings = state.listings.filter(
        (listing) => listing.category === category.id
      ).length;
      const totalSellers = state.profiles.filter(
        (profile) => profile.category === category.id
      ).length;
      return `
        <article class="category-card">
          <div class="category-card__icon">${category.icon}</div>
          <h3>${category.name}</h3>
          <p>${category.description}</p>
          <p class="category-card__meta">
            <strong>${totalListings}</strong> live listings ·
            <strong>${totalSellers}</strong> sellers
          </p>
        </article>
      `;
    })
    .join('');
}

function renderProfiles() {
  dom.profileList.innerHTML = state.profiles
    .map(
      (profile) => `
        <li class="profile-card" data-id="${profile.id}">
          <div class="profile-card__meta">
            <strong>${profile.city}</strong>
            <span class="profile-card__tag">${profile.format}</span>
          </div>
          <h4>${profile.name}</h4>
          <p>${profile.headline}</p>
          <small>${profile.bio}</small>
        </li>
      `
    )
    .join('');
}

function renderSellerOptions() {
  dom.sellerSelect.innerHTML = state.profiles
    .map((profile) => `<option value="${profile.id}">${profile.name}</option>`)
    .join('');
}

function getFilteredListings() {
  const query = dom.searchInput.value.toLowerCase();
  const category = dom.categoryFilter.value;
  const type = dom.typeFilter.value;

  return state.listings.filter((listing) => {
    const matchesQuery = `${listing.title} ${listing.description}`
      .toLowerCase()
      .includes(query);
    const matchesCategory = category === 'all' || listing.category === category;
    const matchesType = type === 'all' || listing.type === type;
    return matchesQuery && matchesCategory && matchesType;
  });
}

function renderListings() {
  const listings = getFilteredListings();
  dom.resultsCount.textContent = `${listings.length} listing${
    listings.length === 1 ? '' : 's'
  } ready.`;

  if (!listings.length) {
    dom.listingGrid.innerHTML = '<p>No listings match your filters yet.</p>';
    return;
  }

  dom.listingGrid.innerHTML = listings
    .map((listing) => {
      const seller = state.profiles.find((profile) => profile.id === listing.seller);
      const categoryLabel = categories.find(
        (category) => category.id === listing.category
      )?.name;
      return `
        <article class="listing-card">
          <div class="listing-card__chip">${categoryLabel ?? 'General'}</div>
          <h4>${listing.title}</h4>
          <p>${listing.description}</p>
          <div class="listing-card__price">$${listing.price.toFixed(2)}</div>
          <div class="listing-card__footer">
            <span>${seller?.name ?? 'Community seller'}</span>
            <small>${listing.availability || 'Flexible availability'}</small>
          </div>
        </article>
      `;
    })
    .join('');
}

function attachProfileCardListeners() {
  dom.profileList.addEventListener('click', (event) => {
    const card = event.target.closest('.profile-card');
    if (!card) return;
    dom.sellerSelect.value = card.dataset.id;
    dom.listingStatus.textContent = `Seller prefilled with ${card.querySelector('h4').textContent}.`;
  });
}

function handleProfileSubmit(event) {
  event.preventDefault();
  const form = event.target;
  const formData = new FormData(form);
  const profile = {
    id: crypto.randomUUID(),
    name: formData.get('name'),
    headline: formData.get('headline'),
    city: formData.get('city'),
    category: formData.get('category'),
    format: formData.get('format'),
    bio: formData.get('bio'),
  };
  state.profiles.unshift(profile);
  persistState();
  renderProfiles();
  renderSellerOptions();
  renderCategories();
  dom.profileStatus.textContent = 'Profile saved! You can now post listings.';
  form.reset();
}

function handleListingSubmit(event) {
  event.preventDefault();
  const form = event.target;
  if (!state.profiles.length) {
    dom.listingStatus.textContent = 'Create a profile before posting.';
    return;
  }
  const formData = new FormData(form);
  const listing = {
    id: crypto.randomUUID(),
    title: formData.get('title'),
    description: formData.get('description'),
    price: Number(formData.get('price')),
    category: formData.get('category'),
    type: formData.get('type'),
    seller: formData.get('seller'),
    availability: formData.get('availability'),
  };
  state.listings.unshift(listing);
  persistState();
  renderListings();
  renderCategories();
  dom.listingStatus.textContent = 'Listing published!';
  form.reset();
}

function initFilters() {
  dom.searchInput.addEventListener('input', renderListings);
  dom.categoryFilter.addEventListener('change', renderListings);
  dom.typeFilter.addEventListener('change', renderListings);
}

function init() {
  loadState();
  renderCategoryOptions(dom.categoryFilter, true);
  renderCategoryOptions(dom.listingCategory);
  renderCategoryOptions(dom.profileCategory);
  renderCategories();
  renderProfiles();
  renderSellerOptions();
  renderListings();
  attachProfileCardListeners();
  initFilters();
  document.getElementById('profileForm').addEventListener('submit', handleProfileSubmit);
  document.getElementById('listingForm').addEventListener('submit', handleListingSubmit);
}

document.addEventListener('DOMContentLoaded', init);
