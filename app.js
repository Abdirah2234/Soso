// Simple auth using localStorage (demo only)
const modal = document.getElementById('modal');
const openRegister = document.getElementById('openRegister');
const joinBtn = document.getElementById('joinBtn');
const loginBtn = document.getElementById('loginBtn');
const closeModal = document.getElementById('closeModal');
const tabs = document.querySelectorAll('.tab');
const forms = document.querySelectorAll('.form');
const authMsg = document.getElementById('authMsg');

function showModal(target='register'){
  modal.classList.remove('hidden');
  setTab(target);
}
function hideModal(){
  modal.classList.add('hidden'); authMsg.textContent='';
}
openRegister.onclick = () => showModal('register');
joinBtn.onclick = () => showModal('register');
loginBtn.onclick = () => showModal('login');
closeModal.onclick = hideModal;
modal.addEventListener('click', (e)=>{ if(e.target===modal) hideModal(); });

tabs.forEach(t=>{
  t.addEventListener('click', ()=> setTab(t.dataset.target));
});
function setTab(name){
  tabs.forEach(t=> t.classList.toggle('active', t.dataset.target===name));
  forms.forEach(f=> f.classList.toggle('active', f.id===name));
  authMsg.textContent='';
}

/* Registration */
document.getElementById('register').addEventListener('submit', function(e){
  e.preventDefault();
  const name = document.getElementById('regName').value.trim();
  const email = document.getElementById('regEmail').value.trim().toLowerCase();
  const pass = document.getElementById('regPass').value;
  if(!name||!email||!pass){ authMsg.style.color=''; authMsg.textContent='Please fill all fields.'; return; }
  const users = JSON.parse(localStorage.getItem('xm_users')||'[]');
  if(users.find(u=>u.email===email)){ authMsg.style.color=''; authMsg.textContent='Email already registered.'; return; }
  users.push({name,email,pass,created:new Date().toISOString()});
  localStorage.setItem('xm_users', JSON.stringify(users));
  authMsg.style.color = 'lightgreen';
  authMsg.textContent = 'Registered! You can login now.';
  // auto-switch to login
  setTimeout(()=>{ setTab('login'); authMsg.style.color=''; }, 900);
});

/* Login */
document.getElementById('login').addEventListener('submit', function(e){
  e.preventDefault();
  const email = document.getElementById('loginEmail').value.trim().toLowerCase();
  const pass = document.getElementById('loginPass').value;
  const users = JSON.parse(localStorage.getItem('xm_users')||'[]');
  const u = users.find(x=> x.email===email && x.pass===pass);
  if(!u){ authMsg.style.color=''; authMsg.textContent='Invalid credentials.'; return; }
  // Save session
  localStorage.setItem('xm_session', JSON.stringify({email:u.email,name:u.name,loginAt:new Date().toISOString()}));
  authMsg.style.color='lightgreen';
  authMsg.textContent='Login successful!';
  updateHeader();
  setTimeout(()=> hideModal(),700);
});

/* Header update - show user if logged in */
function updateHeader(){
  const session = JSON.parse(localStorage.getItem('xm_session')||'null');
  const actions = document.querySelector('.actions');
  if(session){
    actions.innerHTML = `<div class="user">Hi, ${escapeHtml(session.name)}</div>
      <button id="logoutBtn" class="btn outline">Logout</button>`;
    document.getElementById('logoutBtn').addEventListener('click', ()=> {
      localStorage.removeItem('xm_session');
      updateHeader();
    });
  } else {
    actions.innerHTML = `<button id="loginBtn" class="btn outline">Login</button>
      <button id="joinBtn" class="btn primary">Join Now</button>`;
    document.getElementById('loginBtn').addEventListener('click', ()=> showModal('login'));
    document.getElementById('joinBtn').addEventListener('click', ()=> showModal('register'));
  }
}
function escapeHtml(s){ return s.replace(/[&<>"']/g, c=>({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":"&#39;"}[c])); }

updateHeader();
