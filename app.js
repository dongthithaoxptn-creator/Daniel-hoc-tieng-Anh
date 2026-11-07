(() => {
'use strict';

/* ---------- names (change these two if you like) ---------- */
const HERO = 'Greeny';   // the green hero
const DINO = 'Rexy';     // the dino friend

/* ---------- helpers ---------- */
const $ = (s, r = document) => r.querySelector(s);
const esc = s => String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const sleep = ms => new Promise(r => setTimeout(r, ms));
const shuffle = a => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
const app = $('#app');

/* ---------- pictures: emoji, plus a few small drawings where no emoji fits ---------- */
const svg = inner => `<svg viewBox="0 0 100 100" aria-hidden="true">${inner}</svg>`;
const DESK = svg('<rect x="8" y="36" width="84" height="10" rx="3" fill="#c98a45"/><rect x="14" y="46" width="8" height="38" fill="#8a5a2b"/><rect x="78" y="46" width="8" height="38" fill="#8a5a2b"/><rect x="56" y="46" width="22" height="20" rx="2" fill="#a8702f"/><circle cx="67" cy="56" r="2.5" fill="#fff3c4"/>');
const GATE = svg('<rect x="6" y="22" width="10" height="66" rx="3" fill="#a8702f"/><rect x="84" y="22" width="10" height="66" rx="3" fill="#a8702f"/><rect x="18" y="34" width="64" height="8" fill="#c98a45"/><rect x="18" y="64" width="64" height="8" fill="#c98a45"/><rect x="28" y="30" width="8" height="46" fill="#d9a15c"/><rect x="46" y="30" width="8" height="46" fill="#d9a15c"/><rect x="64" y="30" width="8" height="46" fill="#d9a15c"/>');
const TOP = svg('<rect x="47" y="10" width="6" height="22" rx="3" fill="#555"/><ellipse cx="50" cy="38" rx="28" ry="9" fill="#ffb703"/><path d="M22 38 Q50 48 78 38 L56 88 Q50 94 44 88Z" fill="#e63946"/><path d="M34 52 Q50 60 66 52" stroke="#fff" stroke-width="4" fill="none"/>');
const MOP = svg('<rect x="46" y="6" width="7" height="58" rx="3" fill="#8a5a2b"/><path d="M28 62 H72 L80 92 H20Z" fill="#6ec1f5"/><path d="M34 66 V90 M44 66 V90 M56 66 V90 M66 66 V90" stroke="#3b95d6" stroke-width="3"/>');

/* ---------- the book: Tiếng Anh 1, Global Success (Kết nối tri thức), Book Map pp. 4-5 ---------- */
const U = (n, title, L, words, tpl, o = {}) => ({ n, title, L, words: words.map(([w, p]) => ({ w, p })), tpl, ...o });
const UNITS = [
  U(1, 'In the school playground', 'B', [['ball','🏀'],['bike','🚲'],['book','📖']], null,
    { talk: [["Hi, I'm Bill.", '👦'], ["Hi, I'm {kid}.", '🙋'], ['Bye, Bill.', '👋']] }),
  U(2, 'In the dining room', 'C', [['cake','🍰'],['car','🚗'],['cat','🐱'],['cup','🥤']], 'I have a {w}.'),
  U(3, 'At the street market', 'A', [['apple','🍎'],['bag','🎒'],['can','🥫'],['hat','👒']], 'This is my {w}.'),
  U(4, 'In the bedroom', 'D', [['desk',DESK],['dog','🐶'],['door','🚪'],['duck','🦆']], 'This is a {w}.'),
  U(5, 'At the fish and chip shop', 'I', [['chicken','🐔'],['chips','🍟'],['fish','🐟'],['milk','🥛']], 'I like {w}.'),
  U(6, 'In the classroom', 'E', [['bell','🔔'],['pen','🖊️'],['pencil','✏️'],['red','🔴']], "It's a red {w}.", { tplWords: ['bell','pen','pencil'] }),
  U(7, 'In the garden', 'G', [['garden','🌻'],['gate',GATE],['girl','👧'],['goat','🐐']], "There's a {w}."),
  U(8, 'In the park', 'H', [['hair','💇'],['hand','✋'],['head','👦'],['horse','🐴']], 'Touch your {w}.', { tplWords: ['hair','hand','head'] }),
  U(9, 'In the shop', 'O', [['clocks','🕒🕒'],['locks','🔒🔒'],['mops',MOP+MOP],['pots','🍲🍲']], 'How many {w}?', { talkTpl: 'How many {w}? Two.' }),
  U(10, 'At the zoo', 'M', [['mango','🥭'],['monkey','🐵'],['mother','👩'],['mouse','🐭']], "That's a {w}.", { tplWords: ['mango','monkey','mouse'] }),
  U(11, 'At the bus stop', 'U', [['bus','🚌'],['run','🏃'],['sun','☀️'],['truck','🚚']], null,
    { talk: [["She's running.", '🏃‍♀️'], ["He's running.", '🏃‍♂️']] }),
  U(12, 'At the lake', 'L', [['lake','🏞️'],['leaf','🍃'],['lemons','🍋']], 'Look at the {w}.'),
  U(13, 'In the school canteen', 'N', [['bananas','🍌'],['noodles','🍜'],['nuts','🥜']], "She's having {w}."),
  U(14, 'In the toy shop', 'T', [['teddy bear','🧸'],['tiger','🐯'],['top',TOP],['turtle','🐢']], 'I can see a {w}.'),
  U(15, 'At the football match', 'F', [['face','😀'],['father','👨'],['foot','🦶'],['football','⚽']], 'Point to your {w}.', { tplWords: ['face','foot'] }),
  U(16, 'At home', 'W', [['wash','🧼'],['water','💧'],['window','🪟']], null,
    { talk: [['How many windows can you see? I can see six.', '🪟🪟🪟🪟🪟🪟'], ['How many windows can you see? I can see two.', '🪟🪟']] })
];
/* ---------- extra word sets: children's topics, with my own example sentences ---------- */
const PAT = {
  thing: { c: 'This is {a}.', m: 'This is {w}.', p: 'These are {w}.' },
  body: { c: 'Touch your {w}.', m: 'Touch your {w}.', p: 'Touch your {w}.' },
  feel: { c: "I'm {w}.", m: "I'm {w}.", p: "I'm {w}." },
  wear: { c: 'I have {a}.', m: 'I have {w}.', p: 'I have {w}.' },
  eat: { c: 'This is {a}.', m: 'I like {w}.', p: 'I like {w}.' },
  see: { c: 'I can see {a}.', m: 'I can see {w}.', p: 'I can see {w}.' },
  like: { c: 'I like {w}.', m: 'I like {w}.', p: 'I like {w}.' },
  colour: { c: "It's {w}.", m: "It's {w}.", p: "It's {w}." },
  none: null
};
/* [id, Vietnamese name, English title, icon, sentence pattern, [word, picture, type]...]  type: c = a/an noun, m = no article, p = plural */
const TOPICS = [["people","Con người","People","🧑‍🤝‍🧑","thing",[["boy","👦"],["man","👨"],["woman","👩"],["baby","👶"],["friend","🧑‍🤝‍🧑"],["grandmother","👵"],["grandfather","👴"],["family","👨‍👩‍👧‍👦"],["teacher","🧑‍🏫"],["student","🧑‍🎓"],["king","🤴"],["queen","👸"]]],["body","Cơ thể","My body","🧍","body",[["eye","👁️"],["ear","👂"],["nose","👃"],["mouth","👄"],["teeth","🦷","p"],["tongue","👅"],["arm","💪"],["leg","🦵"],["finger","👆"],["brain","🧠"]]],["pets","Thú cưng và côn trùng","Pets and bugs","🐰","thing",[["rabbit","🐰"],["hamster","🐹"],["parrot","🦜"],["pig","🐷"],["butterfly","🦋"],["bee","🐝"],["snake","🐍"],["snail","🐌"],["ant","🐜"],["ladybird","🐞"]]],["zoo","Sở thú","At the zoo","🦒","thing",[["giraffe","🦒"],["zebra","🦓"],["bear","🐻"],["penguin","🐧"],["crocodile","🐊"],["panda","🐼"],["kangaroo","🦘"],["hippo","🦛"],["camel","🐫"],["owl","🦉"]]],["wild","Rừng","In the forest","🦊","thing",[["fox","🦊"],["wolf","🐺"],["deer","🦌"],["eagle","🦅"],["swan","🦢"],["bat","🦇"]]],["sea","Biển","In the sea","🐬","thing",[["whale","🐋"],["dolphin","🐬"],["shark","🦈"],["octopus","🐙"],["crab","🦀"],["shell","🐚"],["lobster","🦞"],["shrimp","🦐"]]],["fruit","Trái cây","Fruit","🍓","thing",[["grapes","🍇","p"],["strawberry","🍓"],["watermelon","🍉"],["pineapple","🍍"],["pear","🍐"],["peach","🍑"],["cherry","🍒"],["coconut","🥥"],["kiwi","🥝"],["melon","🍈"]]],["veg","Rau củ","Vegetables","🥕","thing",[["carrot","🥕"],["tomato","🍅"],["potato","🥔"],["onion","🧅"],["lettuce","🥬","m"],["garlic","🧄","m"],["pepper","🫑"],["broccoli","🥦","m"]]],["food","Đồ ăn thức uống","Food and drink","🍕","eat",[["pizza","🍕"],["sandwich","🥪"],["hamburger","🍔"],["pancake","🥞"],["cookie","🍪"],["candy","🍬"],["cheese","🧀","m"],["soup","🍲","m"],["spaghetti","🍝","m"],["popcorn","🍿","m"],["chocolate","🍫","m"],["salad","🥗","m"],["juice","🧃","m"],["tea","🍵","m"],["coffee","☕","m"]]],["clothes","Quần áo","Clothes","🧥","wear",[["jacket","🧥"],["trousers","👖","p"],["scarf","🧣"],["gloves","🧤","p"],["glasses","👓","p"],["umbrella","☂️"],["cap","🧢"],["boots","🥾","p"],["shorts","🩳","p"],["sunglasses","🕶️","p"]]],["toys","Đồ chơi và nhạc cụ","Toys and music","🤖","thing",[["robot","🤖"],["puzzle","🧩"],["balloon","🎈"],["drum","🥁"],["guitar","🎸"],["piano","🎹"],["trumpet","🎺"],["violin","🎻"],["skateboard","🛹"]]],["home","Trong nhà","At home","🛋️","thing",[["sofa","🛋️"],["television","📺"],["phone","📱"],["key","🔑"],["bath","🛁"],["shower","🚿"],["toilet","🚽"],["lamp","💡"],["toothbrush","🪥"],["computer","💻"],["camera","📷"],["watch","⌚"]]],["kitchen","Nhà bếp","In the kitchen","🍽️","thing",[["plate","🍽️"],["spoon","🥄"],["fork","🍴"],["knife","🔪"],["bowl","🥣"],["pan","🍳"],["chopsticks","🥢","p"]]],["transport","Phương tiện","Transport","🚕","thing",[["motorbike","🏍️"],["taxi","🚕"],["helicopter","🚁"],["ship","🚢"],["rocket","🚀"],["ambulance","🚑"],["bicycle","🚲"],["police car","🚓"],["tractor","🚜"],["scooter","🛴"],["van","🚐"],["tram","🚋"]]],["nature","Thiên nhiên","Nature","🌈","see",[["moon","🌙"],["star","⭐"],["cloud","☁️"],["rain","🌧️","m"],["snow","❄️","m"],["wind","🌬️","m"],["rainbow","🌈"],["tree","🌳"],["flower","🌸"],["mountain","⛰️"],["fire","🔥"],["beach","🏖️"]]],["school","Đồ dùng học tập","School things","📏","thing",[["ruler","📏"],["scissors","✂️","p"],["crayon","🖍️"],["paper","📄","m"],["notebook","📓"],["globe","🌍"],["map","🗺️"],["paint","🎨","m"]]],["jobs","Nghề nghiệp","Jobs","🧑‍🚒","thing",[["doctor","🧑‍⚕️"],["farmer","🧑‍🌾"],["police officer","👮"],["firefighter","🧑‍🚒"],["pilot","🧑‍✈️"],["cook","🧑‍🍳"],["singer","🧑‍🎤"],["astronaut","🧑‍🚀"],["artist","🧑‍🎨"],["builder","👷"]]],["places","Địa điểm","Places","🏫","thing",[["school","🏫"],["hospital","🏥"],["shop","🏪"],["house","🏠"],["castle","🏰"],["hotel","🏨"],["bank","🏦"],["supermarket","🛒"]]],["feelings","Cảm xúc","Feelings","😀","feel",[["happy","😀","m"],["sad","😢","m"],["angry","😠","m"],["tired","😴","m"],["scared","😨","m"],["surprised","😮","m"],["cold","🥶","m"],["hot","🥵","m"],["sick","🤒","m"]]],["colours","Màu sắc","Colours","🎨","colour",[["red","🔴","m"],["blue","🔵","m"],["green","🟢","m"],["yellow","🟡","m"],["orange","🟠","m"],["pink","🩷","m"],["purple","🟣","m"],["brown","🟤","m"],["black","⚫","m"],["white","⚪","m"]]],["shapes","Hình khối","Shapes","🔷","thing",[["circle","⭕"],["square","🟦"],["triangle","🔺"],["heart","❤️"],["diamond","🔷"]]],["numbers","Các số","Numbers","🔢","none",[["one","1","m"],["two","2","m"],["three","3","m"],["four","4","m"],["five","5","m"],["six","6","m"],["seven","7","m"],["eight","8","m"],["nine","9","m"],["ten","10","m"]]],["sports","Thể thao","Sports","🎾","like",[["tennis","🎾","m"],["golf","⛳","m"],["baseball","⚾","m"],["swimming","🏊","m"],["cycling","🚴","m"],["skiing","⛷️","m"],["skating","⛸️","m"],["boxing","🥊","m"],["badminton","🏸","m"],["volleyball","🏐","m"]]],["hobbies","Sở thích","Hobbies","🎤","like",[["painting","🖌️","m"],["singing","🎤","m"],["dancing","💃","m"],["reading","📖","m"],["cooking","🍳","m"],["fishing","🎣","m"],["camping","⛺","m"]]]];
const BANK_ORDER = [], WT = {}, WP = {};
TOPICS.forEach(([id, vi, title, icon, pat, ws]) => ws.forEach(([w, p, t]) => { if (!(w in WP)) { WP[w] = pat; WT[w] = t || 'c'; BANK_ORDER.push(w); } }));
let xk = 100;
TOPICS.forEach(([id, vi, title, icon, pat, ws]) => {
  const parts = Math.ceil(ws.length / 6), per = Math.ceil(ws.length / parts);
  for (let i = 0; i < parts; i++) {
    const chunk = ws.slice(i * per, (i + 1) * per); if (!chunk.length) continue;
    UNITS.push({ n: 'x' + id + (i + 1), k: ++xk, extra: true, icon, vi, L: null, title: parts > 1 ? `${title} (${i + 1})` : title,
      words: chunk.map(([w, p, t]) => ({ w, p, t: t || 'c' })) });
  }
});
const BOOK_WORDS = new Set(UNITS.filter(u => !u.extra).flatMap(u => u.words.map(w => w.w)));
const IDX = {}; UNITS.forEach(u => u.words.forEach(w => { IDX[w.w] = IDX[w.w] || w.p; }));
const art = w => (/^[aeiou]/i.test(w) ? 'an ' : 'a ') + w;
const fill = (t, w) => t.replace('{a}', art(w)).replace('{w}', w);
const hl = (w, L) => L ? esc(w).replace(new RegExp('[' + L.toLowerCase() + ']', 'gi'), m => `<b class="hl">${m}</b>`) : esc(w);
/* the example sentence for a word of an extra topic */
const sayFor = w => { const pat = PAT[WP[w]]; return pat ? fill(pat[WT[w]] || pat.c, w) : w; };
UNITS.forEach(u => {
  u.k = u.k || u.n;
  if (u.extra) {
    u.tick = u.words.map(x => ({ say: sayFor(x.w), target: x.w }));
    u.talkList = PAT[WP[u.words[0].w]] ? u.words.map(x => [sayFor(x.w), x.p]) : [];
    return;
  }
  const tw = u.tplWords || u.words.map(x => x.w);
  u.tick = u.tpl ? tw.map(w => ({ say: fill(u.tpl, w), target: w })) : u.words.map(x => ({ say: x.w, target: x.w }));
  u.talkList = u.talk || tw.slice(0, 3).map(w => [fill(u.talkTpl || u.tpl, w), IDX[w]]);
});
/* first picture of a word, for the small previews on the unit map */
const firstPic = p => {
  if (p.startsWith('<svg')) return p.slice(0, p.indexOf('</svg>') + 6);
  const m = p.match(/^\p{Extended_Pictographic}(?:️|‍\p{Extended_Pictographic}|\p{Emoji_Modifier})*/u);
  return m ? m[0] : p;
};

/* ---------- saved progress (this device, plus the account when available) ---------- */
const KEY = 'dinohero.v1';
/* the microphone only works on a secure website of its own, not inside another page or a file on the computer */
const MIC_OK = (() => { try { return location.protocol === 'https:' && window.top === window.self; } catch (e) { return false; } })();
const fresh = () => ({ v: 3, name: '', stars: 0, done: {}, words: {}, rate: 0.85, savedAt: 0, check: MIC_OK ? 'auto' : 'thumb', write: 'tiles', viSpeak: false, fw: null, voice: '', nick: '', coach: true, praise: [], nudge: [] });
/* older saves had the microphone check on by default; the microphone is parked for now */
const migrate = o => {
  if (!o.v || o.v < 2) { o.check = 'thumb'; o.v = 2; }
  if (o.v < 3) { if (MIC_OK && o.check === 'thumb') o.check = 'auto'; o.v = 3; }   // on the website, switch the microphone on once
  return o;
};
let S = fresh();
let syncState = 'device';
let dbDoc = null, pushing = false, again = false, pushTimer = 0;
try { const raw = localStorage.getItem(KEY); if (raw) S = migrate({ ...fresh(), ...JSON.parse(raw) }); } catch (e) {}
function save() {
  S.savedAt = Date.now();
  try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) {}
  clearTimeout(pushTimer); pushTimer = setTimeout(pushDb, 1500);
}
async function pushDb() {
  if (!dbDoc) return;
  if (pushing) { again = true; return; }
  pushing = true;
  try { await dbDoc.set(JSON.parse(JSON.stringify(S))); syncState = 'account'; } catch (e) { syncState = 'device'; }
  pushing = false;
  if (again) { again = false; pushDb(); }
}
async function initDb() {
  try {
    const c = window.claude; if (!c || !c.use) return;
    const db = await c.use('db'); if (!db) return;
    dbDoc = db.doc('progress/main');
    const snap = await dbDoc.get();
    if (snap.exists) {
      const d = snap.data();
      if ((d.savedAt || 0) > (S.savedAt || 0)) {
        S = migrate({ ...fresh(), ...d });
        try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) {}
        if (view === 'home' || view === 'welcome') render();
      } else if ((S.savedAt || 0) > (d.savedAt || 0)) { pushDb(); }
      syncState = 'account';
    } else if (S.savedAt) { pushDb(); }
    else { syncState = 'account'; }
  } catch (e) { syncState = 'device'; }
}

