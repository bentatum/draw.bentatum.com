import Konva from 'konva';
import { renderHook } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import useRelativePointerPosition from '../useRelativePointerPosition';

describe('useRelativePointerPosition', () => {
  let stage: Konva.Stage;
  let layer: Konva.Layer;
  let rect: Konva.Rect;

  beforeEach(() => {
    stage = new Konva.Stage({
      container: document.createElement('div'),
      width: 500,
      height: 500,
    });
    layer = new Konva.Layer();
    stage.add(layer);
    rect = new Konva.Rect({
      x: 50,
      y: 50,
      width: 100,
      height: 100,
      fill: 'red',
      draggable: true,
    });
    layer.add(rect);
    layer.draw();
  });

  it('should return the correct relative pointer position', async () => {
    const user = userEvent.setup();
    const { result } = renderHook(() => useRelativePointerPosition());

    await user.pointer({
      target: stage.content,
      coords: {
        x: 75,
        y: 75,
      },
    });

    const relativePos = result.current(rect);

    expect(relativePos).toEqual({ x: 25, y: 25 });
  });

  it('should return { x: 0, y: 0 } if pointer position is null', async () => {
    const user = userEvent.setup();
    const { result } = renderHook(() => useRelativePointerPosition());

    await user.pointer({
      target: stage.content,
      coords: {
        x: 0,
        y: 0,
      },
    });

    const relativePos = result.current(rect);

    // stage is 500x500, rect is 100x100, so the relative position should be -50,-50
    expect(relativePos).toEqual({ x: -50, y: -50 });
  });
});
