import { Stage, Layer } from 'react-konva';
import React, { useState, useRef } from 'react';
import { toolType } from '../helper/constant';
import Image from './Image';
import { v1 as uuidv1} from 'uuid';
import Rectangle from './Rectangle';
import ToolBar from './ToolBar';
import Line from './Line';
import Triangle from './Triangle';
import Circle from './Circle';
import Text from './Text';

const Home = () => {
  const [tool, setTool] = useState<string>('pen');
  const [color, setColor] = useState<string>('#e66465')

  const [lines, setLines] = useState<any>([]);
  const [rects, setRects] = useState<any>([]);
  const [polygons, setPolygons] = useState<any>([]);
  const [circles, setCircles] = useState<any>([]);
  const [texts, setTexts] = useState<any>([]);
  const [images, setImages] = useState<any>([]);
  
  const [shapes, setShapes] = useState<any>([]);
  const [selectedId, selectShape] = useState<any>(null);

  const [, updateState] = useState<any>();
  const isDrawing = useRef(false);
  const fileUploadEl = useRef<any>(null);
  const stageEl = useRef<any>(null);
  const layerEl = useRef<any>(null);

  const forceUpdate = React.useCallback(() => updateState({}), []);
  const fileChange = (ev:any) => {
    let file = ev.target.files[0];
    let reader = new FileReader();
    reader.addEventListener(
      'load',
      () => {
        const id = uuidv1();
        images.push({
          content: reader.result,
          id,
        });
        setImages(images);
        fileUploadEl.current.value = null;
        setShapes(shapes.concat([id]));
        forceUpdate();
      },
      false
    );
    if (file) {
      reader.readAsDataURL(file);
    }
  };

  const handleMouseDown = (e:any) => {
    isDrawing.current = true;
    const pos = e.target.getStage().getPointerPosition();
    const id = uuidv1();
    switch (tool) {
      case toolType.SQUARE:
      case toolType.RECTANGLE:
        setRects([...rects, { id: id, x: pos.x, y: pos.y, width: 0, height: 0, color: color }]);
        setShapes(shapes.concat([id]));
        break;
      case toolType.TRIANGLE:
        setPolygons([...polygons, {id: id, x: pos.x, y: pos.y, rad: 0, color: color }]);
        setShapes(shapes.concat([id]));
        break;
      case toolType.CIRCLE:
        setCircles([...circles, {id: id, x: pos.x, y: pos.y, rad: 0, color: color }]);
        setShapes(shapes.concat([id]));
        break;
      case toolType.LINE:
        setLines([...lines, { id: id, points: [pos.x, pos.y, pos.x, pos.y], color: color }]);
        setShapes(shapes.concat([id]));
        break;
      case toolType.TEXT:
        if (e.target.className !== "Text") {
          setTexts([...texts, {id: id, x: pos.x, y: pos.y, text: "Double click to edit.", color: color }]);
          setShapes(shapes.concat([id]));
        }
        break;
      case toolType.PEN:
        setLines([...lines, {id: id, tool, points: [pos.x, pos.y], color: color }]);
        setShapes(shapes.concat([id]));
        break;
    }
  };
    
  const handleMouseMove = (e:any) => {
    if (!isDrawing.current) {
      return;
    }
    const stage = e.target.getStage();
    const point = stage.getPointerPosition();

    switch (tool) {
      case toolType.SQUARE:
        let lastSquare: any = rects[rects.length -1];

        if (lastSquare) {
          let varX = point.x - lastSquare.x;
          let varY = point.y - lastSquare.y;
          let squareHeight = varX > varY ? varX : varY;
          lastSquare.width = squareHeight;
          lastSquare.height = squareHeight;

          rects.splice(rects.length - 1, 1, lastSquare);
          setRects(rects.concat());
        }
        break;
      case toolType.RECTANGLE:
        let lastRect: any = rects[rects.length -1];

        if (lastRect) {
          lastRect.width = point.x - lastRect.x;
          lastRect.height = point.y - lastRect.y;

          rects.splice(rects.length - 1, 1, lastRect);
          setRects(rects.concat());
        }
        break;
      case toolType.TRIANGLE:
        let lastTriangle: any = polygons[polygons.length - 1];

        if (lastTriangle) {
          let varX = point.x - lastTriangle.x;
          let varY = point.y - lastTriangle.y;
          let rad = varX > varY ? varX : varY;
          lastTriangle.rad = rad;

          polygons.splice(polygons.length - 1, 1, lastTriangle);
          setPolygons(polygons.concat());
        }
        break;
      case toolType.CIRCLE:
        let lastCircle: any = circles[circles.length - 1];

        if (lastCircle) {
          let varX = point.x - lastCircle.x;
          let varY = point.y - lastCircle.y;
          let rad = varX > varY ? varX : varY;
          lastCircle.rad = rad;

          circles.splice(circles.length - 1, 1, lastCircle);
          setCircles(circles.concat());
        }
        break;
      case toolType.LINE:
        let lastLine2: any = lines[lines.length - 1];
        
        if(lastLine2) {
          lastLine2.points[2] = point.x;
          lastLine2.points[3] = point.y;
              
          lines.splice(lines.length - 1, 1, lastLine2);
          setLines(lines.concat());
        }
        break;
      case toolType.PEN:
        let lastLine: any = lines[lines.length - 1];
        
        if(lastLine) {
          lastLine.points = lastLine.points.concat([point.x, point.y]);
              
          lines.splice(lines.length - 1, 1, lastLine);
          setLines(lines.concat());
        }
    }
  };
    
  const handleMouseUp = () => {
    isDrawing.current = false;
  };

  document.addEventListener("keydown", (event:any) => {
    if (event.code === "Delete") {
      if (!selectedId) return;

      deleteEvent(selectedId);
    }
  })

  const deleteEvent = (deleteId:string) => {
    let index = lines.findIndex((line:any) => line.id === deleteId);
    if (index !== -1) {
      lines.splice(index, 1);
      setLines(lines);
      selectShape(null);
      forceUpdate();
      return
    }

    index = rects.findIndex((rec:any) => rec.id === deleteId);
    if (index !== -1) {
      rects.splice(index, 1);
      setRects(rects);
      selectShape(null);
      forceUpdate();
      return
    }

    index = polygons.findIndex((polygon:any) => polygon.id === deleteId);
    if (index !== -1) {
      polygons.splice(index, 1);
      setPolygons(polygons);
      selectShape(null);
      forceUpdate();
      return
    }

    index = circles.findIndex((circle:any) => circle.id === deleteId);
    if (index !== -1) {
      circles.splice(index, 1);
      setCircles(circles);
      selectShape(null);
      forceUpdate();
      return
    }

    index = texts.findIndex((text:any) => text.id === deleteId);
    if (index !== -1) {
      texts.splice(index, 1);
      setTexts(texts);
      selectShape(null);
      forceUpdate();
      return
    }

    index = images.findIndex((image:any) => image.id === deleteId);
    if (index !== -1) {
      images.splice(index, 1);
      setImages(images);
      selectShape(null);
      forceUpdate();
      return
    }
  }

  return (
    <div className=" text-center text-dark">
      <ToolBar
        onChange={(value:any) => {
          selectShape(null);
          setTool(value);
          if (value === toolType.TEXT) {

          }
        }}
        uploadImage={() => fileUploadEl.current.click()}
        onColorChange={(color:any) => setColor(color.hex)}
        color={color}
      />
      <input
        style={{ display: "none" }}
        type="file"
        ref={fileUploadEl}
        onChange={fileChange}
      />
      <Stage
        width={window.innerWidth}
        height={window.innerHeight}
        onMouseDown={handleMouseDown}
        onMousemove={handleMouseMove}
        onMouseup={handleMouseUp}
        className="canvas-stage"
        ref={stageEl}
      >
        <Layer ref={layerEl}>
          <Line
            shapeProps={{
              points: [0, 0]
            }}
            onSelect={() => {}}
            tool={tool}
            isSelected={false}
            onChange={() => {}}
          />
          {images.map((image:any, i:number) => {
            return (
              <Image
                key={i}
                imageUrl={image.content}
                onSelect={() => {
                  if (tool === toolType.SELECT) selectShape(image.id);
                  if (tool === toolType.REMOVE) {
                    deleteEvent(image.id);
                  }
                }}
                tool={tool}
                isSelected={image.id === selectedId}
                onChange={(newAttrs:any) => {
                  const sliceImages = images.slice();
                  sliceImages[i] = newAttrs;
                  setImages(sliceImages);
                }}
              />
            );
          })}
          {lines.map((line:any, i:number) => (
            <Line
              key={i}
              shapeProps={{
                points: line.points,
                stroke: line.color,
                strokeWidth: 5,
                tension: 0.5,
                lineCap: "round"
              }}
              onSelect={() => {
                if (tool === toolType.SELECT) selectShape(line.id);
                if (tool === toolType.REMOVE) {
                  deleteEvent(line.id);
                }
              }}
              tool={tool}
              isSelected={line.id === selectedId}
              onChange={(newAttrs:any) => {
                const sliceLines = lines.slice();
                sliceLines[i] = newAttrs;
                setLines(sliceLines);
              }}
            />
          ))}
          {rects.map((rect:any, i:number) => {
            return (
              <Rectangle 
                key={i}
                shapeProps={{
                  x: rect.x,
                  y: rect.y,
                  width: rect.width,
                  height: rect.height,
                  stroke: rect.color,
                  strokeWidth: 5,
                  lineCap: "round"
                }}
                onSelect={() => {
                  if (tool === toolType.SELECT) selectShape(rect.id);
                  if (tool === toolType.REMOVE) {
                    deleteEvent(rect.id);
                  }
                }}
                tool={tool}
                isSelected={rect.id === selectedId}
                onChange={(newAttrs:any) => {
                  const sliceRects = rects.slice();
                  sliceRects[i] = newAttrs;
                  setRects(sliceRects);
                }}
              />
            )
          })}
          {polygons.map((polygon:any, i:number) => (
            <Triangle
              key={i}
              shapeProps={{
                x: polygon.x,
                y: polygon.y,
                sides: 3,
                radius: polygon.rad,
                stroke: polygon.color,
                strokeWidth: 5
              }}
              onSelect={() => {
                if (tool === toolType.SELECT) selectShape(polygon.id);
                if (tool === toolType.REMOVE) {
                  deleteEvent(polygon.id);
                }
              }}
              tool={tool}
              isSelected={polygon.id === selectedId}
              onChange={(newAttrs:any) => {
                const slicePolygons = polygons.slice();
                slicePolygons[i] = newAttrs;
                setPolygons(slicePolygons);
              }}
            />
          ))}
          {circles.map((circle:any, i:number) => (
            <Circle
              key={i}
              shapeProps={{
                x: circle.x,
                y: circle.y,
                radius: circle.rad,
                stroke: circle.color,
                strokeWidth: 5
              }}
              onSelect={() => {
                if (tool === toolType.SELECT) selectShape(circle.id);
                if (tool === toolType.REMOVE) {
                  deleteEvent(circle.id);
                }
              }}
              tool={tool}
              isSelected={circle.id === selectedId}
              onChange={(newAttrs:any) => {
                const sliceCircles = circles.slice();
                sliceCircles[i] = newAttrs;
                setCircles(sliceCircles);
              }}
            />
          ))}
          {texts.map((text:any, i:number) => (
            <Text
              key={i}
              shapeProps={{
                x: text.x, 
                y: text.y,
                text: text.text,
                fontSize: 20,
                fill: text.color,
              }}
              onSelect={() => {
                if (tool === toolType.SELECT) selectShape(text.id);
                if (tool === toolType.REMOVE) {
                  deleteEvent(text.id);
                }
              }}
              tool={tool}
              isSelected={text.id === selectedId}
              onChange={(newAttrs:any) => {
                const sliceTexts = texts.slice();
                sliceTexts[i] = newAttrs;
                setTexts(sliceTexts);
              }}
              layerRef={layerEl}
              stageRef={stageEl}
            />
          ))}
        </Layer>
      </Stage>
    </div>
  )
}

export default Home;
