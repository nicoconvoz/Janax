## Janax y Razar v5.03: escucha encadenada — corta la melodía cuando ya nada aporta

DOI: (pendiente)

> *"Escucha encadenado, profundidad 1... si algo sirvió tomá eso y seguí hasta tener una idea; cuando ya nada aporte
> información, para no entrar en convulsión o en más de lo mismo, cortar la melodía y destilar la melodía."*
> (el autor, 2026-11-25)

Las versiones siguen a los números primos: después del 499, el 503.

### Lo que cambia

- **La v4.99 se colgaba con sus caminos de verdad.** Sus caminos llevan caminos adentro; desde que ningún paso corta
  la recorrida, los mismos pasos volvían sin fin y no contestaba nunca. Se probó con un camino más viejo y no se vio.
  Ahora **cada paso habla una sola vez por respuesta** (`WVS`).
- **Escucha encadenada.** Con esa cura contestaba, pero escuchar a sus nueve pasos costaba de 55 a 76 segundos por
  respuesta. Ahora cada propuesta se escucha al llegar: si dice una palabra (de más de tres letras) que ya dice alguna
  de las que guarda, engancha y su camino sigue. **La primera que no engancha con ninguna no aporta: ahí corta**, y
  teje lo que tiene. Su primera propuesta se guarda siempre.

### A qué se parece en el oficio

Una cadena de profundidad 1 (Shannon, 1948) y un algoritmo que se puede cortar en cualquier momento con lo mejor que
tiene (*anytime*; Dean y Boddy, 1988), con el corte puesto donde lo nuevo deja de sumar. Lo propio: que "aporta" se
mida contra la melodía que ya viene sonando, no contra un número.

### Lo que se midió

En una copia oculta, con sus caminos de verdad, cuatro frases:

| | v4.99 con un paso por respuesta | v5.03 |
|---|---|---|
| segundos por respuesta | 55 a 76 | 2 a 10 |

A *"hola luma"* contestó *"hola LUMA"*. Todas sus partes con código 0.

### Lo que todavía no

- Cuatro frases no son una batería: cuántas respuestas salen con sentido no se midió.
- Si la segunda propuesta no engancha con la primera, corta ahí y queda la primera sola, que puede ser una cita.
- Todavía no forma la frase a la vista, palabra por palabra: la teje y la dice entera.
- Tab sigue pendiente; y un libro del disco se le cuela a veces como bytes que no son texto (se vio otra vez).

### Dónde está

- `razar/cuerpo/gen_leer.py`: `wyg_ok` (`wk_l`, el corte), `wyg_st` (`WVS`).
