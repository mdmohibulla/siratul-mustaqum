const SUPABASE_URL = 'https://dgsxzwutsstfsezvlkmh.supabase.co';
const SUPABASE_KEY = 'sb_publishable_27L6UJCzRDDD9xEZ4733OQ_dLsY0oDE';

const menuToggle = document.getElementById('menuToggle');
const nav = document.getElementById('nav');
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
[['helpForm', 'help_requests'], ['memberForm', 'member_applications']].forEach(([id, table]) => {
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
      note.textContent = 'আপনার আবেদন গ্রহণ করা হয়েছে। আমরা যোগাযোগ করব।';
    } catch (e) {
      note.textContent = 'পাঠানো যায়নি। আবার চেষ্টা করুন।';
    } finally {
      btn.disabled = false;
    }
  });
});
