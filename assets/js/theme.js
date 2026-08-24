// strikethroughtextgenerators.com — sitewide theme toggle
// Include this on every page, right after the <button id="themeToggle"> exists.
(function(){
  var toggle = document.getElementById('themeToggle');
  if(!toggle) return;

  function applyState(){
    var isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    toggle.setAttribute('aria-pressed', String(isDark));
  }
  applyState();

  toggle.addEventListener('click', function(){
    var isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    if(isDark){
      document.documentElement.removeAttribute('data-theme');
    } else {
      document.documentElement.setAttribute('data-theme', 'dark');
    }
    try{ localStorage.setItem('stg-theme', isDark ? 'light' : 'dark'); }catch(e){}
    applyState();
  });
})();

(function(){
  var btn = document.getElementById('mobileMenuToggle');
  var nav = document.querySelector('nav.top-links');
  if(!btn || !nav) return;
  btn.addEventListener('click', function(){
    nav.classList.toggle('open');
    btn.setAttribute('aria-expanded', nav.classList.contains('open'));
  });
})();