// Bots de prueba: personas ficticias para probar sugerencias, matches, chats, planes y moderación.
// Para quitarlos basta con borrar este archivo y sus referencias en mock.ts y app-store.ts.
import type { Message, Person, PersonDetails, Plan, Report } from './mock'

export const BOTS: Person[] = [
  {"id": "b01", "name": "Pablo", "age": 21, "city": "Guadalajara", "bio": "Recién llegué a Guadalajara. Me interesan cartas y cantar.", "intents": ["plan", "friend"], "interests": ["Cartas", "Cantar", "Videojuegos", "Juegos de mesa"], "hue": 294, "likesYou": true, "verified": true, "languages": ["Español", "Portugués"], "availability": "Fines de semana", "decoration": "terrazo", "frame": "halo", "effect": "destellos", "nameStyle": "lavanda", "groupSizes": ["duo", "small"], "gender": "man"},
  {"id": "b02", "name": "Óscar", "age": 19, "city": "Guadalajara", "bio": "Entre semana trabajo; los fines son para senderismo y perros.", "intents": ["hobby", "romance", "plan"], "interests": ["Senderismo", "Perros", "Viajes", "Caminar", "Pilates"], "hue": 236, "likesYou": true, "verified": false, "languages": ["Español", "Inglés"], "availability": "Entre semana", "decoration": "fuego", "frame": "rosa", "effect": "flores", "nameStyle": "menta", "groupSizes": ["duo", "small"], "gender": "man"},
  {"id": "b03", "name": "Abril", "age": 36, "city": "Guadalajara", "bio": "Mi plan perfecto mezcla videojuegos, astronomía y una buena sobremesa.", "intents": ["friend", "romance"], "interests": ["Videojuegos", "Astronomía", "Ajedrez", "Inteligencia artificial"], "hue": 189, "likesYou": false, "verified": true, "languages": ["Español"], "availability": "Cualquier día", "decoration": "escamas", "frame": "petalos", "effect": "none", "nameStyle": "cielo", "groupSizes": ["duo", "small", "large"], "gender": "woman"},
  {"id": "b04", "name": "Elena", "age": 38, "city": "Guadalajara", "bio": "Entre semana trabajo; los fines son para pueblos mágicos y teatro.", "intents": ["plan", "hobby", "romance"], "interests": ["Pueblos mágicos", "Teatro", "Cine"], "hue": 186, "likesYou": true, "verified": true, "languages": ["Español", "Portugués"], "availability": "Fines de semana", "decoration": "cuadros", "frame": "arcoiris", "effect": "corazones", "nameStyle": "none", "groupSizes": ["duo"], "gender": "woman"},
  {"id": "b05", "name": "Jimena", "age": 42, "city": "Guadalajara", "bio": "Mi plan perfecto mezcla gimnasio, patinaje y una buena sobremesa.", "intents": ["plan", "friend"], "interests": ["Gimnasio", "Patinaje", "Podcasts", "Voleibol"], "hue": 116, "likesYou": true, "verified": true, "languages": ["Español"], "availability": "Entre semana", "decoration": "prisma", "frame": "orbita", "effect": "notas", "nameStyle": "cursiva", "groupSizes": ["duo", "small", "large"], "gender": "woman"},
  {"id": "b06", "name": "Noa", "age": 42, "city": "Guadalajara", "bio": "Diseño y dibujo son lo mío. Busco con quién compartirlos.", "intents": ["plan", "romance", "hobby"], "interests": ["Diseño", "Dibujo", "Jardinería"], "hue": 202, "likesYou": true, "verified": false, "languages": ["Español"], "availability": "Cualquier día", "decoration": "cereza", "frame": "oro", "effect": "estrellas", "nameStyle": "none", "groupSizes": ["small"], "gender": "nonbinary"},
  {"id": "b07", "name": "Alejandra", "age": 33, "city": "Guadalajara", "bio": "Entre semana trabajo; los fines son para manga y lectura.", "intents": ["friend", "hobby"], "interests": ["Manga", "Lectura", "Pop", "Regional mexicano"], "hue": 339, "likesYou": false, "verified": false, "languages": ["Español", "Francés"], "availability": "Cualquier día", "decoration": "rosa-polar", "frame": "puntos", "effect": "burbujas", "nameStyle": "none", "groupSizes": ["duo", "small"], "gender": "woman"},
  {"id": "b08", "name": "Frida", "age": 33, "city": "Guadalajara", "bio": "Si te gusta lectura, ya tenemos de qué platicar.", "intents": ["hobby", "romance", "friend"], "interests": ["Lectura", "Psicología", "Idiomas"], "hue": 260, "likesYou": true, "verified": true, "languages": ["Español"], "availability": "Cualquier día", "decoration": "ondas", "frame": "noche", "effect": "notas", "nameStyle": "lavanda-cursiva", "groupSizes": ["small", "large"], "gender": "woman"},
  {"id": "b09", "name": "Bruno", "age": 41, "city": "Guadalajara", "bio": "Ando en busca de gente a la que también le guste música en vivo.", "intents": ["plan", "hobby", "friend"], "interests": ["Música en vivo", "Jazz", "Karaoke", "Escritura"], "hue": 220, "likesYou": false, "verified": true, "languages": ["Español", "Francés"], "availability": "Fines de semana", "decoration": "caramelo", "frame": "halo", "effect": "plumas", "nameStyle": "none", "groupSizes": ["large"], "gender": "man"},
  {"id": "b10", "name": "Fernando", "age": 41, "city": "Guadalajara", "bio": "Me gusta todo lo que tenga que ver con repostería y café.", "intents": ["hobby", "friend", "plan"], "interests": ["Repostería", "Café", "Comida vegana", "Caminar", "Meditación"], "hue": 93, "likesYou": true, "verified": true, "languages": ["Español"], "availability": "Cualquier día", "decoration": "durazno", "frame": "lucero", "effect": "notas", "nameStyle": "none", "groupSizes": ["small", "large"], "gender": "man"},
  {"id": "b11", "name": "Adrián", "age": 27, "city": "Guadalajara", "bio": "Me gusta todo lo que tenga que ver con cómics y novela.", "intents": ["hobby", "plan"], "interests": ["Cómics", "Novela", "Dibujo", "Pintura", "Podcasts"], "hue": 18, "likesYou": true, "verified": false, "languages": ["Español", "Francés", "Japonés"], "availability": "Fines de semana", "decoration": "eclipse", "frame": "hilo", "effect": "coronas", "nameStyle": "none", "groupSizes": ["duo", "small", "large"], "gender": "man"},
  {"id": "b12", "name": "Alex", "age": 20, "city": "Guadalajara", "bio": "Si te gusta stand-up, ya tenemos de qué platicar.", "intents": ["plan", "hobby"], "interests": ["Stand-up", "Inteligencia artificial", "Comedia", "Programación"], "hue": 235, "likesYou": true, "verified": true, "languages": ["Español"], "availability": "Fines de semana", "decoration": "uva", "frame": "aurora", "effect": "luciernagas", "nameStyle": "oro", "groupSizes": ["small"], "gender": "nonbinary"},
  {"id": "b13", "name": "Iván", "age": 23, "city": "Guadalajara", "bio": "Prometo buena plática y saber bastante de fotografía.", "intents": ["romance", "plan"], "interests": ["Fotografía", "Dibujo", "Tejido"], "hue": 145, "likesYou": false, "verified": false, "languages": ["Español"], "availability": "Cualquier día", "decoration": "escamas", "frame": "caramelo", "effect": "gemas", "nameStyle": "esmeralda", "groupSizes": ["duo", "small", "large"], "gender": "man"},
  {"id": "b14", "name": "Carla", "age": 21, "city": "Guadalajara", "bio": "Si te gusta gatos, ya tenemos de qué platicar.", "intents": ["romance"], "interests": ["Gatos", "Programación", "Emprendimiento"], "hue": 135, "likesYou": true, "verified": false, "languages": ["Español"], "availability": "Cualquier día", "decoration": "none", "frame": "cometa", "effect": "cafes", "nameStyle": "oro-cursiva", "groupSizes": ["duo", "small"], "gender": "woman"},
  {"id": "b15", "name": "Ximena", "age": 28, "city": "Guadalajara", "bio": "Recién llegué a Guadalajara. Me interesan cerveza artesanal y anime.", "intents": ["romance", "plan", "friend"], "interests": ["Cerveza artesanal", "Anime", "Cine de terror", "Café"], "hue": 43, "likesYou": false, "verified": true, "languages": ["Español", "Inglés"], "availability": "Cualquier día", "decoration": "puntos", "frame": "confeti", "effect": "nubes", "nameStyle": "cursiva", "groupSizes": ["small"], "gender": "woman"},
  {"id": "b16", "name": "Santiago", "age": 29, "city": "Guadalajara", "bio": "Me gusta todo lo que tenga que ver con diseño y poesía.", "intents": ["friend", "plan"], "interests": ["Diseño", "Poesía", "Senderismo", "Dibujo"], "hue": 173, "likesYou": false, "verified": true, "languages": ["Español"], "availability": "Cualquier día", "decoration": "halo", "frame": "noche", "effect": "lunas", "nameStyle": "rosa", "groupSizes": ["large"], "gender": "man"},
  {"id": "b17", "name": "Ana Sofía", "age": 42, "city": "Guadalajara", "bio": "Me gusta todo lo que tenga que ver con comida vegana y tacos.", "intents": ["plan", "hobby", "friend"], "interests": ["Comida vegana", "Tacos", "Vino", "Comedia", "K-dramas"], "hue": 210, "likesYou": true, "verified": false, "languages": ["Español", "Portugués"], "availability": "Entre semana", "decoration": "diamantes", "frame": "rosa", "effect": "nieve", "nameStyle": "cielo", "groupSizes": ["duo", "small"], "gender": "woman"},
  {"id": "b18", "name": "Brenda", "age": 29, "city": "Guadalajara", "bio": "Ando en busca de gente a la que también le guste rock.", "intents": ["plan", "friend"], "interests": ["Rock", "Karaoke", "Documentales", "Música en vivo", "Anime"], "hue": 284, "likesYou": true, "verified": true, "languages": ["Español", "Francés"], "availability": "Entre semana", "decoration": "sandia", "frame": "fuego", "effect": "gemas", "nameStyle": "esmeralda", "groupSizes": ["small", "large"], "gender": "woman"},
  {"id": "b19", "name": "Dani", "age": 35, "city": "Guadalajara", "bio": "Mi plan perfecto mezcla poesía, electrónica y una buena sobremesa.", "intents": ["romance", "friend", "hobby"], "interests": ["Poesía", "Electrónica", "Regional mexicano", "Museos"], "hue": 239, "likesYou": false, "verified": true, "languages": ["Español"], "availability": "Entre semana", "decoration": "rosa-polar", "frame": "rosa", "effect": "burbujas", "nameStyle": "uva", "groupSizes": ["duo"], "gender": "nonbinary"},
  {"id": "b20", "name": "Sebastián", "age": 33, "city": "Guadalajara", "bio": "Si te gusta stand-up, ya tenemos de qué platicar.", "intents": ["friend"], "interests": ["Stand-up", "Cocina", "Comedia", "Mercados", "K-dramas"], "hue": 142, "likesYou": false, "verified": false, "languages": ["Español"], "availability": "Fines de semana", "decoration": "ondas", "frame": "menta", "effect": "luciernagas", "nameStyle": "cursiva", "groupSizes": ["duo"], "gender": "man"},
  {"id": "b21", "name": "Nayeli", "age": 25, "city": "Guadalajara", "bio": "Si te gusta escritura, ya tenemos de qué platicar.", "intents": ["romance", "friend"], "interests": ["Escritura", "Trivia", "Videojuegos"], "hue": 118, "likesYou": true, "verified": true, "languages": ["Español", "Inglés"], "availability": "Cualquier día", "decoration": "tartan", "frame": "petalos", "effect": "nieve", "nameStyle": "lavanda-cursiva", "groupSizes": ["small"], "gender": "woman"},
  {"id": "b22", "name": "Cris", "age": 29, "city": "Guadalajara", "bio": "Entre semana trabajo; los fines son para ciclismo y natación.", "intents": ["friend", "plan", "hobby"], "interests": ["Ciclismo", "Natación", "Voluntariado", "Futbol", "Pilates"], "hue": 226, "likesYou": true, "verified": true, "languages": ["Español", "Inglés"], "availability": "Fines de semana", "decoration": "sandia", "frame": "noche", "effect": "destellos", "nameStyle": "lavanda", "groupSizes": ["small"], "gender": "nonbinary"},
  {"id": "b23", "name": "Héctor", "age": 38, "city": "Guadalajara", "bio": "Meditación y boliche son lo mío. Busco con quién compartirlos.", "intents": ["plan", "hobby"], "interests": ["Meditación", "Boliche", "Trivia"], "hue": 173, "likesYou": true, "verified": true, "languages": ["Español", "Inglés", "Francés"], "availability": "Cualquier día", "decoration": "caramelo", "frame": "hilo", "effect": "notas", "nameStyle": "rosa", "groupSizes": ["duo"], "gender": "man"},
  {"id": "b24", "name": "Marco", "age": 24, "city": "Guadalajara", "bio": "Mi plan perfecto mezcla pueblos mágicos, cine y una buena sobremesa.", "intents": ["plan"], "interests": ["Pueblos mágicos", "Cine", "Series", "Stand-up", "Perros"], "hue": 126, "likesYou": true, "verified": false, "languages": ["Español", "Japonés"], "availability": "Entre semana", "decoration": "confetti", "frame": "noche", "effect": "destellos", "nameStyle": "none", "groupSizes": ["large"], "gender": "man"},
  {"id": "b25", "name": "Lorena", "age": 37, "city": "Guadalajara", "bio": "Si te gusta museos, ya tenemos de qué platicar.", "intents": ["plan", "friend"], "interests": ["Museos", "Idiomas", "Moda"], "hue": 96, "likesYou": true, "verified": true, "languages": ["Español"], "availability": "Cualquier día", "decoration": "ondas", "frame": "menta", "effect": "destellos", "nameStyle": "uva", "groupSizes": ["duo", "small"], "gender": "woman"},
  {"id": "b26", "name": "Daniela", "age": 29, "city": "Guadalajara", "bio": "Entre semana trabajo; los fines son para escritura y fotografía.", "intents": ["plan", "friend"], "interests": ["Escritura", "Fotografía", "Idiomas", "Caminar", "Pintura"], "hue": 72, "likesYou": true, "verified": false, "languages": ["Español"], "availability": "Cualquier día", "decoration": "none", "frame": "hilo", "effect": "hojas", "nameStyle": "oro-cursiva", "groupSizes": ["duo"], "gender": "woman"},
  {"id": "b27", "name": "Arturo", "age": 32, "city": "Guadalajara", "bio": "Mi plan perfecto mezcla música en vivo, tocar guitarra y una buena sobremesa.", "intents": ["friend", "plan", "hobby"], "interests": ["Música en vivo", "Tocar guitarra", "Inteligencia artificial", "Ciencia"], "hue": 9, "likesYou": false, "verified": false, "languages": ["Español", "Francés"], "availability": "Fines de semana", "decoration": "bosque", "frame": "plata", "effect": "none", "nameStyle": "menta", "groupSizes": ["small"], "gender": "man"},
  {"id": "b28", "name": "Julia", "age": 34, "city": "Guadalajara", "bio": "Me gusta todo lo que tenga que ver con inteligencia artificial y anime.", "intents": ["hobby", "friend"], "interests": ["Inteligencia artificial", "Anime", "Ciencia", "Teatro"], "hue": 161, "likesYou": true, "verified": false, "languages": ["Español", "Inglés"], "availability": "Cualquier día", "decoration": "sol", "frame": "selva", "effect": "nieve", "nameStyle": "uva", "groupSizes": ["small"], "gender": "woman"},
  {"id": "b29", "name": "Gael", "age": 37, "city": "Guadalajara", "bio": "Si te gusta pop, ya tenemos de qué platicar.", "intents": ["hobby", "romance", "plan"], "interests": ["Pop", "Ajedrez", "Boliche", "Conciertos"], "hue": 127, "likesYou": true, "verified": false, "languages": ["Español", "Portugués"], "availability": "Entre semana", "decoration": "dusk", "frame": "none", "effect": "cafes", "nameStyle": "cielo", "groupSizes": ["small"], "gender": "man"},
  {"id": "b30", "name": "Natalia", "age": 25, "city": "Guadalajara", "bio": "Karaoke y senderismo son lo mío. Busco con quién compartirlos.", "intents": ["plan", "friend", "hobby"], "interests": ["Karaoke", "Senderismo", "Jardinería", "Conciertos", "Tocar guitarra"], "hue": 67, "likesYou": false, "verified": true, "languages": ["Español"], "availability": "Cualquier día", "decoration": "galaxia", "frame": "halo", "effect": "plumas", "nameStyle": "coral", "groupSizes": ["large"], "gender": "woman"},
  {"id": "b31", "name": "Ari", "age": 33, "city": "Guadalajara", "bio": "Entre semana trabajo; los fines son para videojuegos y juegos de mesa.", "intents": ["friend"], "interests": ["Videojuegos", "Juegos de mesa", "Meditación", "Caminar"], "hue": 284, "likesYou": true, "verified": false, "languages": ["Español"], "availability": "Fines de semana", "decoration": "zigzag", "frame": "caramelo", "effect": "nubes", "nameStyle": "esmeralda", "groupSizes": ["large"], "gender": "nonbinary"},
  {"id": "b32", "name": "Rodrigo", "age": 26, "city": "Guadalajara", "bio": "Prometo buena plática y saber bastante de sushi.", "intents": ["friend", "romance"], "interests": ["Sushi", "Voleibol", "Box", "Mercados"], "hue": 313, "likesYou": false, "verified": true, "languages": ["Español"], "availability": "Cualquier día", "decoration": "mandarina", "frame": "arcoiris", "effect": "destellos", "nameStyle": "lavanda", "groupSizes": ["large"], "gender": "man"},
  {"id": "b33", "name": "Joaquín", "age": 38, "city": "Monterrey", "bio": "Prometo buena plática y saber bastante de series.", "intents": ["hobby"], "interests": ["Series", "K-dramas", "Pádel"], "hue": 265, "likesYou": false, "verified": true, "languages": ["Español"], "availability": "Entre semana", "decoration": "aurora", "frame": "rayitas", "effect": "none", "nameStyle": "menta", "groupSizes": ["small"], "gender": "man"},
  {"id": "b34", "name": "Andrea", "age": 26, "city": "Querétaro", "bio": "Ando en busca de gente a la que también le guste podcasts.", "intents": ["romance", "friend", "plan"], "interests": ["Podcasts", "Historia", "Programación", "Cómics"], "hue": 53, "likesYou": true, "verified": false, "languages": ["Español"], "availability": "Fines de semana", "decoration": "neon-noche", "frame": "selva", "effect": "none", "nameStyle": "rosa", "groupSizes": ["duo", "small", "large"], "gender": "woman"},
  {"id": "b35", "name": "Fernanda", "age": 37, "city": "Puebla", "bio": "Recién llegué a Puebla. Me interesan documentales y series.", "intents": ["friend", "romance", "plan"], "interests": ["Documentales", "Series", "Rol", "Stand-up"], "hue": 157, "likesYou": false, "verified": true, "languages": ["Español", "Inglés", "Japonés"], "availability": "Entre semana", "decoration": "rosa-polar", "frame": "none", "effect": "none", "nameStyle": "none", "groupSizes": ["duo"], "gender": "woman"},
  {"id": "b36", "name": "Montserrat", "age": 39, "city": "Ciudad de México", "bio": "Me gusta todo lo que tenga que ver con escalada y basquetbol.", "intents": ["friend"], "interests": ["Escalada", "Basquetbol", "Tenis"], "hue": 44, "likesYou": false, "verified": false, "languages": ["Español", "Portugués"], "availability": "Entre semana", "decoration": "tormenta", "frame": "dusk", "effect": "hojas", "nameStyle": "rosa", "groupSizes": ["large"], "gender": "woman"},
  {"id": "b37", "name": "Emilio", "age": 32, "city": "Monterrey", "bio": "Ando en busca de gente a la que también le guste vino.", "intents": ["hobby"], "interests": ["Vino", "Senderismo", "Café", "Perros", "Playa"], "hue": 0, "likesYou": true, "verified": true, "languages": ["Español"], "availability": "Entre semana", "decoration": "mandarina", "frame": "orbita", "effect": "destellos", "nameStyle": "cielo", "groupSizes": ["duo", "small", "large"], "gender": "man"},
  {"id": "b38", "name": "Sam", "age": 27, "city": "Querétaro", "bio": "Si te gusta música en vivo, ya tenemos de qué platicar.", "intents": ["friend", "plan", "romance"], "interests": ["Música en vivo", "Anime", "Tocar guitarra"], "hue": 219, "likesYou": false, "verified": true, "languages": ["Español", "Francés"], "availability": "Fines de semana", "decoration": "tormenta", "frame": "rayitas", "effect": "none", "nameStyle": "oro", "groupSizes": ["small", "large"], "gender": "nonbinary"},
  {"id": "b39", "name": "Ulises", "age": 29, "city": "Puebla", "bio": "Recién llegué a Puebla. Me interesan documentales y escritura.", "intents": ["hobby", "friend"], "interests": ["Documentales", "Escritura", "Cerámica"], "hue": 96, "likesYou": true, "verified": false, "languages": ["Español"], "availability": "Entre semana", "decoration": "lavanda", "frame": "plata", "effect": "nubes", "nameStyle": "none", "groupSizes": ["small"], "gender": "man"},
  {"id": "b40", "name": "Mateo", "age": 39, "city": "Ciudad de México", "bio": "Ando en busca de gente a la que también le guste robótica.", "intents": ["plan", "hobby", "friend"], "interests": ["Robótica", "Ciencia", "Pádel", "Natación"], "hue": 63, "likesYou": true, "verified": true, "languages": ["Español"], "availability": "Fines de semana", "decoration": "eclipse", "frame": "lucero", "effect": "nubes", "nameStyle": "esmeralda", "groupSizes": ["duo", "small", "large"], "gender": "man"},
  {"id": "b41", "name": "Lucía", "age": 39, "city": "Monterrey", "bio": "Me gusta todo lo que tenga que ver con emprendimiento y viajes.", "intents": ["romance", "hobby"], "interests": ["Emprendimiento", "Viajes", "Programación", "Playa"], "hue": 189, "likesYou": true, "verified": true, "languages": ["Español", "Francés"], "availability": "Cualquier día", "decoration": "ink", "frame": "fuego", "effect": "burbujas", "nameStyle": "rosa-cursiva", "groupSizes": ["duo"], "gender": "woman"},
  {"id": "b42", "name": "Raúl", "age": 39, "city": "Querétaro", "bio": "Ajedrez y ciencia son lo mío. Busco con quién compartirlos.", "intents": ["plan", "friend", "hobby"], "interests": ["Ajedrez", "Ciencia", "Programación", "Rol"], "hue": 98, "likesYou": true, "verified": true, "languages": ["Español"], "availability": "Entre semana", "decoration": "mandarina", "frame": "hielo", "effect": "gemas", "nameStyle": "cielo", "groupSizes": ["large"], "gender": "man"},
  {"id": "b43", "name": "Paola", "age": 35, "city": "Puebla", "bio": "Ando en busca de gente a la que también le guste basquetbol.", "intents": ["friend", "romance", "plan"], "interests": ["Basquetbol", "Tenis", "Comida vegana", "Patinaje"], "hue": 176, "likesYou": false, "verified": true, "languages": ["Español"], "availability": "Entre semana", "decoration": "marea", "frame": "caramelo", "effect": "lunas", "nameStyle": "rosa", "groupSizes": ["small", "large"], "gender": "woman"},
  {"id": "b44", "name": "Regina", "age": 26, "city": "Ciudad de México", "bio": "Mi plan perfecto mezcla idiomas, voluntariado y una buena sobremesa.", "intents": ["hobby"], "interests": ["Idiomas", "Voluntariado", "Electrónica", "Pilates", "Pop"], "hue": 71, "likesYou": true, "verified": true, "languages": ["Español", "Portugués"], "availability": "Entre semana", "decoration": "tartan", "frame": "menta", "effect": "cafes", "nameStyle": "none", "groupSizes": ["small", "large"], "gender": "woman"},
]

