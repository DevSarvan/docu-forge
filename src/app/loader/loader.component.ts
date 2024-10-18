import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-loader',
  standalone: true,
  imports: [CommonModule, MatProgressSpinnerModule],
  template: `
    <div class="loader-overlay">
      <mat-spinner></mat-spinner>
    </div>
  `,
  styleUrls: ['./loader.component.scss'],
})
export class LoaderComponent {}
