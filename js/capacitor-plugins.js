// capacitor-plugins.js
// Bridge للـ Capacitor plugins — يتحمّل بس على Android
(function () {
  'use strict';
  if (typeof window === 'undefined') return;

  // لو Capacitor موجود على الجهاز
  if (window.Capacitor && window.Capacitor.isNativePlatform()) {
    // الـ plugins بتتحمل تلقائياً من Capacitor bridge
    // مش محتاجين نعمل حاجة إضافية هنا
    console.log('[CapPlugins] Running on native Android');
  } else {
    console.log('[CapPlugins] Running on web/browser');
  }
})();
