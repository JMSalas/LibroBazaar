document.querySelectorAll('.btn-confirmar-compra').forEach(button => {
    button.addEventListener('click', async (e) => {
        const libroId = e.target.dataset.libroId;
        const cantidadInput = document.getElementById(`cantidad-${libroId}`);
        const cantidad = parseInt(cantidadInput.value);

        // Elementos del DOM para la lógica del modal
        const modalElement = document.getElementById(`comprarModal-${libroId}`);
        const formElement = document.getElementById(`form-compra-${libroId}`);
        const messageContainer = document.getElementById(`message-container-${libroId}`)
        const errorElement = document.getElementById(`error-${libroId}`);
        const footerCancelButton = modalElement.querySelector('.modal-footer [data-bs-dismiss="modal"]'); // Botón Cancelar en el footer
        const closeBtnX = modalElement.querySelector('.btn-close'); // Botón 'X' en el header
        
        errorElement.textContent = '';
        messageContainer.innerHTML = '';
        e.target.disabled = true; // Deshabilitar botón de confirmación inmediatamente

        // Simulación: obtener el token del almacenamiento local
        const token = localStorage.getItem('authToken'); 
        
        if (!token) {
            errorElement.textContent = 'Debes iniciar sesión para comprar.';

            // Habilitar de nuevo el botón si no hay token (el modal se cierra luego)
            e.target.disabled = false;

            setTimeout(() => {
                const modal = bootstrap.Modal.getInstance(modalElement);
                modal.hide();
                window.location.href = '/usuarios/login'; 
            }, 1500);
            return;
        }

        try {
            // Deshabilitar los botones de cierre mientras se realiza la petición
            footerCancelButton.disabled = true;
            closeBtnX.disabled = true;
            
            // RUTA: /libros/:id/comprar
            const response = await fetch(`/libros/${libroId}/comprar`, { 
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}` 
                },
                body: JSON.stringify({ cantidad })
            });

            const data = await response.json();

            if (response.ok) {

                // Ocultar el formulario
                formElement.style.display = 'none';

                // Mostrar el mensaje de éxito en el contenedor del modal
                messageContainer.innerHTML = `
                    <div class="alert alert-success d-flex align-items-center" role="alert">
                        <i class="bi bi-check-circle-fill me-2"></i>
                        <div>
                            <strong>${data.message}</strong>
                            <br>Stock restante: ${data.stockRestante}
                        </div>
                    </div>
                `;

                // Temporizador para cerrar el modal y recargar
                const AUTO_CLOSE_DELAY = 2000; // 2 segundos
                
                setTimeout(() => {
                    const modal = bootstrap.Modal.getInstance(modalElement);
                    if (modal) {
                        modal.hide();
                    }
                    window.location.reload();
                }, AUTO_CLOSE_DELAY);
            
            } else {
                // Lógica de Error: Mostrar mensaje y re-habilitar botón
                const errorMessage = data.error || 'Ocurrió un error inesperado.';
                
                // Mostrar error en el contenedor de mensajes
                messageContainer.innerHTML = `
                    <div class="alert alert-danger d-flex align-items-center" role="alert">
                        <i class="bi bi-x-octagon-fill me-2"></i>
                        <div>
                            <strong>Error:</strong> ${errorMessage}
                        </div>
                    </div>
                `;
                
                // Re-habilitar todos los botones para que el usuario pueda corregir o cancelar
                e.target.disabled = false;
                footerCancelButton.disabled = false;
                closeBtnX.disabled = false;
            }

        } catch (error) {
            console.error('Error de red o servidor:', error);
            errorElement.textContent = 'Error de conexión con el servidor.';

            e.target.disabled = false;
        }
    });
});

// Listener para resetear el modal al cerrarse
document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.modal').forEach(modalEl => {
        modalEl.addEventListener('hidden.bs.modal', function (event) {
            const libroId = event.currentTarget.id.split('-').pop();
            const form = document.getElementById(`form-compra-${libroId}`);
            const messageContainer = document.getElementById(`message-container-${libroId}`);
            const confirmButton = document.getElementById(`confirm-button-${libroId}`);
            
            // Elementos de cierre a re-habilitar
            const footerCancelButton = modalEl.querySelector('.modal-footer [data-bs-dismiss="modal"]');
            const closeBtnX = modalEl.querySelector('.btn-close');

            // Resetear el formulario y mensaje
            if (form) form.reset();
            if (form) form.style.display = 'block'; // Mostrar el formulario de nuevo
            if (messageContainer) messageContainer.innerHTML = '';
            
            // Asegurar que el botón esté habilitado para la próxima apertura
            if (confirmButton) confirmButton.disabled = false; 
            if (footerCancelButton) footerCancelButton.disabled = false;
            if (closeBtnX) closeBtnX.disabled = false;
        });
    });
});