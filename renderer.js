var currentTheme = 'dark';

var editor = document.getElementById('editor');
var counter = document.getElementById('counter');
var themeBtn = document.getElementById('themeBtn');

editor.addEventListener('input', function() {
    counter.textContent = editor.value.length + ' caracteres';
    api.contentChanged();
});

api.onSetContent(function(content) {
    editor.value = content;
    counter.textContent = editor.value.length + ' caracteres';
});

api.onSetTheme(function(theme) {
    applyTheme(theme);
});

function applyTheme(theme) {
    currentTheme = theme;
    if (theme === 'dark') {
        document.body.style.background = '#1a1a2e';
        document.body.style.color = '#ccc';
        document.getElementById('toolbar').style.background = '#252530';
        document.getElementById('toolbar').style.borderBottom = '2px solid #4ec9b0';
        editor.style.background = '#1a1a2e';
        editor.style.color = '#e0e0e0';
        editor.style.borderLeft = '3px solid #4ec9b0';
        counter.style.color = '#4ec9b0';
        themeBtn.textContent = 'Theme clair';
        var buttons = document.querySelectorAll('#toolbar button');
        buttons[0].style.background = '#2a4a44';
        buttons[0].style.color = '#4ec9b0';
        buttons[0].style.borderColor = '#4ec9b0';
        buttons[1].style.background = '#4ec9b0';
        buttons[1].style.color = '#1a1a2e';
        buttons[1].style.borderColor = '#4ec9b0';
        buttons[2].style.background = '#2a4a44';
        buttons[2].style.color = '#4ec9b0';
        buttons[2].style.borderColor = '#4ec9b0';
    } else {
        document.body.style.background = '#f0f4f8';
        document.body.style.color = '#2d3748';
        document.getElementById('toolbar').style.background = '#fff';
        document.getElementById('toolbar').style.borderBottom = '2px solid #e67e22';
        editor.style.background = '#ffffff';
        editor.style.color = '#2d3748';
        editor.style.borderLeft = '3px solid #e67e22';
        counter.style.color = '#e67e22';
        themeBtn.textContent = 'Theme sombre';
        var buttons = document.querySelectorAll('#toolbar button');
        buttons[0].style.background = '#fdf2e9';
        buttons[0].style.color = '#d35400';
        buttons[0].style.borderColor = '#e67e22';
        buttons[1].style.background = '#e67e22';
        buttons[1].style.color = '#fff';
        buttons[1].style.borderColor = '#e67e22';
        buttons[2].style.background = '#fdf2e9';
        buttons[2].style.color = '#d35400';
        buttons[2].style.borderColor = '#e67e22';
    }
}

function toggleTheme() {
    var newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    applyTheme(newTheme);
    api.setTheme(newTheme);
}
