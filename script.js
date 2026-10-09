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
document.getElementById('year').textContent = new Date().getFullYear();

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
      button.textContent = 'কপি হয়েছে ✓';
      setTimeout(() => button.textContent = old, 1600);
    } catch {
      alert('নম্বরটি কপি করা যায়নি। হাতে কপি করুন: ' + value);
    }
  });
});

document.getElementById('helpForm').addEventListener('submit', event => {
  event.preventDefault();
  const data = new FormData(event.currentTarget);
  const email = 'FOUNDATION_EMAIL_HERE'; // প্রকাশের আগে এখানে অফিসিয়াল ইমেইল বসান
  if (email === 'FOUNDATION_EMAIL_HERE') {
    document.getElementById('formNote').textContent =
      'ফর্মের নমুনা যাচাই হয়েছে। আবেদন পাঠাতে script.js-এ FOUNDATION_EMAIL_HERE-এর জায়গায় ফাউন্ডেশনের অফিসিয়াল ইমেইল বসান। এখন কোনো তথ্য কোথাও সংরক্ষণ বা পাঠানো হচ্ছে না।';
    alert('এটি ডেমো ফর্ম। আবেদন গ্রহণ চালু করতে অফিসিয়াল ইমেইল বা নিরাপদ ফর্ম-সেবা সেটআপ করতে হবে।');
    return;
  }
  const subject = encodeURIComponent('সিরাতুল মুস্তাকিম — সহায়তার আবেদন');
  const body = encodeURIComponent(
    'নাম: ' + data.get('name') + '\nযোগাযোগ: ' + data.get('phone') +
    '\nএলাকা: ' + data.get('area') + '\nসহায়তার ধরন: ' + data.get('type') +
    '\nবিবরণ:\n' + data.get('details')
  );
  window.location.href = `mailto:${email}?subject=${subject}&body=${body}`;
});
