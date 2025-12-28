/* =========================================
   1. APPLICATION STATE (Data loaded from database.js)
   ========================================= */

let state = { 
    currentBender: benderLibrary[0], 
    activeCalc: null, 
    filter: 'all',
    format: 'feet',
    fillConfig: { type: 'EMT', size: '3/4' },
    wireList: [{qty:3, type:'THHN', size:'12'}],
    history: [],
    favorites: [],
    maxHistory: 5,
    showMath: false,
    quizMode: false,
    deviceType: detectDevice(),
    osType: detectOS()
};

/* OS & DEVICE DETECTION */
function detectOS() {
    const ua = navigator.userAgent.toLowerCase();
    if (ua.includes('windows')) return 'windows';
    if (ua.includes('iphone') || ua.includes('ipad') || ua.includes('macintosh')) return 'ios';
    if (ua.includes('android')) return 'android';
    return 'other';
}

function detectDevice() {
    const ua = navigator.userAgent.toLowerCase();
    if (/mobile|android|iphone|ipod|phone/i.test(ua)) return 'mobile';
    if (/tablet|ipad/i.test(ua)) return 'tablet';
    return 'desktop';
}

function getOSName() {
    const os = state.osType;
    if (os === 'windows') return 'Windows';
    if (os === 'ios') return 'iOS/macOS';
    if (os === 'android') return 'Android';
    return 'Unknown';
}

/* =========================================
   2. INITIALIZATION
   ========================================= */
document.addEventListener('DOMContentLoaded', () => {
    // Load custom benders
    const savedCustomBenders = localStorage.getItem('qc_custom_benders');
    if (savedCustomBenders) {
        const customs = JSON.parse(savedCustomBenders);
        customs.forEach(c => {
            if (!benderLibrary.find(b => b.id === c.id)) benderLibrary.push(c);
        });
    }

    // Load saved settings
    const saved = localStorage.getItem('qc_bender_id');
    if (saved) {
        const found = benderLibrary.find(b => b.id === saved);
        if (found) state.currentBender = found;
    }
    const savedFmt = localStorage.getItem('qc_format');
    if (savedFmt) state.format = savedFmt;
    
    // Load history and favorites
    const savedHistory = localStorage.getItem('qc_history');
    if (savedHistory) state.history = JSON.parse(savedHistory);
    const savedFavorites = localStorage.getItem('qc_favorites');
    if (savedFavorites) state.favorites = JSON.parse(savedFavorites);

    const savedMath = localStorage.getItem('qc_show_math');
    if (savedMath) state.showMath = JSON.parse(savedMath);

    const savedQuiz = localStorage.getItem('qc_quiz_mode');
    if (savedQuiz) state.quizMode = JSON.parse(savedQuiz);

    updateHeaderDisplay();
    registerServiceWorker();
    setupInstallPrompt();

    // LOAD HOME DASHBOARD
    if (typeof loadHome === 'function') {
        loadHome();
    }
});

/* =========================================
   3. NAVIGATION
   ========================================= */
function toggleSidebar() {
    document.getElementById('sidebar').classList.toggle('open');
    document.getElementById('overlay').classList.toggle('visible');
}

function loadCalc(type) {
    // Handle Home Dashboard
    if (type === 'home') {
        document.getElementById('calc-title').innerText = "Dashboard";
        document.getElementById('calc-inputs').innerHTML = homeHTML;
        document.getElementById('result-box').classList.add('hidden');
        document.getElementById('calc-btn').classList.add('hidden');
        document.getElementById('sidebar').classList.remove('open');
        document.getElementById('overlay').classList.remove('visible');
        return;
    }

    state.activeCalc = type;
    const titles = {
        'stub': 'Stub Up', 'back2back': 'Back-to-Back 90s', 'backbend': 'Back Bend', 'kick': 'Kick', 
        'stub_kick': 'Stub-Up with Kick', 'rolling_stub': 'Rolling Stub', 'offset': 'Standard Offset',
        'shallow_off': 'Shallow Offset', 'deep_off': 'Deep Offset', 'rolling': 'Rolling Offset',
        'compound_off': 'Compound Offset', 'parallel': 'Parallel Offset', 'zbend': 'Z-Bend',
        'off_kick': 'Offset with Kick', 'saddle3': '3-Point Saddle', 'saddle4': '4-Point Saddle',
        'sad_off': 'Saddle into Offset', 'off_sad': 'Offset into Saddle', 'off_90': 'Offset into 90',
        '90_off': '90 with Offset', 'roll_90': 'Rolling 90', 'comp_bend': 'Compound Bend', 'dogleg': 'Dogleg Fixer',
        'fill': 'Conduit Fill Calculator'
    };
    
    document.getElementById('calc-title').innerText = titles[type] || 'Calculator';
    document.getElementById('calc-btn').classList.remove('hidden');
    renderInputs(type);
    document.getElementById('result-box').classList.add('hidden');
    document.getElementById('sidebar').classList.remove('open');
    document.getElementById('overlay').classList.remove('visible');
}

/* =========================================
   4. INPUT BUILDER (WITH "HOW TO" BUTTON)
   ========================================= */
function renderInputs(type) {
    const div = document.getElementById('calc-inputs');
    
    // 1. INJECT "HOW TO" BUTTON
    let h = '';
    if(type !== 'fill') {
        h += `<div style="display:flex; justify-content:flex-end; gap:10px; margin-bottom:10px;">`;
        
        if (state.quizMode) {
            h += `<button onclick="generateRandomQuiz()" style="background:rgba(156, 39, 176, 0.1); border:1px solid #AB47BC; color:#AB47BC; padding:5px 10px; border-radius:15px; font-size:0.75rem; font-weight:bold; cursor:pointer; display:flex; align-items:center; gap:5px;">
                <ion-icon name="dice-outline"></ion-icon> RANDOM QUIZ
            </button>`;
        }

        h += `<button onclick="openGuide('${type}')" style="background:none; border:1px solid var(--primary); color:var(--primary); padding:5px 10px; border-radius:15px; font-size:0.75rem; font-weight:bold; cursor:pointer; display:flex; align-items:center; gap:5px;">
                <ion-icon name="school"></ion-icon> HOW TO BEND
            </button>
        </div>`;
    }
    
    // 2. DEFINE COMMON INPUTS
    const ang = `
        <label>Bend Angle</label>
        <select id="i_ang">
            <option value="5">5° (Tiny Kick)</option>
            <option value="10">10° (Precision)</option>
            <option value="15">15° (Small Kick)</option>
            <option value="22.5">22.5° (Saddle)</option>
            <option value="30" selected>30° (Standard)</option>
            <option value="45">45° (Box Offset)</option>
            <option value="60">60° (Tight)</option>
        </select>`;

    const ph = "e.g. 12 3/4 or 1' 4\"";

    // 3. RENDER INPUTS BASED ON BEND TYPE
    if(type==='stub') h += `<label>Stub Height</label><input type="text" id="i1" placeholder="${ph}" inputmode="text">`;
    else if(type==='back2back') h += `<label>Length (Outside-to-Outside)</label><input type="text" id="i1" placeholder="${ph}">`;
    else if(type==='backbend') h += `<label>Back Length</label><input type="text" id="i1" placeholder="${ph}">`;
    
    else if(type==='kick'||type==='stub_kick') h += `<label>Stub Height</label><input type="text" id="i1" placeholder="${ph}"><label>Kick Height</label><input type="text" id="i2" placeholder="${ph}">${ang}`;
    
    else if(type==='rolling_stub') h += `<label>Rise Height</label><input type="text" id="i1" placeholder="${ph}"><label>Roll Distance</label><input type="text" id="i2" placeholder="${ph}">`;
    
    else if(['offset','shallow_off','deep_off','zbend'].includes(type)) h += `<label>Rise (Obstacle Height)</label><input type="text" id="i1" placeholder="${ph}"><label>Distance to Obstacle</label><input type="text" id="i2" placeholder="${ph}">${ang}`;
    
    else if(['rolling','compound_off'].includes(type)) h += `<label>Rise (Up)</label><input type="text" id="i1" placeholder="${ph}"><label>Roll (Over)</label><input type="text" id="i2" placeholder="${ph}">${ang}`;
    
    else if(type==='parallel') h += `<label>Offset 1 Rise</label><input type="text" id="i1" placeholder="${ph}"><label>Center-to-Center Spacing</label><input type="text" id="i2" placeholder="${ph}">${ang}`;
    
    else if(type==='off_kick') h += `<label>Offset Rise</label><input type="text" id="i1" placeholder="${ph}"><label>Kick Rise</label><input type="text" id="i2" placeholder="${ph}">${ang}`;
    
    else if(type==='saddle3') h += `<label>Obstacle Height</label><input type="text" id="i1" placeholder="${ph}"><label>Distance to Center</label><input type="text" id="i2" placeholder="${ph}">`;
    
    else if(type==='saddle4') h += `<label>Obstacle Height</label><input type="text" id="i1" placeholder="${ph}"><label>Obstacle Width</label><input type="text" id="i2" placeholder="${ph}"><label>Distance to Start</label><input type="text" id="i3" placeholder="${ph}">${ang}`;
    
    else if(type==='sad_off' || type==='off_sad') h += `<label>Offset Rise</label><input type="text" id="i1" placeholder="${ph}"><label>Saddle Height</label><input type="text" id="i2" placeholder="${ph}">${ang}`;
    
    else if(type==='off_90' || type==='90_off') h += `<label>Stub Height</label><input type="text" id="i1" placeholder="${ph}"><label>Offset Rise</label><input type="text" id="i2" placeholder="${ph}">${ang}`;
    
    else if(type==='roll_90' || type==='comp_bend') h += `<label>Rise</label><input type="text" id="i1" placeholder="${ph}"><label>Roll</label><input type="text" id="i2" placeholder="${ph}"><label>Length to Turn</label><input type="text" id="i3" placeholder="${ph}">`;
    
    else if(type==='dogleg') h += `<div style="padding:20px;text-align:center;color:#888">Place pipe on flat floor. Rotate until flat. Mark top center.</div>`;
    
    else if(type==='fill') {
        h += `
        <div class="fill-container">
            <div class="fill-header">Conduit Type</div>
            <div class="fill-row">
                <select id="c_type" class="flex-1" onchange="updateFillState('type', this.value)">${Object.keys(necData.conduit).map(t => `<option value="${t}" ${state.fillConfig.type===t?'selected':''}>${t}</option>`).join('')}</select>
                <select id="c_size" class="flex-1" onchange="updateFillState('size', this.value)"></select>
            </div>
            <div class="fill-header" style="margin-top:20px;">Wires (Qty | Size | Type)</div>
            <div id="wire-list-container"></div>
            <button class="btn-add" onclick="addWireRow()"><ion-icon name="add-circle-outline"></ion-icon> Add Wire Group</button>
        </div>`;
    }

    div.innerHTML = h;
    if(type === 'fill') { updateConduitOptions(); renderWireRows(); }
}

