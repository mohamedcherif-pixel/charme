const fs = require('fs');

const themes = {
    'aventus': { file: 'css/aventus-profile.css', class: '.aventus-section', color1: '#1C3D5A', color2: '#2A5A85', rgb1: '28, 61, 90', rgb2: '42, 90, 133' },
    'baccaratrouge': { file: 'css/baccaratrouge-profile.css', class: '.baccarat-section', color1: '#722F37', color2: '#B76E79', rgb1: '114, 47, 55', rgb2: '183, 110, 121' },
    'bleudechanel': { file: 'css/bleudechanel-profile.css', class: '.bleu-section', color1: '#7BA3CC', color2: '#4A90D9', rgb1: '123, 163, 204', rgb2: '74, 144, 217' },
    'lanuit': { file: 'css/lanuit-profile.css', class: '.lanuit-section', color1: '#b8a0e0', color2: '#9B7FD4', rgb1: '184, 160, 224', rgb2: '155, 127, 212' },
    'lostcherry': { file: 'css/lostcherry-profile.css', class: '.lostcherry-section', color1: '#e8a0aa', color2: '#C94C5D', rgb1: '232, 160, 170', rgb2: '201, 76, 93' },
    'oudwood': { file: 'css/oudwood-profile.css', class: '.oudwood-section', color1: '#9BAA82', color2: '#7D8B6A', rgb1: '155, 170, 130', rgb2: '125, 139, 106' },
    'sauvage': { file: 'css/sauvage-profile.css', class: '.sauvage-section', color1: '#2f3e50', color2: '#647b95', rgb1: '47, 62, 80', rgb2: '100, 123, 149' },
    'tobaccovanille': { file: 'css/tobaccovanille-profile.css', class: '.tobacco-section', color1: '#D4A574', color2: '#B88655', rgb1: '212, 165, 116', rgb2: '184, 134, 85' },
    'blackorchid': { file: 'css/blackorchid-profile.css', class: '.blackorchid-section', color1: '#D4AF37', color2: '#AA8C2C', rgb1: '212, 175, 55', rgb2: '170, 140, 44' },
    'greenly': { file: 'css/greenly-profile.css', class: '.greenly-section', color1: '#155724', color2: '#28a745', rgb1: '21, 87, 36', rgb2: '40, 167, 69' },
    'haltane': { file: 'styles.css', class: '.haltane-section-container', color1: '#4A3B32', color2: '#6B5B4E', rgb1: '74, 59, 50', rgb2: '107, 91, 78' },
    'pegasus': { file: 'styles.css', class: '.pegasus-section', color1: '#8B0000', color2: '#A52A2A', rgb1: '139, 0, 0', rgb2: '165, 42, 42' }
};

for (const [name, theme] of Object.entries(themes)) {
    const css = `

/* Unselected State Theme Overrides */
${theme.class} .quality-badge {
    border-color: rgba(${theme.rgb1}, 0.15) !important;
    background: rgba(${theme.rgb1}, 0.02) !important;
}

${theme.class} .quality-option[data-quality="top"] .quality-badge {
    border-color: rgba(${theme.rgb2}, 0.15) !important;
    background: rgba(${theme.rgb2}, 0.02) !important;
}

${theme.class} .quality-ornament {
    border-color: rgba(${theme.rgb1}, 0.3) !important;
}

${theme.class} .quality-option[data-quality="top"] .quality-ornament {
    border-color: rgba(${theme.rgb2}, 0.3) !important;
}
`;
    fs.appendFileSync(theme.file, css);
    console.log('Updated ' + theme.file);
}
