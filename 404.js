// ==========================================================
// Stackly — 404 Page interactions
// ==========================================================

document.addEventListener('DOMContentLoaded', () => {

  /* ---------- Entrance reveal (staggered) ---------- */
  const revealEls = document.querySelectorAll('.reveal');
  revealEls.forEach((el, i) => {
    setTimeout(() => el.classList.add('in-view'), 120 + i * 90);
  });

  /* ---------- Go Back button ---------- */
  const goBackBtn = document.getElementById('goBackBtn');
  if (goBackBtn) {
    goBackBtn.addEventListener('click', () => {
      // If there's real history to go back to, use it; otherwise fall back home
      if (window.history.length > 1) {
        window.history.back();
      } else {
        window.location.href = 'index.html';
      }
    });
  }

});