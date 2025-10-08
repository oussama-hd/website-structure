import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Field } from '../../../models/field';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-step-form',
  standalone : false,
  templateUrl: './step-form.component.html',
  styleUrl: './step-form.component.scss'
})

export class StepFormComponent {
  @Input() fields: Field[] = [];
  @Input() stepTitle!: string;
  @Output() formReady = new EventEmitter<FormGroup>();

  formGroup!: FormGroup;

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.buildForm();
  }

  getFormControl(name: string): FormControl {
    return this.formGroup.get(name) as FormControl;
  }


  private buildForm(): void {
    const group: { [key: string]: FormControl } = {};
    this.fields.forEach(field => {
      group[field.code] = new FormControl(
        field.defaultParam || '',
        field.obligatoire ? Validators.required : []
      );
    });
    this.formGroup = new FormGroup(group);
    this.formReady.emit(this.formGroup);
  }
}