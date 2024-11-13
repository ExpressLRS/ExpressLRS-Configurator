===============================================================================
=     B i e n v e n i d o   a l   t u t o r   d e   V I M  -  Versi�n 1.7     =
===============================================================================

     Vim es un editor muy potente que dispone de muchos comandos, demasiados
     para ser explicados en un tutor como �ste. Este tutor est� dise�ado
     para describir suficientes comandos para que usted sea capaz de
     aprender f�cilmente a usar Vim como un editor de prop�sito general.

     El tiempo necesario para completar el tutor es aproximadamente de 30
     minutos, dependiendo de cu�nto tiempo se dedique a la experimentaci�n.

     Los comandos de estas lecciones modificar�n el texto. Haga una copia de
     este fichero para practicar (con �vimtutor� esto ya es una copia).

     Es importante recordar que este tutor est� pensado para ense�ar con
     la pr�ctica. Esto significa que es necesario ejecutar los comandos
     para aprenderlos adecuadamente. Si �nicamente lee el texto, �se le
     olvidar�n los comandos.

     Ahora, aseg�rese de que la tecla de bloqueo de may�sculas NO est�
     activada y pulse la tecla	j  lo suficiente para mover el cursor
     de forma que la Lecci�n 1.1 ocupe completamente la pantalla.
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
		     Lecci�n 1.1: MOVER EL CURSOR

 ** Para mover el cursor, pulse las teclas h,j,k,l de la forma indicada. **
      ^
      k       Indicaci�n: La tecla h est� a la izquierda y lo mueve a la izquierda.
 < h	 l >		  La tecla l est� a la derecha y lo mueve a la derecha.
      j			  La tecla j parece una flecha que apunta hacia abajo.
      v

  1. Mueva el cursor por la pantalla hasta que se sienta c�modo con ello.

  2. Mantenga pulsada la tecla (j) hasta que se repita �autom�gicamente�.
     Ahora ya sabe como llegar a la lecci�n siguiente.

  3. Utilizando la tecla abajo, vaya a la lecci�n 1.2.

NOTA: Si alguna vez no est� seguro sobre algo que ha tecleado, pulse <ESC>
      para situarse en modo Normal. Luego vuelva a teclear la orden que deseaba.

NOTA: Las teclas de movimiento del cursor tambi�n funcionan. Pero usando
      hjkl podr� moverse mucho m�s r�pido una vez que se acostumbre a ello.
      �De verdad!

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
		    Lecci�n 1.2: SALIR DE VIM

  �� NOTA: Antes de ejecutar alguno de los siguientes pasos lea primero
	   la lecci�n entera!!

  1. Pulse la tecla <ESC> (para asegurarse de que est� en modo Normal).

  2. Escriba:  :q! <INTRO>
     Esto provoca la salida del editor DESCARTANDO cualquier cambio que haya hecho.

  3. Regrese aqu� ejecutando el comando que le trajo a este tutor.
     �ste puede haber sido:   vimtutor <INTRO>

  4. Si ha memorizado estos pasos y se siente con confianza, ejecute los
     pasos 1 a 3 para salir y volver a entrar al editor. 

NOTA:  :q! <INTRO> descarta cualquier cambio que haya realizado.
       En pr�ximas lecciones aprender� c�mo guardar los cambios en un archivo.

  5. Mueva el cursor hasta la Lecci�n 1.3.


~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
		   Lecci�n 1.3: EDITAR TEXTO - BORRAR

  ** Pulse  x  para eliminar el car�cter bajo el cursor. **

  1. Mueva el cursor a la l�nea de abajo se�alada con --->.

  2. Para corregir los errores, mueva el cursor hasta que est� sobre el
     car�cter que va a ser borrado.

  3. Pulse la tecla  x	para eliminar el car�cter no deseado.

  4. Repita los pasos 2 a 4 hasta que la frase sea la correcta.

---> La vvaca salt�� soobree laa luuuuna.

  5. Ahora que la l�nea esta correcta, contin�e con la Lecci�n 1.4.

NOTA: A medida que vaya avanzando en este tutor no intente memorizar,
      aprenda practicando.


~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
		   Lecci�n 1.4: EDITAR TEXTO - INSERTAR

         ** Pulse  i  para insertar texto. **

  1. Mueva el cursor a la primera l�nea de abajo se�alada con --->.

  2. Para hacer que la primera l�nea sea igual que la segunda, mueva el
     cursor hasta que est� sobre el car�cter ANTES del cual el texto va a ser
     insertado.

  3. Pulse  i  y escriba los caracteres a a�adir.

  4. A medida que sea corregido cada error pulse <ESC> para volver al modo
     Normal. Repita los pasos 2 a 4 para corregir la frase.

---> Flta texto en esta .
---> Falta algo de texto en esta l�nea.

  5. Cuando se sienta c�modo insertando texto pase vaya a la lecci�n 1.5.