/* ---------- voice and sounds ---------- */
let voices = [];
const loadVoices = () => { try { voices = speechSynthesis.getVoices() || []; } catch (e) { voices = []; } };
loadVoices();
try { speechSynthesis.onvoiceschanged = loadVoices; } catch (e) {}
/* English only. Mac novelty voices (Albert, Cellos, Zarvox...) are skipped: they sing or distort words. */
const NOVELTY = ['albert', 'bad news', 'bahh', 'bells', 'boing', 'bubbles', 'cellos', 'deranged', 'good news', 'hysterical', 'jester', 'organ', 'superstar', 'trinoids', 'whisper', 'wobble', 'zarvox', 'fred', 'junior', 'kathy', 'ralph', 'princess'];
const voiceKey = v => v.voiceURI || v.name;
const englishVoices = () => voices.filter(v => /^en([-_]|$)/i.test(v.lang || '') && !NOVELTY.some(n => v.name.toLowerCase().includes(n)));
function pickVoice() {
  const en = englishVoices();
  if (S.voice) { const chosen = en.find(v => voiceKey(v) === S.voice); if (chosen) return chosen; }
  const us = en.filter(v => /^en[-_]us$/i.test(v.lang));
  const pool = us.length ? us : en;
  const names = ['samantha', 'ava', 'allison', 'nicky', 'karen', 'serena', 'google us english', 'zira', 'aria', 'jenny'];
  const rank = v => {
    const n = v.name.toLowerCase(); let r = 0;
    if (/premium|enhanced/.test(n)) r -= 20;
    const i = names.findIndex(p => n.includes(p)); if (i >= 0) r -= 10 - i;
    return r;
  };
  return pool.slice().sort((a, b) => rank(a) - rank(b))[0] || null;
}
let sayId = 0, curAudio = null;
const slug = t => String(t).toLowerCase().replace(/[^a-z0-9]/g, '');
function stopAudio() { try { if (curAudio) { curAudio.pause(); curAudio = null; } } catch (e) {} }
/* the computer voice */
function ttsSay(text, id) {
  return new Promise(res => {
    try {
      speechSynthesis.cancel();
      setTimeout(() => {
        if (id !== sayId) return res();
        const u = new SpeechSynthesisUtterance(text);
        u.lang = 'en-US'; const v = pickVoice(); if (v) { u.voice = v; u.lang = v.lang; }
        u.rate = S.rate; u.pitch = 1.05;
        let done = false; const fin = () => { if (!done) { done = true; res(); } };
        u.onend = fin; u.onerror = fin; setTimeout(fin, 9000);
        speechSynthesis.speak(u);
      }, 80);
    } catch (e) { res(); }
  });
}
/* a real recording when one exists for the word (computer version with the audio folder), otherwise the computer voice */
function say(text) {
  const id = ++sayId;
  stopAudio();
  const A = window.WORD_AUDIO, file = A && A[slug(text)];
  if (!file) return ttsSay(text, id);
  return new Promise(res => {
    const fallback = () => { if (id === sayId) ttsSay(text, id).then(res); else res(); };
    try {
      try { speechSynthesis.cancel(); } catch (e) {}
      const a = new Audio('audio/' + file); curAudio = a;
      a.onended = () => res(); a.onerror = fallback;
      const p = a.play(); if (p && p.catch) p.catch(fallback);
      setTimeout(res, 6000);
    } catch (e) { fallback(); }
  });
}
function loadAudioIndex() { try { const sc = document.createElement('script'); sc.src = 'audio/index.js'; sc.onerror = () => {}; document.head.appendChild(sc); } catch (e) {} }
/* Vietnamese guidance is spoken only when the device has a real Vietnamese voice; it never falls back to an English voice */
const viVoice = () => voices.find(v => /^vi([-_]|$)/i.test(v.lang || '')) || null;
function sayVi(text) {
  return new Promise(res => {
    const v = viVoice(); if (!v) return res();
    try {
      speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(text); u.voice = v; u.lang = v.lang; u.rate = 0.95;
      let d = false; const fin = () => { if (!d) { d = true; res(); } };
      u.onend = fin; u.onerror = fin; setTimeout(fin, 8000);
      speechSynthesis.speak(u);
    } catch (e) { res(); }
  });
}
const seenVi = new Set();
const STEPVI = { listen: 'Nghe và nhắc lại nhé!', point: 'Chỉ vào hình và nói nhé!', chant: 'Nghe và đọc theo nhịp nhé!', letter: 'Nhìn và tô chữ nhé!', write: 'Nhìn và viết nhé!', tick: 'Nghe và chọn hình đúng nhé!', talk: 'Nói cho bố mẹ nghe nhé!', review: 'Ôn lại các từ cũ nhé!' };
async function introVi(step) { if (!S.viSpeak || seenVi.has(step) || !viVoice()) return; seenVi.add(step); await sayVi(STEPVI[step]); }
let ac = null;
function tone(notes) {
  try {
    ac = ac || new (window.AudioContext || window.webkitAudioContext)();
    let t = ac.currentTime;
    notes.forEach(([f, d]) => {
      const o = ac.createOscillator(), g = ac.createGain();
      o.type = 'triangle'; o.frequency.value = f; o.connect(g); g.connect(ac.destination);
      g.gain.setValueAtTime(.0001, t); g.gain.exponentialRampToValueAtTime(.18, t + .02); g.gain.exponentialRampToValueAtTime(.0001, t + d);
      o.start(t); o.stop(t + d + .02); t += d * .8;
    });
  } catch (e) {}
}
const sfx = ok => tone(ok ? [[660, .12], [880, .12], [1175, .2]] : [[300, .18], [220, .25]]);
const speakSoon = (text, tok, step) => setTimeout(async () => {
  if (tok !== TOK) return;
  if (step) { await introVi(step); if (tok !== TOK) return; }
  if (COACH.busy) { await COACH.busy; COACH.busy = null; if (tok !== TOK) return; }
  say(text);
}, 300);
/* letter names written the way a voice reads them aloud, so "a" is never read as the word "a" */
const LETTER_NAME = { A: 'ay', B: 'bee', C: 'see', D: 'dee', E: 'ee', F: 'eff', G: 'jee', H: 'aitch', I: 'eye', L: 'el', M: 'em', N: 'en', O: 'oh', T: 'tee', U: 'you', W: 'double you' };
const letterSpeech = (ch, words) => (LETTER_NAME[ch.toUpperCase()] || ch) + '. ' + words.map(w => w.w).join('. ');
function burst(el) {
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const r = el.getBoundingClientRect();
  for (let i = 0; i < 8; i++) {
    const s = document.createElement('span'); s.className = 'spark'; s.textContent = '⭐';
    s.style.left = (r.left + r.width / 2) + 'px'; s.style.top = (r.top + r.height / 2) + 'px';
    s.style.setProperty('--dx', (Math.random() * 180 - 90) + 'px'); s.style.setProperty('--dy', (-30 - Math.random() * 130) + 'px');
    document.body.appendChild(s); setTimeout(() => s.remove(), 950);
  }
}

