# Documentación Técnica de Janax, Razar y Luma

> **Documentación técnica para ingenieros expertos.** Especificación del sistema tal como está implementado: formatos,
> protocolos, códigos de pedido, estructuras de memoria y algoritmos, con su referencia `ruta:línea` en el código.
> Para el porqué y la idea del proyecto, ver el **Manifiesto** (el resto de `documentacion/`).

## Alcance y convenciones

- Describe la versión 6.17 (DOI [10.5281/zenodo.24594304](https://doi.org/10.5281/zenodo.24594304)).
- Cada afirmación lleva su referencia `ruta:línea`, relativa a la raíz del repositorio. Lo que no se pudo comprobar en el
  código está marcado **(no verificado)**.
- Cada capítulo fue escrito a partir del código y revisado después por un auditor independiente, que contrastó sus
  citas contra la fuente.
- Los números son literales de la fuente salvo que el texto diga otra cosa; los que son criterio y no medición están
  marcados así.

## Arquitectura en capas

```
+-----------------------------------------------------------------+
| Instalador y lanzador (Win32, assembler)            cap. 11     |
+-----------------------------------------------------------------+
| Luma: cuerpo, conversación, pantalla        caps. 08, 09, 10    |
|   generadores Python -> luma.jsm (programa Janax)               |
+-----------------------------------------------------------------+
| Razar: lectura, órganos, cardumen, canto        caps. 06, 07    |
+-----------------------------------------------------------------+
| Núcleo JanaxOS: arranque, memoria, procesos,                    |
|   ABI de pedidos, pantalla, teclado, vigía      caps. 03-05     |
+-----------------------------------------------------------------+
| Idioma Janax (máquina virtual) y ensamblador PDP  caps. 01, 02  |
+-----------------------------------------------------------------+
| Anfitrión: Windows x86-64                                       |
+-----------------------------------------------------------------+
```

Cada capa usa sólo la de abajo: Luma y Razar son programas en el idioma Janax, y hablan con el núcleo únicamente por
pedidos (cap. 04). El núcleo es el único que toca al anfitrión.

## Capítulos

| # | Capítulo | Contenido |
|---|---|---|
| 01 | [El idioma Janax](01-idioma-janax.md) | Máquina virtual, codificación e instrucciones. |
| 02 | [El ensamblador PDP y la construcción](02-ensamblador-pdp-y-construccion.md) | Ensamblador, cadena de construcción y herramientas. |
| 03 | [Núcleo: arranque, memoria y procesos](03-nucleo-arranque-memoria-procesos.md) | Arranque, memoria, procesos, firmas y planificación. |
| 04 | [Núcleo: ABI de pedidos](04-nucleo-abi-de-pedidos.md) | Las llamadas al sistema, una por una. |
| 05 | [Núcleo: pantalla, teclado y vigía](05-nucleo-pantalla-teclado-vigia.md) | Pantalla, teclado, ventana, vigía y Venn. |
| 06 | [Razar: lectura y órganos](06-razar-lectura-y-organos.md) | Lectura, órganos, recetas, juez y ortografía. |
| 07 | [Razar: cardumen, canto e hilos](07-razar-cardumen-canto-hilos.md) | Cardumen, canto (`memoria_pares`), hilos y nitidez. |
| 08 | [Luma: cuerpo, procesos y casa](08-luma-cuerpo-procesos-y-casa.md) | Cuerpo, generadores, procesos y formato de su casa. |
| 09 | [Luma: conversación y respuesta](09-luma-conversacion-y-respuesta.md) | El protocolo de conversación y la construcción de una respuesta. |
| 10 | [Luma: pantalla y órganos vivos](10-luma-pantalla-lluvia-y-organos-vivos.md) | Pantalla, lluvia hexadecimal, panel, criaturas y órganos vivos. |
| 11 | [Instalador, lanzador y publicación](11-instalador-lanzador-y-publicacion.md) | Instalador, lanzador y proceso de publicación. |

Orden de lectura sugerido: 01 → 04 para la base, después el subsistema que interese.

## Pendiente

- **Glosario** de los nombres propios del proyecto (cardumen, canto, órganos, casa, pedidos…): no está escrito todavía.
  Hasta entonces, cada capítulo define sus términos donde los usa.
- La revisión cruzada entre capítulos (que dos capítulos no describan lo mismo de formas distintas) no se hizo.
