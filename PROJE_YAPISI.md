# 📂 Proje Yapısı ve Dosya Rehberi

Bu dosya, projenin klasör yapısını ve hangi dosyanın ne işe yaradığını anlamanız için hazırlanmıştır.

## 🏗 Ana Klasörler

- **`app/`**: Uygulamanın tüm sayfaları ve yönlendirme (routing) yapısı buradadır.
- **`components/`**: Tekrar kullanılabilir küçük parçalar (şu an aktif değil, sayfalar içine gömülü).
- **`context/`**: Uygulamanın genel durum yönetimi (Oturum, Tema).
- **`lib/`**: Yardımcı kütüphaneler ve bağlantılar (Supabase).
- **`assets/`**: Resim, font gibi statik dosyalar.

---

## 📄 Dosya Detayları

### 1. ⚙️ Temel Ayarlar
- **`app/_layout.tsx`**: Uygulamanın **Giriş Kapısıdır**. Fontları yükler, Temayı başlatır ve Kullanıcının giriş yapıp yapmadığını kontrol edip yönlendirir.
- **`babel.config.js`**: Animasyonların çalışması için gerekli ayar dosyasıdır.
- **`lib/supabase.ts`**: Veritabanı bağlantısını sağlayan dosya.

### 2. 🔐 Kimlik Doğrulama (Auth)
_Klasör: `app/(auth)/`_
- **`sign-in.tsx`**: Giriş Yap ekranı.
- **`sign-up.tsx`**: Kayıt Ol ekranı.
- **`forgot-password.tsx`**: Şifremi Unuttum ekranı.

### 3. 📱 Ana Uygulama (App)
_Klasör: `app/(app)/`_
- **`_layout.tsx`**: Alt menü (Tab Bar) ayarları burada yapılır. Menü ikonları ve isimleri buradan değişir.
- **`index.tsx`**: **Ana Sayfa**. Pomodoro sayacı, Haftalık Performans ve Son Çalışılan dersler buradadır.
- **`questions.tsx`**: **Sorular Sayfası**. Soru sorma, listeleme ve filtreleme işlemleri.
- **`notifications.tsx`**: **Bildirimler Sayfası**.
- **`profile.tsx`**: **Profil Sayfası**. Hedefim, grafikler ve istatistikler.
- **`tools.tsx`**: **Araçlar Menüsü**. Araçların listelendiği ızgara menü.
- **`exam-selection.tsx`**: Sınav Türü Seçim ekranı (Sadece ilk kayıtta veya eksikse çıkar).
- **`dashboard.tsx`**: (Eski dashboard, şu an `index.tsx` kullanılıyor ama yönlendirme için yedek).

### 4. 🛠 Araçlar (Tools)
_Klasör: `app/tools/`_
Bu klasör, "Araçlar" menüsündeki alt sayfaları barındırır.
- **`notes.tsx`**: Not Defterim.
- **`topics.tsx`**: Konu Takibim (Tik atma listesi).
- **`trials.tsx`**: Denemelerim (Net grafiği).
- **`drawing.tsx`**: Çizim Sayfam (Karalama tahtası).
- **`cards.tsx`**: Bilgi Kartları (Çevirmeli kartlar).
- **`videos.tsx`**: Video Çözümler (Yayınevi linkleri).
- **`preference.tsx`**: Tercih Sihirbazı (Web tarayıcı açar).

### 5. 🧠 Durum Yönetimi (Context)
- **`context/AuthContext.tsx`**: Kullanıcının giriş yapıp yapmadığını, profil bilgilerini tutar.
- **`context/ThemeContext.tsx`**: Uygulamanın Gece/Gündüz modunu yönetir.

---

## 🚀 Nasıl Değişiklik Yapılır?

- **Menü İkonunu Değiştirmek İçin:** `app/(app)/_layout.tsx` dosyasına gidin.
- **Ana Sayfa Düzenini Değiştirmek İçin:** `app/(app)/index.tsx` dosyasını düzenleyin.
- **Yeni Bir Araç Eklemek İçin:**
  1. `app/tools/` içine yeni dosya oluşturun (örn: `yeni-arac.tsx`).
  2. `app/tools/_layout.tsx` dosyasına bu sayfayı tanıtın.
  3. `app/(app)/tools.tsx` dosyasındaki listeye bu aracı ekleyin.
