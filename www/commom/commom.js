var textoPlaca = document.getElementById("textoPlaca");
const frases = ["OLA2025", "VAMOS?", "PINCAR'S", "BRASIL"];
let intervalId;
let animating = false;


function startTypingAnimation() {
  let fraseIndex = 0;
  let charIndex = 0;
  animating = true;

  function typeAndDelete() {
    if (!animating) return;

    const currentFrase = frases[fraseIndex];

    if (charIndex <= currentFrase.length) {
      // Digitar texto
      textoPlaca.textContent = currentFrase.substring(0, charIndex++);
      intervalId = setTimeout(typeAndDelete, 200); // Tempo entre cada caractere ao digitar
    } else if (charIndex === currentFrase.length + 1) {
      // Pausa de 3 segundos após digitar a frase completa
      charIndex++;
      intervalId = setTimeout(typeAndDelete, 3000); // Pausa após digitar completamente
    } else if (charIndex <= currentFrase.length * 2 + 1) {
      // Apagar texto
      textoPlaca.textContent = currentFrase.substring(0, currentFrase.length * 2 + 1 - charIndex++);
      intervalId = setTimeout(typeAndDelete, 80); // Tempo entre cada caractere ao apagar
    } else {
      // Ir para a próxima frase após apagar
      charIndex = 0;
      fraseIndex = (fraseIndex + 1) % frases.length;
      intervalId = setTimeout(typeAndDelete, 1000); // Pausa antes de começar a digitar a próxima palavra
    }
  }

  typeAndDelete();
}


function stopAnimationPlaca() {
  animating = false;
  clearTimeout(intervalId);
}








let isFrontCamera = true; // Define a câmera inicial como frontal
let currentStream = null; // Armazena a stream atual da câmera

function ativarCameraOCR() {

    $(".modal-camera").fadeIn(100);
    $(".modal-camera .confirmacao").css("bottom","0");

    iniciarCamera(); // Inicia a câmera com a configuração atual
}

function iniciarCamera() {
    const areaCamera = document.getElementById("areaCamera");

    // Adiciona o elemento de vídeo para exibir o feed da câmera
    const video = document.createElement("video");
    video.setAttribute("autoplay", "true");
    video.style.width = "100%";
    video.style.height = "100%";
    areaCamera.innerHTML = ""; // Limpa qualquer conteúdo anterior
    areaCamera.appendChild(video);

    
    

    // Para a stream atual, se existir
    if (currentStream) {
        currentStream.getTracks().forEach((track) => track.stop());
    }

    // Configurações de vídeo com base na câmera selecionada
    const constraints = {
        video: {
            facingMode: isFrontCamera ? "user" : "environment", // Alterna entre frontal e traseira
        },
    };

    // Acessa a câmera do dispositivo
    navigator.mediaDevices
        .getUserMedia(constraints)
        .then((stream) => {
            currentStream = stream; // Salva a nova stream
            video.srcObject = stream;

            // Inicia o reconhecimento da placa
            processarPlaca(video);
        })
        .catch((error) => {
            console.error("Erro ao acessar a câmera:", error);
            alert("Não foi possível acessar a câmera. Verifique as permissões do dispositivo e se o dispositivo suporta múltiplas câmeras.");
        });
}

function trocarCamera() {
    // Alterna entre câmera frontal e traseira
    isFrontCamera = !isFrontCamera;

    // Reinicia a câmera com a nova configuração
    iniciarCamera();
}

function processarPlaca(video) {
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");

    // Define a função de captura de frames a cada 2 segundos
    var intervalo = setInterval(() => {
        // Configura o canvas com o tamanho do vídeo
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;

        // Desenha o frame atual do vídeo no canvas
        context.drawImage(video, 0, 0, canvas.width, canvas.height);

        // Converte o frame capturado em uma imagem base64
        const imageData = canvas.toDataURL("image/png");

        // Processa a imagem usando Tesseract.js
        Tesseract.recognize(imageData, "eng", {
            logger: (info) => console.log(info), // Log do progresso
        })
            .then(({ data: { text } }) => {
                const placa = text.replace(/\s/g, "").toUpperCase();

                const regex = /^[A-Z]{2,3}[0-9][A-Z0-9][A-Z0-9][0-9]{1,2}$/;

                if (regex.test(input)) {
                  // Exibe a placa detectada (ou realiza outras ações)
                  jQuery("#filtroTabela").val(placa); // Exibe no elemento com ID "feedback"
                  clearInterval(intervalo); // Para o intervalo de captura
                }

            })
            .catch((error) => {
                console.error("Erro no OCR:", error);
            });
    }, 5000); // Intervalo de captura (2 segundos)
}



