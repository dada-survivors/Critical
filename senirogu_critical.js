javascript:(function() {
    'use strict';

    let checkboxIds = [];
    let radioIds = [];
    let dropdownIds = [];
    let textboxIds = [];

    const fetchJSON = async (url) => {
        const response = await fetch(url);
        if (response.ok) {
            const json = await response.json();
            console.log('JSONが正常に読み込まれました。', json);
            return json;
        }
        console.error('Error fetching JSON:', response.status);
        return null;
    };

    const save = (key) => {
        const saveState = (ids, type) => {
            const state = ids.reduce((acc, id) => {
                const element = document.getElementById(id);
                if (element) acc[id] = type === 'checkbox' ? element.checked : element.value;
                return acc;
            }, {});
            localStorage.setItem(`${type}States_${key}`, JSON.stringify(state));
            console.log(`保存しました: ${type}States_${key}`, state);
        };

        saveState(checkboxIds, 'checkbox');
        saveState(radioIds, 'radio');
        saveState(dropdownIds, 'dropdown');
        saveState(textboxIds, 'textbox');
    };

    const load = async (key) => {
        const loadState = (ids, type) => {
            const state = JSON.parse(localStorage.getItem(`${type}States_${key}`));
            if (state) {
                ids.forEach(id => {
                    const element = document.getElementById(id);
                    if (element && state.hasOwnProperty(id)) {
                        if (type === 'checkbox' || type === 'radio') {
                            element.checked = state[id];
                        } else {
                            element.value = state[id];
                        }
                    }
                });
                console.log(`${type}の状態を復元しました: ${key}`, state);
            } else {
                console.log(`保存された${type}の状態がありません: ${key}`);
            }
        };

        loadState(checkboxIds, 'checkbox');
        loadState(radioIds, 'radio');
        loadState(dropdownIds, 'dropdown');
        loadState(textboxIds, 'textbox');
    };

    const clearSavedData = () => {
        ['checkbox', 'radio', 'dropdown', 'textbox'].forEach(type => {
            localStorage.removeItem(`${type}States_key1`);
            localStorage.removeItem(`${type}States_key2`);
            console.log(`削除しました: ${type}States_key1 と ${type}States_key2`);
        });
        console.log('保存データをクリアしました！');
    };

    const initialize = async () => {
        const loadIds = async (url, type) => {
            const json = await fetchJSON(url);
            if (json && Array.isArray(json.ids)) {
                switch (type) {
                    case 'checkbox': checkboxIds = json.ids; break;
                    case 'radio': radioIds = json.ids; break;
                    case 'dropdown': dropdownIds = json.ids; break;
                    case 'textbox': textboxIds = json.ids; break;
                }
                console.log(`Loaded ${type} IDs:`, json.ids);
            }
        };

        await loadIds('https://cdn.jsdelivr.net/gh/dada-survivors/Critical/checkbox.json', 'checkbox');
        await loadIds('https://cdn.jsdelivr.net/gh/dada-survivors/Critical/radiobottom.json', 'radio');
        await loadIds('https://cdn.jsdelivr.net/gh/dada-survivors/Critical/pulldown.json', 'dropdown');
        await loadIds('https://cdn.jsdelivr.net/gh/dada-survivors/Critical/textbox.json', 'textbox');

        const dialog = document.createElement('div');
        dialog.innerHTML = `
            <div style="position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); background: white; padding: 20px; box-shadow: 0 0 10px rgba(0,0,0,0.5); z-index: 1000;">
                <div style="display: flex; justify-content: flex-end;">
                    <button id="closeButton" style="background: none; border: none; font-size: 20px; cursor: pointer;">&times;</button>
                </div>
                <p style="text-align: center;">クリティカル%の状態を</p>
                <div style="display: flex; flex-direction: column; align-items: center;">
                    <div style="display: flex; justify-content: space-between; width: 100%;">
                        <button id="saveButton1" style="width: 150px;">保存1</button>
                        <button id="saveButton2" style="width: 150px;">保存2</button>
                    </div>
                    <div style="display: flex; justify-content: space-between; width: 100%; margin-top: 10px;">
                        <button id="loadButton1" style="width: 150px;">読込み1</button>
                        <button id="loadButton2" style="width: 150px;">読込み2</button>
                    </div>
                    <div style="margin-top: 10px;">
                        <button id="closeDialogButton" style="width: 150px;">閉じる</button>
                    </div>
                    <div style="margin-top: 20px;">
                        <p style="text-align: center;">保存情報が壊れた場合</p>
                    </div>
                    <div style="margin-top: 10px;">
                        <button id="clearCacheButton" style="width: 150px;">保存データをクリア</button>
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(dialog);

        document.getElementById('saveButton1').addEventListener('click', () => {
            save('key1');
            document.body.removeChild(dialog);
        });

        document.getElementById('loadButton1').addEventListener('click', () => {
            load('key1');
            document.body.removeChild(dialog);
        });

        document.getElementById('saveButton2').addEventListener('click', () => {
            save('key2');
            document.body.removeChild(dialog);
        });

        document.getElementById('loadButton2').addEventListener('click', () => {
            load('key2');
            document.body.removeChild(dialog);
        });

        document.getElementById('clearCacheButton').addEventListener('click', () => {
            clearSavedData();
            document.body.removeChild(dialog);
        });

        document.getElementById('closeButton').addEventListener('click', () => {
            document.body.removeChild(dialog);
        });
        document.getElementById('closeDialogButton').addEventListener('click', () => {
            document.body.removeChild(dialog);
        });
    };

    initialize();
})();
