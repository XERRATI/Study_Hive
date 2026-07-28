/* Study Hive  -  file 02: startup-animation
   Extracted from the original single-file build.
   LOAD ORDER MATTERS: files run in numeric-prefix order.
*/

(function(){
  document.addEventListener('DOMContentLoaded', function(){
    requestAnimationFrame(function(){ document.body.classList.add('app-ready'); });
    setTimeout(function(){
      document.body.classList.remove('startup-soft');
      document.body.classList.remove('app-ready');
      var glow = document.getElementById('startupHoneyGlow');
      if (glow) glow.remove();
    }, 1900);
  });
})();
