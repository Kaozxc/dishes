import { Field, Form } from 'react-final-form';
import { toast } from 'react-toastify';
import { saveDish } from './DishService';
import Styles from './Styles'
import React from 'react';

export default function App() {

  const onSubmit = async (values, form) => {
    return saveDish(values).then(response => {
      toast.success('Dish has been saved');
      form.reset();
    }).catch(error => {
      if (error.response.status === 400) {
        toast.error('We couldn\'t save the dish');
        return error.response.data;
      }
    });
  }

  // Offline validation
  const required = (value) => (value ? undefined : 'Required')
  const mustBeNumber = (value) => (isNaN(value) ? 'Must be a number' : undefined)
  const mustBeHour = (value) => new RegExp('^([0-9]+):([0-9]+):([0-9]+([\.|,][0-9+]*)?)$').test(value) ? undefined : 'Must be in format HH:HH:HH'
  const composeValidators = (...validators) => (value) =>
    validators.reduce((error, validator) => error || validator(value), null)

  const renderConditionalFields = (type) => {
    switch (type) {
      case 'pizza':
        return <React.Fragment>
          <Field
            type="number"
            name="no_of_slices"
            validate={composeValidators(required, mustBeNumber)}
          >
            {({ input, meta }) => (
              <div>
                <label>Number of slices</label>
                <input {...input} type='number' min='1' placeholder='Number of slices' />
                {(meta.error || meta.submitError) && meta.touched && (
                  <span className='error'>{meta.error || meta.submitError}</span>)}
              </div>
            )}
          </Field>
          <Field
            type='number'
            name='diameter'
            validate={composeValidators(required, mustBeNumber)}
          >
            {({ input, meta }) => (
              <div>
                <label>Diameter</label>
                <input {...input} type='number' step='0.1' placeholder='Diameter' />
                {(meta.error || meta.submitError) && meta.touched && (
                  <span className='error'>{meta.error || meta.submitError}</span>)}
              </div>
            )}
          </Field>
        </React.Fragment>
      case 'soup':
        return <Field
          type='number'
          name='spiciness_scale'
          validate={composeValidators(required, mustBeNumber)}
        >
          {({ input, meta }) => (
            <div>
              <label>Spiciness scale</label>
              <input {...input} type='number' min='1' placeholder='Spiciness scale' />
              {(meta.error || meta.submitError) && meta.touched && (
                <span>{meta.error || meta.submitError}</span>)}
            </div>
          )}
        </Field>
      case 'sandwich':
        return <Field
          type='number'
          name='slices_of_bread'
          validate={composeValidators(required, mustBeNumber)}
        >
          {({ input, meta }) => (
            <div>
              <label>Slices of bread</label>
              <input {...input} type='number' min='1' placeholder='Slices of bread' />
              {(meta.error || meta.submitError) && meta.touched && (
                <span>{meta.error || meta.submitError}</span>)}
            </div>
          )}
        </Field>
    }
  }

  return (
    <div className='App'>
      <Styles>
        <Form
          onSubmit={onSubmit}
          render={({ handleSubmit, form, submitting, pristine, values }) => (
            <form onSubmit={handleSubmit}
            >
              <Field name='name' validate={required}>
                {({ input, meta }) => (
                  <div>
                    <label>Name</label>
                    <input {...input} type='text' placeholder='Name' />
                    {(meta.error || meta.submitError) && meta.touched && (
                      <span>{meta.error || meta.submitError}</span>)}
                  </div>
                )}
              </Field>
              <Field name='preparation_time' validate={composeValidators(required, mustBeHour)}>
                {({ input, meta }) => (
                  <div>
                    <label>Prep time</label>
                    <input {...input} type='text' placeholder='Preparation time' />
                    {(meta.error || meta.submitError) && meta.touched && (
                      <span>{meta.error || meta.submitError}</span>)}
                  </div>
                )}
              </Field>
              <div>
                <label>Dish type</label>
                <Field name='type' component='select'>
                  <option />
                  <option value='pizza'>Pizza</option>
                  <option value='soup'>Soup</option>
                  <option value='sandwich'>Sandwich</option>
                </Field>
              </div>
              {renderConditionalFields(values.type)}
              <div className='buttons'>
                <button type='submit' disabled={submitting}>
                  Submit
                </button>
                <button
                  type='button'
                  onClick={form.reset}
                  disabled={submitting || pristine}
                >
                  Reset
                </button>
              </div>
            </form>
          )}
        />
      </Styles>
    </div>
  );
};