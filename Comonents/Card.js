import React, { useRef } from "react";
import { useDrag, useDrop } from "react-dnd";

const Card = ({ name, desc, moveCard, index, id, styles }) => {
  const ref = useRef(null);
  const [{ handlerId }, drop] = useDrop({
    accept: "ItemTypes.CARD",
    collect(monitor) {
      return {
        handlerId: monitor.getHandlerId(),
      };
    },
    hover(item) {
      if (!ref.current) {
        return;
      }

      const dragIndex = item.index;
      const hoverIndex = index;
      console.log(dragIndex, "drag");
      console.log(hoverIndex, "hover");
      // Don't replace items with themselves
      if (dragIndex === hoverIndex) {
        return;
      }

      moveCard(dragIndex, hoverIndex);

      item.index = hoverIndex;
    },
  });
  const [{ isDragging }, drag] = useDrag({
    type: "ItemTypes.CARD",
    item: () => {
      return { id, index };
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });
  const opacity = isDragging ? 0 : 1;
  drag(drop(ref));
  return (
    <div
      className={styles.card}
      ref={ref}
      style={{ opacity }}
      data-handler-id={handlerId}
    >
      <div>
        <h2>{name} &rarr;</h2>
        <p>{desc}</p>
      </div>
    </div>
  );
};

export default Card;
