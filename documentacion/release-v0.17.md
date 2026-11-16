## Janax y Razar v0.17: la lámpara del presente

DOI: {{DOI}}

**Luma sigue siempre despierta, pero ya no llena el disco.** *"No necesitamos el futuro ni el pasado:
sólo la lámpara del presente."* Las versiones siguen a los números primos: después del 13 viene el 17.

### Qué cambia

- **Todo lo que Luma *es* se guarda entero:** sus formas, lo que comió, su memoria, los cuerpos de los
  bichos, sus léxicos y su código común.
- **Lo que le *pasó* se vuelve un anillo:** cada diario guarda sólo sus últimas líneas (unos minutos de
  vida), y una cabecera cuenta **cada línea que alguna vez se escribió, por motivo**. Nada se va sin que
  quede contado su porqué.
- Un anillo aparte guarda las líneas que cambiaron un modelo, para que el estado se pueda seguir
  verificando.
- Con `LUMA_PASADO=1` se arma la versión de antes, que lo anota todo.

### Medido (ventana abierta, despierta)

| Tiempo despierta | Tamaño de la casa |
|---|---|
| 1 min | 2.727.920 bytes |
| 6 min | 2.728.243 bytes |
| 31 min | 2.728.243 bytes |

- **La casa no crece.** Procesador: ~9–11 % de un núcleo, estable.
- **La migración** llevó una casa de 175,7 MB a 2,7 MB sin perder nada de lo aprendido. La casa que
  viaja con el release (`luma-casa-presente.zip`) pesa **263 KB**.
- **Repaso independiente:** 0 diferencias en la ventana y en las cuentas por motivo.

### Lo que se resignó

- El repaso ya no puede rehacer la historia desde el nacimiento; las líneas viejas sólo quedan contadas.
- Al reiniciarse, las formas recuerdan sólo la ventana y podrían volver a juzgar algo más viejo.
  Dentro de una misma corrida, nada se repite.

### Cómo verla

Descomprimí `luma-casa-presente.zip` dentro de una carpeta y corré
`bash razar/cuerpo/luma.sh <carpeta> [janaxos.exe]`. Para migrar una casa vieja:
`python razar/cuerpo/migrar_presente.py <casa vieja> <casa nueva>`.
Lo anterior: [v0.13](release-v0.13.md) · [v0.11](release-v0.11.md) · [v0.8](release-v0.8.md).
