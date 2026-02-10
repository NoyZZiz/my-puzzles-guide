/* POKEMON REGISTRY MASTER SCRIPT */

const CONFIG = {
    API_BASE: 'https://pokeapi.co/api/v2/pokemon/',
    SPECIES_BASE: 'https://pokeapi.co/api/v2/pokemon-species/',
    SPRITE_BASE: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/',
    ANIMATED_SPRITE_BASE: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/',
    // Universal Registry Settings
    MAX_CLASS_ID: 493, // Up to Arceus (Gen 4)
    LEGENDARY_IDS: [
        144, 145, 146, 150, 151, // Gen 1
        243, 244, 245, 249, 250, 251, // Gen 2
        377, 378, 379, 380, 381, 382, 383, 384, 385, 386, // Gen 3
        480, 481, 482, 483, 484, 485, 486, 487, 488, 489, 490, 491, 492, 493, // Gen 4
        494, 638, 639, 640, 641, 642, 643, 644, 645, 646, 647, 648, 649, // Gen 5
        716, 717, 718, 719, 720, 721, // Gen 6
        772, 773, 785, 786, 787, 788, 789, 790, 791, 792, 793, 794, 795, 796, 797, 798, 799, 800, 801, 802, 807, // Gen 7
        888, 889, 890, 891, 892, 893, 894, 895, 896, 897, 898, // Gen 8
        1001, 1002, 1003, 1004, 1007, 1008, 1010, // Gen 9
        658, 448 // Greninja, Lucario
    ],
    MODERN_FAVORITES: [6, 94, 130, 212, 248, 373, 376, 445, 392],
    CUTE_STARTERS: [
        1, 4, 7,      // Gen 1
        152, 155, 158, // Gen 2
        252, 255, 258, // Gen 3
        387, 390, 393, // Gen 4
        810, 813, 816, // Gen 8
        906, 909, 912, // Gen 9
        25, 133        // Pikachu, Eevee
    ],
    MAX_NATIONAL_ID: 1010, // Full National Dex
    HALL_DENSITY: 4,
    ALLIANCE_CODE: 'ROL-OAK-2026',
    MASCOT_CODE: 'ROL-MASCOT-2026',
    BACKEND_URL: 'https://Noyzzing.pythonanywhere.com',
    TRAINER_CHARACTERS: [
        {name: 'Red', sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/trainers/1.png'},
        {name: 'Blue', sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/trainers/2.png'},
        {name: 'Misty', sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/trainers/3.png'},
        {name: 'Brock', sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/trainers/4.png'}
    ],
    DISCORD_WEBHOOK: 'https://discord.com/api/webhooks/1470559801758060759/KzPjlskRg7VONS8QMvCuDoHxKjdlNQgMKUJa7G3An950JcNGNRCg6Id4dBMC38zN7BQQ'
};

let STATE = {
    access: 'aspirant',
    selectedDraftIds: [],
    draftPool: [],
    currentView: 'main-interface',
    currentLore: '',
    profilePicUrl: '',
    discoveredCount: 0
};

const ELEMENTS = {
    castleName: document.getElementById('castle-name'),
    castleLevel: document.getElementById('castle-level'),
    summonBtn: document.getElementById('summon-btn'),
    registrationForm: document.getElementById('registration-form'),
    resultScreen: document.getElementById('result-screen'),
    cinematicOverlay: document.getElementById('cinematic-overlay'),
    pokeballReveal: document.getElementById('pokeball-reveal'),
    revealLight: document.getElementById('reveal-light'),
    pkmSprite: document.getElementById('pokemon-sprite'),
    pkmName: document.getElementById('pokemon-name'),
    pkmTypes: document.getElementById('pokemon-types'),
    pkmMove: document.getElementById('pokemon-move'),
    pkmGenus: document.getElementById('pokemon-genus'),
    pkmFlavor: document.getElementById('pokemon-flavor'),
    pkmCP: document.getElementById('pokemon-cp'),
    newSignatureBtn: document.getElementById('new-signature-btn'),
    profilePicInput: document.getElementById('profile-pic-input'),
    profilePicPreview: document.getElementById('profile-pic-preview'),
    profilePicThumb: document.getElementById('profile-pic-thumb'),
    mascotCodeContainer: document.getElementById('mascot-code-container'),
    mascotCodeInput: document.getElementById('mascot-code'),
    draftSubtitle: document.getElementById('draft-subtitle'),
    mascotKeyStatus: document.getElementById('mascot-key-status'),
    aspirantCta: document.getElementById('aspirant-cta'),
    discoveryControls: document.getElementById('discovery-controls'),
    discoveryCount: document.getElementById('discovery-count'),
    discoveryTotal: document.getElementById('discovery-total'),
    discoveryBtn: document.getElementById('btn-discover'),
    profileUploadSection: document.getElementById('profile-upload-section')
};

// --- TRANSLATION DATA (i18n) ---
const TRANSLATIONS = {
    'en': {
        'lang_name': 'English',
        'how_to_play': 'How to Play',
        'instr_aspirant_title': 'Aspirants (Anyone)',
        'instr_aspirant_1': 'Select "Aspirant" and enter any name',
        'instr_aspirant_2': 'Spin to discover random Pokémon',
        'instr_aspirant_3': 'Spin unlimited times to explore',
        'instr_aspirant_4': 'View the Hall of Leaders to see the elite',
        'instr_member_title': 'Alliance Members (ROL)',
        'instr_member_1': 'Select "Alliance Member" and enter your secret key',
        'instr_member_2': 'Draft a squad of 6 from 10 random Pokémon',
        'instr_member_3': '1 guaranteed Legendary in every draft',
        'instr_member_4': 'Upload a profile pic and register as a Gym Boss',
        'instr_member_5': 'Your squad appears forever in the Hall of Leaders',
        'legal_disclaimer': 'This is an unofficial fan project. Pokémon and all related names, images, and trademarks are © Nintendo, Game Freak, and The Pokémon Company. This site is not affiliated with, endorsed, or sponsored by any of these companies. All Pokémon data is sourced from the open-source PokéAPI project. No copyright infringement is intended.'
    },
    'es': {
        'lang_name': 'Español',
        'how_to_play': 'Cómo Jugar',
        'instr_aspirant_title': 'Aspirantes (Cualquiera)',
        'instr_aspirant_1': 'Selecciona "Aspirante" e ingresa un nombre',
        'instr_aspirant_2': 'Gira para descubrir Pokémon aleatorios',
        'instr_aspirant_3': 'Gira las veces que quieras para explorar',
        'instr_aspirant_4': 'Visita el Salón de Líderes para ver a la élite',
        'instr_member_title': 'Miembros de la Alianza (ROL)',
        'instr_member_1': 'Selecciona "Miembro de Alianza" e ingresa tu clave secreta',
        'instr_member_2': 'Recluta un equipo de 6 entre 10 Pokémon aleatorios',
        'instr_member_3': '1 Legendario garantizado en cada reclutamiento',
        'instr_member_4': 'Sube una foto de perfil y regístrate como Jefe de Gimnasio',
        'instr_member_5': 'Tu equipo aparecerá para siempre en el Salón de Líderes',
        'legal_disclaimer': 'Este es un proyecto no oficial de fans. Pokémon y todos los nombres, imágenes y marcas relacionadas son © Nintendo, Game Freak y The Pokémon Company. Este sitio no está afiliado, respaldado ni patrocinado por ninguna de estas empresas. Todos los datos de Pokémon provienen del proyecto de código abierto PokéAPI. No se pretende infringir derechos de autor.'
    },
    'pt': {
        'lang_name': 'Português',
        'how_to_play': 'Como Jogar',
        'instr_aspirant_title': 'Aspirantes (Qualquer Pessoa)',
        'instr_aspirant_1': 'Selecione "Aspirante" e insira qualquer nome',
        'instr_aspirant_2': 'Gire para descobrir Pokémon aleatórios',
        'instr_aspirant_3': 'Gire quantas vezes quiser para explorar',
        'instr_aspirant_4': 'Veja o Salão dos Líderes para ver a elite',
        'instr_member_title': 'Membros da Aliança (ROL)',
        'instr_member_1': 'Selecione "Membro da Aliança" e insira sua chave secreta',
        'instr_member_2': 'Monte um time de 6 entre 10 Pokémon aleatórios',
        'instr_member_3': '1 Lendário garantido em cada recrutamento',
        'instr_member_4': 'Envie uma foto de perfil e registre-se como Chefe de Ginásio',
        'instr_member_5': 'Seu time aparecerá para sempre no Salão dos Líderes',
        'legal_disclaimer': 'Este é um projeto não oficial de fãs. Pokémon e todos os nomes, imagens e marcas relacionadas são © Nintendo, Game Freak e The Pokémon Company. Este site não é afiliado, endossado ou patrocinado por nenhuma dessas empresas. Todos os dados de Pokémon são provenientes do projeto de código aberto PokéAPI. Nenhuma violação de direitos autorais é pretendida.'
    },
    'fr': {
        'lang_name': 'Français',
        'how_to_play': 'Comment Jouer',
        'instr_aspirant_title': 'Aspirants (Tout le monde)',
        'instr_aspirant_1': 'Sélectionnez "Aspirant" et entrez un nom',
        'instr_aspirant_2': 'Tournez pour découvrir des Pokémon aléatoires',
        'instr_aspirant_3': 'Tournez autant de fois que vous voulez',
        'instr_aspirant_4': 'Consultez le Hall des Champions pour voir l\'élite',
        'instr_member_title': 'Membres de l\'Alliance (ROL)',
        'instr_member_1': 'Sélectionnez "Membre de l\'Alliance" et entrez votre clé secrète',
        'instr_member_2': 'Recrutez une équipe de 6 parmi 10 Pokémon aléatoires',
        'instr_member_3': '1 Légendaire garanti à chaque recrutement',
        'instr_member_4': 'Téléchargez une photo de profil et inscrivez-vous comme Chef de Gymnase',
        'instr_member_5': 'Votre équipe apparaîtra pour toujours dans le Hall des Champions',
        'legal_disclaimer': 'Ceci est un projet de fan non officiel. Pokémon et tous les noms, images et marques associés sont © Nintendo, Game Freak et The Pokémon Company. Ce site n\'est pas affilié à, approuvé par, ni sponsorisé par ces entreprises. Toutes les données Pokémon proviennent du projet open source PokéAPI. Aucune violation de droits d\'auteur n\'est intentée.'
    },
    'ru': {
        'lang_name': 'Русский',
        'how_to_play': 'Как играть',
        'instr_aspirant_title': 'Аспиранты (Все)',
        'instr_aspirant_1': 'Выберите «Аспирант» и введите любое имя',
        'instr_aspirant_2': 'Вращайте, чтобы открыть случайного Покемона',
        'instr_aspirant_3': 'Вращайте неограниченное количество раз',
        'instr_aspirant_4': 'Посетите Зал Лидеров, чтобы увидеть элиту',
        'instr_member_title': 'Члены Альянса (ROL)',
        'instr_member_1': 'Выберите «Член Альянса» и введите секретный ключ',
        'instr_member_2': 'Соберите команду из 6 среди 10 случайных Покемонов',
        'instr_member_3': '1 Легендарный Покемон гарантирован при каждом наборе',
        'instr_member_4': 'Загрузите фото профиля и зарегистрируйтесь как Босс Гимна',
        'instr_member_5': 'Ваша команда останется навсегда в Зале Лидеров',
        'legal_disclaimer': 'Это неофициальный фанатский проект. Покемон и все связанные имена, изображения и товарные знаки принадлежат © Nintendo, Game Freak и The Pokémon Company. Этот сайт не связан с этими компаниями и не одобрен ими. Все данные о покемонах получены из проекта с открытым исходным кодом PokéAPI. Нарушение авторских прав не предполагается.'
    },
    'de': {
        'lang_name': 'Deutsch',
        'how_to_play': 'Spielanleitung',
        'instr_aspirant_title': 'Aspiranten (Jeder)',
        'instr_aspirant_1': 'Wähle "Aspirant" und gib einen Namen ein',
        'instr_aspirant_2': 'Drehe, um zufällige Pokémon zu entdecken',
        'instr_aspirant_3': 'Drehe unbegrenzt oft zum Erkunden',
        'instr_aspirant_4': 'Besuche die Halle der Anführer, um die Elite zu sehen',
        'instr_member_title': 'Allianzmitglieder (ROL)',
        'instr_member_1': 'Wähle "Allianzmitglied" und gib deinen geheimen Schlüssel ein',
        'instr_member_2': 'Stelle ein Team von 6 aus 10 zufälligen Pokémon zusammen',
        'instr_member_3': '1 garantiertes Legendäres bei jedem Entwurf',
        'instr_member_4': 'Lade ein Profilbild hoch und registriere dich als Arenaleiter',
        'instr_member_5': 'Dein Team erscheint für immer in der Halle der Anführer',
        'legal_disclaimer': 'Dies ist ein inoffizielles Fan-Projekt. Pokémon und alle zugehörigen Namen, Bilder und Marken sind © Nintendo, Game Freak und The Pokémon Company. Diese Website ist nicht mit diesen Unternehmen verbunden, von ihnen unterstützt oder gesponsert. Alle Pokémon-Daten stammen aus dem Open-Source-Projekt PokéAPI. Keine Urheberrechtsverletzung beabsichtigt.'
    },
    'ja': {
        'lang_name': '日本語',
        'how_to_play': '遊び方',
        'instr_aspirant_title': 'アスピラント（誰でも）',
        'instr_aspirant_1': '「アスピラント」を選び、名前を入力してください',
        'instr_aspirant_2': 'スピンしてランダムなポケモンを発見しよう',
        'instr_aspirant_3': '何度でもスピンして探索できます',
        'instr_aspirant_4': 'リーダーの殿堂でエリートを見よう',
        'instr_member_title': 'アライアンスメンバー（ROL）',
        'instr_member_1': '「アライアンスメンバー」を選び、秘密の鍵を入力',
        'instr_member_2': '10体のランダムポケモンから6体のチームを編成',
        'instr_member_3': '毎回1体の伝説ポケモンが保証されます',
        'instr_member_4': 'プロフィール写真をアップロードしてジムボスとして登録',
        'instr_member_5': 'あなたのチームはリーダーの殿堂に永遠に残ります',
        'legal_disclaimer': 'これは非公式のファンプロジェクトです。ポケモンおよび関連するすべての名前、画像、商標は © Nintendo, Game Freak, The Pokémon Company に帰属します。このサイトはこれらの企業と提携、承認、後援されていません。すべてのポケモンデータはオープンソースプロジェクト PokéAPI から取得しています。著作権侵害の意図はありません。'
    },
    'ko': {
        'lang_name': '한국어',
        'how_to_play': '플레이 방법',
        'instr_aspirant_title': '지망생 (누구나)',
        'instr_aspirant_1': '"지망생"을 선택하고 이름을 입력하세요',
        'instr_aspirant_2': '스핀하여 랜덤 포켓몬을 발견하세요',
        'instr_aspirant_3': '무제한 스핀으로 탐험하세요',
        'instr_aspirant_4': '리더 전당에서 엘리트를 확인하세요',
        'instr_member_title': '얼라이언스 멤버 (ROL)',
        'instr_member_1': '"얼라이언스 멤버"를 선택하고 비밀 키를 입력하세요',
        'instr_member_2': '10개의 랜덤 포켓몬 중 6개로 스쿼드를 구성하세요',
        'instr_member_3': '매 드래프트마다 전설 포켓몬 1마리 보장',
        'instr_member_4': '프로필 사진을 업로드하고 체육관 보스로 등록하세요',
        'instr_member_5': '당신의 스쿼드는 리더 전당에 영원히 남습니다',
        'legal_disclaimer': '이것은 비공식 팬 프로젝트입니다. 포켓몬 및 모든 관련 이름, 이미지, 상표는 © Nintendo, Game Freak, The Pokémon Company에 귀속됩니다. 이 사이트는 이러한 회사와 제휴, 보증 또는 후원을 받지 않습니다. 모든 포켓몬 데이터는 오픈소스 프로젝트 PokéAPI에서 가져옵니다. 저작권 침해 의도는 없습니다.'
    }
};

// --- i18n Core Functions ---
let currentLang = localStorage.getItem('pkm_registry_lang') || 'en';

function setLanguage(langCode) {
    const translations = TRANSLATIONS[langCode];
    if (!translations) return;
    currentLang = langCode;
    localStorage.setItem('pkm_registry_lang', langCode);
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (translations[key]) {
            el.innerHTML = translations[key];
        }
    });
}

function setupLanguageSelector() {
    const selectors = [document.getElementById('lang-selector'), document.getElementById('lang-selector-mobile')];
    selectors.forEach(selector => {
        if (!selector) return;
        selector.innerHTML = '';
        Object.keys(TRANSLATIONS).forEach(langCode => {
            const option = document.createElement('option');
            option.value = langCode;
            option.textContent = TRANSLATIONS[langCode]['lang_name'];
            selector.appendChild(option);
        });
        selector.value = currentLang;
        selector.addEventListener('change', (e) => setLanguage(e.target.value));
    });
    setLanguage(currentLang);
}

setupLanguageSelector();

// --- View Control ---
ELEMENTS.summonBtn.addEventListener('click', startSummon);
ELEMENTS.newSignatureBtn.addEventListener('click', resetRegistry);
document.getElementById('confirm-squad-btn').addEventListener('click', finalizeSquad);
if (ELEMENTS.discoveryBtn) ELEMENTS.discoveryBtn.addEventListener('click', discoverNextMascot);

ELEMENTS.profilePicInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = (ev) => {
            ELEMENTS.profilePicThumb.src = ev.target.result;
            ELEMENTS.profilePicPreview.classList.remove('hidden');
            document.getElementById('profile-pic-placeholder').classList.add('hidden');
        };
        reader.readAsDataURL(file);
    }
});

