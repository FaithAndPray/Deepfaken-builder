    // CONSTANTS & CONFIGURATION

        const CLOUDFLARE_API = "https://deepfaken-db.deepwoken-modded.workers.dev";
        const CATEGORIES = {
            WEAPONS: ['heavy', 'medium', 'light', 'specs', 'enchants'],
            ATTUNEMENTS: ['Lifeweave', 'Ironsing', 'Flamecharm', 'Thundercall', 'Galebreathe', 'Frostdraw', 'Shadowcast', 'lightkeep', 'ballplay', 'Attunementless']
        };
        const GEMS = ['bloodless', 'wind', 'blue', 'insignia', 'wayward', 'blessed', 'aegis'];
        const ATTUNEMENT_ICONS = {
    'Lifeweave': 'pics/Lifeweave.png',
    'Ironsing': 'pics/Ironsing.png',
    'Flamecharm': 'pics/Flamecharm.png',
    'Thundercall': 'pics/Thundercall.png',
    'Galebreathe': 'pics/Galebreathe.png',
    'Frostdraw': 'pics/Frostdraw.png',
    'Shadowcast': 'pics/Shadowcast.png',
    'Attunementless': 'pics/Attunementless.png',
    'lightkeep': 'pics/Lightkeep.png', 
    'ballplay': 'pics/Ballplay.png'    
};

const GEM_ICONS = {
    'bloodless': 'pics/gem_bloodless.png', 
    'wind': 'pics/gem_wind.png',           
    'blue': 'pics/gem_blue.png',           
    'insignia': 'pics/gem_insignia.png',   
    'wayward': 'pics/gem_wayward.png',     
    'blessed': 'pics/gem_blessed.png',     
    'aegis': 'pics/gem_aegis.png'          
};

let mantraPendingGem = null;
let selectedParchmentMantraId = null;
let mrSelectedTextDisplay = 'X';
        const defaultDB = {
            kits: [
                {id:'k1', name:'Standard Kit', image:'https://images.unsplash.com/photo-1614030424754-24d0eebd46b2?w=150', description:'Basic starter kit.'}
            ],
            oaths: [
                {id:'o1', name:'Oathless', image:'https://images.unsplash.com/photo-1507608616759-54f48f0af0ee?w=150', description:'No oath taken.'},
                {id:'o2', name:'Blindseer', image:'https://images.unsplash.com/photo-1519077229555-4674a273ebf1?w=150', description:'See the unseen.'}
            ],
            bells: [
                {id:'b1', name:'Crazy Slots', image:'https://images.unsplash.com/photo-1596495578065-6e0763fa1178?w=150', description:'Roll for a weapon.'},
                {id:'b2', name:'Smite', image:'https://images.unsplash.com/photo-1605806616949-1e87b487cb2a?w=150', description:'Divine punishment.'}
            ],
            weapons: {
                heavy: [ {id:'wh1', name:'Greatsword', image:'https://images.unsplash.com/photo-1589578228447-e1a4e481c6c8?w=150', description:'Slow and strong.'} ],
                medium: [ {id:'wm1', name:'Sword', image:'https://images.unsplash.com/photo-1595590424283-b8f17842773f?w=150', description:'Balanced.'} ],
                light: [ {id:'wl1', name:'Dagger', image:'https://images.unsplash.com/photo-1590419690008-905895e8fe0d?w=150', description:'Fast.'} ],
                specs: [ {id:'ws1', name:'Fist', image:'https://images.unsplash.com/photo-1555597673-b21d5c935865?w=150', description:'Punch.'} ]
            },
            mantras: {
                Lifeweave: [ { id: 'm_lw1', name: 'Tree of Death', image: '' }, { id: 'm_lw2', name: 'Vine Whip', image: '' } ],
                Ironsing: [ { id: 'm_ir1', name: 'Metal Eruption', image: '' }, { id: 'm_ir2', name: 'Metal Ball', image: '' } ],
                Flamecharm: [ { id: 'm_fl1', name: 'Fire blade' }, { id: 'm_fl2', name: 'Fire palm' }, { id: 'm_fl3', name: 'Rising Flame' }, { id: 'm_fl4', name: 'Burning Servants' } ],
                Thundercall: [ { id: 'm_th1', name: 'Thunder kick' }, { id: 'm_th2', name: 'grand javelin' }, { id: 'm_th3', name: 'Lightning Assault' }, { id: 'm_th4', name: 'Devastating Thrash' } ],
                Galebreathe: [ { id: 'm_ga1', name: 'Gale lunge' }, { id: 'm_ga2', name: 'Wind blade' }, { id: 'm_ga3', name: 'Heavenly wind' } ],
                Frostdraw: [ { id: 'm_fr1', name: 'Frost grab' }, { id: 'm_fr2', name: 'ice daggers' }, { id: 'm_fr3', name: 'ice smash' } ],
                Shadowcast: [ { id: 'm_sh1', name: 'shadow gun' }, { id: 'm_sh2', name: 'shadow eruption' }, { id: 'm_sh3', name: 'clutching shadow' }, { id: 'm_sh4', name: 'shadow roar' } ],
                lightkeep: [ { id: 'm_lk1', name: 'light blade' }, { id: 'm_lk2', name: 'solar servant' } ],
                ballplay: [ { id: 'm_bp1', name: 'direct shot' }, { id: 'm_bp2', name: 'two-gun volley' } ],
                Attunementless: [ { id: 'm_at1', name: 'strong left' }, { id: 'm_at2', name: 'rapid punches' }, { id: 'm_at3', name: 'sky shatter kick' }, { id: 'm_at4', name: 'shoulder bash' }, { id: 'm_at5', name: 'rapid slashes' }, { id: 'm_at6', name: 'masters fluorish' }, { id: 'm_at7', name: 'pressure blast' } ]
            }
        };

        // VARIABLES
        let db = JSON.parse(localStorage.getItem('deepfaken_db'));
        if (!db || !db.kits) { db = defaultDB; saveDB(); }
        if (!db.weapons.enchants) { db.weapons.enchants = []; saveDB(); }

        let currentBuild = { kit: null, oath: null, weapon: null, enchant: null, bell: null, bellCorrupted: false, mantras: [], notes: "", bonusMantraGem: null };
        
        let currentSelectionType = null;
        let currentSelectionTab = null;
        let previewedItem = null;
        let currentDbTab = 'kits';
        let currentDbSubTab = null;
        let editingItemId = null;
        let editingItemType = null;
        let currentSessionToken = null;
        
    // on page loads

       window.onload = async () => {
    try {
        const res = await fetch(CLOUDFLARE_API + '?t=' + new Date().getTime());
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        
        const globalData = await res.json();
        
        if (globalData && Object.keys(globalData).length > 0 && globalData.kits) {
            console.log("Successfully loaded global database from Cloudflare!");
            db = globalData;
            localStorage.setItem('deepfaken_db', JSON.stringify(db));
        } else {
            console.log("Global database is empty, using default DB.");
            if (!db || !db.kits) db = defaultDB;
        }
    } catch (e) {
        console.error("Failed to load global DB, using local cache.", e);
        if (!db || !db.kits) db = defaultDB;
    }

    let loadedFromShareLink = false;

    if (window.location.hash) {
        try {
            const hash = window.location.hash.substring(1);
            const buildData = JSON.parse(decodeURIComponent(atob(hash)));
            if(buildData) {
            currentBuild = buildData;
            loadedFromShareLink = true;
        }
        } catch(e) { console.error('Failed to load build from URL'); }
    }

    
    if (!loadedFromShareLink && !currentBuild.kit) {
        const starterKit = db.kits.find(k => k.name.toLowerCase() === 'starter');
        
        if (starterKit) {
            currentBuild.kit = starterKit;
        } else if (db.kits && db.kits.length > 0) {
            currentBuild.kit = db.kits[0]; 
        }
    }

    renderSidebar();
};
    
