from typing import Optional, Any

from normaliser import NormalisedEntry


class DuplicateChecker():
    DUPLICATE_THRESHOLD: float = 0.75

    @staticmethod
    def __jaccard(a: list[str], b: list[str]) -> float:
        if not a or not b:
            return 0.0
        else:
            a_set, b_set = set(a), set(b)

            return len(a_set & b_set) / len(a_set | b_set)

    @staticmethod
    def __author_match(a_new: list[str], a_old: list[str]) -> float:
        # Both are lists of normalized names
        if not a_new or not a_old:
            return 0.0

        a_new_set, a_old_set = set(a_new), set(a_old)

        # Full-set containment → strong signal
        if a_new_set.issubset(a_old_set) or a_old_set.issubset(a_new_set):
            return 1.0

        # Partial overlap
        return len(a_new_set & a_old_set) / max(len(a_new_set), len(a_old_set))

    @staticmethod
    def __year_match(y_new: Optional[int], y_old: Optional[int]) -> float:
        if y_new is None or y_old is None:
            return 0.0
        else:
            return 1.0 if y_new == y_old else 0.0


    @staticmethod
    def __duplicate_score(n_new: dict[str, Any], n_old: dict[str, Any]) -> float:
        score_title = DuplicateChecker.__jaccard(n_new["title_tokens"], n_old["title_tokens"])
        score_authors = DuplicateChecker.__author_match(n_new["authors"], n_old["authors"])
        score_year = DuplicateChecker.__year_match(n_new["year"], n_old["year"])

        # Weighted sum
        return 0.60 * score_title + 0.30 * score_authors + 0.10 * score_year

    @staticmethod
    def is_duplicate(normalised_entry: NormalisedEntry, normalised_entries: list[NormalisedEntry]) -> bool:
        for existing_entry in normalised_entries:
            score: float = DuplicateChecker.__duplicate_score(normalised_entry["norm"], existing_entry["norm"])

            if score >= DuplicateChecker.DUPLICATE_THRESHOLD:
                return True

        return False
