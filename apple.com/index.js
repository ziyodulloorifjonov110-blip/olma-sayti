const flyoutData = {
    store: { col1: { title: "Shop", items: ["Shop the Latest", "Mac", "iPad", "iPhone", "Apple Watch"] }, col2: { title: "Quick Links", items: ["Find a Store", "Order Status", "Apple Trade In"] } },
    mac: { col1: { title: "Explore Mac", items: ["Explore All Mac", "MacBook Pro", "MacBook Air", "iMac"] }, col2: { title: "Shop Mac", items: ["Shop Mac", "Mac Accessories"] } },
    iphone: { col1: { title: "Explore iPhone", items: ["Explore All iPhone", "iPhone 17 Pro", "iPhone 17"] }, col2: { title: "Shop iPhone", items: ["Shop iPhone", "Apple Trade In"] } },
    watch: { col1: { title: "Explore Watch", items: ["Apple Watch Series 11", "Apple Watch Ultra 3"] } },
    vision: { col1: { title: "Explore Vision", items: ["Apple Vision Pro", "Guided Tour"] } },
    airpods: { col1: { title: "Explore AirPods", items: ["AirPods 4", "AirPods Pro 2"] } },
    tv: { col1: { title: "TV & Home", items: ["Apple TV 4K", "HomePod"] } },
    entertainment: { col1: { title: "Entertainment", items: ["Apple TV+", "Apple Music", "Apple Arcade"] } },
    accessories: { col1: { title: "Accessories", items: ["All Accessories", "Made by Apple"] } },
    support: { col1: { title: "Support", items: ["iPhone Support", "Mac Support"] } }
};

const navItems = document.querySelectorAll('.nav-item[data-menu]');
const globalNav = document.querySelector('.global-nav');

if (globalNav && navItems.length > 0) {
    const navFlyout = document.createElement('div');
    navFlyout.className = 'nav-flyout';
    navFlyout.innerHTML = `<div class="flyout-content" id="flyoutContent"></div>`;
    globalNav.appendChild(navFlyout);
    const flyoutContent = document.getElementById('flyoutContent');

    navItems.forEach(item => {
        item.addEventListener('mouseenter', () => {
            const menuKey = item.getAttribute('data-menu');
            const data = flyoutData[menuKey];
            if (data) {
                let html = '';
                for (let key in data) {
                    html += `<div class="flyout-column"><h4>${data[key].title}</h4><ul>${data[key].items.map(sub => `<li><a href="#">${sub}</a></li>`).join('')}</ul></div>`;
                }
                flyoutContent.innerHTML = html;
                navFlyout.classList.add('active');
            }
        });
    });
    globalNav.addEventListener('mouseleave', () => { navFlyout.classList.remove('active'); });
}

// Поиск
const searchBtn = document.getElementById('searchBtn');
const searchOverlay = document.getElementById('searchOverlay');
const closeSearch = document.getElementById('closeSearch');
if (searchBtn && searchOverlay) {
    searchBtn.addEventListener('click', (e) => { e.preventDefault(); searchOverlay.classList.add('active'); });
    closeSearch.addEventListener('click', () => { searchOverlay.classList.remove('active'); });
}

// Конфигуратор iPhone
const swatches = document.querySelectorAll('.swatch');
const storageCards = document.querySelectorAll('.storage-card');
const deviceImage = document.getElementById('deviceImage');
const selectedColorName = document.getElementById('selectedColorName');
const finalPriceText = document.getElementById('finalPriceText');
const finalPriceValue = document.getElementById('finalPriceValue');

let selectedColor = "Cosmic Orange";
let selectedStorage = "128GB";
let basePrice = 999;

