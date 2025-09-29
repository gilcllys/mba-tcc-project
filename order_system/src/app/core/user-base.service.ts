import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Observable, throwError, of } from 'rxjs'; // Importação correta de Observable
import { catchError } from 'rxjs/operators'; // Importação correta de operators

// Importante: Remover 'providedIn: root' de classes base abstratas.
// As classes concretas que herdam é que serão providas.
@Injectable()
export abstract class BaseService<T> { // Use 'abstract' para que não possa ser instanciado diretamente
  // Use 'T' como o tipo genérico

  // A URL base agora é um parâmetro do construtor, ou pode ser uma constante global.
  // Vamos mantê-la como um padrão, mas permitir que o serviço filho a configure.
  protected baseUrl: string = '';

  // A URL específica da entidade (ex: /users, /clients) será definida pelo serviço filho
  protected entityUrl: string = '';

  protected httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
      // Adicione aqui outros cabeçalhos comuns, como 'Authorization'
      // 'Authorization': 'Bearer ' + localStorage.getItem('token')
    })
  };

  /**
   * Construtor para o BaseService.
   * @param http O serviço HttpClient do Angular.
   * @param endpoint O segmento do caminho da URL específico para esta entidade (ex: 'users', 'clients').
   * @param port A porta do serviço.
   * @param customBaseUrl Opcional: uma URL base personalizada para a API.
   */
  constructor(
    protected http: HttpClient,
    protected endpoint: string,
    protected port: string,
    customBaseUrl: string = '',
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    // Se customBaseUrl for fornecida, usa ela, senão usa host.docker.internal com as portas mapeadas
    if (customBaseUrl) {
      this.baseUrl = customBaseUrl;
      this.entityUrl = `${this.baseUrl}:${this.port}/${endpoint}`;
    } else {
      // Usa localhost com as portas mapeadas do docker-compose
      this.entityUrl = `http://localhost:${this.port}/${this.endpoint}`;
    }
  }

  // Métodos CRUD usando o tipo genérico 'T'

  getAll(): Observable<T[]> {
    // Só faz a requisição se estivermos no browser (não no SSR)
    if (!isPlatformBrowser(this.platformId)) {
      return of([]); // Retorna array vazio durante SSR
    }
    
    return this.http.get<T[]>(`${this.entityUrl}/`, this.httpOptions)
      .pipe(
        catchError(this.handleError)
      );
  }

  getById(id: string | number): Observable<T> {
    const url = `${this.entityUrl}/${id}/`;
    return this.http.get<T>(url, this.httpOptions)
      .pipe(
        catchError(this.handleError)
      );
  }

  create(item: T): Observable<T> { // Item do tipo T
    console.log(this.entityUrl)
    return this.http.post<T>(`${this.entityUrl}/`, item, this.httpOptions)
      .pipe(
        catchError(this.handleError)
      );
  }

  update(id: string | number, item: T): Observable<T> { // Item do tipo T
    const url = `${this.entityUrl}/${id}/`;
    return this.http.put<T>(url, item, this.httpOptions)
      .pipe(
        catchError(this.handleError)
      );
  }

  delete(id: string | number): Observable<any> {
    const url = `${this.entityUrl}/${id}/`;
    return this.http.delete<any>(url, this.httpOptions)
      .pipe(
        catchError(this.handleError)
      );
  }

  // Método genérico para tratamento de erros HTTP (mantido igual)
  protected handleError(error: HttpErrorResponse) {
    let errorMessage = 'Um erro desconhecido ocorreu!';
    // Verificação mais segura que funciona tanto no browser quanto no SSR
    if (error.error && typeof error.error === 'object' && 'message' in error.error) {
      errorMessage = `Erro: ${error.error.message}`;
    } else {
      errorMessage = `Código do erro: ${error.status}\nMensagem: ${error.message}`;
      if (error.status === 404) {
        errorMessage = 'Recurso não encontrado.';
      } else if (error.status === 401) {
        errorMessage = 'Não autorizado. Por favor, faça login novamente.';
      }
    }
    console.error(errorMessage);
    return throwError(() => new Error(errorMessage));
  }
}
