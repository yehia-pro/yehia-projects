/**
 * Student Hub - Local PDF Studio & IndexedDB Storage Engine
 * Allows offline PDF uploading, indexed storage, bookmarking, and reader modal.
 */

const PDFStudio = {
  DB_NAME: 'StudentHub_PDF_Store',
  DB_VERSION: 1,
  STORE_NAME: 'pdf_files',
  _db: null,

  async initDB() {
    if (this._db) return this._db;
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.DB_NAME, this.DB_VERSION);
      request.onupgradeneeded = (e) => {
        const db = e.target.result;
        if (!db.objectStoreNames.contains(this.STORE_NAME)) {
          db.createObjectStore(this.STORE_NAME, { keyPath: 'id' });
        }
      };
      request.onsuccess = (e) => {
        this._db = e.target.result;
        resolve(this._db);
      };
      request.onerror = (e) => {
        console.error('IndexedDB error:', e);
        reject(e);
      };
    });
  },

  async saveFile(id, fileBlob) {
    const db = await this.initDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(this.STORE_NAME, 'readwrite');
      const store = tx.objectStore(this.STORE_NAME);
      const req = store.put({ id, data: fileBlob, updatedAt: Date.now() });
      req.onsuccess = () => resolve(true);
      req.onerror = (e) => reject(e);
    });
  },

  async getFile(id) {
    const db = await this.initDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(this.STORE_NAME, 'readonly');
      const store = tx.objectStore(this.STORE_NAME);
      const req = store.get(id);
      req.onsuccess = () => {
        if (req.result && req.result.data) {
          resolve(req.result.data);
        } else {
          resolve(null);
        }
      };
      req.onerror = (e) => reject(e);
    });
  },

  async deleteFile(id) {
    const db = await this.initDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(this.STORE_NAME, 'readwrite');
      const store = tx.objectStore(this.STORE_NAME);
      const req = store.delete(id);
      req.onsuccess = () => resolve(true);
      req.onerror = (e) => reject(e);
    });
  },

  // Upload and register a new PDF
  async handleFileUpload(file, metadata = {}) {
    if (!file || file.type !== 'application/pdf') {
      if (typeof App !== 'undefined' && App.toast) {
        App.toast('يرجى اختيار ملف بصيغة PDF فقط 📄', 'error');
      }
      return null;
    }

    const id = 'pdf_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5);
    const sizeMB = (file.size / (1024 * 1024)).toFixed(1);

    try {
      await this.saveFile(id, file);

      const pdfMeta = {
        id,
        title: metadata.title || file.name.replace(/\.pdf$/i, ''),
        subjectId: metadata.subjectId || '',
        subjectName: metadata.subjectName || 'عام',
        sizeMB: sizeMB + ' MB',
        totalPages: metadata.totalPages || 0,
        lastPageRead: 1,
        addedAt: new Date().toISOString(),
        notes: metadata.notes || ''
      };

      const st = Store.state;
      if (!st.localPdfs) st.localPdfs = [];
      st.localPdfs.unshift(pdfMeta);
      
      Store.addXP(25, 'رفع وحفظ مذكرة PDF جديدة');
      Store.save();

      if (typeof App !== 'undefined' && App.toast) {
        App.toast(`تم حفظ مذكرة "${pdfMeta.title}" بنجاح في جهازك! (+25 XP) 🎉`, 'success');
      }

      return pdfMeta;
    } catch (e) {
      console.error('Error saving PDF:', e);
      if (typeof App !== 'undefined' && App.toast) {
        App.toast('حدث خطأ أثناء حفظ ملف الـ PDF محلياً', 'error');
      }
      return null;
    }
  },

  // Open PDF in Fullscreen Reader Modal
  async openReader(pdfId) {
    const st = Store.state;
    const meta = (st.localPdfs || []).find(p => p.id === pdfId);
    if (!meta) {
      if (typeof App !== 'undefined' && App.toast) App.toast('المذكرة غير موجودة', 'error');
      return;
    }

    let blob = await this.getFile(pdfId);
    if (!blob) {
      if (typeof App !== 'undefined' && App.toast) App.toast('تعذر قراءة ملف الـ PDF من الذاكرة المحلية', 'error');
      return;
    }

    const blobUrl = URL.createObjectURL(blob);
    let modal = document.getElementById('pdf-reader-modal');
    if (!modal) {
      modal = document.createElement('div');
      modal.id = 'pdf-reader-modal';
      modal.className = 'fixed inset-0 z-[100] bg-slate-950 flex flex-col animate-in fade-in duration-200';
      document.body.appendChild(modal);
    }

    modal.innerHTML = `
      <!-- Reader Top Toolbar -->
      <div class="px-4 py-3 bg-slate-900 border-b border-slate-800 flex items-center justify-between gap-3 shrink-0">
        <div class="flex items-center gap-3 min-w-0">
          <button onclick="PDFStudio.closeReader('${blobUrl}')" class="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-sm font-bold flex items-center gap-1 active:scale-95 transition">
            <span>➔</span>
            <span>رجوع</span>
          </button>
          <div class="min-w-0">
            <h3 class="text-sm md:text-base font-black text-white truncate">${meta.title}</h3>
            <span class="text-[11px] text-indigo-400 font-bold">${meta.subjectName || 'مذكرة دراسية'} • ${meta.sizeMB}</span>
          </div>
        </div>

        <div class="flex items-center gap-2">
          <button onclick="PDFStudio.updateLastPage('${pdfId}')" class="px-3 py-1.5 rounded-xl bg-indigo-600/20 border border-indigo-500/40 text-indigo-300 text-xs font-bold hover:bg-indigo-600/30 transition">
            📌 حفظ موضع القراءة
          </button>
          <a href="${blobUrl}" download="${meta.title}.pdf" class="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition" title="تحميل نسخة">
            📥
          </a>
        </div>
      </div>

      <!-- PDF Viewer Frame -->
      <div class="flex-1 bg-slate-950 relative overflow-hidden flex items-center justify-center">
        <iframe src="${blobUrl}#toolbar=1&navpanes=0" class="w-full h-full border-0 bg-slate-900" title="${meta.title}"></iframe>
      </div>
    `;

    // Remember as current study bookmark in store
    st.currentPdfBookmark = {
      id: meta.id,
      title: meta.title,
      subject: meta.subjectName,
      openedAt: new Date().toISOString()
    };
    Store.save();
  },

  closeReader(blobUrl) {
    if (blobUrl) {
      try { URL.revokeObjectURL(blobUrl); } catch(e){}
    }
    const modal = document.getElementById('pdf-reader-modal');
    if (modal) modal.remove();
  },

  updateLastPage(pdfId) {
    const pageNum = prompt('اكتب رقم الصفحة التي وصلت إليها لحفظ موضعك:');
    if (pageNum && !isNaN(pageNum)) {
      const st = Store.state;
      const pdf = (st.localPdfs || []).find(p => p.id === pdfId);
      if (pdf) {
        pdf.lastPageRead = parseInt(pageNum, 10);
        Store.addXP(10, 'حفظ تقدم قراءة المذكرة');
        Store.save();
        if (typeof App !== 'undefined' && App.toast) {
          App.toast(`تم حفظ وصولك للصفحة ${pageNum} بنجاح! (+10 XP) 🔖`, 'success');
        }
      }
    }
  },

  async deletePdf(pdfId) {
    if (!confirm('هل أنت متأكد من حذف هذه المذكرة من جهازك؟')) return;
    await this.deleteFile(pdfId);
    const st = Store.state;
    st.localPdfs = (st.localPdfs || []).filter(p => p.id !== pdfId);
    Store.save();
    if (typeof App !== 'undefined' && App.toast) {
      App.toast('تم حذف المذكرة بنجاح', 'info');
    }
    if (typeof ResourcesPage !== 'undefined' && ResourcesPage.render) {
      ResourcesPage.render();
    }
  }
};
