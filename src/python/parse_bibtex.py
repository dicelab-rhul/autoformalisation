#!/usr/bin/env python3

from __future__ import annotations
from typing import Any, cast
from bibtexparser import parse_file
from bibtexparser.library import Library
from yaml import safe_load, safe_dump_all

import os


class BibtexParser:
    def __init__(self, papers_bib_file: str, metadata_file: str, output_file: str) -> None:
        self.__papers_bib_file: str = papers_bib_file
        self.__metadata_file: str = metadata_file
        self.__output_file: str = output_file
        self.__papers: list[dict[str, Any]] = []

    def __load_bib_database(self, source_file: str) -> None:
        try:
            if not os.path.isfile(source_file):
                raise FileNotFoundError(f"The file {source_file} does not exist or is not a file.")

            self.__bib_database: Library = parse_file(source_file)
        except Exception as e:
            raise RuntimeError(f"Failed to parse the BibTeX file {source_file}: {e}") from e

    def __load_metadata(self, source_file: str) -> None:
        try:
            if not os.path.isfile(source_file):
                raise FileNotFoundError(f"The file {source_file} does not exist or is not a file.")

            with open(source_file, "r") as i_f:
                self.__metadata = cast(dict[str, Any], safe_load(i_f) or {})
        except Exception as e:
            raise RuntimeError(f"Failed to load the metadata file {source_file}: {e}") from e

    def __load(self) -> None:
        self.__load_bib_database(self.__papers_bib_file)
        self.__load_metadata(self.__metadata_file)

    def __parse(self) -> None:
        try:
            for entry in self.__bib_database.entries:
                key: str = entry.key
                entry_dict: dict[str, Any] = dict(entry.items())
                entry_dict["ID"] = key
                entry_dict["ENTRYTYPE"] = entry.entry_type
                merged: dict[str, Any] = {**entry_dict, **self.__metadata.get(key, {})}

                self.__papers.append(merged)
        except Exception as e:
            raise RuntimeError(f"Failed to parse BibTeX entries: {e}") from e

    def __dump(self) -> None:
        try:
            with open(self.__output_file, "w") as o_f:
                safe_dump_all(documents=self.__papers, stream=o_f, allow_unicode=True)
        except Exception as e:
            raise RuntimeError(f"Failed to dump the papers to the output file {self.__output_file}: {e}") from e

    def run(self) -> None:
        try:
            self.__load()
            self.__parse()
            self.__dump()
        except Exception as e:
            raise RuntimeError(f"Failed to complete the BibTeX parser job: {e}") from e

if __name__ == "__main__":
    parser: BibtexParser = BibtexParser(papers_bib_file="papers.bib", metadata_file="metadata.yml", output_file="_data/papers.yml")

    parser.run()