/* ---------- hero drawing ---------- */
const level = () => 1 + Math.floor(S.stars / 15);
function heroSVG(lv) {
  const s = Math.min(1.22, 1 + (lv - 1) * 0.035);
  return `<svg viewBox="0 0 200 224" role="img" aria-label="${HERO}, the green hero">
  <g transform="translate(100 124) scale(${s}) translate(-100 -124)">
    <ellipse cx="76" cy="214" rx="22" ry="8" fill="#1b6b3f"/><ellipse cx="124" cy="214" rx="22" ry="8" fill="#1b6b3f"/>
    <rect x="62" y="160" width="30" height="52" rx="13" fill="#4fcf5a"/><rect x="108" y="160" width="30" height="52" rx="13" fill="#4fcf5a"/>
    <path d="M56 138 Q100 128 144 138 L150 178 L108 178 L100 162 L92 178 L50 178Z" fill="#2f6bff"/>
    <rect x="58" y="132" width="84" height="11" rx="5" fill="#ffc93c"/>
    <path d="M48 72 Q100 56 152 72 L144 138 Q100 148 56 138Z" fill="#5fe06a"/>
    <path d="M100 84 V128 M72 104 Q86 112 98 104 M128 104 Q114 112 102 104" stroke="#3aa84a" stroke-width="4" fill="none" stroke-linecap="round"/>
    <circle cx="34" cy="108" r="27" fill="#5fe06a"/><circle cx="166" cy="108" r="27" fill="#5fe06a"/>
    <circle cx="30" cy="150" r="19" fill="#4fcf5a"/><circle cx="170" cy="150" r="19" fill="#4fcf5a"/>
    <circle cx="100" cy="48" r="35" fill="#5fe06a"/>
    <path d="M66 42 Q66 12 100 12 Q134 12 134 42 Q120 28 100 31 Q80 28 66 42Z" fill="#2b2b3a"/>
    <path d="M72 22 L78 6 L88 18 L98 2 L108 18 L120 6 L126 22Z" fill="#2b2b3a"/>
    <ellipse cx="87" cy="50" rx="8" ry="9" fill="#fff"/><ellipse cx="113" cy="50" rx="8" ry="9" fill="#fff"/>
    <circle cx="89" cy="52" r="4.5" fill="#2b2b3a"/><circle cx="111" cy="52" r="4.5" fill="#2b2b3a"/>
    <path d="M77 39 L95 45 M123 39 L105 45" stroke="#2b2b3a" stroke-width="5" stroke-linecap="round"/>
    <path d="M85 66 Q100 80 115 66Z" fill="#fff" stroke="#2b2b3a" stroke-width="3.5" stroke-linejoin="round"/>
    <circle cx="76" cy="62" r="5" fill="#ff9fb0" opacity=".7"/><circle cx="124" cy="62" r="5" fill="#ff9fb0" opacity=".7"/>
  </g></svg>`;
}

/* ---------- learning state ---------- */
const DAYS = [0, 1, 2, 4, 8, 16];
function mark(w, ok) {
  const x = S.words[w] || { box: 0, due: 0 };
  x.box = ok ? Math.min(5, x.box + 1) : 0;
  x.due = Date.now() + (ok ? DAYS[x.box] : 0) * 864e5;
  S.words[w] = x;
}
const dueWords = () => Object.keys(S.words).filter(w => IDX[w] && S.words[w].due <= Date.now()).sort((a, b) => S.words[a].box - S.words[b].box);
function knownList() {
  const ks = Object.keys(S.words).map(w => ({ w, p: IDX[w] })).filter(x => x.p);
  for (const u of UNITS) for (const w of u.words) if (ks.length < 6 && !ks.find(k => k.w === w.w)) ks.push(w);
  return ks;
}
const kid = () => S.name || 'friend';
const STEP = {
  listen: ['Nghe và nhắc lại', 'Listen and repeat'],
  point: ['Chỉ và nói', 'Point and say'],
  chant: ['Nghe và đọc theo nhịp', 'Listen and chant'],
  letter: ['Nhìn và tô chữ', 'Look and trace'],
  write: ['Nhìn và viết', 'Look and write'],
  tick: ['Nghe và chọn', 'Listen and tick'],
  talk: ['Cùng nói chuyện', "Let's talk"],
  review: ['Ôn tập tăng sức mạnh', 'Power-up review']
};

/* ---------- screens ---------- */
let view = 'home', M = null, TOK = 0;

function topbar(extra = '') {
  const lv = level(), pct = (S.stars % 15) / 15 * 100;
  return `<header class="top">
    <button class="hero-btn" data-act="hero" aria-label="Chạm để chào"><img class="face" src="icons/face.jpg" alt=""><span class="greeny">${heroSVG(lv)}</span><span class="lvbadge">${lv}</span></button>
    <div class="meter"><div class="lv">Sức mạnh cấp ${lv}</div><div class="bar" aria-hidden="true"><i style="width:${pct}%"></i></div></div>
    <div class="stars" aria-label="${S.stars} stars">⭐ ${S.stars}</div>${extra}</header>`;
}
function render() {
  try { speechSynthesis.cancel(); } catch (e) {}
  stopAudio();
  if (liveStop) liveStop();
  releaseMic();
  clearTimeout(COACH.idleT);
  TOK++;
  if (!S.name && !S.skipName) { view = 'welcome'; return welcome(); }
  if (view === 'welcome') view = 'home';
  if (view === 'stickers') return stickers();
  if (view === 'practice') return practiceMenu();
  if (view === 'mission') return M && M.type === 'sp' ? renderSP() : renderMission();
  home();
}
function welcome() {
  app.innerHTML = `<div class="welcome">
    <div class="hero-big" aria-hidden="true">${heroSVG(1)}</div>
    <h1>Xin chào! Mình là ${HERO}!</h1>
    <p class="hint">Tên của con là gì?</p>
    <input id="wname" type="text" maxlength="20" autocomplete="off" aria-label="Tên của bé" placeholder="Tên">
    <button class="btn go" data-act="start">Đi nào! 🦖</button>
    <button class="btn quiet" data-act="skipname">Bỏ qua</button></div>`;
}
function home() {
  view = 'home';
  const due = dueWords().length, fw = fwToday();
  const tints = ['#ef6f88', '#7a55e8', '#f0a63a', '#45a0ca', '#3ba3b4', '#58c46e'];
  const card = (u, i) => `
      <button class="unit" data-act="unit" data-n="${u.n}" style="--tint:${tints[i % tints.length]}" aria-label="${esc(u.title)}">
        ${u.extra ? '' : `<span class="num">${u.n}</span>`}
        <span class="letters">${u.extra ? u.icon : u.L + u.L.toLowerCase()}</span>
        <span class="pics"><span class="pic">${u.words.slice(0, 3).map(w => firstPic(w.p)).join('')}</span></span>
        <span class="uname">${esc(u.title)}${u.extra ? '<br><small>' + esc(u.vi) + '</small>' : ''}</span>
        ${S.done[u.n] ? `<span class="got" style="filter:hue-rotate(${u.k * 23}deg)">${u.k % 2 ? '🦖' : '🦕'}</span>` : ''}
      </button>`;
  app.innerHTML = topbar(`<button class="mini" data-act="stickers" aria-label="Sticker khủng long">🦖</button><button class="mini" id="gate" aria-label="Cài đặt cho phụ huynh, nhấn giữ">⚙️</button>`) + `
    <section class="hello"><div><h1>Chào ${esc(kid())}!</h1><p>Chọn bài hôm nay</p></div>
    <div class="row"><button class="review alt" data-act="practice">🎯 Luyện tập</button>
    <button class="review" data-act="review" ${due ? '' : 'disabled'}>⚡ Ôn tập tăng sức mạnh${due ? ' (' + Math.min(due, 8) + ')' : ' · đã ôn hết rồi'}</button></div></section>
    <section class="daily" aria-label="5 từ mỗi ngày">
      <div class="dpics" aria-hidden="true">${fw.words.map(w => `<span class="pic">${firstPic(IDX[w])}</span>`).join('')}</div>
      <div class="dtext"><b>5 từ mỗi ngày</b><span>${fw.done ? '✅ Hôm nay xong rồi! Con đã học ' + (fw.days || 1) + ' ngày.' : 'Học 5 từ mới hôm nay nhé!'}</span></div>
      <button class="btn go" data-act="daily">${fw.done ? 'Học lại' : 'Bắt đầu'}</button>
    </section>
    <h2 class="sec">Sách Tiếng Anh 1</h2>
    <section class="map" aria-label="Các bài trong sách">${UNITS.filter(u => !u.extra).map(card).join('')}</section>
    <h2 class="sec">Bộ từ vựng thêm</h2>
    <section class="map" aria-label="Bộ từ vựng thêm">${UNITS.filter(u => u.extra).map(card).join('')}</section>`;
  bindGate();
}
function stickers() {
  view = 'stickers';
  app.innerHTML = topbar() + `<section class="hello"><div><h1>Sticker khủng long</h1><p>Hoàn thành một bài để ấp nở khủng long</p></div><button class="btn" data-act="home">⬅ Quay lại</button></section>
    <section class="sheet">${UNITS.map(u => {
      const got = S.done[u.n];
      return `<div class="slot ${got ? '' : 'locked'}"><span class="pic" style="${got ? 'filter:hue-rotate(' + u.k * 23 + 'deg)' : ''}">${u.k % 2 ? '🦖' : '🦕'}</span><b>${u.extra ? u.icon : u.L + u.L.toLowerCase()}</b><small>${u.extra ? esc(u.title) : 'Unit ' + u.n}</small></div>`;
    }).join('')}</section>`;
}

/* mission runner */
/* a fresh random order each time, never the book order and never the same as the last time */
const lastOrder = {};
function order(n, key) {
  const base = Array.from({ length: n }, (_, i) => i);
  let o, tries = 0;
  do { o = shuffle(base); tries++; } while (n > 1 && tries < 30 && (o.join() === base.join() || o.join() === lastOrder[key]));
  lastOrder[key] = o.join();
  return o;
}
function startUnit(n) { const u = UNITS.find(x => String(x.n) === String(n)); if (u) startUnitObj(u); }
function startUnitObj(u) {
  const nw = u.words.length, k = 'u' + u.n;
  const steps = u.daily ? ['listen', 'point', 'write', 'tick']
    : u.L ? ['listen', 'point', 'chant', 'letter', 'write', 'tick', 'talk']
    : ['listen', 'point', 'chant', 'write', 'tick'].concat(u.talkList.length ? ['talk'] : []);
  /* Unit 1 is a little conversation (Hi ... Bye), so it keeps its order */
  const talk = u.n === 1 ? u.talkList : u.extra ? shuffle(u.talkList).slice(0, 3) : order(u.talkList.length, k + 't').map(i => u.talkList[i]);
  M = { type: 'unit', u, steps, si: 0, i: 0, gain0: S.stars, lv0: level(), talk,
    ord: { listen: order(nw, k + 'l'), chant: order(nw, k + 'c'), write: order(nw, k + 'w') } };
  view = 'mission'; renderMission();
}
function startReview() {
  const items = dueWords().slice(0, 8).map(w => ({ say: w, target: w }));
  if (!items.length) return;
  M = { type: 'review', steps: ['review'], si: 0, i: 0, gain0: S.stars, lv0: level() };
  view = 'mission'; renderMission(); quizStart(shuffle(items));
}
function renderMission() {
  releaseMic();
  armIdle(22000);
  TOK++;
  const st = M.steps[M.si], lab = STEP[st];
  const sub = M.type === 'unit' ? (M.u.daily ? '5 từ mới hôm nay' : M.u.extra ? esc(M.u.title) : 'Unit ' + M.u.n + ' · ' + esc(M.u.title)) : 'Các từ cần ôn lại';
  app.innerHTML = `<header class="mhead"><button class="x" data-act="home" aria-label="Về bản đồ">✕</button>
    <div class="mtitle"><h2>${lab[0]}</h2><p>${lab[1]} · ${sub}</p></div>
    <div class="dots" aria-hidden="true">${M.steps.length > 1 ? M.steps.map((_, i) => `<i class="${i < M.si ? 'on' : i === M.si ? 'now' : ''}"></i>`).join('') : ''}</div></header>
    <main class="stage" id="stage"></main>`;
  if (STEPS[st]) STEPS[st]();
}
function nextStep() {
  M.si++; M.i = 0;
  if (M.si >= M.steps.length) return rewardUnit();
  renderMission();
}
const award = (n = 1) => { S.stars += n; save(); };

