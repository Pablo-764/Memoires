export type PlanSize = 'duo' | 'small' | 'large'
export type PlanAudience = 'any' | 'interests' | 'intent'

export const PLAN_SIZES: Record<PlanSize, { label: string; hint: string; min: number; max: number; preset: number; dots: number }> = {
  duo: { label: 'Mano a mano', hint: 'Tú y una persona más', min: 2, max: 2, preset: 2, dots: 2 },
  small: { label: 'Grupo chico', hint: 'De 3 a 6 personas', min: 3, max: 6, preset: 5, dots: 5 },
  large: { label: 'Grupo grande', hint: 'De 7 a 30 personas', min: 7, max: 30, preset: 10, dots: 11 },
}

export const SIZE_ORDER: PlanSize[] = ['duo', 'small', 'large']

export const AUDIENCES: Record<PlanAudience, { label: string; hint: string; blocked: string }> = {
  any: { label: 'Cualquiera', hint: 'Abierto a toda persona de tu ciudad', blocked: '' },
  interests: { label: 'Intereses en común', hint: 'Solo quien comparta algo contigo', blocked: 'Sin intereses en común' },
  intent: { label: 'Que busque lo mismo', hint: 'Solo quien tenga esta intención', blocked: 'Busca otra intención' },
}

export const AUDIENCE_ORDER: PlanAudience[] = ['any', 'interests', 'intent']

export function sizeOf(capacity: number): PlanSize {
  return capacity <= 2 ? 'duo' : capacity <= 6 ? 'small' : 'large'
}

export type PlanPeople = 'any' | 'interests' | 'verified' | 'age'

export const PLAN_PEOPLE: Record<PlanPeople, { label: string; hint: string }> = {
  any: { label: 'Cualquiera', hint: 'Abierto a toda persona de tu ciudad' },
  interests: { label: 'Con mis intereses', hint: 'Que compartan algo contigo' },
  verified: { label: 'Perfiles verificados', hint: 'Solo cuentas verificadas' },
  age: { label: 'De mi edad', hint: 'Hasta 5 años de diferencia' },
}

export const PLAN_PEOPLE_ORDER: PlanPeople[] = ['any', 'interests', 'verified', 'age']

export type Gender = 'woman' | 'man' | 'nonbinary'

export const GENDERS: Record<Gender, { label: string; seek: string }> = {
  woman: { label: 'Mujer', seek: 'Mujeres' },
  man: { label: 'Hombre', seek: 'Hombres' },
  nonbinary: { label: 'No binario', seek: 'Personas no binarias' },
}

export const GENDER_ORDER: Gender[] = ['woman', 'man', 'nonbinary']

export interface IntentPrefs {
  sizes: PlanSize[]
  people: PlanPeople
  genders: Gender[]
}

export const EMPTY_PREFS: IntentPrefs = { sizes: [], people: 'any', genders: [] }

// La cantidad de personas no aplica a pareja; el género, solo a pareja y amistad
export const usesGroups = (intent: string) => intent !== 'romance'
export const usesGender = (intent: string) => intent === 'romance' || intent === 'friend'
