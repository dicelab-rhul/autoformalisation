from json import load, dump

from normaliser import NormalisedEntry

import os


class SyncDatabase():
    def __init__(self, papers_json: str, db_path: str, db_backup_path: str) -> None:
        self.__papers_json: str = papers_json
        self.__db_path: str = db_path
        self.__db_backup_path: str = db_backup_path

    def sync_database(self) -> None:
        if not os.path.isfile(self.__papers_json):
            raise FileNotFoundError(f"The papers JSON file {self.__papers_json} does not exist.")
        elif self.__is_papers_json_empty():
            raise ValueError(f"The papers JSON file {self.__papers_json} is empty.")
        else:
            self.__backup_database()
            self.__update_database()

    def __is_papers_json_empty(self) -> bool:
        return os.path.getsize(self.__papers_json) == 0

    def __backup_database(self) -> None:
        if not os.path.isfile(self.__db_path) and not os.path.isfile(self.__db_backup_path):
            print(f"No existing database found at {self.__db_path} or backup at {self.__db_backup_path}. Skipping backup.")
        elif os.path.isfile(self.__db_path):
            os.replace(self.__db_path, self.__db_backup_path)

            print(f"Backup of the database created at {self.__db_backup_path}.")
        else:
            print(f"No existing database found at {self.__db_path}. Removing lingering backup at {self.__db_backup_path}.")

            os.remove(self.__db_backup_path)

    def __update_database(self) -> None:
        try:
            papers: list[dict[str, str]] = []

            with open(self.__papers_json, "r") as papers_file:
                papers_data: dict[str, list[NormalisedEntry]] = load(papers_file)

                for paper in papers_data["entries"]:
                    papers.append(paper["raw"])

            with open(self.__db_path, "w", encoding="utf-8") as db_file:
                dump(papers, db_file, indent=4, ensure_ascii=False)

            print(f"Database successfully updated at {self.__db_path}.")
        except Exception as e:
            os.replace(self.__db_backup_path, self.__db_path)

            raise RuntimeError(f"Failed to update the database from {self.__papers_json}: {e}") from e


if __name__ == "__main__":
    syncer: SyncDatabase = SyncDatabase(
        papers_json="papers.json",
        db_path="_data/papers.json",
        db_backup_path="_data/papers.json.bak"
    )

    syncer.sync_database()
