// Global Application Logic for Motorcycles Platform
document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initCart();
  initModals();
  initParallaxAndTilt();
  initScrollToTop();
  initVehicleSaleOrder();
  initFaqAccordion();
});

// Navigation & Header Scroll State
function initNavbar() {
  const header = document.querySelector('.site-header');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      header?.classList.add('scrolled');
    } else {
      header?.classList.remove('scrolled');
    }
  });

  const mobileToggle = document.getElementById('mobileMenuToggle');
  const mobileDrawer = document.getElementById('mobileDrawer');
  const drawerOverlay = document.getElementById('drawerOverlay');
  const closeDrawer = document.getElementById('closeMobileDrawer');

  function openMenu() {
    mobileDrawer?.classList.add('open');
    drawerOverlay?.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeMenu() {
    mobileDrawer?.classList.remove('open');
    drawerOverlay?.classList.remove('active');
    document.body.style.overflow = '';
  }

  mobileToggle?.addEventListener('click', openMenu);
  closeDrawer?.addEventListener('click', closeMenu);
  drawerOverlay?.addEventListener('click', () => {
    closeMenu();
    closeCart();
  });
}

// Shopping Cart Management
let CART = JSON.parse(localStorage.getItem('MOTORCYCLES_CART') || '[]');

function saveCart() {
  localStorage.setItem('MOTORCYCLES_CART', JSON.stringify(CART));
  updateCartUI();
}

function updateCartUI() {
  const badge = document.getElementById('cartBadge');
  const mobileBadge = document.getElementById('cartBadgeMobile');
  const totalCount = CART.reduce((sum, item) => sum + item.quantity, 0);

  if (badge) badge.textContent = totalCount;
  if (mobileBadge) mobileBadge.textContent = totalCount;
  document.querySelectorAll('.cart-badge-mobile, #cartBadgeMobile').forEach(el => {
    el.textContent = totalCount;
  });

  const container = document.getElementById('cartItemsList');
  const emptyState = document.getElementById('cartEmptyState');
  const subtotalEl = document.getElementById('cartSubtotalAmount');
  const totalEl = document.getElementById('cartTotalAmount');

  if (!container) return;

  if (CART.length === 0) {
    if (emptyState) emptyState.style.display = 'block';
    container.innerHTML = '';
    if (subtotalEl) subtotalEl.textContent = '₹0';
    if (totalEl) totalEl.textContent = '₹0';
    return;
  }

  if (emptyState) emptyState.style.display = 'none';

  let subtotal = 0;
  container.innerHTML = CART.map(item => {
    const itemTotal = item.price * item.quantity;
    subtotal += itemTotal;
    return `
      <div class="cart-item" style="display: flex; gap: 14px; padding: 12px; background: var(--dark-surface); border-radius: var(--radius-sm); border: 1px solid var(--surface-border); align-items: center;">
        <img src="${item.image}" alt="${item.name}" style="width: 64px; height: 64px; object-fit: cover; border-radius: 4px; border: 1px solid var(--surface-border);">
        <div style="flex: 1; min-width: 0;">
          <h4 style="font-size: 0.92rem; font-weight: 600; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${item.name}</h4>
          <div style="color: var(--accent-red); font-size: 0.88rem; font-weight: 700;">₹${item.price.toLocaleString('en-IN')}</div>
          <div style="display: flex; align-items: center; gap: 8px; margin-top: 6px;">
            <button onclick="changeCartQty(${item.id}, -1)" style="width: 24px; height: 24px; border-radius: 4px; background: var(--charcoal-black); border: 1px solid var(--surface-border); color: #fff; cursor: pointer;">-</button>
            <span style="font-size: 0.85rem; font-weight: 600;">${item.quantity}</span>
            <button onclick="changeCartQty(${item.id}, 1)" style="width: 24px; height: 24px; border-radius: 4px; background: var(--charcoal-black); border: 1px solid var(--surface-border); color: #fff; cursor: pointer;">+</button>
          </div>
        </div>
        <button onclick="removeFromCart(${item.id})" style="background: transparent; border: none; color: var(--metallic-grey); cursor: pointer; padding: 4px;" title="Remove">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
        </button>
      </div>
    `;
  }).join('');

  if (subtotalEl) subtotalEl.textContent = `₹${subtotal.toLocaleString('en-IN')}`;
  if (totalEl) totalEl.textContent = `₹${subtotal.toLocaleString('en-IN')}`;
}

