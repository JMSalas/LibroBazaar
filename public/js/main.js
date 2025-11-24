document.addEventListener('DOMContentLoaded', () => {
    // Lógica de autenticación y visibilidad de botones aquí
    // ----------------------------------------------------------------

    // Verifica si existe el token JWT en el almacenamiento local
    const token = localStorage.getItem('authToken');
    // Obtener el nombre de usuario directamente de localStorage
    const username = localStorage.getItem('username'); 
    
    const navLoginButton = document.getElementById('nav-login-button');
    
    const navUserDropdown = document.getElementById('nav-user-dropdown');
    const usernameDisplay = document.getElementById('username-display');
    const navLogoutButtonSplit = document.getElementById('nav-logout-button-split'); // Botón de Cerrar Sesión
    
    if (token && username) { 
        
        // Usuario logueado: Mostrar Dropdown de Usuario/Logout        
        if (navLoginButton) navLoginButton.style.display = 'none';

        if (navUserDropdown) {
            navUserDropdown.style.display = 'flex'; // Usar flex para btn-group
            if (usernameDisplay) {
                // Inyectar el nombre de usuario (directamente del localStorage)
                usernameDisplay.innerHTML = `<i class="bi bi-person-fill me-1"></i> ${username}`;
            }
        }
        
    } else {
        // Si falta el token o el username, limpiamos para asegurar consistencia
        localStorage.removeItem('authToken');
        localStorage.removeItem('username');
        
        // Usuario no logueado: Mostrar Login
        if (navUserDropdown) navUserDropdown.style.display = 'none'; // Ocultar el dropdown
        if (navLoginButton) navLoginButton.style.display = 'block';
    }

    // Manejador de evento para cerrar sesión
    // ----------------------------------------------------------------
    if (navLogoutButtonSplit) {
        navLogoutButtonSplit.addEventListener('click', (e) => {
            localStorage.removeItem('authToken'); // Borrar el token
            localStorage.removeItem('username'); // <-- Borrar el username
            //alert('Sesión cerrada correctamente.');
            window.location.href = '/'; // Redirigir a Home
        });
    }

    // Lógica para RESALTAR el elemento activo del Navbar
    // ----------------------------------------------------------------
    const currentPath = window.location.pathname;
    const navLinks = document.querySelectorAll('.navbar-nav .nav-link');

    // Iterar sobre todos los enlaces
    navLinks.forEach(link => {
        // Obtener la ruta del enlace (ej: "/", "/libros")
        let linkPath = link.getAttribute('href');

        // Normalizar la ruta del enlace para que coincida con el currentPath
        // Si el enlace es solo "/", solo debe coincidir con "/" exactamente.
        if (linkPath === "/") {
            if (currentPath === linkPath || currentPath === "/home") {
                link.classList.add('active');
                link.setAttribute('aria-current', 'page');
            }
        } 
        // Para el resto de enlaces (ej: /libros, /usuarios/login)
        else if (currentPath.startsWith(linkPath)) {
            link.classList.add('active');
            link.setAttribute('aria-current', 'page');
        }
        
        // Asegurar que solo un elemento tenga 'active' en la misma familia de enlaces
        // (Normalmente solo hay uno, pero esta estructura previene duplicados)
        if (link.getAttribute('aria-current') === 'page') {
                // Quitar la clase 'active' de cualquier otro elemento que pudiera tenerla
                navLinks.forEach(otherLink => {
                    if (otherLink !== link && otherLink.classList.contains('active')) {
                        otherLink.classList.remove('active');
                        otherLink.removeAttribute('aria-current');
                    }
                });
        }
    });
});