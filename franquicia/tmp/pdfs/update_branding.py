from __future__ import annotations

import json
import re
import sys
from pathlib import Path

import fitz


ROOT = Path(__file__).resolve().parents[2]
OUTPUT = ROOT / "output" / "pdf"
OUTPUT.mkdir(parents=True, exist_ok=True)

WHITE_LOGO = ROOT / "images" / "uaden-global-logo-white.png"
COLOR_LOGO = ROOT / "images" / "uaden-global-logo-color.png"

CATALOG_SOURCE = (
    ROOT
    / "images"
    / "img"
    / "pdf"
    / "Catalogo de Formaciones y Programas de Training 2027 Uaden Prime.pdf"
)
CATALOG_OUTPUT = (
    OUTPUT
    / "Catalogo de Formaciones y Programas de Training 2027 Uaden Global.pdf"
)

APPLICATION_SOURCE = (
    ROOT
    / "images"
    / "img"
    / "pdf2"
    / "APLICACION_FRANQUICIA_UADEN PRIME 2026 (1)-MAURICIO TORRES.pdf"
)
APPLICATION_OUTPUT = (
    OUTPUT
    / "APLICACION_FRANQUICIA_UADEN_GLOBAL_2026-MAURICIO_TORRES.pdf"
)


def srgb(color: int) -> tuple[float, float, float]:
    return (
        ((color >> 16) & 255) / 255,
        ((color >> 8) & 255) / 255,
        (color & 255) / 255,
    )


def replace_brand(text: str) -> str:
    text = re.sub(r"www\.uadenprime\.com", "www.uaden.com", text, flags=re.I)
    text = re.sub(r"\bUADEN PRIME\b", "UADEN GLOBAL", text)
    text = re.sub(r"\bUaden Prime\b", "Uaden Global", text)
    text = re.sub(r"\buaden prime\b", "uaden global", text)
    return text


def font_alias(font_name: str) -> str:
    name = font_name.lower()
    bold = "bold" in name or "semibold" in name
    italic = "italic" in name
    if bold and italic:
        return "hebi"
    if bold:
        return "hebo"
    if italic:
        return "heit"
    return "helv"


def replace_text_spans(doc: fitz.Document) -> list[dict[str, object]]:
    updates: list[dict[str, object]] = []
    for page_index, page in enumerate(doc):
        replacements: list[dict[str, object]] = []
        for block in page.get_text("dict")["blocks"]:
            for line in block.get("lines", []):
                direction = tuple(round(value) for value in line["dir"])
                for span in line.get("spans", []):
                    old_text = span["text"]
                    new_text = replace_brand(old_text)
                    if new_text == old_text:
                        continue
                    font_size = float(span["size"])
                    if old_text.strip() == "UADEN PRIME":
                        font_size *= 0.70
                    replacements.append(
                        {
                            "rect": fitz.Rect(span["bbox"]),
                            "origin": fitz.Point(span["origin"]),
                            "text": new_text,
                            "size": font_size,
                            "color": srgb(int(span["color"])),
                            "font": font_alias(span["font"]),
                            "rotate": 90 if direction == (0, -1) else 0,
                            "old": old_text,
                        }
                    )

        for item in replacements:
            page.add_redact_annot(item["rect"], fill=None)
        if replacements:
            page.apply_redactions(images=0, graphics=0)
        for item in replacements:
            page.insert_text(
                item["origin"],
                item["text"],
                fontsize=item["size"],
                fontname=item["font"],
                color=item["color"],
                rotate=item["rotate"],
                overlay=True,
            )
            updates.append(
                {
                    "page": page_index + 1,
                    "old": item["old"],
                    "new": item["text"],
                }
            )
    return updates


def add_catalog_logos(doc: fitz.Document) -> None:
    red = (0.96, 0.10, 0.12)
    dark_blue = (0.02, 0.18, 0.37)

    page = doc[0]
    page.draw_rect(fitz.Rect(70, 38, 255, 82), color=red, fill=red, overlay=True)
    page.insert_image(
        fitz.Rect(76, 42, 246, 80),
        filename=str(WHITE_LOGO),
        keep_proportion=True,
        overlay=True,
    )

    page = doc[30]
    page.draw_rect(
        fitz.Rect(443, 590, 574, 625),
        color=dark_blue,
        fill=dark_blue,
        overlay=True,
    )
    page.insert_image(
        fitz.Rect(449, 594, 568, 621),
        filename=str(WHITE_LOGO),
        keep_proportion=True,
        overlay=True,
    )

    page = doc[32]
    page.draw_rect(
        fitz.Rect(70, 32, 255, 84),
        color=dark_blue,
        fill=dark_blue,
        overlay=True,
    )
    page.insert_image(
        fitz.Rect(76, 40, 246, 80),
        filename=str(WHITE_LOGO),
        keep_proportion=True,
        overlay=True,
    )
    page.draw_rect(
        fitz.Rect(64, 250, 571, 474),
        color=dark_blue,
        fill=dark_blue,
        fill_opacity=0.90,
        overlay=True,
    )
    page.insert_image(
        fitz.Rect(88, 292, 548, 430),
        filename=str(WHITE_LOGO),
        keep_proportion=True,
        overlay=True,
    )


def process(
    source: Path, output: Path, *, catalog_logos: bool = False
) -> list[dict[str, object]]:
    doc = fitz.open(source)
    updates = replace_text_spans(doc)
    if catalog_logos:
        add_catalog_logos(doc)
    doc.set_metadata(
        {
            **doc.metadata,
            "title": replace_brand(doc.metadata.get("title", "")),
            "subject": replace_brand(doc.metadata.get("subject", "")),
        }
    )
    doc.save(output, garbage=4, deflate=True, clean=True)
    doc.close()
    return updates


if "--application-only" in sys.argv:
    summary = {
        "application": process(APPLICATION_SOURCE, APPLICATION_OUTPUT),
    }
else:
    summary = {
        "catalog": process(CATALOG_SOURCE, CATALOG_OUTPUT, catalog_logos=True),
        "application": process(APPLICATION_SOURCE, APPLICATION_OUTPUT),
    }
print(json.dumps(summary, indent=2, ensure_ascii=False))