function addToCart(item) {
  const existing = CART.find(x => x.id === item.id);
  if (existing) {
    existing.quantity += (item.quantity || 1);
  } else {
    CART.push({
      id: item.id,
      name: item.name,
      price: item.price,
      image: item.image,
      quantity: item.quantity || 1
    });
  }
  saveCart();
  openCart();
}

function changeCartQty(id, delta) {
  const item = CART.find(x => x.id === id);
  if (item) {
    item.quantity += delta;
    if (item.quantity <= 0) {
      CART = CART.filter(x => x.id !== id);
    }
    saveCart();
  }
}

function removeFromCart(id) {
  CART = CART.filter(x => x.id !== id);
  saveCart();
}

function openCart() {
  const cartDrawer = document.getElementById('cartDrawer');
  const drawerOverlay = document.getElementById('drawerOverlay');
  cartDrawer?.classList.add('open');
  drawerOverlay?.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeCart() {
  const cartDrawer = document.getElementById('cartDrawer');
  const drawerOverlay = document.getElementById('drawerOverlay');
  cartDrawer?.classList.remove('open');
  drawerOverlay?.classList.remove('active');
  document.body.style.overflow = '';
}

function initCart() {
  const cartToggle = document.getElementById('cartToggle');
  const closeCartBtn = document.getElementById('closeCartDrawer');
  cartToggle?.addEventListener('click', openCart);
  closeCartBtn?.addEventListener('click', closeCart);
  updateCartUI();
}

// Modal handling
function initModals() {
  document.querySelectorAll('[data-close-modal]').forEach(btn => {
    btn.addEventListener('click', () => {
      const modal = btn.closest('.app-modal');
      modal?.classList.remove('active');
      document.body.style.overflow = '';
    });
  });

  // Close modals on backdrop click
  document.querySelectorAll('.app-modal').forEach(modal => {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
      }
    });
  });

  // Close modals on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      document.querySelectorAll('.app-modal.active').forEach(m => {
        m.classList.remove('active');
        document.body.style.overflow = '';
      });
    }
  });
}

function openModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }
}

function closeModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.classList.remove('active');
    document.body.style.overflow = '';
  }
}

// 3D Perspective Tilt on Hover for Cards
function initParallaxAndTilt() {
  if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
    const tiltCards = document.querySelectorAll('[data-tilt]');
    tiltCards.forEach(card => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const rotateX = ((y - centerY) / centerY) * -7;
        const rotateY = ((x - centerX) / centerX) * 7;
        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
      });
      card.addEventListener('mouseleave', () => {
        card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0)';
      });
    });
  }
}

// Global Order Modal Launcher for Motorcycles
function openMotorcycleOrderModal(bikeId) {
  const bike = MOTORCYCLES_DATA.find(b => b.id === bikeId);
  if (!bike) return;

  const modal = document.getElementById('motorcycleOrderModal');
  if (!modal) return;

  document.getElementById('orderBikeName').value = `${bike.name} (${bike.year})`;
  document.getElementById('orderBikePrice').value = `₹${bike.price.toLocaleString('en-IN')}`;
  document.getElementById('orderBikePreviewName').textContent = bike.name;
  document.getElementById('orderBikePreviewPrice').textContent = `₹${bike.price.toLocaleString('en-IN')}`;
  document.getElementById('orderBikePreviewImg').src = bike.file.startsWith('images/') ? bike.file : `images/${bike.file}`;
  
  openModal('motorcycleOrderModal');
}

// Global Order Modal for Gear & Accessories
function openAccessoryOrderModal(accId) {
  const acc = ACCESSORIES_DATA.find(a => a.id === accId);
  if (!acc) return;

  const modal = document.getElementById('accessoryOrderModal');
  if (!modal) return;

  document.getElementById('orderAccName').value = acc.name;
  document.getElementById('orderAccPrice').value = `₹${acc.price.toLocaleString('en-IN')}`;
  document.getElementById('orderAccPreviewName').textContent = acc.name;
  document.getElementById('orderAccPreviewPrice').textContent = `₹${acc.price.toLocaleString('en-IN')}`;
  document.getElementById('orderAccPreviewImg').src = acc.file.startsWith('images/') ? acc.file : `images/${acc.file}`;

  openModal('accessoryOrderModal');
}