const STEPS = {
  listen() {
    const w = M.u.words[M.ord.listen[M.i]], tok = ++TOK;
    dropRec(); M.rec = { tries: 0, state: 'idle', heard: '', url: null }; COACH.qMiss = 0; armIdle(22000);
    $('#stage').innerHTML = `<div class="card big" id="lcard"><div class="pic xl">${w.p}</div><div class="word">${hl(w.w, M.u.L)}</div></div>
      <div id="lbody" class="stage" style="padding:0"></div>`;
    paintListen();
    speakSoon(w.w, tok, 'listen');
  },
  /* two passes: first fill in the missing phonics letter of each word, then spell each whole word */
  write() {
    const u = M.u, n = u.words.length, tok = ++TOK;
    M.wmiss = 0; M.wmissed = false; M.wlock = false; M.wfill = []; COACH.qMiss = 0; armIdle(22000);
    if (!M.worder) M.worder = shuffle(u.words.map((_, i) => i));
    const pass = M.i < n ? 0 : 1;
    const w = pass === 0 ? u.words[M.ord.write[M.i]] : u.words[M.worder[M.i - n]];
    const hearBtn = '<button class="btn round" data-act="whear" aria-label="Hear the word">🔊</button>';
    const pic = `<div class="pic xl" style="font-size:min(26vw,120px)">${w.p}</div>`;
    let html;
    if (pass === 0) {
      const gi = u.L ? w.w.toLowerCase().indexOf(u.L.toLowerCase()) : 0;
      M.wcur = { w, pass, letter: w.w[gi].toLowerCase() };
      html = `<div class="card big">${pic}<div class="gapword">${esc(w.w.slice(0, gi))}<span class="gap" id="gap">&nbsp;</span>${esc(w.w.slice(gi + 1))}</div></div>
        <div class="slots">${letterChoices(w.w, gi).map(c => `<button class="ltile" data-act="wpick" data-ch="${c}">${c}</button>`).join('')}</div>
        <div class="row">${hearBtn}</div><p class="hint">Chữ cái nào còn thiếu?</p>`;
    } else {
      const letters = w.w.replace(/ /g, '').split('');
      let shuf;
      do { shuf = shuffle(letters.slice()); } while (letters.length > 1 && shuf.join('') === letters.join(''));
      shuf = shuf.map((ch, i) => ({ ch, i }));   // each tile's id is its place among the shuffled tiles
      M.wcur = { w, pass, letters: shuf, target: letters.join('') };
      if (S.write === 'keys') {
        html = `<div class="card big">${pic}</div>
          <input id="wtype" type="text" autocapitalize="off" autocorrect="off" spellcheck="false" autocomplete="off" aria-label="Type the word">
          <div class="row">${hearBtn}<button class="btn go" data-act="wcheck">Kiểm tra ✓</button></div><p class="hint" id="whint">Gõ từ này nhé.</p>`;
      } else {
        html = `<div class="card big">${pic}</div>
          <div class="slots" id="wslots">${w.w.split('').map(c => c === ' ' ? '<div class="sp"></div>' : '<div class="sl"></div>').join('')}</div>
          <div class="slots" id="wtiles">${shuf.map(l => `<button class="ltile" data-act="wletter" data-i="${l.i}">${l.ch}</button>`).join('')}</div>
          <div class="row">${hearBtn}<button class="btn" data-act="wclear">🧽 Xóa</button></div><p class="hint">Xếp các chữ cái cho đúng nhé!</p>`;
      }
    }
    $('#stage').innerHTML = html;
    speakSoon(w.w, tok, 'write');
    if (pass === 1 && S.write === 'keys') setTimeout(() => { const i = $('#wtype'); if (i && tok === TOK) i.focus(); }, 400);
  },
  point() { quizStart(shuffle(M.u.words).map(w => ({ say: w.w, target: w.w }))); },
  tick() { quizStart(shuffle(M.u.tick)); },
  chant() {
    const tok = ++TOK;
    M.cwords = M.ord.chant.map(i => M.u.words[i]);
    $('#stage').innerHTML = `<div class="chant">${M.cwords.map((w, i) => `<div class="cw" id="cw${i}"><div class="pic">${w.p}</div><div class="word">${hl(w.w, M.u.L)}</div></div>`).join('')}</div>
      <div class="row"><button class="btn go" data-act="chant">▶ Đọc nào!</button><button class="btn" data-act="nextstep">Tiếp ➜</button></div>
      <p class="hint">Vỗ tay theo nhịp nhé!</p>`;
    setTimeout(async () => { if (tok !== TOK) return; await introVi('chant'); if (tok === TOK) ACT.chant(); }, 300);
  },
  letter() {
    const ch = M.i === 0 ? M.u.L : M.u.L.toLowerCase(), tok = ++TOK;
    $('#stage').innerHTML = `<div class="trace"><canvas id="guide" aria-hidden="true"></canvas><canvas id="ink" class="ink" aria-label="Trace the letter ${ch} with your finger"></canvas></div>
      <div class="row"><button class="btn" data-act="clearink">🧽 Xóa</button><button class="btn go" id="inkdone" data-act="inkdone" disabled>Xong ✓</button></div>
      <div class="exw">${shuffle(M.u.words).map(w => `<button data-act="sayword" data-w="${esc(w.w)}"><span class="pic">${w.p}</span><span>${hl(w.w, M.u.L)}</span></button>`).join('')}</div>
      <p class="hint" id="inkhint">Dùng ngón tay tô theo nét chấm nhé!</p>`;
    traceInit(ch);
    speakSoon(letterSpeech(ch, M.u.words), tok, 'letter');
  },
  talk() {
    const t = M.talk[M.i], text = t[0].replace('{kid}', kid()), tok = ++TOK;
    $('#stage').innerHTML = `<div class="card big"><div class="pic xl" style="font-size:min(26vw,130px)">${t[1]}</div><div class="say">${esc(text)}</div></div>
      <div class="row"><button class="btn round" data-act="saytalk" aria-label="Hear it again">🔊</button><button class="btn go" data-act="talkdone">👍 Xong</button></div>
      <p class="hint">Con nói cho bố mẹ nghe, rồi bố mẹ bấm "Xong" nhé!</p>`;
    speakSoon(text, tok, 'talk');
  }
};

/* quiz engine: point and say, listen and tick, review */
function quizStart(items) { M.q = items; M.qi = 0; M.tried = false; M.lock = false; M.right = 0; quizRender(); }
function makeChoices(target) {
  const pool = M.type === 'review' ? knownList() : M.u.words, tp = (pool.find(x => x.w === target) || {}).p || IDX[target];
  const others = shuffle(pool.filter(x => x.w !== target && x.p !== tp));
  return shuffle([{ w: target, p: tp }, ...others.slice(0, 3)]);
}
function quizRender() {
  const it = M.q[M.qi], tok = ++TOK; M.lock = false; COACH.qMiss = 0; armIdle(22000);
  $('#stage').innerHTML = `<div class="prompt"><button class="btn round" data-act="hear" aria-label="Hear it again">🔊</button><span class="ptext">${esc(it.say)}</span></div>
    <div class="choices">${makeChoices(it.target).map(c => `<button class="choice" data-act="pick" data-w="${esc(c.w)}" aria-label="${esc(c.w)}"><span class="pic">${c.p}</span></button>`).join('')}</div>
    <p class="hint">${M.qi + 1} / ${M.q.length}</p>`;
  speakSoon(it.say, tok, M.steps[M.si]);
}
function quizDone() {
  if (M.type === 'review') return rewardReview();
  nextStep();
}

/* ---------- say it back: record, check, and only then move on ---------- */
const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
const REC = { denied: false, srOnly: false, srBroken: false };
let liveStop = null;
/* 'auto' = the microphone listens and checks; 'parent' = recording plays back and a grown-up decides;
   'nomic' = no microphone here, a grown-up listens and holds the thumb; 'off' = no check */
function effMode() {
  if (S.check === 'off') return 'off';
  if (S.check === 'thumb' || REC.denied) return 'nomic';
  if (S.check === 'parent' || !SR || REC.srBroken) return 'parent';
  return 'auto';
}
/*MATCH-START*/
const ALIAS = { red: ['read'], hair: ['hare'], bell: ['belle'], ball: ['bowl'] };
const norm = s => String(s).toLowerCase().replace(/'s\b/g, '').replace(/[^a-z ]/g, ' ').replace(/\s+/g, ' ').trim();
function lev(a, b) {
  const d = Array.from({ length: a.length + 1 }, (_, i) => [i]);
  for (let j = 1; j <= b.length; j++) d[0][j] = j;
  for (let i = 1; i <= a.length; i++) for (let j = 1; j <= b.length; j++)
    d[i][j] = Math.min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
  return d[a.length][b.length];
}
/* did any of the heard phrases contain the target word? Longer words allow one wrong letter. */
function matches(target, heard) {
  const t = norm(target), tw = t.split(' ');
  const okWords = [t, ...(ALIAS[t] || [])];
  for (const raw of heard) {
    const h = norm(raw); if (!h) continue;
    const hw = h.split(' ');
    if (okWords.includes(h)) return true;
    if (tw.every(w => hw.includes(w))) return true;
    if (hw.some(w => okWords.includes(w))) return true;
    if (tw.length === 1 && t.length >= 5 && hw.some(w => lev(w, t) <= 1)) return true;
  }
  return false;
}
/*MATCH-END*/
/* the microphone is opened once and kept for the whole step, so the browser asks for permission once, not for every word */
const MIC = { stream: null };
async function acquireMic() {
  if (MIC.stream && MIC.stream.getAudioTracks().some(t => t.readyState === 'live')) return MIC.stream;
  MIC.stream = await navigator.mediaDevices.getUserMedia({ audio: true });
  return MIC.stream;
}
function releaseMic() { if (MIC.stream) { try { MIC.stream.getTracks().forEach(t => t.stop()); } catch (e) {} MIC.stream = null; } }
async function listenOnce() {
  const out = { heard: [], blob: null, err: null, srErr: null, hadRecorder: false };
  let mr = null, rec = null; const chunks = [];
  const stopAll = () => {
    try { if (rec) rec.abort(); } catch (e) {}
    try { if (mr && mr.state !== 'inactive') mr.stop(); } catch (e) {}
  };
  liveStop = stopAll;
  const auto = effMode() === 'auto';
  if (!(auto && REC.srOnly)) {
    let stream;
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) throw new Error('nomic');
      stream = await acquireMic();
    } catch (e) { out.err = (e && e.name) || 'nomic'; return out; }
    if (window.MediaRecorder) {
      try { mr = new MediaRecorder(stream); mr.ondataavailable = e => { if (e.data && e.data.size) chunks.push(e.data); }; mr.start(); out.hadRecorder = true; } catch (e) { mr = null; }
    }
  }
  if (auto) {
    await new Promise(res => {
      try {
        rec = new SR(); rec.lang = 'en-US'; rec.interimResults = false; rec.maxAlternatives = 5; rec.continuous = false;
        const t = setTimeout(() => { try { rec.stop(); } catch (e) {} }, 5000);
        rec.onresult = e => { for (const r of e.results) for (const a of r) out.heard.push(a.transcript); };
        rec.onerror = e => { out.srErr = e.error || 'error'; };
        rec.onend = () => { clearTimeout(t); res(); };
        rec.start();
      } catch (e) { out.srErr = 'start'; res(); }
    });
  } else { await sleep(3500); }
  if (mr && mr.state !== 'inactive') {
    await new Promise(r => { mr.onstop = r; try { mr.stop(); } catch (e) { r(); } });
    out.blob = new Blob(chunks, { type: mr.mimeType || 'audio/mp4' });
  }
  if (liveStop === stopAll) liveStop = null;
  return out;
}
function dropUrl(r) { if (r && r.url) { try { URL.revokeObjectURL(r.url); } catch (e) {} r.url = null; } }
function dropRec() { if (M && M.rec) dropUrl(M.rec); if (M) M.rec = null; }
function holdify(el, ms, cb) {
  let t = 0; const stop = () => { clearTimeout(t); el.classList.remove('holding'); };
  el.addEventListener('pointerdown', () => { el.classList.add('holding'); t = setTimeout(() => { stop(); cb(); }, ms); });
  ['pointerup', 'pointerleave', 'pointercancel'].forEach(ev => el.addEventListener(ev, stop));
  el.addEventListener('contextmenu', e => e.preventDefault());
}
function paintListen() {
  const el = $('#lbody'); if (!el || !M || !M.rec) return;
  const r = M.rec, mode = effMode();
  const hear = '<button class="btn round" data-act="sayw" aria-label="Nghe lại">🔊</button>';
  const mine = r.url ? '<button class="btn round" data-act="myvoice" aria-label="Nghe giọng của con">▶</button>' : '';
  const hold = (id, label) => `<button class="btn go holdbtn" id="${id}">${label}</button>`;
  let html;
  if (mode === 'off') {
    html = `<div class="row">${hear}<button class="btn go" data-act="lok">Con nói xong rồi! ⭐</button></div><p class="hint">Con nói to lên nhé!</p>`;
  } else if (r.state === 'listening') {
    html = `<button class="mic live" disabled aria-label="Đang nghe">🎤</button><p class="verdict">Đang nghe…</p>`;
  } else if (r.state === 'ok') {
    html = `<p class="verdict">✅ Giỏi quá!</p><div class="row">${mine}<button class="btn go" data-act="lnext">Tiếp ➜</button></div>`;
  } else if (r.state === 'review') {
    html = `<p class="verdict">Bố mẹ nhận xét nhé:</p><div class="row">${mine}${hold('okhold', '👍 Tốt (giữ)')}<button class="btn" data-act="mic">🔁 Nói lại</button></div>`;
  } else if (mode === 'nomic') {
    html = `<p class="verdict">Con nói to lên nhé!</p><div class="row">${hear}${hold('okhold', '👍 Bố mẹ đồng ý (giữ)')}</div><p class="hint">Bố mẹ nghe con nói, rồi giữ ngón tay cái để cho con qua.</p>`;
  } else {
    const miss = r.state === 'miss';
    html = `<div class="row">${hear}<button class="mic" data-act="mic" aria-label="Ghi âm">🎤</button>${mine}</div>
      <p class="verdict">${miss ? 'Gần đúng rồi! Nghe lại và thử nữa nhé.' : 'Chạm vào micro và nói từ này nhé.'}</p>
      ${miss ? `<p class="heard">${r.heard ? 'Máy nghe thấy: ' + esc(r.heard) : 'Máy chưa nghe thấy gì.'}${r.err ? ' (' + esc(r.err) + ')' : ''}</p>` : ''}
      ${miss && r.tries >= 3 ? `<div class="row">${hold('okhold', '👍 Bố mẹ đồng ý (giữ)')}</div>` : ''}`;
  }
  el.innerHTML = html;
  const ok = $('#okhold'); if (ok) holdify(ok, 1200, lgood);
  const card = $('#lcard'); if (card) card.classList.toggle('ok', r.state === 'ok');
}
function lgood() {
  const r = M && M.rec; if (!r) return;
  r.state = 'ok';
  if (!r.awarded) { r.awarded = 1; coachRight(r.tries === 0); sfx(true); award(1); burst($('#lcard') || document.body); }
  paintListen();
}

