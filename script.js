const tahta = document.getElementById("game-board");
const durum = document.getElementById("status");
const resetBtn = document.getElementById("reset");
const zorluk_sec = document.getElementById("difficulty");

let suankiSira = "X";
let oyunTahtasi = Array(3).fill(null).map(() => Array(3).fill(null));
let oyunBitti = false;

function tahtaOlustur() {
    tahta.innerHTML = "";
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            const hucre = document.createElement("div");
            hucre.classList.add("cell");
            hucre.dataset.row = i;
            hucre.dataset.col = j;
            hucre.addEventListener("click", hucreyeTikla);
            tahta.appendChild(hucre);
        }
    }
}
function rastgeleHamle() {
    const bosHucres = [];
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            if (!oyunTahtasi[i][j]) {
                bosHucres.push({ satir: i, sutun: j });
            }
        }
    }
    return bosHucres[Math.floor(Math.random() * bosHucres.length)];
}
function enIyiHamle() {
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            if (!oyunTahtasi[i][j]) {
                oyunTahtasi[i][j] = suankiSira;
                if (is_win(oyunTahtasi)) {
                    oyunTahtasi[i][j] = null;
                    return { satir: i, sutun: j };
                }
                oyunTahtasi[i][j] = null;
            }
        }
    }
    const rakip = suankiSira === "X" ? "O" : "X";
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            if (!oyunTahtasi[i][j]) {
                oyunTahtasi[i][j] = rakip;
                if (is_win(oyunTahtasi)) {
                    oyunTahtasi[i][j] = null;
                    return { satir: i, sutun: j };
                }
                oyunTahtasi[i][j] = null;
            }
        }
    }

    return rastgeleHamle();
}
function minimax(tahta, derinlik, enBüyük) {
    const kazanan = is_win(tahta);
    if (kazanan === "X") return -10;
    if (kazanan === "O") return 10;
    if (tahtaDoluMu(tahta)) return 0;

    if (enBüyük) {
        let enIyi = -Infinity;
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                if (!tahta[i][j]) {
                    tahta[i][j] = "O";
                    const skor = minimax(tahta, derinlik + 1, false);
                    tahta[i][j] = null;
                    enIyi = Math.max(skor, enIyi);
                }
            }
        }
        return enIyi;
    } else {
        let enIyi = Infinity;
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                if (!tahta[i][j]) {
                    tahta[i][j] = "X";
                    const skor = minimax(tahta, derinlik + 1, true);
                    tahta[i][j] = null;
                    enIyi = Math.min(skor, enIyi);
                }
            }
        }
        return enIyi;
    }
}

function enIyiHamleMinimax() {
    let best_Skor = -Infinity;
    let hamle;
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            if (!oyunTahtasi[i][j]) {
                oyunTahtasi[i][j] = "O";
                const skor = minimax(oyunTahtasi, 0, false);
                oyunTahtasi[i][j] = null;
                if (skor > best_Skor) {
                    best_Skor = skor;
                    hamle = { satir: i, sutun: j };
                }
            }
        }
    }
    return hamle;
}

function is_win(tahta) {
    const satirlar = [
        [{ r: 0, c: 0 }, { r: 0, c: 1 }, { r: 0, c: 2 }],
        [{ r: 1, c: 0 }, { r: 1, c: 1 }, { r: 1, c: 2 }],
        [{ r: 2, c: 0 }, { r: 2, c: 1 }, { r: 2, c: 2 }],
        [{ r: 0, c: 0 }, { r: 1, c: 0 }, { r: 2, c: 0 }],
        [{ r: 0, c: 1 }, { r: 1, c: 1 }, { r: 2, c: 1 }],
        [{ r: 0, c: 2 }, { r: 1, c: 2 }, { r: 2, c: 2 }],
        [{ r: 0, c: 0 }, { r: 1, c: 1 }, { r: 2, c: 2 }],
        [{ r: 0, c: 2 }, { r: 1, c: 1 }, { r: 2, c: 0 }],
    ];

    for (const satir of satirlar) {
        const [a, b, c] = satir;
        if (
            tahta[a.r][a.c] &&
            tahta[a.r][a.c] === tahta[b.r][b.c] &&
            tahta[a.r][a.c] === tahta[c.r][c.c]
        ) {
            return tahta[a.r][a.c];
        }
    }

    return null;
}

function tahtaDoluMu(tahta) {
    return tahta.flat().every(hucres => hucres);
}
function hucreyeTikla(e) {
    if (oyunBitti || suankiSira !== "X") return;

    const hucre = e.target;
    const satir = hucre.dataset.row;
    const sutun = hucre.dataset.col;

    if (oyunTahtasi[satir][sutun]) return;

    oyunTahtasi[satir][sutun] = suankiSira;
    hucre.textContent = suankiSira;
    hucre.classList.add("taken");

    const kazanan = is_win(oyunTahtasi);
    if (kazanan) {
        durum.textContent = `Kazanan: ${kazanan}`;
        oyunBitti = true;
    } else if (tahtaDoluMu(oyunTahtasi)) {
        durum.textContent = "Beraberlik!";
        oyunBitti = true;
    } else {
        suankiSira = "O";
        durum.textContent = `Sıra: ${suankiSira}`;
        setTimeout(aiMove,500);
    }
}

function aiMove() {
    if (oyunBitti) return;

    const hamle = choose_aiMove();
    if (hamle) {
        oyunTahtasi[hamle.satir][hamle.sutun] = suankiSira;
        const hucre = document.querySelector(
            `.cell[data-row='${hamle.satir}'][data-col='${hamle.sutun}']`
        );
        hucre.textContent = suankiSira;
        hucre.classList.add("taken");

        const kazanan = is_win(oyunTahtasi);
        if (kazanan) {
            durum.textContent = `Kazanan: ${kazanan}`;
            oyunBitti = true;
        } else if (tahtaDoluMu(oyunTahtasi)) {
            durum.textContent = "Beraberlik!";
            oyunBitti = true;
        } else {
            suankiSira = "X";
            durum.textContent = `Sıra: ${suankiSira}`;
        }
    }
}
resetBtn.addEventListener("click", () => {
    suankiSira = "X";
    oyunTahtasi = Array(3).fill(null).map(() => Array(3).fill(null));
    oyunBitti = false;
    durum.textContent = `Sıra: ${suankiSira}`;
    tahtaOlustur();
});
function choose_aiMove() {
    const zorluk = zorluk_sec.value;
    if (zorluk === "easy") return rastgeleHamle();
    if (zorluk === "medium") return enIyiHamle();
    if (zorluk === "hard") return enIyiHamleMinimax();
}

tahtaOlustur();
