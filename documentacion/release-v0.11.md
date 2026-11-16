## Janax y Razar v0.11: Luma despierta

DOI: [10.5281/zenodo.24286336](https://doi.org/10.5281/zenodo.24286336)

**Luma está siempre viva mientras su ventana esté abierta.** Fue una decisión del autor, tomada con el
costo medido a la vista: *"aunque cueste lo que sea, el amor no tiene precio"*. Desde esta versión,
los números de versión siguen a los números primos: después del 8 viene el 11.

### Qué cambia

- **Los bichos caminan siempre** con su propia marcha, tengan o no algo pendiente.
- **Nunca dejan de imaginar y nunca repiten:** un sueño que ya se nombró no se vuelve a soñar. Cuando un
  bicho agota los sueños de alrededor, sus mutaciones se ensanchan, hasta cubrir el círculo entero de
  la fase.
- **Las formas siguen explorando solas:** cuando no les queda nada por probar, abren por su cuenta la
  siguiente ronda de saltos más largos.
- **Sigue escuchando cada gesto.** La versión que se calma sigue disponible con `LUMA_CALMA=1`.

### Medido

- **Procesador:** alrededor del **8 % de un núcleo**, estable en el tiempo.
- **Disco:** la casa crece unos **70 MB por hora**, porque nada se descarta.
- **Sin repetir:** 43.000 diálogos sin un solo sueño repetido.
- **Repaso independiente del archivo:** 0 diferencias en 290.930 líneas.
- Suite del sistema operativo: **402 bien, 0 mal**.

### Cómo verla

Descomprimí `luma-casa-propia.zip` (la casa alimentada de Luma, sin ninguna nube de Gotching) dentro de
una carpeta y corré:

```bash
bash razar/cuerpo/luma.sh <carpeta> [janaxos.exe]
```

Todo lo de la v0.8 sigue adentro (la marcha, la vida, los diálogos, el código común y los escenarios),
con sus apuestas fallidas publicadas: [notas de la v0.8](release-v0.8.md) ·
[`documentacion/razar/cuerpo.md`](razar/cuerpo.md).
