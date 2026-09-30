const ROLES = { GUEST: 'GUEST', USER: 'USER', PROMOTER: 'PROMOTER' };
let currentRole = ROLES.GUEST;
let activeEventContext = null;
let navigationHistory = ['page-home'];

// Expanded Mock Repository Featuring Advanced Context Categories
let eventsDatabase = [
    { 
        id: 1, 
        title: "Jakarta Symphony Theater: Classical Sounds", 
        category: "MUSIKAL", 
        date: "Friday, 19 June 2026", 
        location: "Gedung Kesenian Jakarta", 
        organizer: "Symphony ID", 
        price: 0, 
        isSponsored: false, 
        about: "Pagelaran simfoni klasik megah gratis tanpa dipungut biaya pendaftaran." 
    },
    { 
        id: 2, 
        title: "Soundfest BSD: Summer Music Indie Gala", 
        category: "KONSER", 
        date: "Saturday, 11 July 2026", 
        location: "ICE BSD Hall 3", 
        organizer: "Soundfest Corp", 
        price: 150000, 
        isSponsored: true, 
        about: "Festival musik independen terbesar pertengahan tahun 2026." 
    },
    { 
        id: 3, 
        title: "Danamon Marathon 2026: City Run Elite", 
        category: "SPORTS", 
        date: "Sunday, 21 June 2026", 
        location: "Gelora Bung Karno, Jakarta", 
        organizer: "Danamon Sports Organizers", 
        price: 250000, 
        isSponsored: false, 
        about: "Kompetisi lari marathon tahunan berskala internasional. Dapatkan race pack eksklusif, medali finisher, dan total hadiah ratusan juta rupiah." 
    },
    { 
        id: 4, 
        title: "Festival Wayang Kulit & Kebudayaan Jawa", 
        category: "CULTURAL", 
        date: "Wednesday, 08 July 2026", 
        location: "Alun-Alun Utara, Yogyakarta", 
        organizer: "Dinas Kebudayaan DIY", 
        price: 0, 
        isSponsored: true, 
        about: "Pagelaran seni kebudayaan daerah adiluhung semalam suntuk bersama dalang legendaris nasional. Dilengkapi stan kerajinan rakyat tradisional." 
    },
    { 
        id: 5, 
        title: "AI & Web3 Revolution: Seminar Nasional", 
        category: "SEMINAR", 
        date: "Thursday, 13 August 2026", 
        location: "Grand Ballroom Ritz-Carlton, Jakarta", 
        organizer: "TechInAsia Forum", 
        price: 500000, 
        isSponsored: false, 
        about: "Seminar edukasi dan panel diskusi eksklusif bersama praktisi industri global mengupas tuntas masa depan kecerdasan buatan dan desentralisasi data." 
    },
    { 
        id: 6, 
        title: "Chronicles of Eldoria: Action-RPG Live Interactive", 
        category: "LARP", 
        date: "Saturday, 29 August 2026", 
        location: "Hutan Pinus Cikole, Lembang", 
        organizer: "Indonesia LARP Community", 
        price: 175000, 
        isSponsored: false, 
        about: "Rasakan petualangan fantasi nyata interaktif (Live Action Roleplaying). Peserta akan mendapatkan peran khusus, quest lines, dan simulasi pertempuran aman." 
    }
];

let forumDatabase = [
    { eventTitle: "Chronicles of Eldoria", author: "Geralt_Indo", msg: "Ada faksi ksatria yang butuh tambahan tank/shield bearer?" },
    { eventTitle: "AI & Web3 Revolution", author: "Dr. Pratama", msg: "Adakah sertifikat fisik bertanda tangan pembicara utama?" },
    { eventTitle: "Danamon Marathon", author: "Roni Run", msg: "Pengambilan race pack bisa diwakilkan pakai surat kuasa tidak ya?" }
];

document.addEventListener("DOMContentLoaded", () => {
    renderEventStream(eventsDatabase, 'home-event-list');
    renderForumFeed();
    updateSystemUIRoleState();
});

