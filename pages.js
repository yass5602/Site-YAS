/* Comportements communs aux pages secondaires (Sites web, CGU/CGV).
   La page d'accueil garde son propre script, qui gère aussi la version arabe. */

/* ---------- THÈME ---------- */
function applyTheme(t){
  document.documentElement.setAttribute('data-theme', t);
  try { localStorage.setItem('yas-theme', t); } catch(e){}
}
function toggleTheme(){
  applyTheme(document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark');
}

/* ---------- MENU MOBILE ---------- */
function toggleMenu(){ document.getElementById('nav').classList.toggle('open'); }
document.addEventListener('click', function(e){
  if (e.target.closest('#nav-links a')) document.getElementById('nav').classList.remove('open');
});

/* ---------- NAV AU SCROLL ---------- */
window.addEventListener('scroll', function(){
  document.getElementById('nav').classList.toggle('scrolled', window.scrollY > 20);
}, {passive:true});

/* ---------- APPARITION AU SCROLL ---------- */
(function(){
  if (!('IntersectionObserver' in window)) return;
  var io = new IntersectionObserver(function(entries){
    entries.forEach(function(en){ if (en.isIntersecting){ en.target.classList.add('in'); io.unobserve(en.target); } });
  }, {threshold: 0.12});
  document.querySelectorAll('.site-card,.service-card,.pack-card,.section-head,.about-layout').forEach(function(el){
    el.classList.add('reveal'); io.observe(el);
  });
})();

/* ---------- OFFRE CHOISIE → contact prérempli ----------
   Chaque bouton porte data-pack="Nom de l'offre". */
document.addEventListener('click', function(e){
  var b = e.target.closest('[data-pack]');
  if (!b) return;
  var name = b.getAttribute('data-pack');
  var line = document.getElementById('contact-pack');
  var mail = document.getElementById('contact-mail');
  var wa = document.getElementById('contact-wa');
  if (line) { line.textContent = 'Offre choisie : ' + name; line.hidden = false; }
  if (mail) mail.href = 'mailto:yas-motion@outlook.fr?subject=' + encodeURIComponent('Site web — offre ' + name);
  if (wa) wa.href = 'https://wa.me/213542927828?text=' + encodeURIComponent('Bonjour Yasin, je suis intéressé par l\'offre ' + name + ' pour mon site.');
});

/* ---------- CTA COLLANT (mobile) ----------
   Renvoie aux offres, puis au contact une fois les offres passées ;
   caché en haut de page, menu ouvert, ou quand le contact est visible. */
(function(){
  var bar = document.getElementById('sticky-cta');
  if (!bar) return;
  var btn = document.getElementById('sticky-btn');
  var offers = document.getElementById(bar.getAttribute('data-offers'));
  var contact = document.getElementById('contact');
  var first = btn.textContent, second = bar.getAttribute('data-second');
  var contactVisible = false, menuOpen = false;
  function render(){
    var past = offers && offers.getBoundingClientRect().top < 0;
    btn.setAttribute('href', past ? '#contact' : '#' + offers.id);
    btn.textContent = past ? second : first;
    bar.classList.toggle('is-hidden', contactVisible || menuOpen || window.scrollY < 240);
  }
  if (contact && 'IntersectionObserver' in window) {
    new IntersectionObserver(function(en){ contactVisible = en[0].isIntersecting; render(); }, {threshold: 0.15}).observe(contact);
  }
  window.addEventListener('scroll', render, {passive:true});
  new MutationObserver(function(){ menuOpen = document.getElementById('nav').classList.contains('open'); render(); })
    .observe(document.getElementById('nav'), {attributes:true, attributeFilter:['class']});
  render();
})();
