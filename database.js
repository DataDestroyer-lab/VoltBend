/* =========================================
   BENDER EQUIPMENT DATABASE
   Complete USA Inventory - Updated 2024
   ========================================= */

const benderDatabase = {
    // --- GREENLEE (GREEN) - INDUSTRY STANDARD ---
    greenlee: [
        { id: 'gl_50', cat: 'hand', brand: 'Greenlee', model: '1/2" Hand Bender', size: '1/2" EMT', ded: 5, gain: 2.65, color: '#2E7D32', notes: 'Solid. Never gonna wear out. Does the job all day.' },
        { id: 'gl_75', cat: 'hand', brand: 'Greenlee', model: '3/4" Hand Bender', size: '3/4" EMT', ded: 6, gain: 3.25, color: '#2E7D32', notes: 'Good feel, marks are sharp, keeps its shape.' },
        { id: 'gl_100', cat: 'hand', brand: 'Greenlee', model: '1" Hand Bender', size: '1" EMT', ded: 8, gain: 4.0, color: '#2E7D32', notes: 'Gets the job done. Heavy, but consistent bends.' },
        { id: 'gl_125', cat: 'hand', brand: 'Greenlee', model: '1 1/4" Hand Bender', size: '1 1/4" EMT', ded: 11, gain: 5.0, color: '#2E7D32', notes: 'Arm workout. Good for tight runs.' },
        { id: 'gl_r50', cat: 'hand', brand: 'Greenlee', model: '1/2" Rigid Bender', size: '1/2" Rigid', ded: 6, gain: 3.2, color: '#2E7D32', notes: 'You\'ll know when you\'re done. Rough work.' },
        { id: 'gl_r75', cat: 'hand', brand: 'Greenlee', model: '3/4" Rigid Bender', size: '3/4" Rigid', ded: 8, gain: 3.8, color: '#2E7D32', notes: 'For the hard stuff. Takes muscle.' },
        { id: 'gl_555', cat: 'electric', brand: 'Greenlee', model: '555 Electric', size: 'Multi-Shoe (1/2"-2")', ded: 0, gain: 0, color: '#2E7D32', notes: 'Been around forever. Guys trust it. Does 1/2" to 2".' },
        { id: 'gl_854', cat: 'electric', brand: 'Greenlee', model: '854DX Conduit Bender', size: 'Multi-Shoe (1/2"-2")', ded: 0, gain: 0, color: '#2E7D32', notes: 'Newer machine. Pushbuttons work. Good if you can afford it.' },
        { id: 'gl_881', cat: 'electric', brand: 'Greenlee', model: '881 Hydraulic', size: 'Multi-Size (1/2"-2")', ded: 0, gain: 0, color: '#2E7D32', notes: 'Beast. You\'re bending 2" all day and laughing about it.' },
        { id: 'gl_777', cat: 'electric', brand: 'Greenlee', model: '777 Hydraulic', size: 'Multi-Size (1/2"-2")', ded: 0, gain: 0, color: '#2E7D32', notes: 'Same thing, lighter. Still heavy, but you can move it.' },
    ],

    // --- IDEAL (BLUE) - QUALITY ALTERNATIVE ---
    ideal: [
        { id: 'id_50', cat: 'hand', brand: 'Ideal', model: '1/2" Hand Bender', size: '1/2" EMT', ded: 5, gain: 2.65, color: '#0277BD', notes: 'Not Greenlee, but not bad. Marks don\'t smudge.' },
        { id: 'id_75', cat: 'hand', brand: 'Ideal', model: '3/4" Hand Bender', size: '3/4" EMT', ded: 6, gain: 3.25, color: '#0277BD', notes: 'Lighter in hand. Some guys swear by em.' },
        { id: 'id_100', cat: 'hand', brand: 'Ideal', model: '1" Hand Bender', size: '1" EMT', ded: 8, gain: 4.0, color: '#0277BD', notes: 'Holds up. Good balance, not too heavy.' },
        { id: 'id_125', cat: 'hand', brand: 'Ideal', model: '1 1/4" Hand Bender', size: '1 1/4" EMT', ded: 11, gain: 5.0, color: '#0277BD', notes: 'Solid for bigger pipes.' },
        { id: 'id_r50', cat: 'hand', brand: 'Ideal', model: '1/2" Rigid Bender', size: '1/2" Rigid', ded: 6, gain: 3.2, color: '#0277BD', notes: 'Gets the job done for rigid.' },
        { id: 'id_r75', cat: 'hand', brand: 'Ideal', model: '3/4" Rigid Bender', size: '3/4" Rigid', ded: 8, gain: 3.8, color: '#0277BD', notes: 'Decent for heavier pipe.' },
        { id: 'id_555', cat: 'electric', brand: 'Ideal', model: '555 Clone', size: 'Multi-Shoe (1/2"-2")', ded: 0, gain: 0, color: '#0277BD', notes: 'Similar to Greenlee 555.' },
    ],

    // --- GARDNER BENDER (RED) - THE LEGENDS ---
    gardner: [
        { id: 'gb_50', cat: 'hand', brand: 'Gardner Bender', model: '1/2" Big Ben', size: '1/2" EMT', ded: 5, gain: 2.65, color: '#D32F2F', notes: 'That red handle. They built these things to last.' },
        { id: 'gb_75', cat: 'hand', brand: 'Gardner Bender', model: '3/4" Big Ben', size: '3/4" EMT', ded: 6, gain: 3.25, color: '#D32F2F', notes: 'The old ones are still better than new ones.' },
        { id: 'gb_100', cat: 'hand', brand: 'Gardner Bender', model: '1" Big Ben', size: '1" EMT', ded: 8, gain: 4.0, color: '#D32F2F', notes: 'If you find one used, grab it. Doesn\'t wear out.' },
        { id: 'gb_125', cat: 'hand', brand: 'Gardner Bender', model: '1 1/4" Big Ben', size: '1 1/4" EMT', ded: 11, gain: 5.0, color: '#D32F2F', notes: 'Legendary quality.' },
        { id: 'gb_one', cat: 'electric', brand: 'Gardner Bender', model: 'One Shot', size: 'Electric (1/2"-1")', ded: 0, gain: 0, color: '#D32F2F', notes: 'Electric Gardner. You don\'t see these much anymore.' },
    ],

    // --- MILWAUKEE (DARK RED) - TOOL MAKERS ---
    milwaukee: [
        { id: 'mw_50', cat: 'hand', brand: 'Milwaukee', model: '1/2" Aluminum', size: '1/2" EMT', ded: 5, gain: 2.6, color: '#B71C1C', notes: 'Super light. Good for lots of bends. Your arm won\'t hate you.' },
        { id: 'mw_75', cat: 'hand', brand: 'Milwaukee', model: '3/4" Aluminum', size: '3/4" EMT', ded: 6, gain: 3.2, color: '#B71C1C', notes: 'Aluminum body. Bends are pretty clean.' },
        { id: 'mw_100', cat: 'hand', brand: 'Milwaukee', model: '1" Aluminum', size: '1" EMT', ded: 8, gain: 3.9, color: '#B71C1C', notes: 'Lightweight for bigger work.' },
        { id: 'mw_125', cat: 'hand', brand: 'Milwaukee', model: '1 1/4" Aluminum', size: '1 1/4" EMT', ded: 11, gain: 4.9, color: '#B71C1C', notes: 'Good for one-man jobs.' },
    ],

    // --- KLEIN TOOLS (ORANGE) - ELECTRICIAN APPROVED ---
    klein: [
        { id: 'kl_50', cat: 'hand', brand: 'Klein Tools', model: '1/2" Benfield', size: '1/2" EMT', ded: 5, gain: 2.63, color: '#FF6D00', notes: 'Electrician approved.' },
        { id: 'kl_75', cat: 'hand', brand: 'Klein Tools', model: '3/4" Benfield', size: '3/4" EMT', ded: 6, gain: 3.25, color: '#FF6D00', notes: 'Perfect for residential work.' },
        { id: 'kl_100', cat: 'hand', brand: 'Klein Tools', model: '1" Benfield', size: '1" EMT', ded: 8, gain: 4.0, color: '#FF6D00', notes: 'Solid construction, good marks.' },
        { id: 'kl_125', cat: 'hand', brand: 'Klein Tools', model: '1 1/4" Benfield', size: '1 1/4" EMT', ded: 11, gain: 5.0, color: '#FF6D00', notes: 'Professional grade.' },
    ],

    // --- RIDGID (YELLOW) - HEAVY DUTY ---
    ridgid: [
        { id: 'rg_50', cat: 'hand', brand: 'Ridgid', model: '1/2" Hand Bender', size: '1/2" EMT', ded: 5, gain: 2.65, color: '#FBC02D', notes: 'Known for durability. Good marks.' },
        { id: 'rg_75', cat: 'hand', brand: 'Ridgid', model: '3/4" Hand Bender', size: '3/4" EMT', ded: 6, gain: 3.25, color: '#FBC02D', notes: 'Heavy duty construction.' },
        { id: 'rg_100', cat: 'hand', brand: 'Ridgid', model: '1" Hand Bender', size: '1" EMT', ded: 8, gain: 4.0, color: '#FBC02D', notes: 'Industrial strength.' },
        { id: 'rg_250', cat: 'electric', brand: 'Ridgid', model: '250 Electric', size: 'Multi-Shoe (1/2"-1")', ded: 0, gain: 0, color: '#FBC02D', notes: 'Heavy machine, reliable.' },
    ],

    // --- VERNON (PURPLE) - OLD SCHOOL ---
    vernon: [
        { id: 'vn_50', cat: 'hand', brand: 'Vernon', model: '1/2" Hand Bender', size: '1/2" EMT', ded: 5, gain: 2.65, color: '#7B1FA2', notes: 'Vintage. Still works if you find one.' },
        { id: 'vn_75', cat: 'hand', brand: 'Vernon', model: '3/4" Hand Bender', size: '3/4" EMT', ded: 6, gain: 3.25, color: '#7B1FA2', notes: 'Old timer\'s favorite.' },
    ],

    // --- COMMON GENERIC / HOUSE BRANDS ---
    generic: [
        { id: 'gn_50', cat: 'hand', brand: 'Generic', model: '1/2" Hand Bender', size: '1/2" EMT', ded: 5, gain: 2.65, color: '#616161', notes: 'Budget option. Works okay.' },
        { id: 'gn_75', cat: 'hand', brand: 'Generic', model: '3/4" Hand Bender', size: '3/4" EMT', ded: 6, gain: 3.25, color: '#616161', notes: 'What the supply house has.' },
        { id: 'gn_100', cat: 'hand', brand: 'Generic', model: '1" Hand Bender', size: '1" EMT', ded: 8, gain: 4.0, color: '#616161', notes: 'Will bend pipe.' },
    ],

    // --- CHANNEL (GRAY) - PRO GRADE ---
    channel: [
        { id: 'ch_50', cat: 'hand', brand: 'Channel', model: '1/2" Hand Bender', size: '1/2" EMT', ded: 5, gain: 2.65, color: '#424242', notes: 'Pro grade quality.' },
        { id: 'ch_75', cat: 'hand', brand: 'Channel', model: '3/4" Hand Bender', size: '3/4" EMT', ded: 6, gain: 3.25, color: '#424242', notes: 'Good construction.' },
    ],

    // --- SOUTHWIRE (BLUE-GRAY) - CORD/WIRE COMPANY ---
    southwire: [
        { id: 'sw_50', cat: 'hand', brand: 'Southwire', model: '1/2" Hand Bender', size: '1/2" EMT', ded: 5, gain: 2.65, color: '#455A64', notes: 'From a wire company. Decent quality.' },
        { id: 'sw_75', cat: 'hand', brand: 'Southwire', model: '3/4" Hand Bender', size: '3/4" EMT', ded: 6, gain: 3.25, color: '#455A64', notes: 'Solid performer.' },
    ],

    // --- CRES (METALLIC) - BUDGET ---
    cres: [
        { id: 'cr_50', cat: 'hand', brand: 'CRES', model: '1/2" Hand Bender', size: '1/2" EMT', ded: 5, gain: 2.62, color: '#A1887F', notes: 'Budget friendly. Gets the job done.' },
        { id: 'cr_75', cat: 'hand', brand: 'CRES', model: '3/4" Hand Bender', size: '3/4" EMT', ded: 6, gain: 3.2, color: '#A1887F', notes: 'Cheap option.' },
    ],

    // --- PVC SPECIFIC (YELLOW-GREEN) ---
    pvc: [
        { id: 'pvc_50', cat: 'hand', brand: 'Generic', model: '1/2" PVC Bender', size: '1/2" PVC', ded: 4, gain: 2.5, color: '#8BC34A', notes: 'For PVC conduit. Different math.' },
        { id: 'pvc_75', cat: 'hand', brand: 'Generic', model: '3/4" PVC Bender', size: '3/4" PVC', ded: 5, gain: 3.0, color: '#8BC34A', notes: 'PVC specific tool.' },
    ],

    // --- FLEX (TEAL) - FLEXIBLE CONDUIT ---
    flex: [
        { id: 'flex_50', cat: 'hand', brand: 'Generic', model: '1/2" Flex Bender', size: '1/2" Flex', ded: 3, gain: 2.0, color: '#00897B', notes: 'For flexible conduit. Easier bends.' },
        { id: 'flex_75', cat: 'hand', brand: 'Generic', model: '3/4" Flex Bender', size: '3/4" Flex', ded: 4, gain: 2.5, color: '#00897B', notes: 'Smaller deduct than EMT.' },
    ],
};

