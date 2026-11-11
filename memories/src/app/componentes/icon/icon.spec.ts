import { ComponentFixture, TestBed } from '@angular/core/testing'
import { provideRouter } from '@angular/router'
import { Icon } from './icon'

describe('Icon', () => {
  let component: Icon
  let fixture: ComponentFixture<Icon>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Icon],
      providers: [provideRouter([])],
    }).compileComponents()

    fixture = TestBed.createComponent(Icon)
    component = fixture.componentInstance
    fixture.componentRef.setInput('name', 'heart')
    await fixture.whenStable()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