// Real-time Mascot Key Check
ELEMENTS.mascotCodeInput.addEventListener('input', (e) => {
    const isCorrect = e.target.value.trim().toUpperCase() === CONFIG.MASCOT_CODE.toUpperCase();
    if (ELEMENTS.mascotKeyStatus) {
        if (isCorrect) ELEMENTS.mascotKeyStatus.classList.remove('hidden');
        else ELEMENTS.mascotKeyStatus.classList.add('hidden');
    }
});

function setAccess(type) {
    STATE.access = type;
    const codeContainer = document.getElementById('member-code-container');
    const mascotContainer = ELEMENTS.mascotCodeContainer;
    const btnAspirant = document.getElementById('btn-aspirant');
    const btnMember = document.getElementById('btn-member');
    const summonBtnSpan = ELEMENTS.summonBtn ? ELEMENTS.summonBtn.querySelector('span') : null;
    
    if (type === 'member') {
        if (codeContainer) { codeContainer.classList.remove('hidden'); codeContainer.style.display = 'block'; }
        if (mascotContainer) { mascotContainer.classList.add('hidden'); mascotContainer.style.display = 'none'; }
        btnMember.classList.add('text-pkm-red', 'border-pkm-red');
        btnAspirant.classList.remove('text-pkm-blue', 'border-pkm-blue');
        if (summonBtnSpan) summonBtnSpan.textContent = "Join Draft Game";
        if (ELEMENTS.profileUploadSection) {
            ELEMENTS.profileUploadSection.classList.remove('hidden');
            ELEMENTS.profileUploadSection.style.display = 'block';
        }
    } else {
        if (codeContainer) { codeContainer.classList.add('hidden'); codeContainer.style.display = 'none'; }
        if (mascotContainer) { mascotContainer.classList.remove('hidden'); mascotContainer.style.display = 'block'; }
        btnAspirant.classList.add('text-pkm-blue', 'border-pkm-blue');
        btnMember.classList.remove('text-pkm-red', 'border-pkm-red');
        if (summonBtnSpan) summonBtnSpan.textContent = "Initialize Capture";
        if (ELEMENTS.profileUploadSection) {
            ELEMENTS.profileUploadSection.classList.add('hidden');
            ELEMENTS.profileUploadSection.style.display = 'none';
        }
    }
    if (ELEMENTS.discoveryControls) ELEMENTS.discoveryControls.classList.add('hidden');
}

