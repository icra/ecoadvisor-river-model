/*
  Implementació equacions per un tram de riu: veure "equacions-riu.pdf"

  Classe Tram
    - constructor (inputs)
    - resultats (outputs)
    - Mf (degradació d'un component al llarg del tram)
*/

class Tram {
  constructor(wb,wt,Db,S,n,Li,Di,Ti){
    //inputs i default values
    this.wb = isNaN(wb) ? 3      : wb; //amplada a llera mitjana (m)
    this.wt = isNaN(wt) ? 6      : wt; //amplada a bankful mitjana (m)
    this.Db = isNaN(Db) ? 2      : Db; //distància entre llera i bankfull mitjana (m)
    this.S  = isNaN(S ) ? 0.005  : S ; //pendent de la llera: obtingut amb resolució mínima de 30m de pixel, i estimant la pendent per un tram d'1 km
    this.n  = isNaN(n ) ? 0.0358 : n ; //coeficient de manning (n) s'obté de regressió entre Qi i HRi també es pot usar el mètode de Verzano et al per determinar n, o usar el valor 0.0358, que és la mitjana europea.
    this.Li = isNaN(Li) ? 1000   : Li; //longitud tram (m)
    //per calcular massa final: Di i Ti
    this.Di = isNaN(Di) ? 1.2    : Di; //fondària concreta (m)
    this.Ti = isNaN(Ti) ? 12     : Ti; //ºC | temperatura
  }

  /*càlculs equacions pdf*/
    //calcula angle "alfa" entre la llera i el màxim del canal (bankfull) (radiants)
    get angle(){
      let sin = (this.wt-this.wb)/(2*this.Db);
      if(sin > 1 || sin < -1){
        console.warn(`arcsin(x) is defined x=[-1,+1], but got 'x=${sin.toFixed(4)}' instead`);
      }
      return Math.asin(sin);
    }

    //calcula fondària màxima (m)
    get Dt(){return this.Db*Math.cos(this.angle);}

    //en funció de la fondària (Di), tenim wi, Ai, wpi, HRi i Qi
    get wi() {return this.wb + 2*this.Di*Math.tan(this.angle);}       //m  | amplada de la llera inundada
    get Ai() {return this.Di*(this.wb+this.Di*Math.tan(this.angle));} //m2 | area transversal inundada
    get wpi(){return this.wb + 2*this.Di/Math.cos(this.angle);}       //m  | perímetre humit inundat
    get HRi(){return this.Ai/this.wpi;}                               //m  | radi hidràulic

    //Amb n determinat podem estimar wi, Ai, wpi, HRi i Qi en funció de Di.
    get Qi()    {return (1/this.n)*Math.pow(this.HRi,2/3)*Math.sqrt(this.S);} //m3/s | cabal
    get Qi_MLd(){return this.Qi*86.4;}                                        //ML/d | cabal convertit a ML/d
    get HRTi()  {return this.Li*this.Ai/this.Qi/60;}                          //min  | el temps mig de residència de l'aigua HRTi
    get Vi()    {return this.Li/this.HRTi;}                                   //m/min
    get Si()    {return this.Li*this.wpi;}                                    //m2   | la superfície inundada en el tram d'interès
    /*Per a fer un seguiment, s’hauria de mirar estat químic i ecològic al
      final del tram fluvial, així com al final de tram de barreja lateral, punt a
      partir del qual la química de l’aigua és resultat de la barreja de la
      química dels trams fluvials i EDAR influents. La longitud del tram de barreja
      lateral (Ll) es determina a partir de paràmetres hidràulics, amplada (wi),
      coeficient de dispersió lateral (ky) i velocitat mitjana (u). El coeficient de
      dispersió lateral es calcula a partir de la fondària (Di), la força de la
      gravetat (g), i la pendent de la llera fluvial (S):
    */
    get ky(){return 0.6*this.Di*Math.sqrt(9.81*this.S*this.Di)};      //coeficient de dispersió lateral (ky)
    get Ll(){return Math.pow(this.wi,2)*this.Qi/this.Ai/(2*this.ky);} //longitud del tram de barreja lateral (Ll)
  /*_*/

