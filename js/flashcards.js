// js/flashcards.js — نظام البطاقات التعليمية التفاعلية والتكرار المتباعد
// مبني وفق معايير: anthropics/skills@frontend-design & emilkowalski/skills@improve-animations

const FlashcardsApp = {
  currentDeckId: null,
  currentCardIndex: 0,
  isFlipped: false,

  init() {
    this.renderDeckList();
    const decks = Store.getFlashcardDecks();
    if (decks.length > 0) {
      this.selectDeck(decks[0].id);
    }
  },

  renderDeckList() {
    const listEl = document.getElementById('decks-list');
    if (!listEl) return;

    const decks = Store.getFlashcardDecks();
    listEl.innerHTML = decks.map(d => {
      const isSel = d.id === this.currentDeckId;
      const count = (d.cards || []).length;
      const mastered = (d.cards || []).filter(c => c.box === 3).length;
      const pct = count > 0 ? Math.round((mastered / count) * 100) : 0;

      return `
        <div onclick="FlashcardsApp.selectDeck('${d.id}')" class="sh-card p-4 rounded-2xl cursor-pointer transition-all active:scale-95 border ${isSel ? 'border-2 border-indigo-600 bg-indigo-500/10 shadow-sm' : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900'} flex items-center justify-between">
          <div class="space-y-1">
            <h4 class="font-black text-xs md:text-sm text-slate-900 dark:text-white flex items-center gap-1.5">
              <span>${d.name}</span>
            </h4>
            <span class="text-[11px] text-slate-500 block">${count} بطاقة • ${mastered} متقنة (${pct}%)</span>
          </div>
          <span class="w-7 h-7 rounded-xl flex items-center justify-center text-xs ${isSel ? 'bg-indigo-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-400'} font-bold">
            ${isSel ? '✓' : '➔'}
          </span>
        </div>
      `;
    }).join('');
  },

  selectDeck(deckId) {
    this.currentDeckId = deckId;
    this.currentCardIndex = 0;
    this.isFlipped = false;
    this.renderDeckList();
    this.renderCurrentCard();
  },

  renderCurrentCard() {
    const decks = Store.getFlashcardDecks();
    const deck = decks.find(d => d.id === this.currentDeckId);
    if (!deck) return;

    const cards = deck.cards || [];
    const deckTitleEl = document.getElementById('active-deck-title');
    if (deckTitleEl) deckTitleEl.textContent = deck.name;

    const cardCountEl = document.getElementById('deck-cards-count');
    if (cardCountEl) cardCountEl.textContent = `${this.currentCardIndex + 1} / ${cards.length || 1}`;

    const cardContainer = document.getElementById('flashcard-flipper');
    if (!cardContainer) return;

    if (!cards.length) {
      cardContainer.innerHTML = `
        <div class="p-8 text-center space-y-3">
          <span class="text-4xl">📭</span>
          <p class="text-xs font-bold text-slate-500">لا توجد بطاقات في هذه المجموعة بعد.</p>
          <button onclick="FlashcardsApp.openAddCardModal()" class="px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-bold shadow-md">
            + إضافة أول بطاقة
          </button>
        </div>
      `;
      return;
    }

    const card = cards[this.currentCardIndex] || cards[0];
    const boxLabels = { 1: '🌱 صندوق 1 (جديدة/يومية)', 2: '🌿 صندوق 2 (مراجعة كل 3 أيام)', 3: '⭐ صندوق 3 (متقنة/أسبوعية)' };
    const boxColors = { 1: 'text-amber-500 bg-amber-500/10', 2: 'text-sky-500 bg-sky-500/10', 3: 'text-emerald-500 bg-emerald-500/10' };

    cardContainer.innerHTML = `
      <div onclick="FlashcardsApp.flipCard()" class="w-full min-h-[260px] p-6 rounded-3xl bg-white dark:bg-slate-900 border-2 ${this.isFlipped ? 'border-emerald-500/50 bg-emerald-500/5' : 'border-indigo-500/40 bg-indigo-500/5'} shadow-xl flex flex-col justify-between cursor-pointer transition-all duration-500 transform ${this.isFlipped ? 'scale-[1.01]' : ''} select-none">
        
        <div class="flex items-center justify-between text-xs">
          <span class="px-2.5 py-1 rounded-full text-[10px] font-black ${boxColors[card.box || 1]}">
            ${boxLabels[card.box || 1]}
          </span>
          <span class="text-slate-400 font-bold text-[11px]">
            ${this.isFlipped ? '💡 الإجابة والتوضيح' : '❓ السؤال والمفهوم'} (اضغط للقلب)
          </span>
        </div>

        <div class="my-auto py-6 text-center">
          <p class="text-base md:text-xl font-bold leading-relaxed ${this.isFlipped ? 'text-emerald-700 dark:text-emerald-300 font-serif' : 'text-slate-900 dark:text-white'}">
            ${this.isFlipped ? card.back : card.front}
          </p>
        </div>

        <div class="text-center text-[11px] text-slate-400 font-medium">
          ${this.isFlipped ? 'اضغط لقلب البطاقة مجدداً 🔄' : 'اضغط على البطاقة لإظهار الإجابة 👁️'}
        </div>
      </div>
    `;

    // Action Controls (Correct / Wrong)
    const actionsEl = document.getElementById('flashcard-actions');
    if (actionsEl) {
      actionsEl.innerHTML = `
        <div class="grid grid-cols-2 gap-3 w-full">
          <button onclick="FlashcardsApp.answerCard(false)" class="py-3 rounded-2xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-600 dark:text-rose-400 font-black text-xs border border-rose-500/30 flex items-center justify-center gap-1.5 active:scale-95 transition-all">
            <span>❌</span>
            <span>لم أتذكرها (صندوق 1)</span>
          </button>
          <button onclick="FlashcardsApp.answerCard(true)" class="py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs shadow-md flex items-center justify-center gap-1.5 active:scale-95 transition-all">
            <span>✅</span>
            <span>تذكرتها (+15 XP)</span>
          </button>
        </div>
      `;
    }
  },

  flipCard() {
    this.isFlipped = !this.isFlipped;
    if (App.sound) App.sound('click');
    if (navigator.vibrate) navigator.vibrate(20);
    this.renderCurrentCard();
  },

  answerCard(isCorrect) {
    const decks = Store.getFlashcardDecks();
    const deck = decks.find(d => d.id === this.currentDeckId);
    if (!deck || !deck.cards.length) return;

    const card = deck.cards[this.currentCardIndex];
    Store.recordFlashcardReview(deck.id, card.id, isCorrect);

    if (isCorrect) {
      if (App.sound) App.sound('task');
    } else {
      if (App.sound) App.sound('click');
    }

    this.nextCard();
  },

  nextCard() {
    const decks = Store.getFlashcardDecks();
    const deck = decks.find(d => d.id === this.currentDeckId);
    if (!deck || !deck.cards.length) return;

    this.isFlipped = false;
    this.currentCardIndex = (this.currentCardIndex + 1) % deck.cards.length;
    this.renderCurrentCard();
    this.renderDeckList();
  },

  prevCard() {
    const decks = Store.getFlashcardDecks();
    const deck = decks.find(d => d.id === this.currentDeckId);
    if (!deck || !deck.cards.length) return;

    this.isFlipped = false;
    this.currentCardIndex = (this.currentCardIndex - 1 + deck.cards.length) % deck.cards.length;
    this.renderCurrentCard();
  },

  // ===== Modals for creating Decks & Cards =====
  openAddDeckModal() {
    document.getElementById('add-deck-modal').classList.remove('hidden');
  },

  closeAddDeckModal() {
    document.getElementById('add-deck-modal').classList.add('hidden');
  },

  saveNewDeck() {
    const name = document.getElementById('new-deck-name').value.trim();
    if (!name) return App.toast('يرجى كتابة اسم المجموعة', 'warning');

    const newDeck = Store.saveFlashcardDeck({
      name,
      cards: []
    });

    document.getElementById('new-deck-name').value = '';
    this.closeAddDeckModal();
    this.selectDeck(newDeck.id);
    App.toast(`تم إنشاء مجموعة "${name}" بنجاح 🎴`);
  },

  openAddCardModal() {
    document.getElementById('add-card-modal').classList.remove('hidden');
  },

  closeAddCardModal() {
    document.getElementById('add-card-modal').classList.add('hidden');
  },

  saveNewCard() {
    const front = document.getElementById('card-front-input').value.trim();
    const back = document.getElementById('card-back-input').value.trim();
    if (!front || !back) return App.toast('يرجى ملء السؤال والإجابة', 'warning');

    const decks = Store.getFlashcardDecks();
    const deck = decks.find(d => d.id === this.currentDeckId);
    if (!deck) return;

    deck.cards.push({
      id: 'c-' + Date.now(),
      front,
      back,
      box: 1,
      reviews: 0
    });

    Store.save();
    document.getElementById('card-front-input').value = '';
    document.getElementById('card-back-input').value = '';
    this.closeAddCardModal();
    this.renderCurrentCard();
    this.renderDeckList();
    Store.addXP(20, 'إضافة بطاقة جديدة');
    App.toast('تمت إضافة البطاقة بنجاح ✨');
  }
};

document.addEventListener('DOMContentLoaded', () => {
  FlashcardsApp.init();
});
