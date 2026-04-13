"""Optimize vaken.dk images for web.

Reduces JPEG quality and max-dimension to keep file sizes manageable
without noticeable visual degradation. Originals bevares i images/original/
som backup.
"""
from PIL import Image
from pathlib import Path
import shutil

SRC_DIR = Path(__file__).resolve().parent.parent / "images"
ORIG_DIR = SRC_DIR / "original"
ORIG_DIR.mkdir(exist_ok=True)

TARGETS = [
    # (filename, max_width, quality)
    ("dan.jpg", 1600, 78),
    ("dan-alt.jpg", 1600, 78),
]

for name, max_w, quality in TARGETS:
    src = SRC_DIR / name
    if not src.exists():
        print(f"SKIP: {name} — findes ikke")
        continue

    # Backup original hvis ikke allerede gemt
    backup = ORIG_DIR / name
    if not backup.exists():
        shutil.copy2(src, backup)
        print(f"Backed up: {backup.name}")

    original_size = src.stat().st_size // 1024

    with Image.open(src) as img:
        # Convert to RGB (JPEG does not support RGBA)
        if img.mode != "RGB":
            img = img.convert("RGB")

        # Resize if wider end max_w
        if img.width > max_w:
            ratio = max_w / img.width
            new_size = (max_w, int(img.height * ratio))
            img = img.resize(new_size, Image.LANCZOS)

        # Save optimized
        img.save(
            src,
            "JPEG",
            quality=quality,
            optimize=True,
            progressive=True,
        )

    new_size = src.stat().st_size // 1024
    reduction = int((1 - new_size / original_size) * 100)
    print(f"{name}: {original_size} KB -> {new_size} KB ({reduction}% smaller)")

print("\nDone. Originals er i images/original/ som backup.")