function desligarCamera() {
  const areaCamera = document.getElementById("areaCamera");

  // Para a stream atual, se existir
  if (currentStream) {
      currentStream.getTracks().forEach((track) => track.stop());
      currentStream = null; // Remove a referência à stream
  }

  // Limpa o conteúdo da área de câmera
  areaCamera.innerHTML = "";

  console.log("Câmera desligada e recursos liberados.");

  $(".modal-camera .confirmacao").css("bottom","-300%");
                $(".modal-camera").fadeOut(500);


}




// Função para filtrar as categorias
function filtrarCategorias() {

   // Pegando os valores de categoria1 e categoria2 da localStorage
let categoria1 = localStorage.getItem('categoria1'); // Supondo que os valores estão salvos como string na localStorage
let categoria2 = localStorage.getItem('categoria2');


    let isChecked = document.getElementById('toggleSwitch').checked;

    // Seleciona todas as divs .caixa-destaque-servicos
    let divs = document.querySelectorAll('.caixa-destaque-servicos');

    // Se o switch estiver ativado
    if (isChecked) {
        divs.forEach(function(div) {
            let categoria = div.getAttribute('data-categoria');

            // Verifica se a categoria da div é igual a categoria1 ou categoria2
            if (categoria === categoria1 || categoria === categoria2) {
                div.style.display = 'block'; // Exibe a div
            } else {
                div.style.display = 'none'; // Oculta a div
            }
        });
    } else {
        // Se o switch estiver desativado, todas as divs ficam visíveis
        divs.forEach(function(div) {
            div.style.display = 'block'; // Exibe todas as divs
        });
    }
}

// Adiciona o evento ao switch para detectar quando ele for ativado/desativado
//document.getElementById('toggleSwitch').addEventListener('change', filtrarCategorias);







// GERENCIANET TOKEN
           $gn.ready(function(checkout) {
 
              var callback = function(error, response) {
                if(error) {
                  // Trata o erro ocorrido
                  console.error(error);
                } else {
                  // Trata a resposta
                  console.log(response);
                }
              }; 

           });


            // COMO FAZER A CHAMADA NO FORMULÁRIO onSubmit="return ajaxSubmit(this);"
            var ajaxSubmit = function(form) {
                // fetch where we want to submit the form to
                var url = $(form).attr('action');
                var flag = 9;

                var data = $(form).serializeArray();

                // setup the ajax request
                $.ajax({
                    url: url,
                    data: data,
                    dataType: 'json',
                    type:'POST'
                });

                swal("Obrigado!", 'Sua mensagem foi enviada com sucesso', "success");

                return false;
            }


            

          // SE O USUÁRIO FIZER UM GESTURE PARA A PARTE INFERIOR DA PÁGINA
          // VAMOS FECHAR A LAYER DO CARRO, CASO ELA ESTEJA ABERTA

          $("#swipeAviso").swipe({
            swipe:function(event, direction, distance, duration, fingerCount) {

              if(direction=="down"){

                $(".modal-avisos .aviso").css("bottom","-300%");
                $(".modal-avisos").fadeOut(500);

              }

            }
          });
          
          $("#swipemeConfirmacao").swipe({
            swipe:function(event, direction, distance, duration, fingerCount) {

              if(direction=="down"){

                $(".modal-confirmacao .confirmacao").css("bottom","-300%");
                $(".modal-confirmacao").fadeOut(500);

              }

            }
          });

          $("#swipemeCamera").swipe({
            swipe:function(event, direction, distance, duration, fingerCount) {

              if(direction=="down"){

                $(".modal-camera .aviso").css("bottom","-300%");
                $(".modal-camera").fadeOut(500);
                desligarCamera();

              }

            }
          });



            /* FUNÇÃO GERAL PARA EXIBIR OS AVISOS DO PÁGINA */
            function aviso(titulo,mensagem){

              console.log("%c COMEÇANDO FUNÇÃO PARA EXIBIR AVISO","background:#ff0000;color:#fff;");
              $(".modal-avisos").fadeIn(100);

              $(".modal-avisos .aviso").css("bottom","0");


              // ALIMENTAR O HTML
              $(".modal-avisos .aviso h3").html(titulo);
              $(".modal-avisos .aviso p").html(mensagem+'<p style="padding-top:12px;padding-left:0px;"><button type="button" onclick="fecharAviso();" class="btn btn-primary">Ok</button></p>');
              
              //setTimeout("fecharAviso()",12000);


            }
            function fecharAviso(){
              
              $(".modal-avisos .aviso").css("bottom","-300%");
              $(".modal-avisos").fadeOut(500);

            }

            /* FUNÇÃO GERAL PARA EXIBIR CONFIRMAÇÕES DE AÇÕES */
            function confirmacao(titulo,mensagem,funcaoConfirmacao,textoConfirmacao){

              console.log("%c COMEÇANDO FUNÇÃO PARA EXIBIR AVISO","background:#ff0000;color:#fff;");
              $(".modal-confirmacao").fadeIn(100);

              $(".modal-confirmacao .confirmacao").css("bottom","0");

              // ALIMENTAR O HTML
              $(".confirmacao h3").html(titulo);
              $(".confirmacao p").html(mensagem);

              $(".confirmacao #acaoConfirmacao").attr("onclick",funcaoConfirmacao+"; fecharConfirmacao();");
              if(textoConfirmacao!=""){
                $(".confirmacao #acaoConfirmacao").html(textoConfirmacao);
              }
              

            }
            function fecharConfirmacao(){

                 $(".modal-confirmacao .confirmacao").css("bottom","-300%");
                 $(".modal-confirmacao").fadeOut(500);

            }







