import { ComponentFixture, TestBed } from '@angular/core/testing'
import { provideRouter } from '@angular/router'
import { FiltersPanel } from './filters-panel'

describe('FiltersPanel', () => {
  let component: FiltersPanel
  let fixture: ComponentFixture<FiltersPanel>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FiltersPanel],
      providers: [provideRouter([])],
    }).compileComponents()

    fixture = TestBed.createComponent(FiltersPanel)
    component = fixture.componentInstance
    await fixture.whenStable()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
