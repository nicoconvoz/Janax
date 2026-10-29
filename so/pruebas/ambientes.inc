; One request through the window, with the queue at j3: kind, a = register, answer into dest.
macro pedido kind, areg, dest {
  jldi j4, 1
  jst j4, j3, 0
  jldi j4, kind
  jst j4, j3, 8
  jst areg, j3, 16
  jsys j6, j3
  jld dest, j3, 32
}
