import { ComponentFixture, TestBed } from '@angular/core/testing'
import { PolaroidBoard } from './polaroid-board'

describe('PolaroidBoard', () => {
  let fixture: ComponentFixture<PolaroidBoard>

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [PolaroidBoard] }).compileComponents()
    fixture = TestBed.createComponent(PolaroidBoard)
    fixture.componentRef.setInput('items', [
      { photo: 'fotos/cafe.webp', note: 'café', tone: 'friend', date: '2026-10-18', people: ['TÚ', 'M'] },
      { note: 'tacos', tone: 'plan' },
    ])
    await fixture.whenStable()
  })

  it('pone las fotos sobre la mesa', () => {
    const el: HTMLElement = fixture.nativeElement
    expect(el.querySelectorAll('.pb-card').length).toBe(2)
    expect(el.querySelector('.pb-meta')?.textContent).toContain('2026-10-18')
  })
})
