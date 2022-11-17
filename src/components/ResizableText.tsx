import React, { useRef, useEffect } from "react";
import { Text, Transformer } from "react-konva";

interface IResizableText {
  x: any;
  y: any;
  text: any;
  isSelected: any;
  width: any;
  onResize: any;
  onClick: any;
  onDoubleClick: any;
}

export function ResizableText(props: IResizableText) {
  const textRef = useRef<any>(null);
  const transformerRef = useRef<any>(null);

  useEffect(() => {
    if (props.isSelected && transformerRef.current !== null) {
      transformerRef.current.nodes([textRef.current]);
      transformerRef.current.getLayer().batchDraw();
    }
  }, [props.isSelected]);

  function handleResize() {
    if (textRef.current !== null) {
      const textNode = textRef.current;
      const newWidth = textNode.width() * textNode.scaleX();
      const newHeight = textNode.height() * textNode.scaleY();
      textNode.setAttrs({
        width: newWidth,
        scaleX: 1
      });
      props.onResize(newWidth, newHeight);
    }
  }

  const transformer = props.isSelected ? (
    <Transformer
      ref={transformerRef}
      rotateEnabled={false}
      flipEnabled={false}
      enabledAnchors={["middle-left", "middle-right"]}
      boundBoxFunc={(oldBox, newBox) => {
        newBox.width = Math.max(30, newBox.width);
        return newBox;
      }}
    />
  ) : null;

  return (
    <>
      <Text
        x={props.x}
        y={props.y}
        ref={textRef}
        text={props.text}
        fill="black"
        fontFamily="sans-serif"
        fontSize={24}
        perfectDrawEnabled={false}
        onTransform={handleResize}
        onClick={props.onClick}
        onTap={props.onClick}
        onDblClick={props.onDoubleClick}
        onDblTap={props.onDoubleClick}
        width={props.width}
      />
      {transformer}
    </>
  );
}