/* =========================================
   5. SMART INPUT PARSER
   ========================================= */
function parseSmartInput(val) {
    if (!val || val.toString().trim() === '') return 0;
    val = val.toString().toLowerCase().trim();
    
    // Handle metric
    if (val.includes('cm')) {
        const num = parseFloat(val);
        return isNaN(num) ? 0 : num / 2.54; // Convert cm to inches
    }
    if (val.includes('mm')) {
        const num = parseFloat(val);
        return isNaN(num) ? 0 : num / 25.4; // Convert mm to inches
    }
    
    // Handle feet and inches (e.g., "1' 4 3/4")
    if (val.includes("'")) {
        const parts = val.split("'");
        const feet = parseFloat(parts[0]) || 0;
        let inchStr = parts[1] || "0";
        inchStr = inchStr.replace('"', '').trim();
        return (feet * 12) + parseFractionString(inchStr);
    }
    
    return parseFractionString(val);
}

function parseFractionString(str) {
    str = str.replace('"', '').replace('-', ' ').trim();
    const parts = str.split(' ');
    if (parts.length === 2) {
        const whole = parseFloat(parts[0]);
        const frac = evalFraction(parts[1]);
        return whole + frac;
    } else if (parts.length === 1) {
        if (parts[0].includes('/')) return evalFraction(parts[0]);
        return parseFloat(parts[0]) || 0;
    }
    return 0;
}

function evalFraction(frac) {
    if (!frac.includes('/')) return 0;
    const p = frac.split('/');
    return parseFloat(p[0]) / parseFloat(p[1]);
}

/* =========================================
   6. MATH ENGINE
   ========================================= */
function runCalculation() {
    if(state.activeCalc === 'fill') return calculateFill();
    const t = state.activeCalc;
    
    // Show tips
    showBendTip(t);
    
    // Validate and warn
    const warnings = validateInputs();
    if (warnings.length > 0) {
        warnings.forEach(w => console.warn(w));
    }
    
    // Validate inputs
    const i1 = parseSmartInput(document.getElementById('i1')?.value);
    const i2 = parseSmartInput(document.getElementById('i2')?.value);
    const i3 = parseSmartInput(document.getElementById('i3')?.value);
    
    if (i1 === 0 && i2 === 0 && i3 === 0) {
        alert('Please enter at least one measurement');
        return;
    }
    
    const ang = parseFloat(document.getElementById('i_ang')?.value||30);
    const b = state.currentBender;
    const dat = bendTable[ang] || bendTable[30];

    let marks = [], shrink=0, cut=0, txt='';

    // --- LOGIC ---
    if(t === 'stub') {
        const m = i1 - b.ded;
        marks = [{l:'HOOK',p:m}];
        txt = row('Mark 1', m);
        cut = i1 + b.gain;
    } 
    else if(t === 'back2back') {
        marks = [{l:'STAR',p:i1}];
        txt = row('Star Mark', i1);
    }
    else if(t === 'backbend') {
        const m = i1 - b.ded + b.gain; 
        marks = [{l:'NOTCH',p:m}];
        txt = row('Notch Mark', m);
    }
    else if(['offset','shallow_off','deep_off','zbend'].includes(t)) {
        shrink = i1 * dat.s;
        const travel = i1 * dat.m;
        const m1 = i2 + shrink; 
        const m2 = m1 - travel;
        marks = [{l:'START',p:m2},{l:'END',p:m1}];
        txt = row('Shrink', shrink) + row('Travel', travel) + row('Mark 1 (Far)', m1) + row('Mark 2 (Near)', m2);
        cut = m1 + 12;
    }
    else if(t === 'rolling') {
        const trueOff = Math.sqrt(i1*i1 + i2*i2);
        const riseAngle = Math.atan(i1/i2) * (180/Math.PI);
        const angleShrink = trueOff * Math.sin((ang/2) * (Math.PI/180));
        const travelDist = trueOff * Math.cos((ang/2) * (Math.PI/180));
        shrink = angleShrink * 2;
        marks = [{l:'RISE',p:i2},{l:'ROLL',p:i2+travelDist}];
        txt = row('True Rise', i1) + row('True Roll', i2) + row('True Offset', trueOff) + row('Rise Angle', riseAngle) + row('Total Shrink', shrink);
        cut = i2 + travelDist + 12;
    }
    else if(t === 'compound_off') {
        const trueOff = Math.sqrt(i1*i1 + i2*i2);
        shrink = trueOff * dat.s;
        const travel = trueOff * dat.m;
        marks = [{l:'START',p:5},{l:'END',p:5+travel}];
        txt = row('Rise (Up)', i1) + row('Roll (Over)', i2) + row('True Offset', trueOff) + row('Travel', travel) + row('Shrink', shrink);
        cut = travel + 12;
    }
    else if(t === 'parallel') {
        const adj = i2 * Math.tan((ang/2) * (Math.PI/180));
        txt = row('Start Adjust', adj) + `<div class="sub-note">Add to start mark of outer pipe</div>`;
    }
    else if(t === 'saddle3') {
        const saddleShrink = i1 * (3/16);
        shrink = saddleShrink * 2;
        const center = i2 + saddleShrink;
        const dist = i1 * 2.5;
        marks = [{l:'SIDE',p:center-dist},{l:'CENTER',p:center},{l:'SIDE',p:center+dist}];
        txt = row('Obstacle Height', i1) + row('Shrink (per side)', saddleShrink) + row('Total Shrink', shrink) + row('Center Mark', center) + row('Distance (left/right)', dist);
        cut = center + dist + 12;
    }
    else if(t === 'saddle4') {
        shrink = i1 * dat.s;
        const travel = i1 * dat.m;
        const sR = (i3 + shrink) - travel;
        const sF = i3 + shrink;
        const eF = sF + i2;
        const eD = eF + travel;
        marks = [{l:'M1',p:sR},{l:'M2',p:sF},{l:'M3',p:eF},{l:'M4',p:eD}];
        txt = row('Distance to Start', i3) + row('Obstacle Width', i2) + row('Obstacle Height', i1) + row('Shrink', shrink) + row('Travel', travel) + row('M1 (Start Rear)', sR) + row('M2 (Start Front)', sF) + row('M3 (End Front)', eF) + row('M4 (End Rear)', eD);
        cut = eD + 12;
    }
    else if(t === 'kick' || t === 'stub_kick' || t === 'off_kick') {
        const stubM = i1 - b.ded;
        const kickTravel = i2 * dat.m;
        const kickShrink = i2 * dat.s;
        const kickM = stubM - 6 - kickTravel;
        marks = [{l:'90',p:stubM},{l:'KICK',p:kickM}];
        txt = row('Stub Height', i1) + row('Kick Height', i2) + row('90 Mark', stubM) + row('Kick Travel', kickTravel) + row('Kick Shrink', kickShrink) + row('Kick Mark', kickM);
    }
    else if(t === 'off_90' || t === '90_off') {
        shrink = i2 * dat.s;
        const offsetTravel = i2 * dat.m;
        const stubDist = i1 - b.ded;
        const m1 = 12;
        const m2 = m1 + offsetTravel;
        const m3 = m2 + stubDist;
        marks = [{l:'OFF 1',p:m1},{l:'OFF 2',p:m2},{l:'90',p:m3}];
        txt = row('Stub Height', i1) + row('Offset Rise', i2) + row('Offset Shrink', shrink) + row('Offset Travel', offsetTravel) + row('Mark 1 (Offset Start)', m1) + row('Mark 2 (Offset End)', m2) + row('Mark 3 (90° Bend)', m3);
    }
    else if(t === 'rolling_stub') {
        const trueHyp = Math.sqrt(i1*i1 + i2*i2);
        const rollAngle = Math.atan(i2/i1) * (180/Math.PI);
        const m1 = i2 - b.ded;
        marks = [{l:'90',p:m1}];
        txt = row('Rise Height', i1) + row('Roll Distance', i2) + row('True Hypotenuse', trueHyp) + row('Roll Angle', rollAngle) + row('90° Mark', m1);
        cut = m1 + 10;
    }
    else if(t === 'sad_off') {
        // Saddle into Offset: First saddle, then offset from end
        const saddleShrink = i1 * (3/16);
        const totalSaddleShrink = saddleShrink * 2;
        const saddleCenter = i2 + saddleShrink;
        const saddleDist = i1 * 2.5;
        // Now calculate offset from the saddle's end
        const offsetShrink = i2 * dat.s;
        const offsetTravel = i2 * dat.m;
        const offsetEndMark = saddleCenter + saddleDist + offsetShrink;
        const offsetStartMark = offsetEndMark - offsetTravel;
        marks = [{l:'SADDLE',p:saddleCenter},{l:'OFF-1',p:offsetStartMark},{l:'OFF-2',p:offsetEndMark}];
        txt = row('Obstacle Height', i1) + row('Distance to Saddle', i2) + row('Saddle Shrink', totalSaddleShrink) + row('Offset Shrink', offsetShrink) + row('Saddle Center', saddleCenter) + row('Offset Start', offsetStartMark) + row('Offset End', offsetEndMark);
        cut = offsetEndMark + 12;
    }
    else if(t === 'off_sad') {
        // Offset into Saddle: First offset, then saddle from end
        const offsetShrink = i1 * dat.s;
        const offsetTravel = i1 * dat.m;
        const offsetEndMark = (i2 + offsetShrink);
        const offsetStartMark = offsetEndMark - offsetTravel;
        // Now calculate saddle center based on new position
        const saddleShrink = i2 * (3/16);
        const totalSaddleShrink = saddleShrink * 2;
        const saddleCenter = offsetEndMark + saddleShrink;
        marks = [{l:'OFF-1',p:offsetStartMark},{l:'OFF-2',p:offsetEndMark},{l:'SADDLE',p:saddleCenter}];
        txt = row('Offset Rise', i1) + row('Obstacle Height', i2) + row('Offset Shrink', offsetShrink) + row('Offset Travel', offsetTravel) + row('Offset Start', offsetStartMark) + row('Offset End', offsetEndMark) + row('Saddle Center', saddleCenter);
        cut = saddleCenter + 12;
    }
    else if(t === 'roll_90') {
        const trueOff = Math.sqrt(i1*i1 + i2*i2);
        const rollAngle = Math.atan(i1/i2) * (180/Math.PI);
        const m1 = i2 - b.ded;
        const m2 = i2 + i3;
        marks = [{l:'MARK',p:i2},{l:'90',p:m1}];
        txt = row('Rise (Up)', i1) + row('Roll (Over)', i2) + row('Length to Turn', i3) + row('True Offset', trueOff) + row('Roll Angle', rollAngle) + row('Mark Position', i2) + row('90° Mark', m1);
        cut = m1 + 12;
    }
    else if(t === 'comp_bend') {
        const bend1 = i1 - b.ded;
        const bend2offset = i2 * dat.m;
        const bend2pos = bend1 + bend2offset;
        const bend3 = i3 - b.ded;
        marks = [{l:'B1',p:bend1},{l:'B2',p:bend2pos},{l:'B3',p:bend2pos+bend3}];
        txt = row('Bend 1 (Rise)', i1) + row('Bend 2 (Roll)', i2) + row('Bend 3 (Length)', i3) + row('Bend 1 Mark', bend1) + row('Bend 2 Mark', bend2pos) + row('Bend 3 Mark', bend2pos+bend3);
        cut = bend2pos + bend3 + 12;
    }

    // Generate Math if enabled
    if(state.showMath && t !== 'fill') {
        txt += generateMathBlock(t, i1, i2, i3, ang, b, dat, shrink, cut, marks);
    }

    // Handle Quiz Mode
    if (state.quizMode) {
        txt = `<button class="quiz-reveal-btn" onclick="revealQuiz()">👀 REVEAL ANSWER</button>` + txt;
    }

    displayResults(marks, shrink, cut, txt);
}

