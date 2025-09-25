// AIDEV-NOTE: Mock data for Hip Hop stories following Digidem MapLibre template structure

const storiesData = [
  {
    id: 'origem-hip-hop-df',
    title: 'As Origens do Hip Hop no DF',
    subtitle: 'Uma jornada pelas raízes do movimento hip hop brasiliense',
    author: 'Coletivo Distrito Hip Hop',
    description: 'Explore os primeiros passos do movimento Hip Hop no Distrito Federal, desde os pioneiros até os locais que marcaram história.',
    image: '/fundo_base.jpg',
    chapters: [
      {
        id: 'chapter-1-pioneiros',
        title: 'Os Pioneiros',
        description: 'No final dos anos 80, o Hip Hop chegou ao Distrito Federal através de jovens que descobriram o movimento em viagens ao Rio de Janeiro e São Paulo. As primeiras <strong>rodas de break</strong> aconteciam na Rodoviária do Plano Piloto.',
        image: '/folha-pauta-1.png',
        location: {
          center: [-47.8826, -15.7942], // Rodoviária do Plano Piloto
          zoom: 16,
          bearing: 0,
          pitch: 0,
          name: 'Rodoviária do Plano Piloto'
        }
      },
      {
        id: 'chapter-2-ceilandia',
        title: 'Ceilândia: Berço do Rap Nacional',
        description: 'A Ceilândia se tornou o epicentro do rap brasileiro nos anos 90. Aqui nasceram grupos icônicos como <em>GOG</em>, <em>Câmbio Negro</em> e <em>Viela 17</em>, que levaram a voz da periferia para todo o país.',
        image: '/folha-pauta-2.png',
        location: {
          center: [-48.1094, -15.8419], // Ceilândia (matching mapa.js coordinates)
          zoom: 14,
          bearing: 45,
          pitch: 20,
          name: 'Ceilândia'
        }
      },
      {
        id: 'chapter-3-samambaia',
        title: 'Samambaia e a Cultura Underground',
        description: 'Samambaia desenvolveu uma cena underground forte, com batalhas de MC e eventos que revelaram talentos como <strong>Rappin Hood</strong> e fortaleceram a cultura do freestyle na região.',
        location: {
          center: [-48.0942, -15.8756], // Samambaia (matching mapa.js coordinates)
          zoom: 13,
          bearing: 0,
          pitch: 0,
          name: 'Samambaia'
        }
      },
      {
        id: 'chapter-4-planaltina',
        title: 'Planaltina: Tradição e Resistência',
        description: 'Uma das cidades mais antigas do DF, Planaltina trouxe elementos únicos para o Hip Hop local, mesclando tradições rurais com a cultura urbana, criando um som característico.',
        location: {
          center: [-47.6614, -15.6233], // Planaltina (matching mapa.js coordinates)
          zoom: 13,
          bearing: -45,
          pitch: 0,
          name: 'Planaltina'
        }
      },
      {
        id: 'chapter-5-legado',
        title: 'O Legado Continua',
        description: 'Hoje o Hip Hop do DF é referência nacional. Dos estúdios caseiros às grandes produções, a cultura hip hop brasiliense continua <strong>resistindo</strong> e <strong>existindo</strong>.',
        location: {
          center: [-47.8826, -15.7801], // Esplanada dos Ministérios
          zoom: 12,
          bearing: 0,
          pitch: 0,
          name: 'Brasília - Centro do Poder'
        }
      }
    ]
  },
  {
    id: 'mulheres-hip-hop-df',
    title: 'Mulheres no Hip Hop do DF',
    subtitle: 'Protagonismo feminino na cultura hip hop brasiliense',
    author: 'Rede de Mulheres do Hip Hop',
    description: 'Conheça as histórias das mulheres que moldaram e continuam transformando o cenário hip hop do Distrito Federal.',
    chapters: [
      {
        id: 'chapter-1-precursoras',
        title: 'As Precursoras',
        description: 'Nos anos 90, mulheres como <strong>Dina Di</strong> e <strong>Vera Verônika</strong> abriram caminhos no rap brasiliense, enfrentando preconceitos e estabelecendo sua presença na cena.',
        location: {
          center: [-47.8826, -15.7942], // Rodoviária
          zoom: 15,
          bearing: 90,
          pitch: 0,
          name: 'Rodoviária do Plano Piloto'
        }
      },
      {
        id: 'chapter-2-b-girls',
        title: 'B-Girls em Movimento',
        description: 'O breaking feminino ganhou força com crew como <em>Ladies Breakers</em> e <em>Soul Sisters</em>, que dominaram as pistas de dança e conquistaram campeonatos nacionais.',
        location: {
          center: [-48.1173, -15.8131], // Ceilândia
          zoom: 14,
          bearing: 0,
          pitch: 10,
          name: 'Ceilândia'
        }
      },
      {
        id: 'chapter-3-novas-vozes',
        title: 'Novas Vozes',
        description: 'A nova geração de mulheres no hip hop do DF traz diversidade e inovação, com artistas como <strong>Daia</strong>, <strong>Flora Matos</strong> e <strong>Lívia Cruz</strong> expandindo as fronteiras do gênero.',
        location: {
          center: [-47.9292, -15.7801], // Brasília/Plano Piloto (matching mapa.js coordinates)
          zoom: 13,
          bearing: 180,
          pitch: 0,
          name: 'Brasília - Plano Piloto'
        }
      }
    ]
  },
  {
    id: 'grafite-df',
    title: 'Arte Urbana: Grafite no DF',
    subtitle: 'Muros que contam histórias da capital',
    author: 'Movimento Grafiteiros Unidos',
    description: 'Uma jornada visual pelos principais pontos de grafite do Distrito Federal, explorando a arte que colore e politiza os muros da cidade.',
    chapters: [
      {
        id: 'chapter-1-106-norte',
        title: 'Entrequadra 106 Norte',
        description: 'Um dos primeiros pontos legais de grafite em Brasília, a entrequadra da 106 Norte se tornou uma galeria a céu aberto, onde artistas como <strong>Binho Ribeiro</strong> e <strong>Tinho</strong> deixaram suas marcas.',
        location: {
          center: [-47.8918, -15.7442], // 106 Norte
          zoom: 17,
          bearing: 0,
          pitch: 30,
          name: 'Entrequadra 106 Norte'
        }
      },
      {
        id: 'chapter-2-galeria-buriti',
        title: 'Galeria Buriti Shopping',
        description: 'Os pilotis do Buriti Shopping se transformaram em importante ponto de encontro dos grafiteiros, especialmente nos anos 2000, com <em>jams</em> e <em>encontros</em> regulares.',
        location: {
          center: [-47.8779, -15.7347], // Buriti Shopping região
          zoom: 16,
          bearing: 45,
          pitch: 0,
          name: 'Região do Buriti Shopping'
        }
      },
      {
        id: 'chapter-3-conic',
        title: 'Conic: Arte na Diversidade',
        description: 'O Conic (Setor de Diversões Sul) abriga uma das maiores concentrações de grafites do DF, com trabalhos que vão do <strong>wild style</strong> ao <strong>grafite social</strong>.',
        location: {
          center: [-47.8910, -15.7964], // Conic
          zoom: 18,
          bearing: 180,
          pitch: 0,
          name: 'Conic - Setor de Diversões Sul'
        }
      }
    ]
  },
  {
    id: 'eventos-historicos',
    title: 'Eventos Históricos do Hip Hop DF',
    subtitle: 'Momentos que marcaram a cena hip hop local',
    author: 'Arquivo Hip Hop DF',
    description: 'Reviva os principais eventos que definiram o movimento hip hop no Distrito Federal ao longo dos anos.',
    chapters: [
      {
        id: 'chapter-1-primeiro-encontro',
        title: 'Primeiro Encontro de Hip Hop (1994)',
        description: 'O primeiro encontro oficial de Hip Hop do DF aconteceu na <strong>Praça dos Três Poderes</strong>, reunindo b-boys, MCs, DJs e grafiteiros em um evento histórico que consolidou o movimento na capital.',
        location: {
          center: [-47.8609, -15.7980], // Praça dos Três Poderes
          zoom: 16,
          bearing: 0,
          pitch: 0,
          name: 'Praça dos Três Poderes'
        }
      },
      {
        id: 'chapter-2-festival-brasileiro',
        title: 'Festival Brasileiro de Hip Hop (1999)',
        description: 'O maior evento de hip hop já realizado no DF aconteceu no <em>Estádio Mané Garrincha</em>, reunindo artistas de todo o país e consolidando Brasília no cenário nacional.',
        location: {
          center: [-47.8998, -15.7837], // Estádio Mané Garrincha
          zoom: 15,
          bearing: 90,
          pitch: 20,
          name: 'Estádio Mané Garrincha'
        }
      },
      {
        id: 'chapter-3-duelo-nacional',
        title: 'Duelo Nacional de MCs (2005)',
        description: 'A <strong>Rodoviária de Brasília</strong> sediou o primeiro Duelo Nacional de MCs, evento que revelou talentos e estabeleceu Brasília como capital do freestyle nacional.',
        location: {
          center: [-47.8826, -15.7942], // Rodoviária
          zoom: 17,
          bearing: 180,
          pitch: 0,
          name: 'Rodoviária do Plano Piloto'
        }
      }
    ]
  }
];

export default storiesData;