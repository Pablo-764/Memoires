import { ComponentFixture, TestBed } from '@angular/core/testing'
import { provideRouter } from '@angular/router'
import { Connections } from './connections'

describe('Connections', () => {
  let component: Connections
  let fixture: ComponentFixture<Connections>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Connections],
      providers: [provideRouter([])],
    }).compileComponents()

    fixture = TestBed.createComponent(Connections)
    component = fixture.componentInstance
    await fixture.whenStable()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
