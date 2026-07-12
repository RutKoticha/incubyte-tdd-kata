import { Injectable, signal } from '@angular/core';

/**
 * Structure of a toast notification message.
 */
export interface Toast {
  /** Unique identifier for the toast. */
  id: string;
  /** The message text to display. */
  message: string;
  /** The severity type of the notification. */
  type: 'success' | 'error' | 'info';
}

/**
 * Service to manage global toast notification alerts.
 */
@Injectable({
  providedIn: 'root'
})
export class ToastService {
  /** Reactive list of currently active toasts. */
  readonly toasts = signal<Toast[]>([]);

  /**
   * Displays a success notification.
   * @param message Text to display.
   */
  success(message: string): void {
    this.show(message, 'success');
  }

  /**
   * Displays an error notification.
   * @param message Text to display.
   */
  error(message: string): void {
    this.show(message, 'error');
  }

  /**
   * Displays an informational notification.
   * @param message Text to display.
   */
  info(message: string): void {
    this.show(message, 'info');
  }

  /**
   * Adds a toast to the active stack and schedules its removal.
   * @param message Notification body text.
   * @param type Notification severity context.
   */
  private show(message: string, type: 'success' | 'error' | 'info'): void {
    const id = Math.random().toString(36).substring(2, 9);
    const newToast: Toast = { id, message, type };
    
    this.toasts.update(current => [...current, newToast]);

    setTimeout(() => {
      this.dismiss(id);
    }, 4000);
  }

  /**
   * Removes a toast from the active stack by ID.
   * @param id Identifier of the toast to close.
   */
  dismiss(id: string): void {
    this.toasts.update(current => current.filter(t => t.id !== id));
  }
}
