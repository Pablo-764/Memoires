import { ComponentFixture, TestBed } from '@angular/core/testing'
import { provideRouter } from '@angular/router'
import { NAV_ITEMS } from '../../modelos/navegacion'
import { Sidebar } from './sidebar'

describe('Sidebar', () => {
  let component: Sidebar
  let fixture: ComponentFixture<Sidebar>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Sidebar],
      providers: [provideRouter([])],
    }).compileComponents()

    fixture = TestBed.createComponent(Sidebar)
    component = fixture.componentInstance
    fixture.componentRef.setInput('items', NAV_ITEMS)
    fixture.componentRef.setInput('active', 0)
    await fixture.whenStable()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
