// Seleccionamos todos los elementos con el id 'signUp' y 'signIn'
const signUpButtons = document.querySelectorAll('#signUp');
const signInButtons = document.querySelectorAll('#signIn');
const container = document.getElementById('container');

// Agregamos el evento a todos los elementos con id 'signUp' para mostrar el panel de registro
signUpButtons.forEach(button => {
    button.addEventListener('click', () => {
        container.classList.add("right-panel-active");
    });
});

// Agregamos el evento a todos los elementos con id 'signIn' para mostrar el panel de inicio de sesión
signInButtons.forEach(button => {
    button.addEventListener('click', () => {
        container.classList.remove("right-panel-active");
    });
});
