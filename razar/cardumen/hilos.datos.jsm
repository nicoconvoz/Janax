; The texts of hilos (relations found in raw text, and how they relate), one every 20h or 40h bytes, ended by a 0.
db 'libro', 0
times 10h - $ db 0
db 'p', 0
times 20h - $ db 0
db 'hilos: no hay libro', 10, 0
times 40h - $ db 0
db 'hilos: sin memoria', 10, 0
times 80h - $ db 0
db 'pares', 0
times 0C0h - $ db 0
db 'palabras: ', 0
times 0E0h - $ db 0
db ' | la mitad: dichas ', 0
times 100h - $ db 0
db ' veces o mas | formas dichas por dos: ', 0
times 140h - $ db 0
db ' de ', 0
times 160h - $ db 0
db 'relacion: ', 0
times 180h - $ db 0
db ' ~ ', 0
times 1A0h - $ db 0
db ' | misma', 0
times 1C0h - $ db 0
db ' | al reves', 0
times 1E0h - $ db 0
db ' | lo dicen ', 0
times 200h - $ db 0
db ' | nulo ', 0
times 220h - $ db 0
db '.5', 0
times 240h - $ db 0
db ' | relaciones que comparten dos pares y mas que su nulo: ', 0
times 280h - $ db 0
db 'vuelta ', 0
times 2A0h - $ db 0
db ' une: ', 0
times 2C0h - $ db 0
db 'el while paro en la vuelta ', 0
times 2E0h - $ db 0
db ': nada nuevo se deduce sin contradiccion', 0
times 340h - $ db 0
db ' | relaciones de dos formas o mas: ', 0
times 380h - $ db 0
db ' | la mas grande: ', 0
times 3C0h - $ db 0
db ' formas, la primera: ', 0
times 3E0h - $ db 0
db ': hipotesis sin contradiccion ', 0
times 420h - $ db 0
db ' | se unen ', 0
times 440h - $ db 0
db 'tanda', 0
times 460h - $ db 0
db 'T: ', 0
times 470h - $ db 0
db 'N: ', 0
times 480h - $ db 0
db 'R: ', 0
times 490h - $ db 0
db ' | ', 0
times 4A0h - $ db 0
db 'P: ', 0
times 4B0h - $ db 0
db 'Q: ', 0
times 4C0h - $ db 0
db 'U: ', 0
times 4D0h - $ db 0
db 'V: ', 0
times 4E0h - $ db 0
db 'W: ', 0
times 4F0h - $ db 0
db 'G: ', 0
times 500h - $ db 0
db 'A: ', 0
times 510h - $ db 0
db 'H: ', 0
times 520h - $ db 0
db 'B: ', 0
times 530h - $ db 0
db 'F: ', 0
times 540h - $ db 0
db 'cruce', 0
times 550h - $ db 0
db ' | lo confirman ', 0
times 570h - $ db 0
db ' | nada lo contradice', 0
times 590h - $ db 0
db ' | pegamento (dicen un par de los dos lados): ', 0
times 5D0h - $ db 0
db 'mismo lugar: ', 0
times 5E0h - $ db 0
db ' = ', 0
times 5F0h - $ db 0
db 'deduce: ', 0
times 600h - $ db 0
db ' | pares ', 0
times 610h - $ db 0
db ' + ', 0
times 620h - $ db 0
db ' | hipotesis en coma: ', 0
times 640h - $ db 0
db ' | deducidas en espera (sin testigo): ', 0
times 670h - $ db 0
db 'despierta: ', 0
times 690h - $ db 0
db ' | huecos de las refutadas: ', 0
times 6B0h - $ db 0
db ', que explicaria una dormida: ', 0
times 6E0h - $ db 0
db 'suspende', 0
times 700h - $ db 0
db 'regla ', 0
times 720h - $ db 0
db ' | frena ', 0
times 740h - $ db 0
db ' uniones (', 0
times 760h - $ db 0
db ' palabras)', 10, 0
times 780h - $ db 0
db ' | un B por cada A', 0
times 7A0h - $ db 0
db ' | un A por cada B', 0
times 7C0h - $ db 0
db 'suspendida: regla ', 0
times 7E0h - $ db 0
db 'sabido', 0
times 800h - $ db 0
db 'sabe: ', 0
times 820h - $ db 0
db 'sabido: ', 0
times 840h - $ db 0
db ' aplicadas | ', 0
times 860h - $ db 0
db ' sin usar (sus formas no estan en este libro)', 10, 0
times 8A0h - $ db 0
db 'duerme: ', 0
times 8C0h - $ db 0
db 'despierta lo sabido: ', 0
times 8E0h - $ db 0
db ' dormida', 0
times 900h - $ db 0
db ' | en contra ', 0
times 920h - $ db 0
db ', a favor ', 0
times 940h - $ db 0
db ' se duermen, ', 0
times 960h - $ db 0
db ' despiertan', 10, 0
times 980h - $ db 0
db 'pendiente', 0
times 9A0h - $ db 0
db 'verifica: ', 0
times 9C0h - $ db 0
db 'pendientes: ', 0
times 9E0h - $ db 0
db ' verificadas | ', 0
times 0A00h - $ db 0
db ' siguen | ', 0
times 0A20h - $ db 0
db ' nuevos', 10, 0
times 0A40h - $ db 0
db 'instruccion: ', 0
times 0A60h - $ db 0
db ' | une iguales ', 0
times 0A80h - $ db 0
db ' (mezcladas ', 0
times 0AA0h - $ db 0
db 'instrucciones: ', 0
times 0AC0h - $ db 0
db ' | imagina ', 0
times 0AE0h - $ db 0
db ' (con parejas mezcladas: ', 0
times 0B00h - $ db 0
db 'imaginado', 0
times 0B20h - $ db 0
db 'confirma: ', 0
times 0B40h - $ db 0
db 'imaginado: ', 0
times 0B60h - $ db 0
db ' confirmadas de ', 0
times 0B80h - $ db 0
db ' comprobables | azar: ', 0
times 0BA0h - $ db 0
db 'partes', 0
times 0BC0h - $ db 0
db 'piezas', 0
times 0BE0h - $ db 0
db 'pieza: ', 0
times 0C00h - $ db 0
db 'fin', 0
times 0C20h - $ db 0
db 'inicio', 0
