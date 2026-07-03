// ===== DATA =====
let dataList = [];
let nextId = 1;

// ===== DOM =====
const form = document.getElementById('dataForm');
const nama = document.getElementById('nama');
const meja = document.getElementById('meja');
const menu = document.getElementById('menu');
const jumlah = document.getElementById('jumlah');
const catatan = document.getElementById('catatan');
const formMessage = document.getElementById('formMessage');
const tableBody = document.getElementById('tableBody');
const emptyMsg = document.getElementById('emptyMessage');

// Modal
const modal = document.getElementById('notificationModal');
const modalBody = document.getElementById('modalBody');
const modalOk = document.getElementById('modalOkBtn');

// Navigasi
const navForm = document.getElementById('navForm');
const navTable = document.getElementById('navTable');
const pageForm = document.getElementById('pageForm');
const pageTable = document.getElementById('pageTable');

function showPage(page) {
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
    renderTable();
  }
}

navForm.addEventListener('click', e => { e.preventDefault(); showPage('form'); });
navTable.addEventListener('click', e => { e.preventDefault(); showPage('table'); });

// ===== MODAL ERROR =====
function showErrorModal(errors) {
  let html = '<ul>';
  errors.forEach(err => html += `<li>${err}</li>`);
  html += '</ul>';
  modalBody.innerHTML = html;
  modal.style.display = 'flex';
}

// Tutup modal
modalOk.addEventListener('click', () => modal.style.display = 'none');
modal.addEventListener('click', e => { if (e.target === modal) modal.style.display = 'none'; });

// ===== TAMBAH DATA =====
form.addEventListener('submit', function(e) {
  e.preventDefault(); // matikan validasi bawaan browser

  const valNama = nama.value.trim();
  const valMeja = meja.value.trim();
  const valMenu = menu.value;
  const valJumlah = jumlah.value.trim();
  const valCatatan = catatan.value.trim();

  let errors = [];

  if (!valNama) errors.push('Nama pelanggan wajib diisi.');
  if (!valMeja) errors.push('Nomor meja wajib diisi.');
  if (!valMenu) errors.push('Menu wajib dipilih.');
  if (!valJumlah) {
    errors.push('Jumlah porsi wajib diisi.');
  } else if (isNaN(valJumlah) || parseInt(valJumlah) < 1) {
    errors.push('Jumlah harus angka positif (minimal 1).');
  }

  if (errors.length > 0) {
    showErrorModal(errors);
    return;
  }

  // Simpan data
  const newData = {
    id: nextId++,
    nama: valNama,
    meja: valMeja,
    menu: valMenu,
    jumlah: parseInt(valJumlah),
    catatan: valCatatan || '-'
  };
  dataList.push(newData);

  formMessage.textContent = '✅ Pesanan berhasil disimpan!';
  formMessage.className = 'message success';
  form.reset();
  setTimeout(() => {
    formMessage.textContent = '';
    formMessage.className = 'message';
  }, 3000);

  if (pageTable.classList.contains('active-page')) renderTable();
});

// ===== RENDER TABEL =====
function renderTable() {
  tableBody.innerHTML = '';
  if (dataList.length === 0) {
    emptyMsg.style.display = 'block';
    return;
  }
  emptyMsg.style.display = 'none';
  dataList.forEach((item, index) => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${index + 1}</td>
      <td>${item.nama}</td>
      <td>${item.meja}</td>
      <td>${item.menu}</td>
      <td>${item.jumlah}</td>
      <td>${item.catatan}</td>
      <td><button class="btn-delete" data-id="${item.id}">Hapus</button></td>
    `;
    tableBody.appendChild(row);
  });
  // Event hapus
  document.querySelectorAll('.btn-delete').forEach(btn => {
    btn.addEventListener('click', function() {
      const id = parseInt(this.dataset.id);
      dataList = dataList.filter(item => item.id !== id);
      renderTable();
      if (pageForm.classList.contains('active-page')) {
        formMessage.textContent = '🗑️ Pesanan dihapus.';
        formMessage.className = 'message success';
        setTimeout(() => {
          formMessage.textContent = '';
          formMessage.className = 'message';
        }, 2000);
      }
    });
  });
}

// Inisialisasi
showPage('form');
