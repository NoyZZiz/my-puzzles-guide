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
    BACKEND_URL: 'https://Noyzzing.pythonanywhere.com',
    TRAINER_CHARACTERS: [
        {name: 'Red', sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/trainers/1.png'},
        {name: 'Blue', sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/trainers/2.png'},
        {name: 'Misty', sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/trainers/3.png'},
        {name: 'Brock', sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/trainers/4.png'}
    ]
};

let STATE = {
    access: 'aspirant',
    selectedDraftIds: [],
    draftPool: [],
    currentView: 'main-interface',
    currentLore: '',
    profilePicUrl: ''
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
    profilePicThumb: document.getElementById('profile-pic-thumb')
};

// --- View Control ---
ELEMENTS.summonBtn.addEventListener('click', startSummon);
ELEMENTS.newSignatureBtn.addEventListener('click', resetRegistry);
document.getElementById('confirm-squad-btn').addEventListener('click', finalizeSquad);

// Profile pic preview
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

function setAccess(type) {
    STATE.access = type;
    const codeContainer = document.getElementById('member-code-container');
    const btnAspirant = document.getElementById('btn-aspirant');
    const btnMember = document.getElementById('btn-member');
    
    if (type === 'member') {
        codeContainer.classList.remove('hidden');
        btnMember.classList.add('text-pkm-red', 'border-pkm-red');
        btnAspirant.classList.remove('text-pkm-blue', 'border-pkm-blue');
        ELEMENTS.summonBtn.querySelector('span').textContent = "Join Draft Game";
    } else {
        codeContainer.classList.add('hidden');
        btnAspirant.classList.add('text-pkm-blue', 'border-pkm-blue');
        btnMember.classList.remove('text-pkm-red', 'border-pkm-red');
        ELEMENTS.summonBtn.querySelector('span').textContent = "Initialize Capture";
    }
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
        renderDraftPool();
        toggleView('draft-screen');
    } catch (e) { alert("DRAFT SERVER OFFLINE."); }
}

async function renderDraftPool() {
    const container = document.getElementById('draft-pool');
    container.innerHTML = '<p class="col-span-full text-center text-white/30 text-sm uppercase tracking-widest animate-pulse">Loading Pokémon Data...</p>';
    
    // Fetch names for all draft Pokémon
    const pokeDataPromises = STATE.draftPool.map(id =>
        fetch(`${CONFIG.API_BASE}${id}`).then(res => res.json()).catch(() => ({name: `#${id}`, id}))
    );
    const allPokemon = await Promise.all(pokeDataPromises);
    
    container.innerHTML = '';
    allPokemon.forEach(poke => {
        const id = poke.id;
        const name = poke.name ? poke.name.replace(/-/g, ' ') : `#${id}`;
        const card = document.createElement('div');
        card.className = 'draft-card bg-pkm-panel p-4 rounded-3xl flex flex-col items-center gap-2 cursor-pointer hover:border-pkm-yellow border-2 border-transparent transition-all';
        card.innerHTML = `<img src="${CONFIG.SPRITE_BASE}${id}.png" class="w-24 h-24 object-contain"><span class="font-rajdhani font-bold text-xs uppercase tracking-widest text-white/70">${name}</span>`;
        card.onclick = () => toggleDraftSelection(id, card);
        container.appendChild(card);
    });
}

function toggleDraftSelection(id, card) {
    const idx = STATE.selectedDraftIds.indexOf(id);
    if (idx > -1) { STATE.selectedDraftIds.splice(idx, 1); card.classList.remove('selected'); }
    else { if (STATE.selectedDraftIds.length >= 6) return; STATE.selectedDraftIds.push(id); card.classList.add('selected'); }
    
    document.getElementById('selection-count').textContent = STATE.selectedDraftIds.length;
    
    const confirmBtn = document.getElementById('confirm-squad-btn');
    
    if (STATE.selectedDraftIds.length === 6) {
        confirmBtn.disabled = false;
        confirmBtn.classList.remove('opacity-50');
    } else {
        confirmBtn.disabled = true;
        confirmBtn.classList.add('opacity-50');
    }
}

async function finalizeSquad() {
    const castleName = ELEMENTS.castleName.value.trim();
    const castleLevel = ELEMENTS.castleLevel.value.trim();
    const char = CONFIG.TRAINER_CHARACTERS[Math.floor(Math.random() * CONFIG.TRAINER_CHARACTERS.length)].name;
    
    // Upload profile pic first if selected
    let profilePicUrl = '';
    const picFile = ELEMENTS.profilePicInput.files[0];
    if (picFile) {
        try {
            const formData = new FormData();
            formData.append('file', picFile);
            formData.append('alias', castleName);
            const uploadRes = await fetch(`${CONFIG.BACKEND_URL}/upload_profile_pic`, {
                method: 'POST', body: formData
            });
            const uploadData = await uploadRes.json();
            profilePicUrl = uploadData.url;
        } catch (e) { console.error('Pic upload failed', e); }
    }
    
    try {
        const res = await fetch(`${CONFIG.BACKEND_URL}/save_global_assignment`, {
            method: 'POST', headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({ 
                alias: castleName, 
                identity: 'ROL Gym Boss', 
                pool: 'Alliance National Dex', 
                house: 'ROL Alliance', 
                squad: STATE.selectedDraftIds.join(','), 
                character: char,
                castle_name: castleName,
                castle_level: castleLevel,
                lore: '',
                profile_pic: profilePicUrl
            })
        });
        if (res.ok) { alert("CONGRATULATIONS GYM BOSS!"); toggleView('hall-of-leaders'); }
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

function resetRegistry() {
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
