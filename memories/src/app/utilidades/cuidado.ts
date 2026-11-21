// Antes de enviar: palabras que suelen lastimar. La lista es local y corta; no se
// bloquea nada, solo se pregunta "¿Seguro que quieres enviar esto?".
const DELICADAS = [
  'idiota', 'estupido', 'estupida', 'pendejo', 'pendeja', 'imbecil', 'tarado', 'tarada', 'inutil',
  'gorda', 'gordo', 'fea', 'feo', 'puta', 'puto', 'zorra', 'naco', 'naca', 'maldito', 'maldita',
  'mierda', 'callate', 'perra', 'baboso', 'babosa', 'asco',
]

function normal(t: string) {
  return t.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '')
}

export function palabrasDelicadas(texto: string): string[] {
  const palabras = normal(texto).split(/[^a-zñ]+/)
  return [...new Set(palabras.filter((p) => DELICADAS.includes(p)))]
}
