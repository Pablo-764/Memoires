import { ComponentFixture, TestBed } from '@angular/core/testing'
import { provideRouter } from '@angular/router'
import { NAV_ITEMS } from '../../modelos/navegacion'
import { TabBar } from './tab-bar'

describe('TabBar', () => {
  let component: TabBar
  let fixture: ComponentFixture<TabBar>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TabBar],
      providers: [provideRouter([])],
    }).compileComponents()

    fixture = TestBed.createComponent(TabBar)
    component = fixture.componentInstance
    fixture.componentRef.setInput('items', NAV_ITEMS)
    fixture.componentRef.setInput('active', 0)
    await fixture.whenStable()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
