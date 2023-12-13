class Usuario extends Persona{
  private nombre: string;
  private rol: string;
  private password: string;
  
  constructor(nombre: string, rol: string, passwornd: string,dni:number) {
    super( dni);
      this.nombre = nombre;
      this.password = passwornd;
      this.rol = rol;
  }

  public mostrar():string {
    return `${this.nombre} - ${this.rol}`; 
  }
}