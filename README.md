# ADYU_KULUP
Adıyaman Üniversitesi Kulüp ve Topluluk Yönetim Sistemi


Bu proje, Adıyaman Üniversitesi öğrenci kulüpleri, etkinlikleri ve duyurularını
tek bir platformda toplamak için geliştirilmiş web uygulamasıdır.

## Özellikler
- 🎓 Kulüplerin listelenmesi ve filtreleme
- 📅 Etkinliklerin takvim görünümünde gösterilmesi
- 📢 Duyuruların paylaşılması
- 👤 Üyelik sistemi (öğrenci, kulüp yöneticisi, admin rolleri)


## Kurulum
```bash
# Sanal ortam oluştur
python -m venv venv
.\venv\Scripts\activate  # Windows
source venv/bin/activate # Linux/Mac

# Gereklilikleri yükle
pip install -r requirements.txt

# Veritabanı migrate
python manage.py migrate




## Servisler
- `/api/kulupler/` → Kulüpler listesi
- `/api/etkinlikler/` → Etkinlikler listesi
- `/api/duyurular/` → Duyurular
 

# Sunucuyu başlat
python manage.py runserver