export const BOT_DETAILS: Record<string, PersonDetails> = {
  "b01": {
    "occupation": "Veterinaria",
    "education": "UAG",
    "memberSince": "Desde enero de 2026",
    "prompts": [
      {
        "q": "Busco a alguien que",
        "a": "Se ría fácil y proponga planes."
      },
      {
        "q": "No puedo dejar de hablar de",
        "a": "El viaje que estoy planeando."
      },
      {
        "q": "Lo último que me hizo reír",
        "a": "Perderme en mi propia colonia."
      }
    ],
    "favorites": {
      "music": "Los Ángeles Azules",
      "movie": "Shrek",
      "food": "Chilaquiles"
    }
  },
  "b02": {
    "occupation": "Barista",
    "education": "UAG",
    "memberSince": "Desde septiembre de 2026",
    "prompts": [
      {
        "q": "Mi talento inútil",
        "a": "Doblar ropa en tiempo récord."
      },
      {
        "q": "Mi domingo perfecto",
        "a": "Dormir tarde y salir por tacos."
      },
      {
        "q": "Busco a alguien que",
        "a": "Quiera ir a lugares que nunca hemos probado."
      }
    ],
    "favorites": {
      "music": "Billie Eilish",
      "movie": "Parásitos",
      "food": "Tamales"
    }
  },
  "b03": {
    "occupation": "Psicóloga",
    "education": "UAG",
    "memberSince": "Desde febrero de 2026",
    "prompts": [
      {
        "q": "Te caeré bien si",
        "a": "Llegas con un buen chisme."
      },
      {
        "q": "Mi talento inútil",
        "a": "Silbar bastante bien."
      },
      {
        "q": "Lo último que me hizo reír",
        "a": "Un meme de gatos que no he superado."
      }
    ],
    "favorites": {
      "music": "Taylor Swift",
      "movie": "El laberinto del fauno",
      "food": "Pizza"
    }
  },
  "b04": {
    "occupation": "Veterinaria",
    "education": "Tec de Monterrey",
    "memberSince": "Desde septiembre de 2026",
    "prompts": [
      {
        "q": "Lo último que me hizo reír",
        "a": "Un meme de gatos que no he superado."
      },
      {
        "q": "No puedo dejar de hablar de",
        "a": "Mi perro y sus ocurrencias."
      },
      {
        "q": "Te caeré bien si",
        "a": "Compartes el postre."
      }
    ],
    "favorites": {
      "music": "Café Tacvba",
      "movie": "Interestelar",
      "food": "Hamburguesas"
    }
  },
  "b05": {
    "occupation": "Fotógrafo",
    "education": "CETI",
    "memberSince": "Desde febrero de 2026",
    "prompts": [
      {
        "q": "Te caeré bien si",
        "a": "No le tienes miedo al karaoke."
      },
      {
        "q": "No puedo dejar de hablar de",
        "a": "La última serie que vi."
      },
      {
        "q": "Mi talento inútil",
        "a": "Adivinar el final de cualquier película."
      }
    ],
    "favorites": {
      "music": "Zoé",
      "movie": "Mamma Mia",
      "food": "Ramen"
    }
  },
  "b06": {
    "occupation": "Vendedor de bienes raíces",
    "education": "BUAP",
    "memberSince": "Desde agosto de 2026",
    "prompts": [
      {
        "q": "Te caeré bien si",
        "a": "Compartes el postre."
      },
      {
        "q": "Mi talento inútil",
        "a": "Adivinar el final de cualquier película."
      },
      {
        "q": "Busco a alguien que",
        "a": "No cancele a última hora."
      }
    ],
    "favorites": {
      "music": "Julieta Venegas",
      "movie": "Coco",
      "food": "Tamales"
    }
  },
  "b07": {
    "occupation": "Maestra de primaria",
    "education": "Tec de Monterrey",
    "memberSince": "Desde marzo de 2026",
    "prompts": [
      {
        "q": "Busco a alguien que",
        "a": "Quiera ir a lugares que nunca hemos probado."
      },
      {
        "q": "Te caeré bien si",
        "a": "Te gustan las caminatas largas."
      },
      {
        "q": "Mi domingo perfecto",
        "a": "Desayuno largo y una caminata sin prisa."
      }
    ],
    "favorites": {
      "music": "Arctic Monkeys",
      "movie": "Pulp Fiction",
      "food": "Hamburguesas"
    }
  },
  "b08": {
    "occupation": "Analista de datos",
    "education": "ITESO",
    "memberSince": "Desde julio de 2026",
    "prompts": [
      {
        "q": "Busco a alguien que",
        "a": "Quiera ir a lugares que nunca hemos probado."
      },
      {
        "q": "Mi talento inútil",
        "a": "Doblar ropa en tiempo récord."
      },
      {
        "q": "Lo último que me hizo reír",
        "a": "Un meme de gatos que no he superado."
      }
    ],
    "favorites": {
      "music": "Dua Lipa",
      "movie": "Mamma Mia",
      "food": "Tortas ahogadas"
    }
  },
  "b09": {
    "occupation": "Diseñadora de producto",
    "education": "UAG",
    "memberSince": "Desde junio de 2026",
    "prompts": [
      {
        "q": "Te caeré bien si",
        "a": "Compartes el postre."
      },
      {
        "q": "Mi talento inútil",
        "a": "Recordar letras de canciones de los noventa."
      },
      {
        "q": "Lo último que me hizo reír",
        "a": "Un meme de gatos que no he superado."
      }
    ],
    "favorites": {
      "music": "Taylor Swift",
      "movie": "El laberinto del fauno",
      "food": "Pozole"
    }
  },
  "b10": {
    "occupation": "Contador",
    "education": "IPN",
    "memberSince": "Desde enero de 2026",
    "prompts": [
      {
        "q": "Busco a alguien que",
        "a": "Me recomiende música nueva."
      },
      {
        "q": "Mi domingo perfecto",
        "a": "Bici por la ciudad y café al final."
      },
      {
        "q": "No puedo dejar de hablar de",
        "a": "El viaje que estoy planeando."
      }
    ],
    "favorites": {
      "music": "Siddhartha",
      "movie": "Toy Story",
      "food": "Tacos al pastor"
    }
  },
  "b11": {
    "occupation": "Mecánico automotriz",
    "education": "UAG",
    "memberSince": "Desde septiembre de 2026",
    "prompts": [
      {
        "q": "Lo último que me hizo reír",
        "a": "Perderme en mi propia colonia."
      },
      {
        "q": "Mi talento inútil",
        "a": "Adivinar el final de cualquier película."
      },
      {
        "q": "Te caeré bien si",
        "a": "No le tienes miedo al karaoke."
      }
    ],
    "favorites": {
      "music": "Arctic Monkeys",
      "movie": "Mamma Mia",
      "food": "Tamales"
    }
  },
  "b12": {
    "occupation": "Fotógrafo",
    "education": "Tec de Monterrey",
    "memberSince": "Desde enero de 2026",
    "prompts": [
      {
        "q": "Mi domingo perfecto",
        "a": "Mercado temprano y cocinar algo nuevo."
      },
      {
        "q": "No puedo dejar de hablar de",
        "a": "Los mejores tacos de la ciudad."
      },
      {
        "q": "Busco a alguien que",
        "a": "Se ría fácil y proponga planes."
      }
    ],
    "favorites": {
      "music": "Zoé",
      "movie": "Parásitos",
      "food": "Hamburguesas"
    }
  },
  "b13": {
    "occupation": "Ilustradora",
    "education": "UNAM",
    "memberSince": "Desde febrero de 2026",
    "prompts": [
      {
        "q": "Te caeré bien si",
        "a": "Te gustan las caminatas largas."
      },
      {
        "q": "Busco a alguien que",
        "a": "Se ría fácil y proponga planes."
      },
      {
        "q": "Mi domingo perfecto",
        "a": "Dormir tarde y salir por tacos."
      }
    ],
    "favorites": {
      "music": "Dua Lipa",
      "movie": "Shrek",
      "food": "Pozole"
    }
  },
  "b14": {
    "occupation": "Ingeniero civil",
    "education": "BUAP",
    "memberSince": "Desde abril de 2026",
    "prompts": [
      {
        "q": "Mi domingo perfecto",
        "a": "Desayuno largo y una caminata sin prisa."
      },
      {
        "q": "Mi talento inútil",
        "a": "Adivinar el final de cualquier película."
      },
      {
        "q": "No puedo dejar de hablar de",
        "a": "El viaje que estoy planeando."
      }
    ],
    "favorites": {
      "music": "Natalia Lafourcade",
      "movie": "Pulp Fiction",
      "food": "Tamales"
    }
  },
  "b15": {
    "occupation": "Maestra de primaria",
    "education": "Universidad Autónoma de Querétaro",
    "memberSince": "Desde mayo de 2026",
    "prompts": [
      {
        "q": "Mi domingo perfecto",
        "a": "Mercado temprano y cocinar algo nuevo."
      },
      {
        "q": "Te caeré bien si",
        "a": "No le tienes miedo al karaoke."
      },
      {
        "q": "Lo último que me hizo reír",
        "a": "Perderme en mi propia colonia."
      }
    ],
    "favorites": {
      "music": "Bad Bunny",
      "movie": "Interestelar",
      "food": "Ramen"
    }
  },
  "b16": {
    "occupation": "Ilustradora",
    "education": "ITESO",
    "memberSince": "Desde junio de 2026",
    "prompts": [
      {
        "q": "Mi domingo perfecto",
        "a": "Bici por la ciudad y café al final."
      },
      {
        "q": "Mi talento inútil",
        "a": "Doblar ropa en tiempo récord."
      },
      {
        "q": "Te caeré bien si",
        "a": "Te gustan las caminatas largas."
      }
    ],
    "favorites": {
      "music": "Natalia Lafourcade",
      "movie": "El laberinto del fauno",
      "food": "Tacos al pastor"
    }
  },
  "b17": {
    "occupation": "Arquitecta",
    "education": "Universidad Panamericana",
    "memberSince": "Desde julio de 2026",
    "prompts": [
      {
        "q": "No puedo dejar de hablar de",
        "a": "Mi perro y sus ocurrencias."
      },
      {
        "q": "Lo último que me hizo reír",
        "a": "Perderme en mi propia colonia."
      },
      {
        "q": "Te caeré bien si",
        "a": "Llegas con un buen chisme."
      }
    ],
    "favorites": {
      "music": "Billie Eilish",
      "movie": "Pulp Fiction",
      "food": "Tortas ahogadas"
    }
  },
  "b18": {
    "occupation": "Estudiante de medicina",
    "education": "Universidad de Guadalajara",
    "memberSince": "Desde agosto de 2026",
    "prompts": [
      {
        "q": "Busco a alguien que",
        "a": "Me recomiende música nueva."
      },
      {
        "q": "Mi talento inútil",
        "a": "Doblar ropa en tiempo récord."
      },
      {
        "q": "No puedo dejar de hablar de",
        "a": "Mi perro y sus ocurrencias."
      }
    ],
    "favorites": {
      "music": "Dua Lipa",
      "movie": "Spirited Away",
      "food": "Hamburguesas"
    }
  },
  "b19": {
    "occupation": "Mecánico automotriz",
    "education": "Universidad de Guadalajara",
    "memberSince": "Desde enero de 2026",
    "prompts": [
      {
        "q": "Lo último que me hizo reír",
        "a": "Mi abuela intentando usar el celular."
      },
      {
        "q": "Mi talento inútil",
        "a": "Adivinar el final de cualquier película."
      },
      {
        "q": "Mi domingo perfecto",
        "a": "Desayuno largo y una caminata sin prisa."
      }
    ],
    "favorites": {
      "music": "Dua Lipa",
      "movie": "Interestelar",
      "food": "Enchiladas"
    }
  },
  "b20": {
    "occupation": "Diseñadora de producto",
    "education": "UNAM",
    "memberSince": "Desde agosto de 2026",
    "prompts": [
      {
        "q": "Mi talento inútil",
        "a": "Silbar bastante bien."
      },
      {
        "q": "No puedo dejar de hablar de",
        "a": "La última serie que vi."
      },
      {
        "q": "Mi domingo perfecto",
        "a": "Mercado temprano y cocinar algo nuevo."
      }
    ],
    "favorites": {
      "music": "Taylor Swift",
      "movie": "Pulp Fiction",
      "food": "Tortas ahogadas"
    }
  },
  "b21": {
    "occupation": "Vendedor de bienes raíces",
    "education": "Tec de Monterrey",
    "memberSince": "Desde julio de 2026",
    "prompts": [
      {
        "q": "Mi talento inútil",
        "a": "Recordar letras de canciones de los noventa."
      },
      {
        "q": "Lo último que me hizo reír",
        "a": "Mi abuela intentando usar el celular."
      },
      {
        "q": "Mi domingo perfecto",
        "a": "Desayuno largo y una caminata sin prisa."
      }
    ],
    "favorites": {
      "music": "Siddhartha",
      "movie": "Toy Story",
      "food": "Tortas ahogadas"
    }
  },
  "b22": {
    "occupation": "Analista de datos",
    "education": "ITESO",
    "memberSince": "Desde enero de 2026",
    "prompts": [
      {
        "q": "Mi talento inútil",
        "a": "Silbar bastante bien."
      },
      {
        "q": "No puedo dejar de hablar de",
        "a": "Mi perro y sus ocurrencias."
      },
      {
        "q": "Te caeré bien si",
        "a": "Compartes el postre."
      }
    ],
    "favorites": {
      "music": "Billie Eilish",
      "movie": "Amores perros",
      "food": "Pizza"
    }
  },
  "b23": {
    "occupation": "Diseñadora de producto",
    "education": "UNAM",
    "memberSince": "Desde febrero de 2026",
    "prompts": [
      {
        "q": "Lo último que me hizo reír",
        "a": "Un mal chiste en una obra de teatro."
      },
      {
        "q": "Te caeré bien si",
        "a": "Llegas con un buen chisme."
      },
      {
        "q": "Mi domingo perfecto",
        "a": "Bici por la ciudad y café al final."
      }
    ],
    "favorites": {
      "music": "Natalia Lafourcade",
      "movie": "Volver al futuro",
      "food": "Mole"
    }
  },
  "b24": {
    "occupation": "Contador",
    "education": "UAG",
    "memberSince": "Desde agosto de 2026",
    "prompts": [
      {
        "q": "Te caeré bien si",
        "a": "Llegas con un buen chisme."
      },
      {
        "q": "Mi domingo perfecto",
        "a": "Dormir tarde y salir por tacos."
      },
      {
        "q": "Busco a alguien que",
        "a": "No cancele a última hora."
      }
    ],
    "favorites": {
      "music": "Café Tacvba",
      "movie": "Volver al futuro",
      "food": "Mole"
    }
  },
  "b25": {
    "occupation": "Veterinaria",
    "education": "UNAM",
    "memberSince": "Desde agosto de 2026",
    "prompts": [
      {
        "q": "Mi domingo perfecto",
        "a": "Mercado temprano y cocinar algo nuevo."
      },
      {
        "q": "Lo último que me hizo reír",
        "a": "Un meme de gatos que no he superado."
      },
      {
        "q": "Te caeré bien si",
        "a": "Compartes el postre."
      }
    ],
    "favorites": {
      "music": "Taylor Swift",
      "movie": "El laberinto del fauno",
      "food": "Tacos al pastor"
    }
  },
  "b26": {
    "occupation": "Desarrolladora web",
    "education": "BUAP",
    "memberSince": "Desde mayo de 2026",
    "prompts": [
      {
        "q": "No puedo dejar de hablar de",
        "a": "La última serie que vi."
      },
      {
        "q": "Mi talento inútil",
        "a": "Adivinar el final de cualquier película."
      },
      {
        "q": "Lo último que me hizo reír",
        "a": "Un meme de gatos que no he superado."
      }
    ],
    "favorites": {
      "music": "Zoé",
      "movie": "Spirited Away",
      "food": "Mole"
    }
  },
  "b27": {
    "occupation": "Psicóloga",
    "education": "BUAP",
    "memberSince": "Desde junio de 2026",
    "prompts": [
      {
        "q": "Mi talento inútil",
        "a": "Silbar bastante bien."
      },
      {
        "q": "Mi domingo perfecto",
        "a": "Dormir tarde y salir por tacos."
      },
      {
        "q": "Te caeré bien si",
        "a": "No le tienes miedo al karaoke."
      }
    ],
    "favorites": {
      "music": "Julieta Venegas",
      "movie": "Coco",
      "food": "Hamburguesas"
    }
  },
  "b28": {
    "occupation": "Veterinaria",
    "education": "Tec de Monterrey",
    "memberSince": "Desde octubre de 2026",
    "prompts": [
      {
        "q": "Te caeré bien si",
        "a": "No le tienes miedo al karaoke."
      },
      {
        "q": "Mi talento inútil",
        "a": "Recordar letras de canciones de los noventa."
      },
      {
        "q": "Busco a alguien que",
        "a": "Quiera ir a lugares que nunca hemos probado."
      }
    ],
    "favorites": {
      "music": "Billie Eilish",
      "movie": "Toy Story",
      "food": "Tortas ahogadas"
    }
  },
  "b29": {
    "occupation": "Desarrolladora web",
    "education": "IPN",
    "memberSince": "Desde julio de 2026",
    "prompts": [
      {
        "q": "Mi talento inútil",
        "a": "Recordar letras de canciones de los noventa."
      },
      {
        "q": "Te caeré bien si",
        "a": "Te gustan las caminatas largas."
      },
      {
        "q": "Lo último que me hizo reír",
        "a": "Mi abuela intentando usar el celular."
      }
    ],
    "favorites": {
      "music": "Arctic Monkeys",
      "movie": "Volver al futuro",
      "food": "Ramen"
    }
  },
  "b30": {
    "occupation": "Barista",
    "education": "Tec de Monterrey",
    "memberSince": "Desde mayo de 2026",
    "prompts": [
      {
        "q": "Busco a alguien que",
        "a": "Quiera ir a lugares que nunca hemos probado."
      },
      {
        "q": "No puedo dejar de hablar de",
        "a": "Mi perro y sus ocurrencias."
      },
      {
        "q": "Te caeré bien si",
        "a": "Compartes el postre."
      }
    ],
    "favorites": {
      "music": "Siddhartha",
      "movie": "Spirited Away",
      "food": "Pizza"
    }
  },
  "b31": {
    "occupation": "Ilustradora",
    "education": "Tec de Monterrey",
    "memberSince": "Desde junio de 2026",
    "prompts": [
      {
        "q": "No puedo dejar de hablar de",
        "a": "El viaje que estoy planeando."
      },
      {
        "q": "Mi talento inútil",
        "a": "Recordar letras de canciones de los noventa."
      },
      {
        "q": "Lo último que me hizo reír",
        "a": "Un mal chiste en una obra de teatro."
      }
    ],
    "favorites": {
      "music": "Taylor Swift",
      "movie": "Toy Story",
      "food": "Chilaquiles"
    }
  },
  "b32": {
    "occupation": "Ilustradora",
    "education": "Universidad Panamericana",
    "memberSince": "Desde octubre de 2026",
    "prompts": [
      {
        "q": "Te caeré bien si",
        "a": "No le tienes miedo al karaoke."
      },
      {
        "q": "Busco a alguien que",
        "a": "No cancele a última hora."
      },
      {
        "q": "Mi talento inútil",
        "a": "Doblar ropa en tiempo récord."
      }
    ],
    "favorites": {
      "music": "Siddhartha",
      "movie": "Amores perros",
      "food": "Sushi"
    }
  },
  "b33": {
    "occupation": "Contador",
    "education": "Universidad de Guadalajara",
    "memberSince": "Desde octubre de 2026",
    "prompts": [
      {
        "q": "Busco a alguien que",
        "a": "No cancele a última hora."
      },
      {
        "q": "Lo último que me hizo reír",
        "a": "Mi abuela intentando usar el celular."
      },
      {
        "q": "Mi domingo perfecto",
        "a": "Bici por la ciudad y café al final."
      }
    ],
    "favorites": {
      "music": "Taylor Swift",
      "movie": "Spirited Away",
      "food": "Chilaquiles"
    }
  },
  "b34": {
    "occupation": "Músico",
    "education": "UNAM",
    "memberSince": "Desde febrero de 2026",
    "prompts": [
      {
        "q": "Te caeré bien si",
        "a": "Te gustan las caminatas largas."
      },
      {
        "q": "Mi talento inútil",
        "a": "Adivinar el final de cualquier película."
      },
      {
        "q": "No puedo dejar de hablar de",
        "a": "El viaje que estoy planeando."
      }
    ],
    "favorites": {
      "music": "Taylor Swift",
      "movie": "Interestelar",
      "food": "Pizza"
    }
  },
  "b35": {
    "occupation": "Maestra de primaria",
    "education": "Universidad de Guadalajara",
    "memberSince": "Desde enero de 2026",
    "prompts": [
      {
        "q": "Te caeré bien si",
        "a": "Te gustan las caminatas largas."
      },
      {
        "q": "Busco a alguien que",
        "a": "No cancele a última hora."
      },
      {
        "q": "No puedo dejar de hablar de",
        "a": "La última serie que vi."
      }
    ],
    "favorites": {
      "music": "Los Ángeles Azules",
      "movie": "El laberinto del fauno",
      "food": "Tamales"
    }
  },
  "b36": {
    "occupation": "Diseñadora de producto",
    "education": "CETI",
    "memberSince": "Desde mayo de 2026",
    "prompts": [
      {
        "q": "No puedo dejar de hablar de",
        "a": "El viaje que estoy planeando."
      },
      {
        "q": "Mi talento inútil",
        "a": "Recordar letras de canciones de los noventa."
      },
      {
        "q": "Lo último que me hizo reír",
        "a": "Perderme en mi propia colonia."
      }
    ],
    "favorites": {
      "music": "Arctic Monkeys",
      "movie": "Mean Girls",
      "food": "Hamburguesas"
    }
  },
  "b37": {
    "occupation": "Community manager",
    "education": "Universidad Panamericana",
    "memberSince": "Desde octubre de 2026",
    "prompts": [
      {
        "q": "Busco a alguien que",
        "a": "No cancele a última hora."
      },
      {
        "q": "Mi talento inútil",
        "a": "Doblar ropa en tiempo récord."
      },
      {
        "q": "No puedo dejar de hablar de",
        "a": "Mi perro y sus ocurrencias."
      }
    ],
    "favorites": {
      "music": "Los Ángeles Azules",
      "movie": "Mamma Mia",
      "food": "Mole"
    }
  },
  "b38": {
    "occupation": "Barista",
    "education": "Universidad Autónoma de Querétaro",
    "memberSince": "Desde junio de 2026",
    "prompts": [
      {
        "q": "No puedo dejar de hablar de",
        "a": "Mi perro y sus ocurrencias."
      },
      {
        "q": "Te caeré bien si",
        "a": "Llegas con un buen chisme."
      },
      {
        "q": "Busco a alguien que",
        "a": "Quiera ir a lugares que nunca hemos probado."
      }
    ],
    "favorites": {
      "music": "Los Ángeles Azules",
      "movie": "Parásitos",
      "food": "Chilaquiles"
    }
  },
  "b39": {
    "occupation": "Arquitecta",
    "education": "UNAM",
    "memberSince": "Desde febrero de 2026",
    "prompts": [
      {
        "q": "No puedo dejar de hablar de",
        "a": "La última serie que vi."
      },
      {
        "q": "Lo último que me hizo reír",
        "a": "Perderme en mi propia colonia."
      },
      {
        "q": "Mi talento inútil",
        "a": "Adivinar el final de cualquier película."
      }
    ],
    "favorites": {
      "music": "Peso Pluma",
      "movie": "Amores perros",
      "food": "Tacos al pastor"
    }
  },
  "b40": {
    "occupation": "Analista de datos",
    "education": "IPN",
    "memberSince": "Desde agosto de 2026",
    "prompts": [
      {
        "q": "Lo último que me hizo reír",
        "a": "Un meme de gatos que no he superado."
      },
      {
        "q": "Busco a alguien que",
        "a": "Quiera ir a lugares que nunca hemos probado."
      },
      {
        "q": "No puedo dejar de hablar de",
        "a": "Mi perro y sus ocurrencias."
      }
    ],
    "favorites": {
      "music": "Dua Lipa",
      "movie": "Shrek",
      "food": "Tacos al pastor"
    }
  },
  "b41": {
    "occupation": "Ingeniero civil",
    "education": "Universidad Panamericana",
    "memberSince": "Desde mayo de 2026",
    "prompts": [
      {
        "q": "Lo último que me hizo reír",
        "a": "Un mal chiste en una obra de teatro."
      },
      {
        "q": "Te caeré bien si",
        "a": "Llegas con un buen chisme."
      },
      {
        "q": "No puedo dejar de hablar de",
        "a": "La última serie que vi."
      }
    ],
    "favorites": {
      "music": "Julieta Venegas",
      "movie": "El laberinto del fauno",
      "food": "Tortas ahogadas"
    }
  },
  "b42": {
    "occupation": "Fotógrafo",
    "education": "UNAM",
    "memberSince": "Desde mayo de 2026",
    "prompts": [
      {
        "q": "Te caeré bien si",
        "a": "Llegas con un buen chisme."
      },
      {
        "q": "Busco a alguien que",
        "a": "Me recomiende música nueva."
      },
      {
        "q": "Mi talento inútil",
        "a": "Silbar bastante bien."
      }
    ],
    "favorites": {
      "music": "Dua Lipa",
      "movie": "Toy Story",
      "food": "Mole"
    }
  },
  "b43": {
    "occupation": "Abogado",
    "education": "Tec de Monterrey",
    "memberSince": "Desde agosto de 2026",
    "prompts": [
      {
        "q": "Mi domingo perfecto",
        "a": "Mercado temprano y cocinar algo nuevo."
      },
      {
        "q": "Te caeré bien si",
        "a": "No le tienes miedo al karaoke."
      },
      {
        "q": "Busco a alguien que",
        "a": "No cancele a última hora."
      }
    ],
    "favorites": {
      "music": "Peso Pluma",
      "movie": "Spirited Away",
      "food": "Sushi"
    }
  },
  "b44": {
    "occupation": "Estudiante de medicina",
    "education": "IPN",
    "memberSince": "Desde octubre de 2026",
    "prompts": [
      {
        "q": "Te caeré bien si",
        "a": "Llegas con un buen chisme."
      },
      {
        "q": "Mi domingo perfecto",
        "a": "Mercado temprano y cocinar algo nuevo."
      },
      {
        "q": "Busco a alguien que",
        "a": "Quiera ir a lugares que nunca hemos probado."
      }
    ],
    "favorites": {
      "music": "Arctic Monkeys",
      "movie": "Volver al futuro",
      "food": "Tortas ahogadas"
    }
  }
}

