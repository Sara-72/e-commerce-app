import { Component, signal ,inject } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { Navbar } from './components/navbar/navbar';
import { TranslationService } from './core/services/translation';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet , Navbar,RouterLink,RouterLinkActive],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('e-commerce-app');
  private readonly _translationService = inject(TranslationService); // Initializes language & dir on load
}
