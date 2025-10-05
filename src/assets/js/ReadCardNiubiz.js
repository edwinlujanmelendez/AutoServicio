//$.getScript("http://localhost:4200/assets/js/FunctionRead.js", function(){
//    console.log("Running insertJSFile.js");
//});


/*var number = document.getElementById('number');var coincidencia1 = '960430';var coincidencia2 = '960410';number.addEventListener('keypress', function(keyboardEvent) {var cont = 0;var texto = $('#number').val();console.log(texto);if(texto != ''){texto = texto.replace('-','');if(texto.indexOf(coincidencia1) != -1 ){cont++;}if(texto.indexOf(coincidencia2) != -1 ){cont++;}if(cont>0){console.log('Ocultar Botón');$('.form-groupnoborder').hide();}else{console.log('Mostrar Botón');$('.form-groupnoborder').show();}}});


var script = "var number = document.getElementById('number');var coincidencia1 = '960430';var coincidencia2 = '960410';number.addEventListener('keypress', function(keyboardEvent) {var cont = 0;var texto = $('#number').val();console.log(texto);if(texto != ''){texto = texto.replace('-','');if(texto.indexOf(coincidencia1) != -1 ){cont++;}if(texto.indexOf(coincidencia2) != -1 ){cont++;}if(cont>0){console.log('Ocultar Botón');$('.form-groupnoborder').hide();}else{console.log('Mostrar Botón');$('.form-groupnoborder').show();}}});";
$('visaNetJS').prevObject[0].body.append($('<script>').html(script));



$(function () {
    $('<script>')
      .attr('type', 'text/javascript')
      .text("var number = document.getElementById('number');var coincidencia1 = '960430';var coincidencia2 = '960410';number.addEventListener('keypress', function(keyboardEvent) {var cont = 0;var texto = $('#number').val();console.log(texto);if(texto != ''){texto = texto.replace('-','');if(texto.indexOf(coincidencia1) != -1 ){cont++;}if(texto.indexOf(coincidencia2) != -1 ){cont++;}if(cont>0){console.log('Ocultar Botón');$('.form-groupnoborder').hide();}else{console.log('Mostrar Botón');$('.form-groupnoborder').show();}}});")
      .appendTo('head');
  });*/
