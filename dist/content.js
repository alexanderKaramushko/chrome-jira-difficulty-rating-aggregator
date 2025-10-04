function toHex(color) {
    if (color.startsWith('rgb')) {
        const [, red, green, blue] = color.match(/rgb\((\d+),\s(\d+),\s(\d+)\)/) ?? [];
        const arr = new Uint8Array([+red, +green, +blue]);
        return `#${arr.toHex()}`;
    }
    return color;
}
const RED = '#ff0000';
const ORANGE = '#ff9900';
const GREEN = '#008000';
const checklist = document.querySelector('#main ul.inline-task-list');
const map = new Map();
Array.from(checklist.querySelectorAll('li > span')).forEach((item) => {
    const color = window.getComputedStyle(item).color;
    const hexColor = toHex(color);
    if (!map.get(item)) {
        map.set(item, hexColor);
    }
});
function getLevels() {
    return Array.from(checklist.querySelectorAll('li > span'))
        .filter((item) => item.closest('li').classList.contains('checked'))
        .reduce((levels, item) => {
        const color = window.getComputedStyle(item).color;
        const hexColor = toHex(color);
        // Возможно нужна проверка на все 16-ричные вхождения цвета
        if (hexColor === RED || map.get(item) === RED) {
            levels.hard += 1;
        }
        // Возможно нужна проверка на все 16-ричные вхождения цвета
        if (hexColor === ORANGE || map.get(item) === ORANGE) {
            levels.medium += 1;
        }
        // Возможно нужна проверка на все 16-ричные вхождения цвета
        if (hexColor === GREEN || map.get(item) === GREEN) {
            levels.light += 1;
        }
        return levels;
    }, {
        hard: 0,
        medium: 0,
        light: 0,
    });
}
checklist.onclick = (event) => {
    const element = event.target;
    if (element.closest('li')) {
        if (chrome.runtime?.id) {
            setTimeout(() => {
                console.log(getLevels());
                chrome.runtime.sendMessage({
                    type: 'aggregated',
                    payload: {
                        levels: getLevels(),
                    }
                });
            }, 0);
        }
    }
};
chrome.runtime.sendMessage({
    type: 'aggregated',
    payload: {
        levels: getLevels(),
    }
});
