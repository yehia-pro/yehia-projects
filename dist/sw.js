// sw.js — Service Worker للـ Student Hub
// استراتيجية: cache-first للملفات الثابتة، network-first للصفحات

const CACHE_VERSION = 'student-hub-v9.0.0';
const STATIC_CACHE = CACHE_VERSION + '-static';
const RUNTIME_CACHE = CACHE_VERSION + '-runtime';

// الملفات الأساسية للتخزين المؤقت والعمل بدون إنترنت
const PRECACHE_URLS = [
  './',
  './index.html',
  './prayer.html',
  './flashcards.html',
  './tasks.html',
  './exams.html',
  './lectures.html',
  './subjects.html',
  './grades.html',
  './resources.html',
  './stats.html',
  './teachers.html',
  './groups.html',
  './download.html',
  './manifest.json',
  './icon.svg',
  './css/tailwind.css',
  './css/custom.css',
  './js/store.js',
  './js/labels.js',
  './js/prayer.js',
  './js/flashcards.js',
  './js/onboarding.js',
  './js/app.js',
  './js/dashboard.js',
  './js/tasks.js',
  './js/exams.js',
  './js/lectures.js',
  './js/subjects.js',
  './js/teacher-planet.js',
  './js/quran-reader.js',
  './js/pdf-studio.js',
  './js/grades.js',
  './js/resources.js',
  './js/stats.js',
  './js/teachers.js',
  './js/groups.js',
  './assets/audio/adhan_makkah.mp3',
  './assets/audio/adhan_afasy.mp3',
  './assets/audio/adhan_egypt_refaat.mp3',
  './assets/audio/adhan_egypt_minshawi.mp3',
  './assets/audio/adhan_banna.mp3',
  './assets/audio/adhan_aqsa.mp3',
  './assets/audio/adhan_qatami.mp3',
  './assets/audio/adhan_abdulbasit.mp3',
  './assets/audio/takbeerat_haram.mp3'
];

// Install: تكاش الملفات الأساسية
self.addEventListener('install', function (event) {
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then(function (cache) {
        return Promise.allSettled(
          PRECACHE_URLS.map(function (url) {
            return cache.add(url).catch(function (err) {
              console.warn('[SW] Failed to cache:', url, err);
            });
          })
        );
      })
      .then(function () { return self.skipWaiting(); })
  );
});

// Activate: حذف الـ caches القديمة
self.addEventListener('activate', function (event) {
  event.waitUntil(
    caches.keys().then(function (keys) {
      return Promise.all(
        keys.filter(function (k) {
          return k !== STATIC_CACHE && k !== RUNTIME_CACHE;
        }).map(function (k) {
          console.log('[SW] Deleting old cache:', k);
          return caches.delete(k);
        })
      );
    }).then(function () { return self.clients.claim(); })
  );
});

// Fetch: cache-first مع fallback للـ network
self.addEventListener('fetch', function (event) {
  var req = event.request;
  if (req.method !== 'GET') return;

  var url = new URL(req.url);

  // تجاهل الـ CDN requests (Tailwind etc.) — مش ضروري في Capacitor
  if (url.hostname !== self.location.hostname && url.protocol !== 'capacitor:') {
    // حاول من الكاش أولاً لو مفيش نت
    event.respondWith(
      fetch(req).catch(function () {
        return caches.match(req);
      })
    );
    return;
  }

  // للملفات المحلية: cache-first
  event.respondWith(
    caches.match(req).then(function (cached) {
      if (cached) {
        // رجّع الكاش وحدّث في الخلفية بصمت
        fetchAndCache(req).catch(function () {});
        return cached;
      }
      return fetchAndCache(req);
    }).catch(function () {
      if (req.mode === 'navigate') {
        return caches.match('./index.html');
      }
    })
  );
});

function fetchAndCache(req) {
  return fetch(req).then(function (res) {
    if (res && res.status === 200) {
      var clone = res.clone();
      caches.open(RUNTIME_CACHE).then(function (cache) {
        cache.put(req, clone);
      });
    }
    return res;
  }).catch(function () {
    return caches.match(req);
  });
}

// استقبال أوامر
self.addEventListener('message', function (event) {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
  if (event.data && event.data.type === 'CLEAR_CACHE') {
    caches.keys().then(function (keys) {
      keys.forEach(function (k) { caches.delete(k); });
    });
  }
});
