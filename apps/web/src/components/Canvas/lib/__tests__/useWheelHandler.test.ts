import { renderHook } from '@testing-library/react';
import Konva from 'konva';
import useWheelHandler from '../useWheelHandler';

describe('useWheelHandler', () => {
  const stageRef = { current: new Konva.Stage({ container: document.createElement('div') }) };

  const setup = () => {
    return renderHook(() => useWheelHandler(stageRef));
  };

  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(console, 'warn').mockImplementation((message) => {
      if (message.includes('Pointer position is missing')) {
        return;
      }
      console.warn(message);
    });
  });

  it('should return a function', () => {
    const { result } = setup();
    expect(typeof result.current).toBe('function');
  });

  it('should prevent default wheel event behavior', () => {
    const { result } = setup();
    const mockEvent = {
      evt: {
        preventDefault: jest.fn(),
        deltaY: 1,
      },
      currentTarget: stageRef.current,
    } as unknown as Konva.KonvaEventObject<WheelEvent>;

    result.current(mockEvent);
    expect(mockEvent.evt.preventDefault).toHaveBeenCalled();
  });

  it.todo('should call handleZoom with the correct parameters when zooming in');

  it.todo('should call handleZoom with the correct parameters when zooming out');

  it('should not call handleZoom if stage or pointer is not available', () => {
    const { result } = setup();
    const mockEvent = {
      evt: {
        preventDefault: jest.fn(),
        deltaY: 1,
      },
      currentTarget: null,
    } as unknown as Konva.KonvaEventObject<WheelEvent>;

    const handleZoom = jest.fn();
    jest.spyOn(require('../useZoomHandlers'), 'useZoom').mockReturnValue(handleZoom);

    result.current(mockEvent);
    expect(handleZoom).not.toHaveBeenCalled();
  });
});
