# Sistema operativo — cuaderno de ideas

Modo de trabajo: el Capitán tira las ideas, el Doc devuelve física y riesgos y anota. Se diseña recién
cuando el Capitán dice "ahora sí".

## 2026-10-28 — La idea base (Capitán)

> "No vamos a hacer un sistema operativo como los que existen. Como Wenas, tampoco es idéntico a lo que
> existe. Este sistema va a poder funcionar **sin nada instalado** o **arriba de cualquier otro sistema
> operativo**."

**Devolución del Doc:**

- Es el Cambiaformas un piso más abajo: el Cambiaformas se adapta al **procesador**; este sistema se
  adapta al **piso donde vive** (hardware pelado u otro sistema operativo).
- En hexagonal: un núcleo que no sabe dónde está parado, hablando por puertos; adaptador **hierro**
  (arranca solo, maneja el hardware) y adaptador **huésped** (le pide todo al anfitrión). Los traductores
  del escalón 0 ya corren como huéspedes de Windows y de Android.
- Antecedente a estudiar: **Inferno** (Bell Labs), que corría nativo o hospedado en Windows/Linux sobre su
  propia máquina virtual.
- Riesgo principal: en modo hierro los drivers (video, disco, red, wifi) son todos propios; en modo
  huésped los aporta el anfitrión.