~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
		     Lecci�n 1.5: EDITAR TEXTO - A�ADIR


			** Pulse  A  para a�adir texto. **

  1. Mueva el cursor a la primera l�nea inferior marcada con --->.
     No importa sobre qu� car�cter est� el cursor en esta l�nea.

  2. Pulse  A  y escriba el texto necesario.

  3. Cuando el texto haya sido a�adido pulse <ESC> para volver al modo Normal.

  4. Mueva el cursor a la segunda l�nea marcada con ---> y repita los
     pasos 2 y 3 para corregir esta frase.

---> Falta alg�n texto en es
     Falta alg�n texto en esta l�nea.
---> Tambi�n falta alg
     Tambi�n falta alg�n texto aqu�.

  5. Cuando se sienta c�modo a�adiendo texto pase a la lecci�n 1.6.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
		     Lecci�n 1.6: EDITAR UN ARCHIVO

		    ** Use  :wq  para guardar un archivo y salir **

 !! NOTA: Antes de ejecutar los siguientes pasos, lea la lecci�n entera!!

  1.  Si tiene acceso a otra terminal, haga lo siguiente en ella.
      Si no es as�, salga de este tutor como hizo en la lecci�n 1.2:  :q!

  2. En el s�mbolo del sistema escriba este comando:  vim archivo.txt <INTRO>
     'vim' es el comando para arrancar el editor Vim, 'archivo.txt'
     es el nombre del archivo que quiere editar
     Utilice el nombre de un archivo que pueda cambiar.

  3. Inserte y elimine texto como ya aprendi� en las lecciones anteriores.

  4. Guarde el archivo con los cambios y salga de Vim con:  :wq <INTRO>

  5. Si ha salido de vimtutor en el paso 1 reinicie vimtutor y baje hasta
     el siguiente sumario.

  6. Despu�s de leer los pasos anteriores y haberlos entendido: h�galos.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
			    RESUMEN DE LA LECCI�N 1


  1. El cursor se mueve utilizando las teclas de las flechas o las teclas hjkl.
	 h (izquierda)	   j (abajo)	  k (arriba)	  l (derecha)

  2. Para acceder a Vim desde el s�mbolo del sistema escriba:
     vim NOMBREARCHIVO <INTRO>

  3. Para salir de Vim escriba: <ESC> :q! <INTRO> para eliminar todos
     los cambios.
     O escriba:  <ESC>  :wq  <INTRO> para guardar los cambios.

  4. Para borrar un car�cter bajo el cursor en modo Normal pulse:  x

  5. Para insertar o a�adir texto escriba:
     i  escriba el texto a insertar <ESC> inserta el texto antes del cursor
	 A  escriba el texto a a�adir <ESC> a�ade texto al final de la l�nea

NOTA: Pulsando <ESC> se vuelve al modo Normal o cancela una orden no deseada
      o incompleta.

Ahora contin�e con la Lecci�n 2.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
		     Lecci�n 2.1:  COMANDOS PARA BORRAR


          ** Escriba dw para borrar una palabra **


  1. Pulse <ESC> para asegurarse de que est� en el modo Normal.

  2. Mueva el cursor a la l�nea inferior se�alada con --->.

  3. Mueva el cursor al comienzo de una palabra que desee borrar.

  4. Pulse   dw   para hacer que la palabra desaparezca.

  NOTA: La letra  d  aparecer� en la �ltima l�nea inferior derecha 
    de la pantalla mientras la escribe. Vim est� esperando que escriba  w .
    Si ve otro car�cter que no sea  d  escribi� algo mal, pulse <ESC> y
    comience de nuevo.

---> Hay algunas palabras p�salo bien que no pertenecen papel a esta frase.

  5. Repita los pasos 3 y 4 hasta que la frase sea correcta y pase a la
     lecci�n 2.2.


~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
		    Lecci�n 2.2: M�S COMANDOS PARA BORRAR


	  ** Escriba  d$  para borrar hasta el final de la l�nea. **

  1. Pulse  <ESC>  para asegurarse de que est� en el modo Normal.

  2. Mueva el cursor a la l�nea inferior se�alada con --->.

  3. Mueva el cursor al final de la l�nea correcta (DESPU�S del primer . ).

  4. Escriba  d$  para borrar hasta el final de la l�nea.

---> Alguien ha escrito el final de esta l�nea dos veces. esta l�nea dos veces.

  5. Pase a la lecci�n 2.3 para entender qu� est� pasando.



~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
		    Lecci�n 2.3: SOBRE OPERADORES Y MOVIMIENTOS


  Muchos comandos que cambian texto est�n compuestos por un operador y un
  movimiento.
  El formato para eliminar un comando con el operador de borrado  d  es el
  siguiente:

    d   movimiento

  Donde:
    d          - es el operador para borrar.
    movimiento - es sobre lo que el comando va a operar (lista inferior).

  Una lista resumida de movimientos:
   w - hasta el comienzo de la siguiente palabra, EXCLUYENDO su primer
       car�cter.
   e - hasta el final de la palabra actual, INCLUYENDO el �ltimo car�cter.
   $ - hasta el final de la l�nea, INCLUYENDO el �ltimo car�cter.

 Por tanto, al escribir  de  borrar� desde la posici�n del cursor, hasta
 el final de la palabra.