if (swatches.length > 0) {
    swatches.forEach(swatch => {
        swatch.addEventListener('click', () => {
            swatches.forEach(s => s.classList.remove('active'));
            swatch.classList.add('active');
            selectedColor = swatch.getAttribute('data-color');
            selectedColorName.textContent = selectedColor;
            deviceImage.src = swatch.getAttribute('data-img');
            updateSummary();
        });
    });
    storageCards.forEach(card => {
        card.addEventListener('click', () => {
            storageCards.forEach(c => c.classList.remove('active'));
            card.classList.add('active');
            selectedStorage = card.getAttribute('data-storage');
            basePrice = parseInt(card.getAttribute('data-price'));
            finalPriceValue.textContent = `$${basePrice}.00`;
            updateSummary();
        });
    });
    function updateSummary() {
        finalPriceText.textContent = `iPhone 17 Pro ${selectedStorage} ${selectedColor}`;
    }
}

// Корзина (Bag)
let cart = JSON.parse(localStorage.getItem('apple_cart')) || [];
const bagOverlay = document.createElement('div');
bagOverlay.className = 'bag-overlay';
bagOverlay.innerHTML = `
    <div class="bag-modal">
        <div class="bag-header"><h2>Your Bag</h2><i class="fas fa-times" id="closeBag" style="cursor:pointer;"></i></div>
        <div class="bag-body" id="bagBody"></div>
        <div class="bag-footer" id="bagFooter"></div>
    </div>
`;
document.body.appendChild(bagOverlay);

const bagBtns = document.querySelectorAll('.bag-btn');
const closeBag = document.getElementById('closeBag');
const bagBody = document.getElementById('bagBody');
const bagFooter = document.getElementById('bagFooter');

bagBtns.forEach(btn => {
    btn.addEventListener('click', (e) => { e.preventDefault(); renderBag(); bagOverlay.classList.add('active'); });
});
closeBag.addEventListener('click', () => { bagOverlay.classList.remove('active'); });
bagOverlay.addEventListener('click', (e) => { if (e.target === bagOverlay) bagOverlay.classList.remove('active'); });

function renderBag() {
    if (cart.length === 0) {
        bagBody.innerHTML = `<div class="empty-bag"><i class="fas fa-shopping-bag" style="font-size:48px; color:#d2d2d7; margin-bottom:15px;"></i><p>Your Bag is empty.</p></div>`;
        bagFooter.innerHTML = '';
        return;
    }
    let total = 0;
    bagBody.innerHTML = cart.map((item, idx) => {
        total += item.price;
        return `<div style="display:flex; justify-content:space-between; align-items:center; padding:12px 0; border-bottom:1px solid #f0f0f2;">
            <div><h4 style="font-size:15px; font-weight:600;">${item.name}</h4><p style="font-size:13px; color:#86868b;">${item.details}</p></div>
            <div style="text-align:right;"><span style="font-weight:600; display:block;">$${item.price}.00</span><button onclick="removeItem(${idx})" style="background:none; border:none; color:#0066cc; font-size:12px; cursor:pointer;">Remove</button></div>
        </div>`;
    }).join('');
    bagFooter.innerHTML = `<div class="bag-total-row"><span>Total</span><span>$${total}.00</span></div><button class="cta-button primary" onclick="checkout()" style="width:100%; border:none; padding:12px; cursor:pointer; border-radius:980px;">Check Out</button>`;
}

window.removeItem = function(idx) {
    cart.splice(idx, 1);
    localStorage.setItem('apple_cart', JSON.stringify(cart));
    renderBag();
}

window.checkout = function() {
    alert('Thank you for your order! Simulation successful.');
    cart = [];
    localStorage.setItem('apple_cart', JSON.stringify(cart));
    renderBag();
    setTimeout(() => { bagOverlay.classList.remove('active'); }, 1000);
}

const addToBagBtn = document.querySelector('.buy-bag-btn');
if (addToBagBtn) {
    addToBagBtn.addEventListener('click', () => {
        cart.push({ name: "iPhone 17 Pro", details: `${selectedStorage}, ${selectedColor}`, price: basePrice });
        localStorage.setItem('apple_cart', JSON.stringify(cart));
        renderBag();
        bagOverlay.classList.add('active');
    });
}