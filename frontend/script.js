/***********************
 * API TEMEL AYARLARI  *
 ***********************/
const API_BASE = "http://127.0.0.1:8000/api";

/* Token tutma */
function getToken() { return localStorage.getItem("access_token") || ""; }
function setToken(t) { localStorage.setItem("access_token", t); }
function clearToken() { localStorage.removeItem("access_token"); }

/* Genel amaçlı fetch (Authorization otomatik ekler) */
async function api(path, { method = "GET", headers = {}, body } = {}) {
  const token = getToken();
  const finalHeaders = { "Content-Type": "application/json", ...headers };
  if (token) finalHeaders["Authorization"] = "Bearer " + token;

  const res = await fetch(API_BASE + path, {
    method,
    headers: finalHeaders,
    body: body ? JSON.stringify(body) : undefined,
  });

  let data = null;
  try { data = await res.json(); } catch (_) {}

  if (!res.ok) {
    const msg = (data && (data.detail || data.error)) || res.statusText;
    throw new Error(msg || ("İstek başarısız: " + res.status));
  }
  return data;
}

/***********************
 * AUTH (LOGIN / ME)   *
 ***********************/
const auth = {
  user: null,

  async login(username, password) {
    const tokens = await api("/auth/login/", { method: "POST", body: { username, password } });
    setToken(tokens.access);
    const me = await api("/kullanicilar/me/");
    this.user = me;
    // Eğer sayfanda global bir updateNavbar() varsa çağır, yoksa geç
    if (typeof window.updateNavbar === "function") window.updateNavbar();
    updateAuthBadges(); // varsa #auth-username alanını güncelle
    return me;
  },

  async loadMeIfToken() {
    const t = getToken();
    if (!t) { updateAuthBadges(); return null; }
    try {
      const me = await api("/kullanicilar/me/");
      this.user = me;
    } catch {
      clearToken();
      this.user = null;
    }
    if (typeof window.updateNavbar === "function") window.updateNavbar();
    updateAuthBadges();
    return this.user;
  },

  logout() {
    clearToken();
    this.user = null;
    if (typeof window.updateNavbar === "function") window.updateNavbar();
    updateAuthBadges();
  }
};

/* Basit login/çıkış UI kancası (opsiyonel) */
function updateAuthBadges() {
  const u = auth.user;
  const nameSpans = document.querySelectorAll("[data-auth-username], #auth-username");
  nameSpans.forEach(s => s.textContent = u ? (u.username || u.email || "kullanıcı") : "");
  const loginBtns = document.querySelectorAll("[data-action='login']");
  const logoutBtns = document.querySelectorAll("[data-action='logout']");
  loginBtns.forEach(b => b.style.display = u ? "none" : "");
  logoutBtns.forEach(b => b.style.display = u ? "" : "none");
}

/* Giriş prompt’u (istenirse kullan) */
async function promptLoginFlow() {
  const u = prompt("Kullanıcı adı:");
  const p = prompt("Şifre:");
  if (!u || !p) return;
  try {
    await auth.login(u, p);
    alert("Giriş başarılı!");
  } catch (e) {
    alert("Giriş hatası: " + e.message);
  }
}

/****************************************
 * ÜYELİK (KULÜBE KATIL / AYRIL)       *
 ****************************************/
async function joinClub(clubId) {
  try {
    await api("/uyelikler/", { method: "POST", body: { kulup: clubId } });
    toast("Kulübe katıldın.");
    // Kulüpler sayfasında butonu “Katıldın” yap
    const btn = document.querySelector(`[data-club-id="${clubId}"].btn-join, [data-join-club="${clubId}"]`);
    if (btn) {
      btn.textContent = "Katıldın";
      btn.disabled = true;
      btn.classList.add("joined");
    }
    // Profil sayfasında “katıldığım kulüpler”i tazele
    loadMyClubsIfNeeded();
  } catch (e) {
    if (String(e.message).includes("Unauthorized") || String(e.message).includes("401")) {
      const go = confirm("Katılmak için giriş yapmalısın. Giriş penceresini açayım mı?");
      if (go) await promptLoginFlow();
    } else {
      alert("Katılma hatası: " + e.message);
    }
  }
}

