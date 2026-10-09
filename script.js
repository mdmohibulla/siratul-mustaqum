const SUPABASE_URL = 'আপনার_PROJECT_URL';
const SUPABASE_KEY = 'আপনার_ANON_KEY';

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

document.getElementById('helpForm')?.addEventListener('submit', async event => {
  event.preventDefault();
  const form = event.currentTarget;
  const note = document.getElementById('formNote');
  const btn = form.querySelector('button[type="submit"]');
  if (SUPABASE_URL.includes('PROJECT_URL')) {
    note.textContent = 'ফর্ম এখনও চালু হয়নি। script.js-এ Supabase URL ও KEY বসান।';
    return;
  }
  const data = new FormData(form);
  btn.disabled = true;
  note.textContent = 'পাঠানো হচ্ছে...';
  try {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/help_requests`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': SUPABASE_KEY,
        'Authorization': `Bearer ${SUPABASE_KEY}`,
        'Prefer': 'return=minimal'
      },
      body: JSON.stringify({
        name: data.get('name'), phone: data.get('phone'), area: data.get('area'),
        type: data.get('type'), details: data.get('details')
      })
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
