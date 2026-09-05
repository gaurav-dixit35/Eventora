const user = JSON.parse(localStorage.getItem('eventoraUser'));

if (user) {
  document.getElementById('userStatus').style.display = 'none';
  document.getElementById('userAvatar').classList.remove('hidden');
  document.getElementById('userInitial').innerText = user.name[0].toUpperCase();
} else {
  document.getElementById('userStatus').innerText = "Login";
}

document.getElementById('userAvatar').addEventListener('click', () => {
  document.getElementById('logoutPopup').classList.toggle('hidden');
});
document.getElementById('logoutPopup').addEventListener('click', () => {
  localStorage.removeItem('eventoraUser');
  location.reload();
});
