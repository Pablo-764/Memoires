import { ComponentFixture, TestBed } from '@angular/core/testing'
import { provideRouter } from '@angular/router'
import { Avatar } from './avatar'

describe('Avatar', () => {
  let component: Avatar
  let fixture: ComponentFixture<Avatar>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Avatar],
      providers: [provideRouter([])],
    }).compileComponents()

    fixture = TestBed.createComponent(Avatar)
    component = fixture.componentInstance
    fixture.componentRef.setInput('name', 'Ana')
    fixture.componentRef.setInput('hue', 260)
    await fixture.whenStable()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
