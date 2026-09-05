const premiumBtn = document.getElementById('premiumBtn');
const premiumModal = document.getElementById('premiumModal');
const closeModal = document.querySelector('.closeModal');
const buyBtns = document.querySelectorAll('.buyBtn');

premiumBtn.addEventListener('click', () => premiumModal.classList.remove('hidden'));
closeModal.addEventListener('click', () => premiumModal.classList.add('hidden'));

buyBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('*').forEach(el => {
      el.style.boxShadow = '0 0 15px var(--gold)';
    });
    alert("Premium Activated (Mock)");
  });
});
