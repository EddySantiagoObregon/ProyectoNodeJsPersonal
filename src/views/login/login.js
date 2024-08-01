document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const usuario = document.getElementById('usuario').value;
    const contraseña = document.getElementById('contraseña').value;

    const response = await fetch('/api/login/start', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ usuario, contraseña })
    });

    const result = await response.json();
    const messageElement = document.getElementById('message');

    if (response.ok) {
        messageElement.style.color = 'green';
        messageElement.textContent = 'Inicio de sesión exitoso';
        // Redirigir o realizar alguna acción después de un inicio de sesión exitoso
    } else {
        messageElement.style.color = 'red';
        messageElement.textContent = result.message || 'Algo salió mal';
    }
});
