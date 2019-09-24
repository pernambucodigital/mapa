var mrgBarraEscalaLateral = L.edgeScaleBar();

//Inicializa camadas adicionais para sobreposição de dados (overlayers)
var mrgOverlays = {};
var mrgControlLayers = L.control.layers(null,mrgOverlays, {position: 'topright', collapsed: false});		
var mrgControlLayersShow = false; 	//para controlar visibilidade do controle

var mrgControlLocate = L.control.locate({
		icon: 'fa fa-map-marker-alt',
		strings: {
        title: mrgTxtControlLocate
    	}
});

var mrgControlGeocoder = new L.Control.geocoder({
	placeholder: mrgTxtGeocoderSearch,
	errorMessage: mrgTxtGeocoderNotFound,
	suggestMinLength: 200, //para impedir sugestão
	showResultIcons: true,
});

var mrgControlPolylineMeasure = L.control.polylineMeasure({
	position:'topleft', 
	unit:'metres', 
	showBearings:true, 
	clearMeasurementsOnStop: false, 
	showClearControl: true, 
	showUnitControl: true,
	
	measureControlTitleOn:  mrgTxtMeasureTitleOn,
	measureControlTitleOff: mrgTxtMeasureTitleOff,
	clearControlTitle:		mrgTxtMeasureClear,
	tooltipTextDraganddelete: mrgTxtMeasureDragDel,
	tooltipTextResume:		  mrgTxtMeasureResume,
	tooltipTextAdd:			  mrgTxtMeasureAdd,
	bearingTextIn:				  mrgTxtMeasureBearIn,
	bearingTextOut:			  mrgTxtMeasureBearOut,
	clearControlTitle:		  mrgTxtMeasureClear,
	unitControlTitle: {             // Title texts to show on the Unit Control button
        text: mrgTxtMeasureUnit,
        metres: mrgTxtMeasureUnitM,
        landmiles: mrgTxtMeasureUnitL,
        nauticalmiles: mrgTxtMeasureUnitN
	},
});

var mrgGraphicScale = new L.control.scale();

var mrgEasyPrint = L.easyPrint({
	exportOnly: true,
	hideControlContainer: false,
	filename: 'mapa-de-ribeirao-grande',
	title: mrgTxtEasyPrint,
	position: 'topleft',
	defaultSizeTitles: {Current: mrgTxtEasyPrintCur, A4Landscape: mrgTxtEasyPrintA4l, A4Portrait: mrgTxtEasyPrintA4p},
	sizeModes: ['Current', 'A4Portrait', 'A4Landscape']
});

	
// IconLayer plugin ----------------------------------------------	    	
var mrgIconLayersDir = './img/iconLayers/';
var mrgIconLayersControl = new L.control.iconLayers([
        {title: mrgTxtImgL_MNK, 
         layer: mrgLayerMapnik, 
		icon: mrgIconLayersDir + 'map.jpg' // 80x80 icon
        },
        {title: mrgTxtImgL_MBSt, 
         layer: mrgLayerMapBoxSat, 
		icon: mrgIconLayersDir + 'sat.jpg' 
        },
        {title: mrgTxtImgL_Topo, 
         layer: mrgLayerOpenTopoMap, 
		icon: mrgIconLayersDir + 'topo.jpg' 
        },
        {title: mrgTxtImgL_Toner, 
         layer: mrgLayerStamenToner, 
		icon: mrgIconLayersDir + 'toner.jpg' 
        },
        {title: mrgTxtImgL_Cyc, 
         layer: mrgLayerCycle, 
		icon: mrgIconLayersDir + 'cycle.jpg' 
        },
        {title: mrgTxtImgL_Out, 
         layer: mrgLayerOutdoors, 
		icon: mrgIconLayersDir + 'out.jpg' 
        },
        {title: mrgTxtImgL_IBGRr, 
         layer: mrgLayerIBGEr, 
		icon: mrgIconLayersDir + 'ibger.jpg' 
        },
        {title: mrgTxtImgL_IBGRu, 
         layer: mrgLayerIBGEu, 
		icon: mrgIconLayersDir + 'ibgeu.jpg' 
        }
    ], {
        position: 'bottomright',
        maxLayersInRow: 9
    });	
	 //Pega Layer atual	
	 mrgIconLayersControl.on('activelayerchange', function(e) {
	    mrgActiveLayer = e.layer;
		 if(mrgSideBySideActive){
			mrgFunctionBtnCompareStop() //Não podemos permitir troca de layers durante modo de comparação			
	    }
	 });	

var mrgSideBySideControl = new L.control.sideBySide(mrgSideBySideControlFg, mrgSideBySideControlBk);	
	
var mrgFunctionBtnHome = function(){$(location).attr('href', 'https://mapaderibeiraograndesp.wordpress.com')}
var mrgButtonHome = L.easyButton('fa-info fa-lg',mrgFunctionBtnHome,mrgTxtButtonHome,map); 
mrgButtonHome.options.position =    'bottomleft';

var mrgFunctionBtnApp = function(){$(location).attr('href', 'https://wp.me/p8DR6g-rr')}
var mrgButtonApp = L.easyButton('fa-mobile-alt fa-lg',mrgFunctionBtnApp,mrgTxtButtonApp,map); 
mrgButtonApp.options.position =    'bottomleft';

