from __future__ import annotations

from json import dump, load
from re import match, Match
from typing import Any, Optional

from duplicate_checker import DuplicateChecker
from normaliser import Normaliser, NormalisedEntry

import os


class BibTeXLoader():
    def __init__(self) -> None:
        self.__bibtex_file: str = "papers.bib"
        self.__output_file: str = "papers.json"
        self.__normaliser: Normaliser = Normaliser()
        self.__converted_entries: list[dict[str, Any]] = []

    def main(self) -> None:
        entries: list[str] = self.__load_bib_database()

        self.__convert_bib_entries(entries)
        self.__save_output()

    def __load_bib_database(self) -> list[str]:
        if not os.path.isfile(self.__bibtex_file):
            raise FileNotFoundError(f"{self.__bibtex_file} not found.")

        with open(self.__bibtex_file, "r", encoding="utf-8") as f:
            content: str = f.read()

        return self.__split_entries(content)

    def __split_entries(self, content: str) -> list[str]:
        entries: list[str] = []
        depth: int = 0
        start: int = -1

        for i, ch in enumerate(content):
            if ch == "@":
                start = i
            elif ch == "{":
                depth += 1
            elif ch == "}":
                depth -= 1

                if depth == 0 and start != -1:
                    entries.append(content[start:i + 1])

                    start = -1

        return entries

    def __parse_bibtex_entry(self, bibtex: str) -> tuple[str, str, dict[str, str]]:
        text: str = bibtex.strip()
        entrytype, citation_key, body = self.__parse_entry_header(text)
        fields: dict[str, str] = self.__parse_bibtex_fields(body)

        return entrytype, citation_key, fields


    def __parse_entry_header(self, text: str) -> tuple[str, str, str]:
        m: Optional[Match[str]] = match(r"@([A-Za-z0-9_:+-]+)\s*\{\s*([^,]+)\s*,", text)

        if not m:
            raise ValueError("Invalid BibTeX entry")

        entrytype: str = m.group(1).lower()
        citation_key: str = m.group(2)
        body: str = text[m.end():].rstrip("}").strip()

        return entrytype, citation_key, body


    def __parse_bibtex_fields(self, body: str) -> dict[str, str]:
        fields: dict[str, str] = {}
        i: int = 0

        while i < len(body):
            i = self.__skip_field_separators(body, i)

            if i >= len(body):
                break

            field, i = self.__read_field_name(body, i)
            value, i = self.__read_field_value(body, i)

            fields[field] = value.strip()

        return fields


    def __skip_field_separators(self, body: str, i: int) -> int:
        while i < len(body) and body[i] in " \n\t,":
            i += 1

        return i


    def __read_field_name(self, body: str, i: int) -> tuple[str, int]:
        start: int = i

        while i < len(body) and body[i] != "=":
            i += 1

        field: str = body[start:i].strip().lower()

        i += 1  # skip '='

        while i < len(body) and body[i].isspace():
            i += 1

        return field, i


    def __read_field_value(self, body: str, i: int) -> tuple[str, int]:
        if i >= len(body):
            raise ValueError("Missing value after '=' in BibTeX field")

        if body[i] == "{":
            return self.__read_braced(body, i)

        if body[i] == '"':
            return self.__read_quoted(body, i)

        start: int = i

        while i < len(body) and body[i] != ",":
            i += 1

        return body[start:i], i

    def __read_braced(self, s: str, i: int) -> tuple[str, int]:
        depth: int = 0
        start: int = i + 1

        i += 1

        while i < len(s):
            if s[i] == "{":
                depth += 1
            elif s[i] == "}":
                if depth == 0:
                    return s[start:i], i + 1

                depth -= 1

            i += 1

        raise ValueError("Unbalanced braces")

    def __read_quoted(self, s: str, i: int) -> tuple[str, int]:
        i += 1

        start: int = i

        while i < len(s):
            if s[i] == '"':
                return s[start:i], i + 1

            i += 1

        raise ValueError("Unbalanced quotes")

    def __infer_type(self, entrytype: str) -> str:
        mapping: dict[str, str] = {
            "article": "Article",
            "inproceedings": "Conference Paper",
            "misc": "Article",
        }

        return mapping.get(entrytype, "Article")

    def __convert_bib_entries(self, entries: list[str]) -> None:
        for entry in entries:
            entrytype, key, fields = self.__parse_bibtex_entry(entry)

            raw: dict[str, Any] = {
                "id": key,
                "entrytype": entrytype,
                "authors": fields.get("author", ""),
                "title": fields.get("title", ""),
                "year": fields.get("year", ""),
                "doi": fields.get("doi", ""),
                "url": fields.get("url", ""),
                "journal": fields.get("journal", ""),
                "booktitle": fields.get("booktitle", ""),
                "venue": fields.get("journal", "") or fields.get("booktitle", ""),
                "domain": fields.get("domain", ""),
                "target formalism": fields.get("target formalism", ""),
                "goal": fields.get("goal", ""),
                "type": self.__infer_type(entrytype),
                "repository": fields.get("repository", ""),
            }

            normalised_entry: NormalisedEntry = self.__normaliser.normalise_bibtex_entry(raw)

            self.__converted_entries.append(normalised_entry)

    def __save_output(self) -> None:
        existing_papers_data: dict[str, list[NormalisedEntry]] = {"entries": []}

        with open(self.__output_file, "r", encoding="utf-8") as f:
            existing_papers_data = load(f)

        existing_entries: list[NormalisedEntry] = existing_papers_data.get("entries", [])

        for new_entry in self.__converted_entries:
            if not DuplicateChecker.is_duplicate(normalised_entry=new_entry, normalised_entries=existing_entries):
                existing_entries.append(new_entry)
            else:
                print(f"Duplicate entry detected (ID: {new_entry["norm"]["id"]}). Skipping.")

        with open(self.__output_file, "w", encoding="utf-8") as f:
            dump(existing_papers_data, f, indent=4, ensure_ascii=False)


if __name__ == "__main__":
    loader: BibTeXLoader = BibTeXLoader()

    loader.main()
