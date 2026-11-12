import { ComponentFixture, TestBed } from '@angular/core/testing'
import { PolaroidBoard } from './polaroid-board'

describe('PolaroidBoard', () => {
  let fixture: ComponentFixture<PolaroidBoard>

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [PolaroidBoard] }).compileComponents()
    fixture = TestBed.createComponent(PolaroidBoard)
    await fixture.whenStable()
  })

  it('pone las fotos sobre la mesa', () => {
    const el: HTMLElement = fixture.nativeElement
    expect(el.querySelectorAll('.pb-card').length).toBe(5)
  })
})
