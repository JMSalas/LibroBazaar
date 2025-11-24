document.getElementById('loginForm').addEventListener('submit', async function(e) {
    e.preventDefault();

    const form = e.target;
    const username = form.username.value;
    const password = form.password.value;
    const messageElement = document.getElementById('loginMessage');
    messageElement.classList.remove('d-none', 'alert-success', 'alert-danger');

    try {
        const response = await fetch('/usuarios/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, password })
        });

        const data = await response.json();

        if (response.ok) {
            // *** PARTE CRUCIAL: GUARDAR EL TOKEN y USERNAME***
            localStorage.setItem('authToken', data.token);
            localStorage.setItem('username', data.usuario.username);
            // ***************************************

            messageElement.textContent = data.message || 'Inicio de sesión exitoso. Redirigiendo a libros...';
            messageElement.classList.add('alert-success');

            setTimeout(() => {
                window.location.href = '/libros'; // Redirigir a la lista de libros
            }, 1000);
            
        } else {
            messageElement.textContent = data.error || 'Credenciales inválidas.';
            messageElement.classList.add('alert-danger');
        }

    } catch (error) {
        console.error('Error de red:', error);
        messageElement.textContent = 'Error de conexión con el servidor.';
        messageElement.classList.add('alert-danger');
    }
});