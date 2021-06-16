# Crossword HA!

Crossword HA! es un crucigrama digital para la web [Historia Arte (HA!)](https://historia-arte.com/), un proyecto de [Miguel Calvo](https://noxocreacion.com/) y [Óscar Otero](https://oscarotero.com/).

El contenido del crucigrama ha sido creado por Miguel, y yo le he dado forma a través de JavaScript vanilla con la guía de Óscar. El juego cuenta ya con algunas funcionalidades muy interesantes que puedes leer más abajo.

![imagen](https://repository-images.githubusercontent.com/327085083/d8834e00-a2bb-11eb-95fd-66baefd8dcf2)

## Tecnologías utilizadas

- Vanilla JavaScript, HTML y CSS


## Funcionalidades

### Destacado de casillas y cambio de dirección 🖍️

Esta funcionalidad ayuda a concentrar la atención en la palabra que estamos resolviendo pues al tener el foco sobre una celda del crucigrama, ésta se destacará en azul junto con todas aquellas celdas con las que componga una palabra.

- Si una celda tiene dos posibles direcciones, pulsando "ENTER" o clicando sobre la celda cambiaremos la orientación, pasando de vertical a horizontal y viceversa.


### Caja de pistas 🗝️

Bajo la tabla del crucigrama hay un espacio en el que se pintan las pistas. Las pistas se pintan una a una, siempre en relación a la casilla destacada y su dirección. Si permanecemos en una misma casilla y cambiamos de dirección, también cambiará la pista.

- La experiencia es diferente al crucigrama tradicional, ya que no se pueden conocer de antemano todas las pistas, pero simplifica la interfaz en dispositivos móviles y reduce la carga cognitiva de quien esté jugando.

### Flow-writing ✍️

Esta funcionalidad facilita la escritura y el borrado, tanto en dispositivos móviles como en desktop.

- El foco fluye de una casilla a la siguiente mientras escribimos o borramos, sin necesidad de pulsar tabs o flechas. 
- El foco saltará las casillas completadas, buscando la siguiente casilla vacía.
- Si estamos resolviendo una palabra horizontal, una vez la completemos, el foco viajará a la siguiente palabra horizontal. Por supuesto, también funciona en vertical 😊
- Si completamos a la última casilla del crucigrama, el foco regresará a la primera casilla.
  

### Temporizador ⏳

- La aplicación cuenta con un temporizador para calcular en cuánto tiempo completas el crucigrama, un dato que en un futuro formará parte del sistema de puntuación del juego.
- El temporizador se activa cuando se escribe la primera letra. 
- Si cerramos la ventana o esta se refresca en medio de la partida, el tiempo se parará y se guardará en localStorage. Se activará de nuevo cuando retomemos el crucigrama.

  
### Almacenamiento local 🗄️

- La página utiliza el localStorage para guardar avances en el crucigrama. De esta forma, al recargar la página, la información estará de nuevo disponible.
- La puntuación, el tiempo transcurrido y todas nuestras respuestas son los elementos que se guardan.
  

### Borrar todo 🗑️

- Al pulsar el botón "borrar todo" el crucigrama quedará en blanco, se vaciará el localStorage y se reiniciará el temporizador.
  

### Resolver todo ✅

- Este botón revela el resultado del crucigrama. 


### Mostrar errores 🔍

- Este botón ofrece la posibilidad de jugar con control de errores, o puede ser utilizado para realizar consultas puntuales durante la partida.
- Al pulsar el botón "mostrar errores", las letras del crucigrama que no coincidan con su pattern se mostrarán en rojo. Pulsando de nuevo el botón (ahora con el texto "ocultar errores") todas las letras serán de nuevo negras.

### Puntuación 💯

- El sistema suma puntos cada vez que escribes correctamente una letra, y lleva la cuenta de los errores cometidos. Sin embargo, solo se restarán puntos por estos errores cuando pulsemos el botón "mostrar errores".
- Una vez completado el crucigrama, se abrirá una ventana modal informándonos de que hemos completado el puzzle e indicando nuestra puntuación o nivel.


### Compartir en Twitter 🐥

- Al finalizar el crucigrama, podremos twitear nuestro resultado y compartir el juego entre nuestras amistades.

## Roadmap 🗺️

- Convertir el botón "mostrar errores" en un switch button.
- Crear una interfaz de doble confirmación para las acciones "Borrar todo" y "Resolver todo".
- Introducir el temporizador como un factor en la puntuación.
