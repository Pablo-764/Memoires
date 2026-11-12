// jsdom no trae estas APIs del navegador; las pruebas solo necesitan que existan
const noop = () => undefined

if (!window.matchMedia) {
  window.matchMedia = (query: string) =>
    ({ matches: false, media: query, onchange: null, addEventListener: noop, removeEventListener: noop, addListener: noop, removeListener: noop, dispatchEvent: () => false }) as MediaQueryList
}

class ObserverStub {
  observe = noop
  unobserve = noop
  disconnect = noop
  takeRecords = () => []
}

globalThis.IntersectionObserver ??= ObserverStub as unknown as typeof IntersectionObserver
globalThis.ResizeObserver ??= ObserverStub as unknown as typeof ResizeObserver
Element.prototype.scrollIntoView ??= noop
