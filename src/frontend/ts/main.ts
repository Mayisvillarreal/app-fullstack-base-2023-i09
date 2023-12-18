
declare const M;

class Main implements EventListenerObject {
    public devicesUrl: string = "http://localhost:8000/devices";

    constructor() {
        // Inicializar Materialize para modales
        const elems = document.querySelectorAll('.modal');
        M.Modal.init(elems);

        // Asignar evento al botón "Agregar Dispositivo"
        document.getElementById('btnAddDev').addEventListener('click', () => {
            const modalInstance = M.Modal.getInstance(document.getElementById('modaladd'));
            modalInstance.open();
        });

        // Asignar evento al botón "Lista de Dispositivos"
        document.getElementById('btnListar').addEventListener('click', () => {
            this.buscarDevices();
        });

        // Inicializar Materialize para selects
        const selectElems = document.querySelectorAll('select');
        M.FormSelect.init(selectElems);

        
    }

    public async buscarDevices() {
        try {
            const response = await fetch(this.devicesUrl);

            if (response.ok) {
                const datos: Array<Device> = await response.json();
                this.actualizarInterfaz(datos);
            } else {
                console.log("Error al obtener los dispositivos:", response.status, response.statusText);
            }
        } catch (error) {
            console.error("Error en la solicitud:", error);
        }
    }

    private async eliminarDispositivo(id: number) {
        try {
            const response = await fetch(`${this.devicesUrl}/${id}`, {
                method: "DELETE",
            });
    
            if (response.ok) {
                console.log(`Dispositivo con eliminado con éxito`);
                
            } else {
                console.error("Error al eliminar el dispositivo:", response.status, response.statusText);
            }
        } catch (error) {
            console.error("Error en la solicitud DELETE:", error);
        }
    }
    

    private actualizarInterfaz(datos: Array<Device>) {
        const ul = document.getElementById("devices");

        if (!ul) {
            console.error("No se encontró el elemento con id 'devices'.");
            return;
        }

        ul.innerHTML = "";

        datos.forEach((d) => {
            const cardItem = `
                <div class="card">
                    <div class="card-content">
                        <span class="card-title">${d.name}</span>
                        <img src="${getImagePath(d.type)}" alt="Imagen del dispositivo ${d.name}" class="circle">
                        <p>${d.description}</p>
                    </div>
                    <div class="card-action">
                        <div class="switch">
                            <label>
                                Off
                                <input type="checkbox" data-nuevo-att="${d.id}" id="cb_${d.id}" ${d.state ? "checked" : ""}>
                                <span class="lever"></span>
                                On
                            </label>
                        </div>
                        </div>
                </div>`;

            ul.innerHTML += cardItem;
        });

        function getImagePath(type) {
            
                   if (type === 1) {
                             return './static/images/a.png';
                         } else if (type === 2) {
                             return './static/images/b.png';
                         } else if (type === 3) {
                             return './static/images/p.png';
                         } else if (type === 4) {
                             return './static/images/tv.png';
                         } else if (type === 5) {
                             return './static/images/v.png';
                         } 
                     }

        // Agregar listeners después de actualizar el DOM
        datos.forEach((d) => {
            const checkbox = document.getElementById(`cb_${d.id}`);

            if (checkbox) {
                checkbox.addEventListener("click", this);
            }
        });
    }

    handleEvent(event: Event) {
        if (event.type === "click" && event.target instanceof HTMLInputElement) {
            const id = event.target.getAttribute("data-nuevo-att");
            const state = event.target.checked;

            if (id) {
                this.ejecutarPost(parseInt(id, 10), state);
            }
        }
    }

    public initFormEvents() {
        const btnGuardar = document.getElementById('btnGuardar');

        if (btnGuardar) {
            btnGuardar.addEventListener('click', () => {
                this.guardarDispositivo();
            });
        }
    }

    private async guardarDispositivo() {
        // Obtener valores del formulario
        const name = (document.getElementById('txt-name') as HTMLInputElement).value;
        const description = (document.getElementById('txt-description') as HTMLInputElement).value;
        const type = (document.getElementById('select-type') as HTMLSelectElement).value;

        // Validar los valores (puedes agregar más validaciones según tus necesidades)
        if (!name || !description || !type) {
            alert('Por favor, complete todos los campos del formulario.');
            return;
        }

        // Crear objeto de datos del dispositivo
        const nuevoDispositivo = {
            name,
            description,
            type: parseInt(type),
            state: false, // Puedes establecer un valor predeterminado o proporcionar otro mecanismo para establecer el estado
        };

        try {
            // Realizar la solicitud POST para agregar el dispositivo
            const response = await fetch(this.devicesUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(nuevoDispositivo),
            });

            if (response.ok) {
                // Limpiar el formulario o realizar otras acciones necesarias después de agregar el dispositivo
                console.log('Dispositivo agregado con éxito');
            } else {
                console.error('Error al agregar el dispositivo:', response.status, response.statusText);
            }
        } catch (error) {
            console.error('Error en la solicitud POST:', error);
        }
    }


    private async ejecutarPost(id: number, state: boolean) {
        try {
            const response = await fetch(this.devicesUrl, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ id, state }),
            });

            if (response.ok) {
                console.log("La solicitud POST se completó con éxito");
            } else {
                console.error("Error en la solicitud POST:", response.status, response.statusText);
            }
        } catch (error) {
            console.error("Error en la solicitud POST:", error);
        }
    }

    
}

document.addEventListener('DOMContentLoaded', function () {
    
const mainInstance = new Main();
mainInstance.buscarDevices();
mainInstance.initFormEvents();


});