  /*empaqueta els resultats*/
  get resultats(){ //->Object
    return {
      Qi     :{value:this.Qi,      unit:"m3/s",  descr:"Cabal en m3/s"},
      Qi_MLd :{value:this.Qi_MLd,  unit:"ML/d",  descr:"Cabal en ML/d"},
      angle  :{value:this.angle,   unit:"rad",   descr:"Angle &alpha; entre la llera i el màxim del canal (bankful)"},
      Dt     :{value:this.Dt,      unit:"m",     descr:"Fondària màxima"},
      wi     :{value:this.wi,      unit:"m",     descr:"Amplada de la llera inundada"},
      Ai     :{value:this.Ai,      unit:"m2",    descr:"Àrea transversal inundada"},
      wpi    :{value:this.wpi,     unit:"m",     descr:"Perímetre humit inundat"},
      HRi    :{value:this.HRi,     unit:"m",     descr:"Radi hidràulic"},
      HRTi   :{value:this.HRTi,    unit:"min",   descr:"Temps mig de residència de l'aigua"},
      Vi     :{value:this.Vi,      unit:"m/min", descr:"Velocitat mitjana"},
      Si     :{value:this.Si,      unit:"m2",    descr:"Superfície inundada"},
      //ky   :{value:this.ky,      unit:"?",     descr:"Coeficient de dispersió lateral"},
      //Ll   :{value:this.Ll,      unit:"m",     descr:"Longitud del tram de barreja lateral"},
    };
  };

  //Mf: massa o càrrega al final del tram degut a la degradació per un sol component 'Mi'
  calcula_Mf(Mi, R_20){ //->Object
    //Mi  : massa a l'inici del tram fluvial: suma dels diferents trams que alimenten el tram (kg)
    //R_20: velocitat de reacció a 20ºC (g/m2·min)
    let Mf = Mi - R_20*this.HRTi*this.Si*Math.pow(1.0241,this.Ti-20);

    if(Mi==0) Mf=0;
    if(Mf <0) Mf=0;

    return {
      value: Mf,
      unit:"kg",
      descr:"massa al final del tram fluvial",
    };
  };

  //càlcul invers de "calcula_Mf"
  //R_20: velocitat de reacció a 20ºC (g/m2·min)
  calcula_R_20(Mi,Mf){ //->Object
    //Mi: massa a l'inici del tram fluvial: suma dels diferents trams que alimenten el tram (kg)
    //Mf: massa al final  del tram fluvial
    if(Mi==0) Mf=0;
    if(Mf <0) Mf=0;

    let R_20 = (Mi - Mf)/(this.HRTi*this.Si*Math.pow(1.0241,this.Ti-20));

    return {
      value: R_20,
      unit:"g/m2·min",
      descr:"velocitat de reacció a 20ºC",
    };
  };

  //calcula fondària concreta ("Di") necessària per un cabal "x" ML/d
  //l'eqüació s'hi arriba desfent l'equació de Qi
  //  Qi = (1/n)*pow(HRi,2/3)*sqrt(S)
  calcula_Di_a_partir_de_Qi(Qi_MLd){
    let angle = this.angle;
    let wb    = this.wb;
    let wt    = this.wt;

    let Qi    = Qi_MLd/86.4; //converteix a m3/s
    let HRi   = Math.pow(Qi*this.n/Math.sqrt(this.S), 3/2); //m  | radi hidràulic

    //per trobar Di:
    //resol eq de 2n grau: ax^2+bx+c=0
    let a = Math.tan(angle);
    let b = wb - 2*HRi/Math.cos(angle);
    let c = -HRi*wb;
    // x = (-b (+-) sqrt(b*b - 4ac)) / 2a
    let Di_1 = (-b + Math.sqrt(b*b - 4*a*c))/(2*a);
    let Di_2 = (-b - Math.sqrt(b*b - 4*a*c))/(2*a);

    //console.log(`resultats: ${Di_1}, ${Di_2}`);
    //retorna només el resultat positiu
    return Math.max(Di_1, Di_2);
  };

  static get info(){ //->Object
    return {
      wb:{unit:"m",  descr:"Amplada a llera mitjana"},
      wt:{unit:"m",  descr:"Amplada a bankful mitjana"},
      Db:{unit:"m",  descr:"Distància entre llera i bankfull mitjana"},
      S: {unit:"ø",  descr:"Pendent de la llera: obtingut amb resolució mínima de 30m de pixel, i estimant la pendent per un tram d'1 km"},
      n: {unit:"?",  descr:"Coeficient de manning (n) s'obté de regressió entre Qi i HRi també es pot usar el mètode de Verzano et al per determinar n, o usar el valor 0.0358, que és la mitjana europea."},
      Li:{unit:"m",  descr:"Longitud tram"},
      Di:{unit:"m",  descr:"Fondària concreta"},
      Ti:{unit:"ºC", descr:"Temperatura"},
    }
  };
}

//export class
try{module.exports=Tram;}catch(e){}