/* =========================================
   7. OUTPUT HELPERS
   ========================================= */
function displayResults(marks, shrink, cut, textHtml) {
    document.getElementById('result-box').classList.remove('hidden');
    
    // Handle Fill Calculator specific visibility (Hide tape & footer stats)
    const isFill = state.activeCalc === 'fill';
    const tapeElements = document.querySelectorAll('.tape-header, .tape-scroll-area, .result-footer');
    tapeElements.forEach(el => el.style.display = isFill ? 'none' : '');

    // Apply Quiz Mode Blur
    const resBox = document.getElementById('result-box');
    if (state.quizMode) resBox.classList.add('quiz-blur');
    else resBox.classList.remove('quiz-blur');

    document.getElementById('text-results').innerHTML = textHtml;
    
    if (!isFill) {
        document.getElementById('stat-shrink').innerHTML = toFraction(shrink);
        document.getElementById('stat-length').innerHTML = cut > 0 ? toFraction(cut) : "--";
        renderTape(marks);
    }
    
    // Save to history
    saveToHistory(state.activeCalc, { i1: cut, i2: shrink });
}

window.revealQuiz = () => {
    document.getElementById('result-box').classList.remove('quiz-blur');
    document.querySelector('.quiz-reveal-btn').style.display = 'none';
}

function renderTape(marks) {
    const cvs = document.getElementById('tape-canvas');
    cvs.innerHTML = '';
    if(!marks.length) return;
    marks.sort((a,b)=>a.p-b.p);
    const max = marks[marks.length-1].p;
    cvs.style.width = `${(max * 20) + 150}px`;
    marks.forEach(m => {
        const l = m.p * 20;
        cvs.innerHTML += `
            <div class="tape-mark" style="left:${l+20}px"></div>
            <div class="tape-label" style="left:${l+20}px">${toFraction(m.p)}</div>
            <div class="tape-tag" style="left:${l+20}px">${m.l}</div>
        `;
    });
}

function row(l, v, s) { 
    return `
        <div class="result-row">
            <div>
                <span style="display:block;color:var(--primary);font-size:0.75rem;font-weight:bold">${l}</span>
                ${s?`<span style="font-size:0.7rem;color:#666">${s}</span>`:''}
            </div>
            <span>${toFraction(v)}</span>
        </div>`; 
}

function clearInputs() { 
    document.querySelectorAll('input').forEach(i=>i.value=''); 
    document.getElementById('result-box').classList.add('hidden'); 
}

/* =========================================
   8. SETTINGS & FORMATTING
   ========================================= */
function openSettings() {
    document.getElementById('modal-settings').classList.remove('hidden');
    updateSettingsUI();
}
function closeSettings() {
    document.getElementById('modal-settings').classList.add('hidden');
    localStorage.setItem('qc_format', state.format);
    if(!document.getElementById('result-box').classList.contains('hidden')) {
        if(state.activeCalc === 'fill') calculateFill();
        else runCalculation();
    }
}
function setFormat(fmt) {
    state.format = fmt;
    localStorage.setItem('qc_format', fmt);
    updateSettingsUI();
}
function updateSettingsUI() {
    document.querySelectorAll('.radio-circle').forEach(e => e.classList.remove('active'));
    if(state.format === 'feet') document.getElementById('rad-feet').classList.add('active');
    if(state.format === 'inch') document.getElementById('rad-inch').classList.add('active');
    if(state.format === 'metric') document.getElementById('rad-metric').classList.add('active');
    
    // Update toggle
    const mathTog = document.getElementById('set-show-math');
    if(mathTog) mathTog.checked = state.showMath;

    const quizTog = document.getElementById('set-quiz-mode');
    if(quizTog) quizTog.checked = state.quizMode;
}
function toFraction(val) {
    if (typeof val !== 'number') return val;
    if (state.format === 'metric') return `${(val * 2.54).toFixed(1)} cm`;

    let rounded = Math.round(val * 16) / 16;
    let feet = Math.floor(rounded / 12);
    let inches = rounded % 12;
    let wholeInch = Math.floor(inches);
    let frac = inches - wholeInch;
    let n = Math.round(frac * 16);
    let fracStr = "";
    if (n > 0) {
        let d = 16;
        while (n%2===0 && d%2===0) { n/=2; d/=2; }
        fracStr = `<sup>${n}</sup>&frasl;<sub>${d}</sub>`;
    }
    let inchStr = "";
    if (wholeInch === 0 && fracStr === "") inchStr = '0"';
    else if (wholeInch === 0) inchStr = `${fracStr}"`;
    else inchStr = `${wholeInch} ${fracStr}"`;

    if (state.format === 'inch') {
        let tIn = Math.floor(val);
        let tFr = val - tIn;
        let tn = Math.round(tFr * 16);
        let tStr = "";
        if(tn > 0) {
            let d = 16;
            while(tn%2===0 && d%2===0){tn/=2;d/=2}
            tStr = `<sup>${tn}</sup>&frasl;<sub>${d}</sub>`;
        }
        if(tIn===0 && tStr!=="") return `${tStr}"`;
        return `${tIn} ${tStr}"`;
    }
    return feet > 0 ? `${feet}' ${inchStr}` : inchStr;
}