function setRoleViaTest(roleName) {
    currentRole = ROLES[roleName];
    document.querySelectorAll('.test-btn').forEach(b => b.classList.remove('active'));
    if(roleName === 'GUEST') document.getElementById('tbtn-guest').classList.add('active');
    if(roleName === 'USER') document.getElementById('tbtn-user').classList.add('active');
    if(roleName === 'PROMOTER') document.getElementById('tbtn-promoter').classList.add('active');
    updateSystemUIRoleState();
}

function renderEventStream(dataSet, containerId) {
    const targetContainer = document.getElementById(containerId);
    targetContainer.innerHTML = '';
    
    if(dataSet.length === 0) {
        targetContainer.innerHTML = '<div style="grid-column: 1/-1; text-align:center; padding:48px; color:var(--text-secondary);">Tidak ada event ditemukan dalam kategori ini.</div>';
        return;
    }

    dataSet.forEach(event => {
        const card = document.createElement('div');
        card.className = 'event-card';
        card.onclick = () => showEventDetailsScreen(event.id);
        card.innerHTML = `
            <div class="card-banner ${event.isSponsored ? 'sponsored-style' : 'regular-style'}">
                <span class="event-badge">${event.category}</span>
                ${event.isSponsored ? '<span class="sponsored-badge">SPONSORED ADS</span>' : ''}
            </div>
            <div class="card-content">
                <h3>${event.title}</h3>
                <div class="meta-row"><i class="material-icons">calendar_today</i><span>${event.date}</span></div>
                <div class="meta-row"><i class="material-icons">location_on</i><span>${event.location}</span></div>
                <div class="card-footer">
                    <span class="price-tag ${event.price === 0 ? 'price-free' : 'price-paid'}">${event.price === 0 ? 'GRATIS' : 'Rp '+event.price.toLocaleString('id-ID')}</span>
                </div>
            </div>
        `;
        targetContainer.appendChild(card);
    });
}

function renderForumFeed() {
    const container = document.getElementById('forum-posts-stream');
    container.innerHTML = '';
    forumDatabase.forEach(post => {
        container.innerHTML += `
            <div class="forum-card">
                <div class="forum-meta"><span class="forum-author">${post.author}</span><span class="forum-pill-tag">${post.eventTitle}</span></div>
                <p class="forum-msg">"${post.msg}"</p>
            </div>`;
    });
}

function navigateTo(pageId, bypassStack = false) {
    document.querySelectorAll('.page').forEach(p => p.classList.add('hidden'));
    document.getElementById(pageId).classList.remove('hidden');
    const backBtn = document.getElementById('back-btn');
    const bottomNav = document.getElementById('main-bottom-nav');

    if (pageId === 'page-event-details') {
        backBtn.classList.remove('hidden');
        bottomNav.classList.add('hidden');
    } else {
        backBtn.classList.add('hidden');
        bottomNav.classList.remove('hidden');
    }
    if (!bypassStack && navigationHistory[navigationHistory.length - 1] !== pageId) navigationHistory.push(pageId);
}

function navigateBack() {
    if (navigationHistory.length > 1) {
        navigationHistory.pop();
        navigateTo(navigationHistory[navigationHistory.length - 1], true);
    }
}

function handleTabClick(pageId, element) {
    document.querySelectorAll('.nav-item').forEach(item => item.classList.remove('active'));
    element.classList.add('active');
    navigationHistory = ['page-home'];
    navigateTo(pageId);
}

