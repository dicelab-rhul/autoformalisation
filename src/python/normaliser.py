from typing import Any, Iterable, cast, Optional, TypeAlias
from unicodedata import normalize as ud_normalise, combining as ud_combining
from re import sub as re_sub, split as re_split


NormalisedEntry: TypeAlias = dict[str, dict[str, Any]]


class Normaliser():
    def __init__(self) -> None:
        self.__standard_keys: set[str] = {"ID", "ENTRYTYPE", "author", "title", "year", "doi", "url", "journal", "booktitle", "venue"}

    def normalise_bibtex_entry(self, bibtex_entry: dict[str, str]) -> NormalisedEntry:
        self.__bibtex_entry: dict[str, str] = bibtex_entry

        entry_id: str = str(self.__bibtex_entry.get("ID", "")).strip()
        entry_type: str = str(self.__bibtex_entry.get("ENTRYTYPE", "unknown")).lower()
        authors = self.__normalise_authors_field(auth_field=self.__bibtex_entry.get("author"))
        title_dict: dict[str, str | list[str]] = self.__normalise_title_field(self.__bibtex_entry.get("title"))
        title: str = cast(str, title_dict["text"])
        title_tokens: list[str] = cast(list[str], title_dict["tokens"])
        year: Optional[int] = self.__normalise_year_field(self.__bibtex_entry.get("year"))
        doi: Optional[str] = self.__normalise_doi_field(self.__bibtex_entry.get("doi"))
        url: Optional[str] = self.__normalise_url_field(self.__bibtex_entry.get("url"))
        raw_venue: Optional[str] = (self.__bibtex_entry.get("journal") or self.__bibtex_entry.get("booktitle") or self.__bibtex_entry.get("venue"))
        venue_dict: dict[str, str | list[str]] = self.__normalise_venue_field(raw_venue)
        venue: str = cast(str, venue_dict["text"])
        venue_tokens: list[str] = cast(list[str], venue_dict["tokens"])
        custom: dict[str, dict[str, Any]] = self.__normalise_custom_fields()

        return {
            "raw": self.__bibtex_entry,
            "norm": {
                "ID": entry_id,
                "ENTRYTYPE": entry_type,
                "authors": authors,
                "title": title,
                "title_tokens": title_tokens,
                "year": year,
                "doi": doi,
                "url": url,
                "venue": venue,
                "venue_tokens": venue_tokens,
                "custom": custom,
            }
        }

    def __normalise_authors_field(self, auth_field: Any | Iterable[Any]) -> list[str]:
        if not auth_field:
            return []
        elif isinstance(auth_field, str):
            return self.__normalise_authors_field_from_str(auth_field)
        elif isinstance(auth_field, list):
            list_of_authors: list[Any] = cast(list[Any], auth_field)

            return self.__normalise_authors_field_from_list(list_of_authors)
        else:
            return []

    def __normalise_authors_field_from_str(self, auth_field: str) -> list[str]:
        authors: list[str] = [a.strip() for a in auth_field.split(" and ") if a.strip()]

        return self.__process_authors_list(authors)

    def __normalise_authors_field_from_list(self, auth_field: list[Any]) -> list[str]:
        if not all(isinstance(a, str) for a in auth_field):
            return []
        else:
            authors: list[str] = [str(a).strip() for a in auth_field if str(a).strip()]

        return self.__process_authors_list(authors)
    
    def __process_authors_list(self, authors: list[str]) -> list[str]:
        normalised: list[str] = []

        for author in authors:
            author_no_tex: str = self.__strip_latex(original_text=author)
            normalised_author: str = self.__normalise_text(original_text=author_no_tex)
            parts: list[str] = normalised_author.split()

            if parts:
                surname: str = parts[-1]
                name: str = " ".join(parts[:-1])
                normalised.append(f"{name} {surname}".strip())
            else:
                normalised.append(author_no_tex)

        return sorted(normalised)

    def __strip_latex(self, original_text: str) -> str:
        text_without_latex: str = re_sub(r"\\[a-zA-Z]+\{([^}]*)\}", r"\1", original_text)
        text_without_braces: str = re_sub(r"[{}]", "", text_without_latex)

        return text_without_braces


    def __normalise_text(self, original_text: str) -> str:
        lowercase_text: str = original_text.lower()

        # Remove accents
        normalised_text: str = "".join(ch for ch in ud_normalise("NFKD", lowercase_text) if not ud_combining(ch))

        # Remove punctuation except whitespace
        no_punctuation_text: str = re_sub(r"[^\w\s]", "", normalised_text)

        # Collapse whitespace
        return re_sub(r"\s+", " ", no_punctuation_text).strip()

    def __normalise_title_field(self, raw_title: Any) -> dict[str, str | list[str]]:
        return self.__normalise_to_text_and_tokens(raw_title)

    def __normalise_to_text_and_tokens(self, value: Any) -> dict[str, str | list[str]]:
        prototype: dict[str, str | list[str]] = {
            "text": "",
            "tokens": []
        }

        if value:
            stripped: str = self.__strip_latex(str(value))
            norm: str = self.__normalise_text(stripped)
            prototype["text"] = norm
            prototype["tokens"] = self.__tokenise(norm)

        return prototype

    def __tokenise(self, text: str) -> list[str]:
        return [t for t in re_split(r"\W+", text.lower()) if t]

    def __normalise_year_field(self, raw_year: Any) -> Optional[int]:
        try:
            return int(str(raw_year).strip()) if raw_year else None
        except ValueError:
            return None

    def __normalise_doi_field(self, raw_doi: Any) -> Optional[str]:
        if not raw_doi:
            return None
        else:
            return str(raw_doi).strip().lower().replace("https://doi.org/", "").replace("http://doi.org/", "")

    def __normalise_url_field(self, raw_url: Any) -> Optional[str]:
        return str(raw_url).strip() if raw_url else None

    def __normalise_venue_field(self, raw_venue: Any) -> dict[str, str | list[str]]:
        return self.__normalise_to_text_and_tokens(raw_venue)

    def __normalise_generic_field(self, raw_value: Any) -> dict[str, str | list[str]]:
        return self.__normalise_to_text_and_tokens(raw_value)

    def __normalise_custom_fields(self) -> dict[str, dict[str, Any]]:
        custom: dict[str, dict[str, Any]] = {}

        for key, value in self.__bibtex_entry.items():
            if key not in self.__standard_keys:
                generic_dict: dict[str, str | list[str]] = self.__normalise_generic_field(value)
                custom[key] = {
                    "text": cast(str, generic_dict["text"]),
                    "tokens": cast(list[str], generic_dict["tokens"]),
                }

        return custom