window.toggleShowMath = (val) => {
    state.showMath = val;
    localStorage.setItem('qc_show_math', JSON.stringify(val));
}

window.toggleQuizMode = (val) => {
    state.quizMode = val;
    localStorage.setItem('qc_quiz_mode', JSON.stringify(val));
    if(state.activeCalc && state.activeCalc !== 'home' && state.activeCalc !== 'fill') {
        renderInputs(state.activeCalc);
    }
}

window.generateRandomQuiz = () => {
    const type = state.activeCalc;
    
    // Generate random number with tape measure precision (1/16ths)
    const rVal = (min, max) => {
        let val = Math.floor(Math.random() * (max - min + 1)) + min;
        let sixteenths = Math.floor(Math.random() * 16); // 0 to 15
        return val + (sixteenths / 16);
    };

    // Format decimal to fraction string for input value
    const fmt = (val) => {
        if (state.format === 'metric') return `${(val * 2.54).toFixed(1)} cm`;
        
        // Round to nearest 1/16
        val = Math.round(val * 16) / 16;

        if (state.format === 'inch') {
            let w = Math.floor(val);
            let f = val - w;
            if (f === 0) return `${w}"`;
            let n = Math.round(f * 16), d = 16;
            while (n%2===0 && d%2===0) { n/=2; d/=2; }
            return w === 0 ? `${n}/${d}"` : `${w} ${n}/${d}"`;
        }
        
        // Feet & Inches
        let ft = Math.floor(val / 12);
        let inch = val % 12;
        let w = Math.floor(inch);
        let f = inch - w;
        
        let iStr = "";
        if (f === 0) iStr = `${w}"`;
        else {
            let n = Math.round(f * 16), d = 16;
            while (n%2===0 && d%2===0) { n/=2; d/=2; }
            iStr = w === 0 ? `${n}/${d}"` : `${w} ${n}/${d}"`;
        }
        
        return ft > 0 ? `${ft}' ${iStr}` : iStr;
    };

    // Clear previous results
    document.getElementById('result-box').classList.add('hidden');
    
    const set = (id, val) => {
        const el = document.getElementById(id);
        if(el) el.value = fmt(val);
    };

    if(type === 'stub') set('i1', rVal(12, 48));
    
    else if(['offset','shallow_off','deep_off','zbend'].includes(type)) {
        const rise = rVal(2, 10);
        set('i1', rise); 
        // Ensure Distance is long enough to accommodate the Travel (Rise * Multiplier)
        // Using a safe factor (Rise * 4) + padding to prevent negative "Mark 1"
        set('i2', rVal(Math.ceil(rise * 4) + 6, Math.ceil(rise * 4) + 24)); 
    }
    
    else if(type === 'saddle3') {
        set('i1', rVal(2, 6)); // Obstacle
        set('i2', rVal(24, 60)); // Center Dist
    }
    
    else if(type === 'saddle4') {
        const h = rVal(2, 6);
        set('i1', h); // Height
        set('i2', rVal(4, 12)); // Width
        // Ensure start distance covers travel (max mult ~6 for 10 deg)
        set('i3', rVal(Math.ceil(h * 6) + 12, Math.ceil(h * 6) + 36)); // Start Dist
    }
    
    else if(['kick', 'stub_kick', 'off_kick'].includes(type)) {
        const kick = rVal(2, 8);
        set('i2', kick); // Kick Height
        // Stub Height must be > Deduct + 6" Spacing + Kick Travel
        // To be safe: Kick * 6 (max mult) + 20" padding
        const minStub = Math.ceil(kick * 6) + 20;
        set('i1', rVal(minStub, minStub + 24)); 
    }
    
    else if(type === 'back2back') {
        set('i1', rVal(24, 60));
    }
    
    else if(type === 'rolling_stub') {
        set('i1', rVal(12, 36)); // Rise
        set('i2', rVal(15, 24)); // Roll (must be > deduct)
    }
    
    else if(type === 'comp_bend') {
        set('i1', rVal(15, 30)); // Bend 1 (> deduct)
        set('i2', rVal(12, 36)); // Bend 2
        set('i3', rVal(15, 30)); // Bend 3 (> deduct)
    }
    
    else if(type === 'parallel') {
        set('i1', rVal(4, 12)); // Offset Rise
        set('i2', rVal(2, 8)); // Spacing
    }

    else if(['rolling', 'compound_off'].includes(type)) {
        set('i1', rVal(5, 20)); // Rise
        set('i2', rVal(5, 20)); // Roll
    }
    
    else {
        if(document.getElementById('i1')) set('i1', rVal(10, 30));
        if(document.getElementById('i2')) set('i2', rVal(10, 30));
        if(document.getElementById('i3')) set('i3', rVal(10, 30));
    }
    
    // Randomize angle
    const angSel = document.getElementById('i_ang');
    if(angSel) {
        const opts = [10, 22.5, 30, 45];
        angSel.value = opts[Math.floor(Math.random() * opts.length)];
    }
    
    showNotification('🎲 Quiz values generated!');
}

/* =========================================
   9. BENDER UI LOGIC
   ========================================= */
function openBenderLibrary() { 
    document.getElementById('modal-benders').classList.remove('hidden');
    document.querySelector('.bender-filter-bar').innerHTML = `
        <button class="filter-btn active" onclick="filterBenders('all')">ALL</button>
        <button class="filter-btn" onclick="filterBenders('favorites')">FAVORITES</button>
        <button class="filter-btn" onclick="filterBenders('hand')">HAND</button>
        <button class="filter-btn" onclick="filterBenders('electric')">ELECTRIC</button>
        <button class="filter-btn" onclick="filterBenders('custom')">CUSTOM</button>
    `;
    filterBenders('all');
}
function closeBenderLibrary() { 
    document.getElementById('modal-benders').classList.add('hidden'); 
}
function filterBenders(cat) {
    state.filter = cat;
    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    const btns = document.querySelectorAll('.filter-btn');
    if(cat==='all') btns[0].classList.add('active');
    if(cat==='favorites') btns[1].classList.add('active');
    if(cat==='hand') btns[2].classList.add('active');
    if(cat==='electric') btns[3].classList.add('active');
    if(cat==='custom') btns[4].classList.add('active');
    renderBenderListUI();
}
function renderBenderListUI() {
    const list = document.getElementById('bender-list');
    
    let filtered = benderLibrary;
    if (state.filter === 'favorites') {
        filtered = benderLibrary.filter(b => state.favorites.includes(b.id));
    } else if (state.filter !== 'all') {
        filtered = benderLibrary.filter(b => b.cat === state.filter);
    }

    if (filtered.length === 0) {
        list.innerHTML = `<div style="padding:30px; text-align:center; color:var(--text-muted);">
            <ion-icon name="star-outline" style="font-size:2rem; margin-bottom:10px;"></ion-icon><br>
            No benders found.
        </div>`;
        return;
    }

    list.innerHTML = filtered.map(b => {
        const isFav = state.favorites.includes(b.id);
        const isCustom = b.cat === 'custom';
        return `
        <div class="bender-item ${state.currentBender.id === b.id ? 'active' : ''}" onclick="selectBender('${b.id}')">
            <div style="flex:1;">
                <div class="b-brand" style="color:${b.color}">${b.brand} ${b.model}</div>
                <div class="b-specs">${b.size} • Ded: ${b.ded}" • Gain: ${b.gain}"</div>
                <div class="b-notes">${b.notes || ''}</div>
            </div>
            <div style="display:flex; gap:8px; align-items:center;">
                ${isCustom ? `<button class="icon-btn" onclick="deleteCustomBender('${b.id}', event)" style="color:#ef4444; padding:4px;" title="Delete"><ion-icon name="trash-outline"></ion-icon></button>` : ''}
                <button class="fav-btn ${isFav ? 'active' : ''}" onclick="event.stopPropagation(); toggleFavoriteBender('${b.id}')">
                    <ion-icon name="${isFav ? 'star' : 'star-outline'}"></ion-icon>
                </button>
                ${state.currentBender.id === b.id ? '<ion-icon name="checkmark-circle" style="color:var(--primary); font-size:1.5rem;"></ion-icon>' : ''}
            </div>
        </div>
    `}).join('');
}
function selectBender(id) {
    state.currentBender = benderLibrary.find(b => b.id === id);
    localStorage.setItem('qc_bender_id', id);
    updateHeaderDisplay();
    closeBenderLibrary();
}
function updateHeaderDisplay() {
    const b = state.currentBender;
    const displayName = b.model.includes('Hand') ? b.model : `${b.brand} ${b.model}`;
    document.getElementById('header-tool-name').innerText = displayName;
    document.querySelector('.tool-dot').style.background = b.color;
    // Store for quick reference
    document.querySelector('.tool-dot').title = `Deduct: ${b.ded}" | Gain: ${b.gain}"`;
}

/* =========================================
   CUSTOM BENDER LOGIC
   ========================================= */
window.openCustomBenderForm = () => {
    document.getElementById('modal-custom-bender').classList.remove('hidden');
    // Reset form
    document.getElementById('cb-brand').value = '';
    document.getElementById('cb-model').value = '';
    document.getElementById('cb-size').value = '1/2"';
    document.getElementById('cb-ded').value = '';
    document.getElementById('cb-gain').value = '';
}