// --- MASTER LIBRARY (Flattened for easy access) ---
const benderLibrary = [
    ...benderDatabase.greenlee,
    ...benderDatabase.ideal,
    ...benderDatabase.gardner,
    ...benderDatabase.milwaukee,
    ...benderDatabase.klein,
    ...benderDatabase.ridgid,
    ...benderDatabase.vernon,
    ...benderDatabase.generic,
    ...benderDatabase.channel,
    ...benderDatabase.southwire,
    ...benderDatabase.cres,
    ...benderDatabase.pvc,
    ...benderDatabase.flex,
];

/* --- NEC DATA (Areas in sq in) --- */
const necData = {
    wires: {
        'THHN': { '14':0.0097, '12':0.0133, '10':0.0211, '8':0.0366, '6':0.0507, '4':0.0824, '3':0.0973, '2':0.1158, '1':0.1562, '1/0':0.1855, '2/0':0.2223, '3/0':0.2679, '4/0':0.3237, '250':0.3970, '300':0.4608, '350':0.5242, '400':0.5863, '500':0.7073 },
        'XHHW': { '14':0.0139, '12':0.0181, '10':0.0243, '8':0.0437, '6':0.0590, '4':0.0925, '3':0.1087, '2':0.1288, '1':0.1766, '1/0':0.2075, '2/0':0.2475, '3/0':0.2967, '4/0':0.3578, '250':0.4371, '300':0.5067, '350':0.5752, '400':0.6423, '500':0.7725 },
        'THWN': { '14':0.0097, '12':0.0133, '10':0.0211, '8':0.0366, '6':0.0507, '4':0.0824, '3':0.0973, '2':0.1158, '1':0.1562, '1/0':0.1855, '2/0':0.2223, '3/0':0.2679, '4/0':0.3237 },
        'XHHW-2': { '14':0.0139, '12':0.0181, '10':0.0243, '8':0.0437, '6':0.0590, '4':0.0925, '3':0.1087, '2':0.1288, '1':0.1766, '1/0':0.2075, '2/0':0.2475, '3/0':0.2967, '4/0':0.3578 }
    },
    conduit: {
        'EMT': { '1/2':0.304, '3/4':0.533, '1':0.864, '1 1/4':1.496, '1 1/2':2.036, '2':3.356, '2 1/2':5.858, '3':8.846, '3 1/2':11.529, '4':14.753 },
        'Rigid': { '1/2':0.314, '3/4':0.549, '1':0.887, '1 1/4':1.526, '1 1/2':2.071, '2':3.408, '2 1/2':5.858, '3':8.936, '3 1/2':11.638, '4':14.909 },
        'PVC40': { '1/2':0.286, '3/4':0.512, '1':0.838, '1 1/4':1.456, '1 1/2':1.976, '2':3.269, '2 1/2':5.672, '3':8.659, '3 1/2':11.294, '4':14.455 },
        'Flex': { '1/2':0.216, '3/4':0.369, '1':0.599, '1 1/4':1.039, '1 1/2':1.414, '2':2.343 }
    }
};

/* --- CONSTANTS & ANGLES (Trigonometric Bend Table) --- */
const bendTable = {
    5:  { m: 11.474, s: 0.044, c: 11.473 },      // csc(5°) 
    10: { m: 5.759, s: 0.063, c: 5.759 },       // csc(10°) 
    15: { m: 3.864, s: 0.125, c: 3.864 },       // csc(15°) 
    22.5: { m: 2.613, s: 0.188, c: 2.613 },     // csc(22.5°) 
    30: { m: 2.0, s: 0.250, c: 2.0 },           // csc(30°) 
    45: { m: 1.414, s: 0.375, c: 1.414 },       // csc(45°) = √2
    60: { m: 1.155, s: 0.500, c: 1.155 }        // csc(60°) = 2/√3
};
