import { GetServerSideProps } from 'next';
import { gssp } from '@/entities/home/gssp';
import { Indent } from '@/shared/ui/Indent';
import { AutoForm } from '@/shared/ui/AutoForm';
import styled from 'styled-components';

const config = {
  Button: {
    fields: {
      textField: {
        type: 'text',
        label: 'textField',
        info: 'textField info',
        min: 1,
        max: 32,
        required: true
      },
      selectField: {
        type: 'select',
        label: 'selectField',
        info: 'selectField info',
        options: [
          { label: 'Left', value: 'left' },
          { label: 'Right', value: 'right' },
          { label: 'Top', value: 'top' },
          { label: 'Bottom', value: 'bottom' }
        ]
      },
      numberField: {
        type: 'number',
        label: 'numberField',
        info: 'numberField info',
        min: 1,
        max: 10
      },
      textareaField: {
        type: 'textarea',
        label: 'textareaField',
        info: 'textareaField info',
        min: 1,
        max: 120,
        required: true
      },
      radioField: {
        type: 'radio',
        label: 'radioField',
        info: 'radioField info',
        options: [
          { label: "Variant 1", value: "Variant 1", description: "Информация доп для каждого радио"},
          { label: "Variant 2", value: "Variant 2", description: "Информация доп для каждого радио"},
        ],
        required: true
      },
      booleanField: {
        type: 'boolean',
        label: 'booleanField',
        info: 'booleanField info',
      },
      arrayField: {
        type: 'array',
        label: "arrayField",
        info: 'arrayField info',
        min: 1,
        max: 3,
        arrayFields: {
          // Какой-то компонент
          textField: {
            label: 'textField',
            type: "text",
            info: 'textField info',
            min: 1,
            max: 50,
            required: true
          },
          textareaField: {
            label: 'textareaField',
            type: "textarea",
            info: 'textareaField info',
            min: 1,
            max: 120,
            required: true
          }
        }
      }
    },
    defaultProps: { title: 'Дефолтное значение', size: 2, alignment: "right" },
    label: 'Автоформа полная конфигурация'
  }
};

const FormContainer = styled.div`
  max-width: 300px;
  margin: 0 auto;
`;

export default function Page() {

  const handleSubmit = (data: any) => {
    console.log(data);
  };

  return (
    <div>
      <Indent s={32} m={36} l={60} />
      <FormContainer>
        <AutoForm config={config} onSubmit={handleSubmit} />
      </FormContainer>
      <Indent s={32} m={36} l={60} />
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = gssp;