window.closeCustomBenderForm = () => {
    document.getElementById('modal-custom-bender').classList.add('hidden');
}

window.saveCustomBender = () => {
    const brand = document.getElementById('cb-brand').value.trim() || 'Custom';
    const model = document.getElementById('cb-model').value.trim() || 'Bender';
    const size = document.getElementById('cb-size').value;
    const ded = parseFloat(document.getElementById('cb-ded').value);
    const gain = parseFloat(document.getElementById('cb-gain').value);

    if (isNaN(ded) || isNaN(gain)) {
        alert('Please enter valid numbers for Deduct and Gain');
        return;
    }

    const newBender = {
        id: 'custom_' + Date.now(),
        brand: brand, model: model, size: size, ded: ded, gain: gain,
        cat: 'custom', color: '#9C27B0', notes: 'Custom User Bender'
    };

    const customBenders = JSON.parse(localStorage.getItem('qc_custom_benders') || '[]');
    customBenders.push(newBender);
    localStorage.setItem('qc_custom_benders', JSON.stringify(customBenders));

    benderLibrary.push(newBender);
    selectBender(newBender.id);
    closeCustomBenderForm();
    showNotification('Custom bender created!');
}

window.deleteCustomBender = (id, event) => {
    event.stopPropagation();
    if(!confirm('Delete this custom bender?')) return;
    const idx = benderLibrary.findIndex(b => b.id === id);
    if (idx > -1) benderLibrary.splice(idx, 1);
    let customBenders = JSON.parse(localStorage.getItem('qc_custom_benders') || '[]');
    customBenders = customBenders.filter(b => b.id !== id);
    localStorage.setItem('qc_custom_benders', JSON.stringify(customBenders));
    if (state.currentBender.id === id) { state.currentBender = benderLibrary[0]; updateHeaderDisplay(); }
    renderBenderListUI();
    showNotification('Bender deleted');
}

/* =========================================
   10. MODAL LOGIC (About & Guide)
   ========================================= */
function openAbout() {
    document.getElementById('modal-about').classList.remove('hidden');
}

function closeAbout() {
    document.getElementById('modal-about').classList.add('hidden');
}

// GUIDE MODAL LOGIC
function openGuide(type) {
    // This pulls text from the knowledge.js file
    const content = getBendGuide(type); 
    document.getElementById('guide-content').innerHTML = content;
    document.getElementById('modal-guide').classList.remove('hidden');
}

function closeGuide() {
    document.getElementById('modal-guide').classList.add('hidden');
}

// Load guide references
window.loadGuide = (type) => {
    const titles = {
        'nec_support': 'NEC Support Requirements', 
        'bend_math': 'Bending Mathematics',
        'trade_terms': 'Trade Terminology',
        'tape_reading': 'Reading a Tape Measure',
        'conduit_specs': 'Conduit Specifications',
        'drill_sizes': 'Hole Saw Guide'
    };
    
    // Classroom Content for Bending Math
    const classroomContent = `
    <div class="home-grid">
        <div class="ref-card">
            <div class="ref-header"><ion-icon name="school"></ion-icon> CLASSROOM SESSION 1: THE BASICS</div>
            <div style="padding:15px; line-height:1.6; font-size:0.9rem;">
                <p><strong>Welcome to Conduit 101.</strong> In the field, we use "multipliers" to make offsets. But why? It's all based on Right-Angle Trigonometry.</p>
                
                <h4 style="color:var(--primary); margin-top:15px; margin-bottom:5px;">1. The Right Triangle</h4>
                <p style="margin-bottom:10px;">Every offset creates a right triangle in the air.</p>
                <ul style="list-style:none; padding-left:10px; border-left:3px solid var(--primary); margin-bottom:15px;">
                    <li style="margin-bottom:5px;"><strong>Opposite Side (Rise):</strong> How high you need to go.</li>
                    <li style="margin-bottom:5px;"><strong>Hypotenuse (Travel):</strong> The pipe length between bends.</li>
                    <li><strong>Angle (Theta):</strong> The bend on your shoe (e.g., 30°).</li>
                </ul>
                
                <h4 style="color:var(--primary); margin-top:15px; margin-bottom:5px;">2. The Golden Rule: Cosecant</h4>
                <p>We want to find the <em>Travel</em> (Hypotenuse). The formula is:</p>
                <div style="background:rgba(255,255,255,0.05); padding:10px; border-radius:4px; text-align:center; font-family:monospace; margin:10px 0; border:1px solid var(--border);">
                    Travel = Rise ÷ sin(Angle)
                </div>
                <p>Since dividing by decimals is hard in your head, we use the <strong>Cosecant</strong> (1 ÷ sin). This gives us our <strong>Multiplier</strong>.</p>
                <p style="background:rgba(33, 150, 243, 0.1); padding:8px; border-radius:4px;"><em>Example for 30°:</em><br>sin(30) = 0.5<br>Multiplier = 1 ÷ 0.5 = <strong>2</strong></p>
            </div>
        </div>

        <div class="ref-card">
            <div class="ref-header"><ion-icon name="resize"></ion-icon> CLASSROOM SESSION 2: SHRINK</div>
            <div style="padding:15px; line-height:1.6; font-size:0.9rem;">
                <p><strong>Shrink</strong> is the pipe "lost" because it's taking a diagonal path instead of a straight one.</p>
                
                <h4 style="color:var(--primary); margin-top:15px; margin-bottom:5px;">Why it matters</h4>
                <p>If you don't account for shrink, your second bend will be correct, but your pipe will be too short to reach the box.</p>
                
                <div style="background:rgba(255,255,255,0.05); padding:10px; border-radius:4px; text-align:center; font-family:monospace; margin:10px 0; border:1px solid var(--border);">
                    Total Length = Distance + Shrink
                </div>
                
                <h4 style="color:var(--primary); margin-top:15px; margin-bottom:5px;">The Constant</h4>
                <p>Each angle has a "Shrink Constant".</p>
                <ul style="list-style:none; padding:0; margin-top:10px;">
                    <li style="display:flex; justify-content:space-between; border-bottom:1px solid #333; padding:5px 0;"><span>30°</span> <span>1/4" per inch of rise</span></li>
                    <li style="display:flex; justify-content:space-between; border-bottom:1px solid #333; padding:5px 0;"><span>45°</span> <span>3/8" per inch of rise</span></li>
                </ul>
            </div>
        </div>

        <div class="ref-card">
            <div class="ref-header"><ion-icon name="return-up-forward"></ion-icon> CLASSROOM SESSION 3: 90° STUBS</div>
            <div style="padding:15px; line-height:1.6; font-size:0.9rem;">
                <h4 style="color:var(--primary); margin-bottom:5px;">Deduct</h4>
                <p>When you bend a 90, the pipe curves. The bender shoe has a radius. Because of this curve, you don't need as much pipe as a sharp corner.</p>
                <p style="margin-bottom:15px;">We <strong>Deduct</strong> this amount from the stub height to find our mark.</p>
                
                <h4 style="color:var(--primary); margin-bottom:5px;">Gain</h4>
                <p>Gain is the difference between measuring square (Right Angle) vs measuring the curve (Arc).</p>
                <p style="background:rgba(33, 150, 243, 0.1); padding:8px; border-radius:4px; margin-top:10px;"><strong>Rule of Thumb:</strong> Gain is roughly the radius of the bender.</p>
            </div>
        </div>
    </div>`;

    if (type === 'bend_math') {
        document.getElementById('calc-title').innerText = titles[type];
        document.getElementById('calc-inputs').innerHTML = classroomContent;
    } else if (typeof guideContent !== 'undefined' && guideContent[type]) {
        document.getElementById('calc-title').innerText = titles[type] || 'Reference';
        document.getElementById('calc-inputs').innerHTML = `<div class="home-grid">${guideContent[type]}</div>`;
    }
    
    document.getElementById('result-box').classList.add('hidden');
    document.getElementById('calc-btn').classList.add('hidden');
    document.getElementById('sidebar').classList.remove('open');
    document.getElementById('overlay').classList.remove('visible');
};

/* =========================================
   11. FILL CALCULATOR LOGIC
   ========================================= */
window.updateFillState = (key, val) => {
    state.fillConfig[key] = val;
    if(key === 'type') updateConduitOptions();
}

window.updateConduitOptions = () => {
    const type = state.fillConfig.type;
    const sizes = Object.keys(necData.conduit[type]);
    const sel = document.getElementById('c_size');
    if(!sel) return;
    sel.innerHTML = sizes.map(s => `<option value="${s}" ${state.fillConfig.size===s?'selected':''}>${s}</option>`).join('');
    // Ensure current size is valid, else reset
    if(!sizes.includes(state.fillConfig.size)) state.fillConfig.size = sizes[0];
    sel.value = state.fillConfig.size;
}

window.renderWireRows = () => {
    const container = document.getElementById('wire-list-container');
    if(!container) return;
    container.innerHTML = state.wireList.map((w, i) => `
        <div class="fill-row">
            <input type="number" class="qty" value="${w.qty}" onchange="updateWire(${i}, 'qty', this.value)" min="1">
            <select class="flex-1" onchange="updateWire(${i}, 'size', this.value)">
                ${Object.keys(necData.wires[w.type]).map(s => `<option value="${s}" ${w.size===s?'selected':''}>${s}</option>`).join('')}
            </select>
            <select class="flex-1" onchange="updateWire(${i}, 'type', this.value)">
                <option value="THHN" ${w.type==='THHN'?'selected':''}>THHN</option>
                <option value="XHHW" ${w.type==='XHHW'?'selected':''}>XHHW</option>
            </select>
            <button class="btn-remove" onclick="removeWireRow(${i})"><ion-icon name="trash-outline"></ion-icon></button>
        </div>
    `).join('');
    calculateFill();
}

