
// 1
var audio = document.getElementById("controlaudio"); //creamos el objeto para el control del audio 
var questions = [
	[
		"Es la capacidad de entender como funciona el dinero, con la finalidad de tomar buenas decisiones",
		"Educacion profesional",
		"Educacion financiera",
		"ahorro",
		"Activos",
		2
	],
	[
		"Que trampas hay que evitar?",
		"Comprar un auto",
		"Salir a todas las fiestas", 
		"Muchas deudas en tarjeta de crèdito",
		"Todas las anteriores son correctas",
		4
	],
	[
		"Todo aquello que te produce ingresos,ganancias,beneficios",
		"Activos",
		"Ahorro",
		"pasivos",
		"Ninguno de los anteriores",
		1
	],
	[
		"Cual es uno de los errores màs comunes de las finanzas personales?",
		"Uso de tarjetas",
		"No tienen fondos de emergencias",
		"Gastan en cosas necesarias",
		"Si llevan un control de gastos diarios ",
		2
	],
	[
		"Todo aquello que te produce gastos,deudas,etc.",
		"Capital",
		"Ahorro",
		"Activos",
		"Pasivos",
		4
	],
	[
		"Es la accion de separar una parte de los ingresos con el fin de guardarlo para su uso en el futuro",
		"Capital",
		"Prestamo",
		"Ahorro",
		"Ninguno de los anteriores",
		3
	],
	[
		"Cual de estas opciones es una deuda buena?",
		"Pedir prestamo para adquirir un Activo",
		"Pedir un prestamo para invertir en un negocio",
		"La deuda buena  hace crecer tu efectivo ",
		"Todas las opciones son correctas",
		4
	],
	[
		"Representa la totalidad del patrimonio de una persona",
		"Activos",
		"Patrimonio neto",
		"Capital financiero",
		"Ahorro",
		3
	],
	[
		"Cuales son deudas malas. Seleciona las respuestas correctas",
		"A)Pedir prestamo para adquirir un pasivo ",
		"B)Pedir un prestamo para comprar un auto",
		"A Y B son correctos",
		"Ninguna es correcta",
		3
	],
	[
		"Es la diferencia entre el Activo y el Pasivo",
		"Cuenta",
		"Deudas",
		"Patrimonio neto",
		"Gastos",
		3
	],
 

];

// 2
var questionTemplate = _.template(" \
	<div class='card question'><span class='question'><%= question %></span> \
      <ul class='options'> \
        <li> \
          <input type='radio' name='question[<%= index %>]' value='0' id='q<%= index %>o1'> \
          <label for='q<%= index %>o1'><%= a %></label> \
        </li> \
        <li> \
          <input type='radio' name='question[<%= index %>]' value='1' id='q<%= index %>o2'> \
          <label for='q<%= index %>o2'><%= b %></label> \
        </li> \
        <li> \
          <input type='radio' name='question[<%= index %>]' value='2' id='q<%= index %>o3'> \
          <label for='q<%= index %>o3'><%= c %></label> \
        </li> \
        <li> \
          <input type='radio' name='question[<%= index %>]' value='3' id='q<%= index %>o4'> \
          <label for='q<%= index %>o4'><%= d %></label> \
        </li> \
      </ul> \
    </div> \
    ");


// 3
var points,
	pointsPerQuestion,
	currentQuestion,
	questionTimer,
	timeForQuestion = 20, // seconds
	timeLeftForQuestion; 

// 4
$(function() {
	
  //	audio.disabled=true  ;   //primero desabilitamos el audio 
	// 
	$('audio.controlaudio').disabled=true  ;
	$('button.start').click(start);  //inicia el juego 
	$('.play_again button').click(restart);
	$('')

	function restart() {
		points = 0;
		pointsPerQuestion = 10;
		currentQuestion = 0;
		timeLeftForQuestion = timeForQuestion;

		$('.finish.card').hide();
		$('div.start').show(); 
		$('.times_up').hide();

		generateCards();
		updateTime();
		updatePoints();
	}

	// 
	function start() {
		$('audio.controlaudio').disabled=false ;  //za no esta desabilitado, deberia de reproducir el audio 
		$('div.start').fadeOut(200, function() {
			moveToNextQuestion();
		});
	}

	// 
	function generateCards() {
		$('.questions').html('');
		for (var i = 0; i < questions.length; i++) {
			var q = questions[i];
			var html = questionTemplate({
				question: q[0],
				index: i,
				a: q[1],
				b: q[2],
				c: q[3],
				d: q[4]
			});
			$('.questions').append(html);
		};
		$('.question.card input').change(optionSelected);
	}

	// 
	function moveToNextQuestion() {
		currentQuestion += 1;
		if (currentQuestion > 1) {
			$('.question.card:nth-child(' + (currentQuestion-1) + ')').hide();
		}
		showQuestionCardAtIndex(currentQuestion);
		setupQuestionTimer();
	}

	// 
	function setupQuestionTimer() {
		if (currentQuestion > 1) {
			clearTimeout(questionTimer);
		}
		timeLeftForQuestion = timeForQuestion;
		questionTimer = setTimeout(countdownTick, 1000);
	}

	// 
	function showQuestionCardAtIndex(index) { // staring at 1
		var $card = $('.question.card:nth-child(' + index + ')').show();
	}

	// 
	function countdownTick() {
		timeLeftForQuestion -= 1;
		updateTime();
		if (timeLeftForQuestion == 0) { 
			return finish();
		}
		questionTimer = setTimeout(countdownTick, 1000);
	}

	// 
	function updateTime() {
		$('.countdown .time_left').html(timeLeftForQuestion + 's');
	}

	// 
	function updatePoints() {
		$('.points span.points').html(points + ' puntos');
	}

	// 
	function optionSelected() {
		var selected = parseInt(this.value);
		var correct = questions[currentQuestion-1][5]-1;

		if (selected == correct) {
			window.aciertoAudio.play();
			points += pointsPerQuestion;
			updatePoints();
			correctAnimation();

		} else {
			window.errorAudio.play();
			var correctReply = questions[currentQuestion-1][correct+1]
			wrongAnimation(correctReply);
		}

		if (currentQuestion == questions.length) {
			clearTimeout(questionTimer);
			return finish(points);
		}
		moveToNextQuestion();
	}

	
	function correctAnimation() {
		animatePoints('right');
	}

	// 
	function wrongAnimation(respuesta) {
		animatePoints('wrong');
		alert("Respuesta INCORRECTA, LA RESPUESTA ES: "+respuesta)
	}

	// 
	function animatePoints(cls) {
		$('header .points').addClass('animate ' + cls);
		setTimeout(function() {
			$('header .points').removeClass('animate ' + cls);
		}, 500);
	}

	// 
	function finish(puntaje) {
		if (timeLeftForQuestion == 0) {
			$('.times_up').show();
		}
		
			$('p.final_points').html(points + ' puntos');
			$('.question.card:visible').hide();
			$('.finish.card').show();
		if (puntaje == 100){
			window.trunfoAudio.play();
		}
	}

	// 
	restart();

});