// Remember the visitor's language choice (EN / 日本語 switch).
document.addEventListener('click', function (e) {
  var a = e.target.closest && e.target.closest('a[data-lang]');
  if (!a) return;
  document.cookie = 'siwnin_lang=' + a.getAttribute('data-lang') + '; path=/; max-age=31536000; SameSite=Lax';
});
