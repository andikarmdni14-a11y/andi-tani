-- =====================================================================
-- ANDI TANI - DATA AWAL KATALOG (dari folder Drive "Andi tani aset")
-- Jalankan SETELAH 001_fase1_schema.sql.
--
-- Catatan:
-- - Harga rentang memakai harga terendah; rentang dicatat di deskripsi.
-- - Stok default 10 untuk semua produk, koreksi lewat dashboard admin.
-- - Deskripsi & panduan perawatan adalah DRAF, mohon diperiksa.
-- - Foto belum ada (image_url kosong); unggah lewat dashboard admin.
-- =====================================================================


-- =====================================================================
-- 1. PANDUAN PERAWATAN (DRAF)
-- =====================================================================
insert into public.care_guides
  (name, light_requirement, watering_frequency, fertilizer_type, difficulty_level)
values
  ('Tanaman Berbunga Outdoor',
   'Matahari penuh, minimal 6 jam sehari',
   'Setiap hari saat kemarau, kurangi saat musim hujan',
   'NPK 2-4 minggu sekali',
   'Mudah'),
  ('Miana',
   'Cahaya terang, teduh di siang terik agar warna daun tidak pudar',
   'Saat permukaan tanah mulai kering, jangan sampai tergenang',
   'NPK dosis ringan sebulan sekali',
   'Mudah'),
  ('Puring',
   'Matahari penuh agar warna daun makin cerah',
   '2-3 kali seminggu',
   'NPK sebulan sekali',
   'Mudah'),
  ('Tanaman Daun & Pagar Outdoor',
   'Matahari penuh hingga teduh sebagian',
   '1 kali sehari saat kemarau',
   'NPK sebulan sekali, pangkas rutin agar rimbun',
   'Mudah'),
  ('Aglaonema',
   'Cahaya terang tidak langsung, hindari matahari siang',
   'Saat media bagian atas kering, sekitar 2-3 kali seminggu',
   'NPK dosis ringan 2-4 minggu sekali',
   'Mudah'),
  ('Sirih Merah',
   'Teduh atau cahaya tidak langsung',
   'Jaga media tetap lembap, tidak becek',
   'Pupuk organik atau NPK dosis ringan sebulan sekali',
   'Sedang'),
  ('Buah & Cabai dalam Pot',
   'Matahari penuh, minimal 6 jam sehari',
   'Setiap hari, terutama saat cuaca panas',
   'NPK 2 minggu sekali',
   'Sedang'),
  ('Kunyit',
   'Teduh sebagian',
   'Jaga media tetap lembap, tidak tergenang',
   'Pupuk organik sebulan sekali',
   'Mudah');


