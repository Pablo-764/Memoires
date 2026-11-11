import { ComponentFixture, TestBed } from '@angular/core/testing'
import { provideRouter } from '@angular/router'
import { BlockDialog } from './block-dialog'

describe('BlockDialog', () => {
  let component: BlockDialog
  let fixture: ComponentFixture<BlockDialog>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BlockDialog],
      providers: [provideRouter([])],
    }).compileComponents()

    fixture = TestBed.createComponent(BlockDialog)
    component = fixture.componentInstance
    fixture.componentRef.setInput('personId', 'p1')
    fixture.componentRef.setInput('name', 'Mariana')
    await fixture.whenStable()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
