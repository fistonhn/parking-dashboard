
const generateUniqueTrackerID = () => {
  return Math.random().toString(36).substr(2, 16) + Math.random().toString(36).substr(2, 16); ;
};

if (!localStorage.PSAD_TRACKER_ID) {
  localStorage.setItem(`PSAD_TRACKER_ID`, generateUniqueTrackerID());
}
