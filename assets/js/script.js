document.addEventListener("DOMContentLoaded", function() {
    
    // --- 1. Fitur Animasi Muncul saat Di-scroll (Scroll Reveal) ---
    const cards = document.querySelectorAll('.card');

    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.15
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    cards.forEach(card => {
        observer.observe(card);
    });

    // --- 2. Fitur Smooth Scrolling untuk Menu Navigasi ---
    const navLinks = document.querySelectorAll('nav ul li a');

    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                const navHeight = document.querySelector('nav').offsetHeight;
                const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - navHeight;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // --- 3. Fitur Highlight Menu Aktif saat Scroll ---
    window.addEventListener('scroll', () => {
        let current = '';
        const sections = document.querySelectorAll('section');
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (pageYOffset >= (sectionTop - 150)) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    });

    // --- 4. FITUR BARU: PREVIEW DOKUMEN DI MODAL ---
    const fileLinks = document.querySelectorAll('.file-link');
    const modal = document.getElementById('docModal');
    const closeBtn = document.querySelector('.close-btn');
    const docFrame = document.getElementById('docFrame');
    const modalTitle = document.getElementById('modalTitle');
    const downloadBtn = document.getElementById('downloadBtn');

    // Fungsi untuk membuka Modal
    fileLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const filePath = this.getAttribute('data-file');
            const fileType = this.getAttribute('data-type');
            
            // Ekstrak nama file dari path untuk judul
            const fileName = filePath.split('/').pop();
            modalTitle.textContent = `Pratinjau: ${fileName}`;
            
            // Atur link download
            downloadBtn.href = filePath;
            
            if (fileType === 'pdf') {
                // PDF bisa langsung di-embed di iframe
                docFrame.src = filePath;
            } else {
                // Untuk DOCX/PPTX, iframe default browser biasanya tidak support.
                // Kita gunakan Google Docs Viewer sebagai alternatif (memerlukan file online/public).
                // Jika file lokal (offline), browser akan menampilkan tombol unduh atau layar kosong.
                // Cara aman: biarkan src kosong, beri pesan di layar, atau arahkan ke path.
                // Kita coba arahkan langsung ke file. Jika gagal, user bisa klik tombol unduh.
                docFrame.src = filePath; 
            }

            modal.classList.add('active');
        });
    });

    // Fungsi untuk menutup Modal
    function closeModal() {
        modal.classList.remove('active');
        docFrame.src = ""; // Hentikan pemuatan file saat modal ditutup
    }

    closeBtn.addEventListener('click', closeModal);

    // Tutup modal jika klik di luar area modal-content
    window.addEventListener('click', function(e) {
        if (e.target === modal) {
            closeModal();
        }
    });

    // Tutup modal dengan tombol ESC
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && modal.classList.contains('active')) {
            closeModal();
        }
    });

});