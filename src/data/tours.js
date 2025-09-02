// AIDEV-NOTE: Data structure for map tours - interactive stories with map movements
const toursData = {
  tours: [
    {
      id: "origens-do-hip-hop-df",
      title: "As Origens do Hip Hop no DF",
      description: "Uma jornada pelos primeiros lugares onde o Hip Hop se estabeleceu no Distrito Federal",
      thumbnail: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop",
      duration: "~8 minutos",
      difficulty: "Iniciante",
      tags: ["História", "Origens", "Anos 90"],
      chapters: [
        {
          id: "chapter-1",
          title: "O Despertar (1988-1992)",
          locationId: "map-ceilandia",
          coordinates: { lat: -15.8419, lng: -48.1094 },
          zoom: 13,
          content: {
            text: "No final dos anos 80, Ceilândia tornou-se o epicentro do Hip Hop no Distrito Federal. Jovens periféricos encontraram na cultura Hip Hop uma forma de expressão e resistência.",
            details: [
              "Primeiro grupo de Breaking formado em 1988",
              "Festas de rua começam a incorporar elementos do Hip Hop",
              "Grafiteiros iniciam os primeiros trabalhos nos muros da cidade"
            ],
            mediaUrl: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=600&fit=crop",
            year: "1988-1992"
          }
        },
        {
          id: "chapter-2",
          title: "A Expansão (1993-1997)",
          locationId: "map-samambaia",
          coordinates: { lat: -15.8756, lng: -48.0942 },
          zoom: 13,
          content: {
            text: "O movimento se espalha para Samambaia, onde crews locais começam a organizar os primeiros eventos oficiais de Hip Hop da região.",
            details: [
              "Formação da primeira crew organizada",
              "Batalhas de MC ganham popularidade",
              "Conexões com o movimento Hip Hop nacional se fortalecem"
            ],
            mediaUrl: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&h=600&fit=crop",
            year: "1993-1997"
          }
        },
        {
          id: "chapter-3",
          title: "O Reconhecimento (1998-2002)",
          locationId: "map-planaltina",
          coordinates: { lat: -15.6233, lng: -47.6614 },
          zoom: 13,
          content: {
            text: "Planaltina se torna conhecida pelas competições de Breaking. A região produz alguns dos melhores b-boys e b-girls do DF.",
            details: [
              "Primeira competição oficial de Breaking",
              "Intercâmbio com breakers de outros estados",
              "Reconhecimento nacional dos talentos locais"
            ],
            mediaUrl: "https://images.unsplash.com/photo-1547036967-23d11aacaee0?w=800&h=600&fit=crop",
            year: "1998-2002"
          }
        },
        {
          id: "chapter-4",
          title: "Arte e Resistência (2003-2008)",
          locationId: "map-taguatinga",
          coordinates: { lat: -15.8335, lng: -48.0548 },
          zoom: 13,
          content: {
            text: "Taguatinga se consolida como centro de produção de grafite, com murais que contam a história e as lutas da periferia do DF.",
            details: [
              "Primeiros murais autorizados pela administração",
              "Grafiteiros ganham reconhecimento artístico",
              "Arte urbana como forma de ocupação dos espaços públicos"
            ],
            mediaUrl: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop",
            year: "2003-2008"
          }
        },
        {
          id: "chapter-5",
          title: "Institucionalização (2009-presente)",
          locationId: "map-brasilia",
          coordinates: { lat: -15.7801, lng: -47.9292 },
          zoom: 12,
          content: {
            text: "O Hip Hop conquista espaços institucionais em Brasília, com festivais na Esplanada dos Ministérios e políticas públicas de incentivo à cultura.",
            details: [
              "Primeiro festival oficial no Plano Piloto",
              "Criação de políticas públicas para a cultura Hip Hop",
              "Reconhecimento como patrimônio cultural do DF"
            ],
            mediaUrl: "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=800&h=600&fit=crop",
            year: "2009-presente"
          }
        }
      ]
    },
    {
      id: "grafite-e-arte-urbana",
      title: "Grafite e Arte Urbana no DF",
      description: "Descubra os principais pontos de grafite e como a arte urbana transformou a paisagem do Distrito Federal",
      thumbnail: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop",
      duration: "~6 minutos",
      difficulty: "Intermediário",
      tags: ["Grafite", "Arte", "Visual"],
      chapters: [
        {
          id: "chapter-grafite-1",
          title: "Os Primeiros Muros",
          locationId: "map-ceilandia",
          coordinates: { lat: -15.8419, lng: -48.1094 },
          zoom: 14,
          content: {
            text: "Os primeiros grafites do DF surgiram em Ceilândia, onde jovens usavam os muros como telas para expressar sua realidade social.",
            details: [
              "Técnicas rudimentares com spray caseiro",
              "Temas focados em denúncia social",
              "Influência direta do grafite nova-iorquino"
            ],
            mediaUrl: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop",
            year: "1989-1994"
          }
        },
        {
          id: "chapter-grafite-2",
          title: "Evolução Técnica",
          locationId: "map-taguatinga",
          coordinates: { lat: -15.8335, lng: -48.0548 },
          zoom: 14,
          content: {
            text: "Em Taguatinga, o grafite evoluiu tecnicamente, com artistas desenvolvendo estilos únicos e conquistando reconhecimento.",
            details: [
              "Desenvolvimento de técnicas próprias",
              "Primeira geração de grafiteiros profissionais",
              "Parcerias com estabelecimentos comerciais"
            ],
            mediaUrl: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop",
            year: "1995-2005"
          }
        },
        {
          id: "chapter-grafite-3",
          title: "Reconhecimento Oficial",
          locationId: "map-brasilia",
          coordinates: { lat: -15.7801, lng: -47.9292 },
          zoom: 13,
          content: {
            text: "O grafite ganha espaços oficiais em Brasília, com murais autorizados e eventos que celebram a arte urbana.",
            details: [
              "Primeiros murais autorizados pelo GDF",
              "Festivais de arte urbana",
              "Grafite como política pública de cultura"
            ],
            mediaUrl: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop",
            year: "2006-presente"
          }
        }
      ]
    },
    {
      id: "cultura-breaking",
      title: "A Cultura do Breaking no DF",
      description: "Conheça os locais onde o breaking se desenvolveu e os momentos marcantes dessa arte no Distrito Federal",
      thumbnail: "https://images.unsplash.com/photo-1547036967-23d11aacaee0?w=400&h=300&fit=crop",
      duration: "~7 minutos",
      difficulty: "Intermediário",
      tags: ["Breaking", "Dança", "Battles"],
      chapters: [
        {
          id: "chapter-breaking-1",
          title: "Os Primeiros Passos",
          locationId: "map-samambaia",
          coordinates: { lat: -15.8756, lng: -48.0942 },
          zoom: 14,
          content: {
            text: "Samambaia foi palco dos primeiros grupos de breaking do DF, onde jovens aprendiam assistindo VHS e criavam suas próprias interpretações.",
            details: [
              "Aprendizado através de vídeos importados",
              "Criação de movimentos únicos",
              "Primeiros cypers em praças públicas"
            ],
            mediaUrl: "https://images.unsplash.com/photo-1547036967-23d11aacaee0?w=800&h=600&fit=crop",
            year: "1990-1996"
          }
        },
        {
          id: "chapter-breaking-2",
          title: "Competições e Rivalidades",
          locationId: "map-planaltina",
          coordinates: { lat: -15.6233, lng: -47.6614 },
          zoom: 14,
          content: {
            text: "Planaltina se tornou o centro das competições de breaking, onde crews de toda a região se enfrentavam em battles épicas.",
            details: [
              "Primeira competição oficial",
              "Desenvolvimento de crews organizadas",
              "Intercâmbio com outras regiões do Brasil"
            ],
            mediaUrl: "https://images.unsplash.com/photo-1547036967-23d11aacaee0?w=800&h=600&fit=crop",
            year: "1997-2005"
          }
        },
        {
          id: "chapter-breaking-3",
          title: "Reconhecimento Nacional",
          locationId: "map-brasilia",
          coordinates: { lat: -15.7801, lng: -47.9292 },
          zoom: 13,
          content: {
            text: "O breaking do DF ganha projeção nacional, com breakers locais competindo e vencendo em campeonatos pelo Brasil.",
            details: [
              "Vitórias em competições nacionais",
              "Formação de novos talentos",
              "Breaking como modalidade esportiva reconhecida"
            ],
            mediaUrl: "https://images.unsplash.com/photo-1547036967-23d11aacaee0?w=800&h=600&fit=crop",
            year: "2006-presente"
          }
        }
      ]
    }
  ]
};

export default toursData;