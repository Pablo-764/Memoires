import { ComponentFixture, TestBed } from '@angular/core/testing'
import { provideRouter } from '@angular/router'
import { IntentPrefsEditor } from './intent-prefs'

describe('IntentPrefsEditor', () => {
  let component: IntentPrefsEditor
  let fixture: ComponentFixture<IntentPrefsEditor>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IntentPrefsEditor],
      providers: [provideRouter([])],
    }).compileComponents()

    fixture = TestBed.createComponent(IntentPrefsEditor)
    component = fixture.componentInstance
    fixture.componentRef.setInput('intent', 'friend')
    fixture.componentRef.setInput('value', { sizes: [], people: 'any', genders: [] })
    await fixture.whenStable()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