// FORMULARIO FLUTUANTE onclick="ativarFormularioFlutuante('','')"
function ativarFormularioFlutuante(campoParaPreenchimento,labelPreenchimento){

   $(".input-flutuante-acessibilidade").fadeIn(500);
   //$(".barra-navegacao").hide(0);

   $("#fieldInputFlutuante").val($(campoParaPreenchimento).val());

   localStorage.setItem("campoParaPreenchimento",campoParaPreenchimento);

   $("#fieldInputFlutuante").focus();
   $('.input-flutuante-acessibilidade label').html(labelPreenchimento);

}

function validarFormularioFlutuante(event){

    event.preventDefault();

    var fieldInputFlutuante = $("#fieldInputFlutuante").val();
    
    $(".input-flutuante-acessibilidade").fadeOut(500);
    //$(".barra-navegacao").show(0);

    $(localStorage.getItem("campoParaPreenchimento")).val(fieldInputFlutuante);

}

// GARANTIR O FECHAMENTO DO CAMPO QUANDO A TELA VOLTAR AO NORMAL

$(document).ready(function() {
  var _originalSize = $(window).width() + $(window).height()
  $(window).resize(function() {
    if ($(window).width() + $(window).height() == _originalSize) {
      console.log("keyboard active "+_originalSize);
      $(".input-flutuante-acessibilidade").fadeOut(500);
      //$(".barra-navegacao").show(0);
    }
  });
});

