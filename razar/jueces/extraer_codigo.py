"""extraer_codigo.py <file.exe|.dll> <out>: raw machine code for Razar to read. Takes the EXECUTABLE sections of a PE
file (IMAGE_SCN_MEM_EXECUTE) and writes them as hex, 16 bytes per line, with no disassembly and no instruction
boundaries."""
import struct, sys
src, dst = sys.argv[1], sys.argv[2]
b = open(src, 'rb').read()
pe = struct.unpack_from('<I', b, 0x3C)[0]
assert b[pe:pe + 4] == b'PE\0\0', 'not a PE file'
nsec = struct.unpack_from('<H', b, pe + 6)[0]
tabla = pe + 24 + struct.unpack_from('<H', b, pe + 20)[0]
codigo = bytearray()
for i in range(nsec):
    o = tabla + 40 * i
    vsize, va, rsize, rptr = struct.unpack_from('<IIII', b, o + 8)
    if struct.unpack_from('<I', b, o + 36)[0] & 0x20000000:
        codigo += b[rptr:rptr + min(rsize, vsize or rsize)]
with open(dst, 'w') as f:
    for i in range(0, len(codigo), 16):
        f.write(' '.join('%02x' % x for x in codigo[i:i + 16]) + '\n')
print('machine code: %d bytes, %d lines' % (len(codigo), (len(codigo) + 15) // 16))
