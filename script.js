var script = document.createElement('script');
script.src = 'https://ajax.googleapis.com/ajax/libs/jquery/3.1.1/jquery.min.js';
document.getElementsByTagName('head')[0].appendChild(script);



var ids = [];

function extractIds() {
    $('font').each(function(i) {

        if ($(this).attr('color') == "#FF0033") {
            ids.push($(this).find("b").text().trim());

        }

    });
}

extractIds();




//segundo paso
var DataArray = [];

function extractData() {
    for (var i = 0; i < ids.length; i++) {
        $.ajax({	
            url: "http://www.soloduenos.com/Ficha.asp",
            data:{Tipo:2,Id:ids[i]},
            success: function(data) {
            	       console.log(this);

        var htmlsucces = $(data).find("*");
 		var lugar = "";
        var valor = "";
        var direccion = "";
        var arrendatario = "";
        var telefono = "";
        var momento = "";
        var comentario = "";
        var imagenes=0;
        var id="";
        if(htmlsucces.find(".imgmapa").length==1){
        	imagenes=1;
        }
                	console.log();

                var objeto = {};
                htmlsucces.each(function(o) {

                    //console.log($(this).attr("style"));
                    if ($(this).attr("style") == "float:right; width:165PX; font-family:Segoe, 'Segoe UI', 'DejaVu Sans', 'Trebuchet MS', Verdana, sans-serif; color:#000000; font-weight:bold; font-size:13px; margin-right:10px; line-height:2.2;") {
                        id = $(this).find("span").text();
                     }

                     if ($(this).attr("style") == "float:left; width:240PX; font-family:Segoe, 'Segoe UI', 'DejaVu Sans', 'Trebuchet MS', Verdana, sans-serif; font-size:13px; font-weight:bold; margin-top:5px; color:#AE000D") {
                        lugar = $(this).text();
                    }

                    if ($(this).attr("style") == "width:300PX; float:right; font-family:Segoe, 'Segoe UI', 'DejaVu Sans', 'Trebuchet MS', Verdana, sans-serif; font-size:13px; font-weight:bold; margin-top:5px; margin-right:10px") {
                        valor = $(this).text();
                    }

                    if ($(this).attr("style") == "float:left; font-family:Segoe, 'Segoe UI', 'DejaVu Sans', 'Trebuchet MS', Verdana, sans-serif; font-size:13px; font-weight:bold; line-height:2.2; overflow:hidden; height:inherit; width:500px") {
                        direccion = $(this).text();
                    }

                    if ($(this).attr("style") == "font-family:Segoe, 'Segoe UI', 'DejaVu Sans', 'Trebuchet MS', Verdana, sans-serif; font-weight:bold; font-size:13px; color:#AE000D; padding:5px; overflow:hidden") {
                        arrendatario = $(this).text();
                    }

                    if ($(this).attr("style") == "font-family:Segoe, 'Segoe UI', 'DejaVu Sans', 'Trebuchet MS', Verdana, sans-serif; font-weight:bold; font-size:12px; padding-left:5px; padding-right:5px; overflow:hidden; -webkit-text-fill-color: #000000; color:#000000") {
                        telefono = $(this).text();
                    }

                    if ($(this).attr("style") == "font-family:Segoe, 'Segoe UI', 'DejaVu Sans', 'Trebuchet MS', Verdana, sans-serif; font-weight:bold; font-size:12px; padding-left:5px; padding-right:5px; padding-bottom:5px; overflow:hidden; color:#000000") {
                        momento = $(this).text();
                    }
            

                    if ($(this).attr("width") == 620) {

                        var tablaInterna = $(this).find("table");


	                   


                        var objetoGeneralC = [];
                        tablaInterna.each(function(ti) {


                            if ($(this).attr("style") == "padding:5px") {
		                     	comentario = $(this).find("font").text().split("//");
		                     	comentario =comentario[0].trim()
 		                    }


                            if ($(this).attr("width") == "96%") {
                                var contadortr = 0;
                                var objetoCaracteristica = [];
                                var objetoCaracteristicaGeneral = [];
                                var tablaCaracteristicas = $(this).find("tr td");

                                tablaCaracteristicas.each(function(tc) {

                                    objetoCaracteristica.push($(this).text().trim())
                                    if (contadortr % 2) {
                                        objetoCaracteristicaGeneral.push(objetoCaracteristica);
                                        objetoCaracteristica = [];
                                    }

                                    contadortr++;

                                })

                                objetoGeneralC.push(objetoCaracteristicaGeneral)

                            }

                        })
                        objeto = {
                            lugar: lugar,
                            valor: valor,
                            direccion: direccion,
                            arrendatario: arrendatario,
                            telefono: telefono,
                            momento: momento,
                            comentario: comentario,
                            caracteristicas: objetoGeneralC,
                            imagenes:imagenes,
                            id:id
                        }

                     }



                })

                DataArray.push(objeto);

            },
            dataType: "html"
        })

    }
}

extractData();





function imageExists(image_url){
    var http = new XMLHttpRequest();
    http.open('HEAD', image_url, false);
    http.send();
    return http.status;

}


	var arrayVerificado=[];

function  verificarImagenes(){

	for (var v = 0; v < DataArray.length; v++) {

		var arrayImage=[];
				        console.log(DataArray[v]);
		var arrayTemporal=DataArray[v];
		if(arrayTemporal.imagenes==1){
			for (var o = 1; o < 5; o++) {
			              	var urlImagen="http://www.soloduenos.com/CargaImgNuevoSistema.asp?Id="+arrayTemporal.id+"&Campo=Foto"+o;
							var stado=imageExists(urlImagen)
								if(stado==200){
									arrayImage.push(urlImagen);
								}
			                }
        arrayTemporal.imagenes=arrayImage;
		}else{
			 arrayTemporal.imagenes=[];

		}

		 arrayVerificado.push(arrayTemporal);

	}
					//console.log(arrayVerificado);

}

verificarImagenes();


