// components/KulupCard.js
function createKulupCard(kulup) {
    const card = document.createElement('div');
    card.className = 'club-card';

    card.innerHTML = `
        <h3>${kulup.name}</h3>
        <p><strong>Kategori:</strong> ${kulup.category}</p>
        <p>${kulup.description || 'Açıklama bulunmamaktadır.'}</p>
        <p><strong>Yönetici:</strong> ${kulup.manager}</p>
        <button class="join-btn" data-id="${kulup.id}">Katıl</button>
    `;

    const joinBtn = card.querySelector('.join-btn');
    joinBtn.addEventListener('click', () => {
        alert(`${kulup.name} kulübüne katıldınız!`);
        // Backend'e POST isteği eklenebilir
        // fetch(`/api/kulupler/${kulup.id}/join/`, { method: 'POST' })
    });

    return card;
}
