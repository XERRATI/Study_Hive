/* Study Hive  -  file 26: mobile-polish-pack-cleaner-phone-layout
   Extracted from the original single-file build.
   LOAD ORDER MATTERS: files run in numeric-prefix order.
*/

(function(){
  function isPhoneLike(){
    return window.innerWidth <= 780 || document.body.classList.contains('force-mobile') || document.body.classList.contains('is-mobile');
  }
  function polishMobile(){
    document.body.classList.toggle('mobile-polished', isPhoneLike());
    if (!isPhoneLike()) return;
    var top = document.getElementById('mobileTopBar');
    var dock = document.getElementById('mobileDockBar');
    if (top) top.setAttribute('aria-label','Top study tools');
    if (dock) dock.setAttribute('aria-label','More study tools');
    // Keep open panels above bottom rail.
    document.querySelectorAll('.misc-panel.show,.focus-panel.show,.grade-panel.show,.todo-panel.show,.breathing-panel.show').forEach(function(p){
      p.style.bottom = 'calc(86px + env(safe-area-inset-bottom))';
    });
  }
  window.addEventListener('resize', polishMobile);
  window.addEventListener('orientationchange', function(){ setTimeout(polishMobile, 200); });
  setInterval(polishMobile, 1200);
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', polishMobile); else polishMobile();
})();
