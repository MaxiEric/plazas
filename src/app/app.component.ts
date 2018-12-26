import { Component, Input, Output } from '@angular/core';
import { GoogleMapsAPIWrapper } from '@agm/core';
import { PlazasService } from './plazas.service';

import { FiltroStandard, Plaza, Properties, Foto} from './plaza';
import * as $ from 'jquery';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  public gMaps: GoogleMapsAPIWrapper;

  title = 'plazas';
  zoom: number = 12;
  lat: number = -31.414321;
  lng: number = -64.183307;

  auxData: any;

  //consultas plazas
  plazasData: any;
  geoJsonObject: any;
  pagePlazas: number = 1;
  @Input() geoJson: Object | string | null = null;

  //consultas plazas
  espaciosVData: any;
  pageEspacios: number =1;
  @Input() geoJsonEspaciosV: Object | string | null = null;


   @Output() valueChange = Object;

  //Varibles indicadoresCont
  plazasTipo : number = 0;
  totalPlazas: any;

  //variables de Filtrar
  barrios:any;
  barrioFilter : FiltroStandard[] = [];
  selectedBarrio : string[] = [];


  //variables al seleccionar una plaza
  selectedPlaza : Plaza | null = null;


  constructor(private _plazasService: PlazasService) { }

  ngOnInit() {

     this.getPlazas();
    //this.getEspacios();
    this.getStatistics();

    $(document).on('click', ".dropdownSelect dt a", function(e) {
      e.preventDefault();
      $(e.target).closest(".dropdownSelect").find("dd").slideToggle('fast');
      $(e.target).closest(".dropdownSelect").find("dd ul").slideToggle('fast');
      $('.dropdownSelect').each(function(){
        if($(this).html() != $(e.target).closest(".dropdownSelect").html()){
          $(this).addClass('collapsiblockCollapsed');
          $(this).find("dd").hide();
          $(this).find("dd ul").hide();
        }
       });
       $(e.target).closest(".dropdownSelect").find(".arrow").toggleClass("up down");
    });

    $(document).on('click', ".dropdownSelect dd ul li a", function(e) {
      e.preventDefault();
      $(e.target).closest(".dropdownSelect").find("dd").hide();
      $(e.target).closest(".dropdownSelect").find("dd ul").hide();
    });

    function getSelectedValue(id) {
      return $("#" + id).find("dt a span.value").html();
    }

    $(document).bind('click', function(e) {
      var $clicked = $(e.target);
      if (!$clicked.parents().hasClass("dropdownSelect")){
        $(e.target).closest(".dropdownSelect").find("dd").hide();
        $(e.target).closest(".dropdownSelect").find("dd ul").hide();
      }
    });

    $(document).on('click', '.mutliSelect input[type="checkbox"]', function(e) {
      var $container = $(e.target).closest(".dropdownSelect");
      var inputName = $(e.target).attr("name");
    });

    $(document).on('click', '#referenciasLink', function(e) {
      var $container = $(e.target);
      $("#referencias").slideToggle();
      $container.find(".arrow").toggleClass("up down")
    });
  }

  getPlazas(){
    console.log("getPlazas")
    this._plazasService.getPlazas(this.pagePlazas).subscribe(
        data => {this.plazasData = data;},
        err => console.error(err),
        () => {
          console.log("this.geoJson", this.geoJson)
          this.plazasTipo = this.plazasData.results.features[0].properties.tipo_id;
          //this.geoJson = this.plazasData.results;

          /* ESTO ES para que recorra toda la api para traer completo; lo limite arriba para traer pocos*/
          if(this.pagePlazas == 1){
            this.geoJsonObject = this.plazasData.results;
            console.log("this.geoJsonObject",this.geoJsonObject)
          }
          else{
            this.plazasData.results.features.forEach(e => {
              this.geoJsonObject.features.push(e);
            });
            console.log("entro al else",this.geoJsonObject)
          }
          if(this.plazasData.next!=null){
            this.pagePlazas+=1;
            console.log("está por dar otra vuelta!", this.pagePlazas)
            this.getPlazas();
          }else{
            this.geoJson = this.geoJsonObject;
            console.log("termino")
          }


        }
      );
  }

  getEspacios(){
    console.log("getEspacios")
    this._plazasService.getEspaciosVerdes(this.pageEspacios).subscribe(
        data => {this.espaciosVData = data;},
        err => console.error(err),
        () => {
          console.log("geoJsonEspaciosV",this.espaciosVData)
          this.geoJsonEspaciosV = this.espaciosVData.results;
          // this.valueChange
          }
      );
  }


  getStatistics(){
    this._plazasService.getTotalPlazas().subscribe(
      data => { this.auxData = data},
      err => console.error(err),
      () => {
        this.totalPlazas = this.auxData.count;
        console.log("this.totalPlazas",this.totalPlazas);
        this.getBarrios();
      }
    );
  }

  clicked(clickEvent) {
   this.selectedPlaza = null;
    console.log("clickEvent",clickEvent);
    // barrio: string;
    //
    // foto: Foto;
    console.log("feature",clickEvent.feature);
    console.log("id", "clickEvent.feature[0]")
    console.log("nombre",clickEvent.feature.l.nombre);
    console.log("properties.tipo",clickEvent.feature.l.tipo);
    console.log("properties.fecha_inicio",clickEvent.feature.l.fecha_inicio);
    console.log("properties.fecha_finalizacion_estimada",clickEvent.feature.l.fecha_finalizacion_estimada);
    let auxUrloriginal = 'https://gobiernoabierto.cordoba.gob.ar'+clickEvent.feature.l.trazados[0].adjuntos[0].foto.original;
    let auxUrlThumbnail = 'https://gobiernoabierto.cordoba.gob.ar'+clickEvent.feature.l.trazados[0].adjuntos[0].foto.thumbnail_500;


    let auxFoto = new Foto(auxUrloriginal,auxUrlThumbnail);
    console.log(auxFoto);

    let auxProperties = new Properties(clickEvent.feature.l.barrios[0].nombre,
                    clickEvent.feature.l.fecha_inicio,
                    clickEvent.feature.l.fecha_finalizacion_estimada,
                    auxFoto,
                    clickEvent.feature.l.tipo);
    let auxPlaza = new Plaza('id','nombre de la plaza',auxProperties);
    this.selectedPlaza = auxPlaza;
    console.log("datos ordenados auxPlazas", this.selectedPlaza);

    console.log("properties", this.selectedPlaza.properties);
    // auxProperties
    //
    // this.selectedPlaza("idd",
    //                   clickEvent.feature.l.nombre,
    //                 )
    // this.selectedPlaza.id = "clickEvent.feature[0]";
    // this.selectedPlaza.nombre = clickEvent.feature.l.nombre;
    // console.log("this.selectedPlaza.properties",this.selectedPlaza.properties)
    // this.selectedPlaza.properties.fecha_inicio = clickEvent.feature.l.fecha_inicio;
    // this.selectedPlaza.properties.fecha_finalizacion_estimada = clickEvent.feature.l.fecha_finalizacion_estimada;
    // this.selectedPlaza.properties.tipo = clickEvent.feature.l.tipo;
    // console.log("this.selectedPlazathis.selectedPlaza", this.selectedPlaza);

    // this.selectedPlaza.properties.foto.original = ;
    // this.selectedPlaza.properties.foto.thumbnail = ;

    //this.selectedTree = this.getTreeInfo(event);

    setTimeout(function(){
      $('html, body').animate({
         scrollTop: $(".treeFile").offset().top - 165
      }, 1000);
    }, 250);
  }

  styleFunc(feature) {
    return ({
      clickable: true,
      strokeColor: 'red',
      strokeOpacity: 1,
      //fillColor: 'green',
      //fillColor: 'green',//feature.getProperty('color'),
      strokeWeight: 3.5
    });
  }
  styleFuncEspacios(feature){
    return ({
      clickable: true,
      strokeColor: 'red',
      strokeOpacity: 1,
      strokeWeight: 3.5
    });
  }

  selectAllBarrios(){
    console.log("selectallBarioss", this.selectedBarrio.length)
    var checked = true;
    if(this.selectedBarrio.length == this.barrioFilter.length){
      checked = false;
    }
    this.selectedBarrio = [];

    this.barrioFilter.forEach(e => {
      e.checked = checked;
      if(checked){
        this.selectedBarrio.push(e.id.toString());
      }
    });
  }
  checkBarrio(value: string){
    if(this.selectedBarrio.some(x=>x==value.toString())){
      this.checkinModel(this.barrioFilter, value.toString(), false);
      this.selectedBarrio = this.selectedBarrio.filter(item => item !== value.toString());
    }else{
      this.selectedBarrio.push(value.toString());
      this.checkinModel(this.barrioFilter, value.toString(), true);
    }
  }

  getBarrios(){
    console.log("getbarrios")
    if (localStorage.barriosData == null || localStorage.barriosData == "null" || localStorage.barriosData == "undefined" ) {//|| localStorage.userDate != this.today ) {
        this._plazasService.getBarrios().subscribe(
          data => { this.barrios = data},
          err => console.error(err),
          () => {
            console.log("this.barrios", this.barrios)
            this.barrios.results.features.forEach(e => {
                var auxBarrio = new FiltroStandard(e.id, e.properties.nombre,(this.selectedBarrio.indexOf(e.properties.nombre)!=-1));
                this.barrioFilter.push(auxBarrio);
            });
            localStorage.barriosData = JSON.stringify(this.barrioFilter);
          }
        );
        //localStorage.userDate = this.today;
    } else {
      this.barrioFilter = JSON.parse(localStorage.barriosData);
      this.selectedBarrio.forEach(e =>{
        this.checkinModel(this.barrioFilter, e, true);
      });
      console.log("else this.barrioFilter", this.barrioFilter);
    }
  }

  checkinModel(array, value:string, checked:boolean){
    array.forEach(e => {
      if(e.id == value){
        e.checked = checked;
        return false;
      }
    });
  }
  selectedArrayFromTextNames(array, selectedArray){
    var selectedNames = [];
    array.forEach(e => {
      if(selectedArray.indexOf(e.name) != -1){
        selectedNames.push(e);
      }
    });
    console.log("selectedName",selectedNames)
    return selectedNames;
  }

  filterPlazas(){
    console.log("selectedBarrio",this.selectedBarrio);
    this.getPlazasWFilter(this.selectedBarrio);
  }

  getPlazasWFilter(bario_id){
    console.log("getPlazasWFilter");
    let auxFilterData;
    this._plazasService.getFilterArboles(bario_id).subscribe(
        data => { auxFilterData = data;},
        err => console.error(err),
        () => {
            console.log("this.espaciosVData.results", auxFilterData.results)
            this.totalPlazas = auxFilterData.count;
            this.plazasTipo = auxFilterData.results.features[0].properties.tipo_id;
            //this.geoJsonEspaciosV = auxFilterData.results;
            this.geoJson = auxFilterData.results;
          }
      );
  }

}