/* letter tracing */
async function traceInit(ch, wide) {
  const guide = $('#guide'), ink = $('#ink'); if (!guide || !ink) return;
  const W = 600, H = wide ? 300 : 600; guide.width = ink.width = W; guide.height = ink.height = H;
  try { await document.fonts.load('200px Andika'); } catch (e) {}
  const fam = ' Andika, "Comic Sans MS", "Trebuchet MS", sans-serif';
  const gc = guide.getContext('2d'), ic = ink.getContext('2d');
  const mk = document.createElement('canvas'); mk.width = W; mk.height = H; const mc = mk.getContext('2d');
  let size = wide ? 220 : 420;
  mc.font = size + 'px' + fam;
  while (mc.measureText(ch).width > W * 0.9 && size > 40) { size -= 10; mc.font = size + 'px' + fam; }
  const font = size + 'px' + fam;
  const place = c => { c.font = font; c.textAlign = 'center'; c.textBaseline = 'alphabetic'; const m = c.measureText(ch); return [W / 2, H / 2 + (m.actualBoundingBoxAscent - m.actualBoundingBoxDescent) / 2]; };
  const [mx, my] = place(mc); mc.fillStyle = '#000'; mc.fillText(ch, mx, my);
  const [gx, gy] = place(gc);
  gc.fillStyle = '#e3eee7'; gc.fillText(ch, gx, gy);
  gc.setLineDash([16, 14]); gc.lineWidth = 5; gc.strokeStyle = '#6f9f85'; gc.strokeText(ch, gx, gy);
  const maskData = mc.getImageData(0, 0, W, H).data;
  ic.lineCap = ic.lineJoin = 'round'; ic.lineWidth = wide ? 26 : 36; ic.strokeStyle = '#2f9e5f'; ic.fillStyle = '#2f9e5f';
  let drawing = false, last = null;
  const pt = e => { const r = ink.getBoundingClientRect(); return [(e.clientX - r.left) * W / r.width, (e.clientY - r.top) * H / r.height]; };
  const coverage = () => {
    const d = ic.getImageData(0, 0, W, H).data; let tot = 0, hit = 0;
    for (let y = 0; y < H; y += 6) for (let x = 0; x < W; x += 6) { const k = (y * W + x) * 4 + 3; if (maskData[k] > 100) { tot++; if (d[k] > 100) hit++; } }
    return tot ? hit / tot : 0;
  };
  const need = wide ? 0.35 : 0.4;
  const check = () => {
    const ok = coverage() >= need, b = $('#inkdone'); if (!b) return;
    b.disabled = !ok; const h = $('#inkhint'); if (h) h.textContent = ok ? 'Giỏi quá! Bấm Xong nhé!' : 'Dùng ngón tay tô theo nét chấm nhé!';
  };
  ink.addEventListener('pointerdown', e => { drawing = true; last = pt(e); ic.beginPath(); ic.arc(last[0], last[1], wide ? 13 : 18, 0, 7); ic.fill(); try { ink.setPointerCapture(e.pointerId); } catch (x) {} e.preventDefault(); });
  ink.addEventListener('pointermove', e => { if (!drawing) return; const p = pt(e); ic.beginPath(); ic.moveTo(last[0], last[1]); ic.lineTo(p[0], p[1]); ic.stroke(); last = p; e.preventDefault(); });
  ['pointerup', 'pointercancel'].forEach(ev => ink.addEventListener(ev, () => { if (drawing) { drawing = false; check(); } }));
  ink._clear = () => { ic.clearRect(0, 0, W, H); check(); };
}

