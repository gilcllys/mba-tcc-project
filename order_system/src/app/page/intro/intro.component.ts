import { Component } from '@angular/core';
import { CommonModule } from '@angular/common'; // Necessário para diretivas como ngIf, ngFor (se usadas)
import { MatIconModule } from '@angular/material/icon'; // Para usar <mat-icon>
import { MatButtonModule } from '@angular/material/button'; // Para usar <button mat-raised-button>
import { Router } from '@angular/router'; // Para navegação programática

@Component({
  selector: 'app-intro',
  imports: [
    CommonModule,
    MatIconModule,
    MatButtonModule // Não se esqueça de importar os módulos do Materia
  ],
  templateUrl: './intro.component.html',
  styleUrl: './intro.component.scss'
})
export class IntroComponent {
  constructor(private router: Router) { }
  // Função para navegar para uma rota específica (ex: Cardápio)
  startExploring(): void {
    this.router.navigate(['/order']); // Ou '/client', ou a primeira página que desejar
  }
}
