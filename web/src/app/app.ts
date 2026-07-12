import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ToastService } from './shared/services/toast.service';

/**
 * Root component of the application.
 * Manages global toasts and layout orchestration.
 */
@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  /** Global Toast notification service. */
  protected readonly toastService = inject(ToastService);
}