// Drop to Top / Scroll to Top Button Interaction
function initScrollToTop() {
  let btn = document.getElementById('scrollToTopBtn');
  if (!btn) {
    btn = document.createElement('button');
    btn.id = 'scrollToTopBtn';
    btn.className = 'scroll-to-top-btn';
    btn.setAttribute('aria-label', 'Drop to top');
    btn.setAttribute('title', 'Drop to top');
    btn.innerHTML = `
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
        <polyline points="18 15 12 9 6 15"></polyline>
      </svg>
    `;
    document.body.appendChild(btn);
  }

  const toggleVisibility = () => {
    if (window.scrollY > 280) {
      btn.classList.add('visible');
    } else {
      btn.classList.remove('visible');
    }
  };

  window.addEventListener('scroll', toggleVisibility, { passive: true });
  toggleVisibility();

  btn.addEventListener('click', (e) => {
    e.preventDefault();
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
}

// Global Vehicle Sale Order Modal Controller & Form Logic
function openVehicleSaleOrderModal(bikeName = '') {
  let modal = document.getElementById('vehicleSaleOrderModal');
  if (!modal) {
    injectVehicleSaleOrderModal();
    modal = document.getElementById('vehicleSaleOrderModal');
  }

  if (bikeName) {
    const select = document.getElementById('modalVehicleSelect');
    if (select) {
      for (let i = 0; i < select.options.length; i++) {
        if (select.options[i].text.toLowerCase().includes(bikeName.toLowerCase()) || 
            select.options[i].value.toLowerCase().includes(bikeName.toLowerCase())) {
          select.selectedIndex = i;
          break;
        }
      }
    }
  }

  if (modal) {
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }
}

function closeVehicleSaleOrderModal() {
  closeModal('vehicleSaleOrderModal');
}

function initVehicleSaleOrder() {
  const form = document.getElementById('vehicleSaleOrderForm');
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const feedback = document.getElementById('vehicleSaleOrderFeedback');
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalBtnText = submitBtn ? submitBtn.innerHTML : 'Submit';

    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.textContent = 'Processing Sale Order...';
    }

    const data = Object.fromEntries(new FormData(form).entries());

    try {
      const res = await fetch('/api/order-motorcycle', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      const result = await res.json();
      if (result.success) {
        if (feedback) {
          feedback.className = 'alert-feedback success';
          feedback.textContent = `${result.message} Order Reference: ${result.reference}`;
        }
        setTimeout(() => {
          closeVehicleSaleOrderModal();
          form.reset();
          if (feedback) feedback.className = 'alert-feedback';
          if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalBtnText;
          }
        }, 2800);
      } else {
        if (feedback) {
          feedback.className = 'alert-feedback error';
          feedback.textContent = result.error || 'Failed to submit vehicle sale order.';
        }
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.innerHTML = originalBtnText;
        }
      }
    } catch (err) {
      if (feedback) {
        feedback.className = 'alert-feedback success';
        feedback.textContent = 'Vehicle sale order registered! A dealership sales advisor will contact you to verify allocation.';
      }
      setTimeout(() => {
        closeVehicleSaleOrderModal();
        form.reset();
        if (feedback) feedback.className = 'alert-feedback';
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.innerHTML = originalBtnText;
        }
      }, 2800);
    }
  });
}

