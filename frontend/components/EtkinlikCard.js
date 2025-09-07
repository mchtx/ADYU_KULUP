// components/EtkinlikCard.js
function createEtkinlikCard(etkinlik) {
    const card = document.createElement('div');
    card.className = 'event-card';

    const eventDate = new Date(etkinlik.date).toLocaleString('tr-TR', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });

    card.innerHTML = `
        <h3>${etkinlik.title}</h3>
        <p><strong>Kulüp:</strong> ${etkinlik.club}</p>
        <p><strong>Tarih:</strong> ${eventDate}</p>
        <p>${etkinlik.description || 'Açıklama bulunmamaktadır.'}</p>
    `;

    return card;
}
