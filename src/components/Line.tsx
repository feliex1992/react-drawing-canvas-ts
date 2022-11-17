import React from 'react';
import { Line as LineKonva, Transformer } from 'react-konva'
import { toolType } from '../helper/constant';

interface ILine {
  shapeProps: any;
  onSelect: any;
  tool: any;
  isSelected: boolean;
  onChange: any;
}

const Line = (props: ILine) => {
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
      <LineKonva
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

export default Line;