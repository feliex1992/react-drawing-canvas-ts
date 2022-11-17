import React from 'react';
import { Circle as CircleKonva, Transformer } from 'react-konva';
import { toolType } from '../helper/constant';

interface ICircle {
  shapeProps: any;
  onSelect: any;
  tool: any;
  isSelected: boolean;
  onChange: any;
}

const Circle = (props: ICircle) => {
  const shapeRef = React.useRef<any>();
  const trRef = React.useRef<any>();

  React.useEffect(() => {
    if (props.isSelected) {
      trRef.current.setNode(shapeRef.current);
      trRef.current.getLayer().batchDraw();
    }
  }, [props.isSelected])

  return (
    <React.Fragment>
      <CircleKonva
        ref={shapeRef}
        onClick={props.onSelect}
        {...props.shapeProps}
        draggable={props.tool === toolType.SELECT}
        onTransformEnd={e => {}}
      />
      {props.isSelected && <Transformer ref={trRef} />}
    </React.Fragment>
  );
}

export default Circle;