-- =====================================================================
-- 2. PRODUK
-- Kolom file_foto hanya untuk panduan upload (tidak disimpan ke tabel).
-- =====================================================================
with data (name, kategori, price, plant_status, panduan, description, file_foto) as (
  values
  -- Tanaman Hias
  ('Asoka Merah', 'Tanaman Hias', 12000, 'Siap Jual', 'Tanaman Berbunga Outdoor',
   'Perdu berbunga merah yang tumbuh bergerombol. Cocok untuk mempercantik teras dan halaman yang terkena matahari.', 'Tanaman hias/Asoka merah'),
  ('Asoka Putih', 'Tanaman Hias', 12000, 'Siap Jual', 'Tanaman Berbunga Outdoor',
   'Asoka dengan bunga putih bergerombol yang memberi kesan bersih dan segar di halaman.', 'Tanaman hias/Asoka putih'),
  ('Aster Pikok Ungu', 'Tanaman Hias', 12000, 'Siap Jual', 'Tanaman Berbunga Outdoor',
   'Tanaman berbunga ungu yang manis untuk pot teras atau bedengan taman.', 'Tanaman hias/Aster Pikok Ungu'),
  ('Brokoli Kuning', 'Tanaman Hias', 12000, 'Siap Jual', 'Tanaman Daun & Pagar Outdoor',
   'Tanaman hias dengan warna kuning cerah yang membuat sudut taman lebih hidup.', 'Tanaman hias/Brokoli'),
  ('Cemara Silver Mini', 'Tanaman Hias', 12000, 'Siap Jual', 'Tanaman Daun & Pagar Outdoor',
   'Cemara ukuran mini dengan warna daun keperakan. Cantik untuk pot di teras.', 'Tanaman hias/Cemara silver mini'),
  ('Jengger Ayam', 'Tanaman Hias', 12000, 'Siap Jual', 'Tanaman Berbunga Outdoor',
   'Bunga unik berbentuk seperti jengger dengan warna mencolok. Gampang jadi pusat perhatian di taman.', 'Tanaman hias/Jengger ayam'),
  ('Kemuning Mini', 'Tanaman Hias', 12000, 'Siap Jual', 'Tanaman Berbunga Outdoor',
   'Kemuning berdaun kecil dan rimbun dengan bunga putih yang harum. Cocok untuk pagar hidup.', 'Tanaman hias/Kemuning mini'),
  ('Matahari Mini', 'Tanaman Hias', 12000, 'Siap Jual', 'Tanaman Berbunga Outdoor',
   'Bunga kuning cerah ukuran mini yang bikin halaman terasa ceria.', 'Tanaman hias/Matahari mini'),
  ('Melati Salju', 'Tanaman Hias', 12000, 'Siap Jual', 'Tanaman Berbunga Outdoor',
   'Tanaman berbunga putih yang rimbun dan cantik untuk pot maupun taman.', 'Tanaman hias/Melati salju'),
  ('Miana Batik', 'Tanaman Hias', 12000, 'Siap Jual', 'Miana',
   'Miana dengan motif daun seperti batik. Warna daunnya jadi daya tarik utama.', 'Tanaman hias/Miana Batik'),
  ('Miana Maroon', 'Tanaman Hias', 12000, 'Siap Jual', 'Miana',
   'Miana berdaun merah marun yang pekat, cocok jadi aksen warna di antara tanaman hijau.', 'Tanaman hias/Miana Maroon'),
  ('Miana Watermelon', 'Tanaman Hias', 12000, 'Siap Jual', 'Miana',
   'Miana dengan perpaduan warna daun hijau dan merah muda seperti semangka.', 'Tanaman hias/Miana Watermelon'),
  ('Pentol Ungu', 'Tanaman Hias', 12000, 'Siap Jual', 'Tanaman Berbunga Outdoor',
   'Bunga bulat kecil berwarna ungu yang tahan lama dan cantik untuk bedengan.', 'Tanaman hias/Pentol ungu'),
  ('Pucuk Merah', 'Tanaman Hias', 12000, 'Siap Jual', 'Tanaman Daun & Pagar Outdoor',
   'Daun muda berwarna merah menyala, populer untuk pagar hidup. Harga Rp12.000-15.000 tergantung ukuran, tanyakan ke admin untuk ukuran lebih besar.', 'Tanaman hias/Pucuk merah'),
  ('Puring Pura', 'Tanaman Hias', 30000, 'Siap Jual', 'Puring',
   'Puring dengan daun warna-warni yang mencolok. Makin cerah jika kena matahari.', 'Tanaman hias/puring pura'),
  ('Puring Teri', 'Tanaman Hias', 12000, 'Siap Jual', 'Puring',
   'Puring berdaun kecil dan ramping dengan warna-warni cerah.', 'Tanaman hias/Puring Teri'),
  ('Serut Merah', 'Tanaman Hias', 30000, 'Siap Jual', 'Tanaman Daun & Pagar Outdoor',
   'Tanaman hias daun dengan aksen merah untuk mempercantik halaman.', 'Tanaman hias/Serut Merah'),
  ('Superba', 'Tanaman Hias', 30000, 'Siap Jual', null,
   'Tanaman hias pilihan untuk melengkapi koleksi di rumah.', 'Tanaman hias/superba'),

  -- Aglaonema
  ('Aglaonema Big Roy', 'Aglaonema', 55000, 'Siap Jual', 'Aglaonema',
   'Aglaonema berdaun lebar dengan corak yang tegas, cocok untuk ruang tamu. Harga Rp55.000-70.000 tergantung ukuran, tanyakan ke admin untuk ukuran lebih besar.', 'Tanaman Aglaonema/Aglaonema Big Roy'),
  ('Aglaonema Snow White', 'Aglaonema', 20000, 'Siap Jual', 'Aglaonema',
   'Aglaonema dengan dominasi warna putih kehijauan yang lembut. Harga Rp20.000-30.000 tergantung ukuran, tanyakan ke admin untuk ukuran lebih besar.', 'Tanaman Aglaonema/Aglaonema Snow White'),
  ('Aglaonema Kochin', 'Aglaonema', 130000, 'Siap Jual', 'Aglaonema',
   'Aglaonema koleksi dengan corak daun yang istimewa, cocok untuk penghobi.', 'Tanaman Aglaonema/Aglaonema Kochin'),
  ('Aglaonema Lipstik', 'Aglaonema', 25000, 'Siap Jual', 'Aglaonema',
   'Aglaonema dengan tepi daun merah seperti lipstik. Manis untuk meja kerja atau sudut ruangan. Harga Rp25.000-30.000 tergantung ukuran, tanyakan ke admin untuk ukuran lebih besar.', 'Tanaman Aglaonema/Aglonema lipstik'),

  -- Tanaman Obat
  ('Sirih Merah', 'Tanaman Obat', 55000, 'Siap Jual', 'Sirih Merah',
   'Tanaman merambat dengan daun bercorak merah keperakan, cantik di pot gantung maupun rambatan. Harga Rp55.000-60.000 tergantung ukuran, tanyakan ke admin untuk ukuran lebih besar.', 'Tanaman obat/Sirih merah'),

  -- Buah & Rempah
  ('Jeruk Nagami', 'Buah & Rempah', 45000, 'Siap Jual', 'Buah & Cabai dalam Pot',
   'Jeruk berbuah kecil lonjong yang bisa ditanam di pot. Cantik sebagai tanaman hias sekaligus berbuah. Harga Rp45.000-50.000 tergantung ukuran, tanyakan ke admin untuk ukuran lebih besar.', 'Tanaman buah&rempah/Jeruk Nagami'),
  ('Cabe Ijo', 'Buah & Rempah', 15000, 'Siap Jual', 'Buah & Cabai dalam Pot',
   'Bibit cabai hijau untuk panen sendiri di pekarangan atau pot. Harga Rp15.000-20.000 tergantung ukuran, tanyakan ke admin untuk ukuran lebih besar.', 'Tanaman buah&rempah/1793528674220.jpg'),
  ('Kunyit', 'Buah & Rempah', 17000, 'Siap Jual', 'Kunyit',
   'Tanaman kunyit untuk kebutuhan dapur, mudah tumbuh di pot atau pekarangan. Harga Rp17.000-20.000 tergantung ukuran, tanyakan ke admin untuk ukuran lebih besar.', 'Tanaman buah&rempah/Kunyit'),

  -- Pot
  ('Pot Hitam Diameter 5 cm', 'Pot', 6000, 'Produk Umum', null,
   'Pot hitam ukuran kecil, pas untuk semai dan bibit.', 'Pot hitam/Pot Kecil hitam diameter 5'),
  ('Pot Hitam Diameter 25 cm', 'Pot', 10000, 'Produk Umum', null,
   'Pot hitam polos ukuran sedang untuk tanaman hias maupun sayur.', 'Pot hitam/Pot hitam biasa diameter 25'),
  ('Pot Hitam Garis Diameter 30 cm', 'Pot', 17000, 'Produk Umum', null,
   'Pot hitam bermotif garis ukuran besar, memberi kesan rapi untuk tanaman di teras.', 'Pot hitam/Pot hitam garis-garis diameter 30'),
  ('Pot Gantung Putih', 'Pot', 18000, 'Produk Umum', null,
   'Pot gantung warna putih untuk tanaman menjuntai di teras atau jendela.', 'Pot gantung/Pot gantung putih (pilih 1 dari 3 foto)'),
  ('Pot Dinding Putih Diameter 22 cm', 'Pot', 12000, 'Produk Umum', null,
   'Pot dinding warna putih untuk taman vertikal yang hemat tempat.', 'Pot dinding/Pot dinding putih/1793522181014.jpg'),

  -- Pupuk
  ('Pupuk NPK Kecil', 'Pupuk', 20000, 'Produk Umum', null,
   'Pupuk NPK kemasan kecil untuk membantu tanaman tumbuh subur. Ikuti takaran pada kemasan.', 'Pupuk npk/NPK kecil'),
  ('Pupuk NPK Besar', 'Pupuk', 40000, 'Produk Umum', null,
   'Pupuk NPK kemasan besar, hemat untuk perawatan banyak tanaman. Ikuti takaran pada kemasan.', 'Pupuk npk/NPK besar'),

  -- Pembasmi Hama
  ('Sidamethrin', 'Pembasmi Hama', 30000, 'Produk Umum', null,
   'Pembasmi hama serangga. Baca dan ikuti petunjuk serta takaran pada label, gunakan sarung tangan, dan simpan jauh dari jangkauan anak-anak dan hewan peliharaan.', 'Pembasmi hama/Sidamethrin'),

  -- Media Tanam
  ('Media Tanam Medium', 'Media Tanam', 12000, 'Produk Umum', null,
   'Media tanam siap pakai kemasan medium.', 'Media tanam/Media tanam medium'),
  ('Media Tanam Big', 'Media Tanam', 17000, 'Produk Umum', null,
   'Media tanam siap pakai kemasan besar, cocok untuk repotting beberapa tanaman sekaligus.', 'Media tanam/Media tanam big')
)
insert into public.products (name, description, price, stock, plant_status, category_id, care_guide_id)
select d.name, d.description, d.price, 10, d.plant_status, c.id, g.id
from data d
join public.categories c on c.name = d.kategori
left join public.care_guides g on g.name = d.panduan;
