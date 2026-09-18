// ============ 3D High-End Student Avatars System ============
// Handcrafted, responsive, scalable vector 3D illustrations for male & female students
// Lightweight, offline-capable, and distinct.

const CenterAvatars = {
  avatars: [
    {
      id: 'boy_1',
      gender: 'male',
      name: 'طالب عصري (هودي سماوي)',
      themeColor: '#0284c7',
      renderSvg(size = 80) {
        return `
          <svg viewBox="0 0 100 100" width="${size}" height="${size}" class="student-avatar-svg drop-shadow-md">
            <defs>
              <radialGradient id="b1_skin" cx="40%" cy="35%" r="60%">
                <stop offset="0%" stop-color="#FFDFBA"/>
                <stop offset="100%" stop-color="#F2B880"/>
              </radialGradient>
              <linearGradient id="b1_hair" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stop-color="#374151"/>
                <stop offset="100%" stop-color="#111827"/>
              </linearGradient>
              <linearGradient id="b1_hoodie" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stop-color="#38BDF8"/>
                <stop offset="100%" stop-color="#0284C7"/>
              </linearGradient>
              <filter id="b1_shadow" x="-10%" y="-10%" width="130%" height="130%">
                <feDropShadow dx="0" dy="2" stdDeviation="1.5" flood-opacity="0.15"/>
              </filter>
            </defs>
            <!-- Background Halo -->
            <circle cx="50" cy="50" r="48" fill="#F0F9FF" class="dark:fill-slate-800"/>
            <circle cx="50" cy="50" r="46" fill="none" stroke="#BAE6FD" stroke-width="1.5"/>
            <!-- Body / Hoodie -->
            <path d="M20 92 C20 70, 32 64, 50 64 C68 64, 80 70, 80 92 Z" fill="url(#b1_hoodie)" filter="url(#b1_shadow)"/>
            <path d="M42 64 C42 74, 58 74, 58 64 Z" fill="#E0F2FE"/>
            <path d="M48 68 L48 84 M52 68 L52 84" stroke="#FFFFFF" stroke-width="1.5" stroke-linecap="round"/>
            <!-- Neck -->
            <rect x="44" y="55" width="12" height="12" rx="4" fill="#E5AA70"/>
            <!-- Head & Face -->
            <circle cx="50" cy="42" r="21" fill="url(#b1_skin)" filter="url(#b1_shadow)"/>
            <!-- Ears -->
            <circle cx="29" cy="42" r="4.5" fill="#E5AA70"/>
            <circle cx="71" cy="42" r="4.5" fill="#E5AA70"/>
            <!-- Hair -->
            <path d="M29 36 C29 18, 71 18, 71 36 C71 27, 62 20, 50 20 C38 20, 29 27, 29 36 Z" fill="url(#b1_hair)"/>
            <path d="M30 34 Q40 22 55 24 Q65 20 70 32 Q62 25 45 28 Z" fill="url(#b1_hair)"/>
            <!-- Eyebrows -->
            <path d="M38 34 Q43 32 46 34" stroke="#1F2937" stroke-width="2" stroke-linecap="round" fill="none"/>
            <path d="M54 34 Q57 32 62 34" stroke="#1F2937" stroke-width="2" stroke-linecap="round" fill="none"/>
            <!-- Eyes -->
            <circle cx="42" cy="40" r="2.5" fill="#111827"/>
            <circle cx="58" cy="40" r="2.5" fill="#111827"/>
            <circle cx="43" cy="39" r="0.8" fill="#FFFFFF"/>
            <circle cx="59" cy="39" r="0.8" fill="#FFFFFF"/>
            <!-- Smile -->
            <path d="M44 48 Q50 54 56 48" stroke="#9A3412" stroke-width="2" stroke-linecap="round" fill="none"/>
            <!-- Cheeks blush -->
            <circle cx="36" cy="45" r="3" fill="#FDA4AF" opacity="0.6"/>
            <circle cx="64" cy="45" r="3" fill="#FDA4AF" opacity="0.6"/>
          </svg>
        `;
      }
    },
    {
      id: 'boy_2',
      gender: 'male',
      name: 'طالب متفوق (نظارات ذكية)',
      themeColor: '#0369a1',
      renderSvg(size = 80) {
        return `
          <svg viewBox="0 0 100 100" width="${size}" height="${size}" class="student-avatar-svg drop-shadow-md">
            <defs>
              <radialGradient id="b2_skin" cx="40%" cy="35%" r="60%">
                <stop offset="0%" stop-color="#FFE0BD"/>
                <stop offset="100%" stop-color="#F3BD88"/>
              </radialGradient>
              <linearGradient id="b2_jacket" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stop-color="#1E3A8A"/>
                <stop offset="100%" stop-color="#0F172A"/>
              </linearGradient>
            </defs>
            <circle cx="50" cy="50" r="48" fill="#EFF6FF" class="dark:fill-slate-800"/>
            <circle cx="50" cy="50" r="46" fill="none" stroke="#93C5FD" stroke-width="1.5"/>
            <!-- Jacket -->
            <path d="M20 92 C20 70, 32 64, 50 64 C68 64, 80 70, 80 92 Z" fill="url(#b2_jacket)"/>
            <path d="M40 64 L50 78 L60 64 Z" fill="#F8FAFC"/>
            <path d="M48 78 L48 92 M52 78 L52 92" stroke="#0284C7" stroke-width="1.5"/>
            <!-- Neck -->
            <rect x="44" y="55" width="12" height="12" rx="4" fill="#E5AA70"/>
            <!-- Head -->
            <circle cx="50" cy="42" r="21" fill="url(#b2_skin)"/>
            <circle cx="29" cy="42" r="4.5" fill="#E5AA70"/>
            <circle cx="71" cy="42" r="4.5" fill="#E5AA70"/>
            <!-- Stylish Parted Hair -->
            <path d="M30 35 C30 18, 70 18, 70 35 C70 24, 55 18, 48 18 C38 18, 30 25, 30 35 Z" fill="#1F2937"/>
            <path d="M30 32 Q45 22 52 24 Q65 24 68 34 Q58 26 48 26 Q38 26 30 32 Z" fill="#111827"/>
            <!-- Glasses -->
            <rect x="34" y="37" width="14" height="10" rx="3" fill="none" stroke="#0284C7" stroke-width="2"/>
            <rect x="52" y="37" width="14" height="10" rx="3" fill="none" stroke="#0284C7" stroke-width="2"/>
            <line x1="48" y1="41" x2="52" y2="41" stroke="#0284C7" stroke-width="2"/>
            <line x1="30" y1="40" x2="34" y2="40" stroke="#0284C7" stroke-width="1.5"/>
            <line x1="66" y1="40" x2="70" y2="40" stroke="#0284C7" stroke-width="1.5"/>
            <!-- Eyes through glasses -->
            <circle cx="41" cy="42" r="2.2" fill="#111827"/>
            <circle cx="59" cy="42" r="2.2" fill="#111827"/>
            <!-- Smile -->
            <path d="M45 49 Q50 53 55 49" stroke="#9A3412" stroke-width="1.8" stroke-linecap="round" fill="none"/>
          </svg>
        `;
      }
    },
    {
      id: 'boy_3',
      gender: 'male',
      name: 'طالب رياضي (كاب بولو)',
      themeColor: '#0284c7',
      renderSvg(size = 80) {
        return `
          <svg viewBox="0 0 100 100" width="${size}" height="${size}" class="student-avatar-svg drop-shadow-md">
            <defs>
              <radialGradient id="b3_skin" cx="40%" cy="35%" r="60%">
                <stop offset="0%" stop-color="#FFDFBA"/>
                <stop offset="100%" stop-color="#E8A870"/>
              </radialGradient>
              <linearGradient id="b3_shirt" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stop-color="#0284C7"/>
                <stop offset="100%" stop-color="#0369A1"/>
              </linearGradient>
              <linearGradient id="b3_cap" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stop-color="#0F172A"/>
                <stop offset="100%" stop-color="#334155"/>
              </linearGradient>
            </defs>
            <circle cx="50" cy="50" r="48" fill="#F8FAFC" class="dark:fill-slate-800"/>
            <circle cx="50" cy="50" r="46" fill="none" stroke="#BAE6FD" stroke-width="1.5"/>
            <!-- Shirt -->
            <path d="M20 92 C20 70, 32 64, 50 64 C68 64, 80 70, 80 92 Z" fill="url(#b3_shirt)"/>
            <path d="M42 64 L50 72 L58 64 Z" fill="#FFFFFF"/>
            <!-- Head -->
            <circle cx="50" cy="45" r="20" fill="url(#b3_skin)"/>
            <circle cx="30" cy="45" r="4.5" fill="#E8A870"/>
            <circle cx="70" cy="45" r="4.5" fill="#E8A870"/>
            <!-- Backward / Forward Cap -->
            <path d="M28 35 C28 20, 72 20, 72 35 Z" fill="url(#b3_cap)"/>
            <path d="M24 35 Q50 31 76 35 Q84 37 82 40 Q50 36 24 38 Z" fill="#0284C7"/>
            <circle cx="50" cy="22" r="3" fill="#0284C7"/>
            <!-- Eyes -->
            <circle cx="42" cy="43" r="2.3" fill="#111827"/>
            <circle cx="58" cy="43" r="2.3" fill="#111827"/>
            <!-- Smile -->
            <path d="M44 51 Q50 56 56 51" stroke="#9A3412" stroke-width="2" stroke-linecap="round" fill="none"/>
          </svg>
        `;
      }
    },
    {
      id: 'girl_1',
      gender: 'female',
      name: 'طالبة متميزة (حجاب سماوي)',
      themeColor: '#0284c7',
      renderSvg(size = 80) {
        return `
          <svg viewBox="0 0 100 100" width="${size}" height="${size}" class="student-avatar-svg drop-shadow-md">
            <defs>
              <radialGradient id="g1_skin" cx="45%" cy="40%" r="55%">
                <stop offset="0%" stop-color="#FFF1E6"/>
                <stop offset="100%" stop-color="#FCD5B5"/>
              </radialGradient>
              <linearGradient id="g1_hijab" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stop-color="#38BDF8"/>
                <stop offset="100%" stop-color="#0284C7"/>
              </linearGradient>
              <linearGradient id="g1_dress" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stop-color="#0369A1"/>
                <stop offset="100%" stop-color="#0C4A6E"/>
              </linearGradient>
            </defs>
            <!-- Background Halo -->
            <circle cx="50" cy="50" r="48" fill="#F0F9FF" class="dark:fill-slate-800"/>
            <circle cx="50" cy="50" r="46" fill="none" stroke="#BAE6FD" stroke-width="1.5"/>
            <!-- Outer Hijab Flow & Dress -->
            <path d="M20 92 C20 72, 32 66, 50 66 C68 66, 80 72, 80 92 Z" fill="url(#g1_dress)"/>
            <!-- Main Hijab Outer Shape -->
            <path d="M25 46 C25 20, 75 20, 75 46 C75 76, 68 86, 50 86 C32 86, 25 76, 25 46 Z" fill="url(#g1_hijab)"/>
            <!-- Face Opening -->
            <ellipse cx="50" cy="46" rx="16.5" ry="19" fill="url(#g1_skin)"/>
            <!-- Inner Cap Under Hijab -->
            <path d="M34 38 Q50 32 66 38 Q50 30 34 38 Z" fill="#FFFFFF" opacity="0.9"/>
            <!-- Eyebrows -->
            <path d="M38 38 Q43 36 47 38" stroke="#374151" stroke-width="1.5" stroke-linecap="round" fill="none"/>
            <path d="M53 38 Q57 36 62 38" stroke="#374151" stroke-width="1.5" stroke-linecap="round" fill="none"/>
            <!-- Eyes & Lashes -->
            <circle cx="42" cy="44" r="2.6" fill="#111827"/>
            <circle cx="58" cy="44" r="2.6" fill="#111827"/>
            <circle cx="43" cy="43" r="0.9" fill="#FFFFFF"/>
            <circle cx="59" cy="43" r="0.9" fill="#FFFFFF"/>
            <!-- Gentle Smile -->
            <path d="M45 52 Q50 56 55 52" stroke="#E11D48" stroke-width="1.8" stroke-linecap="round" fill="none"/>
            <!-- Cheeks -->
            <circle cx="37" cy="48" r="3" fill="#FDA4AF" opacity="0.55"/>
            <circle cx="63" cy="48" r="3" fill="#FDA4AF" opacity="0.55"/>
            <!-- Hijab Fold Detail -->
            <path d="M44 65 Q50 72 56 65 Q50 76 44 65 Z" fill="#0369A1" opacity="0.4"/>
          </svg>
        `;
      }
    },
    {
      id: 'girl_2',
      gender: 'female',
      name: 'طالبة متفوقة (نظارات أنيقة)',
      themeColor: '#0ea5e9',
      renderSvg(size = 80) {
        return `
          <svg viewBox="0 0 100 100" width="${size}" height="${size}" class="student-avatar-svg drop-shadow-md">
            <defs>
              <radialGradient id="g2_skin" cx="45%" cy="40%" r="55%">
                <stop offset="0%" stop-color="#FFF4EB"/>
                <stop offset="100%" stop-color="#FED7AA"/>
              </radialGradient>
              <linearGradient id="g2_hijab" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stop-color="#0284C7"/>
                <stop offset="100%" stop-color="#075985"/>
              </linearGradient>
            </defs>
            <circle cx="50" cy="50" r="48" fill="#F0FDF4" class="dark:fill-slate-800"/>
            <circle cx="50" cy="50" r="46" fill="none" stroke="#BAE6FD" stroke-width="1.5"/>
            <!-- Dress -->
            <path d="M20 92 C20 72, 32 66, 50 66 C68 66, 80 72, 80 92 Z" fill="#0F172A"/>
            <!-- Hijab -->
            <path d="M25 46 C25 20, 75 20, 75 46 C75 76, 68 86, 50 86 C32 86, 25 76, 25 46 Z" fill="url(#g2_hijab)"/>
            <ellipse cx="50" cy="46" rx="16.5" ry="19" fill="url(#g2_skin)"/>
            <path d="M34 38 Q50 33 66 38 Z" fill="#38BDF8" opacity="0.8"/>
            <!-- Glasses -->
            <rect x="35" y="40" width="13" height="9" rx="2.5" fill="none" stroke="#E11D48" stroke-width="1.8"/>
            <rect x="52" y="40" width="13" height="9" rx="2.5" fill="none" stroke="#E11D48" stroke-width="1.8"/>
            <line x1="48" y1="43" x2="52" y2="43" stroke="#E11D48" stroke-width="1.8"/>
            <!-- Eyes -->
            <circle cx="41.5" cy="44.5" r="2.2" fill="#111827"/>
            <circle cx="58.5" cy="44.5" r="2.2" fill="#111827"/>
            <!-- Smile -->
            <path d="M46 53 Q50 56 54 53" stroke="#BE123C" stroke-width="1.8" stroke-linecap="round" fill="none"/>
          </svg>
        `;
      }
    },
    {
      id: 'girl_3',
      gender: 'female',
      name: 'طالبة مجتهدة (حجاب باستيل)',
      themeColor: '#38bdf8',
      renderSvg(size = 80) {
        return `
          <svg viewBox="0 0 100 100" width="${size}" height="${size}" class="student-avatar-svg drop-shadow-md">
            <defs>
              <radialGradient id="g3_skin" cx="45%" cy="40%" r="55%">
                <stop offset="0%" stop-color="#FFF1E6"/>
                <stop offset="100%" stop-color="#FCD5B5"/>
              </radialGradient>
              <linearGradient id="g3_hijab" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stop-color="#7DD3FC"/>
                <stop offset="100%" stop-color="#0284C7"/>
              </linearGradient>
            </defs>
            <circle cx="50" cy="50" r="48" fill="#FDF2F8" class="dark:fill-slate-800"/>
            <circle cx="50" cy="50" r="46" fill="none" stroke="#FBCFE8" stroke-width="1.5"/>
            <!-- Dress -->
            <path d="M20 92 C20 72, 32 66, 50 66 C68 66, 80 72, 80 92 Z" fill="#0369A1"/>
            <!-- Hijab -->
            <path d="M25 46 C25 20, 75 20, 75 46 C75 76, 68 86, 50 86 C32 86, 25 76, 25 46 Z" fill="url(#g3_hijab)"/>
            <ellipse cx="50" cy="46" rx="16.5" ry="19" fill="url(#g3_skin)"/>
            <path d="M34 38 Q50 33 66 38 Z" fill="#F8FAFC"/>
            <!-- Eyes -->
            <circle cx="42" cy="44" r="2.5" fill="#111827"/>
            <circle cx="58" cy="44" r="2.5" fill="#111827"/>
            <circle cx="43" cy="43" r="0.8" fill="#FFFFFF"/>
            <circle cx="59" cy="43" r="0.8" fill="#FFFFFF"/>
            <!-- Smile -->
            <path d="M45 52 Q50 56 55 52" stroke="#BE185D" stroke-width="1.8" stroke-linecap="round" fill="none"/>
            <circle cx="37" cy="48" r="3" fill="#FDA4AF" opacity="0.6"/>
            <circle cx="63" cy="48" r="3" fill="#FDA4AF" opacity="0.6"/>
          </svg>
        `;
      }
    }
  ],

  getById(id) {
    return this.avatars.find(a => a.id === id) || this.avatars[0];
  },

  getByGender(gender) {
    return this.avatars.filter(a => a.gender === gender);
  },

  getDefault(gender) {
    return gender === 'female' ? this.avatars[3] : this.avatars[0];
  },

  renderAvatar(id, size = 64) {
    const a = this.getById(id);
    return a ? a.renderSvg(size) : '';
  }
};

window.CenterAvatars = CenterAvatars;