async function leaveClubByClubId(clubId) {
  try {
    await api(`/uyelikler/leave/${clubId}/`, { method: "DELETE" });
    toast("Kulüpten ayrıldın.");
    // Butonu geri aktif et
    const btn = document.querySelector(`[data-club-id="${clubId}"].btn-join, [data-join-club="${clubId}"]`);
    if (btn) {
      btn.textContent = "Katıl";
      btn.disabled = false;
      btn.classList.remove("joined");
    }
    loadMyClubsIfNeeded();
  } catch (e) {
    if (String(e.message).includes("Unauthorized") || String(e.message).includes("401")) {
      const go = confirm("Ayrılmak için giriş yapmalısın. Giriş penceresini açayım mı?");
      if (go) await promptLoginFlow();
    } else {
      alert("Ayrılma hatası: " + e.message);
    }
  }
}

/****************************************
 * KULÜPLER SAYFASI (opsiyonel render)  *
 ****************************************/
/* Mevcut HTML’ini BOZMADAN iki şekilde çalışır:
   1) Eğer sayfanda hazır kulüp kartları ve “Katıl” butonları varsa:
      - Butonlara class="btn-join" ve data-club-id="<id>" ver → click handler bağlanır.
   2) Eğer boş bir konteynerin varsa (id="clubs-container"):
      - Listeyi API’den çekip biz render ederiz. */

function attachJoinHandlersIfAny() {
  document.querySelectorAll(".btn-join[data-club-id], [data-join-club]").forEach(btn => {
    const clubId = btn.getAttribute("data-club-id") || btn.getAttribute("data-join-club");
    btn.addEventListener("click", () => joinClub(parseInt(clubId, 10)));
  });
}

async function loadClubsIfContainer() {
  const container = document.getElementById("clubs-container");
  if (!container) return; // Sen manuel render ediyorsan elleme

  container.innerHTML = `<div class="loading">Kulüpler yükleniyor...</div>`;
  try {
    const items = await api("/kulupler/");
    if (!Array.isArray(items) || items.length === 0) {
      container.innerHTML = `<p>Hiç kulüp bulunamadı.</p>`;
      return;
    }
    container.innerHTML = "";
    items.forEach(k => {
      const card = document.createElement("div");
      card.className = "club-card";
      card.innerHTML = `
        <div class="club-title">${k.ad}</div>
        <div class="club-meta">${k.kategori || ""}</div>
        <div class="club-desc">${k.aciklama || ""}</div>
        <button class="btn btn-join" data-club-id="${k.id}">Katıl</button>
      `;
      container.appendChild(card);
    });
    attachJoinHandlersIfAny();
  } catch (e) {
    container.innerHTML = `<p>Hata: ${e.message}</p>`;
  }
}

/****************************************
 * PROFİL SAYFASI (me + kulüplerim)     *
 ****************************************/
/* Mevcut HTML’ini BOZMADAN çalışır:
   - Eğer #profile-username, #profile-email, #profile-name vs. varsa doldurur.
   - Eğer #my-clubs-container varsa katıldığım kulüpleri listeler. */

async function loadProfileIfContainer() {
  const hasAnyProfileField = document.getElementById("profile-username")
    || document.getElementById("profile-email")
    || document.getElementById("profile-name");
  const myClubsEl = document.getElementById("my-clubs-container");

  // Hiç profil alanı yoksa ve myClubs da yoksa dokunma
  if (!hasAnyProfileField && !myClubsEl) return;

  // Giriş yapılmamışsa önce dene
  const me = await auth.loadMeIfToken();
  if (!me) {
    // Profil alanları varsa “giriş yapın” demesi için basit mesaj
    if (hasAnyProfileField) {
      const warn = document.getElementById("profile-warn");
      if (warn) warn.textContent = "Profil bilgileri için lütfen giriş yapın.";
    }
    return;
  }

  // Profil alanlarını doldur
  const u = auth.user || me;
  const usernameEl = document.getElementById("profile-username");
  const emailEl = document.getElementById("profile-email");
  const nameEl = document.getElementById("profile-name");
  if (usernameEl) usernameEl.textContent = u.username || "";
  if (emailEl) emailEl.textContent = u.email || "";
  if (nameEl) nameEl.textContent = [(u.first_name || ""), (u.last_name || "")].filter(Boolean).join(" ");

  // Katıldığım kulüpler
  if (myClubsEl) {
    myClubsEl.innerHTML = `<div class="loading">Kulüpleriniz yükleniyor...</div>`;
    try {
      const list = await api("/kullanicilar/me/kulupler/");
      if (!Array.isArray(list) || list.length === 0) {
        myClubsEl.innerHTML = `<p>Henüz bir kulübe katılmadınız.</p>`;
        return;
      }
      myClubsEl.innerHTML = "";
      list.forEach(m => {
        const row = document.createElement("div");
        row.className = "my-club-item";
        row.innerHTML = `
          <span class="my-club-name">${m.kulup_adi || ("Kulüp #" + m.kulup)}</span>
          <button class="btn btn-outline" data-leave-club="${m.kulup}">Ayrıl</button>
        `;
        myClubsEl.appendChild(row);
      });
      // Ayrıl butonları
      myClubsEl.querySelectorAll("[data-leave-club]").forEach(btn => {
        const cid = parseInt(btn.getAttribute("data-leave-club"), 10);
        btn.addEventListener("click", () => leaveClubByClubId(cid));
      });
    } catch (e) {
      myClubsEl.innerHTML = `<p>Hata: ${e.message}</p>`;
    }
  }
}

