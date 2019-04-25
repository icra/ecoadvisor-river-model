_status_: en desenvolupament (maig 2019)

# river-model (ecoadvisor)

Model de trams de riu que es poden connectar entre sí per modelar un riu o una xarxa de rius.

Inputs per cada tram de riu:

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

Les variables d'estat (concentracions contaminants) que s'han de definir només al principi del riu, estan definits a:
https://github.com/icra/uct-icra-model

són:

|símbol |unitat| descripció|
| S_VFA | mg/L | Biodegradable   Soluble     Organics (BSO) (volatile fatty acids)
| S_FBSO| mg/L | Biodegradable   Soluble     Organics (BSO) (fermentable organics)
| X_BPO | mg/L | Biodegradable   Particulate Organics (BPO)
| X_UPO | mg/L | Unbiodegradable Particulate Organics (UPO)
| S_USO | mg/L | Unbiodegradable Soluble     Organics (USO)
| X_iSS | mg/L | Inert Suspended Solids (sand)
| S_FSA | mg/L | Inorganic Free Saline Ammonia (NH4)
| S_OP  | mg/L | Inorganic OrthoPhosphate (PO4)
| S_NOx | mg/L | Inorganic Nitrite and Nitrate (NO2 + NO3) (not part of TKN)
| X_OHO | mg/L | Ordinary Heterotrophic Organisms (expressed as COD) influent OHO should always be 0 (model assumption)
