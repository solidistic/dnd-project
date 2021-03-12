import React, { useEffect, useRef, useState } from "react";
import {
  useDrag,
  useDrop,
  DropTargetMonitor,
  ConnectableElement,
} from "react-dnd";
import { Position } from "./Board";

export interface DraggableProps {
  className: string;
  id: number;
  positionIndex: number;
  text: string;
  handleDrop: (draggableId: number, targetId: string) => void;
  position?: Position | null;
}

const Draggable: React.FC<DraggableProps> = ({
  className = "",
  id,
  positionIndex,
  text,
  handleDrop,
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState<Position>({ x: 0, y: 0 });
  const [originalPos, setOriginalPos] = useState<Position>({
    x: 150 * id,
    y: 0,
  });
  const [transition, setTransition] = useState<number>(0);
  const [{ isDragging }, drag] = useDrag({
    item: { type: "box", id },
    collect: (monitor: any) => {
      return {
        isDragging: monitor.isDragging(),
      };
    },
    end: (item, monitor) => {
      console.log(monitor.getClientOffset());
      console.log(monitor.getDifferenceFromInitialOffset());
      console.log(monitor.getTargetIds());
      console.log(monitor.getDropResult());

      const { offset, dropboxPos } = monitor.getDropResult();
      console.log(offset, dropboxPos);

      const xPos: number =
        dropboxPos?.id === "small" ? dropboxPos.x : pos?.x + (offset?.x ?? 0);
      const yPos: number =
        dropboxPos?.id === "small" ? dropboxPos.y : pos?.y + (offset?.y ?? 0);
      const newPos: Position = {
        x: xPos,
        y: yPos,
      };

      setTransition(0);
      setPos(newPos);

      if (dropboxPos.id !== "board") {
        handleDrop(id, dropboxPos.id);
        setOriginalPos({ ...dropboxPos });
      }
    },
  });

  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout>;

    timeout = setTimeout(() => {
      setTransition(400);
      setPos({ ...originalPos });
    }, 200);

    return () => clearTimeout(timeout);
  }, [originalPos]);

  useEffect(() => {
    const offsetY = ((ref.current?.offsetHeight ?? 0) + 10) * positionIndex;
    console.log(id, positionIndex, offsetY);
    setPos((state) => ({ ...state, y: state.y + offsetY }));
  }, [positionIndex, id]);

  drag(ref);

  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: isDragging ? 0 : 1,
        left: pos.x,
        top: pos.y,
        transition: `all ${transition}ms ease-in-out`,
      }}
    >
      {text}
    </div>
  );
};

export default Draggable;