export const BOT_PLANS: Plan[] = [
  {"id": "bpl1", "title": "Boliche y alitas", "description": "Nadie juega bien, ese es el chiste. Pagamos por línea.", "place": "Boliche Plaza del Sol", "when": "Viernes 20:00", "hostId": "b04", "intent": "friend", "capacity": 6, "attendees": ["b04", "b05", "b12", "b24", "b02", "b03"], "audience": "any", "photo": {"src": "/fotos/juegos.webp", "alt": "Dos personas juegan un juego de mesa", "credit": "2H Media"}},
  {"id": "bpl2", "title": "Senderismo en el Bosque de la Primavera", "description": "Ruta de 8 km, nivel tranquilo. Lleva agua y bloqueador.", "place": "Entrada Río Caliente", "when": "Domingo 7:30", "hostId": "b07", "intent": "plan", "capacity": 12, "attendees": ["b07", "b22", "b26", "b04", "b17", "b16", "b28", "b25", "b05", "b02"], "audience": "any", "photo": {"src": "/fotos/correr.webp", "alt": "Tres personas corren por una banqueta soleada", "credit": "Nathan Nuyda"}},
  {"id": "bpl3", "title": "Karaoke de los noventa", "description": "Solo canciones de los noventa. Se vale desafinar.", "place": "Bar Karaoke Chapultepec", "when": "Sábado 21:00", "hostId": "b10", "intent": "friend", "capacity": 8, "attendees": ["b10", "b09", "b11", "b04", "b28", "b22", "b12"], "audience": "interests", "photo": {"src": "/fotos/concierto.webp", "alt": "Público frente a un escenario iluminado", "credit": "Yvette de Wit"}},
  {"id": "bpl4", "title": "Clase de cerámica", "description": "Una tarde de barro y plática. El taller incluye material.", "place": "Taller Barro Vivo, Americana", "when": "Miércoles 18:30", "hostId": "b13", "intent": "hobby", "capacity": 5, "attendees": ["b13", "b31", "b14"], "audience": "interests", "photo": {"src": "/fotos/cafe.webp", "alt": "Dos personas conversan en una mesa de un café", "credit": "tommao wang"}},
  {"id": "bpl5", "title": "Torneo de Catan", "description": "Cuatro mesas, eliminación directa. El premio es la gloria.", "place": "Café La Mesa, Chapultepec", "when": "Jueves 19:00", "hostId": "b16", "intent": "hobby", "capacity": 16, "attendees": ["b16", "b28", "b11", "b14", "b09", "b18", "b02", "b10", "b26", "b12"], "audience": "any", "photo": {"src": "/fotos/juegos.webp", "alt": "Dos personas juegan un juego de mesa", "credit": "2H Media"}},
  {"id": "bpl6", "title": "Café y libros", "description": "Cada quien trae un libro que le haya cambiado algo.", "place": "Librería Carlos Fuentes", "when": "Martes 18:00", "hostId": "b19", "intent": "friend", "capacity": 2, "attendees": ["b19", "b26"], "audience": "any", "photo": {"src": "/fotos/biblioteca.webp", "alt": "Sala de lectura con libreros y mesas", "credit": "Jim Petkiewicz"}},
  {"id": "bpl7", "title": "Rodada nocturna", "description": "Vía RecreActiva de noche, ritmo paseo. Casco obligatorio.", "place": "Glorieta Minerva", "when": "Martes 20:30", "hostId": "b22", "intent": "plan", "capacity": 20, "attendees": ["b22", "b18", "b28", "b17", "b12", "b07", "b21", "b16", "b04", "b11", "b31"], "audience": "any", "photo": {"src": "/fotos/correr.webp", "alt": "Tres personas corren por una banqueta soleada", "credit": "Nathan Nuyda"}},
  {"id": "bpl8", "title": "Cine de terror en casa de nadie", "description": "Función de medianoche en la Cineteca y luego tacos.", "place": "Cineteca FICG", "when": "Viernes 23:00", "hostId": "b25", "intent": "plan", "capacity": 4, "attendees": ["b25", "b20", "b09"], "audience": "intent", "photo": {"src": "/fotos/concierto.webp", "alt": "Público frente a un escenario iluminado", "credit": "Yvette de Wit"}},
  {"id": "bpl9", "title": "Intercambio de español e inglés", "description": "Media hora en cada idioma. Todos los niveles.", "place": "Biblioteca Iberoamericana", "when": "Lunes 18:00", "hostId": "b28", "intent": "hobby", "capacity": 10, "attendees": ["b28", "b06", "b26", "b02", "b13", "b24", "b18", "b29", "b27", "b19"], "audience": "any", "photo": {"src": "/fotos/biblioteca.webp", "alt": "Sala de lectura con libreros y mesas", "credit": "Jim Petkiewicz"}},
  {"id": "bpl10", "title": "Mercado y cocina", "description": "Compramos en el mercado y cocinamos juntos un mole.", "place": "Mercado de Abastos", "when": "Sábado 10:00", "hostId": "b31", "intent": "friend", "capacity": 3, "attendees": ["b31"], "audience": "interests", "photo": {"src": "/fotos/cafe.webp", "alt": "Dos personas conversan en una mesa de un café", "credit": "tommao wang"}},
  {"id": "bpl11", "title": "Yoga en el parque", "description": "Trae tu tapete. Clase guiada para principiantes.", "place": "Parque Colomos, explanada", "when": "Domingo 8:00", "hostId": "b02", "intent": "plan", "capacity": 15, "attendees": ["b02", "b20", "b04", "b01", "b07", "b27"], "audience": "any", "photo": {"src": "/fotos/correr.webp", "alt": "Tres personas corren por una banqueta soleada", "credit": "Nathan Nuyda"}},
  {"id": "bpl12", "title": "Concierto de jazz", "description": "Me sobra un boleto. Antes cenamos algo cerca.", "place": "Teatro Degollado", "when": "Sábado 19:00", "hostId": "b05", "intent": "plan", "capacity": 2, "attendees": ["b05", "b04"], "audience": "intent", "photo": {"src": "/fotos/concierto.webp", "alt": "Público frente a un escenario iluminado", "credit": "Yvette de Wit"}},
]

