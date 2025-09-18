const festius = [
    {data: "24/9/2025", motiu: "Mare de Déu de la Mercè"},
    {data: "10/10/2025", motiu: "1r dia de lliure disposició"},
    {data: "3/11/2025", motiu: "2n día de lliure disposició"},
    {data: "8/12/2025", motiu: "La inmaculada"},
    {data: "22/12/2025", motiu: "Vacandes de Nadal"},
    {data: "23/12/2025", motiu: "Vacandes de Nadal"},
    {data: "24/12/2025", motiu: "Vacandes de Nadal"},
    {data: "25/12/2025", motiu: "Vacandes de Nadal"},
    {data: "26/12/2025", motiu: "Vacandes de Nadal"},
    {data: "27/12/2025", motiu: "Vacandes de Nadal"},
    {data: "28/12/2025", motiu: "Vacandes de Nadal"},
    {data: "29/12/2025", motiu: "Vacandes de Nadal"},
    {data: "30/12/2025", motiu: "Vacandes de Nadal"},
    {data: "31/12/2025", motiu: "Vacandes de Nadal"},
    {data: "1/1/2026", motiu: "Vacandes de Nadal"},
    {data: "2/1/2026", motiu: "Vacandes de Nadal"},
    {data: "5/1/2026", motiu: "Vacandes de Nadal"},
    {data: "6/1/2026", motiu: "Vacandes de Nadal"},
    {data: "7/1/2026", motiu: "Vacandes de Nadal"},
    {data: "16/2/2026", motiu: "3r dia de lliure disposició"},
    {data: "30/3/2026", motiu: "Vacances de Setmana Santa"},
    {data: "31/3/2026", motiu: "Vacances de Setmana Santa"},
    {data: "1/4/2026", motiu: "Vacances de Setmana Santa"},
    {data: "2/4/2026", motiu: "Vacances de Setmana Santa"},
    {data: "3/4/2026", motiu: "Vacances de Setmana Santa"},
    {data: "6/4/2026", motiu: "Vacances de Setmana Santa"},
    {data: "1/5/2026", motiu: "Festa del treball"},
    {data: "4/5/2026", motiu: "4t dia de lliure disposició"},
]

const nomMesos = [
    "GENER", "FEBRER", "MARÇ", "ABRIL", "MAIG", "JUNY",
    "JULIOL", "AGOST", "SETEMBRE", "OCTUBRE", "NOVEMBRE", "DESEMBRE"
];

const nomDies = ["DL","DM","DC","DJ","DV"];

