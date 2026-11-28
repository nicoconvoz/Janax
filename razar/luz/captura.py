"""captura.py: the picture of a window as Windows has it (PrintWindow, full content), even when other windows cover it.
Nothing is sent to the window."""
import ctypes, ctypes.wintypes as W
import numpy as np

u = ctypes.windll.user32; g = ctypes.windll.gdi32
u.SetProcessDPIAware()
# (handles are 64 bits: without these, ctypes cuts them to 32 and a picture fails now and then)
u.GetDC.restype = W.HDC; u.GetDC.argtypes = [W.HWND]; u.ReleaseDC.argtypes = [W.HWND, W.HDC]
u.GetClientRect.argtypes = [W.HWND, ctypes.POINTER(W.RECT)]; u.PrintWindow.argtypes = [W.HWND, W.HDC, W.UINT]
g.CreateCompatibleDC.restype = W.HDC; g.CreateCompatibleDC.argtypes = [W.HDC]
g.CreateCompatibleBitmap.restype = W.HBITMAP; g.CreateCompatibleBitmap.argtypes = [W.HDC, ctypes.c_int, ctypes.c_int]
g.SelectObject.restype = W.HGDIOBJ; g.SelectObject.argtypes = [W.HDC, W.HGDIOBJ]
g.DeleteObject.argtypes = [W.HGDIOBJ]; g.DeleteDC.argtypes = [W.HDC]
g.GetDIBits.argtypes = [W.HDC, W.HBITMAP, W.UINT, W.UINT, ctypes.c_void_p, ctypes.c_void_p, W.UINT]


def ventana(pid):
    import subprocess
    r = subprocess.run(["powershell", "-NoProfile", "-Command", "(Get-Process -Id %d).MainWindowHandle" % pid],
                       capture_output=True, text=True).stdout.strip()
    if r and r != "0": return int(r)
    hs = []
    @ctypes.WINFUNCTYPE(W.BOOL, W.HWND, W.LPARAM)
    def cb(h, _):
        p = W.DWORD(); u.GetWindowThreadProcessId(h, ctypes.byref(p))
        if p.value == pid and u.IsWindowVisible(h): hs.append(h)
        return True
    u.EnumWindows(cb, 0)
    return hs[0] if hs else None


class BMI(ctypes.Structure):
    _fields_ = [("sz", W.DWORD), ("w", W.LONG), ("h", W.LONG), ("pl", W.WORD), ("bc", W.WORD), ("co", W.DWORD),
                ("si", W.DWORD), ("x", W.LONG), ("y", W.LONG), ("cu", W.DWORD), ("ci", W.DWORD)]


def foto(h):
    """RGB picture of the window's client area (uint8, alto x ancho x 3), or None."""
    r = W.RECT(); u.GetClientRect(h, ctypes.byref(r)); w, hh = r.right, r.bottom
    if w <= 0 or hh <= 0: return None
    dc = u.GetDC(h); m = g.CreateCompatibleDC(dc); b = g.CreateCompatibleBitmap(dc, w, hh); g.SelectObject(m, b)
    u.PrintWindow(h, m, 3)
    bi = BMI(ctypes.sizeof(BMI), w, -hh, 1, 32, 0, 0, 0, 0, 0, 0); buf = ctypes.create_string_buffer(w * hh * 4)
    g.GetDIBits(m, b, 0, hh, buf, ctypes.byref(bi), 0)
    g.DeleteObject(b); g.DeleteDC(m); u.ReleaseDC(h, dc)
    return np.frombuffer(buf, np.uint8).reshape(hh, w, 4)[:, :, 2::-1].copy()
