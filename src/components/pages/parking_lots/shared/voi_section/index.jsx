import React from 'react';
import PropTypes from 'prop-types';
import List from 'components/pages/voi/list';
import CollapsableCard from 'components/base/collapsable_card';

const VoiSection = props => {
  const { records = [] } = props;
  return (
    <CollapsableCard header="Vehicles of Interest">
      <List list={records}/>
    </CollapsableCard>
  );
};

VoiSection.propTypes = {
  records: PropTypes.arrayOf(PropTypes.object)
};

export default VoiSection;