function showEventDetailsScreen(id) {
    const event = eventsDatabase.find(e => e.id === id);
    if (!event) return;
    activeEventContext = event;
    document.getElementById('detail-gradient').className = `details-gradient-header ${event.isSponsored ? 'sponsored-style' : 'regular-style'}`;
    document.getElementById('detail-badge').innerText = event.category;
    document.getElementById('detail-sponsored-tag').className = event.isSponsored ? 'sponsored-badge' : 'sponsored-badge hidden';
    document.getElementById('detail-title').innerText = event.title;
    document.getElementById('detail-date').innerText = event.date;
    document.getElementById('detail-location').innerText = event.location;
    document.getElementById('detail-organizer').innerText = event.organizer;
    document.getElementById('detail-about').innerText = event.about;
    document.getElementById('detail-price').innerText = event.price === 0 ? "Gratis Masuk" : `Rp ${event.price.toLocaleString('id-ID')}`;
    
    const ctaBtn = document.getElementById('detail-cta-btn');
    ctaBtn.innerText = event.price === 0 ? "Daftar Gratis (Guest)" : "Beli Tiket Berbayar";
    ctaBtn.style.backgroundColor = event.price === 0 ? "#00e676" : "#b5a4f4";
    navigateTo('page-event-details');
}

function handleEventRegistrationTrigger() {
    if (!activeEventContext) return;
    if (activeEventContext.price === 0) {
        openModal('modal-guest-reg');
    } else {
        if (currentRole === ROLES.GUEST) {
            alert("Akses Ditolak: Event ini Berbayar! Hubungkan akun Anda ke status USER via panel simulasi di atas.");
            navigateTo('page-profile');
        } else {
            document.getElementById('pay-summary-title').innerText = activeEventContext.title;
            document.getElementById('pay-summary-price').innerText = `Rp ${activeEventContext.price.toLocaleString('id-ID')}`;
            openModal('modal-payment-gateway');
        }
    }
}

function handleProfileCoreAction() {
    if (currentRole === ROLES.GUEST) {
        currentRole = ROLES.USER;
        updateSystemUIRoleState();
        alert("Berhasil Login! Status berubah jadi USER.");
    } else if (currentRole === ROLES.USER) {
        openModal('modal-promoter-verification');
    }
}

function updateSystemUIRoleState() {
    const badge = document.getElementById('role-indicator-badge');
    const profileName = document.getElementById('profile-name');
    const profileSubtext = document.getElementById('profile-subtext');
    const coreBtn = document.getElementById('profile-core-action-btn');
    const createEventBtn = document.getElementById('btn-promoter-create-event');
    
    const guestCheck = document.getElementById('access-guest-check');
    const userCheck = document.getElementById('access-user-check');
    const promoterCheck = document.getElementById('access-promoter-check');

    if (currentRole === ROLES.GUEST) {
        badge.innerText = "GUEST"; badge.className = "badge-role guest-role";
        profileName.innerText = "Pengunjung (Guest)";
        profileSubtext.innerText = "Masuk untuk memesan tiket berbayar & akses forum";
        coreBtn.innerText = "LOGIN SEKARANG"; coreBtn.classList.remove('hidden');
        createEventBtn.classList.add('hidden');
        document.getElementById('forum-locked-view').classList.remove('hidden');
        document.getElementById('forum-active-view').classList.add('hidden');
        userCheck.className = promoterCheck.className = "material-icons text-grey";
        userCheck.innerText = promoterCheck.innerText = "cancel";
    } else if (currentRole === ROLES.USER) {
        badge.innerText = "USER"; badge.className = "badge-role user-role";
        profileName.innerText = "Andi Wijaya (MEP Member)";
        profileSubtext.innerText = "Akun aktif terverifikasi";
        coreBtn.innerText = "UPGRADE JADI PROMOTOR"; coreBtn.classList.remove('hidden');
        createEventBtn.classList.add('hidden');
        document.getElementById('forum-locked-view').classList.add('hidden');
        document.getElementById('forum-active-view').classList.remove('hidden');
        userCheck.className = "material-icons text-green"; userCheck.innerText = "check_circle";
        promoterCheck.className = "material-icons text-grey"; promoterCheck.innerText = "cancel";
    } else if (currentRole === ROLES.PROMOTER) {
        badge.innerText = "PROMOTOR"; badge.className = "badge-role promoter-role";
        profileName.innerText = "Andi Entertainment Pro";
        profileSubtext.innerText = "Promotor Resmi Terverifikasi";
        coreBtn.classList.add('hidden');
        createEventBtn.classList.remove('hidden');
        document.getElementById('forum-locked-view').classList.add('hidden');
        document.getElementById('forum-active-view').classList.remove('hidden');
        userCheck.className = promoterCheck.className = "material-icons text-green";
        userCheck.innerText = promoterCheck.innerText = "check_circle";
    }
}

