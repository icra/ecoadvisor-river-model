# river-model (V. Acuña, vacuna@icra.cat. Implementat per L. Bosch, lbosch@icra.cat)

Model d'un sol tram de riu. Es pot fer servir per crear un nou model on es
puguin connectar entre sí per modelar un riu o una xarxa de rius.

Inputs:

|símbol|unitat|descripció|
|------|------|----------|
|wb    | m    |amplada a llera mitjana  |
|wt    | m    |amplada a bankful mitjana  |
|Db    | m    |distància entre llera i bankfull mitjana  |
|S     | m/m  |pendent de la llera: obtingut amb resolució mínima de 30m de pixel, i estimant la pendent per un tram d'1 km |
|n     | ø    |coeficient de manning (n) s'obté de regressió entre Qi i HRi també es pot usar el mètode de Verzano et al per determinar n, o usar el valor 0.0358, que és la mitjana europea. |
|Li    | m    |longitud tram (m) |
|Di    | m    |fondària concreta (m) |
|Ti    | ºC   |temperatura |

Outputs:

|símbol|unitat|descripció|
|------|------|----------|
|angle | rad  | Angle entre la llera i el màxim del canal (bankful)
|Dt    | m    | Fondària màxima
|wi    | m    | Amplada de la llera inundada
|Ai    | m2   | Àrea transversal inundada
|wpi   | m    | Perímetre humit inundat
|HRi   | m    | Radi hidràulic
|Qi    | m3/s | Cabal en m3/s
|Qi_MLd| ML/d | Cabal en ML/d
|HRTi  | min  | Temps mig de residència de l'aigua
|Vi    | m/min| Velocitat mitjana
|Si    | m2   | Superfície inundada

Les concentracions de contaminants del tram de riu formen part d'un altre
model. Un exemple que es pot fer servir és:
https://github.com/icra/uct-icra-model/blob/master/src/state-variables.js

|símbol|unitat|descripció|
|------|------|----------|
|S_VFA | mg/L | Biodegradable   Soluble     Organics (BSO) (volatile fatty acids)
|S_FBSO| mg/L | Biodegradable   Soluble     Organics (BSO) (fermentable organics)
|X_BPO | mg/L | Biodegradable   Particulate Organics (BPO)
|X_UPO | mg/L | Unbiodegradable Particulate Organics (UPO)
|S_USO | mg/L | Unbiodegradable Soluble     Organics (USO)
|X_iSS | mg/L | Inert Suspended Solids (sand)
|S_NH4 | mg/L | Inorganic Free Saline Ammonia (NH4)
|S_PO4 | mg/L | Inorganic OrthoPhosphate (PO4)
|S_NOx | mg/L | Inorganic Nitrite and Nitrate (NO2 + NO3) (not part of TKN)
|S_O2  | mg/L | Dissolved Oxygen
|X_OHO | mg/L | Ordinary Heterotrophic Organisms (expressed as COD) influent OHO should always be 0 (model assumption)
|X_PAO | mg/L | Polyphosphate Accumulating Organisms (expressed as COD) influent PAO should always be 0 (model assumption)
