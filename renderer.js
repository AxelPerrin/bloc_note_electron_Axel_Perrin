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
        document.body.style.background = '#1e1e1e';
        document.body.style.color = '#ccc';
        document.getElementById('toolbar').style.background = '#2d2d2d';
        document.getElementById('toolbar').style.borderColor = '#444';
        editor.style.background = '#1e1e1e';
        editor.style.color = '#ddd';
        counter.style.color = '#888';
        themeBtn.textContent = 'Theme clair';
        document.querySelectorAll('#toolbar button').forEach(function(btn) {
            btn.style.background = '#3a3a3a';
            btn.style.color = '#ccc';
            btn.style.borderColor = '#555';
        });
    } else {
        document.body.style.background = '#f5f5f5';
        document.body.style.color = '#222';
        document.getElementById('toolbar').style.background = '#e0e0e0';
        document.getElementById('toolbar').style.borderColor = '#bbb';
        editor.style.background = '#fff';
        editor.style.color = '#222';
        counter.style.color = '#666';
        themeBtn.textContent = 'Theme sombre';
        document.querySelectorAll('#toolbar button').forEach(function(btn) {
            btn.style.background = '#d0d0d0';
            btn.style.color = '#222';
            btn.style.borderColor = '#aaa';
        });
    }
}

function toggleTheme() {
    var newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    applyTheme(newTheme);
    api.setTheme(newTheme);
}
