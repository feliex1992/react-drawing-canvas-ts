import React from 'react';
import { Text as TextKonva, Transformer } from 'react-konva'
import { toolType } from '../helper/constant';

interface IText {
  shapeProps: any;
  onSelect: any;
  tool: any;
  isSelected: boolean;
  onChange: any;
  layerRef: React.MutableRefObject<any>;
  stageRef: React.MutableRefObject<any>;
}

const Text = (props: IText) => {
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
      <TextKonva
        ref={shapeRef}
        onClick={props.onSelect}
        {...props.shapeProps}ß
        draggable={props.tool === toolType.SELECT}
        onTransformEnd={() => {}}
        onDblClick={(e:any) => {
          shapeRef.current.hide();
          props.layerRef.current.draw();

          let textPosition = shapeRef.current.absolutePosition();
          let stageBox = props.stageRef.current.container().getBoundingClientRect();
          let areaPosition = {
            x: stageBox.left + textPosition.x,
            y: stageBox.top + textPosition.y,
          };

          let textArea = document.createElement("textarea");
          document.body.appendChild(textArea);

          textArea.value = shapeRef.current.text();
          textArea.style.position = "absolute";
          textArea.style.top = areaPosition.y + "px";
          textArea.style.left = areaPosition.x + "px";
          textArea.style.width = shapeRef.current.width() - shapeRef.current.padding() * 2 + "px";
          textArea.style.height = shapeRef.current.height() - shapeRef.current.padding() * 2 + 5 + "px";
          textArea.style.fontSize = shapeRef.current.fontSize() + "px";
          textArea.style.border = "none";
          textArea.style.padding = "0px";
          textArea.style.margin = "0px";
          textArea.style.overflow = "hidden";
          textArea.style.background = "none";
          textArea.style.outline = "none";
          textArea.style.resize = "none";
          textArea.style.lineHeight = shapeRef.current.lineHeight();
          textArea.style.fontFamily = shapeRef.current.fontFamily();
          textArea.style.transformOrigin = "left top";
          textArea.style.textAlign = shapeRef.current.align();
          textArea.style.color = shapeRef.current.fill();

          let rotation = shapeRef.current.rotation();
          let transform = "";
          if (rotation) {
            transform += "rotateZ(" + rotation + "deg)";
          }
          let px = 0;
          let isFirefox = navigator.userAgent.toLowerCase().indexOf("firefox") > -1;
          if (isFirefox) {
            px += 2 + Math.round(shapeRef.current.fontSize() / 20);
          }
          transform += "translateY(-" + px + "px)"; 
          textArea.style.transform = transform;
          textArea.style.height = "auto";
          textArea.style.height = textArea.scrollHeight + 3 + "px";
          textArea.focus();

          function removeTextarea() {
            textArea.parentElement?.removeChild(textArea);
            window.removeEventListener("click", handleOutsideClick);
            shapeRef.current.show();
            props.layerRef.current.draw();
          }
          function setTextareaWidth(newWidth:any) {
            if (!newWidth) {
              // set width for placeholder
              newWidth = shapeRef.current.placeholder.length * shapeRef.current.fontSize();
            }
            // some extra fixes on different browsers
            let isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
            let isFirefox = navigator.userAgent.toLowerCase().indexOf("firefox") > -1;
            if (isSafari || isFirefox) {
              newWidth = Math.ceil(newWidth);
            }
            textArea.style.width = newWidth + "px";
          }
          textArea.addEventListener("keydown", function(e) {
            // hide on enter
            // but don't hide on shift + enter
            if (e.keyCode === 13 && !e.shiftKey) {
              shapeRef.current.text(textArea.value);
              removeTextarea();
            }
            // on esc do not set value back to node
            if (e.keyCode === 27) {
              removeTextarea();
            }
          });
          textArea.addEventListener("keydown", function(e) {
            let scale = shapeRef.current.getAbsoluteScale().x;
            setTextareaWidth(shapeRef.current.width() * scale);
            textArea.style.height = "auto";
            textArea.style.height = textArea.scrollHeight + shapeRef.current.fontSize() + "px";
          });
          function handleOutsideClick(e:any) {
            if (e.target !== textArea) {
              removeTextarea();
            }
          }
          setTimeout(() => {
            window.addEventListener("click", handleOutsideClick);
          });
        }}
      />
      {props.isSelected && <Transformer ref={trRef} />}
    </React.Fragment>
  );
}

export default Text;