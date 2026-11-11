import { ComponentFixture, TestBed } from '@angular/core/testing'
import { provideRouter } from '@angular/router'
import { Modal } from './modal'

describe('Modal', () => {
  let component: Modal
  let fixture: ComponentFixture<Modal>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Modal],
      providers: [provideRouter([])],
    }).compileComponents()

    fixture = TestBed.createComponent(Modal)
    component = fixture.componentInstance
    fixture.componentRef.setInput('title', 'Prueba')
    await fixture.whenStable()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
