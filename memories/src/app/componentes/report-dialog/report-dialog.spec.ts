import { ComponentFixture, TestBed } from '@angular/core/testing'
import { provideRouter } from '@angular/router'
import { ReportDialog } from './report-dialog'

describe('ReportDialog', () => {
  let component: ReportDialog
  let fixture: ComponentFixture<ReportDialog>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReportDialog],
      providers: [provideRouter([])],
    }).compileComponents()

    fixture = TestBed.createComponent(ReportDialog)
    component = fixture.componentInstance
    fixture.componentRef.setInput('personId', 'p1')
    fixture.componentRef.setInput('name', 'Mariana')
    await fixture.whenStable()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
