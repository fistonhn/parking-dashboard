import React from 'react';
import {
  Col,
  Form,
  FormGroup,
  Label,
  ListGroup,
  ListGroupItem
} from 'reactstrap';
import { FieldType } from 'components/helpers/form_fields';
import _ from 'lodash';

class ShowForm extends React.Component {
  renderField = (field, key) => (
    <FormGroup row key={key}>
      <Label for={field.name} sm={2}>{field.label}</Label>
      <Col sm={10}>
        {this.renderInput(field)}
      </Col>
    </FormGroup>
  );

  listField = (list, innerLabel) => (<ListGroup>
    {
      list.map((element, index) => <ListGroupItem key={`${element[innerLabel]}${index}`}> #{index + 1}: {element[innerLabel]}</ListGroupItem>)
    }
  </ListGroup>
  )

  renderInput = field => {
    const { values } = this.props;
    const value = _.get(values, field.name) || '';
    switch (field.type) {
      case FieldType.MULTISELECT_FIELD:
        return this.listField(value, field.innerLabel);
      case FieldType.FILE_FIELD:
        return <img src={value} alt={field.name} />;
      default:
        return <Label id={field.name}>{value}</Label>;
    }
  };

  renderFields = () => {
    const { fields } = this.props;
    return fields.map((field, idx) => this.renderField(field, idx));
  };

  renderForm = () => (
    <React.Fragment>
      {this.renderFields()}
    </React.Fragment>
  );

  render () {
    return <Form> {this.renderForm()} </Form>;
  }
}

export default ShowForm;
