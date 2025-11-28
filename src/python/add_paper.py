#!/usr/bin/env python3

from __future__ import annotations
from json import load, dump

from normaliser import Normaliser, NormalisedEntry

import os


class PaperEntryParser():
    def __init__(self, papers_bib_file: str) -> None:
        self.__papers_bib_file: str = papers_bib_file
        self.__standard_keys: list[str] = ["id", "entrytype", "authors", "title", "year", "doi", "url", "journal", "booktitle", "venue"]
        self.__misc_keys: list[str] = ["llm", "language", "type"]
        self.__normaliser: Normaliser = Normaliser()

    def __load_bib_database(self) -> None:
        try:
            if not os.path.isfile(self.__papers_bib_file):
                raise FileNotFoundError(f"The file {self.__papers_bib_file} does not exist or is not a file.")
            else:
                self.__parse_bibtex_file()
        except Exception as e:
            raise RuntimeError(f"Failed to parse the BibTeX file {self.__papers_bib_file}: {e}") from e

    def __parse_bibtex_file(self) -> None:
        with open(self.__papers_bib_file, "r", encoding="utf-8") as bib_file:
            self.__bib_database: dict[str, list[NormalisedEntry]] = load(bib_file)

    def __parse_new_entry(self) -> dict[str, str]:
        entry: dict[str, str] = {}

        print("Please enter the details of the new paper to add to the BibTeX database.")

        for key in self.__standard_keys:
            print(f"Please enter the {key} of the paper (comma separated if multiple):")

            entry[key] = input().strip()

        print("Now, please enter any miscellaneous metadata for the paper.")

        for key in self.__misc_keys:
            print(f"Please enter the {key} of the paper (optional, press Enter to skip):")

            entry[key] = input().strip()

        return entry

    def __append_entry_to_bib(self, entry: dict[str, str]) -> None:
        normalised_entry: NormalisedEntry = self.__normaliser.normalise_bibtex_entry(bibtex_entry=entry)

        if normalised_entry["raw"]["id"] in [e["raw"]["id"] for e in self.__bib_database["entries"]]:
            raise ValueError(f"The paper with ID {normalised_entry["raw"]["id"]} already exists in the BibTeX database.")

        self.__bib_database["entries"].append(normalised_entry)

        with open(self.__papers_bib_file, "w", encoding="utf-8") as bib_file:
            dump(self.__bib_database, bib_file, indent=4, ensure_ascii=False)

    def run(self) -> None:
        try:
            self.__load_bib_database()

            entry: dict[str, str] = self.__parse_new_entry()

            self.__append_entry_to_bib(entry=entry)
        except Exception as e:
            raise RuntimeError(f"Failed to complete the AddPaperToBib job: {e}") from e


if __name__ == "__main__":
    parser: PaperEntryParser = PaperEntryParser(papers_bib_file="papers.json")

    parser.run()