function toggleView(viewId) {
    const views = ['registration-form', 'draft-screen', 'hall-of-leaders', 'result-screen'];
    views.forEach(v => {
        const el = document.getElementById(v);
        if (el) el.classList.add('hidden');
    });
    document.getElementById(viewId).classList.remove('hidden');
    STATE.currentView = viewId;
    if (viewId === 'hall-of-leaders') fetchAndRenderLeaders();
}

// --- Background ---
function initBackground() {
    const hall = document.getElementById('hall-container');
    hall.innerHTML = '<div class="god-ray"></div>';
    const spawnedIds = new Set();
    const backgroundPool = [...CONFIG.LEGENDARY_IDS, ...CONFIG.CUTE_STARTERS, 149, 248, 445];
    const DESKTOP_ANCHORS = [{x: 15, y: 30}, {x: 85, y: 30}, {x: 15, y: 70}, {x: 85, y: 70}];
    const isMobile = window.innerWidth < 768;
    let currentAnchors = [...DESKTOP_ANCHORS];

    function createExhibitionItem() {
        if (currentAnchors.length === 0) return;
        const anchor = currentAnchors.shift();
        let id;
        do { id = backgroundPool[Math.floor(Math.random() * backgroundPool.length)]; } while (spawnedIds.has(id));
        spawnedIds.add(id);

        const img = document.createElement('img');
        img.src = `${CONFIG.SPRITE_BASE}${id}.png`;
        img.className = 'hall-sprite';
        img.style.cssText = `top: ${anchor.y}%; left: ${anchor.x}%; z-index: 10;`;
        hall.appendChild(img);
        setTimeout(() => img.style.opacity = '0.9', 100);

        setTimeout(() => {
            img.style.opacity = '0';
            setTimeout(() => {
                img.remove();
                spawnedIds.delete(id);
                currentAnchors.push(anchor);
                createExhibitionItem();
            }, 3000);
        }, 8000);
    }
    for (let i = 0; i < CONFIG.HALL_DENSITY; i++) setTimeout(createExhibitionItem, i * 600);
}
initBackground();

