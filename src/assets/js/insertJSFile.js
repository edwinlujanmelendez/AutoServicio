//var iFrameHead = $('visaNetJS').contents().context.head;
/*function insertJSFile(){
    var iFrameHead = $('visaNetJS').prevObject[0].body;
    var myscript = document.createElement('script');
    myscript.type = 'text/javascript';
    myscript.src = 'http://localhost:4200/assets/js/ReadCardNiubiz.js';
    iFrameHead.appendChild(myscript);

    var script = "var number = document.getElementById('number');var coincidencia1 = '960430';var coincidencia2 = '960410';number.addEventListener('keypress', function(keyboardEvent) {var cont = 0;var texto = $('#number').val();console.log(texto);if(texto != ''){texto = texto.replace('-','');if(texto.indexOf(coincidencia1) != -1 ){cont++;}if(texto.indexOf(coincidencia2) != -1 ){cont++;}if(cont>0){console.log('Ocultar Botón');$('.form-groupnoborder').hide();}else{console.log('Mostrar Botón');$('.form-groupnoborder').show();}}});";
    $('visaNetJS').prevObject[0].body.append($('<script>').html(script));
}*/