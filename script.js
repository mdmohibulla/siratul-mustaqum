const SUPABASE_URL = 'https://dgsxzwutsstfsezvlkmh.supabase.co';
const SUPABASE_KEY = 'sb_publishable_27L6UJCzRDDD9xEZ4733OQ_dLsY0oDE';

const menuToggle = document.getElementById('menuToggle');
const nav = document.getElementById('nav');

// ---- ডার্ক থিম, লগইন অবস্থা, মেনু ও গোপন পেজ ----
const dk = document.createElement('link');
dk.rel = 'stylesheet'; dk.href = 'dark.css';
document.head.appendChild(dk);
const MT = sessionStorage.getItem('mtk');
const PAGE = (location.pathname.split('/').pop() || 'index.html').replace(/\.html$/, '') || 'index';
const PRIVATE_PAGES = ['dashboard', 'about', 'rules', 'activities', 'reports', 'profile'];
if (PRIVATE_PAGES.includes(PAGE) && !MT) { document.body.style.display = 'none'; location.replace('member-login.html'); }
if (PAGE === 'index' && MT) location.replace('dashboard.html');
if (nav) {
  const links = MT
    ? [['dashboard.html','হোম'],['rules.html','নীতিমালা'],['activities.html','কার্যক্রম'],['reports.html','হিসাব ও রিপোর্ট'],['profile.html','প্রোফাইল']]
    : [['index.html','হোম'],['donate.html','অনুদান'],['apply.html','সাহায্যের আবেদন']];
  nav.innerHTML = links.map(([h, t]) => `<a href="${h}">${t}</a>`).join('') +
    (MT ? '<a href="#" id="navOut" class="nav-cta">লগআউট</a>' : '<a class="nav-cta" href="member-login.html">সদস্য লগইন</a>');
  document.getElementById('navOut')?.addEventListener('click', async e => {
    e.preventDefault();
    try { await fetch(`${SUPABASE_URL}/rest/v1/rpc/member_logout`, { method: 'POST', headers: { apikey: SUPABASE_KEY, 'Content-Type': 'application/json' }, body: JSON.stringify({ p_token: MT }) }); } catch (x) {}
    sessionStorage.removeItem('mtk'); location.href = 'index.html';
  });
}
if (MT) {
  document.body.classList.add('has-bn');
  const bnav = document.createElement('div');
  bnav.className = 'bottom-nav';
  bnav.innerHTML = [['dashboard','🏠','হোম'],['activities','📋','কার্যক্রম'],['reports','📊','রিপোর্ট'],['profile','👤','প্রোফাইল']]
    .map(([p, i, t]) => `<a href="${p}.html" class="${PAGE === p ? 'on' : ''}"><span style="font-size:22px">${i}</span>${t}</a>`).join('');
  document.body.appendChild(bnav);
}
menuToggle?.addEventListener('click', () => {
  const isOpen = nav.classList.toggle('open');
  menuToggle.setAttribute('aria-expanded', String(isOpen));
});
nav?.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
  nav.classList.remove('open');
  menuToggle?.setAttribute('aria-expanded', 'false');
}));

const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();

document.querySelectorAll('.copy-btn').forEach(button => {
  button.addEventListener('click', async () => {
    const value = button.dataset.copy;
    if (!value || value.includes('X')) {
      alert('প্রকাশের আগে এখানে ফাউন্ডেশনের সঠিক অনুদান নম্বর বসান।');
      return;
    }
    try {
      await navigator.clipboard.writeText(value);
      const old = button.textContent;
      button.textContent = 'কপি হয়েছে ✓';
      setTimeout(() => button.textContent = old, 1600);
    } catch {
      alert('নম্বরটি কপি করা যায়নি। হাতে কপি করুন: ' + value);
    }
  });
});

// ফর্ম আইডি -> Supabase টেবিলের নাম
[['helpForm', 'help_requests'], ['memberForm', 'member_applications'], ['donationForm', 'donations']].forEach(([id, table]) => {
  document.getElementById(id)?.addEventListener('submit', async event => {
    event.preventDefault();
    const form = event.currentTarget;
    const note = form.querySelector('.form-note');
    const btn = form.querySelector('button[type="submit"]');
    if (!SUPABASE_URL) {
      note.textContent = 'ফর্ম এখনও চালু হয়নি। script.js-এ Supabase URL ও KEY বসান।';
      return;
    }
    btn.disabled = true;
    note.textContent = 'পাঠানো হচ্ছে...';
    try {
      const res = await fetch(`${SUPABASE_URL}/rest/v1/${table}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': SUPABASE_KEY,
          'Prefer': 'return=minimal'
        },
        body: JSON.stringify(Object.fromEntries(new FormData(form)))
      });
      if (!res.ok) throw new Error('failed');
      form.reset();
      note.textContent = form.dataset.ok || 'আপনার আবেদন গ্রহণ করা হয়েছে। আমরা যোগাযোগ করব।';
    } catch (e) {
      note.textContent = 'পাঠানো যায়নি। আবার চেষ্টা করুন।';
    } finally {
      btn.disabled = false;
    }
  });
});

// অনুদান পেজে "টাকা পাঠিয়েছেন?" লিংক
const payGrid = document.querySelector('.payment-grid');
if (payGrid) {
  const link = document.createElement('a');
  link.href = 'sent.html';
  link.className = 'button button-light';
  link.textContent = 'টাকা পাঠিয়েছেন? আমাদের জানান';
  link.style.cssText = 'display:block;width:fit-content;margin:22px auto 0';
  payGrid.insertAdjacentElement('afterend', link);
}

