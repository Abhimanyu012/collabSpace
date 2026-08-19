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
    { id: "text-1", type: "text", content: "Hello World", x: 100, y: 100 },
    { id: "text-2", type: "text", content: "Hello bro", x: 100, y: 200 },
  ]);

  const [draggingId, setDraggingId] = useState<string | null>(null);
  const canvasRef = useRef<HTMLDivElement>(null);
  
  // dragOffset को याद रखने के लिए useRef बिल्कुल सही है
  const dragOffset = useRef({ x: 0, y: 0 });

  const addText = () => {
    const newElement: TextElement = {
      id: `text-${Date.now()}`, // elements.length से बेहतर है Date.now() ताकि ID हमेशा यूनिक रहे
      type: "text",
      content: "New Text",
      x: 200,
      y: 100 + elements.length * 50,
    };
    setElements([...elements, newElement]);
  };

  const onMouseDown = (event: React.MouseEvent, element: TextElement) => {
    // ब्राउज़र के डिफ़ॉल्ट ड्रैग/सिलेक्ट बिहेवियर को रोकने के लिए
    event.preventDefault(); 

      event.stopPropagation()
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;

    // माउस की पोजीशन कैनवास के अंदर
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;

    // एलिमेंट के कोने से माउस की दूरी (Offset)
    dragOffset.current = {
      x: mouseX -element.x,
      y: mouseY -element.y
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
          ? { ...element, x: newX, y: newY }
          : element
      )
    );
  };

  const onMouseUp = () => {
    setDraggingId(null);
  };

  return (
    <div style={{ padding: "20px", fontFamily: "sans-serif" }}>
      <h1>CollabSpace</h1>
      <button 
        onClick={addText}
        style={{ padding: "8px 16px", marginBottom: "10px", cursor: "pointer" }}
      >
        Add Text
      </button>

      <div
        ref={canvasRef}
        onMouseMove={onMouseMove}
        onMouseUp={onMouseUp}
        onMouseLeave={onMouseUp} // Leave होने पर भी हम ड्रैग बंद कर देते हैं
        style={{
          position: "relative",
          width: "800px",
          height: "600px",
          border: "2px dashed #ccc",
          backgroundColor: "#f9f9f9",
          overflow: "hidden", // auto से ड्रैग करते वक्त स्क्रॉल बार्स आ सकते हैं, hidden बेहतर है
        }}
      >
        {elements.map((element) => (
          <div
            key={element.id}
            onMouseDown={(event) => onMouseDown(event, element)}
            style={{
              position: "absolute",
              left: `${element.x}px`, // 'px' लगाना अच्छी प्रैक्टिस है
              top: `${element.y}px`,
              cursor: draggingId === element.id ? "grabbing" : "grab",
              userSelect: "none",
              padding: "4px 8px",
              backgroundColor: "white",
              border: "1px solid #ddd",
              borderRadius: "4px",
              // boxShadow: draggingId === element.id ? "0 4px 8px rgba(0,0,0,0.15)" : "none"
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
