const navbar = document.getElementById('navbar');

navbar.innerHTML = `
<nav class="navbar">
    <a href="index.html">Ana Sayfa</a>
    <a href="pages/kulupler.html">Kulüpler</a>
    <a href="pages/etkinlikler.html">Etkinlikler</a>
    <a href="pages/duyurular.html">Duyurular</a>
    <a href="pages/profil.html">Profil</a>
</nav>
`;

const style = document.createElement('style');
style.innerHTML = `
.navbar {
    display: flex;
    gap: 15px;
    background: #333;
    color: white;
    padding: 10px 20px;
}
.navbar a {
    color: white;
    text-decoration: none;
}
.navbar a:hover {
    text-decoration: underline;
}
`;
document.head.appendChild(style);
