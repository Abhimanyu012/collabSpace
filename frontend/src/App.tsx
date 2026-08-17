import { useRef, useState } from "react";

type TextElement = {
  id: string;
  type: "text";
  content: string;
  x: number;
  y: number;
};

function App() {
  const [elements, setElements] = useState<TextElement[]>([
    {
      id: "text-1",
      type: "text",
      content: "Hello World",
      x: 100,
      y: 100,
    },
    {
      id: "text-2",
      type: "text",
      content: "Hello bro",
      x: 100,
      y: 200,
    },
  ]);

  const [draggingId, setDraggingId] = useState<string | null>(null);

  const canvasRef = useRef<HTMLDivElement>(null);

  const dragOffset = useRef({
    x: 0,
    y: 0,
  });

  const addText = () => {
    const newElement: TextElement = {
      id: `text-${elements.length + 1}`,
      type: "text",
      content: "New Text",
      x: 100,
      y: 100 + elements.length * 100,
    };

    setElements([...elements, newElement]);
  };

  const onMouseDown = (event: React.MouseEvent, element: TextElement) => {
    const rect = canvasRef.current?.getBoundingClientRect();

    if (!rect) return;

    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;

    dragOffset.current = {
      x: mouseX - element.x,
      y: mouseY - element.y,
    };

    setDraggingId(element.id);
  };

  const onMouseMove = (event: React.MouseEvent) => {
    if (!draggingId) return;

    const rect = canvasRef.current?.getBoundingClientRect();

    if (!rect) return;

    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;

    const newX = mouseX - dragOffset.current.x;
    const newY = mouseY - dragOffset.current.y;

    setElements((currentElements) =>
      currentElements.map((element) =>
        element.id === draggingId
          ? {
              ...element,
              x: newX,
              y: newY,
            }
          : element,
      ),
    );
  };

  const onMouseUp = () => {
    setDraggingId(null);
  };

  return (
    <div>
      <h1>CollabSpace</h1>

      <button onClick={addText}>Add Text</button>

      <div
        ref={canvasRef}
        onMouseMove={onMouseMove}
        onMouseUp={onMouseUp}
        style={{
          position: "relative",
          width: "800px",
          height: "600px",
          border: "1px solid black",
          overflow: "auto",
        }}
      >
        {elements.map((element) => (
          <div
            key={element.id}
            onMouseDown={(event) => onMouseDown(event, element)}
            style={{
              position: "absolute",
              left: element.x,
              top: element.y,
              cursor: draggingId === element.id ? "grabbing" : "grab",
              userSelect: "none",
            }}
          >
            {element.content}
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
