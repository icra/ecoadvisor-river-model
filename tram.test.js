//import Tram class
Tram = require("./tram.js"); //class

//test static method
console.log(Tram.info);

//test valors Vicenç Acuña (vacuna@icra.cat)
//syntax-----------(wb, wt, Db, S,     n,      Li,   Di)
let tram = new Tram(3,  6,  2,  0.005, 0.0358, 1000, 1.2);
console.log(tram);
console.log(tram.resultats);

//test calcular fondaria
console.log(tram.calcula_Di_a_partir_de_Qi(1000));
