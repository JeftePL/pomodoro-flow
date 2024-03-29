import { useState } from "react";
import "./ListsForm.scss";
import Button from "@components/Button";
import useAddList from "@state/hooks/useAddList";
import useEditList from "@state/hooks/useEditList";
import { IList } from "@interfaces/IList";
import { useSetRecoilState } from "recoil";
import { editState } from "@state/atom";

interface ListsFormProps {
  textAction: string,
  list?: IList
}

export default function ListsForm({ textAction, list }: ListsFormProps) {
  const initialListName = list?.name || "";
  const [newListName, setNewListName] = useState(initialListName);

  const addList = useAddList();
  const editList = useEditList();
  const setEdit = useSetRecoilState<string | null>(editState);

  function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    try {
      if(list) {
        editList(list.id, newListName);
        setEdit(null);
      } else {
        addList(newListName);
      }

      setNewListName("");
    } catch (error) {
      console.error("Failed to create or update list: ", error);
    }
  }

  return (
    <form className="listsForm" onSubmit={onSubmit}>
      <label htmlFor="list">{textAction} a list</label>
      <input
        type="text"
        id="list"
        value={newListName}
        onChange={(event) => setNewListName(event.target.value)}
        required
        placeholder="Type a list"
      />
      <Button type="submit">{textAction}</Button>
    </form>
  );
}