// Conexiones con las que la cuenta de demostración empieza, para probar el chat
export const BOT_CONNECTIONS = ["b03", "b06", "b10", "b15"]

export const BOT_MESSAGES: Record<string, Message[]> = {
  b03: [
    { id: "b03-m0", from: "b03", text: "¡Hola! Vi que también te gusta videojuegos. ¿Desde cuándo?", at: Date.now() - 1000 * 60 * 60 * 30.0 },
    { id: "b03-m1", from: "me", text: "Desde la prepa, casi nunca encuentro con quién.", at: Date.now() - 1000 * 60 * 60 * 29.7 },
    { id: "b03-m2", from: "b03", text: "Pues ya encontraste. ¿Te late este fin?", at: Date.now() - 1000 * 60 * 60 * 29.4 },
  ],
  b06: [
    { id: "b06-m0", from: "b06", text: "Oye, tu perfil me hizo reír. ¿Es cierto lo del talento inútil?", at: Date.now() - 1000 * 60 * 60 * 24.0 },
    { id: "b06-m1", from: "me", text: "Totalmente cierto, un día te lo demuestro.", at: Date.now() - 1000 * 60 * 60 * 23.7 },
  ],
  b10: [
    { id: "b10-m0", from: "b10", text: "¿Cuál es tu lugar favorito para repostería en la ciudad?", at: Date.now() - 1000 * 60 * 60 * 18.0 },
    { id: "b10-m1", from: "me", text: "Tengo dos o tres, depende del día. ¿Tú?", at: Date.now() - 1000 * 60 * 60 * 17.7 },
    { id: "b10-m2", from: "b10", text: "Te paso la lista si me pasas la tuya.", at: Date.now() - 1000 * 60 * 60 * 17.4 },
  ],
  b15: [
    { id: "b15-m0", from: "b15", text: "Hola, ¿qué tal tu semana?", at: Date.now() - 1000 * 60 * 60 * 12.0 },
    { id: "b15-m1", from: "me", text: "Larguísima, pero ya casi viernes.", at: Date.now() - 1000 * 60 * 60 * 11.7 },
  ],
}

