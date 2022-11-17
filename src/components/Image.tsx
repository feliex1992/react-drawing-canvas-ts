import React from 'react';
import { Image, Transformer } from 'react-konva';
import useImage from 'use-image';
import { toolType } from '../helper/constant';

interface IImg {
  imageUrl: any
  onSelect: any;
  tool: any;
  isSelected: boolean;
  onChange: any;
}

const Img = (props: IImg) => {
  const [image] = useImage(props.imageUrl);
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
      <Image
        image={image}
        ref={shapeRef}
        onClick={props.onSelect}
        draggable={props.tool === toolType.SELECT}
        onTransformEnd={e => {}}
      />
      {props.isSelected && <Transformer ref={trRef} />}
    </React.Fragment>
  )
}

export default Img;