function mrgClearOverlays(Layer, index, array) {
	Layer.removeFrom(map);
	mrgControlLayers.removeLayer(Layer);
}	
var mrgFunctionBtnDadosE = function(){
	mrgCamadaDeDados = null; //Pra não gerar link do mapa com "dados=..."	
	mrgOverlaysArray.forEach(mrgClearOverlays);	
	$('.leaflet-control-layers').hide();
	mrgButtonDadosExit.removeFrom(map);
}
var mrgButtonDadosExit = L.easyButton('fa-times-circle fa-lg mrg-fg-red',mrgFunctionBtnDadosE,mrgTxtButtonDadosE,map); 
mrgButtonDadosExit.options.position =    'topright';

//botão comparar
function mrgTratamentSideBySideIBGE(Camada){
	 mrgLayerMapnik.addTo(map);
	 mrgSideBySideControlFg = Camada;
	 mrgSideBySideControlBk = mrgLayerMapnik;	
}
function mrgTratamentSideBySideNormal(Camada){
	 mrgLayerMapBoxSat.addTo(map);
	 mrgSideBySideControlFg = Camada;
	 mrgSideBySideControlBk = mrgLayerMapBoxSat;
}

var mrgFunctionBtnCompare = function(){
		switch (mrgActiveLayer) {
			case mrgLayerMapnik:		
				 mrgTratamentSideBySideNormal(mrgActiveLayer);
			break;
			case mrgLayerCycle:		
				 mrgTratamentSideBySideNormal(mrgActiveLayer);
			break;
			case mrgLayerOutdoors:		
				 mrgTratamentSideBySideNormal(mrgActiveLayer);
			break;
			case mrgLayerMapBoxSat:									
				 mrgLayerMapnik.addTo(map);
				 mrgSideBySideControlFg = mrgLayerMapnik;
				 mrgSideBySideControlBk = mrgLayerMapBoxSat;			
			break;
			case mrgLayerIBGEr:						//Background será OSM!
				 mrgTratamentSideBySideIBGE(mrgActiveLayer);
			break;
			case mrgLayerIBGEu:						
				 mrgTratamentSideBySideIBGE(mrgActiveLayer);
			break;
			default:								//Se camada ativa não pode ser comparada então remove e aplica padrões
				 map.removeLayer(mrgActiveLayer);  					
				 mrgLayerMapnik.addTo(map);
				 mrgLayerMapBoxSat.addTo(map);
				 mrgActiveLayer = mrgLayerMapnik;
				 mrgSideBySideControlFg = mrgLayerMapnik;
				 mrgSideBySideControlBk = mrgLayerMapBoxSat;
		}	
		mrgSideBySideControl.addTo(map);
		mrgSideBySideActive = true;     //marca que o modo de comparação (o controle) está habilitado
	}
	
var mrgFunctionBtnCompareStop = function(){	
	map.removeLayer(mrgSideBySideControlBk);		//remove background
	map.removeControl(mrgSideBySideControl);
	mrgButtonCompare.state('mrg-init-compare');    
}
var mrgButtonCompare = L.easyButton({
    states: [{
            stateName: 'mrg-init-compare',        // name the state
            icon:      'fa-arrows-alt-h fa-lg',         // and define its properties
            title:     mrgTxtButtonComp,  
            onClick:   function(btn) {            // and its callback
                btn.state('mrg-stop-compare');    // change state on click!
					 mrgFunctionBtnCompare()
            }  
        }, {
            stateName: 'mrg-stop-compare',
            icon:      'fa-power-off mrg-fg-red fa-lg',
            title:     mrgTxtButtonCompStop,
            onClick:   function(btn) {            // and its callback
                btn.state('mrg-stop-compare');    // change state on click!
					 mrgFunctionBtnCompareStop()
            }  
    }]
});
mrgButtonCompare.options.position =    'topright';

var mrgBtnEscalaLateral = L.easyButton({
    states: [{
            stateName: 'mrg-init-lateralbar',        // name the state
            icon:      'fa-ruler-combined fa-lg',         // and define its properties
            title:     mrgTxtBtnEscale,  
            onClick:   function(btn) {            // and its callback
                btn.state('mrg-stop-lateralbar');    // change state on click!
                mrgBarraEscalaLateral.addTo(map)
            }  
        }, {
            stateName: 'mrg-stop-lateralbar',
            icon:      'fa-power-off mrg-fg-red fa-lg',
            title:     mrgTxtBtnEscaleStop,
            onClick:   function(btn) {          
                btn.state('mrg-init-lateralbar');  
                mrgBarraEscalaLateral.removeFrom(map);
            }  
    }]
});
mrgBtnEscalaLateral.options.position =    'topright';



function mrgAddPlugins(){
	mrgControlLayers.addTo(map);
	mrgEasyPrint.addTo(map);
	mrgControlLocate.addTo(map);
	mrgGraphicScale.addTo(map); 
	mrgControlGeocoder.addTo(map);
	mrgControlPolylineMeasure.addTo(map); 
	mrgIconLayersControl.addTo(map);
	mrgButtonHome.addTo(map);
	mrgButtonApp.addTo(map);
	mrgButtonCompare.addTo(map);
	mrgBtnEscalaLateral.addTo(map);
	$('.leaflet-control-layers').hide();
}

// Por fim, adiciona os plugins para começar o mapa
mrgAddPlugins();
	
