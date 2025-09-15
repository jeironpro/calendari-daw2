const festius = [
    "24/9/2025",
    "10/10/2025",
    "3/11/2025",
    "8/12/2025",
    "22/12/2025",
    "23/12/2025",
    "24/12/2025",
    "25/12/2025",
    "26/12/2025",
    "27/12/2025",
    "28/12/2025",
    "29/12/2025",
    "30/12/2025",
    "31/12/2025",
    "1/1/2026",
    "2/1/2026",
    "5/1/2026",
    "6/1/2026",
    "7/1/2026",
    "16/2/2026",
    "30/3/2026",
    "31/3/2026",
    "1/4/2026",
    "2/4/2026",
    "3/4/2026",
    "6/4/2026",
    "1/5/2026",
    "4/5/2026",
]

const nomMesos = [
    "GENER", "FEBRER", "MARÇ", "ABRIL", "MAIG", "JUNY",
    "JULIOL", "AGOST", "SETEMBRE", "OCTUBRE", "NOVEMBRE", "DESEMBRE"
];

const nomDies = ["DL","DM","DC","DJ","DV"];

const dataInici = new Date("2025-09-15");
const datafial = new Date("2026-05-22");

function generarCalendari(inici, fi) {
    const contenedor = document.getElementById("calendari");
    contenedor.innerHTML = ""; 

    let actual = new Date(inici.getFullYear(), inici.getMonth(), 1);

    const ara = new Date();
    const formatter = new Intl.DateTimeFormat("es-ES", {
        timeZone: "Europe/Madrid",
        year: "numeric",
        month: "numeric",
        day: "numeric",
        hour: "numeric",
        minute: "numeric",
        second: "numeric",
    });

    const partes = formatter.formatToParts(ara);

    let any = 0, mes = 0, dia = 0, hora = 0, minut = 0, segon = 0;
    partes.forEach(p => {
        switch(p.type) {
            case "year": any = parseInt(p.value); break;
            case "month": mes = parseInt(p.value) - 1; break;
            case "day": dia = parseInt(p.value); break;
            case "hour": hora = parseInt(p.value); break;
            case "minute": minut = parseInt(p.value); break;
            case "second": segon = parseInt(p.value); break;
        }
    });

    const araEspanya = new Date(any, mes, dia, hora, minut, segon);

    while (actual <= fi) {
        const mesDiv = document.createElement("div");
        mesDiv.className = "mes";

        const titol = document.createElement("h2");
        titol.textContent = `${nomMesos[actual.getMonth()]} ${actual.getFullYear()}`;
        mesDiv.appendChild(titol);

        const diesGrid = document.createElement("div");
        diesGrid.className = "dies";

        nomDies.forEach(d => {
            const dn = document.createElement("div");
            dn.className = "nom-dia";
            dn.textContent = d;
            diesGrid.appendChild(dn);
        });

        const tickHeader = document.createElement("div");
        tickHeader.className = "nom-dia";
        tickHeader.textContent = "✔";
        diesGrid.appendChild(tickHeader);

        const diesEnMes = new Date(actual.getFullYear(), actual.getMonth() + 1, 0).getDate();
        let primerDiaCalculat = false;
        let columnaSetmana = 0;
        const setmanesTicks = [];

        for (let d = 1; d <= diesEnMes; d++) {
            if (actual.getFullYear() === inici.getFullYear() &&
                actual.getMonth() === inici.getMonth() &&
                d < inici.getDate()) {
                continue;
            }

            const aquestaFecha = new Date(actual.getFullYear(), actual.getMonth(), d);
            const diesetmana = (aquestaFecha.getDay() + 6) % 7;

            if (diesetmana < 5) {
                if (!primerDiaCalculat) {
                    for (let i = 0; i < diesetmana; i++) {
                        const buida = document.createElement("div");
                        diesGrid.appendChild(buida);
                        columnaSetmana++;
                    }
                    primerDiaCalculat = true;
                }

                const diaDiv = document.createElement("div");
                diaDiv.className = "dia";
                diaDiv.textContent = d;

                if (aquestaFecha.toDateString() === araEspanya.toDateString()) { 
                    diaDiv.classList.add("avui"); 
                }

                if (aquestaFecha > fi) { 
                    break; 
                }

                const diaStr = `${d}/${actual.getMonth()+1}/${actual.getFullYear()}`;
                if (festius.includes(diaStr)) {
                    diaDiv.classList.add("festiu");
                } else {
                    if (araEspanya >= aquestaFecha && araEspanya.getHours() >= 21) {
                        diaDiv.classList.add("completat");
                    }
                }

                diesGrid.appendChild(diaDiv);
                columnaSetmana++;

                if (columnaSetmana === 5 || d === diesEnMes) {
                    while (columnaSetmana < 5) {
                        const buida = document.createElement("div");
                        diesGrid.appendChild(buida);
                        columnaSetmana++;
                    }

                    const tickDiv = document.createElement("div");

                    const dillunsSetmana = new Date(aquestaFecha);
                    dillunsSetmana.setDate(aquestaFecha.getDate() - diesetmana);

                    const divendresSetmana = new Date(dillunsSetmana);
                    divendresSetmana.setDate(dillunsSetmana.getDate() + 4);

                    let setmanaCompletada = false;

                    if (araEspanya.getDay() === 5 && araEspanya.getHours() >= 21) {
                        if (araEspanya >= dillunsSetmana && araEspanya <= divendresSetmana) {
                            tickDiv.className = "dia tick";
                            tickDiv.textContent = "✓";
                            setmanaCompletada = true;
                        }
                    }

                    setmanesTicks.push(setmanaCompletada);
                    diesGrid.appendChild(tickDiv);
                    columnaSetmana = 0;
                }
            }
        }

        mesDiv.appendChild(diesGrid);

        const mesTickDiv = document.createElement("div");
        mesTickDiv.className = "mes-completat";
        if (setmanesTicks.length > 0 && setmanesTicks.every(s => s)) {
            mesTickDiv.textContent = "Mes completat";
        } else {
            mesTickDiv.textContent = "";
        }
        mesDiv.appendChild(mesTickDiv);

        contenedor.appendChild(mesDiv);
        actual.setMonth(actual.getMonth() + 1);
    }
}

document.addEventListener("DOMContentLoaded", function() {
    generarCalendari(dataInici, datafial);
})