// DATABASE MANAGEMENT

async function openDB() {
    const pw = prompt("Enter Password:");
    if (!pw) return;

    document.body.style.cursor = "wait";

    try {
        const res = await fetch(CLOUDFLARE_API, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": pw
            },
            body: JSON.stringify({ action: "verify" })
        });

        if (res.ok) {
            currentSessionToken = pw; 
            document.getElementById('db-modal').classList.add('active'); 
            
            setTimeout(() => {
                const firstTabBtn = document.querySelector('.db-body .tab-btn');
                if (firstTabBtn) switchDbTab('kits', firstTabBtn);
            }, 50);
        } else if (res.status === 401) {
            alert("Wrong Password! Access Denied.");
        } else {
            
            const errData = await res.json();
            alert("Cloudflare Server Error:\n\n" + errData.error);
        }
    } catch (e) {
        console.error("Verification failed:", e);
        alert("Network error: Check console (F12) for details.");
    } finally {
        document.body.style.cursor = "default";
    }
}

     async function saveDB() {
    localStorage.setItem('deepfaken_db', JSON.stringify(db));
    if (currentSessionToken) {
        try {
            const res = await fetch(CLOUDFLARE_API, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": currentSessionToken
                },
                body: JSON.stringify(db)
            });
            
            if (res.ok) {
                console.log("Successfully saved database to Cloudflare!");
            } else {
                alert(`Error saving to global database! (Status: ${res.status}). Your password might be wrong.`);
            }
        } catch (e) {
            console.error("Failed to sync to Cloudflare", e);
            alert("Network error: Could not connect to Cloudflare to save database.");
        }
    }
}

        function closeDB() {
            document.getElementById('db-modal').classList.remove('active');
            cancelDbForm();
        }

    function switchDbTab(tab, btnElement) {
    currentDbTab = tab;
    if(btnElement) {
        document.querySelectorAll('#db-list-view > .tabs:first-child .tab-btn').forEach(b => b.classList.remove('active'));
        btnElement.classList.add('active');
    }
    document.getElementById('db-search').value = '';

    const subTabsContainer = document.getElementById('db-sub-tabs');
    if (tab === 'weapons') {
        subTabsContainer.classList.remove('hidden');
        subTabsContainer.innerHTML = '';
        CATEGORIES.WEAPONS.forEach((cat, idx) => {
            let btn = document.createElement('button');
            btn.className = `tab-btn ${idx === 0 ? 'active' : ''}`;
            btn.innerText = cat.toUpperCase();
            btn.onclick = () => {
                document.querySelectorAll('#db-sub-tabs .tab-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                currentDbSubTab = cat;
                renderDbList();
            };
            subTabsContainer.appendChild(btn);
        });
        currentDbSubTab = CATEGORIES.WEAPONS[0];
    } else {
        subTabsContainer.classList.add('hidden');
        currentDbSubTab = null;
    }

    renderDbList();
}

        function getFlatDbList(type) {
        if (type === 'weapons') {
            if (currentDbSubTab && db.weapons[currentDbSubTab]) {
                return db.weapons[currentDbSubTab].map(i => ({...i, _sub: currentDbSubTab}));
            }
            return [];
        }
        if (type === 'mantras') {
            let arr = [];
            CATEGORIES.ATTUNEMENTS.forEach(att => {
                if(db.mantras[att]) arr = arr.concat(db.mantras[att].map(i => ({...i, _att: att})));
            });
            return arr;
        }
        return db[type] || [];
}
        function renderDbList() {
            const listContainer = document.getElementById('db-list');
            listContainer.innerHTML = '';
            
            let list = getFlatDbList(currentDbTab);
            const query = document.getElementById('db-search').value.toLowerCase();
            if(query) list = list.filter(i => i.name.toLowerCase().includes(query));

            list.forEach(item => {
                const catLabel = item._sub ? `[${item._sub}]` : (item._att ? `[${item._att}]` : '');
                const row = document.createElement('div');
                row.className = 'db-row';
                row.innerHTML = `
                    <img src="${item.image || 'pics/question.png'}">
                    <div class="db-row-name">${item.name} <span class="db-row-cat">${catLabel}</span></div>
                    <div class="db-actions">
                        <button class="btn-edit" onclick="openDbForm('${currentDbTab}', '${item.id}')">Edit</button>
                        <button class="btn-del" onclick="deleteDbItem('${currentDbTab}', '${item.id}')">Delete</button>
                    </div>
                `;
                listContainer.appendChild(row);
            });
            
            if(list.length===0) listContainer.innerHTML = '<div style="color:#888; padding:20px;">No items found.</div>';
        }

        function deleteDbItem(type, id) {
            if(!confirm("Delete this item permanently?")) return;
            
            if (type === 'weapons') {
                CATEGORIES.WEAPONS.forEach(c => { db.weapons[c] = db.weapons[c].filter(i => i.id !== id); });
            } else if (type === 'mantras') {
                CATEGORIES.ATTUNEMENTS.forEach(c => { if(db.mantras[c]) db.mantras[c] = db.mantras[c].filter(i => i.id !== id); });
            } else {
                db[type] = db[type].filter(i => i.id !== id);
            }
            saveDB();
            renderDbList();
        }
        function toggleDbFields() {
    const type = editingItemType;
    const cat = document.getElementById('db-form-cat').value;
    
   document.getElementById('db-form-stats-container').style.display = (type === 'kits' || type === 'oaths' || type === 'weapons' || type === 'bells' || type === 'mantras') ? 'flex' : 'none';
    document.getElementById('db-form-weapon-container').style.display = (type === 'weapons' && cat !== 'enchants') ? 'flex' : 'none';
    document.getElementById('db-form-mantra-container').style.display = (type === 'mantras') ? 'flex' : 'none';
    document.getElementById('db-form-bell-container').style.display = (type === 'bells') ? 'flex' : 'none';
}

function addExtraBuffRow(buff = {name:'', hp:0, posture:0, dmgBuff:0, dmgResis:0, speedBuff:0}) {
    const container = document.getElementById('db-form-extra-buffs');
    const row = document.createElement('div');
    row.style.cssText = "display:flex; flex-direction:column; gap:10px; background:rgba(0,0,0,0.4); padding:15px; border-radius:8px; border: 1px solid rgba(255,255,255,0.05);";
    row.innerHTML = `
        <div style="display: flex; justify-content: space-between; align-items: center;">
            <input type="text" class="eb-name" placeholder="buff name" value="${buff.name}" style="flex: 1; margin-right: 15px; font-weight: bold; background: rgba(0,0,0,0.8);">
            <button type="button" onclick="this.parentElement.parentElement.remove()" style="background:var(--danger); color:white; padding:8px 12px; border-radius:6px; cursor:pointer; font-weight: bold;">X</button>
        </div>
        <div style="display: flex; gap: 10px; flex-wrap: wrap;">
            <div style="flex: 1; min-width: 70px;"><label style="font-size: 0.7rem; color:#aaa; text-transform:uppercase;">HP</label><input type="number" class="eb-hp" value="${buff.hp || 0}" style="margin-top:4px;"></div>
            <div style="flex: 1; min-width: 70px;"><label style="font-size: 0.7rem; color:#aaa; text-transform:uppercase;">Posture</label><input type="number" class="eb-posture" value="${buff.posture || 0}" style="margin-top:4px;"></div>
            <div style="flex: 1; min-width: 70px;"><label style="font-size: 0.7rem; color:#aaa; text-transform:uppercase;">DMG Buff %</label><input type="number" class="eb-dmgBuff" value="${buff.dmgBuff || 0}" style="margin-top:4px;"></div>
            <div style="flex: 1; min-width: 70px;"><label style="font-size: 0.7rem; color:#aaa; text-transform:uppercase;">Resis %</label><input type="number" class="eb-dmgResis" value="${buff.dmgResis || 0}" style="margin-top:4px;"></div>
            <div style="flex: 1; min-width: 70px;"><label style="font-size: 0.7rem; color:#aaa; text-transform:uppercase;">Speed %</label><input type="number" class="eb-speedBuff" value="${buff.speedBuff || 0}" style="margin-top:4px;"></div>
        </div>
    `;
    container.appendChild(row);
}
function openDbForm(type = currentDbTab, id = null) {
    editingItemType = type;
    let item = null;
    
    if (id) {
        item = getFlatDbList(type).find(i => i.id === id);
    }
    
    editingItemId = item ? item.id : generateId();
    document.getElementById('db-form-title').innerText = item ? `Edit ${type.slice(0,-1)}` : `Add New ${type.slice(0,-1)}`;
    
    // Set Basic info
    document.getElementById('db-form-name').value = item ? item.name : '';
    document.getElementById('db-form-image').value = item ? (item.image||'') : '';
    document.getElementById('db-form-desc').value = item ? (item.description||'') : '';
    
    
    // Set Stats
    document.getElementById('db-form-hp').value = item?.hp || 0;
    document.getElementById('db-form-posture').value = item?.posture || 0;
    document.getElementById('db-form-dmgbuff').value = item?.dmgBuff || 0;
    document.getElementById('db-form-dmgresis').value = item?.dmgResis || 0;
    document.getElementById('db-form-speedbuff').value = item?.speedBuff || 0;
    const ebContainer = document.getElementById('db-form-extra-buffs');
    ebContainer.innerHTML = '';
    if (item && item.extraBuffs) {
        item.extraBuffs.forEach(b => addExtraBuffRow(b));
    }
    
    // Set Checkboxes & Specifics
    document.getElementById('db-form-m1dmg').value = item?.m1Dmg || 0;
    document.getElementById('db-form-nonenchantable').checked = item?.isNonEnchantable || false;
    document.getElementById('db-form-isbonus').checked = item?.isBonus || false;
    document.getElementById('db-form-cancorrupt').checked = item?.canCorrupt || false;

    const catContainer = document.getElementById('db-form-cat-container');
    const catSelect = document.getElementById('db-form-cat');
    catSelect.innerHTML = '';
    
    if (type === 'weapons') {
        catContainer.style.display = 'flex';
        document.getElementById('db-form-cat-label').innerText = 'Weapon Category';
        CATEGORIES.WEAPONS.forEach(c => { catSelect.innerHTML += `<option value="${c}">${c}</option>`; });
        if(item && item._sub) catSelect.value = item._sub;
    } else if (type === 'mantras') {
        catContainer.style.display = 'flex';
        document.getElementById('db-form-cat-label').innerText = 'Attunement';
        CATEGORIES.ATTUNEMENTS.forEach(c => { catSelect.innerHTML += `<option value="${c}">${c}</option>`; });
        if(item && item._att) catSelect.value = item._att;
    } else {
        catContainer.style.display = 'none';
    }
    
    toggleDbFields();

    document.getElementById('db-list-view').classList.add('hidden');
    document.getElementById('db-form-view').classList.remove('hidden');
}

        function cancelDbForm() {
            document.getElementById('db-list-view').classList.remove('hidden');
            document.getElementById('db-form-view').classList.add('hidden');
            }

        function saveDbItem() {
    const name = document.getElementById('db-form-name').value.trim();
    if(!name) return alert('Name is required');
    
    const extraBuffs = Array.from(document.getElementById('db-form-extra-buffs').children).map(row => ({
        name: row.querySelector('.eb-name').value.trim(),
        hp: parseFloat(row.querySelector('.eb-hp').value) || 0,
        posture: parseFloat(row.querySelector('.eb-posture').value) || 0,
        dmgBuff: parseFloat(row.querySelector('.eb-dmgBuff').value) || 0,
        dmgResis: parseFloat(row.querySelector('.eb-dmgResis').value) || 0,
        speedBuff: parseFloat(row.querySelector('.eb-speedBuff').value) || 0
    })).filter(b => b.name !== "");

    const item = {
        id: editingItemId,
        name: name,
        image: document.getElementById('db-form-image').value.trim(),
        description: document.getElementById('db-form-desc').value.trim(),
        hp: parseFloat(document.getElementById('db-form-hp').value) || 0,
        posture: parseFloat(document.getElementById('db-form-posture').value) || 0,
        dmgBuff: parseFloat(document.getElementById('db-form-dmgbuff').value) || 0,
        dmgResis: parseFloat(document.getElementById('db-form-dmgresis').value) || 0,
        speedBuff: parseFloat(document.getElementById('db-form-speedbuff').value) || 0,
        extraBuffs: extraBuffs,
        m1Dmg: parseFloat(document.getElementById('db-form-m1dmg').value) || 0,
        isBonus: document.getElementById('db-form-isbonus').checked,
        canCorrupt: document.getElementById('db-form-cancorrupt').checked,
        isNonEnchantable: document.getElementById('db-form-nonenchantable').checked
    };
    
    const cat = document.getElementById('db-form-cat').value;
    
    if (editingItemType === 'weapons') {
        CATEGORIES.WEAPONS.forEach(c => { db.weapons[c] = db.weapons[c].filter(i => i.id !== item.id); });
        db.weapons[cat].push(item);
    } else if (editingItemType === 'mantras') {
        CATEGORIES.ATTUNEMENTS.forEach(c => { if(db.mantras[c]) db.mantras[c] = db.mantras[c].filter(i => i.id !== item.id); });
        if(!db.mantras[cat]) db.mantras[cat] = [];
        db.mantras[cat].push(item);
    } else {
        let list = db[editingItemType];
        const idx = list.findIndex(i => i.id === item.id);
        if(idx > -1) list[idx] = item;
        else list.push(item);
    }
    
    saveDB();
    cancelDbForm();
    renderDbList();
}

// UTILITIES & CALCULATIONS
        function generateId() { return Math.random().toString(36).substr(2, 9); }
        function hideStartScreen() {
    const screen = document.getElementById('start-screen');
    screen.classList.add('fade-out');
    setTimeout(() => {
        screen.style.display = 'none';
    }, 500); 
}

function calculateStats() {
    if (!currentBuild.disabledBuffs) currentBuild.disabledBuffs = {};
    
    let totalHp = 300, posture = 30, rawDmgBuffs = 0, dmgResis = 0, speedBuffs = 0;

    const slots = [
        { id: 'Kit', item: currentBuild.kit },
        { id: 'Oath', item: currentBuild.oath },
        { id: 'Weapon', item: currentBuild.weapon },
        { id: 'Enchant', item: currentBuild.weaponEnchant },
        { id: 'Bell', item: currentBuild.bell }
    ];

    const applyStats = (i, slotId) => {
        if (!currentBuild.disabledBuffs[slotId]) {
            totalHp += (i.hp || 0); posture += (i.posture || 0);
            rawDmgBuffs += (i.dmgBuff || 0); dmgResis += (i.dmgResis || 0); speedBuffs += (i.speedBuff || 0);
        }
        if (i.extraBuffs) {
            i.extraBuffs.forEach((b, idx) => {
                if (!currentBuild.disabledBuffs[`${slotId}_eb_${idx}`]) {
                    totalHp += (b.hp || 0); posture += (b.posture || 0);
                    rawDmgBuffs += (b.dmgBuff || 0); dmgResis += (b.dmgResis || 0); speedBuffs += (b.speedBuff || 0);
                }
            });
        }
    };

    slots.forEach(slot => { if (slot.item) applyStats(slot.item, slot.id); });
    currentBuild.mantras.forEach((m, idx) => { if (m.mantra) applyStats(m.mantra, 'Mantra_' + idx); });
    if (currentBuild.kit && currentBuild.kit.name.toLowerCase().includes('idiot')) {
        rawDmgBuffs = 0;
        dmgResis = 0;
        dmgBuff = 0;
    }

    let effectiveDmgBuffs = rawDmgBuffs;
    let halvedAmount = 0;
    if (rawDmgBuffs > 25) {
        halvedAmount = rawDmgBuffs - 25;
        effectiveDmgBuffs = 25 + (halvedAmount / 2);
    }

    document.getElementById('stat-hp').innerText = totalHp;
    document.getElementById('stat-posture').innerText = posture;
    
    const dmgBuffEl = document.getElementById('stat-dmg-buffs');
    if (halvedAmount > 0) {
        dmgBuffEl.innerHTML = `${effectiveDmgBuffs}%`;
    } else {
        dmgBuffEl.innerText = effectiveDmgBuffs + '%';
    }

    document.getElementById('stat-dmg-resis').innerText = dmgResis + '%';
    document.getElementById('stat-speed-buffs').innerText = speedBuffs + '%';

    const m1Text = document.getElementById('sidebar-weapon-m1');
    if (m1Text && currentBuild.weapon) {
        const baseM1 = currentBuild.weapon.m1Dmg || 0;
        const finalM1 = baseM1 * (1 + (effectiveDmgBuffs / 100));
        m1Text.innerText = `M1 DMG: ${parseFloat(finalM1.toFixed(1))}`;
    }

    return { rawDmgBuffs, effectiveDmgBuffs, halvedAmount };
}

function openStatsModal() {
    if (!currentBuild.disabledBuffs) currentBuild.disabledBuffs = {};
    const content = document.getElementById('stats-detail-content');
    content.innerHTML = '';

    const statsMath = calculateStats();

    let topHtml = '';
    if (statsMath.halvedAmount > 0) {
        topHtml = `
            <div style="background: rgba(0, 0, 0, 0.24); border: 1px solid white; padding: 15px; border-radius: 8px; margin-bottom: 15px;">
                <div style="color: white; font-weight: 800; margin-bottom: 6px; font-size: 1.1rem; text-transform: uppercase;">you hit the dmg softcap</div>
                <div style="font-size: 0.95rem; color: #ddd; line-height: 1.5;">
                    raw dmg bSuffs: <strong style="color:white;">${statsMath.rawDmgBuffs}%</strong><br>
                    real dmg buffs: <strong style="color:white;">${statsMath.effectiveDmgBuffs}%</strong>
                </div>
            </div>
        `;
    }

    let equipped = [
        { type: 'Kit', id: 'Kit', item: currentBuild.kit },
        { type: 'Oath', id: 'Oath', item: currentBuild.oath },
        { type: 'Weapon', id: 'Weapon', item: currentBuild.weapon },
        { type: 'Enchant', id: 'Enchant', item: currentBuild.weaponEnchant },
        { type: 'Bell', id: 'Bell', item: currentBuild.bell }
    ];
    currentBuild.mantras.forEach((m, idx) => equipped.push({ type: 'Mantra', id: 'Mantra_' + idx, item: m.mantra }));

    let html = topHtml;
    let hasItems = false;

    equipped.forEach(entry => {
        if (!entry.item) return;
        const i = entry.item;
        
        if (!i.hp && !i.posture && !i.dmgBuff && !i.dmgResis && !i.speedBuff && (!i.extraBuffs || i.extraBuffs.length === 0)) return;
        hasItems = true;

        let statsArr = [];
        if (i.hp) statsArr.push(`HP: ${i.hp > 0 ? '+'+i.hp : i.hp}`);
        if (i.posture) statsArr.push(`Posture: ${i.posture > 0 ? '+'+i.posture : i.posture}`);
        if (i.dmgBuff) statsArr.push(`DMG Buff: ${i.dmgBuff > 0 ? '+'+i.dmgBuff : i.dmgBuff}%`);
        if (i.dmgResis) statsArr.push(`Resis: ${i.dmgResis > 0 ? '+'+i.dmgResis : i.dmgResis}%`);
        if (i.speedBuff) statsArr.push(`Speed: ${i.speedBuff > 0 ? '+'+i.speedBuff : i.speedBuff}%`);

        const isChecked = !currentBuild.disabledBuffs[entry.id];

        let extraBuffsHtml = '';
        if (i.extraBuffs && i.extraBuffs.length > 0) {
            i.extraBuffs.forEach((b, ebIdx) => {
                const ebId = `${entry.id}_eb_${ebIdx}`;
                const ebChecked = !currentBuild.disabledBuffs[ebId];
                
                let ebStats = [];
                if (b.hp) ebStats.push(`HP: ${b.hp > 0 ? '+'+b.hp : b.hp}`);
                if (b.posture) ebStats.push(`Posture: ${b.posture > 0 ? '+'+b.posture : b.posture}`);
                if (b.dmgBuff) ebStats.push(`DMG%: ${b.dmgBuff > 0 ? '+'+b.dmgBuff : b.dmgBuff}%`);
                if (b.dmgResis) ebStats.push(`Resis: ${b.dmgResis > 0 ? '+'+b.dmgResis : b.dmgResis}%`);
                if (b.speedBuff) ebStats.push(`Spd: ${b.speedBuff > 0 ? '+'+b.speedBuff : b.speedBuff}%`);

                extraBuffsHtml += `
                    <div style="margin-top: 10px; padding: 10px; background: rgba(0,0,0,0.4); border-radius: 6px; border: 1px rgba(255,255,255,0.2); opacity: ${ebChecked ? '1' : '0.4'}; transition: 0.2s;">
                        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 4px;">
                            <span style="font-size: 0.95rem; color: white; font-weight: bold;">${b.name}</span>
                            <label style="cursor: pointer; font-size: 0.8rem; color: #aaa; display:flex; align-items:center; gap:5px; background: rgba(255,255,255,0.1); padding: 2px 6px; border-radius: 4px;">
                                <input type="checkbox" onchange="toggleBuffStatus('${ebId}')" ${ebChecked ? 'checked' : ''} style="width:14px; height:14px; margin:0;"> Enable
                            </label>
                        </div>
                        <div style="color: var(--secondary); font-size: 0.85rem; font-weight: bold;">
                            ${ebStats.join(' | ')}
                        </div>
                    </div>
                `;
            });
        }

        html += `
            <div style="background: rgba(0,0,0,0.6); padding: 15px; border: 1px solid rgba(255,255,255,0.1); border-radius: 8px; transition: 0.2s;">
                <div style="opacity: ${isChecked ? '1' : '0.4'}; transition: 0.2s;">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 5px;">
                        <div style="font-weight: 800; font-size: 1.2rem; color: #fff;">
                            <span style="color: #888; font-size: 0.8rem; text-transform: uppercase; margin-right: 10px;">[${entry.type}]</span>${i.name}
                        </div>
                        <label style="display: flex; align-items: center; gap: 8px; cursor: pointer; font-size: 0.85rem; color: #aaa; background: rgba(0,0,0,0.4); padding: 4px 8px; border-radius: 6px;">
                            <input type="checkbox" onchange="toggleBuffStatus('${entry.id}')" ${isChecked ? 'checked' : ''} style="width: 16px; height: 16px; cursor: pointer; margin:0;">
                            Base Buffs
                        </label>
                    </div>
                    <div style="color: var(--secondary); font-size: 0.9rem; font-weight: bold;">
                        ${statsArr.length > 0 ? statsArr.join(' &nbsp;|&nbsp; ') : 'No Base Stats'}
                    </div>
                </div>
                ${extraBuffsHtml}
            </div>
        `;
    });

    if (!hasItems && html === topHtml) html += '<div style="color:#888; text-align:center; padding: 20px;">No stat-altering items equipped.</div>';
    
    content.innerHTML = html;
    document.getElementById('stats-modal').classList.add('active');
}

function closeStatsModal(e) {
    if (e) e.stopPropagation();
    document.getElementById('stats-modal').classList.remove('active');
}

function toggleBuffStatus(id) {
    if (!currentBuild.disabledBuffs) currentBuild.disabledBuffs = {};
    currentBuild.disabledBuffs[id] = !currentBuild.disabledBuffs[id];

    calculateStats();
    openStatsModal(); 
}
// SIDEBAR RENDERING
        function renderSidebar() {
    
    const renderSlot = (id, item, isCorrupt = false) => {
                const container = document.getElementById(id);
                if (!item) {
                    container.innerHTML = '<div class="slot-empty">Empty</div>';
                } else {
                    const imgSrc = item.image || `pics/question.png`;
                    const corruptClass = isCorrupt ? 'corrupted-text' : '';
                    const corruptSuffix = isCorrupt ? ' (Corrupted)' : '';
                    container.innerHTML = `
                        <img src="${imgSrc}" class="slot-image">
                        <div class="slot-text ${corruptClass}">${item.name}${corruptSuffix}</div>
                    `;
                }
            };

renderSlot('sidebar-kit', currentBuild.kit);
    renderSlot('sidebar-oath', currentBuild.oath);
    

    const wContainer = document.getElementById('sidebar-weapon');
    if (!currentBuild.weapon) wContainer.innerHTML = '<div class="slot-empty">Empty</div>';
    else {
        wContainer.innerHTML = `
            <img src="${currentBuild.weapon.image || 'pics/question.png'}" class="slot-image">
            <div style="display:flex; flex-direction:column; justify-content:center;">
                <div class="slot-text">${currentBuild.weapon.name}</div>
                <div id="sidebar-weapon-m1" style="font-size:0.85rem; color: white; font-weight:bold; margin-top:2px;">M1 DMG: ${currentBuild.weapon.m1Dmg || 0}</div>
            </div>
        `;
    }


    const eContainer = document.getElementById('sidebar-enchant');
    if (!currentBuild.weaponEnchant) eContainer.innerHTML = '<div class="slot-empty">Empty</div>';
    else {
        eContainer.innerHTML = `<img src="${currentBuild.weaponEnchant.image || 'pics/question.png'}" class="slot-image"><div class="slot-text" style="color:#ffffff;">${currentBuild.weaponEnchant.name}</div>`;
    }

    const bContainer = document.getElementById('sidebar-bell');
    const b = currentBuild.bell;

    if (!b) {
        bContainer.innerHTML = '<div class="slot-empty">Empty</div>';
    } else {
        const imgSrc = b.image || `pics/question.png`;

        if (!b.canCorrupt) currentBuild.bellCorrupted = false; 

        const corruptClass = currentBuild.bellCorrupted ? 'corrupted-text' : '';
        const corruptSuffix = currentBuild.bellCorrupted ? ' (Corrupted)' : '';

        const corruptBtnHTML = b.canCorrupt 
            ? `<button onclick="event.stopPropagation(); toggleCorrupt()" style="padding: 4px 6px; background: rgba(255,71,87,0.2); color: #ff4757; border: 1px solid #ff4757; border-radius: 6px; font-weight:bold; font-size: 0.65rem; cursor: pointer;">CORRUPT</button>` 
            : ``;

        bContainer.innerHTML = `
            <div style="display:flex; align-items:center; gap:10px; width:100%;">
                <img src="${imgSrc}" class="slot-image">
                <div class="slot-text ${corruptClass}" style="flex:1;">${b.name}${corruptSuffix}</div>
                ${corruptBtnHTML}
            </div>
        `;
    }


    const mContainer = document.getElementById('sidebar-mantras');
    mContainer.innerHTML = '';
    
    if (currentBuild.mantras.length === 0) {
        mContainer.innerHTML = '<div class="slot-empty">Empty</div>';
    } else {
        currentBuild.mantras.forEach((m) => {
            const isBonus = m.mantra.isBonus;
            const imgSrc = m.mantra.image || `pics/question.png`;

            const extraClass = isBonus ? 'mantra-slot' : '';
            const textClass = isBonus ? 'slot-text' : 'slot-text';
            const nameLabel = m.mantra.name + (isBonus ? ' (Bonus)' : '');
            const gemHtml = m.gem ? `<div class="gem-badge" ${isBonus ? 'style="border-color:white; color:white;"' : ''}>${m.gem}</div>` : '';

            mContainer.innerHTML += `
                <div class="mantra-slot ${extraClass}">
                    <img src="${imgSrc}">
                    <div class="${textClass}" style="font-size:1rem; flex:1;">${nameLabel}</div>
                    ${gemHtml}
                </div>
            `;
        });
    }
    calculateStats();
}

function toggleCorrupt() {
    currentBuild.bellCorrupted = !currentBuild.bellCorrupted;
    renderSidebar();
}

//  SELECTION MODAL
function openSelectionModal(type, forceTab = null) {
    currentSelectionType = type;
    if (type === 'mantras') {
        document.getElementById('standard-selection-body').classList.add('hidden');
        document.getElementById('mantra-selection-body').classList.remove('hidden');
        
        const modalBody = document.querySelector('#selection-modal .modal-container');
        modalBody.style.background = "#111"; 
        
        currentSelectionTab = forceTab || CATEGORIES.ATTUNEMENTS[0];
        mantraPendingGem = null; 
        mrSelectedTextDisplay = 'X';
        renderMantraUI();
        
        document.getElementById('selection-modal').classList.add('active');
        return;
    }

    document.getElementById('standard-selection-body').classList.remove('hidden');
    document.getElementById('mantra-selection-body').classList.add('hidden');
    document.getElementById('modal-search').value = '';

    const tabsContainer = document.getElementById('modal-tabs');
    tabsContainer.innerHTML = '';

    const modalBody = document.querySelector('#selection-modal .modal-body-split');
    
    switch(type) {
        case 'bells': modalBody.style.background = "url('pics/bell-meau-background.png') center/cover no-repeat, rgba(0,0,0,0.5)"; break;
        case 'weapons':
        case 'oaths':
        case 'kits': modalBody.style.background = "url('pics/meaubg.png') center/cover no-repeat, rgba(0,0,0,0.5)"; break;
        default: modalBody.style.background = "rgba(15, 20, 25, 0.65)"; break;
    }

    if (type === 'weapons') {
        tabsContainer.classList.remove('hidden');
        CATEGORIES.WEAPONS.forEach((cat, idx) => {
            let btn = document.createElement('button');
            btn.className = `tab-btn ${cat === (forceTab || 'heavy') ? 'active' : ''}`;
            btn.innerText = cat.toUpperCase();
            btn.onclick = () => {
                document.querySelectorAll('#modal-tabs .tab-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                currentSelectionTab = cat;
                renderSelectionGrid();
            };
            tabsContainer.appendChild(btn);
        });
        currentSelectionTab = forceTab || 'heavy';
    } else {
        tabsContainer.classList.add('hidden');
        currentSelectionTab = null;
    }
    
    renderSelectionGrid();
    document.getElementById('selection-modal').classList.add('active');
}

        function closeSelectionModal() {
            document.getElementById('selection-modal').classList.remove('active');
        }

function renderSelectionGrid() {
    const grid = document.getElementById('item-grid');
    grid.innerHTML = '';
    
    let items = [];
    if (currentSelectionType === 'weapons') items = db.weapons[currentSelectionTab] || [];
    else if (currentSelectionType === 'mantras') items = db.mantras[currentSelectionTab] || [];
    else items = db[currentSelectionType] || [];
    
    const query = document.getElementById('modal-search').value.toLowerCase();
    items = items.filter(i => i.name.toLowerCase().includes(query));

    const tracker = document.getElementById('modal-mantra-tracker');
    if (currentSelectionType === 'mantras') {
        tracker.style.display = 'block';
        tracker.className = 'selected-mantra-container'; 
        
        const normalCount = currentBuild.mantras.filter(m => !m.mantra.isBonus).length;
        const hasBonus = currentBuild.mantras.some(m => m.mantra.isBonus);
        
        let trackerHtml = `<div class="selected-mantra-header">SELECTED MANTRAS (${normalCount}/2) ${hasBonus ? '+ 1 Bonus' : ''}</div><div class="selected-mantra-box">`;
        
        currentBuild.mantras.forEach(m => {
            const isBonus = m.mantra.isBonus;
            const bg = isBonus ? 'rgba(255, 215, 0, 0.2)' : 'rgba(0, 240, 255, 0.2)';
            const border = isBonus ? '1px solid gold' : '1px solid var(--primary)';
            const label = m.mantra.name + (isBonus ? ' (Bonus)' : '') + (m.gem ? ` [${m.gem}]` : '');
            trackerHtml += `<div class="equipped-mantra-btn" style="background:${bg}; border:${border};" onclick="viewEquippedMantra('${m.mantra.id}')">${label}</div>`;
        });
        trackerHtml += `</div>`;
        tracker.innerHTML = trackerHtml;
    } else {
        tracker.style.display = 'none';
        tracker.className = '';
    }
    
    items.forEach(item => {
        let isSelected = false;
        if (currentSelectionType === 'kits' && currentBuild.kit?.id === item.id) isSelected = true;
        else if (currentSelectionType === 'oaths' && currentBuild.oath?.id === item.id) isSelected = true;
        else if (currentSelectionType === 'weapons' && currentSelectionTab !== 'enchants' && currentBuild.weapon?.id === item.id) isSelected = true;
        else if (currentSelectionType === 'weapons' && currentSelectionTab === 'enchants' && currentBuild.weaponEnchant?.id === item.id) isSelected = true;
        else if (currentSelectionType === 'bells' && currentBuild.bell?.id === item.id) isSelected = true;
        else if (currentSelectionType === 'mantras' && currentBuild.mantras.some(m => m.mantra.id === item.id)) isSelected = true;

        let card = document.createElement('div');
        card.className = 'item-card';
        if (isSelected) {
            card.style.border = '2px solid var(--secondary)';
            card.style.background = 'rgba(74, 222, 128, 0.1)';
        } else {
            card.style.border = '2px solid transparent'; 
        }

        card.innerHTML = `<img src="${item.image || 'pics/question.png'}"><div class="name">${item.name}</div>`;
        
        card.onclick = () => {
            selectItem(item); 
            showDetails(item); 
        };
        grid.appendChild(card);
    });
    
    if(items.length > 0) showDetails(items[0]);
    else document.getElementById('detail-content').innerHTML = '<div style="color:#888; text-align:center; padding: 40px;">No items found.</div>';
}
        document.getElementById('modal-search').addEventListener('input', renderSelectionGrid);

function showDetails(item) {
    if (!item) return;
    let formattedDesc = (item.description || 'No description provided.')
        .replace(/\[(.*?)\]/g, '<img src="$1" style="max-width:100%; border-radius:8px; display:block; margin:10px 0;">');

    let gemHtml = '';
    
    document.getElementById('detail-content').innerHTML = `
        <img class="detail-img" src="${item.image || 'pics/question.png'}">
        <div class="detail-name">${item.name}</div>
        <div class="detail-desc">${formattedDesc}</div>
        ${gemHtml}
    `;
}

function selectItem(item, isCorrupted = false) {
    if (currentSelectionType === 'kits') currentBuild.kit = item;
    else if (currentSelectionType === 'oaths') currentBuild.oath = item;
    else if (currentSelectionType === 'weapons') {
        if (currentSelectionTab === 'enchants') {
            if (currentBuild.weapon && currentBuild.weapon.isNonEnchantable) {
                return alert("Your equipped weapon cannot be enchanted.");
            }
            currentBuild.weaponEnchant = item;
        } else {
            currentBuild.weapon = item;
            if (item.isNonEnchantable) {
                currentBuild.weaponEnchant = null;
            }
        }
    }
    else if (currentSelectionType === 'bells') {
        currentBuild.bell = item;
        currentBuild.bellCorrupted = isCorrupted;
    }
    else if (currentSelectionType === 'mantras') {
        const existingIdx = currentBuild.mantras.findIndex(m => m.mantra.id === item.id);
        
        if (existingIdx > -1) {
            // REMOVING a mantra
            currentBuild.mantras.splice(existingIdx, 1);
            
            
            const remainingRegulars = currentBuild.mantras.filter(m => !m.mantra.isBonus);
            const bonusIdx = currentBuild.mantras.findIndex(m => m.mantra.isBonus);
            
            if (bonusIdx > -1) {
                const bonusAtt = currentBuild.mantras[bonusIdx].mantra._att;
                const matchingReqs = remainingRegulars.filter(m => m.mantra._att === bonusAtt).length;
                if (matchingReqs < 2) {
                    currentBuild.mantras.splice(bonusIdx, 1);
                    alert("Bonus mantra automatically unequipped because you no longer have 2 regular mantras of its attunement.");
                }
            }
        } else {
            
            const normalCount = currentBuild.mantras.filter(m => !m.mantra.isBonus).length;
            const bonusCount = currentBuild.mantras.filter(m => m.mantra.isBonus).length;

            if (item.isBonus) {
          
                const matchingReqs = currentBuild.mantras.filter(m => !m.mantra.isBonus && m.mantra._att === currentSelectionTab).length;
                
                if (bonusCount >= 1) {
                    alert('You can only pick 1 Bonus Mantra!');
                } else if (matchingReqs < 2) {
                    alert(`You need 2 regular ${currentSelectionTab} mantras equipped first to select this bonus mantra!`);
                } else {
                
                    currentBuild.mantras.push({ mantra: {...item, _att: currentSelectionTab}, gem: null });
                }
            } else {
                if (normalCount >= 2) {
                    alert('You can only pick 2 mantras (3rd must be a 3 star Mantra)!');
                } else {
                    currentBuild.mantras.push({ mantra: {...item, _att: currentSelectionTab}, gem: null });
                }
            }
        }
    }
    
    renderSidebar();
    if (currentSelectionType === 'mantras') {
        renderMantraUI();
    } else {
        renderSelectionGrid();
    }
}

function setMantraGem(mantraId, gemName) {
    const mIndex = currentBuild.mantras.findIndex(m => m.mantra.id === mantraId);
    if (mIndex > -1) {
        currentBuild.mantras[mIndex].gem = gemName;
        renderSidebar(); 
        if (currentSelectionType === 'mantras') {
        renderMantraUI();
    } else {
        renderSelectionGrid();
    }
        viewEquippedMantra(mantraId); 
    }
}

 

// CONTEXT MENU FOR MANTRAS
function renderMantraUI() {
    const container = document.getElementById('mantra-selection-body');
    let topIconsHTML = `<div class="mr-top-grid">`;
    

    const displayOrder = ['Lifeweave', 'Ironsing', 'Attunementless', 'Flamecharm', 'Thundercall', 'Galebreathe', 'Frostdraw', 'Shadowcast', 'ballplay', 'lightkeep'];
    
    displayOrder.forEach(att => {
        const isActive = currentSelectionTab === att ? 'mr-active-att' : '';
        const imgSrc = ATTUNEMENT_ICONS[att] || 'pics/question.png';
        topIconsHTML += `
            <div class="mr-att-slot ${isActive}" onclick="switchMantraAttunement('${att}')">
                <img src="${imgSrc}">
            </div>`;
    });
    topIconsHTML += `</div>`;

    let equippedHTML = '';
    currentBuild.mantras.forEach(m => {
        const isPending = mantraPendingGem === m.mantra.id ? 'mr-pending' : '';
        equippedHTML += `
            <div class="mr-equipped-item ${isPending}" onclick="setPendingGemMantra('${m.mantra.id}')">
                <img src="${m.mantra.image || 'pics/question.png'}">
                <div class="mr-eq-label">${m.mantra.name}</div>
                ${m.gem ? `<div class="mr-eq-gem">${m.gem}</div>` : ''}
            </div>
        `;
    });

   
    let listHTML = `<div class="mr-parchment-panel">`;
    let availableMantras = db.mantras[currentSelectionTab] || [];
    availableMantras.forEach(m => {
        const isSelected = selectedParchmentMantraId === m.id;
        const selClass = isSelected ? 'mr-selected-text' : ''; 
        listHTML += `<div class="mr-parchment-item ${selClass}" onclick="handleParchmentClick('${m.id}')">${m.name}</div>`;
    });
    listHTML += `</div>`;

    let gemsHTML = `<div class="mr-gem-row">`;
    GEMS.forEach(g => {
        const imgSrc = GEM_ICONS[g] || 'pics/question.png';
        gemsHTML += `<img src="${imgSrc}" class="mr-gem-icon" onclick="applyGemToPending('${g}')" title="${g}">`;
    });
    gemsHTML += `
        <div class="mr-gem-none" onclick="applyGemToPending(null)">
            <span style="color:black; font-weight:900; font-size:1.4rem;">NONE</span>
        </div>
    </div>`;
    
    container.innerHTML = `
        ${topIconsHTML}
        
        <div class="mr-red-box">
            <div class="mr-red-title">← look here bro</div>
            <div class="mr-red-content">${equippedHTML}</div>
        </div>

        ${listHTML}
        ${gemsHTML}

        <div class="mr-bottom-info">
            Selected Attunement:<br>
            <span style="color:#ddd;">${currentSelectionTab}</span><br>
            Selected: <span style="color:#ddd;">${mrSelectedTextDisplay}</span>
        </div>

        <!-- Equip Buttons moved under the list panel -->
        <div class="mr-equip-controls">
            <div class="mr-equip-btn" onclick="togglePrimary()" style="font-size: 2.2rem; color: white;">Equip Primary</div>
            <div class="mr-equip-btn" onclick="toggleSecondary()" style="font-size: 1.2rem; color:#ccc;">Equip Secondary</div>
            <div class="mr-equip-btn" onclick="toggleTertiary()" style="font-size: 0.85rem; color:#aaa;">Equip Tertiary (2+ of same attunement)</div>
        </div>
    `;
}

function switchMantraAttunement(att) {
    currentSelectionTab = att;
    selectedParchmentMantraId = null; 
    mrSelectedTextDisplay = 'X';
    renderMantraUI();
}

function handleParchmentClick(id) {
    selectedParchmentMantraId = id; 
    let item = db.mantras[currentSelectionTab].find(m => m.id === id);
    if (item) mrSelectedTextDisplay = item.name;
    renderMantraUI();
}

function setPendingGemMantra(id) {
    mantraPendingGem = id;
    let m = currentBuild.mantras.find(x => x.mantra.id === id);
    if (m) mrSelectedTextDisplay = m.mantra.name;
    renderMantraUI();
}

function applyGemToPending(gem) {
    if (!mantraPendingGem) return alert("Click a mantra inside the red 'Selected' box first to apply a gem!");
     mrSelectedTextDisplay = gem ? gem : 'NONE';
    setMantraGem(mantraPendingGem, gem);
}



function togglePrimary() {
    if (!selectedParchmentMantraId) return alert("Click a mantra from the right list first!");
    let item = db.mantras[currentSelectionTab].find(m => m.id === selectedParchmentMantraId);
    if (item.isBonus) return alert("Select a regular mantra for the Primary slot.");

    let regs = currentBuild.mantras.filter(m => !m.mantra.isBonus);
    let bonus = currentBuild.mantras.filter(m => m.mantra.isBonus);

    if (regs[0] && regs[0].mantra.id === item.id) {
        regs.shift(); 
    } else {
  
        regs = regs.filter(m => m.mantra.id !== item.id);

        regs.unshift({ mantra: {...item, _att: currentSelectionTab}, gem: null });
        if (regs.length > 2) regs = regs.slice(0, 2); 
    }

    currentBuild.mantras = [...regs, ...bonus];
    checkAutoBonus();
    renderMantraUI();
    renderSidebar();
}

function toggleSecondary() {
    if (!selectedParchmentMantraId) return alert("Click a mantra from the right list first!");
    let item = db.mantras[currentSelectionTab].find(m => m.id === selectedParchmentMantraId);
    if (item.isBonus) return alert("Select a regular mantra for the Secondary slot.");

    let regs = currentBuild.mantras.filter(m => !m.mantra.isBonus);
    let bonus = currentBuild.mantras.filter(m => m.mantra.isBonus);

    if (regs.length === 0) return alert("Equip a Primary mantra first!");
    if (regs[1] && regs[1].mantra.id === item.id) {
        regs.splice(1, 1);
    } else {

        regs = regs.filter(m => m.mantra.id !== item.id);
        if (regs.length === 0) return alert("Equip a Primary mantra first!");
        regs[1] = { mantra: {...item, _att: currentSelectionTab}, gem: null };
    }

    currentBuild.mantras = [...regs, ...bonus];
    checkAutoBonus();
    renderMantraUI();
    renderSidebar();
}

function toggleTertiary() {
    let regs = currentBuild.mantras.filter(m => !m.mantra.isBonus);
    if (regs.length < 2 || regs[0].mantra._att !== regs[1].mantra._att) {
        return alert("You need 2 mantras of the same attunement to use Tertiary mantras!");
    }
    
    let sharedAtt = regs[0].mantra._att;
    let bonusData = db.mantras[sharedAtt]?.find(m => m.isBonus);
    if (!bonusData) return alert("No bonus mantra exists yet for this attunement.");

    let hasBonus = currentBuild.mantras.some(m => m.mantra.isBonus);
    
    if (hasBonus) { 
        currentBuild.mantras = currentBuild.mantras.filter(m => !m.mantra.isBonus);
    } else { 
        currentBuild.mantras.push({ mantra: {...bonusData, _att: sharedAtt}, gem: null });
    }
    
    renderMantraUI();
    renderSidebar();
}

function checkAutoBonus() {
    let regs = currentBuild.mantras.filter(m => !m.mantra.isBonus);
    let hasBonus = currentBuild.mantras.some(m => m.mantra.isBonus);
    if (regs.length < 2 || regs[0].mantra._att !== regs[1].mantra._att) {
        currentBuild.mantras = currentBuild.mantras.filter(m => !m.mantra.isBonus);
        return;
    }
    if (regs.length === 2 && regs[0].mantra._att === regs[1].mantra._att) {
        let sharedAtt = regs[0].mantra._att;
        let bonusData = db.mantras[sharedAtt]?.find(m => m.isBonus);
        
        if (bonusData && !hasBonus) {
            currentBuild.mantras.push({ mantra: {...bonusData, _att: sharedAtt}, gem: null });
        }
    }
}

        function closeCtx() { document.getElementById('context-menu').style.display = 'none'; }
        
        function viewEquippedMantra(mantraId) {
    const equippedMantra = currentBuild.mantras.find(m => m.mantra.id === mantraId);
    if (!equippedMantra) return;
    
    const item = equippedMantra.mantra;
    const gemButtons = GEMS.map(g => {
        const isActive = equippedMantra.gem === g;
        const imgSrc = GEM_ICONS[g] || 'pics/question.png'; 
        return `
            <div class="gem-select-btn ${isActive ? 'active' : ''}" onclick="setMantraGem('${item.id}', '${g}')" title="${g}">
                <img src="${imgSrc}" alt="${g}">
            </div>
        `;
    }).join('');

    document.getElementById('detail-content').innerHTML = `
        <div class="detail-name" style="color:var(--primary)">Modifying: ${item.name}</div>
        <div style="font-size: 1.1rem; color: #aaa; margin-bottom: 20px;">Select a gem below to equip it to this mantra.</div>
        
        <div class="gem-selection-area">
            <div class="gem-grid">
                ${gemButtons}
                <!-- The "None/X" button -->
                <div class="gem-select-btn no-gem" onclick="setMantraGem('${item.id}', null)" title="Remove Gem">
                    <span style="color:red; font-weight:bold; font-size:2rem;">X</span>
                </div>
            </div>
        </div>
    `;
}

// BUILD ACTIONS (Share, Clear, Random)
    function pickRandom(arr) { return (!arr || arr.length === 0) ? null : arr[Math.floor(Math.random() * arr.length)]; }
    
    function shareBuild() {
    let text = [];

    text.push(`Kit: ${currentBuild.kit ? currentBuild.kit.name : "None"}`);
    text.push(`Oath: ${currentBuild.oath ? currentBuild.oath.name : "None"}`);
    
    let weaponStr = `Weapon: ${currentBuild.weapon ? currentBuild.weapon.name : "None"}`;
    if (currentBuild.weaponEnchant) weaponStr += ` (Enchant: ${currentBuild.weaponEnchant.name})`;
    text.push(weaponStr);

    let bellStr = `Bell: ${currentBuild.bell ? currentBuild.bell.name : "None"}`;
    if (currentBuild.bell && currentBuild.bellCorrupted) bellStr += ` [Corrupted]`;
    text.push(bellStr);

    if (currentBuild.mantras.length > 0) {
        text.push(`Mantras:`);
        currentBuild.mantras.forEach(m => {
            let mStr = `- ${m.mantra.name}`;
            if (m.mantra.isBonus) mStr += ` (Bonus)`;
            if (m.gem) mStr += ` [${m.gem} Gem]`;
            text.push(mStr);
        });
    } else {
        text.push(`Mantras: None`);
    }

    const shareText = text.join('\n');

    navigator.clipboard.writeText(shareText).then(() => {
        alert("Build copied to clipboard!");
    }).catch(() => {
        prompt("Copy your build:", shareText);
    });
}
   function randomizeBuild() {
    currentBuild.kit = pickRandom(db.kits);
    currentBuild.oath = pickRandom(db.oaths);
    currentBuild.bell = pickRandom(db.bells);
    currentBuild.bellCorrupted = Math.random() > 0.5;
    
    const validWeaponCats = ['heavy', 'medium', 'light'].filter(cat => db.weapons[cat] && db.weapons[cat].length > 0);
    const allAtts = CATEGORIES.ATTUNEMENTS;
    let chosenRegulars = [];
    currentBuild.mantras = []; 

    if (validWeaponCats.length > 0) {
        const randomWeaponCat = pickRandom(validWeaponCats);
        currentBuild.weapon = pickRandom(db.weapons[randomWeaponCat]);
    } else {
        currentBuild.weapon = null; 
    }

    // Pick Enchant separately
    if (currentBuild.weapon && currentBuild.weapon.isNonEnchantable) {
        currentBuild.weaponEnchant = null;
    } else {
        currentBuild.weaponEnchant = pickRandom(db.weapons.enchants);
    }
    
    // Step 1: Pick 2 Random Regular Mantras
    for(let i = 0; i < 2; i++) {
        const att = pickRandom(allAtts);
        if(db.mantras[att] && db.mantras[att].length > 0) {
            // Filter out bonus mantras for the base selection
            const availableRegulars = db.mantras[att].filter(m => !m.isBonus);
            const m = pickRandom(availableRegulars);
            
            if (m && !chosenRegulars.find(x => x.id === m.id)) {
                chosenRegulars.push({ ...m, _att: att });
                currentBuild.mantras.push({
                    mantra: { ...m, _att: att },
                    gem: Math.random() > 0.6 ? pickRandom(GEMS) : null
                });
            }
        }
    }

    // Step 2: Roll for Bonus Mantra 
    if (chosenRegulars.length === 2 && chosenRegulars[0]._att === chosenRegulars[1]._att) {
        const sharedAtt = chosenRegulars[0]._att;
        const availableBonus = db.mantras[sharedAtt].filter(m => m.isBonus);
        if (availableBonus.length > 0 && Math.random() > 0.5) { 
            const b = pickRandom(availableBonus);
            currentBuild.mantras.push({
                mantra: { ...b, _att: sharedAtt },
                gem: Math.random() > 0.6 ? pickRandom(GEMS) : null
            });
        }
    }
    
    renderSidebar();
    renderSelectionGrid();
}
    function clearBuild() {
    if(confirm("Are you sure you want to clear your current build?")) {
        // Reset everything
        currentBuild = { 
            kit: null, 
            oath: null, 
            weapon: null, 
            weaponEnchant: null, 
            bell: null, 
            bellCorrupted: false, 
            mantras: [], 
            notes: "", 
            bonusMantraGem: null,
            disabledBuffs: {}
        };

        const starterKit = db.kits.find(k => k.name.toLowerCase() === 'starter');
        if (starterKit) {
            currentBuild.kit = starterKit;
        } else if (db.kits && db.kits.length > 0) {
            currentBuild.kit = db.kits[0];
        }

        renderSidebar();
    }
}
// IMPORT / EXPORT JSON
function exportDatabase() {
    const dataStr = JSON.stringify(db, null, 2);

    const blob = new Blob([dataStr], {
        type: "application/json"
    });

    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = 'deepfaken-database.json';
    a.click();

    URL.revokeObjectURL(url);
}
function importDatabase() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';

    input.onchange = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();

        reader.onload = (event) => {
            try {
                const imported = JSON.parse(event.target.result);

                db = imported;

                saveDB();
                renderDbList();
                renderSidebar();

                alert('Database imported successfully!');
            } catch (err) {
                alert('Invalid JSON file.');
                console.error(err);
            }
        };

        reader.readAsText(file);
    };

    input.click();
}
// GLOBAL EVENT LISTENERS
document.getElementById('modal-search').addEventListener('input', renderSelectionGrid);
window.addEventListener('click', closeCtx);
document.querySelectorAll('.tabs').forEach(tabContainer => {
    tabContainer.addEventListener('wheel', (e) => {
        if (e.deltaY !== 0) {
            e.preventDefault();
            tabContainer.scrollLeft += e.deltaY;
        }
    });
});