/****************************************
 * DASHBOARD (opsiyonel)                *
 ****************************************/
/* Index’te mevcut statik içeriğine DOKUNMAZ.
   Sadece #events-container veya #announcements-container varsa doldurur. */

function createEtkinlikCard(evt) {
  const card = document.createElement("div");
  card.className = "card event-card";
  card.innerHTML = `
    <div class="card-title">${evt.baslik || evt.name || "Etkinlik"}</div>
    <div class="card-meta">${formatDate(evt.tarih || evt.date)}</div>
    <div class="card-desc">${evt.aciklama || evt.description || ""}</div>
  `;
  return card;
}
function createDuyuruCard(a) {
  const card = document.createElement("div");
  card.className = "card announcement-card";
  card.innerHTML = `
    <div class="card-title">${a.baslik || a.title || "Duyuru"}</div>
    <div class="card-meta">${formatDate(a.yayin_tarihi || a.date)}</div>
    <div class="card-desc">${a.icerik || a.description || ""}</div>
  `;
  return card;
}
function formatDate(isoOrYmd) {
  if (!isoOrYmd) return "";
  try {
    const d = new Date(isoOrYmd);
    const opts = { year: "numeric", month: "long", day: "numeric", hour: "2-digit", minute: "2-digit" };
    return d.toLocaleString("tr-TR", opts);
  } catch { return isoOrYmd; }
}
async function loadDashboardIfContainers() {
  const eventsContainer = document.getElementById("events-container");
  if (eventsContainer) {
    try {
      const etkinlikler = await api("/etkinlikler/");
      // Mevcut statikleri silmek istemiyorsan, “append” yerine “after” da kullanabilirsin.
      etkinlikler.forEach(e => eventsContainer.appendChild(createEtkinlikCard(e)));
    } catch (_) { /* erişilemezse sessiz geç */ }
  }
  const announcementsContainer = document.getElementById("announcements-container");
  if (announcementsContainer) {
    try {
      const duyurular = await api("/duyurular/");
      duyurular.forEach(a => announcementsContainer.appendChild(createDuyuruCard(a)));
    } catch (_) { /* erişilemezse sessiz geç */ }
  }
}

/***********************
 * UTIL: Küçük toast   *
 ***********************/
function toast(msg) {
  if (!msg) return;
  // Basit alert yeterli; istersen burada ufak bir toast kutusu yapabilirsin
  console.log("[INFO]", msg);
}

/***********************
 * ENTRY POINT         *
 ***********************/
document.addEventListener("DOMContentLoaded", async () => {
  // Sayfa açılışında varsa token’la me çek
  await auth.loadMeIfToken();

  // 1) (Opsiyonel) Kulüpler listesi konteynerin varsa doldur
  await loadClubsIfContainer();

  // 2) (Opsiyonel) Profil sayfasında me + kulüplerim
  await loadProfileIfContainer();

  // 3) (Opsiyonel) Dashboard konteynerlerin varsa doldur (statikleri bozmaz)
  await loadDashboardIfContainers();

  // 4) Eğer sayfanda butonlara class="btn-join" ve data-club-id="<id>" verdiysen handler bağla
  attachJoinHandlersIfAny();

  // 5) (Opsiyonel) Login/Logout butonlarını bağlamak istersen:
  document.querySelectorAll("[data-action='login']").forEach(b => b.addEventListener("click", promptLoginFlow));
  document.querySelectorAll("[data-action='logout']").forEach(b => b.addEventListener("click", () => auth.logout()));
});
