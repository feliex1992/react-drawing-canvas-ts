import React from 'react';
import { Button, Container, DropdownButton, Navbar, ToggleButton, ToggleButtonGroup } from 'react-bootstrap';
import { toolType } from '../helper/constant';
import ColorPicker from 'react-pick-color';

interface IToolBar {
  onChange: any;
  uploadImage: any;
  onColorChange: any;
  color: any
}

const ToolBar = (props: IToolBar) => {
  return (
    <Navbar expand="lg" variant="light" bg="light">
        <Container>
          <ToggleButtonGroup
            type="radio"
            name="options"
            defaultValue={toolType.PEN}
            onChange={props.onChange}
          >
            <DropdownButton as={ToggleButtonGroup} title="Color" id="bg-nested-dropdown" variant='outline-secondary'>
              <ColorPicker color={props.color} onChange={props.onColorChange} />
            </DropdownButton>
            <ToggleButton id="tbg-radio-0" value={toolType.SELECT} variant='outline-secondary'>
              <img src="/cursor.png" style={{ height: 20, alignItems: 'center' }} alt="Cursor icon."/>
            </ToggleButton>
            <ToggleButton id="tbg-radio-1" value={toolType.PEN} variant='outline-secondary'>
              <img src="/pencil.png" style={{ height: 20, alignItems: 'center' }} alt="Pencil icon." />
            </ToggleButton>
            <ToggleButton id="tbg-radio-2" value={toolType.LINE} variant='outline-secondary'>
              <img src="/remove.png" style={{ height: 20, alignItems: 'center' }} alt="Remove icon." />
            </ToggleButton>
            <ToggleButton id="tbg-radio-3" value={toolType.RECTANGLE} variant='outline-secondary'>
              <img src="/rectangle.png" style={{ height: 20, alignItems: 'center' }} alt="Rectangle icon." />
            </ToggleButton>
            <ToggleButton id="tbg-radio-4" value={toolType.SQUARE} variant='outline-secondary'>
              <img src="/square.png" style={{ height: 20, alignItems: 'center' }} alt="Square icon." />
            </ToggleButton>
            <ToggleButton id="tbg-radio-5" value={toolType.CIRCLE} variant='outline-secondary'>
              <img src="/dry-clean.png" style={{ height: 20, alignItems: 'center' }} alt="Circle icon." />
            </ToggleButton>
            <ToggleButton id="tbg-radio-6" value={toolType.TRIANGLE} variant='outline-secondary'>
              <img src="/triangle.png" style={{ height: 20, alignItems: 'center' }} alt="Triangle icon." />
            </ToggleButton>
            <ToggleButton id="tbg-radio-7" value={toolType.TEXT} variant='outline-secondary'>
              <img src="/t.png" style={{ height: 20, alignItems: 'center' }} alt="Text icon." />
            </ToggleButton>
            <ToggleButton id="tbg-radio-8" value={toolType.REMOVE} variant='outline-secondary'>
              <img src="/delete.png" style={{ height: 20, alignItems: 'center' }} alt="Remove icon." />
            </ToggleButton>
            <Button variant='outline-secondary' onClick={props.uploadImage}>
              <img src="/upload.png" style={{ height: 27, alignItems: 'center' }} alt="Upload icon." />
            </Button>
          </ToggleButtonGroup>
        </Container>
      </Navbar>
  )
}

export default ToolBar;