// --- Core Logic ---
async function startSummon() {
    const castleName = ELEMENTS.castleName.value.trim();
    if (!castleName) {
        alert("PLEASE ENTER YOUR CASTLE NAME.");
        return;
    }

    if (STATE.access === 'member') {
        const cLevel = ELEMENTS.castleLevel.value.trim();
        const code = document.getElementById('member-code').value.trim();
        
        if (!cLevel) { alert("PLEASE ENTER YOUR CASTLE LEVEL."); return; }
        if (code !== CONFIG.ALLIANCE_CODE) { alert("INVALID ALLIANCE SECRET KEY."); return; }
        await initializeDraft();
        return;
    }

    // Mascot Registration Trigger
    const mascotKey = ELEMENTS.mascotCodeInput ? ELEMENTS.mascotCodeInput.value.trim() : '';
    if (STATE.access === 'aspirant' && mascotKey.toUpperCase() === CONFIG.MASCOT_CODE.toUpperCase()) {
        await initializeDraft();
        return;
    }
    
    try {
        ELEMENTS.summonBtn.disabled = true;
        let pokeId = Math.random() < 0.3 ? CONFIG.LEGENDARY_IDS[Math.floor(Math.random() * CONFIG.LEGENDARY_IDS.length)] : Math.floor(Math.random() * CONFIG.MAX_CLASS_ID) + 1;
        const [pData, sData] = await Promise.all([
            fetch(`${CONFIG.API_BASE}${pokeId}`).then(res => res.json()),
            fetch(`${CONFIG.SPECIES_BASE}${pokeId}`).then(res => res.json())
        ]);
        await triggerRevealSequence(pData, sData);
    } catch (e) {
        ELEMENTS.summonBtn.disabled = false;
    }
}

