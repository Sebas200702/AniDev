module.exports = {
  openapi: '3.0.0',
  info: {
    title: 'AniDev API',
    version: '1.1.0',
    description: 'API del proyecto AniDev - AniDev is a modern anime streaming and exploration platform. It offers dynamic experiences for discovering, searching, and enjoying top animes.',
    contact: {
      name: 'AniDev Team',
      url: 'https://github.com/Sebas200702/AniDev',
    },
  },
  servers: [
    {
      url: 'http://localhost:4321',
      description: 'Desarrollo local',
    },
    {
      url: 'https://anidev.app',
      description: 'Producción',
    },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
    },
  },
}
