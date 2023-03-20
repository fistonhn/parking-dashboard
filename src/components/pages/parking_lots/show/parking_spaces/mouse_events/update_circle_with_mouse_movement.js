// TODO: Delete this file
// Executed every time the user moves the mouse inside the map
import { isEmpty } from 'underscore';
const offsetMouse = 15;

export function updateCirclePointer (e) {
  const { isInsideEditingZone, isEditing, newCircleInfo } = this.state;

  if (isInsideEditingZone && isEditing && isEmpty(newCircleInfo)) {
    const target = this.circleRef.current;
    const x = e.clientX; const y = e.clientY;
    const offsetX = x - this.mapRef.current.getBoundingClientRect().left - offsetMouse;
    const offsetY = y - this.mapRef.current.getBoundingClientRect().top - offsetMouse;

    target.style.left = offsetX + 'px';
    target.style.top = offsetY + 'px';
  }
}
