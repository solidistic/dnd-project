import React, { useRef, useState } from "react";
import { DropTargetMonitor, useDrop } from "react-dnd";
import Draggable from "./Draggable";
import { XYCoord } from "dnd-core";

export interface Position {
  x: number;
  y: number;
  id?: string;
}

export interface DropboxProps {
  moveItem?: (
    offset: Position | null,
    dragStart?: Position | null,
    dropboxPos?: Position | null
  ) => void;
  className?: string;
  id: string;
  position?: { x: number; y: number };
}

const Dropbox: React.FC<DropboxProps> = ({
  children,
  className = "",
  id,
  moveItem,
  position = { x: 0, y: 0 },
}) => {
  // const [position, setPosition] = useState<Position>({ x: 0, y: 0 });
  const ref = useRef<HTMLDivElement>(null);
  const [{ isOverCurrent }, drop] = useDrop({
    accept: "box",
    drop: (item, monitor) => {
      // console.log(item.type);
      // console.log(monitor.getDifferenceFromInitialOffset());
      // console.log(monitor.getDropResult());
      // console.log(monitor.getClientOffset());
      // console.log(monitor.getInitialClientOffset());
      // console.log(monitor.getItem());
      // console.log(monitor.getSourceClientOffset());
      console.log("did drop?", monitor.didDrop());

      let temp = ref.current?.getBoundingClientRect();
      console.log(" ----> ", id, temp);

      const dropboxPos: Position = {
        x: temp?.x ?? 0,
        y: temp?.y ?? 0,
        id,
      };
      const offset: Position | null = monitor.getDifferenceFromInitialOffset();
      const startDrag: Position | null = monitor.getInitialClientOffset();
      // const offsetX: number = position?.x + (offset?.x ?? 0);
      // const offsetY: number = position?.y + (offset?.y ?? 0);
      // const newPos: Position = { x: offsetX, y: offsetY };

      if (monitor.didDrop() === true && id === "board") return;

      // moveItem(offset, startDrag, dropboxPos);

      return { offset, startDrag, dropboxPos };
    },
    collect: (monitor: any) => {
      return {
        handlerId: monitor.getHandlerId(),
        isOverCurrent: monitor.isOver({ shallow: true }),
      };
    },
    // hover: (item: { id: number; type: string }, monitor: DropTargetMonitor) => {
    //   console.log(monitor.getClientOffset());
    //   console.log(monitor.getDropResult());
    //   console.log(monitor.isOver({ shallow: true }));
    // },
  });

  drop(ref);
  console.log(ref.current?.getBoundingClientRect());

  return (
    <section
      className={`${className} ${isOverCurrent ? `${className}--hover` : ""}`}
      ref={ref}
      style={{ top: position.y, left: position.x }}
    >
      {children}
    </section>
  );
};

export default Dropbox;
