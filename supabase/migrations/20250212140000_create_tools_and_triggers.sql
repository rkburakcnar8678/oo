/*
  # Araçlar ve Bildirim Sistemi Kurulumu

  ## Tablolar
  1. notes: Kullanıcı notları
  2. trials: Deneme sınavı sonuçları
  3. topic_progress: Konu takip ilerlemesi
  4. comments: Sorulara yapılan yorumlar (Bildirim tetiklemek için)

  ## Otomasyon (Triggers)
  - Yorum yapıldığında soru sahibine otomatik bildirim gönderir.
*/

-- 1. NOTLAR TABLOSU
CREATE TABLE IF NOT EXISTS public.notes (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    title TEXT NOT NULL,
    content TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);
ALTER TABLE public.notes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Kullanıcılar kendi notlarını görebilir" ON public.notes FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Kullanıcılar not ekleyebilir" ON public.notes FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Kullanıcılar not silebilir" ON public.notes FOR DELETE USING (auth.uid() = user_id);

-- 2. DENEMELER TABLOSU
CREATE TABLE IF NOT EXISTS public.trials (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    name TEXT NOT NULL, -- Örn: 3D Yayınları TYT-1
    net_score NUMERIC(5, 2) NOT NULL, -- Örn: 72.50
    exam_type TEXT, -- TYT, AYT, KPSS vb.
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);
ALTER TABLE public.trials ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Kullanıcılar kendi denemelerini görebilir" ON public.trials FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Kullanıcılar deneme ekleyebilir" ON public.trials FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Kullanıcılar deneme silebilir" ON public.trials FOR DELETE USING (auth.uid() = user_id);

-- 3. KONU TAKİP TABLOSU
CREATE TABLE IF NOT EXISTS public.topic_progress (
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    topic_id TEXT NOT NULL, -- Örn: math_1 (Frontend'deki ID ile eşleşmeli)
    is_completed BOOLEAN DEFAULT FALSE,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    PRIMARY KEY (user_id, topic_id)
);
ALTER TABLE public.topic_progress ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Kullanıcılar ilerlemelerini görebilir" ON public.topic_progress FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Kullanıcılar ilerlemelerini güncelleyebilir" ON public.topic_progress FOR ALL USING (auth.uid() = user_id);

-- 4. YORUMLAR TABLOSU (Bildirim Tetiklemek İçin)
CREATE TABLE IF NOT EXISTS public.comments (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    question_id UUID REFERENCES public.questions(id) ON DELETE CASCADE NOT NULL,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);
ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Herkes yorumları görebilir" ON public.comments FOR SELECT USING (true);
CREATE POLICY "Giriş yapanlar yorum atabilir" ON public.comments FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- 5. BİLDİRİM SİSTEMİ GÜNCELLEMESİ
-- Notifications tablosuna hedef kitle ekleyelim (YKS, KPSS vb. öğrencilere özel bildirim için)
ALTER TABLE public.notifications ADD COLUMN IF NOT EXISTS target_exam TEXT; 
ALTER TABLE public.notifications ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id); -- Özel bildirimler için

-- OTOMATİK BİLDİRİM FONKSİYONU
CREATE OR REPLACE FUNCTION public.handle_new_comment()
RETURNS TRIGGER AS $$
BEGIN
    -- Soruyu soran kişiyi bul
    DECLARE
        question_owner_id UUID;
        commenter_name TEXT;
    BEGIN
        SELECT user_id INTO question_owner_id FROM public.questions WHERE id = NEW.question_id;
        
        -- Kendi sorusuna yorum yaptıysa bildirim gönderme
        IF question_owner_id != NEW.user_id THEN
            -- Yorum yapanın adını al (Opsiyonel, şimdilik sabit metin)
            
            INSERT INTO public.notifications (user_id, title, message, type)
            VALUES (
                question_owner_id,
                'Yeni Yorum Var! 💬',
                'Soruna yeni bir cevap yazıldı. Hemen kontrol et!',
                'info'
            );
        END IF;
    END;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- TETİKLEYİCİYİ OLUŞTUR
DROP TRIGGER IF EXISTS on_comment_added ON public.comments;
CREATE TRIGGER on_comment_added
AFTER INSERT ON public.comments
FOR EACH ROW EXECUTE FUNCTION public.handle_new_comment();