function injectVehicleSaleOrderModal() {
  if (document.getElementById('vehicleSaleOrderModal')) return;
  const modalDiv = document.createElement('div');
  modalDiv.id = 'vehicleSaleOrderModal';
  modalDiv.className = 'app-modal';
  modalDiv.innerHTML = `
    <div class="app-modal-content" style="max-width: 760px;">
      <button class="modal-close-btn" onclick="closeVehicleSaleOrderModal()" aria-label="Close Modal">&times;</button>
      
      <div style="border-bottom: 1px solid var(--surface-border); padding-bottom: 18px; margin-bottom: 24px;">
        <div class="eyebrow" style="margin-bottom: 6px;">OFFICIAL VEHICLE SALES & ALLOCATION</div>
        <h2 class="font-heading" style="font-size: 1.6rem; color: #fff; margin-bottom: 6px;">Vehicle Sale Order</h2>
        <p style="color: var(--metallic-grey); font-size: 0.9rem; line-height: 1.5;">
          Direct showroom purchase reservation & sales allocation. Submit your vehicle preferences and customer details below.
        </p>
      </div>

      <form id="vehicleSaleOrderForm">
        <div id="vehicleSaleOrderFeedback" class="alert-feedback"></div>

        <div class="form-grid-2">
          <div class="form-group">
            <label class="form-label">Select Motorcycle Model *</label>
            <select name="motorcycleModel" id="modalVehicleSelect" class="form-control form-select" required>
              <option value="">-- Choose Motorcycle Model --</option>
              <optgroup label="Superbikes & Sport Bikes">
                <option value="Honda CBR1000RR-R Fireblade SP">Honda CBR1000RR-R Fireblade SP (₹23,63,000)</option>
                <option value="BMW S1000RR M-Sport">BMW S1000RR M-Sport (₹24,95,000)</option>
                <option value="Ducati Panigale V4 S">Ducati Panigale V4 S (₹27,72,000)</option>
                <option value="Kawasaki Ninja ZX-10R KRT Edition">Kawasaki Ninja ZX-10R KRT (₹16,79,000)</option>
                <option value="Yamaha YZF-R1 Icon Blue">Yamaha YZF-R1 Icon Blue (₹20,39,000)</option>
                <option value="Suzuki GSX-R1000 Black Edition">Suzuki GSX-R1000 (₹19,80,000)</option>
                <option value="Yamaha YZF-R6 Supersport">Yamaha YZF-R6 Supersport (₹15,40,000)</option>
                <option value="Kawasaki Ninja 650 KRT Edition">Kawasaki Ninja 650 (₹7,16,000)</option>
              </optgroup>
              <optgroup label="Naked Streetfighters">
                <option value="KTM 390 Duke ABS Streetfighter">KTM 390 Duke ABS (₹3,11,000)</option>
                <option value="Ducati Streetfighter V4 S">Ducati Streetfighter V4 S (₹28,20,000)</option>
                <option value="Kawasaki Z900 Metallic Spark">Kawasaki Z900 (₹9,38,000)</option>
                <option value="Triumph Speed Triple 1200 RS">Triumph Speed Triple 1200 RS (₹18,25,000)</option>
                <option value="Bajaj Dominar 400 Touring Edition">Bajaj Dominar 400 (₹2,32,000)</option>
              </optgroup>
              <optgroup label="Cruisers & Modern Classics">
                <option value="Kawasaki Vulcan 900 Classic">Kawasaki Vulcan 900 Classic (₹10,49,000)</option>
                <option value="Harley-Davidson Fat Boy 107">Harley-Davidson Fat Boy 107 (₹21,99,000)</option>
                <option value="Harley-Davidson Breakout Custom Flame">Harley Breakout Custom (₹24,50,000)</option>
                <option value="Royal Enfield Classic 350 Chrome Red">Royal Enfield Classic 350 (₹2,24,000)</option>
                <option value="Royal Enfield Hunter 350 Rebel Blue">Royal Enfield Hunter 350 (₹1,74,000)</option>
                <option value="Jawa 42 Bobber Moonstone White">Jawa 42 Bobber (₹2,28,000)</option>
                <option value="Hero Splendor+ 01 Black Edition">Hero Splendor+ 01 Black Edition (₹74,900)</option>
                <option value="Bajaj Platina 100 Comfortec">Bajaj Platina 100 Comfortec (₹67,800)</option>
              </optgroup>
              <optgroup label="Adventure Touring">
                <option value="KTM 1290 Super Adventure S">KTM 1290 Super Adventure S (₹22,75,000)</option>
                <option value="BMW R1250 GS Trophy Edition">BMW R1250 GS Trophy (₹23,10,000)</option>
                <option value="BMW F850 GS Adventure Rallye">BMW F850 GS Adventure (₹13,75,000)</option>
              </optgroup>
              <option value="Bespoke Custom Build / Unlisted Import">Other / Custom Import Consultation</option>
            </select>
          </div>

          <div class="form-group">
            <label class="form-label">Purchase Condition *</label>
            <select name="vehicleCondition" class="form-control form-select" required>
              <option value="Brand New (Zero-Mileage Factory Allocation)">Brand New (Zero-Mileage Factory Allocation)</option>
              <option value="Certified Pre-Owned (120-Point Inspected with Warranty)">Certified Pre-Owned (120-Point Inspected)</option>
              <option value="Track / Race Prepared Specification">Track / Race Prepared Specification</option>
            </select>
          </div>
        </div>

        <div class="form-grid-2">
          <div class="form-group">
            <label class="form-label">Customer Full Name *</label>
            <input type="text" name="customerName" class="form-control" required placeholder="e.g. Rahul Sharma">
          </div>

          <div class="form-group">
            <label class="form-label">Mobile Number *</label>
            <input type="tel" name="mobile" class="form-control" required placeholder="+91 98765 43210">
          </div>
        </div>

        <div class="form-grid-2">
          <div class="form-group">
            <label class="form-label">Email Address *</label>
            <input type="email" name="email" class="form-control" required placeholder="rahul@example.com">
          </div>

          <div class="form-group">
            <label class="form-label">Preferred Showroom / Delivery City *</label>
            <select name="dealership" class="form-control form-select" required>
              <option value="Bengaluru Flagship Experience Pavilion (Koramangala)">Bengaluru Flagship Pavilion (Koramangala)</option>
              <option value="Mumbai High-Performance Marine Hub">Mumbai Marine Hub</option>
              <option value="Delhi NCR International Circuit Facility">Delhi NCR Circuit Facility</option>
              <option value="Hyderabad Showroom Hub">Hyderabad Showroom Hub</option>
              <option value="Chennai Coast Track Pavilion">Chennai Coast Track Pavilion</option>
              <option value="Enclosed Doorstep Nationwide Delivery">Enclosed Doorstep Nationwide Delivery</option>
            </select>
          </div>
        </div>

        <div class="form-grid-2">
          <div class="form-group">
            <label class="form-label">Preferred Payment & Financing *</label>
            <select name="purchaseMethod" class="form-control form-select" required>
              <option value="Direct Wire / Full Upfront Dealership Transfer">Direct Wire / Full Dealership Transfer</option>
              <option value="Bank Loan & Low EMI Financing Assistance">Bank Loan & Low EMI Financing Assistance</option>
              <option value="Existing Motorcycle Trade-In / Exchange">Existing Motorcycle Trade-In / Exchange</option>
            </select>
          </div>

          <div class="form-group">
            <label class="form-label">Expected Delivery Timeline *</label>
            <select name="deliveryTimeline" class="form-control form-select" required>
              <option value="Immediate Showroom Allocation (In-Stock)">Immediate Allocation (In-Stock Models)</option>
              <option value="Within 15 to 30 Days">Within 15 to 30 Days</option>
              <option value="Custom Scheduled Delivery Date">Custom Scheduled Delivery Date</option>
            </select>
          </div>
        </div>

        <div class="form-group">
          <label class="form-label">Custom Specifications & Delivery Notes (Optional)</label>
          <textarea name="notes" class="form-control" rows="3" placeholder="Specify optional Akrapovič exhaust fitment, riding gear bundle sizing, registration preferences, or trade-in bike details..."></textarea>
        </div>

        <button type="submit" class="btn-red" style="width: 100%; padding: 13px; font-size: 1rem; font-weight: 700; justify-content: center; margin-top: 6px;">
          Submit Vehicle Sale Order &rarr;
        </button>
        <p style="text-align: center; color: var(--metallic-grey); font-size: 0.8rem; margin-top: 10px;">
          🔒 Authorized reservation enquiry. No immediate payment deducted online. Sales consultant connects to confirm allocation.
        </p>
      </form>
    </div>
  `;
  document.body.appendChild(modalDiv);
  initVehicleSaleOrder();
}

// FAQ Accordion Toggle Interaction
function initFaqAccordion() {
  const faqItems = document.querySelectorAll('.faq-item');
  if (!faqItems.length) return;

  faqItems.forEach(item => {
    const trigger = item.querySelector('.faq-trigger');
    const answer = item.querySelector('.faq-answer');
    if (!trigger || !answer) return;

    if (item.classList.contains('active')) {
      answer.style.maxHeight = answer.scrollHeight + 'px';
    }

    trigger.addEventListener('click', () => {
      const isCurrentlyActive = item.classList.contains('active');

      // Close all other FAQ items for a polished accordion experience
      faqItems.forEach(otherItem => {
        if (otherItem !== item && otherItem.classList.contains('active')) {
          otherItem.classList.remove('active');
          const otherAnswer = otherItem.querySelector('.faq-answer');
          if (otherAnswer) otherAnswer.style.maxHeight = null;
        }
      });

      // Toggle current item
      if (isCurrentlyActive) {
        item.classList.remove('active');
        answer.style.maxHeight = null;
      } else {
        item.classList.add('active');
        answer.style.maxHeight = answer.scrollHeight + 'px';
      }
    });
  });
}



