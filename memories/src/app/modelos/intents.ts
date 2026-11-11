import type { IconName } from '../componentes/icon/icons'

export type Intent = 'romance' | 'friend' | 'plan' | 'hobby'

// Cada intención tiene su figura en las barras
export const INTENT_SHAPE: Record<Intent, string> = {
  romance: 'drop',
  friend: 'pill',
  plan: 'ticket',
  hobby: 'leaf',
}

export const INTENT_ICON: Record<Intent, IconName> = {
  romance: 'heart',
  friend: 'handshake',
  plan: 'ticket',
  hobby: 'gamepad-2',
}

export const INTENTS: Record<
  Intent,
  { label: string; short: string; description: string; text: string; soft: string; solid: string }
> = {
  romance: {
    label: 'Pareja',
    short: 'Pareja',
    description: 'Conocer a alguien con quien construir algo romántico.',
    text: 'text-romance',
    soft: 'bg-romance-soft',
    solid: 'bg-romance',
  },
  friend: {
    label: 'Amistad',
    short: 'Amistad',
    description: 'Hacer amigos en tu ciudad, sin presión de nada más.',
    text: 'text-friend',
    soft: 'bg-friend-soft',
    solid: 'bg-friend',
  },
  plan: {
    label: 'Un plan',
    short: 'Plan',
    description: 'Compañía para algo concreto: un concierto, correr, salir a comer.',
    text: 'text-plan',
    soft: 'bg-plan-soft',
    solid: 'bg-plan',
  },
  hobby: {
    label: 'Un pasatiempo',
    short: 'Pasatiempo',
    description: 'Personas con quien compartir lo que te gusta hacer.',
    text: 'text-hobby',
    soft: 'bg-hobby-soft',
    solid: 'bg-hobby',
  },
}

export const INTENT_ORDER: Intent[] = ['friend', 'plan', 'hobby', 'romance']

export const INTEREST_GROUPS: { name: string; items: string[] }[] = [
  { name: 'Deporte y movimiento', items: ['Correr', 'Gimnasio', 'Futbol', 'Basquetbol', 'Voleibol', 'Tenis', 'Natación', 'Ciclismo', 'Box', 'Artes marciales', 'Escalada', 'Patinaje', 'Baile', 'Pádel'] },
  { name: 'Música', items: ['Conciertos', 'Música en vivo', 'Rock', 'Pop', 'Reguetón', 'Jazz', 'Música clásica', 'Regional mexicano', 'Electrónica', 'Tocar guitarra', 'Cantar', 'Karaoke', 'Producir música'] },
  { name: 'Cine, series y escena', items: ['Cine', 'Teatro', 'Series', 'Documentales', 'Cine de terror', 'Comedia', 'Stand-up', 'Musicales', 'Anime', 'K-dramas'] },
  { name: 'Arte y creatividad', items: ['Dibujo', 'Fotografía', 'Pintura', 'Cerámica', 'Museos', 'Escritura', 'Poesía', 'Diseño', 'Tejido', 'Manualidades', 'Moda', 'Tatuajes'] },
  { name: 'Comida y bebida', items: ['Café', 'Cocina', 'Repostería', 'Tacos', 'Comida vegana', 'Sushi', 'Vino', 'Cerveza artesanal', 'Mezcal', 'Probar restaurantes', 'Mercados'] },
  { name: 'Juegos', items: ['Videojuegos', 'Juegos de mesa', 'Ajedrez', 'Rol', 'Cartas', 'Billar', 'Boliche', 'Esports', 'Escape rooms', 'Trivia'] },
  { name: 'Tecnología y ciencia', items: ['Programación', 'Inteligencia artificial', 'Robótica', 'Astronomía', 'Ciencia', 'Emprendimiento', 'Criptografía', 'Hardware'] },
  { name: 'Naturaleza y viajes', items: ['Senderismo', 'Viajes', 'Acampar', 'Playa', 'Pueblos mágicos', 'Mochilazo', 'Jardinería', 'Observar aves', 'Perros', 'Gatos'] },
  { name: 'Lectura e ideas', items: ['Lectura', 'Novela', 'Cómics', 'Manga', 'Historia', 'Filosofía', 'Psicología', 'Podcasts', 'Política', 'Mitología'] },
  { name: 'Bienestar', items: ['Yoga', 'Meditación', 'Pilates', 'Nutrición', 'Terapia', 'Astrología', 'Caminar', 'Dormir bien'] },
  { name: 'Idiomas y cultura', items: ['Idiomas', 'Intercambio cultural', 'Cultura japonesa', 'Cultura coreana', 'Tradiciones mexicanas', 'Lucha libre'] },
  { name: 'Comunidad', items: ['Voluntariado', 'Medio ambiente', 'Derechos humanos', 'Rescate animal', 'Comunidad LGBT+', 'Clubes de lectura'] },
]

export const INTERESTS = INTEREST_GROUPS.flatMap((g) => g.items)

export const CITIES = ['Guadalajara', 'Ciudad de México', 'Monterrey', 'Querétaro', 'Puebla'] as const
