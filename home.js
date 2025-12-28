/* =========================================
   HOME PAGE (DASHBOARD)
   ========================================= */
const homeHTML = `
    <style>
        .home-grid { display: grid; grid-template-columns: 1fr; gap: 15px; padding-bottom: 20px; }
        .ref-card { background: var(--surface-light); border: 1px solid var(--border); border-radius: 8px; overflow: hidden; }
        .ref-header { background: #151515; padding: 10px 15px; color: var(--primary); font-weight: bold; font-size: 0.8rem; letter-spacing: 1px; border-bottom: 1px solid var(--border); display:flex; align-items:center; gap:8px; }
        .ref-table { width: 100%; border-collapse: collapse; font-size: 0.85rem; }
        .ref-table td, .ref-table th { padding: 8px 15px; border-bottom: 1px solid rgba(255,255,255,0.05); text-align: left; color: var(--text-muted); }
        .ref-table th { color: #fff; background:rgba(255,255,255,0.02); }
        .ref-table td:last-child { color: var(--text); font-weight: bold; text-align: right; }
        .stat-row { display: flex; justify-content: space-between; padding: 10px 15px; border-bottom: 1px solid rgba(255,255,255,0.05); }
        .stat-label { color: var(--text-muted); font-size: 0.9rem; }
        .stat-val { color: var(--text); font-weight: bold; }
        .code-cite { font-size: 0.75rem; color: var(--primary); opacity: 0.8; font-style: italic; margin-left: 5px; }
        
        /* Two Column Layout for larger screens */
        @media (min-width: 600px) {
            .home-grid { grid-template-columns: 1fr 1fr; }
        }
    </style>

    <div class="home-grid">
        
        <div class="ref-card">
            <div class="ref-header"><ion-icon name="analytics"></ion-icon> OFFSET CONSTANTS</div>
            <table class="ref-table">
                <tr><th>Angle</th><th>Mult</th><th>Shrink/In</th></tr>
                <tr><td>10°</td><td>6.0</td><td>1/16"</td></tr>
                <tr><td>22.5°</td><td>2.6</td><td>3/16"</td></tr>
                <tr><td>30°</td><td>2.0</td><td>1/4"</td></tr>
                <tr><td>45°</td><td>1.4</td><td>3/8"</td></tr>
                <tr><td>60°</td><td>1.15</td><td>1/2"</td></tr>
            </table>
        </div>

        <div class="ref-card">
            <div class="ref-header"><ion-icon name="cut"></ion-icon> STANDARD DEDUCTS</div>
            <table class="ref-table">
                <tr><th>Size (EMT)</th><th>Deduct</th></tr>
                <tr><td>1/2"</td><td>5"</td></tr>
                <tr><td>3/4"</td><td>6"</td></tr>
                <tr><td>1"</td><td>8"</td></tr>
                <tr><td>1 1/4"</td><td>11"</td></tr>
            </table>
        </div>

        <div class="ref-card">
            <div class="ref-header"><ion-icon name="disc"></ion-icon> KNOCKOUT SIZES</div>
            <table class="ref-table">
                <tr><th>Trade Size</th><th>Hole Saw</th></tr>
                <tr><td>1/2"</td><td>7/8"</td></tr>
                <tr><td>3/4"</td><td>1 1/8"</td></tr>
                <tr><td>1"</td><td>1 3/8"</td></tr>
                <tr><td>1 1/4"</td><td>1 3/4"</td></tr>
            </table>
        </div>

        <div class="ref-card">
            <div class="ref-header"><ion-icon name="flash"></ion-icon> NEC QUICK REF</div>
            
            <div class="stat-row">
                <span class="stat-label">Max Support <span class="code-cite">358.30(A)</span></span>
                <span class="stat-val">10 ft</span>
            </div>
            <div class="stat-row">
                <span class="stat-label">Dist from Box <span class="code-cite">358.30(A)</span></span>
                <span class="stat-val">3 ft</span>
            </div>
            <div class="stat-row">
                <span class="stat-label">Max Bends <span class="code-cite">358.26</span></span>
                <span class="stat-val">360°</span>
            </div>
            <div class="stat-row">
                <span class="stat-label">Wire Fill (2+) <span class="code-cite">Ch.9 Tbl.1</span></span>
                <span class="stat-val">40%</span>
            </div>
            <div class="stat-row">
                <span class="stat-label">Wire Fill (1) <span class="code-cite">Ch.9 Tbl.1</span></span>
                <span class="stat-val">53%</span>
            </div>
            <div class="stat-row">
                <span class="stat-label">Grounding <span class="code-cite">250.118</span></span>
                <span class="stat-val">EMT OK</span>
            </div>
        </div>

        <div class="ref-card">
            <div class="ref-header"><ion-icon name="grid"></ion-icon> DECIMALS</div>
            <table class="ref-table">
                <tr><td>.125</td><td>1/8"</td></tr>
                <tr><td>.250</td><td>1/4"</td></tr>
                <tr><td>.375</td><td>3/8"</td></tr>
                <tr><td>.500</td><td>1/2"</td></tr>
                <tr><td>.625</td><td>5/8"</td></tr>
                <tr><td>.750</td><td>3/4"</td></tr>
                <tr><td>.875</td><td>7/8"</td></tr>
            </table>
        </div>

    </div>
`;

function loadHome() {
    document.getElementById('calc-title').innerText = "Dashboard";
    document.getElementById('calc-inputs').innerHTML = homeHTML;
    document.getElementById('result-box').classList.add('hidden');
    document.getElementById('calc-btn').classList.add('hidden');
    
    // Ensure sidebar is closed when home loads
    document.getElementById('sidebar').classList.remove('open');
    document.getElementById('overlay').classList.remove('visible');
}