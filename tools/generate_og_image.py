"""Generate OG image for vaken.dk — 1200x630 px.

Design: Fjordblå background, central breathing ring with glow, 'Vaken' inside,
tagline below, small veteran credit.
"""
from PIL import Image, ImageDraw, ImageFont, ImageFilter
from pathlib import Path

W, H = 1200, 630
CENTER = (W // 2, H // 2 - 40)

# Vaken palette
FJORD = (44, 53, 80)         # #2C3550
FJORD_DARK = (28, 36, 58)    # slightly darker for gradient
STEEL = (143, 168, 200)      # #8FA8C8
BIRCH = (240, 235, 226)      # #F0EBE2
SAND = (212, 201, 184)       # #D4C9B8

# --- Background with subtle vertical gradient ---
img = Image.new("RGB", (W, H), FJORD)
px = img.load()
for y in range(H):
    t = y / H
    r = int(FJORD[0] * (1 - t) + FJORD_DARK[0] * t)
    g = int(FJORD[1] * (1 - t) + FJORD_DARK[1] * t)
    b = int(FJORD[2] * (1 - t) + FJORD_DARK[2] * t)
    for x in range(W):
        px[x, y] = (r, g, b)

# --- Breathing ring with soft glow ---
ring_layer = Image.new("RGBA", (W, H), (0, 0, 0, 0))
rd = ImageDraw.Draw(ring_layer)

radius = 180
cx, cy = CENTER

# Outer soft glow — multiple strokes with decreasing alpha
for i, (width, alpha) in enumerate([(28, 30), (20, 55), (14, 90), (10, 140)]):
    bbox = [cx - radius, cy - radius, cx + radius, cy + radius]
    rd.ellipse(bbox, outline=(STEEL[0], STEEL[1], STEEL[2], alpha), width=width)

# Blur the glow layer
ring_layer = ring_layer.filter(ImageFilter.GaussianBlur(radius=6))

# Solid ring on top
rd2 = ImageDraw.Draw(ring_layer)
bbox = [cx - radius, cy - radius, cx + radius, cy + radius]
rd2.ellipse(bbox, outline=(STEEL[0], STEEL[1], STEEL[2], 255), width=5)

img.paste(ring_layer, (0, 0), ring_layer)

# --- Text ---
draw = ImageDraw.Draw(img)

# Fonts — fallback chain
def load_font(size, weight="regular"):
    candidates = {
        "regular": [
            "C:/Windows/Fonts/segoeui.ttf",
            "C:/Windows/Fonts/arial.ttf",
        ],
        "light": [
            "C:/Windows/Fonts/segoeuil.ttf",
            "C:/Windows/Fonts/arial.ttf",
        ],
        "semibold": [
            "C:/Windows/Fonts/seguisb.ttf",
            "C:/Windows/Fonts/arialbd.ttf",
            "C:/Windows/Fonts/arial.ttf",
        ],
    }
    for path in candidates.get(weight, candidates["regular"]):
        if Path(path).exists():
            return ImageFont.truetype(path, size)
    return ImageFont.load_default()

font_brand = load_font(88, "semibold")
font_tag = load_font(42, "light")
font_credit = load_font(22, "regular")

def draw_centered(text, y, font, fill):
    bbox = draw.textbbox((0, 0), text, font=font)
    tw = bbox[2] - bbox[0]
    draw.text(((W - tw) // 2, y), text, font=font, fill=fill)

# Brand name — vertically centered in the ring
brand = "Vaken"
bbox = draw.textbbox((0, 0), brand, font=font_brand)
bh = bbox[3] - bbox[1]
draw_centered(brand, cy - bh // 2 - 10, font_brand, BIRCH)

# Tagline — under the ring
draw_centered("Pust og fokus", cy + radius + 50, font_tag, SAND)

# Credit — bottom
draw_centered("Bygget af en veteran  ·  vaken.dk", H - 45, font_credit, (180, 195, 215))

out = Path(__file__).resolve().parent.parent / "og-image.png"
img.save(out, "PNG", optimize=True)
print(f"Saved: {out} ({out.stat().st_size // 1024} KB)")