async function initializeDraft() {
    try {
        const fullPool = Array.from({length: CONFIG.MAX_NATIONAL_ID}, (_, i) => i + 1);
        const response = await fetch(`${CONFIG.BACKEND_URL}/get_available_draft`, {
            method: 'POST', headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({ pool: fullPool })
        });
        STATE.draftPool = await response.json();
        STATE.selectedDraftIds = [];
        STATE.discoveredCount = 0;

        const mascotKey = ELEMENTS.mascotCodeInput ? ELEMENTS.mascotCodeInput.value.trim() : '';
        const isROLMascot = STATE.access === 'aspirant' && mascotKey.toUpperCase() === CONFIG.MASCOT_CODE.toUpperCase();

        // Update selection UI label and instructions
        const selLabel = document.getElementById('draft-status');
        if (selLabel) {
            selLabel.innerHTML = `Selected: <span id="selection-count" class="text-pkm-yellow">0</span>/${STATE.access === 'member' ? '6' : '1'}`;
        }

        if (ELEMENTS.draftSubtitle) {
            if (STATE.access === 'aspirant') {
                ELEMENTS.draftSubtitle.textContent = isROLMascot 
                    ? "Identify 14 mystery specimens and claim your mascot"
                    : "Spin 14 times and discover your potential";
            } else {
                ELEMENTS.draftSubtitle.textContent = "Spin 14 times and choose your Squad of 6";
            }
        }


        // Mascot specific Discovery Mode
        if (isROLMascot) {
            if (ELEMENTS.discoveryControls) ELEMENTS.discoveryControls.classList.remove('hidden');
            if (ELEMENTS.discoveryCount) ELEMENTS.discoveryCount.textContent = "0";
            if (ELEMENTS.discoveryTotal) ELEMENTS.discoveryTotal.textContent = STATE.draftPool.length;
            if (ELEMENTS.discoveryBtn) {
                ELEMENTS.discoveryBtn.disabled = false;
                ELEMENTS.discoveryBtn.textContent = "Scan Next Specimen";
            }
            if (ELEMENTS.profileUploadSection) {
                ELEMENTS.profileUploadSection.classList.add('hidden');
                ELEMENTS.profileUploadSection.style.display = 'none';
            }
            const confirmBtn = document.getElementById('confirm-squad-btn');
            if (confirmBtn) confirmBtn.classList.add('hidden'); // Hide until discovery done
        } else {
            if (ELEMENTS.discoveryControls) ELEMENTS.discoveryControls.classList.add('hidden');
            const confirmBtn = document.getElementById('confirm-squad-btn');
            if (confirmBtn) confirmBtn.classList.remove('hidden');
        }

        renderDraftPool();
        toggleView('draft-screen');
    } catch (e) { alert("DRAFT SERVER OFFLINE."); }
}

async function discoverNextMascot() {
    if (STATE.discoveredCount >= STATE.draftPool.length) return;
    
    ELEMENTS.discoveryBtn.disabled = true;
    const nextId = STATE.draftPool[STATE.discoveredCount];
    
    try {
        const [pData, sData] = await Promise.all([
            fetch(`${CONFIG.API_BASE}${nextId}`).then(res => res.json()),
            fetch(`${CONFIG.SPECIES_BASE}${nextId}`).then(res => res.json())
        ]);
        
        await triggerRevealSequence(pData, sData);
        
        // After cinematic, return to draft but with one more revealed
        STATE.discoveredCount++;
        if (ELEMENTS.discoveryCount) ELEMENTS.discoveryCount.textContent = STATE.discoveredCount;
        
        renderDraftPool();
        toggleView('draft-screen');
        
        if (STATE.discoveredCount < STATE.draftPool.length) {
            ELEMENTS.discoveryBtn.disabled = false;
        } else {
            ELEMENTS.discoveryBtn.textContent = "Discovery Complete";
            const confirmBtn = document.getElementById('confirm-squad-btn');
            if (confirmBtn) confirmBtn.classList.remove('hidden');
        }
    } catch (e) {
        ELEMENTS.discoveryBtn.disabled = false;
    }
}

async function renderDraftPool() {
    const container = document.getElementById('draft-pool');
    container.innerHTML = '';
    
    const mascotKey = ELEMENTS.mascotCodeInput ? ELEMENTS.mascotCodeInput.value.trim() : '';
    const isROLMascot = STATE.access === 'aspirant' && mascotKey.toUpperCase() === CONFIG.MASCOT_CODE.toUpperCase();

    STATE.draftPool.forEach((id, index) => {
        const card = document.createElement('div');
        const isLocked = isROLMascot && index >= STATE.discoveredCount;
        
        card.id = `draft-card-${id}`;
        card.className = `draft-card bg-pkm-panel p-4 rounded-3xl flex flex-col items-center gap-2 transition-all ${isLocked ? 'opacity-40 grayscale pointer-events-none' : 'cursor-pointer hover:border-pkm-yellow border-2 border-transparent'}`;
        
        if (isLocked) {
           card.innerHTML = `
                <div class="w-24 h-24 flex items-center justify-center">
                    <i class="fa-solid fa-microscope text-3xl text-white/10 anim-pulse"></i>
                </div>
                <span class="font-rajdhani font-bold text-[10px] uppercase tracking-widest text-white/20">?? Locked</span>
            `;
        } else {
            card.innerHTML = `
                <img src="${CONFIG.SPRITE_BASE}${id}.png" class="w-24 h-24 object-contain">
                <span class="font-rajdhani font-bold text-[10px] uppercase tracking-widest text-white/50" id="name-${id}">Loading...</span>
            `;
            // Async name charging
            fetch(`${CONFIG.API_BASE}${id}`)
                .then(r => r.json())
                .then(d => {
                    const nameEl = document.getElementById(`name-${id}`);
                    if (nameEl) nameEl.textContent = d.name.replace(/-/g, ' ');
                });
        }
        
        if (!isLocked) {
            card.onclick = () => toggleDraftSelection(id, card);
        }
        container.appendChild(card);
    });
}

