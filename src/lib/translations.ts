export type FaqItem = {
  question: string;
  answer: string;
};

export const translations = {
  id: {
    title: 'Waktu Kontraksi — Timer Kontraksi Persalinan & Pola 5-1-1',
    ogTitle: 'Waktu Kontraksi — Timer Kontraksi Persalinan',
    ogImageAlt: 'Waktu Kontraksi — Timer kontraksi persalinan untuk mencatat durasi, jarak antar kontraksi, dan pola 5–1–1 di browser.',
    appName: 'Waktu Kontraksi — Timer Kontraksi Persalinan',
    description: 'Hitung durasi dan jarak antar kontraksi persalinan dengan satu sentuhan. Pahami pola 5-1-1 dan simpan riwayat kontraksi secara privat di browser Anda.',
    heading: 'Timer Kontraksi',
    intro: 'Catat durasi dan jarak kontraksi dengan satu sentuhan.',
    guide: 'Panduan',
    timer: 'Pencatat waktu',
    ready: 'Siap',
    recording: 'Mencatat',
    timerLabel: 'Durasi kontraksi',
    shortClockLabel: 'Menit · Detik',
    longClockLabel: 'Jam · Menit · Detik',
    start: 'Mulai Kontraksi',
    stop: 'Selesai Kontraksi',
    startHint: 'Ketuk saat kontraksi mulai terasa.',
    stopHint: 'Ketuk saat kontraksi berakhir.',
    cancelTimer: 'Batalkan timer',
    storageError: 'Penyimpanan browser tidak tersedia. Perubahan bisa hilang saat halaman ditutup.',
    summary: 'Ringkasan',
    total: 'Total kontraksi',
    totalUnit: 'kali',
    average: 'Rata-rata durasi',
    latestInterval: 'Jarak terakhir',
    guideCardTitle: 'Kenali polanya',
    guideCardText: 'Pahami cara membaca durasi dan jarak kontraksi.',
    openGuide: 'Buka panduan',
    history: 'Riwayat kontraksi',
    clearHistory: 'Hapus semua',
    startedAt: 'Mulai',
    duration: 'Durasi',
    interval: 'Jarak',
    actions: 'Tindakan',
    deleteRecordLabel: (date: string, time: string) => `Hapus catatan ${date} pukul ${time}`,
    emptyHistory: 'Belum ada catatan',
    emptyHint: 'Kontraksi yang selesai dicatat akan muncul di sini.',
    privacy: 'Catatan hanya disimpan di browser ini.',
    guideTitle: 'Panduan kontraksi',
    closeGuide: 'Tutup panduan',
    durationDefinition: 'Waktu dari awal sampai akhir satu kontraksi.',
    intervalDefinition: 'Jarak dihitung dari awal satu kontraksi ke awal kontraksi berikutnya.',
    patternsTitle: 'Membaca pola waktu',
    patterns: 'Pola 5–1–1 berarti kontraksi datang setiap 5 menit, berlangsung sekitar 1 menit, dan berulang selama 1 jam. Pada pola 3–1–1 dan 2–1–1, jaraknya masing-masing 3 dan 2 menit.',
    assessment: 'Fase persalinan dan bukaan perlu dinilai oleh tenaga kesehatan.',
    careTitle: 'Kapan menghubungi bidan atau dokter?',
    care: 'Hubungi bidan atau fasilitas bersalin jika Anda merasa persalinan sudah mulai atau kontraksi teratur setiap 5 menit atau lebih sering.',
    urgentCareLead: 'Segera hubungi mereka',
    urgentCare: 'jika air ketuban pecah, terjadi perdarahan dari vagina, atau gerakan bayi berkurang.',
    source: 'Sumber panduan kesehatan (NHS)',
    faqSectionTitle: 'Panduan & pertanyaan umum',
    faqSectionIntro: 'Referensi ringkas untuk membantu Anda menghitung waktu kontraksi persalinan, membaca pola 5–1–1, dan mengetahui kapan perlu menghubungi tenaga kesehatan.',
    faqItems: [
      {
        question: 'Bagaimana cara menghitung durasi dan jarak kontraksi?',
        answer: 'Ketuk Mulai Kontraksi tepat saat perut mulai mengencang, lalu ketuk Selesai Kontraksi saat mereda untuk mencatat durasi. Jarak kontraksi dihitung otomatis dari waktu mulai satu kontraksi ke waktu mulai kontraksi berikutnya, bukan dari waktu jeda istirahatnya.'
      },
      {
        question: 'Apa arti pola kontraksi 5–1–1, 3–1–1, dan 2–1–1?',
        answer: 'Pola 5–1–1 berarti kontraksi datang teratur setiap 5 menit, berlangsung sekitar 1 menit, dan berulang selama minimal 1 jam. Pada pola 3–1–1 dan 2–1–1, jarak antar kontraksi semakin rapat menjadi setiap 3 menit dan 2 menit. Fase persalinan dan bukaan tetap perlu dinilai oleh bidan atau dokter.'
      },
      {
        question: 'Apa perbedaan kontraksi palsu (Braxton Hicks) dan kontraksi persalinan?',
        answer: 'Kontraksi palsu biasanya tidak teratur, tidak bertambah kuat, dan dapat mereda saat Anda beristirahat atau berganti posisi. Kontraksi persalinan asli cenderung semakin teratur, berlangsung lebih lama, terasa lebih kuat, dan jaraknya kian mendekat seiring waktu.'
      },
      {
        question: 'Kapan harus menghubungi bidan, dokter, atau rumah sakit?',
        answer: 'Hubungi bidan atau fasilitas bersalin jika Anda merasa persalinan sudah mulai atau kontraksi datang teratur setiap 5 menit atau lebih sering. Segera cari pertolongan medis jika air ketuban pecah, terjadi perdarahan dari vagina, atau gerakan bayi berkurang.'
      },
      {
        question: 'Apakah riwayat kontraksi saya aman dan tersimpan saat halaman ditutup?',
        answer: 'Ya. Semua catatan dan timer yang sedang berjalan hanya disimpan di localStorage browser pada perangkat Anda, tanpa dikirim ke server mana pun. Selama data situs browser tidak dihapus, riwayat akan pulih otomatis saat halaman dibuka kembali.'
      }
    ] satisfies FaqItem[],
    featureList: [
      'Pencatat durasi dan jarak antar kontraksi dengan satu sentuhan',
      'Ringkasan total kontraksi, rata-rata durasi, dan jarak terakhir',
      'Panduan pola kontraksi 5–1–1, 3–1–1, dan 2–1–1 berdasarkan NHS',
      'Penyimpanan riwayat privat di localStorage browser tanpa akun'
    ],
    confirmClear: 'Hapus semua riwayat?',
    confirmDelete: 'Hapus catatan ini?',
    deleteDescription: 'Catatan yang dihapus akan hilang dari browser ini.',
    cancel: 'Batal',
    delete: 'Hapus',
    feedback: {
      temporary: 'Kontraksi dicatat untuk sementara.',
      saved: 'Kontraksi berhasil disimpan.',
      cancelled: 'Pencatatan dibatalkan.',
      unsaved: 'Perubahan hanya berlaku di halaman ini.',
      cleared: 'Riwayat dihapus.',
      deleted: 'Catatan dihapus.'
    }
  },
  en: {
    title: 'Contraction Timer — Track Labor Duration & 5-1-1 Rule',
    ogTitle: 'Waktu Kontraksi — Labor Contraction Timer',
    ogImageAlt: 'Waktu Kontraksi — Labor contraction timer to track contraction duration, intervals, and the 5–1–1 pattern privately in your browser.',
    appName: 'Waktu Kontraksi — Labor Contraction Timer',
    description: 'Track labor contraction duration and intervals with one tap. Understand the 5-1-1 pattern and keep your contraction history privately in your browser.',
    heading: 'Contraction Timer',
    intro: 'Track how long contractions last and how far apart they are.',
    guide: 'Guide',
    timer: 'Timer',
    ready: 'Ready',
    recording: 'Recording',
    timerLabel: 'Contraction duration',
    shortClockLabel: 'Minutes · Seconds',
    longClockLabel: 'Hours · Minutes · Seconds',
    start: 'Start Contraction',
    stop: 'End Contraction',
    startHint: 'Tap when a contraction starts.',
    stopHint: 'Tap when the contraction ends.',
    cancelTimer: 'Cancel timer',
    storageError: 'Browser storage is unavailable. Changes may be lost when you close the page.',
    summary: 'Summary',
    total: 'Total contractions',
    totalUnit: '',
    average: 'Average duration',
    latestInterval: 'Latest interval',
    guideCardTitle: 'Understand the pattern',
    guideCardText: 'Learn how to read contraction durations and intervals.',
    openGuide: 'Open guide',
    history: 'Contraction history',
    clearHistory: 'Delete all',
    startedAt: 'Started',
    duration: 'Duration',
    interval: 'Interval',
    actions: 'Actions',
    deleteRecordLabel: (date: string, time: string) => `Delete entry for ${date} at ${time}`,
    emptyHistory: 'No entries yet',
    emptyHint: 'Completed contractions will appear here.',
    privacy: 'Entries are stored only in this browser.',
    guideTitle: 'Contraction guide',
    closeGuide: 'Close guide',
    durationDefinition: 'Time from the start to the end of one contraction.',
    intervalDefinition: 'The interval is measured from the start of one contraction to the start of the next.',
    patternsTitle: 'Reading contraction patterns',
    patterns: 'A 5–1–1 pattern means contractions are 5 minutes apart, last about 1 minute, and repeat for 1 hour. In 3–1–1 and 2–1–1 patterns, they are 3 and 2 minutes apart, respectively.',
    assessment: 'A healthcare professional can assess the stage of labour and cervical dilation.',
    careTitle: 'When should you contact your midwife or doctor?',
    care: 'Contact your midwife or maternity unit if you think labour has started or your contractions are regular and 5 minutes apart or closer.',
    urgentCareLead: 'Contact them straight away',
    urgentCare: 'if your waters break, you have vaginal bleeding, or your baby is moving less than usual.',
    source: 'Health guidance (NHS)',
    faqSectionTitle: 'Contraction guide & FAQ',
    faqSectionIntro: 'A quick reference for timing labor contractions, reading the 5–1–1 pattern, and knowing when to call your midwife or doctor.',
    faqItems: [
      {
        question: 'How do you time contraction duration and intervals?',
        answer: 'Tap Start Contraction as soon as a contraction begins and End Contraction when it fades to record its duration. The interval is calculated automatically from the start of one contraction to the start of the next—not the rest time in between.'
      },
      {
        question: 'What do the 5–1–1, 3–1–1, and 2–1–1 contraction patterns mean?',
        answer: 'A 5–1–1 pattern means contractions arrive every 5 minutes, last about 1 minute each, and stay consistent for at least 1 hour. In 3–1–1 and 2–1–1 patterns, contractions come every 3 or 2 minutes. Only a healthcare professional can assess the stage of labour and cervical dilation.'
      },
      {
        question: 'How is false labor (Braxton Hicks) different from real labor contractions?',
        answer: 'Braxton Hicks contractions are usually irregular, do not grow steadily stronger, and often ease when you rest or change position. True labor contractions become more regular, last longer, feel stronger, and move closer together over time.'
      },
      {
        question: 'When should I contact my midwife, doctor, or maternity unit?',
        answer: 'Contact your midwife or maternity unit if you think labour has started or your contractions are regular and 5 minutes apart or closer. Contact them straight away if your waters break, you have vaginal bleeding, or your baby is moving less than usual.'
      },
      {
        question: 'Is my contraction history private and saved if I close the page?',
        answer: 'Yes. Your active timer and contraction log are stored only in your browser localStorage and are never sent to a server. Reopening the page in the same browser restores your session as long as site data is kept.'
      }
    ] satisfies FaqItem[],
    featureList: [
      'One-tap labor contraction duration and interval timer',
      'Live summary of total contractions, average duration, and latest interval',
      '5–1–1, 3–1–1, and 2–1–1 contraction pattern guide referencing NHS guidance',
      'Private browser-only localStorage persistence with no account required'
    ],
    confirmClear: 'Delete all entries?',
    confirmDelete: 'Delete this entry?',
    deleteDescription: 'Deleted entries will be removed from this browser.',
    cancel: 'Cancel',
    delete: 'Delete',
    feedback: {
      temporary: 'Contraction recorded for this visit only.',
      saved: 'Contraction saved.',
      cancelled: 'Timer cancelled.',
      unsaved: 'Changes apply to this page only.',
      cleared: 'History deleted.',
      deleted: 'Entry deleted.'
    }
  }
};

export type Language = keyof typeof translations;
