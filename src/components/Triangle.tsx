import React from 'react';
import { RegularPolygon, Transformer } from 'react-konva';
import { toolType } from '../helper/constant';

interface ITriangle {
  shapeProps: any;
  onSelect: any;
  tool: any;
  isSelected: boolean;
  onChange: any;
}

const Triangle = (props: ITriangle) => {
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
      <RegularPolygon
        ref={shapeRef}
        onClick={props.onSelect}
        sides={3}
        {...props.shapeProps}
        draggable={props.tool === toolType.SELECT}
        onTransformEnd={e => {}}
      />
      {props.isSelected && <Transformer ref={trRef} />}
    </React.Fragment>
  );
}

export default Triangle;