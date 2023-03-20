// Executed every time the user moves the mouse
import { isEmpty } from 'underscore';

export function isUserInsideEditingZone (e) {
  const { isEditing, newCircleInfo } = this.state;

  if (isEmpty(newCircleInfo) && isEditing && this.mapRef.current) {
    const mapPosition = this.mapRef.current.getBoundingClientRect();
    const mousePositionX = e.clientX;
    const mousePositionY = e.clientY;

    this.setState({
      isInsideEditingZone: (
        mapPosition.left <= mousePositionX && mapPosition.right > mousePositionX &&
        mapPosition.top <= mousePositionY && mapPosition.bottom > mousePositionY
      )
    });
  }
}
