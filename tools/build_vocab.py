# -*- coding: utf-8 -*-
"""Génère le bloc `const vocab = { ... };` de js/app.js à partir de tools/hsk_data.py.

Aucune dépendance externe : le pinyin, les traductions et les exemples
sont saisis à la main dans hsk_data.py.

Usage :
    python3 tools/build_vocab.py           # met à jour js/app.js
    python3 tools/build_vocab.py --check   # vérifie seulement (n'écrit rien)
"""
import json
import os
import re
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from hsk_data import HSK1, HSK2  # noqa: E402

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
APP_JS = os.path.join(ROOT, "js", "app.js")

TONE_MARKS = set("āáǎàēéěèīíǐìōóǒòūúǔùǖǘǚǜ")


def validate():
    """Contrôles de cohérence : doublons, champs vides, mot présent dans l'exemple."""
    errors = []
    seen = {}
    for level, rows in ((1, HSK1), (2, HSK2)):
        for word, pinyin, fr, en, zh_ex, fr_ex, en_ex in rows:
            if word in seen:
                errors.append("Doublon : %s (HSK %d et HSK %d)" % (word, seen[word], level))
            seen[word] = level
            if not all((pinyin, fr, en, zh_ex, fr_ex, en_ex)):
                errors.append("Champ vide : %s" % word)
            # Pour les structures « A…B », chaque partie doit figurer dans l'exemple.
            for part in word.split("…"):
                if part not in zh_ex:
                    errors.append("Exemple sans le mot « %s » : %s" % (part, zh_ex))
            if not TONE_MARKS & set(pinyin) and pinyin not in NEUTRAL_ONLY:
                errors.append("Pinyin sans ton : %s %s" % (word, pinyin))
    return errors


# Mots entièrement au ton neutre (particules) : pas de diacritique attendu.
NEUTRAL_ONLY = {"de", "le", "ma", "ne", "ba", "guo", "zhe"}


def js_card(row, level, lang):
    word, pinyin, fr, en, zh_ex, fr_ex, en_ex = row
    card = {
        "word": word,
        "pinyin": pinyin,
        "translation": fr if lang == "fr" else en,
        "level": level,
        "example": "「%s」— %s" % (zh_ex, fr_ex if lang == "fr" else en_ex),
    }
    # json.dumps produit des littéraux JS valides (guillemets échappés).
    return "        { " + ", ".join(
        "%s: %s" % (k, json.dumps(v, ensure_ascii=False)) for k, v in card.items()
    ) + " }"


def deck_block(lang, labels):
    lines = ["        // — " + labels[0]]
    lines += [js_card(r, 1, lang) + "," for r in HSK1]
    lines += ["", "        // — " + labels[1]]
    lines += [js_card(r, 2, lang) + "," for r in HSK2]
    lines[-1] = lines[-1].rstrip(",")
    return "\n".join(lines)


def build_vocab_js():
    return (
        "  const vocab = {\n"
        "    fr: {\n"
        "      flag: '🇫🇷', name: 'Français → Chinois', tts: 'zh-CN',\n"
        "      desc: 'Vocabulaire officiel HSK 1 et HSK 2.',\n"
        "      cards: [\n"
        + deck_block("fr", ("HSK 1 · Débutant", "HSK 2 · Élémentaire")) + "\n"
        "      ]\n"
        "    },\n"
        "    en: {\n"
        "      flag: '🇬🇧', name: 'Anglais → Chinois', tts: 'zh-CN',\n"
        "      desc: 'Official HSK 1 & HSK 2 vocabulary.',\n"
        "      cards: [\n"
        + deck_block("en", ("HSK 1 · Beginner", "HSK 2 · Elementary")) + "\n"
        "      ]\n"
        "    }\n"
        "  };"
    )


def main():
    errors = validate()
    if errors:
        print("Erreurs dans hsk_data.py :")
        for e in errors:
            print("  -", e)
        sys.exit(1)

    src = open(APP_JS, encoding="utf-8").read()
    pattern = re.compile(r"  const vocab = \{.*?\n  \};", re.S)
    if not pattern.search(src):
        print("ERREUR : bloc `const vocab` introuvable dans js/app.js")
        sys.exit(1)
    out = pattern.sub(lambda m: build_vocab_js(), src, count=1)

    print("HSK 1 : %d mots · HSK 2 : %d mots" % (len(HSK1), len(HSK2)))
    if "--check" in sys.argv:
        print("Vérification OK (rien n'a été écrit).")
        return
    open(APP_JS, "w", encoding="utf-8").write(out)
    print("js/app.js mis à jour.")


if __name__ == "__main__":
    main()