window.addWireRow = () => { state.wireList.push({qty:1, type:'THHN', size:'12'}); renderWireRows(); }
window.removeWireRow = (i) => { state.wireList.splice(i, 1); renderWireRows(); }
window.updateWire = (i, k, v) => { state.wireList[i][k] = k==='qty'?parseInt(v):v; renderWireRows(); }

function calculateFill() {
    if (!state.wireList || state.wireList.length === 0) {
        document.getElementById('result-box').classList.add('hidden');
        return;
    }
    
    const cArea = necData.conduit[state.fillConfig.type]?.[state.fillConfig.size];
    if (!cArea) {
        document.getElementById('result-box').classList.add('hidden');
        return;
    }
    
    let wArea = 0;
    let totalWires = 0;
    state.wireList.forEach(w => {
        const wireArea = necData.wires[w.type]?.[w.size];
        if (wireArea) {
            wArea += (wireArea * (parseInt(w.qty) || 0));
            totalWires += (parseInt(w.qty) || 0);
        }
    });

    let maxPct = 0.40;
    if(totalWires === 1) maxPct = 0.53;
    else if(totalWires === 2) maxPct = 0.31;
    
    const fillPct = totalWires === 0 ? 0 : (wArea / cArea) * 100;
    const maxArea = cArea * maxPct;
    const isSafe = fillPct <= (maxPct * 100);
    const statusColor = isSafe ? 'var(--primary)' : '#ef4444';
    const statusText = isSafe ? '✓ COMPLIANT' : '✗ OVERFILL';
    const barClass = isSafe ? (fillPct > (maxPct*85) ? 'warning' : '') : 'danger';
    const statusMsg = totalWires === 0 ? 'Add wires to calculate' : (isSafe ? 'Meets NEC Chapter 9' : 'Exceeds allowed fill');

    const html = `
        <div class="fill-stat-grid">
            <div class="fill-stat-box">
                <span class="fill-stat-label">Wire Count</span>
                <span class="fill-stat-val">${totalWires}</span>
            </div>
            <div class="fill-stat-box">
                <span class="fill-stat-label">Wire Area</span>
                <span class="fill-stat-val">${wArea.toFixed(4)}</span>
            </div>
            <div class="fill-stat-box">
                <span class="fill-stat-label">Conduit Area</span>
                <span class="fill-stat-val">${cArea.toFixed(4)}</span>
            </div>
            <div class="fill-stat-box">
                <span class="fill-stat-label">Max Fill (${(maxPct*100).toFixed(0)}%)</span>
                <span class="fill-stat-val">${maxArea.toFixed(4)}</span>
            </div>
        </div>
        <div class="fill-result-bar">
            <div class="fill-fill ${barClass}" style="width:${Math.min(fillPct, 100)}%"></div>
            <div class="fill-limit-line" style="left:${maxPct*100}%"></div>
        </div>
        <div class="fill-legend">
            <span>0%</span>
            <span style="font-weight:bold; color:${statusColor};">${fillPct.toFixed(1)}%</span>
            <span>100%</span>
        </div>
        <div style="text-align:center; font-weight:bold; font-size:1.1rem; color:${statusColor}; margin-top:15px;">
            ${statusText}
        </div>
        <div style="text-align:center; font-size:0.85rem; color:var(--text-muted); margin-top:8px;">
            ${statusMsg}
        </div>
    `;
    
    displayResults([], 0, 0, html);
}

/* =========================================
   12. ENHANCED FEATURES
   ========================================= */

// Save calculation to history
function saveToHistory(type, inputs) {
    const entry = {
        id: Date.now(),
        type: type,
        bender: state.currentBender.model,
        inputs: inputs,
        timestamp: new Date().toLocaleString(),
        date: new Date().toLocaleDateString()
    };
    state.history.unshift(entry);
    if (state.history.length > state.maxHistory) state.history.pop();
    localStorage.setItem('qc_history', JSON.stringify(state.history));
    showNotification('✓ Calculation saved to history');
}

// Toggle favorite bender
function toggleFavoriteBender(benderId) {
    const idx = state.favorites.indexOf(benderId);
    if (idx > -1) {
        state.favorites.splice(idx, 1);
        showNotification('Removed from favorites');
    } else {
        state.favorites.push(benderId);
        showNotification('✓ Added to favorites');
    }
    localStorage.setItem('qc_favorites', JSON.stringify(state.favorites));
    renderBenderListUI();
}

// Show notification toast
function showNotification(msg, duration = 2000) {
    const div = document.createElement('div');
    div.style.cssText = 'position:fixed; bottom:20px; left:50%; transform:translateX(-50%); background:var(--primary); color:#000; padding:12px 20px; border-radius:20px; font-weight:bold; z-index:9999; animation:slideUp 0.3s ease;';
    div.textContent = msg;
    document.body.appendChild(div);
    setTimeout(() => div.remove(), duration);
}

// Export calculation as JSON
function exportCalculation() {
    const data = {
        bender: state.currentBender,
        calcType: state.activeCalc,
        timestamp: new Date().toISOString()
    };
    const json = JSON.stringify(data, null, 2);
    const blob = new Blob([json], {type: 'application/json'});
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `voltbend_${state.activeCalc}_${Date.now()}.json`;
    a.click();
    showNotification('✓ Calculation exported');
}

// View calculation history
function viewHistory() {
    if (state.history.length === 0) {
        alert('No calculation history yet');
        return;
    }
    let html = '<h3>Calculation History</h3><div style="max-height:400px; overflow-y:auto;">';
    state.history.forEach(h => {
        html += `<div style="padding:10px; border-bottom:1px solid #333; margin:5px 0;">
            <strong>${h.type}</strong> - ${h.bender}<br>
            <small>${h.timestamp}</small>
        </div>`;
    });
    html += '</div>';
    const content = document.getElementById('guide-content');
    if (content) {
        content.innerHTML = html;
        document.getElementById('modal-guide').classList.remove('hidden');
    }
}

// Validate inputs and show warnings
function validateInputs() {
    const warnings = [];
    const i1 = parseSmartInput(document.getElementById('i1')?.value);
    
    if (i1 > 100) warnings.push('⚠ Very tall bend - verify measurements');
    if (i1 < 0.5) warnings.push('⚠ Very short measurement - may not work');
    if (state.currentBender.ded === 0) warnings.push('⚠ Electric bender selected - deduct may vary by shoe');
    
    return warnings;
}

// Compare two benders
function compareBenders() {
    const modalContent = document.getElementById('guide-content');
    if (!modalContent) return;
    
    let html = `<h3>Bender Comparison</h3>
        <p style="color:#aaa; font-size:0.9rem;">Currently comparing with: <strong>${state.currentBender.model}</strong></p>
        <div style="display:grid; grid-template-columns:1fr 1fr; gap:15px;">`;
    
    benderLibrary.slice(0, 4).forEach((b, i) => {
        html += `<div style="background:var(--surface-light); padding:10px; border-radius:4px;">
            <strong style="color:${b.color}">${b.brand}</strong><br>
            ${b.model}<br>
            Ded: ${b.ded}" | Gain: ${b.gain}"<br>
            <small>${b.notes}</small>
        </div>`;
    });
    html += '</div>';
    
    modalContent.innerHTML = html;
    document.getElementById('modal-guide').classList.remove('hidden');
}

// Service worker for offline support
function registerServiceWorker() {
    if (!navigator.serviceWorker) return;
    
    const swCode = `
    self.addEventListener('install', e => {
        e.waitUntil(caches.open('voltbend-v1.1.4').then(cache => {
            return cache.addAll(['/index.html']);
        }));
    });
    self.addEventListener('fetch', e => {
        e.respondWith(caches.match(e.request).then(r => r || fetch(e.request)));
    });
    `;
    
    const blob = new Blob([swCode], {type: 'application/javascript'});
    const swUrl = URL.createObjectURL(blob);
    navigator.serviceWorker.register(swUrl).catch(() => {});
}

// Add calculation tips based on bend type
const bendTips = {
    'stub': '💡 Mark from the end of your pipe. Don\'t measure from the bender\'s back.',
    'offset': '💡 Spin 180° exactly between the two bends for accuracy.',
    'saddle3': '💡 The center bend takes all the height. Side bends just support.',
    'kick': '💡 Keep the kick light—just enough to enter the box.',
    'fill': '💡 Add wires one group at a time. Check fill as you go.'
};

function showBendTip(bendType) {
    const tip = bendTips[bendType];
    if (!tip) return;
    const el = document.createElement('div');
    el.style.cssText = 'background:#FBC02D; color:#000; padding:10px; margin:10px 0; border-radius:4px; font-weight:bold; border-left:4px solid #FF6D00;';
    el.textContent = tip;
    const inputs = document.getElementById('calc-inputs');
    if (inputs && !inputs.querySelector('.tip-msg')) {
        el.className = 'tip-msg';
        inputs.insertBefore(el, inputs.firstChild);
    }
}

