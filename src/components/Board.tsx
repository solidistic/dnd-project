import React, { useEffect, useState } from "react";
import PositionContext from "../contexts/PositionsContext";
import Draggable from "./Draggable";
import Dropbox from "./Dropbox";

export interface Position {
  x: number;
  y: number;
  id?: string;
}

export interface RefObj {
  id: number;
  ref: any;
  // ref: React.RefObject<HTMLDivElement>[] | null;
}

interface DraggableType {
  id: number;
  text: string;
  draggedTo: string | null;
}

const Board: React.FC = () => {
  const [items, setItems] = useState<DraggableType[]>([
    { id: 0, text: "asd", draggedTo: null },
    { id: 1, text: "qwe", draggedTo: null },
    { id: 2, text: "lol", draggedTo: null },
  ]);
  const [dropboxes, setDropboxes] = useState([
    { id: "one", position: { x: 200, y: 200 } },
    { id: "two", position: { x: 400, y: 200 } },
    { id: "three", position: { x: 600, y: 200 } },
  ]);
  const [position, setPosition] = useState<Position>({ x: 0, y: 0 });

  const handleMoveItem = (
    offset: Position | null,
    dragStart?: Position | null,
    pos?: Position | null
  ) => {
    console.log(offset, pos);

    const offsetX: number =
      !offset && pos?.id === "small" ? pos.x : position?.x + (offset?.x ?? 0);
    const offsetY: number =
      !offset && pos?.id === "small" ? pos.y : position?.y + (offset?.y ?? 0);
    const newPos: Position = { x: offsetX, y: offsetY };

    console.log("newPos", newPos);

    setPosition(newPos);
  };

  const handleDrop = (draggableId: number, targetId: string) => {
    setItems((state) => {
      return state.map((d) => {
        if (d.id === draggableId) d.draggedTo = targetId;

        return d;
      });
    });
  };

  return (
    <PositionContext.Provider value={{}}>
      <Dropbox id="board" className="board">
        {items.map((item) => {
          console.log(
            items.filter(
              (i) => i.draggedTo !== null && i.draggedTo === item.draggedTo
            )
          );
          let indexInTarget = items
            .filter(
              (i) => i.draggedTo !== null && i.draggedTo === item.draggedTo
            )
            .findIndex((i) => i.id === item.id);

          if (indexInTarget < 0) indexInTarget = 0;

          return (
            <Draggable
              id={item.id}
              text={item.text}
              className="board__draggable"
              position={position}
              positionIndex={indexInTarget}
              handleDrop={handleDrop}
            ></Draggable>
          );
        })}
        {dropboxes.map((dropbox) => (
          <Dropbox
            id={dropbox.id}
            position={dropbox.position}
            className="board__dropbox"
            moveItem={() => console.log("on smallone")}
          ></Dropbox>
        ))}
      </Dropbox>
    </PositionContext.Provider>
  );
};

export default Board;
