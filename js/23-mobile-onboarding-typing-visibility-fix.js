/* Study Hive  -  file 23: mobile-onboarding-typing-visibility-fix
   Extracted from the original single-file build.
   LOAD ORDER MATTERS: files run in numeric-prefix order.
*/

(function(){
  function isOnboardField(el){
    return !!(el && el.closest && el.closest('.onboard-card'));
  }
  function scrollFieldIntoView(el){
    if (!isOnboardField(el)) return;
    var veil = document.getElementById('onboardVeil');
    if (veil) veil.classList.add('keyboard-open');
    setTimeout(function(){
      try { el.scrollIntoView({ block: 'center', inline: 'nearest', behavior: 'smooth' }); }
      catch(e) { try { el.scrollIntoView(false); } catch(_) {} }
    }, 260);
  }
  document.addEventListener('focusin', function(e){ scrollFieldIntoView(e.target); }, true);
  document.addEventListener('focusout', function(e){
    if (!isOnboardField(e.target)) return;
    setTimeout(function(){
      var active = document.activeElement;
      if (!isOnboardField(active)) {
        var veil = document.getElementById('onboardVeil');
        if (veil) veil.classList.remove('keyboard-open');
      }
    }, 180);
  }, true);
  if (window.visualViewport) {
    window.visualViewport.addEventListener('resize', function(){
      var active = document.activeElement;
      if (isOnboardField(active)) scrollFieldIntoView(active);
    });
  }
})();
