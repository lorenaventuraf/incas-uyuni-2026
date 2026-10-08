/* Expedição Incas & Uyuni 2026 — dados da rota
   Coordenadas: centro aproximado de cada localidade (não é a posição exata do posto).
   km = distância acumulada estimada no dia. c = confiança: C certo, P provável, S suposição.
   t = tipo: start (saída), fuel (abastecer), border (fronteira), stop (referência), end (pernoite). */
window.TRIP = {
 "title": "Incas & Uyuni 2026",
 "start": "2026-10-15",
 "autonomy": {
  "rule": 200,
  "limit": 250,
  "note": "Regra do grupo: abastecer a cada ~200 km, limite 250 km."
 },
 "days": [
  {
   "d": 1,
   "date": "2026-10-15",
   "from": "Governador Valadares",
   "to": "Uberlândia",
   "km": 847,
   "profile": "long",
   "depart": "05:00",
   "arrive": "18:00",
   "cc": "BR",
   "note": "Primeiro dia. Ritmo constante — não compensar atraso com velocidade.",
   "stops": [
    {
     "n": "Governador Valadares",
     "lat": -18.8511,
     "lng": -41.9495,
     "km": 0,
     "t": "start",
     "cc": "BR"
    },
    {
     "n": "Itabira",
     "lat": -19.619,
     "lng": -43.2269,
     "km": 175,
     "t": "fuel",
     "c": "C",
     "cc": "BR"
    },
    {
     "n": "Belo Horizonte (Anel)",
     "lat": -19.9167,
     "lng": -43.9345,
     "km": 270,
     "t": "fuel",
     "c": "C",
     "cc": "BR"
    },
    {
     "n": "Bom Despacho",
     "lat": -19.736,
     "lng": -45.2525,
     "km": 420,
     "t": "fuel",
     "c": "C",
     "cc": "BR",
     "note": "Ponto extra — o roadbook pulava de BH (324) para Araxá (600): 276 km."
    },
    {
     "n": "Araxá",
     "lat": -19.5902,
     "lng": -46.9438,
     "km": 620,
     "t": "fuel",
     "c": "C",
     "cc": "BR"
    },
    {
     "n": "Uberaba",
     "lat": -19.7472,
     "lng": -47.9381,
     "km": 735,
     "t": "fuel",
     "c": "C",
     "cc": "BR"
    },
    {
     "n": "Uberlândia",
     "lat": -18.9186,
     "lng": -48.2772,
     "km": 847,
     "t": "end",
     "cc": "BR"
    }
   ]
  },
  {
   "d": 2,
   "date": "2026-10-16",
   "from": "Uberlândia",
   "to": "Rondonópolis",
   "km": 822,
   "profile": "long",
   "depart": "05:00",
   "arrive": "18:00",
   "cc": "BR",
   "note": "Fadiga acumulada do dia anterior. Reforçar checagem de pneus, freios e bagagem.",
   "stops": [
    {
     "n": "Uberlândia",
     "lat": -18.9186,
     "lng": -48.2772,
     "km": 0,
     "t": "start",
     "cc": "BR"
    },
    {
     "n": "Itumbiara",
     "lat": -18.4192,
     "lng": -49.2151,
     "km": 125,
     "t": "fuel",
     "c": "C",
     "cc": "BR"
    },
    {
     "n": "Rio Verde",
     "lat": -17.7923,
     "lng": -50.9192,
     "km": 340,
     "t": "fuel",
     "c": "C",
     "cc": "BR"
    },
    {
     "n": "Jataí",
     "lat": -17.8814,
     "lng": -51.7144,
     "km": 435,
     "t": "fuel",
     "c": "C",
     "cc": "BR"
    },
    {
     "n": "Mineiros",
     "lat": -17.5654,
     "lng": -52.5537,
     "km": 540,
     "t": "fuel",
     "c": "C",
     "cc": "BR"
    },
    {
     "n": "Alto Araguaia",
     "lat": -17.3147,
     "lng": -53.2153,
     "km": 625,
     "t": "fuel",
     "c": "C",
     "cc": "BR"
    },
    {
     "n": "Rondonópolis",
     "lat": -16.4673,
     "lng": -54.6372,
     "km": 822,
     "t": "end",
     "cc": "BR"
    }
   ]
  },
  {
   "d": 3,
   "date": "2026-10-17",
   "from": "Rondonópolis",
   "to": "Pontes e Lacerda",
   "km": 690,
   "profile": "long",
   "depart": "05:30",
   "arrive": "18:00",
   "cc": "BR",
   "note": "Controlar autonomia e possibilidade de chuva na região.",
   "stops": [
    {
     "n": "Rondonópolis",
     "lat": -16.4673,
     "lng": -54.6372,
     "km": 0,
     "t": "start",
     "cc": "BR"
    },
    {
     "n": "Jaciara",
     "lat": -15.9654,
     "lng": -54.9683,
     "km": 80,
     "t": "fuel",
     "c": "C",
     "cc": "BR"
    },
    {
     "n": "Cuiabá / Várzea Grande",
     "lat": -15.6014,
     "lng": -56.0979,
     "km": 230,
     "t": "fuel",
     "c": "C",
     "cc": "BR"
    },
    {
     "n": "Cáceres",
     "lat": -16.0764,
     "lng": -57.6819,
     "km": 445,
     "t": "fuel",
     "c": "C",
     "cc": "BR"
    },
    {
     "n": "Porto Esperidião",
     "lat": -15.857,
     "lng": -58.4619,
     "km": 550,
     "t": "fuel",
     "c": "P",
     "cc": "BR",
     "note": "Ponto extra — Cáceres → Pontes e Lacerda são ~230 km."
    },
    {
     "n": "Pontes e Lacerda",
     "lat": -15.2261,
     "lng": -59.3353,
     "km": 690,
     "t": "end",
     "cc": "BR"
    }
   ]
  },
  {
   "d": 4,
   "date": "2026-10-18",
   "from": "Pontes e Lacerda",
   "to": "Ariquemes",
   "km": 821,
   "profile": "long",
   "depart": "05:00",
   "arrive": "18:00",
   "cc": "BR",
   "note": "Um dos dias mais longos. Saída pontual às 05:00 é essencial.",
   "stops": [
    {
     "n": "Pontes e Lacerda",
     "lat": -15.2261,
     "lng": -59.3353,
     "km": 0,
     "t": "start",
     "cc": "BR"
    },
    {
     "n": "Nova Lacerda",
     "lat": -14.4727,
     "lng": -59.6001,
     "km": 95,
     "t": "fuel",
     "c": "P",
     "cc": "BR"
    },
    {
     "n": "Comodoro",
     "lat": -13.6626,
     "lng": -59.7856,
     "km": 200,
     "t": "fuel",
     "c": "C",
     "cc": "BR"
    },
    {
     "n": "Vilhena",
     "lat": -12.7406,
     "lng": -60.1458,
     "km": 325,
     "t": "fuel",
     "c": "C",
     "cc": "BR"
    },
    {
     "n": "Pimenta Bueno",
     "lat": -11.6725,
     "lng": -61.1936,
     "km": 505,
     "t": "fuel",
     "c": "C",
     "cc": "BR"
    },
    {
     "n": "Ji-Paraná",
     "lat": -10.8853,
     "lng": -61.9517,
     "km": 640,
     "t": "fuel",
     "c": "C",
     "cc": "BR"
    },
    {
     "n": "Jaru",
     "lat": -10.4389,
     "lng": -62.4664,
     "km": 725,
     "t": "fuel",
     "c": "C",
     "cc": "BR"
    },
    {
     "n": "Ariquemes",
     "lat": -9.9133,
     "lng": -63.0408,
     "km": 821,
     "t": "end",
     "cc": "BR"
    }
   ]
  },
  {
   "d": 5,
   "date": "2026-10-19",
   "from": "Ariquemes",
   "to": "Rio Branco",
   "km": 707,
   "profile": "long",
   "depart": "05:00",
   "arrive": "18:00",
   "cc": "BR",
   "flag": true,
   "note": "Último grande ponto de apoio no Brasil. Revisão completa das 4 motos em Rio Branco.",
   "alert": "O roadbook deixava ~357 km sem ponto entre Vista Alegre do Abunã e Rio Branco. Abastecer em todos os pontos abaixo, mesmo com meio tanque.",
   "emergency": "Porto Velho (km ~200) é a última cidade grande. Se atrasar muito, pernoitar lá.",
   "stops": [
    {
     "n": "Ariquemes",
     "lat": -9.9133,
     "lng": -63.0408,
     "km": 0,
     "t": "start",
     "cc": "BR"
    },
    {
     "n": "Porto Velho",
     "lat": -8.7612,
     "lng": -63.9039,
     "km": 180,
     "t": "fuel",
     "c": "C",
     "cc": "BR"
    },
    {
     "n": "Jaci-Paraná",
     "lat": -9.2556,
     "lng": -64.3953,
     "km": 270,
     "t": "fuel",
     "c": "P",
     "cc": "BR"
    },
    {
     "n": "Vista Alegre do Abunã",
     "lat": -9.689,
     "lng": -65.354,
     "km": 395,
     "t": "fuel",
     "c": "P",
     "cc": "BR"
    },
    {
     "n": "Extrema",
     "lat": -9.772,
     "lng": -66.356,
     "km": 525,
     "t": "fuel",
     "c": "P",
     "cc": "BR"
    },
    {
     "n": "Nova Califórnia",
     "lat": -9.7656,
     "lng": -66.611,
     "km": 555,
     "t": "fuel",
     "c": "S",
     "cc": "BR"
    },
    {
     "n": "Rio Branco",
     "lat": -9.9747,
     "lng": -67.81,
     "km": 707,
     "t": "end",
     "cc": "BR"
    }
   ]
  },
  {
   "d": 6,
   "date": "2026-10-20",
   "from": "Rio Branco",
   "to": "Puerto Maldonado",
   "km": 570,
   "profile": "border",
   "depart": "04:30",
   "arrive": "18:00",
   "cc": "BR",
   "flag": true,
   "note": "Fronteira Brasil–Peru em Assis Brasil / Iñapari. Tratar o dia inteiro como travessia.",
   "alert": "FRONTEIRA — imigração e aduana podem consumir horas. Chegar a Assis Brasil cedo. Documentos: passaporte ou RG aceito, CNH + PID, CRLV, SOAT e CIT peruano.",
   "emergency": "Se a fronteira atrasar: pernoitar em Iñapari ou Iberia em vez de rodar à noite.",
   "stops": [
    {
     "n": "Rio Branco",
     "lat": -9.9747,
     "lng": -67.81,
     "km": 0,
     "t": "start",
     "cc": "BR"
    },
    {
     "n": "Capixaba",
     "lat": -10.573,
     "lng": -67.677,
     "km": 80,
     "t": "fuel",
     "c": "P",
     "cc": "BR"
    },
    {
     "n": "Brasiléia / Epitaciolândia",
     "lat": -11.0064,
     "lng": -68.745,
     "km": 235,
     "t": "fuel",
     "c": "C",
     "cc": "BR"
    },
    {
     "n": "Assis Brasil (último posto BR)",
     "lat": -10.9409,
     "lng": -69.5738,
     "km": 340,
     "t": "fuel",
     "c": "P",
     "cc": "BR",
     "note": "Encher tanque antes de atravessar."
    },
    {
     "n": "Fronteira Assis Brasil–Iñapari",
     "lat": -10.948,
     "lng": -69.58,
     "km": 345,
     "t": "border",
     "cc": "PE"
    },
    {
     "n": "Iberia",
     "lat": -11.4095,
     "lng": -69.4878,
     "km": 405,
     "t": "fuel",
     "c": "P",
     "cc": "PE"
    },
    {
     "n": "Puerto Maldonado",
     "lat": -12.5933,
     "lng": -69.1891,
     "km": 570,
     "t": "end",
     "cc": "PE"
    }
   ]
  },
  {
   "d": 7,
   "date": "2026-10-21",
   "from": "Puerto Maldonado",
   "to": "Cusco",
   "km": 477,
   "profile": "altitude",
   "depart": "05:30",
   "arrive": "17:30",
   "cc": "PE",
   "flag": true,
   "note": "Grande ganho de altitude (selva → passo acima de 4.700 m → Cusco). Ritmo conservador.",
   "alert": "Interoceánica: abastecer em Mazuko. Depois os grifos são pequenos até Urcos. [Provável] Madre de Dios já teve desabastecimento e bloqueios ligados à mineração.",
   "emergency": "Quince Mil ou Ocongate se a chuva/neblina apertar na subida.",
   "stops": [
    {
     "n": "Puerto Maldonado",
     "lat": -12.5933,
     "lng": -69.1891,
     "km": 0,
     "t": "start",
     "cc": "PE"
    },
    {
     "n": "Mazuko",
     "lat": -12.991,
     "lng": -70.369,
     "km": 175,
     "t": "fuel",
     "c": "P",
     "cc": "PE",
     "note": "O roadbook não citava Mazuko — é o ponto mais confiável do trecho."
    },
    {
     "n": "Quince Mil",
     "lat": -13.231,
     "lng": -70.751,
     "km": 230,
     "t": "fuel",
     "c": "S",
     "cc": "PE"
    },
    {
     "n": "Ocongate",
     "lat": -13.629,
     "lng": -71.388,
     "km": 370,
     "t": "fuel",
     "c": "S",
     "cc": "PE"
    },
    {
     "n": "Urcos",
     "lat": -13.688,
     "lng": -71.624,
     "km": 420,
     "t": "fuel",
     "c": "P",
     "cc": "PE"
    },
    {
     "n": "Cusco",
     "lat": -13.532,
     "lng": -71.9675,
     "km": 477,
     "t": "end",
     "cc": "PE"
    }
   ]
  },
  {
   "d": 8,
   "date": "2026-10-22",
   "from": "Cusco",
   "to": "Cusco",
   "km": 0,
   "profile": "off",
   "cc": "PE",
   "note": "Dia livre — aclimatação e descanso.",
   "stops": [
    {
     "n": "Cusco",
     "lat": -13.532,
     "lng": -71.9675,
     "km": 0,
     "t": "end",
     "cc": "PE"
    }
   ]
  },
  {
   "d": 9,
   "date": "2026-10-23",
   "from": "Cusco",
   "to": "Cusco",
   "km": 0,
   "profile": "off",
   "cc": "PE",
   "note": "Turismo, revisão das motos (Cusco Motorrad — Triunfo 162) e mapas offline.",
   "stops": [
    {
     "n": "Cusco",
     "lat": -13.532,
     "lng": -71.9675,
     "km": 0,
     "t": "end",
     "cc": "PE"
    }
   ]
  },
  {
   "d": 10,
   "date": "2026-10-24",
   "from": "Cusco",
   "to": "Ayacucho",
   "km": 566,
   "profile": "mountain",
   "depart": "05:00",
   "arrive": "17:30",
   "cc": "PE",
   "flag": true,
   "note": "Rota PE-3S: Cusco → Abancay → Andahuaylas → Chincheros → Ayacucho. Risco de chuva e derrumbes.",
   "alert": "CORREÇÃO: o roadbook mandava abastecer em Chalhuanca e Puquio — essas cidades ficam na estrada Abancay → Nazca, NÃO na rota para Ayacucho. Use os pontos abaixo.",
   "emergency": "Andahuaylas (km ~330) — cidade com estrutura para pernoitar se escurecer ou fechar a estrada.",
   "alt": {
    "t": "Se a 3S fechar depois de Abancay",
    "d": "Não há desvio asfaltado razoável. Plano B: pernoitar em Abancay ou Andahuaylas e esperar a liberação (consultar o visor do MTC)."
   },
   "stops": [
    {
     "n": "Cusco",
     "lat": -13.532,
     "lng": -71.9675,
     "km": 0,
     "t": "start",
     "cc": "PE"
    },
    {
     "n": "Curahuasi",
     "lat": -13.54,
     "lng": -72.694,
     "km": 125,
     "t": "fuel",
     "c": "P",
     "cc": "PE"
    },
    {
     "n": "Abancay",
     "lat": -13.6339,
     "lng": -72.8814,
     "km": 195,
     "t": "fuel",
     "c": "C",
     "cc": "PE"
    },
    {
     "n": "Andahuaylas",
     "lat": -13.6556,
     "lng": -73.3872,
     "km": 330,
     "t": "fuel",
     "c": "C",
     "cc": "PE"
    },
    {
     "n": "Chincheros",
     "lat": -13.518,
     "lng": -73.723,
     "km": 410,
     "t": "fuel",
     "c": "P",
     "cc": "PE"
    },
    {
     "n": "Ayacucho",
     "lat": -13.1588,
     "lng": -74.2232,
     "km": 566,
     "t": "end",
     "cc": "PE"
    }
   ]
  },
  {
   "d": 11,
   "date": "2026-10-25",
   "from": "Ayacucho",
   "to": "Huancayo",
   "km": 380,
   "kmRoadbook": 491,
   "profile": "mountain",
   "depart": "05:00",
   "arrive": "17:30",
   "cc": "PE",
   "flag": true,
   "note": "Via Julcamarca → Lircay → Huancavelica → Izcuchaca. [Provável] Asfaltado: o trecho Huallapampa–Julcamarca–Secclla–Lircay foi inaugurado e Huancavelica–Lircay (78 km) foi pavimentado em 2015–2017.",
   "alert": "Saia de Ayacucho com tanque CHEIO — até Lircay só há povoados pequenos. O roadbook previa um único abastecimento em 491 km. Distância: pela rota via Lircay estimo ~380 km, não 491 — o traçado real vai confirmar.",
   "emergency": "Huancavelica (km ~230) tem estrutura para pernoite.",
   "alt": {
    "t": "Alternativa mais direta (PE-3S)",
    "d": "Ayacucho → Huanta → Mayocc → Izcuchaca → Huancayo (~260 km). Pula Lircay e Huancavelica, mas é a estrada principal — usar se houver bloqueio ou chuva forte."
   },
   "stops": [
    {
     "n": "Ayacucho",
     "lat": -13.1588,
     "lng": -74.2232,
     "km": 0,
     "t": "start",
     "cc": "PE"
    },
    {
     "n": "Julcamarca",
     "lat": -13.013,
     "lng": -74.444,
     "km": 70,
     "t": "stop",
     "c": "S",
     "cc": "PE",
     "note": "Povoado pequeno — não contar com grifo."
    },
    {
     "n": "Lircay",
     "lat": -12.982,
     "lng": -74.72,
     "km": 150,
     "t": "fuel",
     "c": "P",
     "cc": "PE"
    },
    {
     "n": "Huancavelica",
     "lat": -12.787,
     "lng": -74.973,
     "km": 230,
     "t": "fuel",
     "c": "C",
     "cc": "PE"
    },
    {
     "n": "Izcuchaca",
     "lat": -12.499,
     "lng": -74.997,
     "km": 300,
     "t": "fuel",
     "c": "P",
     "cc": "PE"
    },
    {
     "n": "Huancayo",
     "lat": -12.0651,
     "lng": -75.2049,
     "km": 380,
     "t": "end",
     "cc": "PE"
    }
   ]
  },
  {
   "d": 12,
   "date": "2026-10-26",
   "from": "Huancayo",
   "to": "Lunahuaná",
   "km": 250,
   "profile": "recovery",
   "depart": "07:00",
   "arrive": "16:00",
   "cc": "PE",
   "flag": true,
   "note": "Huancayo → Chupaca → Yauyos → vale do rio Cañete → Lunahuaná.",
   "alert": "[Não confirmado] Esta estrada (PE-24, Chupaca–Roncha–Yauyos–Pacarán) pode ter trechos de afirmado (terra) ou em obra. Valério disse 'creio que somente asfalto' — CONFIRMAR antes. Se tiver terra, não é dia de recuperação.",
   "emergency": "Yauyos tem hospedagem simples.",
   "alt": {
    "t": "Alternativa 100% asfalto",
    "d": "Huancayo → Carretera Central (passo Ticlio, ~4.800 m) → Lima → Panamericana Sul → Cañete → Lunahuaná. ~470 km e trânsito de Lima, mas asfalto o tempo todo."
   },
   "stops": [
    {
     "n": "Huancayo",
     "lat": -12.0651,
     "lng": -75.2049,
     "km": 0,
     "t": "start",
     "cc": "PE"
    },
    {
     "n": "Chupaca",
     "lat": -12.056,
     "lng": -75.287,
     "km": 15,
     "t": "fuel",
     "c": "C",
     "cc": "PE",
     "note": "Encher o tanque aqui."
    },
    {
     "n": "Yauyos",
     "lat": -12.459,
     "lng": -75.917,
     "km": 130,
     "t": "fuel",
     "c": "S",
     "cc": "PE",
     "note": "Possivelmente venda informal (galão)."
    },
    {
     "n": "Lunahuaná",
     "lat": -12.96,
     "lng": -76.14,
     "km": 250,
     "t": "end",
     "cc": "PE"
    }
   ]
  },
  {
   "d": 13,
   "date": "2026-10-27",
   "from": "Lunahuaná",
   "to": "Nazca",
   "km": 340,
   "profile": "moderate",
   "depart": "06:30",
   "arrive": "17:00",
   "cc": "PE",
   "note": "Passagem por Ica / Huacachina antes de Nazca.",
   "stops": [
    {
     "n": "Lunahuaná",
     "lat": -12.96,
     "lng": -76.14,
     "km": 0,
     "t": "start",
     "cc": "PE"
    },
    {
     "n": "San Vicente de Cañete",
     "lat": -13.0775,
     "lng": -76.387,
     "km": 35,
     "t": "fuel",
     "c": "C",
     "cc": "PE"
    },
    {
     "n": "Chincha Alta",
     "lat": -13.4099,
     "lng": -76.1323,
     "km": 90,
     "t": "fuel",
     "c": "C",
     "cc": "PE"
    },
    {
     "n": "Ica / Huacachina",
     "lat": -14.0678,
     "lng": -75.7286,
     "km": 195,
     "t": "fuel",
     "c": "C",
     "cc": "PE"
    },
    {
     "n": "Palpa",
     "lat": -14.534,
     "lng": -75.185,
     "km": 285,
     "t": "fuel",
     "c": "P",
     "cc": "PE"
    },
    {
     "n": "Nazca",
     "lat": -14.8355,
     "lng": -74.9387,
     "km": 340,
     "t": "end",
     "cc": "PE"
    }
   ]
  },
  {
   "d": 14,
   "date": "2026-10-28",
   "from": "Nazca",
   "to": "Arequipa",
   "km": 540,
   "profile": "long",
   "depart": "05:30",
   "arrive": "17:30",
   "cc": "PE",
   "flag": true,
   "note": "Panamericana Sul pelo litoral. Vento lateral e areia na pista.",
   "emergency": "Camaná (km ~390).",
   "stops": [
    {
     "n": "Nazca",
     "lat": -14.8355,
     "lng": -74.9387,
     "km": 0,
     "t": "start",
     "cc": "PE"
    },
    {
     "n": "Chala",
     "lat": -15.86,
     "lng": -74.249,
     "km": 165,
     "t": "fuel",
     "c": "C",
     "cc": "PE"
    },
    {
     "n": "Atico",
     "lat": -16.209,
     "lng": -73.612,
     "km": 255,
     "t": "fuel",
     "c": "P",
     "cc": "PE"
    },
    {
     "n": "Camaná",
     "lat": -16.624,
     "lng": -72.711,
     "km": 385,
     "t": "fuel",
     "c": "C",
     "cc": "PE"
    },
    {
     "n": "Repartición",
     "lat": -16.526,
     "lng": -71.825,
     "km": 500,
     "t": "fuel",
     "c": "P",
     "cc": "PE"
    },
    {
     "n": "Arequipa",
     "lat": -16.409,
     "lng": -71.5375,
     "km": 540,
     "t": "end",
     "cc": "PE"
    }
   ]
  },
  {
   "d": 15,
   "date": "2026-10-29",
   "from": "Arequipa",
   "to": "Arequipa",
   "km": 0,
   "profile": "off",
   "cc": "PE",
   "note": "Dia livre — revisão completa na BMW Motorrad Peru (Av. Alfonso Ugarte 500).",
   "stops": [
    {
     "n": "Arequipa",
     "lat": -16.409,
     "lng": -71.5375,
     "km": 0,
     "t": "end",
     "cc": "PE"
    }
   ]
  },
  {
   "d": 16,
   "date": "2026-10-30",
   "from": "Arequipa",
   "to": "Puno",
   "km": 295,
   "profile": "altitude",
   "depart": "07:00",
   "arrive": "16:00",
   "cc": "PE",
   "note": "Subida até o altiplano (~4.500 m). Frio, vento e hidratação.",
   "alert": "Arequipa → Juliaca são ~260 km, acima da regra de 200. Encher em Arequipa e de novo em Imata ou Santa Lucía.",
   "stops": [
    {
     "n": "Arequipa",
     "lat": -16.409,
     "lng": -71.5375,
     "km": 0,
     "t": "start",
     "cc": "PE"
    },
    {
     "n": "Imata",
     "lat": -15.837,
     "lng": -71.088,
     "km": 100,
     "t": "fuel",
     "c": "S",
     "cc": "PE"
    },
    {
     "n": "Santa Lucía",
     "lat": -15.698,
     "lng": -70.608,
     "km": 170,
     "t": "fuel",
     "c": "P",
     "cc": "PE"
    },
    {
     "n": "Juliaca",
     "lat": -15.5,
     "lng": -70.1333,
     "km": 240,
     "t": "fuel",
     "c": "C",
     "cc": "PE"
    },
    {
     "n": "Puno",
     "lat": -15.8402,
     "lng": -70.0219,
     "km": 295,
     "t": "end",
     "cc": "PE"
    }
   ]
  },
  {
   "d": 17,
   "date": "2026-10-31",
   "from": "Puno",
   "to": "La Paz",
   "km": 275,
   "profile": "border",
   "depart": "06:00",
   "arrive": "16:00",
   "cc": "PE",
   "flag": true,
   "note": "Fronteira Peru–Bolívia em Desaguadero. Formulário SIVETUR (249/A) para cada moto.",
   "alert": "ENCHER O TANQUE E OS GALÕES NO LADO PERUANO antes de cruzar. A partir daqui vale o checklist de combustível da Bolívia.",
   "emergency": "Desaguadero (lado boliviano tem hospedagem simples) se a aduana demorar.",
   "alt": {
    "t": "Travessia alternativa",
    "d": "Puno → Yunguyo → Kasani → Copacabana → balsa de Tiquina → La Paz. Mais bonita e às vezes mais tranquila; depende da balsa funcionar."
   },
   "stops": [
    {
     "n": "Puno",
     "lat": -15.8402,
     "lng": -70.0219,
     "km": 0,
     "t": "start",
     "cc": "PE"
    },
    {
     "n": "Ilave",
     "lat": -16.087,
     "lng": -69.638,
     "km": 60,
     "t": "fuel",
     "c": "C",
     "cc": "PE"
    },
    {
     "n": "Desaguadero (lado Peru)",
     "lat": -16.565,
     "lng": -69.04,
     "km": 160,
     "t": "fuel",
     "c": "P",
     "cc": "PE",
     "note": "Último grifo peruano."
    },
    {
     "n": "Fronteira Desaguadero",
     "lat": -16.568,
     "lng": -69.037,
     "km": 160,
     "t": "border",
     "cc": "BO"
    },
    {
     "n": "La Paz",
     "lat": -16.499,
     "lng": -68.146,
     "km": 275,
     "t": "end",
     "cc": "BO"
    }
   ]
  },
  {
   "d": 18,
   "date": "2026-11-01",
   "from": "La Paz",
   "to": "Uyuni",
   "km": 585,
   "profile": "remote",
   "depart": "05:00",
   "arrive": "17:30",
   "cc": "BO",
   "flag": true,
   "note": "Trecho remoto e de altitude (~3.700 m o dia todo).",
   "alert": "DIA MAIS CRÍTICO DE COMBUSTÍVEL. Challapata → Uyuni são ~200–240 km com pouca ou nenhuma oferta. Galões cheios a partir de Challapata. Conferir bloqueios na noite anterior.",
   "emergency": "Oruro (km ~230) é a última cidade grande. Se Challapata não tiver gasolina, voltar a Oruro em vez de arriscar.",
   "stops": [
    {
     "n": "La Paz",
     "lat": -16.499,
     "lng": -68.146,
     "km": 0,
     "t": "start",
     "cc": "BO"
    },
    {
     "n": "Patacamaya",
     "lat": -17.236,
     "lng": -67.921,
     "km": 100,
     "t": "fuel",
     "c": "P",
     "cc": "BO"
    },
    {
     "n": "Oruro",
     "lat": -17.97,
     "lng": -67.112,
     "km": 245,
     "t": "fuel",
     "c": "C",
     "cc": "BO"
    },
    {
     "n": "Challapata",
     "lat": -18.9,
     "lng": -66.77,
     "km": 375,
     "t": "fuel",
     "c": "P",
     "cc": "BO",
     "note": "Encher tanque + galões. Daqui até Uyuni não conte com nada."
    },
    {
     "n": "Uyuni",
     "lat": -20.46,
     "lng": -66.825,
     "km": 585,
     "t": "end",
     "cc": "BO"
    }
   ]
  },
  {
   "d": 19,
   "date": "2026-11-02",
   "from": "Uyuni",
   "to": "Uyuni",
   "km": 0,
   "profile": "off",
   "cc": "BO",
   "note": "Salar de Uyuni de 4x4 com guia (motos ficam). Aproveitar para conseguir combustível para o dia seguinte.",
   "stops": [
    {
     "n": "Uyuni",
     "lat": -20.46,
     "lng": -66.825,
     "km": 0,
     "t": "end",
     "cc": "BO"
    }
   ]
  },
  {
   "d": 20,
   "date": "2026-11-03",
   "from": "Uyuni",
   "to": "Sucre",
   "km": 358,
   "profile": "long",
   "depart": "06:00",
   "arrive": "16:30",
   "cc": "BO",
   "flag": true,
   "note": "Conferir condição da estrada Uyuni–Potosí–Sucre antes da saída.",
   "alert": "Uyuni → Potosí ~205–235 km sem cidade no meio — acima da regra de 200. Sair de Uyuni com tanque e galões cheios.",
   "stops": [
    {
     "n": "Uyuni",
     "lat": -20.46,
     "lng": -66.825,
     "km": 0,
     "t": "start",
     "cc": "BO"
    },
    {
     "n": "Potosí",
     "lat": -19.5836,
     "lng": -65.7531,
     "km": 235,
     "t": "fuel",
     "c": "C",
     "cc": "BO"
    },
    {
     "n": "Sucre",
     "lat": -19.0478,
     "lng": -65.2595,
     "km": 358,
     "t": "end",
     "cc": "BO"
    }
   ]
  },
  {
   "d": 21,
   "date": "2026-11-04",
   "from": "Sucre",
   "to": "Santa Cruz de la Sierra",
   "km": 479,
   "profile": "long",
   "depart": "05:30",
   "arrive": "17:00",
   "cc": "BO",
   "flag": true,
   "note": "Sucre → Aiquile → Mataral → Samaipata → Santa Cruz.",
   "alert": "Aiquile → Samaipata ~220 km, acima da regra. Usar galão. [Não confirmado] parte do trecho Aiquile–Mataral pode não ser asfalto — conferir na ABC.",
   "emergency": "Samaipata (km ~400) é ótima para pernoitar se atrasar.",
   "stops": [
    {
     "n": "Sucre",
     "lat": -19.0478,
     "lng": -65.2595,
     "km": 0,
     "t": "start",
     "cc": "BO"
    },
    {
     "n": "Aiquile",
     "lat": -18.205,
     "lng": -65.181,
     "km": 180,
     "t": "fuel",
     "c": "P",
     "cc": "BO"
    },
    {
     "n": "Mataral",
     "lat": -18.118,
     "lng": -64.217,
     "km": 300,
     "t": "fuel",
     "c": "S",
     "cc": "BO"
    },
    {
     "n": "Samaipata",
     "lat": -18.179,
     "lng": -63.874,
     "km": 400,
     "t": "fuel",
     "c": "P",
     "cc": "BO"
    },
    {
     "n": "Santa Cruz de la Sierra",
     "lat": -17.7833,
     "lng": -63.1821,
     "km": 479,
     "t": "end",
     "cc": "BO"
    }
   ]
  },
  {
   "d": 22,
   "date": "2026-11-05",
   "from": "Santa Cruz de la Sierra",
   "to": "Corumbá",
   "km": 657,
   "profile": "border",
   "depart": "05:00",
   "arrive": "18:00",
   "cc": "BO",
   "flag": true,
   "note": "Fronteira Bolívia–Brasil em Puerto Quijarro / Corumbá. Não deixar a travessia para o fim do dia.",
   "alert": "Santa Cruz → San José de Chiquitos são ~270 km no roadbook sem ponto. Abastecer em Pailón e Pozo del Tigre. Dar baixa no SIVETUR de cada moto na saída.",
   "emergency": "Roboré (km ~400) tem hospedagem.",
   "stops": [
    {
     "n": "Santa Cruz de la Sierra",
     "lat": -17.7833,
     "lng": -63.1821,
     "km": 0,
     "t": "start",
     "cc": "BO"
    },
    {
     "n": "Pailón",
     "lat": -17.656,
     "lng": -62.72,
     "km": 55,
     "t": "fuel",
     "c": "P",
     "cc": "BO"
    },
    {
     "n": "Pozo del Tigre",
     "lat": -17.535,
     "lng": -61.95,
     "km": 140,
     "t": "fuel",
     "c": "S",
     "cc": "BO"
    },
    {
     "n": "San José de Chiquitos",
     "lat": -17.846,
     "lng": -60.742,
     "km": 280,
     "t": "fuel",
     "c": "P",
     "cc": "BO"
    },
    {
     "n": "Roboré",
     "lat": -18.332,
     "lng": -59.759,
     "km": 405,
     "t": "fuel",
     "c": "P",
     "cc": "BO"
    },
    {
     "n": "El Carmen Rivero Tórrez",
     "lat": -18.818,
     "lng": -58.554,
     "km": 550,
     "t": "fuel",
     "c": "S",
     "cc": "BO"
    },
    {
     "n": "Puerto Suárez / Quijarro",
     "lat": -18.962,
     "lng": -57.799,
     "km": 640,
     "t": "fuel",
     "c": "P",
     "cc": "BO"
    },
    {
     "n": "Fronteira Quijarro–Corumbá",
     "lat": -19.001,
     "lng": -57.727,
     "km": 650,
     "t": "border",
     "cc": "BR"
    },
    {
     "n": "Corumbá",
     "lat": -19.0092,
     "lng": -57.6533,
     "km": 657,
     "t": "end",
     "cc": "BR"
    }
   ]
  },
  {
   "d": 23,
   "date": "2026-11-06",
   "from": "Corumbá",
   "to": "Campo Grande",
   "km": 426,
   "profile": "moderate",
   "depart": "06:30",
   "arrive": "15:30",
   "cc": "BR",
   "note": "BR-262 pelo Pantanal. Atenção a animais na pista e, em época seca, fumaça de queimadas.",
   "alert": "Sair de Corumbá com tanque cheio: até Miranda (~210 km) quase não há estrutura.",
   "stops": [
    {
     "n": "Corumbá",
     "lat": -19.0092,
     "lng": -57.6533,
     "km": 0,
     "t": "start",
     "cc": "BR"
    },
    {
     "n": "Miranda",
     "lat": -20.24,
     "lng": -56.378,
     "km": 215,
     "t": "fuel",
     "c": "C",
     "cc": "BR"
    },
    {
     "n": "Aquidauana / Anastácio",
     "lat": -20.483,
     "lng": -55.804,
     "km": 290,
     "t": "fuel",
     "c": "C",
     "cc": "BR"
    },
    {
     "n": "Campo Grande",
     "lat": -20.4697,
     "lng": -54.6201,
     "km": 426,
     "t": "end",
     "cc": "BR"
    }
   ]
  },
  {
   "d": 24,
   "date": "2026-11-07",
   "from": "Campo Grande",
   "to": "Uberaba",
   "km": 789,
   "profile": "long",
   "depart": "05:00",
   "arrive": "18:00",
   "cc": "BR",
   "note": "Etapa muito longa com mais de 10.000 km acumulados — atenção redobrada à fadiga.",
   "stops": [
    {
     "n": "Campo Grande",
     "lat": -20.4697,
     "lng": -54.6201,
     "km": 0,
     "t": "start",
     "cc": "BR"
    },
    {
     "n": "Ribas do Rio Pardo",
     "lat": -20.4431,
     "lng": -53.7592,
     "km": 95,
     "t": "fuel",
     "c": "C",
     "cc": "BR"
    },
    {
     "n": "Água Clara",
     "lat": -20.4452,
     "lng": -52.879,
     "km": 195,
     "t": "fuel",
     "c": "C",
     "cc": "BR"
    },
    {
     "n": "Três Lagoas",
     "lat": -20.7849,
     "lng": -51.7007,
     "km": 325,
     "t": "fuel",
     "c": "C",
     "cc": "BR"
    },
    {
     "n": "Iturama",
     "lat": -19.7275,
     "lng": -50.1957,
     "km": 530,
     "t": "fuel",
     "c": "P",
     "cc": "BR"
    },
    {
     "n": "Frutal",
     "lat": -20.0247,
     "lng": -48.9406,
     "km": 675,
     "t": "fuel",
     "c": "C",
     "cc": "BR"
    },
    {
     "n": "Uberaba",
     "lat": -19.7472,
     "lng": -47.9381,
     "km": 789,
     "t": "end",
     "cc": "BR"
    }
   ]
  },
  {
   "d": 25,
   "date": "2026-11-08",
   "from": "Uberaba",
   "to": "Governador Valadares",
   "km": 795,
   "profile": "long",
   "depart": "05:00",
   "arrive": "18:00",
   "cc": "BR",
   "note": "Último dia, também muito longo. Fadiga acumulada é o principal risco — sem pressa no retorno.",
   "stops": [
    {
     "n": "Uberaba",
     "lat": -19.7472,
     "lng": -47.9381,
     "km": 0,
     "t": "start",
     "cc": "BR"
    },
    {
     "n": "Araxá",
     "lat": -19.5902,
     "lng": -46.9438,
     "km": 125,
     "t": "fuel",
     "c": "C",
     "cc": "BR"
    },
    {
     "n": "Bom Despacho",
     "lat": -19.736,
     "lng": -45.2525,
     "km": 340,
     "t": "fuel",
     "c": "C",
     "cc": "BR",
     "note": "Ponto extra — o roadbook pulava de Araxá para BH (310 km)."
    },
    {
     "n": "Belo Horizonte (Anel)",
     "lat": -19.9167,
     "lng": -43.9345,
     "km": 505,
     "t": "fuel",
     "c": "C",
     "cc": "BR"
    },
    {
     "n": "Itabira",
     "lat": -19.619,
     "lng": -43.2269,
     "km": 605,
     "t": "fuel",
     "c": "C",
     "cc": "BR"
    },
    {
     "n": "Governador Valadares",
     "lat": -18.8511,
     "lng": -41.9495,
     "km": 795,
     "t": "end",
     "cc": "BR"
    }
   ]
  }
 ],
 "bmw": [
  {
   "city": "Cusco",
   "name": "Cusco Motorrad",
   "addr": "Triunfo 162",
   "lat": -13.516,
   "lng": -71.977
  },
  {
   "city": "Arequipa",
   "name": "BMW Motorrad Peru",
   "addr": "Av. Alfonso Ugarte 500",
   "lat": -16.406,
   "lng": -71.54
  },
  {
   "city": "La Paz",
   "name": "Taller BMW SACI",
   "addr": "Av. 14 de Septiembre",
   "lat": -16.525,
   "lng": -68.113
  },
  {
   "city": "Santa Cruz",
   "name": "BMW Andar Motors",
   "addr": "Av. Marcelo Terceros Bánzer 358",
   "lat": -17.765,
   "lng": -63.195
  }
 ]
};
