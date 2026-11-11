import { ComponentFixture, TestBed } from '@angular/core/testing'
import { provideRouter } from '@angular/router'
import { CreatePlanDialog } from './create-plan-dialog'

describe('CreatePlanDialog', () => {
  let component: CreatePlanDialog
  let fixture: ComponentFixture<CreatePlanDialog>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreatePlanDialog],
      providers: [provideRouter([])],
    }).compileComponents()

    fixture = TestBed.createComponent(CreatePlanDialog)
    component = fixture.componentInstance
    await fixture.whenStable()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