/* five words a day: today's five new words, kept until they are finished, so a missed day never costs anything */
const todayStr = () => { const d = new Date(); return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0'); };
function pickFw(n) {
  const learned = w => BOOK_WORDS.has(w) || !!S.words[w];
  const fresh5 = BANK_ORDER.filter(w => !learned(w) && IDX[w]).slice(0, n);
  if (fresh5.length >= n) return fresh5;
  const more = BANK_ORDER.filter(w => !fresh5.includes(w) && IDX[w]).sort((a, b) => ((S.words[a] || {}).box || 0) - ((S.words[b] || {}).box || 0));
  return fresh5.concat(more.slice(0, n - fresh5.length));
}
function fwToday() {
  const f = S.fw || (S.fw = { date: '', words: [], done: false, days: 0 });
  if (f.date === todayStr() && f.words.length) return f;
  if (f.words.length && !f.done) { f.date = todayStr(); save(); return f; }
  f.words = pickFw(5); f.date = todayStr(); f.done = false; save();
  return f;
}
function startDaily() {
  const fw = fwToday();
  const words = fw.words.map(w => ({ w, p: IDX[w], t: WT[w] || 'c' }));
  startUnitObj({ n: 'daily', k: 0, extra: true, daily: true, icon: '🌟', vi: '5 từ mỗi ngày', title: '5 words a day', L: null, words,
    tick: words.map(x => ({ say: sayFor(x.w), target: x.w })), talkList: [] });
}
function rewardDaily() {
  const f = fwToday(), first = !f.done;
  f.done = true; if (first) f.days = (f.days || 0) + 1;
  award(first ? 5 : 2);
  const gained = S.stars - M.gain0, lvUp = level() > M.lv0;
  view = 'reward';
  app.innerHTML = topbar() + `<main class="reward"><div class="egg pop" id="egg" aria-hidden="true">🌟</div><h2>Xong 5 từ hôm nay!</h2><p>⭐ +${gained}${lvUp ? ' · 💪 Lên cấp sức mạnh!' : ''}</p><p>Con đã học ${f.days} ngày. Mai gặp lại nhé!</p>
    <button class="btn go" data-act="home">Về bản đồ</button></main>`;
  cheer(lvUp ? 'level' : 'daily', true);
  sfx(true); burst($('#egg')); say(`Great job, ${kid()}! See you tomorrow!`);
}

/* rewards */
function rewardUnit() {
  if (M.u.daily) return rewardDaily();
  const u = M.u, n = u.n, first = !S.done[n];
  S.done[n] = 1; award(first ? 5 : 2);
  const gained = S.stars - M.gain0, lvUp = level() > M.lv0;
  view = 'reward';
  app.innerHTML = topbar() + `<main class="reward"><div class="egg wob" id="egg" aria-hidden="true">🥚</div><h2 id="rt">Đang nở…</h2><p>⭐ +${gained}${lvUp ? ' · 💪 Lên cấp sức mạnh!' : ''}</p>
    <button class="btn go" data-act="home">Về bản đồ</button></main>`;
  cheer(lvUp ? 'level' : 'unit', true);
  const tok = ++TOK;
  sleep(1700).then(() => {
    if (tok !== TOK || view !== 'reward') return;
    const e = $('#egg'); if (!e) return;
    e.classList.remove('wob'); e.classList.add('pop'); e.textContent = u.k % 2 ? '🦖' : '🦕'; e.style.filter = `hue-rotate(${u.k * 23}deg)`;
    $('#rt').textContent = `${DINO} đã nở! Xong ${u.extra ? u.title : 'Unit ' + n}!`;
    sfx(true); burst(e); say(`Great job, ${kid()}!`);
  });
}
function rewardReview() {
  award(3);
  const gained = S.stars - M.gain0, lvUp = level() > M.lv0;
  view = 'reward';
  app.innerHTML = topbar() + `<main class="reward"><div class="egg pop" id="egg" aria-hidden="true">💪</div><h2>Tăng sức mạnh xong!</h2><p>⭐ +${gained}${lvUp ? ' · Lên cấp sức mạnh!' : ''}</p>
    <button class="btn go" data-act="home">Về bản đồ</button></main>`;
  cheer(lvUp ? 'level' : 'great', true);
  sfx(true); burst($('#egg')); say(`Super strong, ${kid()}!`);
}

/* grown-up panel */
function bindGate() {
  const g = $('#gate'); if (!g) return;
  let t = 0;
  const stop = () => { clearTimeout(t); g.classList.remove('holding'); };
  g.addEventListener('pointerdown', () => { g.classList.add('holding'); t = setTimeout(() => { stop(); openPanel(); }, 1200); });
  ['pointerup', 'pointerleave', 'pointercancel'].forEach(ev => g.addEventListener(ev, stop));
  g.addEventListener('contextmenu', e => e.preventDefault());
}
function syncText() {
  return syncState === 'account'
    ? 'Tiến độ được lưu vào tài khoản Claude, nên dùng được cả trên iPad và máy tính.'
    : 'Tiến độ chỉ được lưu trên thiết bị này. Mở trang khi đã đăng nhập Claude để đồng bộ.';
}
function openPanel() {
  const o = $('#overlay'), en = pickVoice(), vi = viVoice(), nclips = window.WORD_AUDIO ? Object.keys(window.WORD_AUDIO).length : 0;
  o.hidden = false;
  o.innerHTML = `<div class="panel" role="dialog" aria-label="Cài đặt cho phụ huynh"><h2>Dành cho phụ huynh</h2>
    <label for="pname">Tên của bé</label><input id="pname" type="text" maxlength="20" value="${esc(S.name)}">
    <label for="pnick">Biệt danh ở nhà (dùng khi khen và nhắc)</label><input id="pnick" type="text" maxlength="20" value="${esc(S.nick || '')}" placeholder="${esc(S.name || 'Biệt danh')}">
    <label for="pcoach">Lời khen và nhắc nhở</label>
    <select id="pcoach"><option value="on" ${S.coach === false ? '' : 'selected'}>Bật</option><option value="off" ${S.coach === false ? 'selected' : ''}>Tắt</option></select>
    <label for="ppraise">Thêm lời khen của riêng bạn (mỗi dòng một câu, dùng {n} cho biệt danh)</label>
    <textarea id="ppraise" rows="3" placeholder="{n} yêu giỏi quá!">${esc((S.praise || []).join('\n'))}</textarea>
    <label for="pnudge">Thêm lời nhắc nhở của riêng bạn</label>
    <textarea id="pnudge" rows="3" placeholder="{n} thối tập trung nào!">${esc((S.nudge || []).join('\n'))}</textarea>
    <div class="row"><button class="btn" data-act="coachpreview" data-k="streak3">👀 Xem thử lời khen</button><button class="btn" data-act="coachpreview" data-k="nudge3">👀 Xem thử lời nhắc</button></div>
    <label for="pcheck">Kiểm tra phát âm (bước Nghe và nhắc lại)</label>
    <select id="pcheck"><option value="thumb" ${S.check === 'thumb' ? 'selected' : ''}>Phụ huynh nghe và giữ ngón tay cái (không dùng micro)</option><option value="auto" ${S.check === 'auto' ? 'selected' : ''}>Micro nghe và kiểm tra từ (khuyên dùng)</option><option value="parent" ${S.check === 'parent' ? 'selected' : ''}>Ghi âm, rồi phụ huynh quyết định</option><option value="off" ${S.check === 'off' ? 'selected' : ''}>Tắt</option></select>
    <p class="sync">Hai chế độ dùng micro sẽ xin quyền dùng micro (chọn Cho phép). Chế độ tự động gửi âm thanh tới dịch vụ giọng nói của trình duyệt (Apple hoặc Google). Bản ghi âm chỉ nằm trong bộ nhớ để nghe lại và không bao giờ được lưu.</p>
    <label for="pwrite">Bước Viết (đánh vần cả từ)</label>
    <select id="pwrite"><option value="tiles" ${S.write !== 'keys' ? 'selected' : ''}>Chạm vào các chữ cái</option><option value="keys" ${S.write === 'keys' ? 'selected' : ''}>Gõ bằng bàn phím</option></select>
    <label for="pvi">Đọc hướng dẫn bằng giọng tiếng Việt</label>
    <select id="pvi" ${vi ? '' : 'disabled'}><option value="off" ${S.viSpeak ? '' : 'selected'}>Tắt (chỉ hiện chữ)</option><option value="on" ${S.viSpeak ? 'selected' : ''}>Bật</option></select>
    <p class="sync">${vi ? 'Giọng tiếng Việt tìm thấy: ' + esc(vi.name) : 'Thiết bị này không có giọng đọc tiếng Việt, nên hướng dẫn chỉ hiện trên màn hình.'}</p>
    <label for="pvoice">Giọng đọc tiếng Anh</label>
    <select id="pvoice"><option value="">Tự chọn giọng tốt nhất</option>${englishVoices().map(v => `<option value="${esc(voiceKey(v))}" ${S.voice === voiceKey(v) ? 'selected' : ''}>${esc(v.name)} (${esc(v.lang)})</option>`).join('')}</select>
    <p class="sync">Giọng có chữ "Enhanced" hoặc "Premium" nghe tự nhiên hơn. Trên iPad, tải thêm ở: Cài đặt › Trợ năng › Nội dung được đọc › Giọng nói › Tiếng Anh (Settings › Accessibility › Spoken Content › Voices › English), rồi mở lại trang này.</p>
    <label for="prate">Tốc độ giọng đọc tiếng Anh</label><input id="prate" type="range" min="0.6" max="1.1" step="0.05" value="${S.rate}">
    <button class="btn" data-act="testvoice">🔊 Thử giọng</button>
    <p class="sync">Giọng máy đang dùng: ${en ? esc(en.name) + ' (' + esc(en.lang) + ')' : 'không tìm thấy, dùng giọng mặc định của thiết bị'}</p>
    <p class="sync">${nclips ? 'Bản ghi âm giọng người thật: ' + nclips + ' từ. Các từ còn lại dùng giọng máy.' : 'Chưa có thư mục audio, nên mọi từ dùng giọng máy.'}</p>
    <p class="sync">${syncText()}</p>
    <button class="btn danger" id="reset" data-act="reset">Xóa toàn bộ tiến độ</button>
    <button class="btn go" data-act="closepanel">Lưu và đóng</button></div>`;
}
let resetArmed = 0;

/* ---------- Starters-style practice: original questions in the Cambridge Starters test formats ---------- */
/*SP-START*/
const PIC = (w, p, t = 'c') => ({ w, p, t });   // t: c = a/an noun, m = no article, p = plural, x = left out of tick-or-cross
const POOL = [
  PIC('dog','🐶'), PIC('cat','🐱'), PIC('duck','🦆'), PIC('bird','🐦'), PIC('fish','🐟'), PIC('frog','🐸'), PIC('horse','🐴'), PIC('monkey','🐵'),
  PIC('mouse','🐭'), PIC('cow','🐄'), PIC('sheep','🐑'), PIC('lion','🦁'), PIC('elephant','🐘'), PIC('tiger','🐯'), PIC('turtle','🐢'), PIC('spider','🕷️'),
  PIC('apple','🍎'), PIC('banana','🍌'), PIC('cake','🍰'), PIC('egg','🥚'), PIC('orange','🍊'), PIC('ice cream','🍦'),
  PIC('milk','🥛','m'), PIC('bread','🍞','m'), PIC('rice','🍚','m'), PIC('water','💧','m'),
  PIC('ball','🏀'), PIC('bike','🚲'), PIC('kite','🪁'), PIC('car','🚗'), PIC('bus','🚌'), PIC('boat','⛵'), PIC('plane','✈️'), PIC('train','🚂'), PIC('teddy bear','🧸'),
  PIC('book','📖'), PIC('pen','🖊️'), PIC('pencil','✏️'), PIC('bag','🎒'), PIC('clock','🕒'), PIC('door','🚪'), PIC('window','🪟'), PIC('chair','🪑'), PIC('bed','🛏️'), PIC('cup','🥤'),
  PIC('sun','☀️','x'), PIC('hat','👒'), PIC('dress','👗'), PIC('shirt','👕'),
  PIC('shoes','👟👟','p'), PIC('socks','🧦🧦','p'), PIC('chips','🍟','p'),
  PIC('hand','✋'), PIC('ear','👂'), PIC('eye','👁️'), PIC('nose','👃'), PIC('mouth','👄'), PIC('foot','🦶')
];
const PW = {}; POOL.forEach(x => { PW[x.w] = x; });
const rnd = n => Math.floor(Math.random() * n);
const pickOne = a => a[rnd(a.length)];
const sample = (a, k) => shuffle(a).slice(0, k);
const NUMW = ['zero','one','two','three','four','five','six','seven','eight','nine','ten','eleven','twelve','thirteen','fourteen','fifteen','sixteen','seventeen','eighteen','nineteen','twenty'];
const COLS = { red: '#e63946', blue: '#2f6bff', green: '#2fbf71', yellow: '#ffc93c', orange: '#ff8c42', pink: '#ff8fb1', purple: '#8a5cf6', brown: '#8d5a2b', black: '#2b2b2b', white: '#ffffff', grey: '#9aa5a0' };
const NAT = { apple: 'red', banana: 'yellow', frog: 'green', orange: 'orange', milk: 'white', egg: 'white', sun: 'yellow', elephant: 'grey', turtle: 'green' };
const COUNTABLE = [['cat','cats'],['dog','dogs'],['duck','ducks'],['bird','birds'],['apple','apples'],['banana','bananas'],['ball','balls'],['book','books'],['hat','hats'],['car','cars'],['kite','kites'],['cake','cakes'],['frog','frogs']];
const SCR = ['cat','dog','sun','hat','bus','bed','egg','pen','cup','bag','fish','duck','frog','milk','cake','book','bike','ball','kite','bird','door','hand','nose','boat','horse','mouse','bread','chair','clock','apple'];
const statement = it => it.t === 'p' ? `These are ${it.w}.` : it.t === 'm' ? `This is ${it.w}.` : `This is ${art(it.w)}.`;
/* words for the spelling games: the ones he has met first, topped up so there are always enough */
function spellPool(minLen, maxLen) {
  const ok = w => /^[a-z]+$/.test(w) && w.length >= minLen && w.length <= maxLen && IDX[w];
  const pool = Object.keys(S.words).filter(ok);
  const book = UNITS.filter(u => !u.extra).flatMap(u => u.words.map(x => x.w));
  for (const w of shuffle(book)) if (pool.length < 12 && ok(w) && !pool.includes(w)) pool.push(w);
  for (const w of shuffle(BANK_ORDER)) if (pool.length < 12 && ok(w) && !pool.includes(w)) pool.push(w);
  return pool;
}
const GEN = {
  /* Reading and writing, part 1: is the sentence about the picture right? */
  tick() {
    const pool = POOL.filter(x => x.t !== 'x');
    return Array.from({ length: 5 }, () => {
      const it = pickOne(pool), truth = Math.random() < 0.5;
      const other = pickOne(pool.filter(x => x.t === it.t && x.w !== it.w));
      return { kind: 'tf', pic: it.p, say: statement(truth ? it : other), answer: truth };
    });
  },
  /* Reading and writing, part 2: yes or no questions about colours and numbers */
  yesno() {
    const qs = [], nat = Object.keys(NAT);
    for (let i = 0; i < 5; i++) {
      const truth = Math.random() < 0.5;
      if (i % 2 === 0) {
        const w = pickOne(nat), c = truth ? NAT[w] : pickOne(Object.keys(COLS).filter(x => x !== NAT[w]));
        qs.push({ kind: 'tf', yn: true, pic: PW[w].p, say: `Is the ${w} ${c}?`, answer: truth });
      } else {
        const [w, pl] = pickOne(COUNTABLE), n = 1 + rnd(5);
        const asked = truth ? n : pickOne([1, 2, 3, 4, 5].filter(x => x !== n));
        qs.push({ kind: 'tf', yn: true, pic: PW[w].p.repeat(n), say: asked === 1 ? `Is there one ${w}?` : `Are there ${NUMW[asked]} ${pl}?`, answer: truth });
      }
    }
    return shuffle(qs);
  },
  /* Reading and writing, part 3: put the jumbled letters in order */
  unscramble() {
    return sample(SCR, 5).map(w => {
      let l; do { l = shuffle(w.split('')); } while (l.join('') === w);
      return { kind: 'scr', w, p: PW[w].p, letters: l.map((ch, i) => ({ ch, i })), say: w };
    });
  },
  /* Listening, part 4: colour the thing the right colour */
  colour() {
    return Array.from({ length: 5 }, () => {
      const items = sample(POOL.filter(x => x.t === 'c'), 3), target = pickOne(items);
      const colour = pickOne(Object.keys(COLS).filter(c => c !== 'white' && c !== 'grey'));
      const chips = shuffle([colour, ...sample(Object.keys(COLS).filter(c => c !== colour), 4)]);
      return { kind: 'col', items, target: target.w, colour, chips, say: `Colour the ${target.w} ${colour}.` };
    });
  },
  /* Listening, part 4: in, on, under */
  where() {
    const ws = ['cat', 'dog', 'duck', 'frog', 'mouse', 'ball', 'bird', 'monkey', 'teddy bear'];
    return Array.from({ length: 5 }, () => {
      const w = pickOne(ws), target = pickOne(['in', 'on', 'under']);
      return { kind: 'where', w, p: PW[w].p, target, say: `The ${w} is ${target} the ${target === 'in' ? 'box' : 'table'}.`, scenes: shuffle(['in', 'on', 'under']) };
    });
  },
  /* spelling: pick the missing letter, anywhere in the word */
  gap() {
    return sample(spellPool(3, 7), 5).map(w => {
      const gi = rnd(w.length);
      return { kind: 'gap', w, p: IDX[w], gi, say: w, choices: letterChoices(w, gi) };
    });
  },
  /* spelling: put the jumbled letters of a word he knows in order */
  scramble() {
    return sample(spellPool(3, 7), 5).map(w => {
      let l; do { l = shuffle(w.split('')); } while (l.join('') === w);
      return { kind: 'scr', w, p: IDX[w], letters: l.map((ch, i) => ({ ch, i })), say: w };
    });
  },
  /* spelling: look at the word, cover it, write it from memory, check */
  copy() {
    const abc = 'abcdefghijklmnopqrstuvwxyz'.split('');
    return sample(spellPool(3, 6), 5).map(w => {
      const extra = sample(abc.filter(c => !w.includes(c)), 2);
      return { kind: 'lcwc', w, p: IDX[w], say: w, tiles: shuffle(w.split('').concat(extra)).map((ch, i) => ({ ch, i })) };
    });
  },
  /* spelling: the app writes the whole word in dots, he traces it */
  trace() { return sample(spellPool(3, 6), 4).map(w => ({ kind: 'trace', w, p: IDX[w], say: w })); },
  /* Listening, part 2: hear a number, tap it */
  number() {
    const all = Array.from({ length: 20 }, (_, i) => i + 1);
    return Array.from({ length: 5 }, () => {
      const n = pickOne(all);
      return { kind: 'num', n, say: NUMW[n], choices: shuffle([n, ...sample(all.filter(x => x !== n), 3)]) };
    });
  }
};
function sceneSVG(s, e) {
  const t = y => `<text x="50" y="${y}" text-anchor="middle" font-size="40">${e}</text>`;
  const table = top => `<rect x="10" y="${top}" width="80" height="8" rx="2" fill="#a8702f"/><rect x="16" y="${top + 8}" width="7" height="${80 - top}" fill="#8a5a2b"/><rect x="77" y="${top + 8}" width="7" height="${80 - top}" fill="#8a5a2b"/>`;
  const inner = s === 'in' ? t(66) + '<rect x="18" y="62" width="64" height="30" rx="4" fill="#c98a45"/><rect x="14" y="58" width="72" height="8" rx="3" fill="#a8702f"/>'
    : s === 'on' ? t(58) + table(58) : table(24) + t(84);
  return `<svg class="scene" viewBox="0 0 100 100" aria-hidden="true">${inner}</svg>`;
}
/*SP-END*/
const SPK = {
  tick: { title: 'Đúng hay sai', en: 'Tick or cross', part: 'Đọc và viết · Phần 1', icon: '✅', group: 'starters' },
  yesno: { title: 'Có hay không', en: 'Yes or no', part: 'Đọc và viết · Phần 2', icon: '🙋', group: 'starters' },
  unscramble: { title: 'Xếp chữ cái', en: 'Mixed-up letters', part: 'Đọc và viết · Phần 3', icon: '🔤', group: 'starters' },
  colour: { title: 'Nghe và tô màu', en: 'Listen and colour', part: 'Nghe · Phần 4', icon: '🎨', group: 'starters' },
  where: { title: 'Nó ở đâu?', en: 'Where is it?', part: 'Nghe · Phần 4', icon: '📦', group: 'starters' },
  number: { title: 'Nghe và chọn số', en: 'Listen and tap the number', part: 'Nghe · Phần 2', icon: '🔢', group: 'starters' },
  gap: { title: 'Chọn chữ còn thiếu', en: 'Missing letter', part: 'Từ con đã học', icon: '🔡', group: 'spell' },
  scramble: { title: 'Xếp chữ thành từ', en: 'Unscramble', part: 'Từ con đã học', icon: '🔀', group: 'spell' },
  copy: { title: 'Nhìn, che, viết', en: 'Look, cover, write', part: 'Từ con đã học', icon: '✍️', group: 'spell' },
  trace: { title: 'Tô cả từ', en: 'Trace the word', part: 'Từ con đã học', icon: '🖍️', group: 'spell', n: 4 }
};
function practiceMenu() {
  view = 'practice';
  const tints = ['#ef6f88', '#7a55e8', '#f0a63a', '#45a0ca', '#3ba3b4', '#58c46e'];
  const cards = g => Object.entries(SPK).filter(([k, i]) => i.group === g).map(([k, i], n) => `
      <button class="unit" data-act="spstart" data-key="${k}" style="--tint:${tints[n % tints.length]}">
        <span class="letters">${i.icon}</span><span class="uname"><b>${i.title}</b><br>${i.en} · ${i.part}</span>
        <span class="uname">⭐ cao nhất ${(S.sp && S.sp[k]) || 0} / ${i.n || 5}</span></button>`).join('');
  app.innerHTML = topbar() + `<section class="hello"><div><h1>Luyện tập</h1><p>Mỗi trò chơi có vài câu hỏi ngắn</p></div><button class="btn" data-act="home">⬅ Quay lại</button></section>
    <h2 class="sec">Luyện viết từ</h2>
    <section class="map">${cards('spell')}</section>
    <h2 class="sec">Giống bài thi Starters</h2>
    <section class="map">${cards('starters')}</section>`;
}
function startSP(key) {
  M = { type: 'sp', key, qs: GEN[key](), qi: 0, right: 0, miss: false, lock: false, gain0: S.stars, lv0: level() };
  view = 'mission'; renderSP();
}
function renderSP() {
  const tok = ++TOK, info = SPK[M.key], q = M.qs[M.qi];
  M.lock = false; M.miss = false; M.sel = null; M.fill = []; M.phase = 'look'; M.cmiss = 0; M.relook = false; M.cfill = []; COACH.qMiss = 0; armIdle(22000);
  app.innerHTML = `<header class="mhead"><button class="x" data-act="practice" aria-label="Back to practice">✕</button>
    <div class="mtitle"><h2>${info.title}</h2><p>${info.en} · ${info.part}</p></div>
    <div class="dots" aria-hidden="true">${M.qs.map((_, i) => `<i class="${i < M.qi ? 'on' : i === M.qi ? 'now' : ''}"></i>`).join('')}</div></header>
    <main class="stage" id="stage"></main>`;
  const hear = '<button class="btn round" data-act="sphear" aria-label="Hear it again">🔊</button>';
  const three = 'style="grid-template-columns:repeat(3,minmax(0,1fr))"';
  let html;
  if (q.kind === 'tf') {
    const lab = q.yn ? ['Yes', 'No'] : ['✔️', '✖️'];
    html = `<div class="card big"><div class="pic xl" style="font-size:min(30vw,150px)">${q.pic}</div><div class="say">${esc(q.say)}</div></div>
      <div class="tf"><button class="yes" data-act="sptf" data-a="1" aria-label="${q.yn ? 'Yes' : 'Right'}">${lab[0]}</button><button class="no" data-act="sptf" data-a="0" aria-label="${q.yn ? 'No' : 'Wrong'}">${lab[1]}</button></div>
      <div class="row">${hear}</div>`;
  } else if (q.kind === 'scr') {
    html = `<div class="card big"><div class="pic xl" style="font-size:min(28vw,130px)">${q.p}</div></div>
      <div class="slots" id="slots">${q.w.split('').map(() => '<div class="sl"></div>').join('')}</div>
      <div class="slots" id="tiles">${q.letters.map(l => `<button class="ltile" data-act="spletter" data-i="${l.i}">${l.ch}</button>`).join('')}</div>
      <div class="row">${hear}<button class="btn" data-act="spclear">🧽 Xóa</button></div>`;
  } else if (q.kind === 'col') {
    html = `<div class="prompt">${hear}<span class="ptext">${esc(q.say)}</span></div>
      <div class="choices" ${three}>${q.items.map(it => `<button class="choice grey" style="font-size:min(18vw,90px)" data-act="spobj" data-w="${esc(it.w)}" aria-label="${esc(it.w)}"><span class="pic">${it.p}</span></button>`).join('')}</div>
      <div class="chips">${q.chips.map(c => `<button class="chip" data-act="spchip" data-c="${c}"><i style="background:${COLS[c]}"></i>${c}</button>`).join('')}</div>
      <p class="hint">Chọn màu, rồi chạm vào hình.</p>`;
  } else if (q.kind === 'where') {
    html = `<div class="prompt">${hear}<span class="ptext">${esc(q.say)}</span></div>
      <div class="choices" ${three}>${q.scenes.map(s => `<button class="choice" data-act="spscene" data-s="${s}" aria-label="${s}">${sceneSVG(s, q.p)}</button>`).join('')}</div>`;
  } else if (q.kind === 'gap') {
    html = `<div class="card big"><div class="pic xl" style="font-size:min(26vw,120px)">${q.p}</div><div class="gapword">${esc(q.w.slice(0, q.gi))}<span class="gap" id="gap">&nbsp;</span>${esc(q.w.slice(q.gi + 1))}</div></div>
      <div class="slots">${q.choices.map(c => `<button class="ltile" data-act="spgap" data-ch="${c}">${c}</button>`).join('')}</div>
      <div class="row">${hear}</div><p class="hint">Chữ cái nào còn thiếu?</p>`;
  } else if (q.kind === 'lcwc') {
    html = `<div class="card big" id="ccard"><div class="pic xl" style="font-size:min(26vw,120px)">${q.p}</div><div class="word" id="cword"></div></div><div id="cbody" class="stage" style="padding:0"></div>`;
  } else if (q.kind === 'trace') {
    html = `<div class="card big" style="padding:8px 16px"><div class="pic" style="font-size:min(16vw,72px)">${q.p}</div></div>
      <div class="trace wide"><canvas id="guide" aria-hidden="true"></canvas><canvas id="ink" class="ink" aria-label="Tô theo từ ${esc(q.w)} bằng ngón tay"></canvas></div>
      <div class="row"><button class="btn round" data-act="sphear" aria-label="Nghe lại">🔊</button><button class="btn" data-act="clearink">🧽 Xóa</button><button class="btn go" id="inkdone" data-act="sptrace" disabled>Xong ✓</button></div>
      <p class="hint" id="inkhint">Dùng ngón tay tô theo nét chấm nhé!</p>`;
  } else {
    html = `<div class="prompt">${hear}<span class="ptext">Nghe và chạm vào số.</span></div>
      <div class="choices">${q.choices.map(n => `<button class="choice numchoice" data-act="spnum" data-n="${n}">${n}</button>`).join('')}</div>`;
  }
  $('#stage').innerHTML = html + `<p class="hint">${M.qi + 1} / ${M.qs.length}</p>`;
  if (q.kind === 'lcwc') paintCopy();
  if (q.kind === 'trace') traceInit(q.w, true);
  speakSoon(q.say, tok);
}
function spOK(el) {
  if (M.lock) return;
  M.lock = true; sfx(true); if (el) burst(el);
  coachRight(!M.miss);
  if (!M.miss) { M.right++; award(1); }
  setTimeout(() => { M.qi++; if (M.qi >= M.qs.length) spDone(); else renderSP(); }, 1000);
}
function spBad(el) {
  sfx(false); M.miss = true; coachWrong();
  if (el) { el.classList.remove('shake'); void el.offsetWidth; el.classList.add('shake'); }
}
function spDone() {
  const n = M.qs.length;
  if (M.right >= n - 1) award(2);
  S.sp = S.sp || {}; S.sp[M.key] = Math.max(S.sp[M.key] || 0, M.right); save();
  const gained = S.stars - M.gain0, lvUp = level() > M.lv0;
  view = 'reward';
  app.innerHTML = topbar() + `<main class="reward"><div class="egg pop" aria-hidden="true">${M.right === n ? '🏆' : M.right >= 3 ? '🏅' : '💪'}</div>
    <h2>Đúng ngay lần đầu: ${M.right}/${n}!</h2><p>⭐ +${gained}${lvUp ? ' · 💪 Lên cấp sức mạnh!' : ''}</p>
    <div class="row"><button class="btn go" data-act="spagain">Chơi lại</button><button class="btn" data-act="practice">Luyện thêm</button></div></main>`;
  cheer(lvUp ? 'level' : M.right >= n - 1 ? 'great' : 'tryagain', true);
  sfx(true); burst($('.egg')); say(M.right >= 4 ? `Super, ${kid()}!` : `Good try, ${kid()}!`);
}

/* look, cover, write, check: the word is shown, then hidden, and he writes it from memory */
function paintCopy() {
  const q = M.qs[M.qi], body = $('#cbody'), word = $('#cword'); if (!body || !word) return;
  const hear = '<button class="btn round" data-act="sphear" aria-label="Nghe lại">🔊</button>';
  if (M.phase === 'look') {
    word.textContent = q.w;
    body.innerHTML = `<div class="row">${hear}<button class="btn go" data-act="spcover">✋ Che lại</button></div>
      <p class="hint">${M.relook ? 'Nhìn kỹ lại nhé, rồi che lại và viết!' : 'Nhìn kỹ từ này, rồi che lại và viết nhé!'}</p>`;
  } else {
    word.textContent = '';
    if (S.write === 'keys') {
      body.innerHTML = `<input id="wtype" type="text" autocapitalize="off" autocorrect="off" spellcheck="false" autocomplete="off" aria-label="Gõ từ">
        <div class="row">${hear}<button class="btn go" data-act="spcheck">Kiểm tra ✓</button></div><p class="hint" id="whint">Viết lại từ con vừa nhìn nhé.</p>`;
      setTimeout(() => { const i = $('#wtype'); if (i) i.focus(); }, 300);
    } else {
      body.innerHTML = `<div class="slots" id="cslots">${q.w.split('').map(() => '<div class="sl"></div>').join('')}</div>
        <div class="slots" id="ctiles">${q.tiles.map(l => `<button class="ltile" data-act="spcw" data-i="${l.i}">${l.ch}</button>`).join('')}</div>
        <div class="row">${hear}<button class="btn" data-act="spcclear">🧽 Xóa</button></div><p class="hint">Viết lại từ con vừa nhìn nhé.</p>`;
    }
  }
}
function copyMiss(el) {
  spBad(el); M.cmiss++;
  setTimeout(() => {
    if (M.lock) return;
    if (M.cmiss >= 2) { M.phase = 'look'; M.relook = true; paintCopy(); }   // two misses: look at the word again
    else { ACT.spcclear(); const i = $('#wtype'); if (i) i.value = ''; }
  }, 700);
}

/*WR-START*/
/* letters that look or sound alike, used as wrong answers when a letter is missing */
const CONFUSE = { b: 'd', d: 'b', p: 'q', q: 'p', m: 'n', n: 'm', u: 'n', i: 'l', l: 'i', e: 'a', a: 'e', o: 'a', c: 'e', g: 'q', t: 'f', f: 't', h: 'n', w: 'v', v: 'w' };
function letterChoices(word, idx) {
  const correct = word[idx].toLowerCase(), set = [correct], twin = CONFUSE[correct];
  if (twin && twin !== correct) set.push(twin);
  const abc = 'abcdefghijklmnopqrstuvwxyz'.split('');
  while (set.length < 4) { const x = abc[Math.floor(Math.random() * 26)]; if (!set.includes(x)) set.push(x); }
  return shuffle(set);
}
/*WR-END*/
function writeOK(el) {
  sfx(true); if (el) burst(el);
  coachRight(!M.wmissed);
  if (!M.wmissed) award(1);
  setTimeout(() => { M.i++; if (M.i >= M.u.words.length * 2) nextStep(); else STEPS.write(); }, 900);
}
function writeBad(el) {
  sfx(false); M.wmissed = true; M.wmiss++; coachWrong();
  if (el) { el.classList.remove('shake'); void el.offsetWidth; el.classList.add('shake'); }
  if (M.wmiss >= 2 && M.wcur.target) document.querySelectorAll('#wslots .sl').forEach((s, k) => { s.dataset.ghost = M.wcur.target[k]; });
}

/* ---------- the coach: praise, gentle nudges, and a call back when he drifts off ---------- */
/* {n} is replaced by his pet name (or his name). Lines you add in the grown-up settings are mixed in with these. */
const BANK = {
  streak3: ['{n} yêu giỏi quá!', 'Hay quá, đúng liền 3 câu rồi!', 'Giỏi lắm {n} ơi!'],
  streak5: ['Wow, 5 câu liền luôn! {n} giỏi quá trời!', 'Đúng liền 5 câu, tuyệt vời!', '{n} đang chạy như tên lửa luôn!'],
  streak8: ['Siêu quá! Bố mẹ tự hào về {n} lắm!', 'Đúng liền nhiều câu quá, đỉnh quá {n} ơi!', '{n} giỏi như siêu nhân vậy!'],
  comeback: ['Đấy, {n} làm được rồi! Cố gắng là giỏi!', 'Sai rồi sửa lại được, giỏi lắm!', 'Thấy chưa, cố một chút là đúng ngay!'],
  nudge2: ['Từ từ nào {n}, nghe kỹ rồi chọn nhé!', 'Bình tĩnh nào, nhìn kỹ lại hình nhé!', 'Không sao đâu, thử lại nào {n}!'],
  nudge3: ['{n} thối tập trung nào!', 'Tập trung nào {n} ơi, mình làm được mà!', 'Nhìn kỹ, nghe kỹ nhé {n}!'],
  idle: ['Ơ, {n} đâu rồi? Tập trung nào!', '{n} ơi, mình học tiếp nhé!', 'Nào nào, làm tiếp thôi {n} ơi!'],
  rest: ['Mình hít thở một chút rồi làm tiếp nhé {n}!', 'Mệt thì nghỉ xíu, rồi mình làm lại nhé!'],
  unit: ['Xong bài rồi! {n} yêu giỏi quá!', 'Hoàn thành rồi, bố mẹ khen {n} nhiều lắm!', 'Giỏi quá, {n} nhận được một chú khủng long nè!'],
  level: ['Lên cấp rồi! {n} mạnh như siêu nhân luôn!', 'Wow, sức mạnh tăng lên rồi {n} ơi!'],
  daily: ['Xong 5 từ hôm nay! Mai mình học tiếp nhé {n}!', '{n} học đều mỗi ngày, giỏi lắm!'],
  great: ['Xuất sắc! {n} làm gần đúng hết rồi!', 'Giỏi quá {n} ơi, lại một trò xong nè!'],
  tryagain: ['Không sao, mình chơi lại để giỏi hơn nhé {n}!', 'Cố lên {n}, lần sau sẽ giỏi hơn nữa!']
};
const NUDGE_KINDS = new Set(['nudge2', 'nudge3', 'idle', 'rest', 'tryagain']);
const COACH = { streak: 0, wrongRun: 0, qMiss: 0, lastAt: 0, last: '', hide: 0, idleT: 0, idleN: 0, busy: null, noIdle: false };
const nick = () => S.nick || S.name || 'con';
function coachEl() {
  let e = $('#coach');
  if (!e) { e = document.createElement('div'); e.id = 'coach'; e.setAttribute('role', 'status'); e.setAttribute('aria-live', 'polite'); document.body.appendChild(e); }
  return e;
}
function pickMsg(kind) {
  const pool = (BANK[kind] || []).concat(NUDGE_KINDS.has(kind) ? (S.nudge || []) : (S.praise || []));
  if (!pool.length) return '';
  let t, tries = 0;
  do { t = pool[Math.floor(Math.random() * pool.length)]; tries++; } while (pool.length > 1 && t === COACH.last && tries < 8);
  COACH.last = t;
  return t.replace(/\{n\}/g, nick());
}
/* show a message in a speech bubble; ordinary ones wait at least 6 seconds apart so he is not nagged */
function cheer(kind, force) {
  if (S.coach === false) return;
  const now = Date.now();
  if (!force && now - COACH.lastAt < 6000) return;
  const text = pickMsg(kind); if (!text) return;
  COACH.lastAt = now;
  const warn = NUDGE_KINDS.has(kind), el = coachEl();
  el.className = warn ? 'warn' : '';
  el.innerHTML = `<span class="cemo">${warn ? '💬' : '🌟'}</span><span></span>`;
  el.lastChild.textContent = text;
  void el.offsetWidth; el.classList.add('show');
  clearTimeout(COACH.hide); COACH.hide = setTimeout(() => el.classList.remove('show'), 4500);
  if (S.viSpeak && viVoice()) COACH.busy = sayVi(text);
  return text;
}
function coachRight(first) {
  COACH.wrongRun = 0;
  if (first) {
    COACH.streak++;
    if (COACH.streak === 3) cheer('streak3');
    else if (COACH.streak === 5) cheer('streak5');
    else if (COACH.streak >= 8 && (COACH.streak - 8) % 5 === 0) cheer('streak8');
  } else {
    COACH.streak = 0;
    if (COACH.qMiss >= 2) cheer('comeback');
  }
}
function coachWrong() {
  COACH.streak = 0; COACH.qMiss++; COACH.wrongRun++;
  if (COACH.wrongRun === 8) cheer('rest', true);
  else if (COACH.wrongRun === 4) cheer('nudge3');
  else if (COACH.qMiss === 2) cheer('nudge2');
}
/* if he stops tapping for a while, call him back; never more than twice in a row */
function armIdle(ms) {
  clearTimeout(COACH.idleT);
  if (S.coach !== false && !COACH.noIdle && view === 'mission') COACH.idleT = setTimeout(idleFire, ms);
}
function idleFire() {
  if (view !== 'mission' || document.hidden || COACH.noIdle || COACH.idleN >= 2) return;
  COACH.idleN++; cheer('idle');
  if (COACH.idleN < 2) armIdle(45000);
}

/* ---------- actions ---------- */
const ACT = {
  start() { const v = $('#wname').value.trim(); S.name = v; S.skipName = !v; save(); view = 'home'; render(); },
  skipname() { S.skipName = true; save(); view = 'home'; render(); },
  hero(t) { t.classList.remove('flex'); void t.offsetWidth; t.classList.add('flex'); say(`Hi ${kid()}! Let's learn English!`); },
  home() { dropRec(); view = 'home'; M = null; render(); },
  practice() { dropRec(); M = null; view = 'practice'; render(); },
  spstart(t) { startSP(t.dataset.key); },
  spagain() { startSP(M.key); },
  sphear() { say(M.qs[M.qi].say); },
  sptf(t) { if (M.lock) return; ((t.dataset.a === '1') === M.qs[M.qi].answer) ? spOK(t) : spBad(t); },
  spscene(t) { if (M.lock) return; M.qs[M.qi].target === t.dataset.s ? spOK(t) : spBad(t); },
  spnum(t) { if (M.lock) return; +t.dataset.n === M.qs[M.qi].n ? spOK(t) : spBad(t); },
  spchip(t) {
    if (M.lock) return;
    document.querySelectorAll('.chip.sel').forEach(c => c.classList.remove('sel'));
    t.classList.add('sel'); M.sel = t.dataset.c;
  },
  spobj(t) {
    if (M.lock) return;
    const q = M.qs[M.qi];
    if (!M.sel) { document.querySelectorAll('.chip').forEach(c => { c.classList.remove('shake'); void c.offsetWidth; c.classList.add('shake'); }); return; }
    if (t.dataset.w === q.target && M.sel === q.colour) { t.classList.remove('grey'); t.style.background = COLS[M.sel]; spOK(t); }
    else { spBad(t); M.sel = null; document.querySelectorAll('.chip.sel').forEach(c => c.classList.remove('sel')); }
  },
  spletter(t) {
    if (M.lock) return;
    const q = M.qs[M.qi], i = +t.dataset.i;
    M.fill.push(i); t.disabled = true;
    document.querySelectorAll('#slots .sl')[M.fill.length - 1].textContent = q.letters[i].ch;
    if (M.fill.length === q.w.length) {
      const word = M.fill.map(k => q.letters[k].ch).join('');
      if (word === q.w) spOK($('#slots'));
      else { spBad($('#slots')); setTimeout(() => { if (!M.lock) ACT.spclear(); }, 600); }
    }
  },
  spclear() {
    M.fill = [];
    document.querySelectorAll('#slots .sl').forEach(s => { s.textContent = ''; });
    document.querySelectorAll('#tiles .ltile').forEach(b => { b.disabled = false; });
  },
  spgap(t) {
    if (M.lock) return;
    const q = M.qs[M.qi];
    if (t.dataset.ch === q.w[q.gi].toLowerCase()) { const g = $('#gap'); g.textContent = t.dataset.ch; g.classList.add('ok'); spOK(t); }
    else spBad(t);
  },
  spcover() { M.phase = 'write'; M.cmiss = 0; M.cfill = []; paintCopy(); },
  spcw(t) {
    if (M.lock) return;
    const q = M.qs[M.qi], i = +t.dataset.i;
    M.cfill.push(i); t.disabled = true;
    document.querySelectorAll('#cslots .sl')[M.cfill.length - 1].textContent = q.tiles[i].ch;
    if (M.cfill.length === q.w.length) {
      const word = M.cfill.map(k => q.tiles[k].ch).join('');
      if (word === q.w) { const c = $('#cword'); if (c) c.textContent = q.w; spOK($('#cslots')); }
      else copyMiss($('#cslots'));
    }
  },
  spcclear() {
    M.cfill = [];
    document.querySelectorAll('#cslots .sl').forEach(s => { s.textContent = ''; });
    document.querySelectorAll('#ctiles .ltile').forEach(b => { b.disabled = false; });
  },
  spcheck() {
    if (M.lock) return;
    const q = M.qs[M.qi], inp = $('#wtype'); if (!inp) return;
    const v = (inp.value || '').toLowerCase().replace(/[^a-z]/g, '');
    if (v === q.w) { const c = $('#cword'); if (c) c.textContent = q.w; spOK(inp); } else copyMiss(inp);
  },
  sptrace(t) { if (M.lock) return; spOK(t); },
  whear() { say(M.wcur.w.w); },
  wpick(t) {
    if (M.wlock) return;
    if (t.dataset.ch === M.wcur.letter) {
      M.wlock = true; const g = $('#gap'); g.textContent = M.wcur.letter; g.classList.add('ok'); writeOK(t);
    } else { writeBad(t); }
  },
  wletter(t) {
    if (M.wlock) return;
    const c = M.wcur, i = +t.dataset.i;
    M.wfill.push(i); t.disabled = true;
    document.querySelectorAll('#wslots .sl')[M.wfill.length - 1].textContent = c.letters[i].ch;
    if (M.wfill.length === c.target.length) {
      const word = M.wfill.map(k => c.letters[k].ch).join('');
      if (word === c.target) { M.wlock = true; writeOK($('#wslots')); }
      else { writeBad($('#wslots')); setTimeout(() => { if (!M.wlock) ACT.wclear(); }, 600); }
    }
  },
  wclear() {
    M.wfill = [];
    document.querySelectorAll('#wslots .sl').forEach(s => { s.textContent = ''; });
    document.querySelectorAll('#wtiles .ltile').forEach(b => { b.disabled = false; });
  },
  wcheck() {
    if (M.wlock) return;
    const inp = $('#wtype'); if (!inp) return;
    const v = (inp.value || '').toLowerCase().replace(/[^a-z]/g, '');
    if (v === M.wcur.target) { M.wlock = true; writeOK(inp); }
    else { writeBad(inp); if (M.wmiss >= 2) $('#whint').textContent = 'Từ này bắt đầu bằng chữ "' + M.wcur.target[0] + '".'; }
  },
  stickers() { view = 'stickers'; render(); },
  unit(t) { startUnit(t.dataset.n); },
  daily() { startDaily(); },
  review() { startReview(); },
  sayw() { say(M.u.words[M.ord.listen[M.i]].w); },
  lok() { award(1); ACT.lnext(); },
  lnext() { dropRec(); M.i++; if (M.i >= M.u.words.length) nextStep(); else STEPS.listen(); },
  myvoice() { const r = M && M.rec; if (r && r.url) { try { new Audio(r.url).play().catch(() => {}); } catch (e) {} } },
  async mic() {
    const r = M && M.rec; if (!r || r.state === 'listening') return;
    const tok = TOK; dropUrl(r); r.state = 'listening'; paintListen();
    const res = await listenOnce();
    if (tok !== TOK || !M || M.rec !== r) return;
    if (res.err) { REC.denied = true; r.state = 'idle'; return paintListen(); }
    if (res.blob) r.url = URL.createObjectURL(res.blob);
    if (effMode() === 'parent') { r.state = 'review'; return paintListen(); }
    if (res.srErr && !res.heard.length) {
      if (res.srErr === 'audio-capture' && res.hadRecorder && !REC.srOnly) { REC.srOnly = true; releaseMic(); r.state = 'idle'; return ACT.mic(); }
      if (res.srErr === 'aborted') { r.state = 'idle'; return paintListen(); }
      if (res.srErr !== 'no-speech') {
        REC.srBroken = true;
        if (r.url) r.state = 'review'; else { REC.denied = true; r.state = 'idle'; }
        return paintListen();
      }
    }
    const w = M.u.words[M.ord.listen[M.i]].w;
    r.heard = res.heard[0] || ''; r.err = res.srErr || '';
    if (matches(w, res.heard)) { lgood(); return; }
    r.tries++; r.state = 'miss'; sfx(false); coachWrong();
    const c = $('#lcard'); if (c) { c.classList.remove('shake'); void c.offsetWidth; c.classList.add('shake'); }
    paintListen();
    setTimeout(() => { if (tok === TOK) say(w); }, 500);
  },
  nextstep() { nextStep(); },
  async chant() {
    const tok = ++TOK;
    document.querySelectorAll('.cw.on').forEach(el => el.classList.remove('on'));
    for (let r = 0; r < 2; r++) for (let i = 0; i < M.cwords.length; i++) {
      if (tok !== TOK) return;
      const el = $('#cw' + i); if (!el) return; el.classList.add('on');
      await say(M.cwords[i].w); await sleep(300);
      el.classList.remove('on');
    }
  },
  sayword(t) { say(t.dataset.w); },
  clearink() { const k = $('#ink'); if (k && k._clear) k._clear(); },
  inkdone() { award(1); M.i++; if (M.i >= 2) nextStep(); else STEPS.letter(); },
  saytalk() { say(M.talk[M.i][0].replace('{kid}', kid())); },
  talkdone() { award(1); M.i++; if (M.i >= M.talk.length) nextStep(); else STEPS.talk(); },
  hear() { say(M.q[M.qi].say); },
  pick(t) {
    if (M.lock) return;
    const it = M.q[M.qi], w = t.dataset.w;
    if (w === it.target) {
      M.lock = true; t.classList.add('right'); sfx(true); burst(t);
      coachRight(!M.tried);
      if (!M.tried) { mark(it.target, true); award(1); } else { save(); }
      setTimeout(() => { M.qi++; M.tried = false; if (M.qi >= M.q.length) quizDone(); else quizRender(); }, 1000);
    } else {
      t.classList.remove('shake'); void t.offsetWidth; t.classList.add('wrong', 'shake'); sfx(false); coachWrong();
      if (!M.tried) { M.tried = true; mark(it.target, false); save(); }
      say(it.say);
    }
  },
  coachpreview(t) { const pn = $('#pnick'); if (pn) S.nick = pn.value.trim(); const pc = $('#pcoach'); if (pc) S.coach = pc.value !== 'off'; const pp = $('#ppraise'), pd = $('#pnudge'); const lines = v => String(v || '').split('\n').map(x => x.trim()).filter(Boolean); if (pp) S.praise = lines(pp.value); if (pd) S.nudge = lines(pd.value); cheer(t.dataset.k, true); },
  testvoice() { S.rate = +$('#prate').value; const pv = $('#pvoice'); if (pv) S.voice = pv.value; say('Hello! This is how I sound.'); },
  reset(t) {
    if (!resetArmed) { resetArmed = 1; t.textContent = 'Bấm lần nữa để xóa tất cả'; setTimeout(() => { resetArmed = 0; const b = $('#reset'); if (b) b.textContent = 'Xóa toàn bộ tiến độ'; }, 4000); return; }
    resetArmed = 0; const name = S.name; S = { ...fresh(), name }; save(); ACT.closepanel(null, true);
  },
  closepanel(t, skipRead) {
    if (!skipRead) { const n = $('#pname'), r = $('#prate'); if (n) { S.name = n.value.trim(); S.skipName = !S.name; } if (r) S.rate = +r.value; const wr = $('#pwrite'); if (wr) S.write = wr.value; const pv = $('#pvoice'); if (pv) S.voice = pv.value;
    const lines = v => String(v || '').split('\n').map(x => x.trim()).filter(Boolean).slice(0, 20);
    const pn = $('#pnick'); if (pn) S.nick = pn.value.trim();
    const pc = $('#pcoach'); if (pc) S.coach = pc.value !== 'off';
    const pp = $('#ppraise'); if (pp) S.praise = lines(pp.value);
    const pd = $('#pnudge'); if (pd) S.nudge = lines(pd.value); const vs = $('#pvi'); if (vs && !vs.disabled) S.viSpeak = vs.value === 'on'; const c = $('#pcheck'); if (c) { S.check = c.value; REC.denied = false; REC.srBroken = false; REC.srOnly = false; } save(); }
    $('#overlay').hidden = true; $('#overlay').innerHTML = ''; view = 'home'; render();
  }
};
/* if the face picture is not there (the private copies), the Greeny drawing shows instead */
document.addEventListener('error', e => { const t = e.target; if (t && t.classList && t.classList.contains('face') && t.parentNode) t.parentNode.classList.add('noface'); }, true);
document.addEventListener('pointerdown', () => { COACH.idleN = 0; armIdle(22000); }, true);
document.addEventListener('click', e => {
  const t = e.target.closest('[data-act]'); if (!t) return;
  const f = ACT[t.dataset.act]; if (f) f(t, e);
});
document.addEventListener('keydown', e => {
  if (e.key !== 'Enter') return;
  if (e.target.id === 'wname') ACT.start();
  if (e.target.id === 'wtype') { if (M && M.type === 'sp') ACT.spcheck(); else ACT.wcheck(); }
});

loadAudioIndex();
render();
initDb();
})();