function submitSecurityVerification() {
    if(document.getElementById('verify-ktp').value.length !== 16) {
        alert("Gagal: NIK KTP wajib 16 digit angka!");
        return;
    }
    currentRole = ROLES.PROMOTER;
    updateSystemUIRoleState();
    closeAllModals();
    alert("Verifikasi Sukses! Fitur pembuatan event terbuka.");
}

function savePromoterNewEvent() {
    const title = document.getElementById('new-title').value;
    const category = document.getElementById('new-category').value;
    const price = parseInt(document.getElementById('new-price').value) || 0;
    if(!title || !category) { alert("Judul & Kategori wajib diisi!"); return; }

    const newEv = {
        id: eventsDatabase.length + 1,
        title: title,
        category: category,
        date: document.getElementById('new-date').value || "TBA 2026",
        location: document.getElementById('new-location').value || "Jakarta",
        organizer: "Promotor Saya",
        price: price,
        isSponsored: document.getElementById('new-is-sponsored').checked,
        about: document.getElementById('new-desc').value || "No Description."
    };

    eventsDatabase.unshift(newEv);
    renderEventStream(eventsDatabase, 'home-event-list');
    closeAllModals();
    navigateTo('page-home');
}

function handleSearchQuery() {
    const k = document.getElementById('search-input-field').value.toLowerCase();
    const activeChip = document.querySelector('#search-category-chips .chip.active');
    const chipText = activeChip ? activeChip.innerText.toUpperCase() : 'SEMUA KATEGORI';
    
    let res = eventsDatabase.filter(e => {
        const mk = e.title.toLowerCase().includes(k) || e.about.toLowerCase().includes(k);
        const mc = (chipText === 'SEMUA KATEGORI' || e.category === chipText);
        return mk && mc;
    });
    renderEventStream(res, 'search-event-list');
}

function filterSearchCategory(cat) {
    const chips = document.querySelectorAll('#search-category-chips .chip');
    chips.forEach(c => {
        c.classList.remove('active');
        if(cat === 'ALL' && c.innerText.toUpperCase() === 'SEMUA KATEGORI') c.classList.add('active');
        if(c.innerText.toUpperCase() === cat) c.classList.add('active');
    });
    handleSearchQuery();
}

function filterByCategory(cat) {
    const chips = document.querySelectorAll('#home-category-chips .chip');
    chips.forEach(c => {
        c.classList.remove('active');
        if(cat === 'ALL' && c.innerText.toUpperCase() === 'SEMUA') c.classList.add('active');
        if(c.innerText.toUpperCase() === cat || (cat === 'LARP' && c.innerText === 'Action-RPG')) c.classList.add('active');
    });
    renderEventStream(cat === 'ALL' ? eventsDatabase : eventsDatabase.filter(e => e.category === cat), 'home-event-list');
}

function openModal(id) { document.getElementById('modal-backdrop').classList.remove('hidden'); document.getElementById(id).classList.remove('hidden'); }
function closeAllModals() { document.getElementById('modal-backdrop').classList.add('hidden'); document.querySelectorAll('.bottom-sheet').forEach(s => s.classList.add('hidden')); }
function confirmGuestFreeRegistration() { closeAllModals(); alert("Tiket Gratis Berhasil Diunduh!"); }
function confirmPaidPaymentTransaction() { closeAllModals(); alert("Pembayaran Sukses! Tiket Masuk Tersimpan."); }