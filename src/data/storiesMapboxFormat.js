// AIDEV-NOTE: Hip Hop stories following Mapbox Storytelling config.js format

const storiesMapboxFormat = [
  {
    id: "origem-hip-hop-df",
    style: "https://api.maptiler.com/maps/0198f104-5621-7dfc-896c-fe02aa4f37f8/style.json?key=44Jpa8uxVZvK9mvnZI2z",
    theme: "dark",
    title: "As Origens do Hip Hop no DF",
    subtitle: "Uma jornada pelas raízes do movimento hip hop brasiliense",
    byline: "Coletivo Distrito Hip Hop",
    author: "Coletivo Distrito Hip Hop",
    footer: "Explore mais histórias do Hip Hop brasileiro em nosso acervo digital.",
    chapters: [
      {
        id: "pioneiros",
        alignment: "left",
        hidden: false,
        title: "Os Pioneiros",
        image: "/folha-pauta-1.webp",
        description: "No final dos anos 80, o Hip Hop chegou ao Distrito Federal através de jovens que descobriram o movimento em viagens ao Rio de Janeiro e São Paulo. As primeiras <strong>rodas de break</strong> aconteciam na Rodoviária do Plano Piloto.",
        location: {
          center: [-47.8826, -15.7942], // Rodoviária do Plano Piloto
          zoom: 16,
          pitch: 0,
          bearing: 0,
          speed: 1.2,
          name: "Rodoviária do Plano Piloto"
        },
        mapAnimation: 'flyTo',
        rotateAnimation: false,
        callback: '',
        onChapterEnter: [],
        onChapterExit: []
      },
      {
        id: "ceilandia",
        alignment: "left",
        hidden: false,
        title: "Ceilândia: Berço do Rap Nacional",
        image: "/folha-pauta-2.webp",
        description: "A Ceilândia se tornou o epicentro do rap brasileiro nos anos 90. Aqui nasceram grupos icônicos como <em>GOG</em>, <em>Câmbio Negro</em> e <em>Viela 17</em>, que levaram a voz da periferia para todo o país.",
        location: {
          center: [-48.1094, -15.8419], // Ceilândia (matching mapa.js coordinates)
          zoom: 14,
          pitch: 20,
          bearing: 45,
          speed: 0.8,
          name: "Ceilândia"
        },
        mapAnimation: 'flyTo',
        rotateAnimation: false,
        callback: '',
        onChapterEnter: [],
        onChapterExit: []
      },
      {
        id: "samambaia",
        alignment: "left",
        hidden: false,
        title: "Samambaia e a Cultura Underground",
        image: "",
        description: "Samambaia desenvolveu uma cena underground forte, com batalhas de MC e eventos que revelaram talentos como <strong>Rappin Hood</strong> e fortaleceram a cultura do freestyle na região.",
        location: {
          center: [-48.0942, -15.8756], // Samambaia (matching mapa.js coordinates)
          zoom: 13,
          pitch: 0,
          bearing: 0,
          speed: 1.2,
          name: "Samambaia"
        },
        mapAnimation: 'flyTo',
        rotateAnimation: false,
        callback: '',
        onChapterEnter: [],
        onChapterExit: []
      },
      {
        id: "planaltina",
        alignment: "left",
        hidden: false,
        title: "Planaltina: Tradição e Resistência",
        image: "",
        description: "Uma das cidades mais antigas do DF, Planaltina trouxe elementos únicos para o Hip Hop local, mesclando tradições rurais com a cultura urbana, criando um som característico.",
        location: {
          center: [-47.6614, -15.6233], // Planaltina (matching mapa.js coordinates)
          zoom: 13,
          pitch: 0,
          bearing: -45,
          speed: 1.2,
          name: "Planaltina"
        },
        mapAnimation: 'flyTo',
        rotateAnimation: false,
        callback: '',
        onChapterEnter: [],
        onChapterExit: []
      },
      {
        id: "legado",
        alignment: "center",
        hidden: false,
        title: "O Legado Continua",
        image: "",
        description: "Hoje o Hip Hop do DF é referência nacional. Dos estúdios caseiros às grandes produções, a cultura hip hop brasiliense continua <strong>resistindo</strong> e <strong>existindo</strong>.",
        location: {
          center: [-47.9292, -15.7801], // Brasília/Plano Piloto (matching mapa.js coordinates)
          zoom: 12,
          pitch: 0,
          bearing: 0,
          speed: 0.6,
          name: "Brasília - Centro do Poder"
        },
        mapAnimation: 'flyTo',
        rotateAnimation: false,
        callback: '',
        onChapterEnter: [],
        onChapterExit: []
      }
    ]
  },
  {
    id: "mulheres-hip-hop-df",
    style: "https://api.maptiler.com/maps/0198f104-5621-7dfc-896c-fe02aa4f37f8/style.json?key=44Jpa8uxVZvK9mvnZI2z",
    accessToken: "",
    theme: "dark",
    title: "Mulheres no Hip Hop do DF",
    subtitle: "Protagonismo feminino na cultura hip hop brasiliense",
    byline: "Rede de Mulheres do Hip Hop",
    author: "Rede de Mulheres do Hip Hop",
    footer: "Conheça mais sobre as mulheres que transformam o Hip Hop brasileiro.",
    chapters: [
      {
        id: "precursoras",
        alignment: "left",
        hidden: false,
        title: "As Precursoras",
        image: "",
        description: "Nos anos 90, mulheres como <strong>Dina Di</strong> e <strong>Vera Verônika</strong> abriram caminhos no rap brasiliense, enfrentando preconceitos e estabelecendo sua presença na cena.",
        location: {
          center: [-47.8826, -15.7942], // Rodoviária
          zoom: 15,
          pitch: 0,
          bearing: 90,
          speed: 1.2,
          name: "Rodoviária do Plano Piloto"
        },
        mapAnimation: 'flyTo',
        rotateAnimation: false,
        callback: '',
        onChapterEnter: [],
        onChapterExit: []
      },
      {
        id: "b-girls",
        alignment: "left",
        hidden: false,
        title: "B-Girls em Movimento",
        image: "",
        description: "O breaking feminino ganhou força com crew como <em>Ladies Breakers</em> e <em>Soul Sisters</em>, que dominaram as pistas de dança e conquistaram campeonatos nacionais.",
        location: {
          center: [-48.1094, -15.8419], // Ceilândia
          zoom: 14,
          pitch: 10,
          bearing: 0,
          speed: 1.2,
          name: "Ceilândia"
        },
        mapAnimation: 'flyTo',
        rotateAnimation: false,
        callback: '',
        onChapterEnter: [],
        onChapterExit: []
      },
      {
        id: "novas-vozes",
        alignment: "right",
        hidden: false,
        title: "Novas Vozes",
        image: "",
        description: "A nova geração de mulheres no hip hop do DF traz diversidade e inovação, com artistas como <strong>Daia</strong>, <strong>Flora Matos</strong> e <strong>Lívia Cruz</strong> expandindo as fronteiras do gênero.",
        location: {
          center: [-47.9292, -15.7801], // Asa Norte
          zoom: 13,
          pitch: 0,
          bearing: 180,
          speed: 1.2,
          name: "Brasília - Plano Piloto"
        },
        mapAnimation: 'flyTo',
        rotateAnimation: false,
        callback: '',
        onChapterEnter: [],
        onChapterExit: []
      }
    ]
  },
  {
    id: "grafite-df",
    style: "https://api.maptiler.com/maps/0198f104-5621-7dfc-896c-fe02aa4f37f8/style.json?key=44Jpa8uxVZvK9mvnZI2z",
    accessToken: "",
    theme: "dark",
    title: "Arte Urbana: Grafite no DF",
    subtitle: "Muros que contam histórias da capital",
    byline: "Movimento Grafiteiros Unidos",
    author: "Movimento Grafiteiros Unidos",
    footer: "Descubra mais arte urbana em nossa galeria digital.",
    chapters: [
      {
        id: "106-norte",
        alignment: "left",
        hidden: false,
        title: "Entrequadra 106 Norte",
        image: "",
        description: "Um dos primeiros pontos legais de grafite em Brasília, a entrequadra da 106 Norte se tornou uma galeria a céu aberto, onde artistas como <strong>Binho Ribeiro</strong> e <strong>Tinho</strong> deixaram suas marcas.",
        location: {
          center: [-47.8918, -15.7442], // 106 Norte
          zoom: 17,
          pitch: 30,
          bearing: 0,
          speed: 1.2,
          name: "Entrequadra 106 Norte"
        },
        mapAnimation: 'flyTo',
        rotateAnimation: false,
        callback: '',
        onChapterEnter: [],
        onChapterExit: []
      },
      {
        id: "galeria-buriti",
        alignment: "center",
        hidden: false,
        title: "Galeria Buriti Shopping",
        image: "",
        description: "Os pilotis do Buriti Shopping se transformaram em importante ponto de encontro dos grafiteiros, especialmente nos anos 2000, com <em>jams</em> e <em>encontros</em> regulares.",
        location: {
          center: [-47.8779, -15.7347], // Buriti Shopping região
          zoom: 16,
          pitch: 0,
          bearing: 45,
          speed: 1.2,
          name: "Região do Buriti Shopping"
        },
        mapAnimation: 'flyTo',
        rotateAnimation: false,
        callback: '',
        onChapterEnter: [],
        onChapterExit: []
      },
      {
        id: "conic",
        alignment: "right",
        hidden: false,
        title: "Conic: Arte na Diversidade",
        image: "",
        description: "O Conic (Setor de Diversões Sul) abriga uma das maiores concentrações de grafites do DF, com trabalhos que vão do <strong>wild style</strong> ao <strong>grafite social</strong>.",
        location: {
          center: [-47.8910, -15.7964], // Conic
          zoom: 18,
          pitch: 0,
          bearing: 180,
          speed: 1.2,
          name: "Conic - Setor de Diversões Sul"
        },
        mapAnimation: 'flyTo',
        rotateAnimation: false,
        callback: '',
        onChapterEnter: [],
        onChapterExit: []
      }
    ]
  },
  {
    id: "eventos-historicos",
    style: "https://api.maptiler.com/maps/0198f104-5621-7dfc-896c-fe02aa4f37f8/style.json?key=44Jpa8uxVZvK9mvnZI2z",
    accessToken: "",
    theme: "dark", 
    title: "Eventos Históricos do Hip Hop DF",
    subtitle: "Momentos que marcaram a cena hip hop local",
    byline: "Arquivo Hip Hop DF",
    author: "Arquivo Hip Hop DF",
    footer: "Explore mais eventos históricos em nosso arquivo digital.",
    chapters: [
      {
        id: "primeiro-encontro",
        alignment: "center",
        hidden: false,
        title: "Primeiro Encontro de Hip Hop (1994)",
        image: "",
        description: "O primeiro encontro oficial de Hip Hop do DF aconteceu na <strong>Praça dos Três Poderes</strong>, reunindo b-boys, MCs, DJs e grafiteiros em um evento histórico que consolidou o movimento na capital.",
        location: {
          center: [-47.8609, -15.7980], // Praça dos Três Poderes
          zoom: 16,
          pitch: 0,
          bearing: 0,
          speed: 1.2,
          name: "Praça dos Três Poderes"
        },
        mapAnimation: 'flyTo',
        rotateAnimation: false,
        callback: '',
        onChapterEnter: [],
        onChapterExit: []
      },
      {
        id: "festival-brasileiro",
        alignment: "left",
        hidden: false,
        title: "Festival Brasileiro de Hip Hop (1999)",
        image: "",
        description: "O maior evento de hip hop já realizado no DF aconteceu no <em>Estádio Mané Garrincha</em>, reunindo artistas de todo o país e consolidando Brasília no cenário nacional.",
        location: {
          center: [-47.8998, -15.7837], // Estádio Mané Garrincha
          zoom: 15,
          pitch: 20,
          bearing: 90,
          speed: 1.2,
          name: "Estádio Mané Garrincha"
        },
        mapAnimation: 'flyTo',
        rotateAnimation: false,
        callback: '',
        onChapterEnter: [],
        onChapterExit: []
      },
      {
        id: "duelo-nacional",
        alignment: "right",
        hidden: false,
        title: "Duelo Nacional de MCs (2005)",
        image: "",
        description: "A <strong>Rodoviária de Brasília</strong> sediou o primeiro Duelo Nacional de MCs, evento que revelou talentos e estabeleceu Brasília como capital do freestyle nacional.",
        location: {
          center: [-47.8826, -15.7942], // Rodoviária
          zoom: 17,
          pitch: 0,
          bearing: 180,
          speed: 1.2,
          name: "Rodoviária do Plano Piloto"
        },
        mapAnimation: 'flyTo',
        rotateAnimation: false,
        callback: '',
        onChapterEnter: [],
        onChapterExit: []
      }
    ]
  }
];

export default storiesMapboxFormat;