function toggleDraftSelection(id, card) {
    const isMember = STATE.access === 'member';
    const limit = isMember ? 6 : 1;
    const idx = STATE.selectedDraftIds.indexOf(id);

    if (idx > -1) {
        STATE.selectedDraftIds.splice(idx, 1);
        card.classList.remove('selected');
    } else {
        if (STATE.selectedDraftIds.length >= limit) {
            if (limit === 1) {
                // Radio button behavior for pick-1
                const prevId = STATE.selectedDraftIds[0];
                const prevCards = document.querySelectorAll('.draft-card.selected');
                prevCards.forEach(c => c.classList.remove('selected'));
                STATE.selectedDraftIds = [id];
                card.classList.add('selected');
            } else return;
        } else {
            STATE.selectedDraftIds.push(id);
            card.classList.add('selected');
        }
    }
    
    document.getElementById('selection-count').textContent = STATE.selectedDraftIds.length;
    const confirmBtn = document.getElementById('confirm-squad-btn');
    
    if (STATE.selectedDraftIds.length === limit) {
        confirmBtn.disabled = false;
        confirmBtn.classList.remove('opacity-50');
        if (STATE.access === 'aspirant') confirmBtn.textContent = "Claim Mascot";
        else confirmBtn.textContent = "Finalize Contract";
    } else {
        confirmBtn.disabled = true;
        confirmBtn.classList.add('opacity-50');
        confirmBtn.textContent = STATE.access === 'aspirant' ? "Select 1" : "Select 6";
    }
}

async function finalizeSquad() {
    const isMascotMode = STATE.access === 'aspirant';
    const mascotKey = ELEMENTS.mascotCodeInput ? ELEMENTS.mascotCodeInput.value.trim() : '';
    const isROLMascot = isMascotMode && mascotKey.toUpperCase() === CONFIG.MASCOT_CODE.toUpperCase();

    const confirmed = await showConfirm(
        "Security Protocol", 
        isMascotMode ? `ARE YOU READY TO CLAIM THIS ${isROLMascot ? 'SIGNATURE MASCOT' : 'POKEMON'}?` : "ARE YOU READY TO FINALIZE YOUR CONTRACT? THIS WILL PERMANENTLY LOCK YOUR SQUAD IN THE HALL OF LEADERS."
    );
    if (!confirmed) return;
    
    const castleName = ELEMENTS.castleName.value.trim();
    const castleLevel = ELEMENTS.castleLevel.value.trim() || 'N/A';
    const char = CONFIG.TRAINER_CHARACTERS[Math.floor(Math.random() * CONFIG.TRAINER_CHARACTERS.length)].name;
    
    // Upload profile pic if selected
    let profilePicUrl = '';
    const picFile = ELEMENTS.profilePicInput.files[0];
    if (picFile) {
        try {
            const formData = new FormData();
            formData.append('file', picFile);
            formData.append('alias', castleName);
            const uploadRes = await fetch(`${CONFIG.BACKEND_URL}/upload_profile_pic`, { method: 'POST', body: formData });
            const uploadData = await uploadRes.json();
            profilePicUrl = uploadData.url;
        } catch (e) { console.error('Pic upload failed', e); }
    }
    
    // If Guest (no code), just show reward, don't save.
    if (isMascotMode && !isROLMascot) {
        const pkmId = STATE.selectedDraftIds[0];
        const pData = await fetch(`${CONFIG.API_BASE}${pkmId}`).then(r => r.json());
        const sData = await fetch(`${CONFIG.SPECIES_BASE}${pkmId}`).then(r => r.json());
        triggerRevealSequence(pData, sData);
        return;
    }

    try {
        const payload = { 
            alias: castleName, 
            identity: isMascotMode ? 'Aspirant Mascot' : 'ROL Gym Boss', 
            squad: isMascotMode ? null : STATE.selectedDraftIds.join(','), 
            mascot_id: isMascotMode ? STATE.selectedDraftIds[0] : null,
            character: char,
            castle_name: castleName,
            castle_level: castleLevel,
            lore: STATE.currentLore,
            profile_pic: profilePicUrl
        };

        const res = await fetch(`${CONFIG.BACKEND_URL}/save_global_assignment`, {
            method: 'POST', headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(payload)
        });

        if (res.ok) {
            // Announce on Discord
            try {
                if (isMascotMode) {
                    const pkmId = STATE.selectedDraftIds[0];
                    const pData = await fetch(`${CONFIG.API_BASE}${pkmId}`).then(r => r.json());
                    await fetch(CONFIG.DISCORD_WEBHOOK, {
                        method: 'POST', headers: {'Content-Type': 'application/json'},
                        body: JSON.stringify({
                            username: 'Mascot Registry',
                            avatar_url: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/safari-ball.png',
                            embeds: [{
                                title: '✨ A POKÉMON HAS BEEN CAUGHT!',
                                description: `**${castleName}** has captured a **${pData.name.toUpperCase()}**!`,
                                color: 0xfacc15,
                                thumbnail: { url: `${CONFIG.SPRITE_BASE}${pkmId}.png` },
                                fields: [{ name: '🏰 Castle', value: castleName, inline: true }],
                                footer: { text: 'ROL Alliance • Mascot System' }
                            }]
                        })
                    });
                } else {
                    const pkmNames = await Promise.all(STATE.selectedDraftIds.map(async id => {
                        const r = await fetch(`${CONFIG.API_BASE}${id}`);
                        const d = await r.json();
                        return d.name.charAt(0).toUpperCase() + d.name.slice(1);
                    }));
                    await fetch(CONFIG.DISCORD_WEBHOOK, {
                        method: 'POST', headers: {'Content-Type': 'application/json'},
                        body: JSON.stringify({
                            username: 'Pokémon Registry',
                            avatar_url: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/master-ball.png',
                            embeds: [{
                                title: '🔥 NEW GYM BOSS REGISTERED!',
                                description: `**${castleName}** has joined the Hall of Leaders!`,
                                color: 0xff1f1f,
                                fields: [
                                    { name: '🏰 Castle Level', value: castleLevel, inline: true },
                                    { name: '🐉 Squad', value: pkmNames.join(', '), inline: false }
                                ],
                                thumbnail: { url: `${CONFIG.SPRITE_BASE}${STATE.selectedDraftIds[0]}.png` },
                                footer: { text: 'ROL Alliance • Pokémon Registry' },
                                timestamp: new Date().toISOString()
                            }]
                        })
                    });
                }
            } catch (e) { console.error('Discord fail', e); }

            if (isMascotMode) {
                if (ELEMENTS.resultHeader) ELEMENTS.resultHeader.querySelector('span').textContent = isROLMascot ? "Mascot Registered" : "Target Identified";
                if (ELEMENTS.resultBadge) isROLMascot ? ELEMENTS.resultBadge.classList.remove('hidden') : ELEMENTS.resultBadge.classList.add('hidden');
                if (isROLMascot) alert("YOUR SIGNATURE MASCOT HAS BEEN REGISTERED!");
            }

            const pkmId = STATE.selectedDraftIds[0];
            const pData = await fetch(`${CONFIG.API_BASE}${pkmId}`).then(r => r.json());
            const sData = await fetch(`${CONFIG.SPECIES_BASE}${pkmId}`).then(r => r.json());
            triggerRevealSequence(pData, sData);
            
            if (!isMascotMode) {
                setTimeout(() => toggleView('hall-of-leaders'), 5000);
            }
        }
    } catch (e) { alert("SQUAD SYNC FAILURE."); }
}