// ABRIR URL`s EXTERNAS`
function abrirUrl(url){

  cordova.InAppBrowser.open(url, '_blank', 'location=yes,hidden=no,hardwareback=no');

}




     // CODIGOS PARA UPLOAD DE ARQUIVOS LOCAIS
     function uploadLocal(){

         console.log("ENTRAMOS!");
         //var files = $(this)[0].files;
         
         /* Efetua o Upload */
         $('.fileForm').ajaxForm({
          dataType:  'json',
          success:   processJson 
        
         }).submit();

     }
     function processJson(dados) { 
            // 'data' is the json object returned from the server 
            console.log("%c RETORNO SOBRE O ENVIO DAS IMAGENS (UPLOAD):","background:#ff0000;color:#fff;");
            console.log(dados); 
            
            if(dados.erros===null){
            
                console.log("NENHUM ERRO!");

            }else{
              
              $(".retorno-upload").html('<div class="alert alert-danger">'+dados.erros+'</div>');              

            }

            $('.fileForm').resetForm();

        }
      // CODIGOS PARA UPLOAD DE ARQUIVOS LOCAIS



      // UPLOAD DE IMAGENS USANDO CAMERA ANDROID
      /* ######### FUNÇÕES USO DE CAMERA SELFIE #########  */
      var minhaImagem;
      var controleFotoEnviada = 1;
      var tipoArquivo = "nenhum";

      function initCameraSelfie(){ // CHAMAR ESSA FUNCAO PARA INICIALIZAR A CAMERA

               minhaImagem;
               controleFotoEnviada = 1;
               
               tipoArquivo = "camera";

               console.log("INICIANDO FUNÇÃO PARA INICIALIZAR A CAMERA SELFE");

              // SCRIPTS DA CAMERA                                 

                              controleFotoEnviada = 2;
                              console.log("CONTROLE FOTO ENVIADA ATUALIZADA");
                              
                              console.log("INICIALIZANDO A CAMERA");
                              $("#retornoMsgSelfie").html("inicializando a câmera para a selfie");
                              navigator.camera.getPicture(onSuccess2, onFail2, {
                                  quality: 50,
                                  destinationType: Camera.DestinationType.DATA_URL
                              });

                              function onSuccess2(imageData) {
                                  console.log("CAMERA INICIALIZADA COM SUCESSO");
                                  $("#retornoMsgSelfie").html("Imagem capturada com sucesso!");
                                  var image = document.getElementById('fotoDestinoSelfie');
                                  image.style.display = 'block';
                                  image.src = "data:image/jpeg;base64," + imageData;

                                  minhaImagem = imageData;

                                  //$(".perfil-banner .foto-perfil").css("background","url('data:image/jpeg;base64,"+imageData+"')");
                                  //$(".perfil-banner .foto-perfil").css("background-size","cover");
                                  //$(".perfil-banner .foto-perfil").css("background-position","center center");
                                  //localStorage.setItem("parametroFoto",1);

                                  $('.btn-action-foto').attr('onclick',"uploadMyImageSelfie()");

                              }

                              function onFail2(message) {
                                  console.log("CAMERA NÃO FUNCIONOU");
                                  $("#retornoMsgSelfie").html("Não possível obter a imagem da sua câmera, tente novamente. "+message);
                                  console.log('### MOTIVO FALHA DE ACESSO A CÂMERA: ' + message);
                              }                           

              document.addEventListener("deviceready", function () {  
              //alert("Phonegap");                                                                                        
              }, false); 

      }

      function uploadMyImageSelfie(){

                    console.log("INICIANDO FUNÇÃO PARA FAZER UPLOAD DA IMAGEM");
         
                                          if(controleFotoEnviada == 2){

                                                  $('.btn-action-foto').html("processando...");

                                                  var cadastroEmail = localStorage.getItem("idUsuario");
                                                  
                                                  $.ajax({
                                                    type: "POST",
                                                    url: app.urlApi+'upload-selfie-camera.php?idUsuario='+idUsuario,
                                                    data: { img_data:minhaImagem},
                                                    cache: false,
                                                    contentType: "application/x-www-form-urlencoded",
                                                    success: function (result) {
                                                      
                                                      $('#sendFileSelfie').html("ATUALIZAR IMAGEM");      
                                                      aviso("Foto de perfil atualizada com sucesso","Obrigado por manter o seu perfil atualizado!");
                                                      editarPerfil(); 

                                                      minhaImagem = "";
                                                      controleFotoEnviada = 1;
                                                      tipoArquivo = "nenhum";                                        

                                                    },
                                                    fail: function(result){
                                                      aviso("Oops! Algo deu errado, tente novamente",result);
                                                    }
                                                  });   

                                              }else{

                                                  aviso('Oops! Você não selecionou nenhuma imagem','Você não selecionou ou tirou nenhuma foto.');
                                                  $('.btn-action-foto').html("ATUALIZAR IMAGEM");

                                              }

}



function copiarCodigoPix(){

  // Cria um elemento textarea temporário
  var textArea = document.createElement("textarea");
            
  // Define o valor do textarea para o conteúdo do span
  textArea.value = document.querySelector('#codigoPix').value;
  
  // Adiciona o textarea ao DOM
  document.body.appendChild(textArea);
  
  // Seleciona o conteúdo do textarea
  textArea.select();
  
  // Copia o texto selecionado para a área de transferência
  document.execCommand('copy');
  
  // Remove o textarea do DOM
  document.body.removeChild(textArea);
  
  // (Opcional) Mostra uma mensagem para o usuário
  alert('Código copiado com sucesso!');

}