/* =========================================
   13. PWA INSTALL SUPPORT
   ========================================= */
let deferredPrompt = null;
let installDismissed = false;

function setupInstallPrompt() {
    const installBtn = document.getElementById('install-btn');
    
    window.addEventListener('beforeinstallprompt', (e) => {
        e.preventDefault();
        deferredPrompt = e;
        installDismissed = false;
        if (installBtn) {
            installBtn.style.display = 'flex';
            installBtn.title = 'Click to install app on ' + getOSName();
        }
    });
    
    window.addEventListener('appinstalled', () => {
        deferredPrompt = null;
        installDismissed = true;
        if (installBtn) {
            installBtn.style.display = 'none';
        }
        showNotification('✓ VoltBend installed! Check your home screen');
    });
    
    if (installBtn) {
        installBtn.addEventListener('click', installApp);
    }
}

function installApp() {
    if (!deferredPrompt) {
        // Provide OS-specific installation instructions
        if (state.osType === 'ios') {
            showNotification('📱 Press Share → Add to Home Screen');
        } else if (state.osType === 'android') {
            showNotification('📱 Menu → Install app');
        } else if (state.osType === 'windows') {
            showNotification('💻 Click the address bar icon to install');
        } else {
            showNotification('See browser menu for install option');
        }
        return;
    }
    
    deferredPrompt.prompt();
    deferredPrompt.userChoice.then((choiceResult) => {
        if (choiceResult.outcome === 'accepted') {
            showNotification('✓ Installing VoltBend...');
            deferredPrompt = null;
        } else {
            // Allow retry - don't set to null immediately
            showNotification('Installation cancelled. Try again anytime!');
            setTimeout(() => {
                deferredPrompt = null;
            }, 3000);
        }
    }).catch(() => {
        // On error, allow retry
        showNotification('Installation failed. Try again or use manual install.');
    });
}

function resetInstallPrompt() {
    installDismissed = false;
    deferredPrompt = null;
    showNotification('Install prompt reset. Try installing again!');
}

/* =========================================
   14. MATH GENERATOR
   ========================================= */
