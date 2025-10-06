import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { CountryISO, PhoneNumberFormat, SearchCountryField } from 'ngx-intl-tel-input';
import { Field, Option } from '../../../models/field';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { formatDate } from '@angular/common';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';

@Component({
  selector: 'app-generique-input',
  standalone: false,
  templateUrl: './generique-input.component.html',
  styleUrl: './generique-input.component.css',
 
})
export class GeneriqueInputComponent implements OnInit {
  @Input() label!: string;
  @Input() placeholder?: string;
  @Input() field: Field = {} as Field; 
  @Input() control!: FormControl;
  @Input() submitted = false;
  @Input() formGroup!: FormGroup;
  @Output() valueChanged = new EventEmitter<any>();

  hidePassword = true;

  filteredOptions!: Observable<Option[]>;
  
  separateDialCode = true;
	SearchCountryField = SearchCountryField;
	CountryISO = CountryISO;
  PhoneNumberFormat = PhoneNumberFormat;
	preferredCountries: CountryISO[] = [CountryISO.Algeria];

  type: string = 'V';

	changePreferredCountries() {
		this.preferredCountries = [CountryISO.Algeria];
	}

  ngOnInit(): void {
    this.type = this.resolveType(this.field);
    
    if (this.type === 'L') {
      this.filteredOptions = this.control.valueChanges.pipe(
        startWith(''),
        map(value => this._filterOptions(value))
      );      
    }

    if (this.type === 'D') {
      this.control?.valueChanges
        .pipe(
          map((val: Date) => formatDate(val, 'yyyy-MM-dd', 'en-US'))
        )
        .subscribe((formattedDate: string) => {
          console.log('Date formatée:', formattedDate);
        });
    }
  }

  onDateChange(event: MatDatepickerInputEvent<Date>) {
    const selectedDate = event.value;
    if (selectedDate) {
      const formattedDate = selectedDate.toISOString().split('T')[0]; 
      this.control.setValue(formattedDate);
    }
  }

  onCheckboxChange(event: MatCheckboxChange) {
    this.control.setValue(event.checked ? 1 : 0);
  }

  onToggleChange(event: MatSlideToggleChange): void {
    this.control.setValue(event.checked ? 1 : 0);
  }
  
  getPatternLabel(field: Field): string {
    if (!field.options || field.options.length === 0) {
      return '';
    }
  
    if (field.depend && this.formGroup) {
      const dependFieldCode = field.depend.trim();
      const dependValue = this.formGroup.get(dependFieldCode)?.value;
      if (dependValue) {
        const matchingOptions = field.options.filter(
          opt => opt.parent?.toString() === dependValue.toString()
        );
        return matchingOptions.map(opt => opt.label).join('\n') || '';
      }
    }
    return field.options.map(opt => opt.label).join('\n');
  }

  resolveType(field: Field): string {
    switch (field.type) {
      case 'L': return 'L';       // Autocomplete (select)
      case 'V': return 'V';       // Text currency
      case 'R': return 'R';       // Telephone
      case 'Y': return 'Y';       // Year
      case 'D': return 'D';       // Date
      case 'B': return 'B';       // Boolean (checkbox)
      case 'TT': return 'TT';     // group toggle 
      case 'S': return 'S';       // Switch toggle
      case 'P': return 'P';       // Password
      default: return 'T';        // Text 
    }
  }

  onCurrencyInput(event: any) {
    let value = event.target.value.replace(/[^0-9.]+/g, '');
    if (value.split('.').length > 2) {
      value = value.replace(/\.+/, '');
    }
    this.control.setValue(value);
  }
  
  private _filterOptions(value: string): Option[] {
    const filterValue = value?.toLowerCase?.() || '';
    return this.field.options?.filter((option: Option) =>
      option.label.toLowerCase().includes(filterValue)
    ) || [];
  }
  
  displayFn(optionValue: Field): string {
    const option = this.field.options?.find((o: any) => o.value === optionValue);
    return option ? option.label : '';
  }
}