NOTA: Pulsando �nicamente el movimiento estando en el modo Normal sin un
      operador, mover� el cursor como se especifica en la lista anterior.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
		  Lecci�n 2.4: UTILIZAR UN CONTADOR PARA UN MOVIMIENTO


   ** Al escribir un n�mero antes de un movimiento, lo repite esas veces. **

  1. Mueva el cursor al comienzo de la l�nea marcada con --->.

  2. Escriba  2w  para mover el cursor dos palabras hacia adelante.

  3. Escriba  3e  para mover el cursor al final de la tercera palabra hacia
     adelante.

  4. Escriba  0  (cero) para colocar el cursor al inicio de la l�nea.

  5. Repita el paso 2 y 3 con diferentes n�meros.

---> Esto es solo una l�nea con palabras donde poder moverse.

  6. Pase a la lecci�n 2.5.




~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
		     Lecci�n 2.5: UTILIZAR UN CONTADOR PARA BORRAR MAS


   ** Al escribir un n�mero con un operador lo repite esas veces. **

  En combinaci�n con el operador de borrado y el movimiento mencionado
  anteriormente, a�ada un contador antes del movimiento para eliminar m�s:
	 d   n�mero   movimiento

  1. Mueva el cursor al inicio de la primera palabra en MAY�SCULAS en la
     l�nea marcada con --->.

  2. Escriba  d2w  para eliminar las dos palabras en MAY�SCULAS.

  3. Repita los pasos 1 y 2 con diferentes contadores para eliminar
     las siguientes palabras en MAY�SCULAS con un comando.

--->  Esta ABC DE serie FGHI JK LMN OP de palabras ha sido Q RS TUV limpiada.





~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
			 Lecci�n 2.6: OPERACI�N EN L�NEAS


		   ** Escriba  dd   para eliminar una l�nea completa. **

  Debido a la frecuencia con que se elimina una l�nea completa, los
  dise�adores de Vi, decidieron que ser�a m�s sencillo simplemente escribir
  dos letras d para eliminar una l�nea.

  1. Mueva el cursor a la segunda l�nea del p�rrafo inferior.
  2. Escriba  dd  para eliminar la l�nea.
  3. Ahora mu�vase a la cuarta l�nea.
  4. Escriba   2dd   para eliminar dos l�neas a la vez.

--->  1)  Las rosas son rojas,
--->  2)  El barro es divertido,
--->  3)  La violeta es azul,
--->  4)  Tengo un coche,
--->  5)  Los relojes dan la hora,
--->  6)  El az�car es dulce
--->  7)  Y tambi�n lo eres t�.

La duplicaci�n para borrar l�neas tambi�n funcionan con los operadores
mencionados anteriormente.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
		     Lecci�n 2.7: EL MANDATO DESHACER


   ** Pulse  u	para deshacer los �ltimos comandos,
	     U	para deshacer una l�nea entera.       **

  1. Mueva el cursor a la l�nea inferior se�alada con ---> y sit�elo bajo el
     primer error.
  2. Pulse  x  para borrar el primer car�cter no deseado.
  3. Pulse ahora  u  para deshacer el �ltimo comando ejecutado.
  4. Ahora corrija todos los errores de la l�nea usando el comando  x.
  5. Pulse ahora  U  may�scula para devolver la l�nea a su estado original.
  6. Pulse ahora  u  unas pocas veces para deshacer lo hecho por  U  y los
     comandos previos.
  7. Ahora pulse CTRL-R (mantenga pulsada la tecla CTRL y pulse R) unas
     cuantas veces para volver a ejecutar los comandos (deshacer lo deshecho).

---> Corrrija los errores dee esttta l�nea y vuuelva a ponerlos coon deshacer.

  8. Estos son unos comandos muy �tiles. Ahora vayamos al resumen de la
     lecci�n 2.




~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
			    RESUMEN DE LA LECCI�N 2

  1. Para borrar desde el cursor hasta siguiente palabra pulse:	     dw
  2. Para borrar desde el cursor hasta el final de la palabra pulse: de
  3. Para borrar desde el cursor hasta el final de una l�nea pulse:	 d$
  4. Para borrar una l�nea entera pulse:                             dd

  5. Para repetir un movimiento anteponga un n�mero:  2w
  6. El formato para un comando de cambio es:
               operador  [n�mero]  movimiento
     donde:
       comando    - es lo que hay que hacer, por ejemplo,  d  para borrar
       [n�mero]   - es un n�mero opcional para repetir el movimiento
       movimiento - se mueve sobre el texto sobre el que operar, como
		            w (palabra), $ (hasta el final de la l�nea), etc.
  7. Para moverse al inicio de la l�nea utilice un cero:  0

  8. Para deshacer acciones previas pulse:		         u (u min�scula)
     Para deshacer todos los cambios de una l�nea pulse: U (U may�scula)
     Para deshacer lo deshecho pulse:			         CTRL-R


~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
			 Lecci�n 3.1: EL COMANDO �PUT� (poner)