function generateMathBlock(type, i1, i2, i3, ang, b, dat, shrink, cut, marks) {
    let html = `<div class="math-box"><span class="math-title">📐 STEP-BY-STEP MATH BREAKDOWN</span>`;
    const fmt = (n) => (Math.round(n*100)/100);
    const v = (n) => `<strong>${fmt(n)}" (${toFraction(n)})</strong>`;

    if (type === 'stub') {
        html += `
        <div class="math-step-title">GIVEN VALUES</div>
        <div class="math-row"><span>Target Height: ${i1}"</span> <span>Bender Deduct: ${b.ded}"</span></div>
        <div class="math-row"><span>Bender Gain: ${b.gain}"</span></div>

        <div class="math-step-title">STEP 1: FIND THE MARK</div>
        <div class="math-desc">Subtract the bender's deduct from your target height.</div>
        <div class="math-row"><span class="math-formula">Mark = Height - Deduct</span></div>
        <div class="math-row"><span>${i1} - ${b.ded} = ${v(i1 - b.ded)}</span></div>
        
        <div class="math-step-title">STEP 2: CALCULATE CUT LENGTH</div>
        <div class="math-desc">Add the "Gain" (pipe saved by the curve) to the height.</div>
        <div class="math-row"><span class="math-formula">Cut = Height + Gain</span></div>
        <div class="math-row"><span>${i1} + ${b.gain} = ${v(cut)}</span></div>`;
    } 
    else if (['offset', 'shallow_off', 'deep_off', 'zbend'].includes(type)) {
        const travel = i1 * dat.m;
        const m1 = i2 + shrink; // Far mark
        const m2 = m1 - travel; // Near mark

        html += `
        <div class="math-step-title">GIVEN VALUES</div>
        <div class="math-row"><span>Rise: ${i1}"</span> <span>Distance: ${i2}"</span></div>
        <div class="math-row"><span>Angle: ${ang}°</span> <span>Multiplier: ${dat.m}</span></div>
        
        <div class="math-step-title">STEP 1: CALCULATE TRAVEL</div>
        <div class="math-desc">Distance between bends (Hypotenuse).</div>
        <div class="math-row"><span class="math-formula">Travel = Rise × Multiplier</span></div>
        <div class="math-row"><span>${i1} × ${dat.m} = ${v(travel)}</span></div>
        
        <div class="math-step-title">STEP 2: CALCULATE SHRINK</div>
        <div class="math-desc">Total length lost due to the angle (Constant ${dat.s}).</div>
        <div class="math-row"><span class="math-formula">Shrink = Rise × Constant (${dat.s})</span></div>
        <div class="math-row"><span>${i1} × ${dat.s} = ${v(shrink)}</span></div>`;

        if (i2 > 0) {
            html += `
            <div class="math-step-title">STEP 3: FIND MARK 2 (FAR)</div>
            <div class="math-desc">Add shrink to the distance so the pipe reaches the obstacle.</div>
            <div class="math-row"><span class="math-formula">Mark 2 = Distance + Shrink</span></div>
            <div class="math-row"><span>${i2} + ${fmt(shrink)} = ${v(m1)}</span></div>
            
            <div class="math-step-title">STEP 4: FIND MARK 1 (NEAR)</div>
            <div class="math-desc">Measure back from Mark 2 by the Travel distance.</div>
            <div class="math-row"><span class="math-formula">Mark 1 = Mark 2 - Travel</span></div>
            <div class="math-row"><span>${fmt(m1)} - ${fmt(travel)} = ${v(m2)}</span></div>`;
        }
    }
    else if (type === 'saddle3') {
        const dist = i1 * 2.5;
        const saddleShrink = i1 * 0.1875;
        const center = i2 + saddleShrink;

        html += `
        <div class="math-step-title">GIVEN VALUES</div>
        <div class="math-row"><span>Obstacle Height: ${i1}"</span> <span>Distance to Center: ${i2}"</span></div>

        <div class="math-step-title">STEP 1: CALCULATE SHRINK</div>
        <div class="math-desc">For 22.5° saddles, shrink is 3/16" (0.1875) per inch of rise.</div>
        <div class="math-row"><span class="math-formula">Shrink = Rise × 0.1875</span></div>
        <div class="math-row"><span>${i1} × 0.1875 = ${v(saddleShrink)}</span></div>
        
        <div class="math-step-title">STEP 2: FIND CENTER MARK</div>
        <div class="math-desc">Add shrink to the center distance to compensate for the first bend.</div>
        <div class="math-row"><span class="math-formula">Center = Distance + Shrink</span></div>
        <div class="math-row"><span>${i2} + ${fmt(saddleShrink)} = ${v(center)}</span></div>
        
        <div class="math-step-title">STEP 3: SIDE BEND DISTANCE</div>
        <div class="math-desc">Distance from center to side bends (Multiplier 2.5).</div>
        <div class="math-row"><span class="math-formula">Side Dist = Rise × 2.5</span></div>
        <div class="math-row"><span>${i1} × 2.5 = ${v(dist)}</span></div>
        
        <div class="math-step-title">STEP 4: SIDE MARKS</div>
        <div class="math-desc">Mark the pipe on both sides of the center.</div>
        <div class="math-row"><span>Mark 1 = ${fmt(center)} - ${fmt(dist)} = ${v(center - dist)}</span></div>
        <div class="math-row"><span>Mark 3 = ${fmt(center)} + ${fmt(dist)} = ${v(center + dist)}</span></div>`;
    }
    else if (['kick', 'stub_kick', 'off_kick'].includes(type)) {
        const travel = i2 * dat.m;
        const stubM = i1 - b.ded;
        
        html += `
        <div class="math-step-title">GIVEN VALUES</div>
        <div class="math-row"><span>Stub Height: ${i1}"</span> <span>Kick Height: ${i2}"</span></div>

        <div class="math-step-title">STEP 1: STUB MARK</div>
        <div class="math-desc">Standard 90° bend mark.</div>
        <div class="math-row"><span class="math-formula">Stub Mark = Height - Deduct</span></div>
        <div class="math-row"><span>${i1} - ${b.ded} = ${v(stubM)}</span></div>

        <div class="math-step-title">STEP 1: KICK TRAVEL</div>
        <div class="math-desc">Distance between the 90° bend and the kick.</div>
        <div class="math-row"><span class="math-formula">Travel = Kick Rise × Multiplier</span></div>
        <div class="math-row"><span>${i2} × ${dat.m} = ${v(travel)}</span></div>
        
        <div class="math-step-title">STEP 3: KICK CENTER MARK</div>
        <div class="math-desc">Place the kick back from the 90° (includes 6" spacing).</div>
        <div class="math-row"><span class="math-formula">Center = Stub Mark - 6" - Travel</span></div>
        <div class="math-row"><span>${fmt(stubM)} - 6 - ${fmt(travel)} = ${v(marks[1].p)}</span></div>`;
    }
    else if (type === 'saddle4') {
        const travel = i1 * dat.m;
        const sF = i3 + shrink; // Start Front
        const sR = sF - travel; // Start Rear
        const eF = sF + i2;     // End Front
        
        html += `
        <div class="math-step-title">GIVEN VALUES</div>
        <div class="math-row"><span>Height: ${i1}"</span> <span>Width: ${i2}"</span> <span>Dist: ${i3}"</span></div>

        <div class="math-step-title">STEP 1: CALCULATE SHRINK</div>
        <div class="math-desc">Shrink for the first offset.</div>
        <div class="math-row"><span class="math-formula">Shrink = Rise × Constant</span></div>
        <div class="math-row"><span>${i1} × ${dat.s} = ${v(shrink)}</span></div>

        <div class="math-step-title">STEP 2: MARK 2 (START FRONT)</div>
        <div class="math-desc">Distance to obstacle + Shrink.</div>
        <div class="math-row"><span class="math-formula">M2 = Distance + Shrink</span></div>
        <div class="math-row"><span>${i3} + ${fmt(shrink)} = ${v(sF)}</span></div>

        <div class="math-step-title">STEP 3: MARK 1 (START REAR)</div>
        <div class="math-desc">Measure back by Travel (Rise × Multiplier).</div>
        <div class="math-row"><span class="math-formula">M1 = M2 - Travel</span></div>
        <div class="math-row"><span>${fmt(sF)} - ${fmt(travel)} = ${v(sR)}</span></div>

        <div class="math-step-title">STEP 4: MARK 3 (END FRONT)</div>
        <div class="math-desc">Add the width of the obstacle to Mark 2.</div>
        <div class="math-row"><span class="math-formula">M3 = M2 + Width</span></div>
        <div class="math-row"><span>${fmt(sF)} + ${i2} = ${v(eF)}</span></div>`;
    }
    else if (type === 'back2back') {
         html += `
        <div class="math-step-title">GIVEN VALUES</div>
        <div class="math-row"><span>Length: ${i1}"</span></div>
        <div class="math-step-title">STEP 1: MARK</div>
        <div class="math-desc">Measure outside-to-outside distance.</div>
        <div class="math-row"><span class="math-formula">Mark = Length</span></div>
        <div class="math-row"><span>${i1} = ${v(i1)}</span></div>`;
    }
    else if (type === 'backbend') {
        html += `
        <div class="math-step-title">GIVEN VALUES</div>
        <div class="math-row"><span>Back Length: ${i1}"</span> <span>Deduct: ${b.ded}"</span> <span>Gain: ${b.gain}"</span></div>
        <div class="math-step-title">STEP 1: CALCULATE MARK</div>
        <div class="math-desc">Adjust for deduct and gain (reversed 90).</div>
        <div class="math-row"><span class="math-formula">Mark = Length - Deduct + Gain</span></div>
        <div class="math-row"><span>${i1} - ${b.ded} + ${b.gain} = ${v(i1 - b.ded + b.gain)}</span></div>`;
    }
    else if (type === 'compound_off') {
        const trueOff = Math.sqrt(i1*i1 + i2*i2);
        const travel = trueOff * dat.m;
        html += `
        <div class="math-step-title">GIVEN VALUES</div>
        <div class="math-row"><span>Rise: ${i1}"</span> <span>Roll: ${i2}"</span></div>
        <div class="math-step-title">STEP 1: TRUE OFFSET</div>
        <div class="math-desc">Calculate hypotenuse of Rise and Roll.</div>
        <div class="math-row"><span class="math-formula">True Offset = √(Rise² + Roll²)</span></div>
        <div class="math-row"><span>√(${i1}² + ${i2}²) = ${v(trueOff)}</span></div>
        <div class="math-step-title">STEP 2: TRAVEL</div>
        <div class="math-row"><span class="math-formula">Travel = True Offset × Multiplier</span></div>
        <div class="math-row"><span>${fmt(trueOff)} × ${dat.m} = ${v(travel)}</span></div>
        <div class="math-step-title">STEP 3: SHRINK</div>
        <div class="math-row"><span class="math-formula">Shrink = True Offset × Constant</span></div>
        <div class="math-row"><span>${fmt(trueOff)} × ${dat.s} = ${v(shrink)}</span></div>`;
    }
    else if (type === 'rolling') {
        const trueOff = Math.sqrt(i1*i1 + i2*i2);
        const riseAngle = Math.atan(i1/i2) * (180/Math.PI);
        const travelDist = trueOff * Math.cos((ang/2) * (Math.PI/180));
        html += `
        <div class="math-step-title">GIVEN VALUES</div>
        <div class="math-row"><span>Rise: ${i1}"</span> <span>Roll: ${i2}"</span></div>
        <div class="math-step-title">STEP 1: TRUE DIMENSIONS</div>
        <div class="math-row"><span class="math-formula">True Offset = √(Rise² + Roll²)</span></div>
        <div class="math-row"><span>${v(trueOff)}</span></div>
        <div class="math-row"><span class="math-formula">Rise Angle = atan(Rise/Roll)</span></div>
        <div class="math-row"><span>${fmt(riseAngle)}°</span></div>
        <div class="math-step-title">STEP 2: CALCULATIONS</div>
        <div class="math-desc">Based on half-angle formulas.</div>
        <div class="math-row"><span class="math-formula">Travel = True Offset × cos(Angle/2)</span></div>
        <div class="math-row"><span>${v(travelDist)}</span></div>`;
    }
    else if (type === 'parallel') {
        const adj = i2 * Math.tan((ang/2) * (Math.PI/180));
        html += `
        <div class="math-step-title">GIVEN VALUES</div>
        <div class="math-row"><span>Spacing: ${i2}"</span> <span>Angle: ${ang}°</span></div>
        <div class="math-step-title">STEP 1: START ADJUSTMENT</div>
        <div class="math-desc">Amount to move start mark for parallel alignment.</div>
        <div class="math-row"><span class="math-formula">Adjust = Spacing × tan(Angle/2)</span></div>
        <div class="math-row"><span>${i2} × tan(${ang/2}) = ${v(adj)}</span></div>`;
    }
    else if (type === 'rolling_stub') {
        const trueHyp = Math.sqrt(i1*i1 + i2*i2);
        const rollAngle = Math.atan(i2/i1) * (180/Math.PI);
        const m1 = i2 - b.ded;
        html += `
        <div class="math-step-title">GIVEN VALUES</div>
        <div class="math-row"><span>Rise: ${i1}"</span> <span>Roll: ${i2}"</span></div>
        <div class="math-step-title">STEP 1: TRUE HYPOTENUSE</div>
        <div class="math-row"><span class="math-formula">Hyp = √(Rise² + Roll²)</span></div>
        <div class="math-row"><span>${v(trueHyp)}</span></div>
        <div class="math-step-title">STEP 2: ROLL ANGLE</div>
        <div class="math-row"><span class="math-formula">Angle = atan(Roll/Rise)</span></div>
        <div class="math-row"><span>${fmt(rollAngle)}°</span></div>
        <div class="math-step-title">STEP 3: 90° MARK</div>
        <div class="math-row"><span class="math-formula">Mark = Roll - Deduct</span></div>
        <div class="math-row"><span>${i2} - ${b.ded} = ${v(m1)}</span></div>`;
    }
    else if (type === 'off_90' || type === '90_off') {
        const offsetTravel = i2 * dat.m;
        const stubDist = i1 - b.ded;
        const m2 = 12 + offsetTravel;
        const m3 = m2 + stubDist;
        html += `
        <div class="math-step-title">GIVEN VALUES</div>
        <div class="math-row"><span>Stub: ${i1}"</span> <span>Offset: ${i2}"</span></div>
        <div class="math-step-title">STEP 1: OFFSET CALCS</div>
        <div class="math-row"><span class="math-formula">Travel = Offset × Multiplier</span></div>
        <div class="math-row"><span>${i2} × ${dat.m} = ${v(offsetTravel)}</span></div>
        <div class="math-step-title">STEP 2: MARKS</div>
        <div class="math-desc">Assuming start at 12".</div>
        <div class="math-row"><span>Mark 1 (Start) = 12"</span></div>
        <div class="math-row"><span>Mark 2 (End) = 12 + Travel = ${v(m2)}</span></div>
        <div class="math-row"><span>Mark 3 (90) = Mark 2 + (Stub - Ded) = ${v(m3)}</span></div>`;
    }
    else if (type === 'comp_bend') {
        const bend1 = i1 - b.ded;
        const bend2offset = i2 * dat.m;
        const bend2pos = bend1 + bend2offset;
        const bend3 = i3 - b.ded;
        html += `
        <div class="math-step-title">GIVEN VALUES</div>
        <div class="math-row"><span>B1: ${i1}"</span> <span>B2: ${i2}"</span> <span>B3: ${i3}"</span></div>
        <div class="math-step-title">STEP 1: BEND 1</div>
        <div class="math-row"><span>Mark = ${i1} - ${b.ded} = ${v(bend1)}</span></div>
        <div class="math-step-title">STEP 2: BEND 2</div>
        <div class="math-row"><span>Travel = ${i2} × ${dat.m} = ${v(bend2offset)}</span></div>
        <div class="math-row"><span>Mark = B1 + Travel = ${v(bend2pos)}</span></div>
        <div class="math-step-title">STEP 3: BEND 3</div>
        <div class="math-row"><span>Mark = B2 + (${i3} - ${b.ded}) = ${v(bend2pos + bend3)}</span></div>`;
    }
    else {
        html += `<div style="color:#888; font-style:italic;">Detailed math steps not available for this specific bend type yet.</div>`;
    }

    html += `</div>`;
    return html;
}