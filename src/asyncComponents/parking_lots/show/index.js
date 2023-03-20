import asyncComponent from 'asyncComponents/asyncComponent';

export default asyncComponent(() => {
  return import('components/pages/parking_lots/show');
});