** Pulse  p  para poner (pegar) despu�s del cursor lo �ltimo que ha borrado. **

  1. Mueva el cursor a la primera l�nea inferior marcada con --->.

  2. Escriba  dd  para borrar la l�nea y almacenarla en un registro de Vim.

  3. Mueva el cursor a la l�nea c) por ENCIMA de donde deber�a estar 
     la l�nea eliminada.

  4. Pulse   p	para pegar la l�nea borrada por debajo del cursor.

  5. Repita los pasos 2 a 4 para poner todas las l�neas en el orden correcto.

---> d) �Puedes aprenderla t�?
---> b) La violeta es azul,
---> c) La inteligencia se aprende,
---> a) Las rosas son rojas,
     

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
		       Lecci�n 3.2: EL COMANDO REEMPLAZAR


  ** Pulse  rx  para reemplazar el car�cter bajo el cursor con  x . **

  1. Mueva el cursor a la primera l�nea inferior marcada con --->.

  2. Mueva el cursor para situarlo sobre el primer error.

  3. Pulse   r	 y despu�s el car�cter que deber�a ir ah�.

  4. Repita los pasos 2 y 3 hasta que la primera sea igual a la segunda.

---> �Cuendo esta l�nea fue rscrita alguien pulso algunas teclas equibocadas!
---> �Cuando esta l�nea fue escrita alguien puls� algunas teclas equivocadas!

  5. Ahora pase a la lecci�n 3.3.

NOTA: Recuerde que deber�a aprender practicando.



~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
			Lecci�n 3.3: EL COMANDO CAMBIAR


     ** Para cambiar hasta el final de una palabra, escriba  ce . **

  1. Mueva el cursor a la primera l�nea inferior marcada con --->.

  2. Sit�e el cursor en la u de lubrs.

  3. Escriba  ce  y corrija la palabra (en este caso, escriba '�nea').

  4. Pulse <ESC> y mueva el cursor al siguiente error que debe ser cambiado.

  5. Repita los pasos 3 y 4 hasta que la primera frase sea igual a la segunda.

---> Esta lubrs tiene unas pocas pskavtad que corregir usem el comando change.
---> Esta l�nea tiene unas pocas palabras que corregir usando el comando change.

Tenga en cuenta que  ce  elimina la palabra y entra en el modo Insertar.
                    cc  hace lo mismo para toda la l�nea.


~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
		      Lecci�n 3.4: M�S CAMBIOS USANDO c

   ** El operador change se utiliza con los mismos movimientos que delete. **

  1. El operador change funciona de la misma forma que delete. El formato es:

       c   [n�mero]   movimiento

  2. Los movimientos son tambi�n los mismos, tales como  w (palabra) o 
  $ (fin de la l�nea).

  3. Mueva el cursor a la primera l�nea inferior se�alada con --->.

  4. Mueva el cursor al primer error.

  5. Pulse  c$  y escriba el resto de la l�nea para que sea como la segunda
     y pulse <ESC>.

---> El final de esta l�nea necesita alguna ayuda para que sea como la segunda.
---> El final de esta l�nea necesita ser corregido usando el comando  c$.

NOTA: Puede utilizar el retorno de carro para corregir errores mientras escribe.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
			    RESUMEN DE LA LECCI�N 3


  1. Para volver a poner o pegar el texto que acaba de ser borrado,
     escriba  p . Esto pega el texto despu�s del cursor (si se borr� una
     l�nea, al pegarla, esta se situar� en la l�nea debajo del cursor).

  2. Para reemplazar el car�cter bajo el cursor, pulse	r   y luego el
     car�cter que quiere que est� en ese lugar.

  3. El operador change le permite cambiar desde la posici�n del cursor
     hasta donde el movimiento indicado le lleve. Por ejemplo, pulse  ce
     para cambiar desde el cursor hasta el final de la palabra, o  c$
     para cambiar hasta el final de la l�nea.

  4. El formato para change es:

	 c   [n�mero]   movimiento

  Pase ahora a la lecci�n siguiente.


~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	       Lecci�n 4.1: UBICACI�N DEL CURSOR Y ESTADO DEL ARCHIVO

 ** Pulse CTRL-G para mostrar su situaci�n en el fichero y su estado.
    Pulse G para moverse a una determinada l�nea del fichero. **

NOTA: ��Lea esta lecci�n entera antes de ejecutar cualquiera de los pasos!!

  1. Mantenga pulsada la tecla Ctrl y pulse  g . Le llamamos a esto CTRL-G.
     Aparecer� un mensaje en la parte inferior de la p�gina con el nombre
     del archivo y la posici�n en este. Recuerde el n�mero de l�nea
     para el paso 3.

