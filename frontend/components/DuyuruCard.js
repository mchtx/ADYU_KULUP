// components/DuyuruCard.js
function createDuyuruCard(duyuru) {
    const card = document.createElement('div');
    card.className = 'announcement-card';

    const publishDate = new Date(duyuru.date).toLocaleString('tr-TR', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });

    card.innerHTML = `
        <h3>${duyuru.title}</h3>
        <p><strong>Kulüp:</strong> ${duyuru.club}</p>
        <p>${duyuru.description || 'Açıklama bulunmamaktadır.'}</p>
        <p><small>Yayın Tarihi: ${publishDate}</small></p>
    `;

    return card;
}
