import { Component, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-motivation',
  standalone: true,
  imports: [IonicModule, CommonModule],
  templateUrl: './motivation.page.html',
  styleUrls: ['./motivation.page.scss'],
})
export class MotivationPage implements OnInit {

  quote = '';
  loading = false;
  error: string | null = null;

  // Záložní citáty pro případ, že internet / API nefunguje
  private fallbackQuotes: string[] = [
    'Nikdy se nevzdávej, i když se to zdá těžké.',
    'Každý den je šance být o kus lepší.',
    'I malý krok vpřed je pořád krok správným směrem.',
    'Úspěch je součet malých kroků opakovaných každý den.'
  ];

  constructor(private router: Router) {}

  goHome() {
  this.router.navigate(['/home']);
  }

  ngOnInit() {
    this.loadQuote();
  }

  async loadQuote() {
    this.loading = true;
    this.error = null;

    try {
      // Základní URL API
      const baseUrl = 'https://api.adviceslip.com/advice';

      // Parametr proti cache – vždy jiná URL
      const targetUrl = `${baseUrl}?t=${Date.now()}`;

      // CORS proxy, aby to prošlo přes prohlížeč
      const proxyUrl = 'https://api.allorigins.win/raw?url=' + encodeURIComponent(targetUrl);

      const res = await fetch(proxyUrl);

      if (!res.ok) {
        throw new Error('HTTP status ' + res.status);
      }

      const data = await res.json() as { slip: { advice: string } };
      this.quote = data.slip.advice;
    } catch (e) {
      console.error('Chyba při načítání citátu:', e);

      // Zobrazíme náhodný offline citát, ať tam není prázdno
      const random = this.fallbackQuotes[Math.floor(Math.random() * this.fallbackQuotes.length)];
      this.quote = random;
      this.error = 'Citát se nepodařilo načíst z internetu, zobrazuji offline citát.';
    } finally {
      this.loading = false;
    }
  }
}
