// Coreografía de la portada con GSAP y Lenis. Solo corre en el navegador, se carga
// aparte (import dinámico) para no pesar en el resto de la app y no corre con
// movimiento reducido. Devuelve una función que deshace todo.
export async function startLandingMotion(root: HTMLElement): Promise<() => void> {
  if (typeof window === 'undefined' || matchMedia('(prefers-reduced-motion: reduce)').matches) return () => undefined
  // Mientras llega GSAP, el héroe espera oculto; si algo falla, se muestra a los 2.5 s
  root.classList.add('hero-pending')
  const safety = window.setTimeout(() => root.classList.remove('hero-pending'), 2500)

  const [{ gsap }, { ScrollTrigger }, { default: Lenis }] = await Promise.all([import('gsap'), import('gsap/ScrollTrigger'), import('lenis')])
  gsap.registerPlugin(ScrollTrigger)

  // Desplazamiento suave conectado al reloj de GSAP
  const lenis = new Lenis({ lerp: 0.12, smoothWheel: true })
  const raf = (time: number) => lenis.raf(time * 1000)
  lenis.on('scroll', ScrollTrigger.update)
  gsap.ticker.add(raf)
  gsap.ticker.lagSmoothing(0)

  const ctx = gsap.context(() => {
    // dis-084: MÉMOIRES florece letra por letra, como tallos que crecen
    const letters = root.querySelectorAll('.hero-logo .logo-l')
    const dot = root.querySelector('.hero-logo .logo-dot')
    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })
    tl.fromTo(letters, { scaleY: 0, yPercent: 30, opacity: 0 }, { scaleY: 1, yPercent: 0, opacity: 1, transformOrigin: '50% 100%', duration: 0.7, stagger: 0.06, ease: 'back.out(1.8)' })
    if (dot) tl.fromTo(dot, { y: -140, opacity: 0, scale: 0.4 }, { y: 0, opacity: 1, scale: 1, duration: 0.8, ease: 'bounce.out' }, '-=0.25')
    // El texto ya está visible (es lo que mide el LCP); solo se asienta un poco
    tl.from(root.querySelectorAll('[data-hero-in]'), { y: 10, duration: 0.5, stagger: 0.06 }, 0)
    tl.add(() => root.classList.remove('hero-pending'))

    // El logotipo se queda atrás al bajar (scrub)
    gsap.to(root.querySelector('.hero-logo'), {
      yPercent: -18,
      ease: 'none',
      scrollTrigger: { trigger: root.querySelector('.hero-logo'), start: 'top top', end: 'bottom top', scrub: true },
    })

    // Las columnas de intención entran una tras otra al llegar a ellas
    ScrollTrigger.batch(root.querySelectorAll('.intent-col'), {
      start: 'top 85%',
      once: true,
      onEnter: (els) => gsap.from(els, { y: 32, opacity: 0, duration: 0.6, stagger: 0.08, overwrite: true }),
    })
  }, root)

  window.clearTimeout(safety)
  return () => {
    root.classList.remove('hero-pending')
    ctx.revert()
    gsap.ticker.remove(raf)
    lenis.destroy()
  }
}