NOTA: Quiz�s pueda ver la posici�n del cursor en la esquina inferior derecha
      de la pantalla. Esto ocurre cuando la opci�n 'ruler' (regla) est�
      habilitada (consulte  :help 'ruler'  )

  2. Pulse  G  para mover el cursor hasta la parte inferior del archivo.
     Pulse  gg  para mover el cursor al inicio del archivo.

  3. Escriba el n�mero de la l�nea en la que estaba y despu�s  G  . Esto
     le volver� a la l�nea en la que estaba cuando puls� CTRL-G.

  4. Si se siente seguro en poder hacer esto ejecute los pasos 1 a 3.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
			Lecci�n 4.2: EL COMANDO �SEARCH� (buscar)

     ** Escriba  /  seguido de una frase para buscar la frase. **

  1. En modo Normal pulse el car�cter  / . F�jese que tanto el car�cter  /
     como el cursor aparecen en la �ltima l�nea de la pantalla, lo mismo
     que el comando  : .

  2. Escriba ahora   errroor   <INTRO>. Esta es la palabra que quiere buscar.

  3. Para repetir la b�squeda de la misma frase otra vez, simplemente pulse  n .
     Para buscar la misma frase en la direcci�n opuesta, pulse  N .

  4. Si quiere buscar una frase en la direcci�n opuesta (hacia arriba),
     utilice el comando  ?  en lugar de  / .
  
  5. Para regresar al lugar de donde proced�a pulse  CTRL-O  (Mantenga pulsado
  Ctrl mientras pulsa la letra o). Repita el proceso para regresar m�s atr�s.
  CTRL-I va hacia adelante.

---> "errroor" no es la forma correcta de escribir error, errroor es un error.

