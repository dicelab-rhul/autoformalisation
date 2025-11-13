#!/usr/bin/env python3

from __future__ import annotations
from bibtexparser import parse_file, write_file
from bibtexparser.library import Library
from bibtexparser.model import Entry, Field
from yaml import safe_dump
from yaml import add_representer, Dumper, ScalarNode

import os


class PaperEntryParser():
    def __init__(self, papers_bib_file: str, metadata_file: str) -> None:
        self.__papers_bib_file: str = papers_bib_file
        self.__metadata_file: str = metadata_file

    def __load_bib_database(self, source_file: str) -> None:
        try:
            if not os.path.isfile(source_file):
                raise FileNotFoundError(f"The file {source_file} does not exist or is not a file.")

            self.__bib_database: Library = parse_file(source_file)
        except Exception as e:
            raise RuntimeError(f"Failed to parse the BibTeX file {source_file}: {e}") from e

    def __generate_entry(self, key: str, title: str, author: str, year: str, url: str, entry_type: str) -> Entry:
        fields: list[Field] = [
            Field(key="ENTRYTYPE", value=entry_type),
            Field(key="ID", value=key),
            Field(key="title", value=title),
            Field(key="author", value=author),
            Field(key="year", value=year),
        ]

        if url:
            fields.append(Field(key="url", value=url))

        return Entry(entry_type=entry_type, key=key, fields=fields)

    def __parse_new_entry(self) -> None:
        key: str = input("BibTeX key: ").strip()
        title: str = input("Title: ").strip()
        author: str = input("Author(s): ").strip()
        year: str = input("Year: ").strip()
        url: str = input("URL (optional): ").strip()
        entry_type: str = input("Entry type (article/inproceedings): ").strip() or "article"
        language: str = input("Programming language (optional): ").strip()
        llm: str = input("LLM (optional): ").strip()
        ptype: str = input("Paper type (research/survey): ").strip()
        repo: str = input("Code repo URL (optional): ").strip()

        if any(e["ID"] == key for e in self.__bib_database.entries):
            raise ValueError("The provided BibTeX key already exists.")
        else:
            self.__entry: Entry = self.__generate_entry(key=key, title=title, author=author, year=year, url=url, entry_type=entry_type)
            self.__metadata: dict[str, str] = {k: v for k, v in {"language": language, "llm": llm, "type": ptype, "repository": repo}.items() if v}

    def __append_entry_to_bib(self, bib_file: str) -> None:
        try:
            with open(bib_file, "a") as o_f:
                o_f.write("\n")

                write_file(o_f, Library(blocks=[self.__entry]))
        except Exception as e:
            raise RuntimeError(f"Failed to append the new entry to the BibTeX file {bib_file}: {e}") from e

    @staticmethod
    def __str_no_quotes(dumper: Dumper, value: str) -> ScalarNode:
        return dumper.represent_scalar(tag="tag:yaml.org,2002:str", value=value, style=None)

    def __append_metadata_to_yaml(self, metadata_file: str) -> None:
        try:
            add_representer(str, PaperEntryParser.__str_no_quotes)

            with open(metadata_file, "a") as o_f:
                safe_dump({self.__entry.key: self.__metadata}, stream=o_f, allow_unicode=True)
        except Exception as e:
            raise RuntimeError(f"Failed to append the new metadata to the YAML file {metadata_file}: {e}") from e

    def run(self) -> None:
        try:
            self.__load_bib_database(self.__papers_bib_file)
            self.__parse_new_entry()
            self.__append_entry_to_bib(self.__papers_bib_file)
            self.__append_metadata_to_yaml(self.__metadata_file)
        except Exception as e:
            raise RuntimeError(f"Failed to complete the AddPaperToBib job: {e}") from e


if __name__ == "__main__":
    parser: PaperEntryParser = PaperEntryParser(papers_bib_file="papers.bib", metadata_file="metadata.yml")

    parser.run()
