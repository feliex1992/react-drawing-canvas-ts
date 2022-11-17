import React, { Fragment, useEffect, useRef } from 'react';
import { Rect, Transformer } from 'react-konva';
import { toolType } from '../helper/constant';

interface IRectangle {
  shapeProps: any;
  onSelect: any;
  tool: any;
  isSelected: boolean;
  onChange: any;
}

const Rectangle = (props: IRectangle) => {
  const shapeRef = useRef<any>();
  const trRef = useRef<any>();

  useEffect(() => {
    if (props.isSelected) {
      trRef.current.setNode(shapeRef.current);
      trRef.current.getLayer().batchDraw();
    }
  }, [props.isSelected])

  return (
    <Fragment>
      <Rect
        ref={shapeRef}
        onClick={props.onSelect}
        {...props.shapeProps}
        draggable={props.tool === toolType.SELECT}
        onTransformEnd={e => {
          const node = shapeRef.current;
          const scaleX = node.scaleX();
          const scaleY = node.scaleY();
          node.scaleX(1);
          node.scaleY(1);
          props.onChange({
            ...props.shapeProps,
            x: node.x(),
            y: node.y(),
            width: node.width() * scaleX,
            height: node.height() * scaleY,
          });
        }}
      />
      {props.isSelected && <Transformer ref={trRef} />}
    </Fragment>
  )
}

export default Rectangle;