async function fetchAndRenderLeaders() {
    try {
        const res = await fetch(`${CONFIG.BACKEND_URL}/get_gym_leaders`);
        const leaders = await res.json();
        const grid = document.getElementById('leaders-grid');
        grid.innerHTML = '';
        leaders.forEach(leader => {
            const card = document.createElement('div');
            card.className = 'leader-card space-y-4 cursor-pointer';
            let squadHtml = leader.squad.map(id => `<div class="leader-squad-slot"><img src="${CONFIG.SPRITE_BASE}${id}.png" class="w-8 h-8 object-contain"></div>`).join('');
            
            const profilePicHtml = leader.profile_pic 
                ? `<img src="${CONFIG.BACKEND_URL}${leader.profile_pic}" class="w-14 h-14 rounded-full object-cover border-2 border-pkm-blue/40 shadow-lg">`
                : `<div class="w-14 h-14 bg-pkm-red/20 rounded-full flex items-center justify-center"><i class="fa-solid fa-crown text-pkm-yellow"></i></div>`;
            
            card.innerHTML = `
                <div class="flex items-center gap-4 border-b border-white/10 pb-4">
                    ${profilePicHtml}
                    <div class="flex-grow">
                        <h4 class="font-rajdhani font-bold text-xl uppercase tracking-tighter">${leader.castle_name}</h4>
                        <p class="text-[10px] text-white/40 uppercase tracking-widest">Gym Boss // ${leader.character}</p>
                        <p class="text-[9px] text-pkm-blue uppercase font-bold">Castle Lvl ${leader.castle_level}</p>
                    </div>
                    <i class="fa-solid fa-chevron-down text-white/20 text-xs transition-transform duration-300 expand-icon"></i>
                </div>
                <div class="flex gap-2 justify-center">
                    ${squadHtml}
                </div>
                <div class="squad-detail hidden mt-2 grid grid-cols-3 gap-3 pt-3 border-t border-white/5" data-squad="${leader.squad.join(',')}">
                    <p class="col-span-3 text-center text-white/20 text-[10px] uppercase tracking-widest animate-pulse">Loading Squad...</p>
                </div>
            `;
            
            card.onclick = async () => {
                const detail = card.querySelector('.squad-detail');
                const icon = card.querySelector('.expand-icon');
                
                if (!detail.classList.contains('hidden')) {
                    detail.classList.add('hidden');
                    icon.style.transform = 'rotate(0deg)';
                    return;
                }
                
                detail.classList.remove('hidden');
                icon.style.transform = 'rotate(180deg)';
                
                // Only fetch if not already loaded
                if (detail.dataset.loaded) return;
                detail.dataset.loaded = 'true';
                
                const ids = detail.dataset.squad.split(',');
                const pokeData = await Promise.all(
                    ids.map(id => fetch(`${CONFIG.API_BASE}${id}`).then(r => r.json()).catch(() => ({name: `#${id}`, id})))
                );
                
                detail.innerHTML = pokeData.map(p => `
                    <div class="flex flex-col items-center gap-1 bg-black/30 rounded-xl p-3 border border-white/5 cursor-pointer hover:border-pkm-blue/30 hover:bg-black/50 transition-all" onclick="event.stopPropagation(); showPkmModal(${p.id})">
                        <img src="${CONFIG.SPRITE_BASE}${p.id}.png" class="w-16 h-16 object-contain">
                        <span class="font-rajdhani font-bold text-[10px] uppercase tracking-wider text-white/80">${p.name.replace(/-/g, ' ')}</span>
                    </div>
                `).join('');
            };
            
            grid.appendChild(card);
        });
    } catch (e) { console.error("Leader Load Fail", e); }
}

// --- Custom Confirmation Modal Logic ---
function showConfirm(title, message) {
    return new Promise((resolve) => {
        const modal = document.getElementById('confirm-modal');
        const titleEl = document.getElementById('confirm-modal-title');
        const msgEl = document.getElementById('confirm-modal-message');
        const cancelBtn = document.getElementById('confirm-modal-cancel');
        const proceedBtn = document.getElementById('confirm-modal-proceed');

        titleEl.textContent = title;
        msgEl.textContent = message;
        modal.classList.remove('hidden');

        const cleanup = (result) => {
            modal.classList.add('hidden');
            cancelBtn.onclick = null;
            proceedBtn.onclick = null;
            resolve(result);
        };

        cancelBtn.onclick = () => cleanup(false);
        proceedBtn.onclick = () => cleanup(true);
    });
}

// --- Pokémon Detail Modal ---
const TYPE_COLORS = {
    normal: '#A8A878', fire: '#F08030', water: '#6890F0', electric: '#F8D030',
    grass: '#78C850', ice: '#98D8D8', fighting: '#C03028', poison: '#A040A0',
    ground: '#E0C068', flying: '#A890F0', psychic: '#F85888', bug: '#A8B820',
    rock: '#B8A038', ghost: '#705898', dragon: '#7038F8', dark: '#705848',
    steel: '#B8B8D0', fairy: '#EE99AC'
};

