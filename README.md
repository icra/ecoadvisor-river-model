# ecoadvisor-river-model

Modelització de trams de riu que es poden connectar.

Inputs:
|símbol|descripció|
|------|----------|
|wb | amplada a llera mitjana (m) |
|wt | amplada a bankful mitjana (m) |
|Db | distància entre llera i bankfull mitjana (m) |
|S  | pendent de la llera: obtingut amb resolució mínima de 30m de pixel, i estimant la pendent per un tram d'1 km |
|n  | coeficient de manning (n) s'obté de regressió entre Qi i HRi també es pot usar el mètode de Verzano et al per determinar n, o usar el valor 0.0358, que és la mitjana europea. |
|Li | longitud tram (m) |
|Di | fondària concreta (m) |
|Ti | ºC,temperatura |

//trams connectats upstream (pares). Definits per l'usuari.
this.pares=[];/*[<Tram>]*/

//State Variables(Q, VFA, FBSO, BPO, UPO, USO, iSS, FSA, OP, NOx, OHO) (inici del tram)
//convert flowrate to ML/d (converted from m3/s)
this.state_variables=new State_Variables(this.Qi*86.4,0,0,0,0,0,0,0,0,0,0);

//Planta que aboca al tram (per defecte no n'hi ha)
this.plant=null;//<Plant>
