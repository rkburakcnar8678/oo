# Yönetici (Admin) Kılavuzu

Uygulamanın yönetimsel işlemlerini (Bildirim gönderme, kullanıcıları görme, resimleri yönetme) Supabase paneli üzerinden yapabilirsiniz.

## 1. Bildirim Gönderme
Kullanıcılara "Bildirimler" sayfasında görünecek mesajlar göndermek için:

1.  **Supabase Dashboard**'a gidin.
2.  Sol menüden **Table Editor** (Tablo Düzenleyici) ikonuna tıklayın.
3.  **`notifications`** tablosunu seçin.
4.  **Insert row** (Satır ekle) butonuna tıklayın.
5.  Aşağıdaki alanları doldurun:
    *   **title**: Bildirim başlığı (Örn: "Sistem Bakımı", "Hoş Geldiniz")
    *   **message**: Bildirim içeriği.
    *   **type**: Bildirimin rengini belirler. Şunlardan birini yazın:
        *   `admin` (Kırmızı - Önemli duyurular için)
        *   `info` (Mavi - Genel bilgi)
        *   `success` (Yeşil - Tebrik/Başarı)
        *   `warning` (Turuncu - Uyarı)
    *   **is_read**: `false` olarak bırakın.
6.  **Save** butonuna basın. Bildirim anında tüm kullanıcıların uygulamasında görünecektir.

## 2. Soru Resimlerini Görme
Kullanıcıların yüklediği soru fotoğraflarını görmek için:

1.  Supabase Dashboard'da sol menüden **Storage** ikonuna tıklayın.
2.  **`question-images`** klasörünü (bucket) açın.
3.  Burada kullanıcıların ID'lerine göre klasörlenmiş resimleri görebilir, indirebilir veya silebilirsiniz.

## 3. Kullanıcı Yönetimi
Kayıtlı kullanıcıları görmek için:
*   Sol menüden **Authentication** -> **Users** kısmına gidin.

## 4. Sınav Türü Değiştirme (Manuel)
Bir kullanıcının sınav türünü (YKS, LGS vb.) değiştirmek isterseniz:
1.  **Table Editor** -> **`profiles`** tablosuna gidin.
2.  İlgili kullanıcının `exam_type` sütununu düzenleyin.
