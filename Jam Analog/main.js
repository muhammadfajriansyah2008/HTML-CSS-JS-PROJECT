// Animasi Partikel
function buatPartikel() {
    const wadahPartikel = document.getElementById('partikel');
    const jumlahPartikel = 50;
    
    for (let i = 0; i < jumlahPartikel; i++) {
        const partikel = document.createElement('div');
        partikel.classList.add('partikel-tunggal');
        
        // Ukuran acak antara 1px dan 3px
        const ukuran = Math.random() * 2 + 1;
        partikel.style.width = `${ukuran}px`;
        partikel.style.height = `${ukuran}px`;
        
        // Posisi acak
        partikel.style.left = `${Math.random() * 100}%`;
        partikel.style.bottom = `-10px`;
        
        // Durasi animasi acak antara 10s dan 20s
        const durasi = Math.random() * 10 + 10;
        partikel.style.animationDuration = `${durasi}s`;
        
        // Delay acak
        partikel.style.animationDelay = `${Math.random() * 10}s`;
        
        wadahPartikel.appendChild(partikel);
    }
}

// Fungsi Jam
function perbaruiJam() {
    const sekarang = new Date();
    const jam = sekarang.getHours() % 12;
    const menit = sekarang.getMinutes();
    const detik = sekarang.getSeconds();
    
    const derajatJam = (jam * 30) + (menit * 0.5);
    const derajatMenit = (menit * 6) + (detik * 0.1);
    const derajatDetik = detik * 6;
    
    document.querySelector('.jarum-jam').style.transform = `rotate(${derajatJam}deg)`;
    document.querySelector('.jarum-menit').style.transform = `rotate(${derajatMenit}deg)`;
    document.querySelector('.jarum-detik').style.transform = `rotate(${derajatDetik}deg)`;
}

// Inisialisasi
buatPartikel();

// Update jam setiap detik
setInterval(perbaruiJam, 1000);
perbaruiJam(); // Jalankan sekali saat pertama kali load