const dataInici = new Date("2025-09-15");
const dataFinal = new Date("2026-05-22");

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
    let comptadorSetmana = 1;
    let bloqueSetmana = 0;

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

        const capcaleraNumSetmana = document.createElement("div");
        capcaleraNumSetmana.className = "num-setmana";
        capcaleraNumSetmana.textContent = "Nº";
        diesGrid.appendChild(capcaleraNumSetmana);

        const diesEnMes = new Date(actual.getFullYear(), actual.getMonth() + 1, 0).getDate();
        let primerDiaCalculat = false;
        let avuiSeguent = false;
        let columnaSetmana = 0;
        const setmanesCompletats = [];

        for (let d = 1; d <= diesEnMes; d++) {
            if (actual.getFullYear() === inici.getFullYear() &&
                actual.getMonth() === inici.getMonth() &&
                d < inici.getDate()) {
                continue;
            }

            const aquestaFecha = new Date(actual.getFullYear(), actual.getMonth(), d);
            const dieSetmana = (aquestaFecha.getDay() + 6) % 7;

            if (dieSetmana < 5) {
                if (!primerDiaCalculat) {
                    for (let i = 0; i < dieSetmana; i++) {
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
                    diaDiv.setAttribute("data-actual", "Avui");
                }

                if (aquestaFecha > fi) {
                    break;
                }

                const diaStr = `${d}/${actual.getMonth()+1}/${actual.getFullYear()}`;
                const festiu = festius.find(f => f.data === diaStr);
                if (festiu) {
                    diaDiv.classList.add("festiu");
                    diaDiv.setAttribute("data-motiu", festiu.motiu);
                } else {
                    if (aquestaFecha < new Date(araEspanya.getFullYear(), araEspanya.getMonth(), araEspanya.getDate())) {
                        diaDiv.classList.add("completat");
                        diaDiv.setAttribute("data-completat", "Completat");
                    } else if (aquestaFecha.toDateString() === araEspanya.toDateString() && araEspanya.getHours() >= 21) {
                        diaDiv.classList.add("completat");
                        diaDiv.setAttribute("data-completat", "Completat");
                    }
                }

                if (diaDiv.classList.contains("avui") && diaDiv.classList.contains("completat")) {
                    diaDiv.classList.remove("avui");
                    diaDiv.removeAttribute("data-actual");
                    avuiSeguent = true;
                }
                if (avuiSeguent && !diaDiv.classList.contains("completat")) {
                    diaDiv.classList.add("avui");
                    diaDiv.setAttribute("data-actual", "Avui");
                    avuiSeguent = false;
                }

                diesGrid.appendChild(diaDiv);
                columnaSetmana++;
                bloqueSetmana++;
                
                if (columnaSetmana === 5 || d === diesEnMes) {
                    while (columnaSetmana < 5) {
                        const buida = document.createElement("div");
                        diesGrid.appendChild(buida);
                        columnaSetmana++;
                    }

                    const numSetmanaDiv = document.createElement("div");
                    
                    const dillunsSetmana = new Date(aquestaFecha);
                    dillunsSetmana.setDate(aquestaFecha.getDate() - dieSetmana);
                    
                    const divendresSetmana = new Date(dillunsSetmana);
                    divendresSetmana.setDate(dillunsSetmana.getDate() + 4);

                    let comptadorFestiu = 0;
                    for (let j = 0; j < 5; j++) {
                        const diaComplet = new Date(dillunsSetmana);
                        diaComplet.setDate(dillunsSetmana.getDate() + j);
                        
                        const diaCompletStr = `${diaComplet.getDate()}/${diaComplet.getMonth() + 1}/${diaComplet.getFullYear()}`;
                        if (festius.find(f => f.data === diaCompletStr)) {
                            comptadorFestiu++;
                        }
                    }
                    
                    if (comptadorFestiu === 5) {
                        numSetmanaDiv.textContent = "";
                    } else {
                        
                        if (bloqueSetmana >= 5 && comptadorSetmana <= 33) {
                            numSetmanaDiv.className = "setmana num";
                            numSetmanaDiv.textContent = comptadorSetmana;
                            numSetmanaDiv.setAttribute("data-setmana", `Setmana ${comptadorSetmana}`);
                            comptadorSetmana++;
                            bloqueSetmana = 0;
                        } else {
                            numSetmanaDiv.textContent = "";
                        }
                    }

                    let setmanaCompletada = false;
                    if (araEspanya.getDay() === 5 && araEspanya.getHours() >= 21) {
                        if (araEspanya >= dillunsSetmana && araEspanya <= divendresSetmana) {
                            setmanaCompletada = true;
                        }
                    }
                    setmanesCompletats.push(setmanaCompletada);

                    diesGrid.appendChild(numSetmanaDiv);
                    columnaSetmana = 0;
                }
            }
        }

        mesDiv.appendChild(diesGrid);

        const mesCompletat = document.createElement("div");
        mesCompletat.className = "mes-completat";
        if (setmanesCompletats.length > 0 && setmanesCompletats.every(s => s)) {
            mesCompletat.textContent = "Mes completat";
        } else {
            mesCompletat.textContent = "";
        }
        mesDiv.appendChild(mesCompletat);

        contenedor.appendChild(mesDiv);
        actual.setMonth(actual.getMonth() + 1);
    }
}

document.addEventListener("DOMContentLoaded", function() {
    generarCalendari(dataInici, dataFinal);
});