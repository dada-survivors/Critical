javascript:(function() {
    'use strict';

    let cIds = [], rIds = [], dIds = [], tIds = [];

    const fJSON = async (url) => {
        try {
            const res = await fetch(url);
            if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
            return await res.json();
        } catch (e) {
            return null;
        }
    };

    const save = (key) => {
        try {
            const cState = cIds.reduce((acc, id) => {
                const c = document.getElementById(id);
                if (c) acc[id] = c.checked;
                return acc;
            }, {});
            localStorage.setItem(`${key}_cStates`, JSON.stringify(cState));

            const rState = rIds.reduce((acc, id) => {
                const r = document.getElementById(id);
                if (r && r.checked) acc[id] = true;
                return acc;
            }, {});
            localStorage.setItem(`${key}_rStates`, JSON.stringify(rState));

            const dState = dIds.reduce((acc, id) => {
                const d = document.getElementById(id);
                if (d) acc[id] = d.value;
                return acc;
            }, {});
            localStorage.setItem(`${key}_dStates`, JSON.stringify(dState));

            const tState = tIds.reduce((acc, id) => {
                const t = document.getElementById(id);
                if (t) acc[id] = t.value;
                return acc;
            }, {});
            localStorage.setItem(`${key}_tStates`, JSON.stringify(tState));
        } catch (e) {}
    };

    const load = async (key) => {
        try {
            const cState = JSON.parse(localStorage.getItem(`${key}_cStates`));
            const rState = JSON.parse(localStorage.getItem(`${key}_rStates`));
            const dState = JSON.parse(localStorage.getItem(`${key}_dStates`));
            const tState = JSON.parse(localStorage.getItem(`${key}_tStates`));

            if (!cState && !rState && !dState && !tState) {
                alert('保存情報がありません');
                return;
            }

            if (cState) cIds.forEach(id => {
                const c = document.getElementById(id);
                if (c && cState.hasOwnProperty(id)) c.checked = cState[id];
            });

            if (rState) rIds.forEach(id => {
                const r = document.getElementById(id);
                if (r && rState.hasOwnProperty(id)) r.checked = rState[id];
            });

            if (dState) dIds.forEach(id => {
                const d = document.getElementById(id);
                if (d && dState.hasOwnProperty(id)) d.value = dState[id];
            });

            if (tState) tIds.forEach(id => {
                const t = document.getElementById(id);
                if (t && tState.hasOwnProperty(id)) t.value = tState[id];
            });
        } catch (e) {}
    };

    const clear = (key) => {
        try {
            localStorage.removeItem(`${key}_cStates`);
            localStorage.removeItem(`${key}_rStates`);
            localStorage.removeItem(`${key}_dStates`);
            localStorage.removeItem(`${key}_tStates`);
        } catch (e) {}
    };

    const init = async () => {
        try {
            const cJson = await fJSON('https://raw.githubusercontent.com/cho-gachizei/my-scripts/main/json1.json');
            if (!cJson || !Array.isArray(cJson.ids)) throw new Error('Failed to load checkbox IDs');
            cIds = cJson.ids;

            const rJson = await fJSON('https://raw.githubusercontent.com/cho-gachizei/my-scripts/main/json2.json');
            if (!rJson || !Array.isArray(rJson.ids)) throw new Error('Failed to load radio IDs');
            rIds = rJson.ids;

            const dJson = await fJSON('https://raw.githubusercontent.com/cho-gachizei/my-scripts/main/json3.json');
            if (!dJson || !Array.isArray(dJson.ids)) throw new Error('Failed to load dropdown IDs');
            dIds = dJson.ids;

            const tJson = await fJSON('https://raw.githubusercontent.com/cho-gachizei/my-scripts/main/json4.json');
            if (!tJson || !Array.isArray(tJson.ids)) throw new Error('Failed to load textbox IDs');
            tIds = tJson.ids;

            const dlg = document.createElement('div');
            dlg.innerHTML = `
                <div style="position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); background: white; padding: 20px; box-shadow: 0 0 10px rgba(0,0,0,0.5); z-index: 1000;">
                    <p>自分のクリティカルをどうしますか？：</p>
                    <div style="display: flex; justify-content: space-between;">
                        <button id="sBtn1" style="flex: 1; margin: 2px;">保存1</button>
                        <button id="sBtn2" style="flex: 1; margin: 2px;">保存2</button>
                    </div>
                    <div style="display: flex; justify-content: space-between;">
                        <button id="lBtn1" style="flex: 1; margin: 2px;">読み込み1</button>
                        <button id="lBtn2" style="flex: 1; margin: 2px;">読み込み2</button>
                    </div>
                    <div style="display: flex; justify-content: space-between;">
                        <button id="clrBtn1" style="flex: 1; margin: 2px;">削除1</button>
                        <button id="clrBtn2" style="flex: 1; margin: 2px;">削除2</button>
                    </div>
                    <div style="display: flex; justify-content: center;">
                        <button id="cBtn" style="flex: 1; margin: 2px;">閉じる</button>
                    </div>
                </div>
            `;
            document.body.appendChild(dlg);

            document.getElementById('sBtn1').addEventListener('click', () => {
                save('保存1');
                document.body.removeChild(dlg);
            });

            document.getElementById('sBtn2').addEventListener('click', () => {
                save('保存2');
                document.body.removeChild(dlg);
            });

            document.getElementById('lBtn1').addEventListener('click', () => {
                load('保存1');
                document.body.removeChild(dlg);
            });

            document.getElementById('lBtn2').addEventListener('click', () => {
                load('保存2');
                document.body.removeChild(dlg);
            });

            document.getElementById('clrBtn1').addEventListener('click', () => {
                clear('保存1');
                document.body.removeChild(dlg);
            });

            document.getElementById('clrBtn2').addEventListener('click', () => {
                clear('保存2');
                document.body.removeChild(dlg);
            });

            document.getElementById('cBtn').addEventListener('click', () => {
                document.body.removeChild(dlg);
            });
        } catch (e) {}
    };

    init();
})();
