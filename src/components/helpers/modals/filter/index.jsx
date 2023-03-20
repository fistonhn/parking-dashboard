import React, { useState, useEffect } from 'react';
import { Modal, ModalHeader, ModalBody } from 'reactstrap';
import { FilterForm } from 'components/base/forms';
import styles from './filter.module.sass';

const Filter = function (props) {
  const {
    toggleModal,
    isOpen,
    filterFields,
    isFetching,
    submitForm,
    filterQuery
  } = props;

  const [values, setValues] = useState(null);

  useEffect(() => {
    setValues(filterQuery);
  }, [filterQuery]);

  return (
    <Modal isOpen={isOpen} toggle={toggleModal} size="lg" className={styles.modal}>
      <ModalHeader className={styles.modalHeader} toggle={toggleModal}>
        Filter by
      </ModalHeader>
      <ModalBody className={styles.modalBody}>
        <FilterForm
          {...props}
          values={values}
          fields={filterFields}
          isFetching={isFetching}
          submitForm={(values) => {
            submitForm(values);
            toggleModal();
          }}
          cancelFilter={() => {
            toggleModal();
            if (Object.keys(values).length > 0) {
              submitForm({});
            }
          }}/>
      </ModalBody>

    </Modal>
  );
};

export default Filter;