NOTA: Cuando la b�squeda llega al final del archivo, continuar� desde el
      comienzo, a menos que la opci�n 'wrapscan' haya sido desactivada.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	       Lecci�n 4.3: B�SQUEDA PARA COMPROBAR PAR�NTESIS

   ** Pulse %  para encontrar el par�ntesis correspondiente a ),] o } . **

  1. Sit�e el cursor en cualquiera de los caracteres (, [ o { en la l�nea 
     inferior se�alada con --->.

  2. Pulse ahora el car�cter  %  .

  3. El cursor se mover� a la pareja de cierre del par�ntesis, corchete
     o llave correspondiente.

  4. Pulse  %  para mover el cursor a la otra pareja del car�cter.

  5. Mueva el cursor a otro (,),[,],{ o } y vea lo que hace % .

---> Esto ( es una l�nea de prueba con (, [, ], {, y } en ella. ))

NOTA: �Esto es muy �til en la detecci�n de errores en un programa con
      par�ntesis, corchetes o llaves sin pareja.
      


~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
		  Lecci�n 4.4: EL COMANDO SUSTITUIR


    ** Escriba	:s/viejo/nuevo/g para sustituir 'viejo' por 'nuevo'. **

  1. Mueva el cursor a la l�nea inferior se�alada con --->.

  2. Escriba  :s/laas/las/  <INTRO> . Tenga en cuenta que este mandato cambia
     s�lo la primera aparici�n en la l�nea de la expresi�n a cambiar.
  
  3. Ahora escriba :/laas/la/g . Al a�adir la opci�n  g  esto significa
     que har� la sustituci�n global en la l�nea, cambiando todas las
     ocurrencias del t�rmino "laas" en la l�nea.

---> Laas mejores �pocas para ver laas flores son laas primaveras.

  4. Para cambiar cada ocurrencia de la cadena de caracteres entre dos l�neas,
   Escriba  :#,#s/viejo/nuevo/g  donde #,# son los n�meros de l�nea del rango
                                 de l�neas donde se realizar� la sustituci�n.
   Escriba  :%s/old/new/g        para cambiar cada ocurrencia en todo el
                                 archivo.
   Escriba  :%s/old/new/gc       para encontrar cada ocurrencia en todo el 
                                 archivo, pidiendo confirmaci�n para 
                                 realizar la sustituci�n o no.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
			    RESUMEN DE LA LECCI�N 4


  1. CTRL-G  muestra la posici�n del cursor en el fichero y su estado.
             G  mueve el cursor al final del archivo.
     n�mero  G  mueve el cursor a ese n�mero de l�nea.
            gg  mueve el cursor a la primera l�nea del archivo.

  2. Escribiendo  /  seguido de una frase busca la frase hacia ADELANTE.
     Escribiendo  ?  seguido de una frase busca la frase hacia ATR�S.
     Despu�s de una b�squeda pulse  n  para encontrar la aparici�n
     siguiente en la misma direcci�n o  N  para buscar en direcci�n opuesta.

  3. Pulsando  %  cuando el cursor esta sobre (,), [,], { o } localiza
     la pareja correspondiente.

  4. Para cambiar viejo en el primer nuevo en una l�nea escriba  :s/viejo/nuevo
   Para cambiar todos los viejo por nuevo en una l�nea escriba :s/viejo/nuevo/g
   Para cambiar frases entre dos n�meros de l�neas escriba  :#,#s/viejo/nuevo/g
   Para cambiar viejo por nuevo en todo el fichero escriba  :%s/viejo/nuevo/g
   Para pedir confirmaci�n en cada caso a�ada  'c'	    :%s/viejo/nuevo/gc


~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
		Lecci�n 5.1: C�MO EJECUTAR UN MANDATO EXTERNO


  ** Escriba  :!  seguido de un comando externo para ejecutar ese comando. **

  1. Escriba el conocido comando  :  para situar el cursor al final de la
     pantalla. Esto le permitir� introducir un comando.

  2. Ahora escriba el car�cter ! (signo de admiraci�n). Esto le permitir�
     ejecutar cualquier mandato del sistema.

  3. Como ejemplo escriba   ls	 despu�s del ! y luego pulse <INTRO>. Esto
     le mostrar� una lista de su directorio, igual que si estuviera en el
     s�mbolo del sistema. Si  ls  no funciona utilice	:!dir	.

NOTA: De esta manera es posible ejecutar cualquier comando externo,
      tambi�n incluyendo argumentos.

NOTA: Todos los comando   :   deben finalizarse pulsando <INTRO>.
      De ahora en adelante no siempre se mencionar�.


~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
		     Lecci�n 5.2: M�S SOBRE GUARDAR FICHEROS


     ** Para guardar los cambios hechos en un fichero,
	escriba  :w NOMBRE_DE_FICHERO **

  1. Escriba  :!dir  o	:!ls  para ver una lista de los archivos 
     de su directorio.
     Ya sabe que debe pulsar <INTRO> despu�s de ello.

  2. Elija un nombre de fichero que todav�a no exista, como TEST.

  3. Ahora escriba   :w TEST  (donde TEST es el nombre de fichero elegido).

  4. Esta acci�n guarda todo el fichero  (Vim Tutor)  bajo el nombre TEST.
     Para comprobarlo escriba	:!dir  o  :!ls  de nuevo y vea su directorio.

NOTA: Si saliera de Vim y volviera a entrar de nuevo con  vim TEST  , el
      archivo ser�a una copia exacta del tutorial cuando lo guard�.

  5. Ahora elimine el archivo escribiendo (Windows):  :!del TEST
                                        o (Unix):     :!rm TEST


~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	       Lecci�n 5.3: SELECCIONAR TEXTO PARA GUARDAR


   ** Para guardar parte del archivo, escriba  v  movimiento  :w ARCHIVO **

  1. Mueva el cursor a esta l�nea.

  2. Pulse  v  y mueva el cursor hasta el quinto elemento inferior. Vea que
     el texto es resaltado.

  3. Pulse el car�cter  :  en la parte inferior de la pantalla aparecer�
     :'<,'>

  4. Pulse  w TEST  , donde TEST es un nombre de archivo que a�n no existe.
     Verifique que ve  :'<,'>w TEST  antes de pulsar <INTRO>.

  5. Vim escribir� las l�neas seleccionadas en el archivo TEST. Utilice
     :!dir  o  :!ls  para verlo. �No lo elimine todav�a! Lo utilizaremos
     en la siguiente lecci�n.

NOTA: Al pulsar  v  inicia la selecci�n visual. Puede mover el cursor para
      hacer la selecci�n m�s grande o peque�a. Despu�s puede utilizar un
      operador para hacer algo con el texto. Por ejemplo,  d  eliminar�
      el texto seleccionado.


~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
		Lecci�n 5.4: RECUPERANDO Y MEZCLANDO FICHEROS


 ** Para insertar el contenido de un fichero escriba :r NOMBRE_DEL_FICHERO **

  1. Sit�e el cursor justo por encima de esta l�nea.

NOTA: Despu�s de ejecutar el paso 2 ver� texto de la lecci�n 5.3. Despu�s
      DESCIENDA hasta ver de nuevo esta lecci�n.

  2. Ahora recupere el archivo TEST utilizando el comando  :r TEST  donde
     TEST es el nombre que ha utilizado.
     El archivo que ha recuperado se colocar� debajo de la l�nea donde
     se encuentra el cursor.

  3. Para verificar que se ha recuperado el archivo, suba el cursor y 
     compruebe que ahora hay dos copias de la lecci�n 5.3, la original y
     la versi�n del archivo.

NOTA: Tambi�n puede leer la salida de un comando externo. Por ejemplo,
      :r !ls  lee la salida del comando ls y lo pega debajo de la l�nea
      donde se encuentra el cursor.


~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
			   RESUMEN DE LA LECCI�N 5


  1.  :!comando  ejecuta un comando externo.

      Algunos ejemplos �tiles son:
      (Windows)     (Unix)
	  :!dir          :!ls           - muestra el contenido de un directorio.
	  :!del ARCHIVO  :!rm ARCHIVO   -  borra el fichero ARCHIVO.

  2.  :w ARCHIVO escribe el archivo actual de Vim en el disco con el 
      nombre de ARCHIVO.

  3.  v  movimiento  :w ARCHIVO  guarda las l�neas seleccionadas visualmente
      en el archivo ARCHIVO.

  4.  :r ARCHIVO  recupera del disco el archivo ARCHIVO y lo pega debajo
      de la posici�n del cursor.

  5.  :r !dir  lee la salida del comando dir y lo pega debajo de la
      posici�n del cursor.


~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
			 Lecci�n 6.1: EL COMANDO OPEN


	 ** Pulse  o  para abrir una l�nea debajo del cursor
	    y situarle en modo Insertar **

  1. Mueva el cursor a la l�nea inferior se�alada con --->.

  2. Pulse la letra min�scula  o  para abrir una l�nea por DEBAJO del cursor
     y situarle en modo Insertar.
  
  3. Ahora escriba alg�n texto y despu�s pulse <ESC> para salir del modo
     insertar.

---> Despu�s de pulsar  o  el cursor se sit�a en la l�nea abierta en modo Insertar.

  4. Para abrir una l�nea por ENCIMA del cursor, simplemente pulse una O
     may�scula, en lugar de una o min�scula. Pruebe esto en la l�nea siguiente.

---> Abra una l�nea sobre esta pulsando O cuando el cursor est� en esta l�nea.



~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
			Lecci�n 6.2: EL COMANDO APPEND (a�adir)


	 ** Pulse  a  para insertar texto DESPU�S del cursor. **

  1. Mueva el cursor al inicio de la primera l�nea inferior se�alada con --->.

  2. Escriba  e  hasta que el cursor est� al final de  l�n .

  3. Escriba una  a  (min�scula) para a�adir texto DESPU�S del cursor.

  4. Complete la palabra como en la l�nea inferior. Pulse <ESC> para salir
     del modo insertar.
  
  5. Utilice  e  para moverse hasta la siguiente palabra incompleta y 
     repita los pasos 3 y 4.

---> Esta l�n le permit prati c�mo a�ad texto a una l�nea.
---> Esta l�nea le permitir� practicar c�mo a�adir texto a una l�nea.

NOTA: a, i y A todos entran en el modo Insertar, la �nica diferencia es
      d�nde ubican los caracteres insertados.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
		     Lecci�n 6.3: OTRA VERSI�N DE REPLACE (remplazar)


    ** Pulse una  R  may�scula para sustituir m�s de un car�cter. **

  1. Mueva el cursor a la primera l�nea inferior se�alada con --->. Mueva
     el cursor al inicio de la primera  xxx .

  2. Ahora pulse  R  y escriba el n�mero que aparece en la l�nea inferior,
     esto reemplazar� el texto xxx .
  
  3. Pulse <ESC> para abandonar el modo Reemplazar. Observe que el resto de
     la l�nea permanece sin modificaciones.

  4. Repita los pasos para reemplazar el texto xxx que queda.

---> Sumar 123 a xxx da un resultado de xxx.
---> Sumar 123 a 456 da un resultado de 579.

NOTA: El modo Reemplazar es como el modo Insertar, pero cada car�cter escrito
      elimina un car�cter ya existente.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
			 Lecci�n 6.4: COPIAR Y PEGAR TEXTO



	  ** Utilice el operador  y  para copiar texto y  p  para pegarlo. **

  1. Mueva el cursor a la l�nea inferior marcada con ---> y posicione el 
     cursor despu�s de "a)". 

  2. Inicie el modo Visual con  v  y mueva el cursor justo antes de "primer".

  3. Pulse  y  para copiar ("yank") el texto resaltado.

  4. Mueva el cursor al final de la siguiente l�nea mediante:  j$

  5. Pulse  p  para poner (pegar) el texto. Despu�s escriba: el segundo <ESC>.

  6. Utilice el modo visual para seleccionar " elemento.", y c�pielo con  y
     mueva el cursor al final de la siguiente l�nea con j$  y pegue el texto
     reci�n copiado con  p .

--->  a) este es el primer elemento.
      b)

NOTA: Tambi�n puede utilizar  y  como un operador:  yw  copia una palabra,
      yy  copia la l�nea completa donde est� el cursor, despu�s  p  pegar�
      esa l�nea.
     
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
			    Lecci�n 6.5: ACTIVAR (SET) UNA OPCI�N


	  ** Active una opci�n para buscar o sustituir ignorando si est�
         en may�sculas o min�sculas el texto. **

  1. Busque la cadena de texto 'ignorar' escribiendo:  /ignorar <INTRO>
     Repita la b�squeda varias veces pulsando  n .

  2. Active la opci�n 'ic' (Ignore case o ignorar may�sculas y min�sculas) 
     mediante:   :set ic

  3. Ahora busque de nuevo 'ignorar' pulsando  n
     Observe que ahora tambi�n se encuentran Ignorar e IGNORAR.

  4. Active las opciones 'hlsearch' y 'incsearch' escribiendo:  :set hls is

  5. Ahora escriba de nuevo el comando de b�squeda y vea qu� ocurre:  /ignore <INTRO>

  6. Para inhabilitar el ignorar la distinci�n de may�sculas y min�sculas     
     escriba:  :set noic

NOTA:  Para eliminar el resaltado de las coincidencias escriba:   :nohlsearch
NOTA:  Si quiere ignorar las may�sculas y min�sculas, solo para un comando
       de b�squeda, utilice  \c  en la frase:  /ignorar\c <INTRO>
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
			   RESUMEN DE LA LECCI�N 6


  1. Escriba  o  para abrir una l�nea por DEBAJO de la posici�n del cursor y 
     entrar en modo Insertar.
     Escriba  O  para abrir una l�nea por ENCIMA de la posici�n del cursor y
     entrar en modo Insertar

  2. Escriba  a  para insertar texto DESPU�S del cursor.
     Escriba  A  para insertar texto al final de la l�nea.

  3. El comando  e  mueve el cursor al final de una palabra.

  4. El operador  y  copia (yank) texto,  p  lo pega (pone).

  5. Al escribir una  R  may�scula entra en el modo Reemplazar hasta que
     se pulsa  <ESC>  .

  6. Al escribir ":set xxx" activa la opci�n "xxx".  Algunas opciones son:
  	'ic' 'ignorecase'	ignorar may�sculas/min�sculas al buscar
	'is' 'incsearch'	mostrar las coincidencias parciales para la b�squeda
                        de una frase
	'hls' 'hlsearch'	resalta todas las coincidencias de la frases
     Puedes utilizar tanto los nombre largos o cortos de las opciones.

  7. A�ada "no" para inhabilitar una opci�n:   :set noic

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
		  Lecci�n 7: OBTENER AYUDA


		 ** Utilice el sistema de ayuda en l�nea **

  Vim dispone de un sistema de ayuda en l�nea. Para comenzar, pruebe una
  de estas tres formas:
	- pulse la tecla <AYUDA> (si dispone de ella)
	- pulse la tecla <F1> (si dispone de ella)
	- escriba   :help <INTRO>

  Lea el texto en la ventana de ayuda para descubrir c�mo funciona la ayuda.
  Escriba  CTRL-W CTRL-W  para saltar de una ventana a otra.
  Escriba    :q <INTRO>   para cerrar la ventana de ayuda.

  Puede encontrar ayuda en casi cualquier tema a�adiendo un argumento al
  comando �:help�. Pruebe �stos (no olvide pulsar <INTRO>):

  :help w 
  :help c_CTRL-D
  :help insert-index 
  :help user-manual
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
		      Lecci�n 7.2: CREAR UN SCRIPT DE INICIO


			  ** Habilitar funcionalidades en Vim **

  Vim tiene muchas m�s funcionalidades que Vi, pero algunas est�n
  inhabilitadas de manera predeterminada.
  Para empezar a utilizar m�s funcionalidades deber�a crear un archivo
  llamado "vimrc".

  1. Comience a editar el archivo "vimrc". Esto depende de su sistema:
	:e ~/.vimrc		para Unix
	:e ~/_vimrc		para Windows

  2. Ahora lea el contenido del archivo "vimrc" de ejemplo:
	:r $VIMRUNTIME/vimrc_example.vim

  3. Guarde el archivo mediante:
	:w

  La pr�xima vez que inicie Vim, este usar� el resaltado de sintaxis.
  Puede a�adir todos sus ajustes preferidos a este archivo "vimrc".
  Para m�s informaci�n escriba  :help vimrc-intro

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
			     Lecci�n 7.3: COMPLETADO


	      ** Completado de la l�nea de comandos con CTRL-D o <TAB> **

  1. Aseg�rese de que Vim no est� en el modo compatible:  :set nocp

  2. Vea qu� archivos existen en el directorio con:  :!ls   o   :!dir

  3. Escriba el inicio de un comando:  :e

  4. Pulse  CTRL-D  y Vim mostrar� una lista de comandos que empiezan con "e".

  5. A�ada  d<TAB>  y Vim completar� el nombre del comando a ":edit".

  6. Ahora a�ada un espacio y el inicio del nombre de un archivo:  :edit FIL

  7. Pulse <TAB>.  Vim completar� el nombre (si solo hay uno).

NOTA:  El completado funciona con muchos comandos. Solo pulse CTRL-D o
       <TAB>.  Es especialmente �til para   :help .

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
			       RESUMEN DE LA LECCI�N 7


  1. Escriba  :help  o pulse <F1> o <HELP>  para abrir la ventana de ayuda.

  2. Escriba  :help cmd  para encontrar ayuda sobre  cmd .

  3. Escriba  CTRL-W CTRL-W  para saltar a otra ventana.

  4. Escriba  :q  para cerrar la ventana de ayuda.

  5. Cree un fichero vimrc de inicio para guardar sus ajustes preferidos.

  6. Cuando escriba un comando  :  pulse CTRL-D para ver posibles opciones.
     Pulse <TAB> para utilizar una de las opciones de completado.







~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  Aqu� concluye el tutor de Vim. Est� pensado para dar una visi�n breve del
  editor Vim, lo suficiente para permitirle usar el editor de forma bastante
  sencilla. Est� muy lejos de estar completo pues Vim tiene much�simos m�s
  comandos. Lea el siguiente manual de usuario: ":help user-manual".

  Para lecturas y estudios posteriores se recomienda el libro:
	Vim - Vi Improved - de Steve Oualline
	Editado por: New Riders
  El primer libro dedicado completamente a Vim. Especialmente �til para
  reci�n principiantes.
  Tiene muchos ejemplos e im�genes.
  Vea https://iccf-holland.org/click5.html

  Este tutorial ha sido escrito por Michael C. Pierce y Robert K. Ware,
  Colorado School of Mines utilizando ideas suministradas por Charles Smith,
  Colorado State University.
  E-mail: bware@mines.colorado.edu.

  Modificado para Vim por Bram Moolenaar.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    
  Traducido del ingl�s por:

  * Eduardo F. Amatria
    Correo electr�nico: eferna1@platea.pntic.mec.es
  * Victorhck
    Correo electr�nico: victorhck@opensuse.org

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