export const BOT_REPORTS: Report[] = [
  { id: "br1", reportedId: "b07", reporter: "Usuario 2151", reason: "Perfil falso", detail: "Usa fotos que no parecen suyas.", at: Date.now() - 1000 * 60 * 60 * 4, status: 'pendiente' },
  { id: "br2", reportedId: "b12", reporter: "Usuario 2326", reason: "Spam o publicidad", detail: "Manda enlaces de una tienda.", at: Date.now() - 1000 * 60 * 60 * 7, status: 'pendiente' },
  { id: "br3", reportedId: "b17", reporter: "Usuario 2605", reason: "Mensajes ofensivos o acoso", detail: "Insistió después de que le dije que no.", at: Date.now() - 1000 * 60 * 60 * 10, status: 'pendiente' },
  { id: "br4", reportedId: "b22", reporter: "Usuario 1640", reason: "Contenido inapropiado", detail: "Su descripción tiene groserías.", at: Date.now() - 1000 * 60 * 60 * 13, status: 'pendiente' },
  { id: "br5", reportedId: "b27", reporter: "Usuario 2625", reason: "Parece menor de edad", detail: "Dice que va en secundaria.", at: Date.now() - 1000 * 60 * 60 * 16, status: 'pendiente' },
  { id: "br6", reportedId: "b32", reporter: "Usuario 702", reason: "Otro motivo", detail: "Cancela todos los planes a última hora.", at: Date.now() - 1000 * 60 * 60 * 19, status: 'pendiente' },
]
