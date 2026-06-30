// ===== DATA STORE =====
let dataList = [];          // array untuk menyimpan objek data
let nextId = 1;            // ID increment sederhana

// ===== ELEMEN DOM =====
const form = document.getElementById('dataForm');
const namaInput = document.getElementById('nama');
const nimInput = document.getElementById('nim');
const layananSelect = document.getElementById('layanan');
const keteranganInput = document.getElementById('keterangan');
const formMessage = document.getElementById('formMessage');

const tableBody = document.getElementById('tableBody');
const emptyMsg = document.getElementById('emptyMessage');

// ===== NAVIGASI =====
const navForm = document.getElementById('navForm');
const navTable = document.getElementById('navTable');
const pageForm = document.getElementById('pageForm');
const pageTable = document.getElementById('pageTable');

// Fungsi ganti halaman
function showPage(page) {
  // sembunyikan semua
  pageForm.classList.remove('active-page');
  pageTable.classList.remove('active-page');
  navForm.classList.remove('active');
  navTable.classList.remove('active');

  if (page === 'form') {
    pageForm.classList.add('active-page');
    navForm.classList.add('active');
  } else {
    pageTable.classList.add('active-page');
    navTable.classList.add('active');
    renderTable(); // refresh tabel setiap kali dibuka
  }
}

navForm.addEventListener('click', (e) => {
  e.preventDefault();
  showPage('form');
});

navTable.addEventListener('click', (e) => {
  e.preventDefault();
  showPage('table');
});

// ===== FUNGSI TAMBAH DATA =====
function tambahData(event) {
  event.preventDefault(); // stop reload

  // Ambil nilai
  const nama = namaInput.value.trim();
  const nim = nimInput.value.trim();
  const layanan = layananSelect.value;
  const keterangan = keteranganInput.value.trim();

  // Validasi sederhana
  if (!nama || !nim || !layanan) {
    formMessage.textContent = '⚠️ Nama, NIM, dan Jenis Layanan wajib diisi.';
    formMessage.className = 'message error';
    return;
  }

  // Buat objek data
  const newData = {
    id: nextId++,
    nama: nama,
    nim: nim,
    layanan: layanan,
    keterangan: keterangan || '-'
  };

  // Simpan ke array
  dataList.push(newData);

  // Tampilkan pesan sukses
  formMessage.textContent = '✅ Data berhasil disimpan!';
  formMessage.className = 'message success';

  // Reset form (opsional)
  form.reset();
  // Kosongkan pesan setelah 3 detik
  setTimeout(() => {
    formMessage.textContent = '';
    formMessage.className = 'message';
  }, 3000);

  // Jika tabel sedang aktif, perbarui tampilan
  if (pageTable.classList.contains('active-page')) {
    renderTable();
  }
}

// ===== RENDER TABEL =====
function renderTable() {
  // Kosongkan tbody
  tableBody.innerHTML = '';

  if (dataList.length === 0) {
    emptyMsg.style.display = 'block';
    return;
  }
  emptyMsg.style.display = 'none';

  // Loop data
  dataList.forEach((item, index) => {
    const row = document.createElement('tr');

    // No
    const tdNo = document.createElement('td');
    tdNo.textContent = index + 1;
    row.appendChild(tdNo);

    // Nama
    const tdNama = document.createElement('td');
    tdNama.textContent = item.nama;
    row.appendChild(tdNama);

    // NIM
    const tdNim = document.createElement('td');
    tdNim.textContent = item.nim;
    row.appendChild(tdNim);

    // Layanan
    const tdLayanan = document.createElement('td');
    tdLayanan.textContent = item.layanan;
    row.appendChild(tdLayanan);

    // Keterangan
    const tdKet = document.createElement('td');
    tdKet.textContent = item.keterangan;
    row.appendChild(tdKet);

    // Aksi (tombol hapus)
    const tdAksi = document.createElement('td');
    const btnHapus = document.createElement('button');
    btnHapus.textContent = 'Hapus';
    btnHapus.className = 'btn-delete';
    btnHapus.setAttribute('data-id', item.id);
    btnHapus.addEventListener('click', function() {
      const id = parseInt(this.getAttribute('data-id'));
      hapusData(id);
    });
    tdAksi.appendChild(btnHapus);
    row.appendChild(tdAksi);

    tableBody.appendChild(row);
  });
}

// ===== FUNGSI HAPUS DATA =====
function hapusData(id) {
  // Filter array, hapus data dengan id tertentu
  dataList = dataList.filter(item => item.id !== id);
  renderTable(); // refresh tabel

  // Jika form sedang aktif, tidak perlu refresh, tapi kita bisa tampilkan pesan?
  // Tidak wajib. Tapi kita bisa kasih notifikasi kecil di form (optional)
  // Kita tampilkan pesan di form message jika form aktif
  if (pageForm.classList.contains('active-page')) {
    formMessage.textContent = '🗑️ Data telah dihapus.';
    formMessage.className = 'message success';
    setTimeout(() => {
      formMessage.textContent = '';
      formMessage.className = 'message';
    }, 2000);
  }
}

// ===== EVENT LISTENER FORM =====
form.addEventListener('submit', tambahData);

// ===== INISIALISASI =====
// Tampilkan halaman form secara default (sudah ada class active-page di HTML)
// Tapi pastikan navigasi aktif sesuai
// Jika ada data awal untuk demo, bisa ditambahkan (opsional)
// Contoh data awal (komentar, bisa diaktifkan jika ingin)
/*
dataList.push({ id: nextId++, nama: 'Andi Pratama', nim: '12345678', layanan: 'Konsultasi', keterangan: 'Membahas proyek akhir' });
dataList.push({ id: nextId++, nama: 'Siti Nurhaliza', nim: '87654321', layanan: 'Bimbingan', keterangan: 'Bimbingan skripsi' });
renderTable();
*/

// Tampilkan form saat pertama kali (sudah)
// Tapi jika ingin tabel langsung aktif, ubah class di HTML, tidak perlu.