async function showPkmModal(id) {
    const modal = document.getElementById('pokemon-modal');
    modal.classList.remove('hidden');
    document.getElementById('modal-pkm-name').textContent = 'Loading...';
    document.getElementById('modal-pkm-types').innerHTML = '';
    document.getElementById('modal-pkm-stats').innerHTML = '';
    document.getElementById('modal-pkm-sprite').src = `${CONFIG.SPRITE_BASE}${id}.png`;
    
    try {
        const res = await fetch(`${CONFIG.API_BASE}${id}`);
        const p = await res.json();
        
        document.getElementById('modal-pkm-name').textContent = p.name.replace(/-/g, ' ');
        document.getElementById('modal-pkm-sprite').src = p.sprites.other['official-artwork'].front_default || `${CONFIG.SPRITE_BASE}${id}.png`;
        
        document.getElementById('modal-pkm-types').innerHTML = p.types.map(t => 
            `<span class="px-3 py-1 rounded-full text-[10px] font-rajdhani font-bold uppercase tracking-widest text-white" style="background:${TYPE_COLORS[t.type.name] || '#888'}">${t.type.name}</span>`
        ).join('');
        
        const maxStat = 255;
        document.getElementById('modal-pkm-stats').innerHTML = p.stats.map(s => {
            const pct = Math.round((s.base_stat / maxStat) * 100);
            const label = s.stat.name.replace('special-', 'Sp.').replace('attack', 'Atk').replace('defense', 'Def').replace('speed', 'Spd').replace('hp', 'HP');
            return `<div class="flex items-center gap-3">
                <span class="font-rajdhani font-bold text-[10px] uppercase tracking-wider text-white/50 w-12 text-right">${label}</span>
                <div class="flex-grow h-2 bg-white/5 rounded-full overflow-hidden">
                    <div class="h-full rounded-full transition-all duration-500" style="width:${pct}%; background: ${pct > 70 ? '#4ade80' : pct > 40 ? '#facc15' : '#ef4444'}"></div>
                </div>
                <span class="font-rajdhani font-bold text-xs text-white/70 w-8">${s.base_stat}</span>
            </div>`;
        }).join('');
    } catch (e) { document.getElementById('modal-pkm-name').textContent = 'Error loading'; }
}

function closePkmModal(event) {
    document.getElementById('pokemon-modal').classList.add('hidden');
}

async function triggerRevealSequence(pData, sData) {
    document.getElementById('main-ui').classList.add('blur-bg');
    ELEMENTS.cinematicOverlay.style.opacity = '1';
    ELEMENTS.cinematicOverlay.style.pointerEvents = 'auto';
    setTimeout(() => { ELEMENTS.pokeballReveal.classList.add('anim-shake'); ELEMENTS.cinematicOverlay.classList.add('shaking'); }, 500);
    return new Promise(resolve => {
        setTimeout(() => {
            ELEMENTS.revealLight.style.opacity = '1';
            setTimeout(() => {
                populateResult(pData, sData);
                ELEMENTS.registrationForm.classList.add('hidden');
                ELEMENTS.resultScreen.classList.remove('hidden');
                ELEMENTS.cinematicOverlay.style.opacity = '0';
                ELEMENTS.cinematicOverlay.style.pointerEvents = 'none';
                document.getElementById('main-ui').classList.remove('blur-bg');
                ELEMENTS.revealLight.style.opacity = '0';
                ELEMENTS.resultScreen.classList.add('anim-result-entrance');
                // Show alliance CTA for aspirants (but hide for registered ROL Mascots)
                const mascotKey = ELEMENTS.mascotCodeInput ? ELEMENTS.mascotCodeInput.value.trim() : '';
                const isROLMascot = STATE.access === 'aspirant' && mascotKey.toUpperCase() === CONFIG.MASCOT_CODE.toUpperCase();
                
                if (ELEMENTS.aspirantCta) { 
                    (STATE.access === 'member' || isROLMascot) 
                        ? ELEMENTS.aspirantCta.classList.add('hidden') 
                        : ELEMENTS.aspirantCta.classList.remove('hidden'); 
                }
                resolve();
            }, 800);
        }, 3000);
    });
}

function populateResult(p, s) {
    ELEMENTS.pkmName.textContent = p.name.replace('-', ' ');
    const genus = s.genera.find(g => g.language.name === 'en');
    ELEMENTS.pkmGenus.textContent = genus ? genus.genus : 'Unknown Species';
    const flavor = s.flavor_text_entries.find(f => f.language.name === 'en');
    ELEMENTS.pkmFlavor.textContent = flavor ? flavor.flavor_text.replace(/\f/g, ' ') : "No biological data available.";
    ELEMENTS.pkmTypes.innerHTML = '';
    p.types.forEach(t => {
        const span = document.createElement('span'); span.className = `type-badge type-${t.type.name}`; span.textContent = t.type.name; ELEMENTS.pkmTypes.appendChild(span);
    });
    if (p.moves.length > 0) ELEMENTS.pkmMove.textContent = p.moves[Math.floor(Math.random() * p.moves.length)].move.name.replace('-', ' ');
    const baseSum = p.stats.reduce((acc, s) => acc + s.base_stat, 0);
    ELEMENTS.pkmCP.textContent = baseSum * 3 + Math.floor(Math.random() * 500);
    ELEMENTS.pkmSprite.src = p.sprites.other['official-artwork'].front_default || p.sprites.other.showdown.front_default;
}

async function resetRegistry() {
    const confirmed = await showConfirm(
        "Warning Level Alpha",
        "START OVER? ALL CURRENT PROGRESS AND DRAFT SELECTIONS WILL BE LOST."
    );
    if (!confirmed) return;
    ELEMENTS.resultScreen.classList.add('hidden');
    ELEMENTS.registrationForm.classList.remove('hidden');
    ELEMENTS.castleName.value = '';
    ELEMENTS.castleLevel.value = '';
    ELEMENTS.profilePicInput.value = '';
    ELEMENTS.profilePicPreview.classList.add('hidden');
    document.getElementById('profile-pic-placeholder').classList.remove('hidden');
    ELEMENTS.summonBtn.disabled = false;
    STATE.currentLore = '';
    STATE.profilePicUrl = '';
}
