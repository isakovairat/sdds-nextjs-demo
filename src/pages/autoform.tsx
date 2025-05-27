import { GetServerSideProps } from 'next';
import { gssp } from '@/entities/home/gssp';
import { Indent } from '@/shared/ui/Indent';
import { AutoForm, ComponentConfig } from '@/shared/ui/AutoForm';
import styled from 'styled-components';
import { useState } from 'react';
import { H4 } from '@salutejs/sdds-serv';

type DataDisplayComponents =
  | 'Accordion'
  | 'Avatar'
  | 'AvatarGroup'
  | 'Badge'
  | 'Card'
  | 'Cell'
  | 'Chip'
  | 'ChipGroup'
  | 'Counter'
  | 'Divider'
  | 'Image'
  | 'Indicator'
  // | 'Mask'
  | 'Note'
  | 'Price'
  | 'Rating'
  | 'Table'
  | 'Dspl'
  | 'H'
  | 'Body'
  | 'Text';

type DataEntryComponents = 'Button';
type NavigationComponents = 'Breadcrumbs';
type LayoutComponents = 'Grid';
type CustomComponents = 'Slider';

type Сomponents =
  | DataDisplayComponents
  | DataEntryComponents
  | NavigationComponents
  | LayoutComponents
  | CustomComponents;

const SliderConfig: Partial<Record<Сomponents, ComponentConfig>> = {
  Slider: {
    fields: {
      view: {
        required: true,
        type: 'select',
        label: 'view',
        info: 'Вид Slider',
        options: [
          { label: 'default', value: 'default' },
          { label: 'positive', value: 'positive' },
          { label: 'negative', value: 'negative' },
          { label: 'neutral', value: 'neutral' },
          { label: 'warning', value: 'warning' },
          { label: 'accent', value: 'accent' },
          { label: 'dark', value: 'dark' },
          { label: 'light', value: 'light' }
        ]
      },
      size: {
        required: true,
        type: 'select',
        label: 'size',
        info: 'Размер Badge',
        options: [
          { label: 's', value: 's' },
          { label: 'm', value: 'm' },
          { label: 'l', value: 'l' },
          { label: 'xl', value: 'xl' }
        ]
      },
      pilled: {
        required: true,
        type: 'boolean',
        label: 'pilled',
        info: 'Компонент c округлым border-radius'
      },
      transparent: {
        required: true,
        type: 'boolean',
        label: 'transparent',
        info: 'view применяется с учетом прозрачности'
      },
      clear: {
        required: true,
        type: 'boolean',
        label: 'clear',
        info: 'view применяется с clear-токенами'
      },
      text: {
        required: true,
        type: 'text',
        label: 'text',
        info: 'Текстовая надпись Badge'
      },
      customColor: {
        required: true,
        type: 'text',
        label: 'customColor',
        info: 'Пользовательский цвет текста и иконок'
      },
      customBackgroundColor: {
        required: true,
        type: 'text',
        mask: 'hex',
        label: 'customBackgroundColor',
        info: 'Пользовательский цвет фона'
      },
      maxWidth: {
        required: true,
        type: 'number',
        label: 'maxWidth',
        info: 'Максимальная ширина Badge'
      },
      contentLeft: {
        required: true,
        type: 'select',
        label: 'contentLeft',
        info: 'Иконка слева',
        options: [{ label: 'IconInfo', value: 'IconInfo' }]
      },
      contentRight: {
        required: true,
        type: 'select',
        label: 'contentRight',
        info: 'Иконка справа',
        options: [{ label: 'IconInfo', value: 'IconInfo' }]
      }
    },
    children: [
      {
        key: 'badge',
        label: 'Badge',
        visible: false,
        // Настройки для Badge
        fields: {
          badgeText: {
            required: true,
            type: 'text',
            label: 'text',
            info: 'Текстовая надпись Badge'
          }
        },
        defaultProps: {
          text: 'Badge-default-text'
        }
      },
      {
        key: 'image',
        label: 'Image',
        visible: false,
        fields: {
          src: {
            required: true,
            type: 'text',
            label: 'src',
            mask: 'url',
            info: 'Ссылка на изображение'
          }
        },
        defaultProps: {
          src: 'https://via.placeholder.com/150'
        }
      }
    ],
    defaultProps: {
      view: 'default',
      size: 'm',
      pilled: false,
      transparent: false,
      clear: false,
      text: 'Badge',
      maxWidth: 'auto'
    },
    label: 'Badge'
  }
};

const ButtonConfig: Partial<Record<Сomponents, ComponentConfig>> = {
  Button: {
    fields: {
      textField: {
        required: true,
        type: 'text',
        label: 'textField',
        info: 'textField info',
        min: 1,
        max: 32
      },
      textareaField: {
        type: 'textarea',
        label: 'textareaField',
        info: 'textareaField info',
        min: 1,
        max: 120,
        required: true
      },
      numberField: {
        required: true,
        type: 'number',
        label: 'numberField',
        info: 'numberField info',
        min: 1,
        max: 10
      },
      booleanField: {
        type: 'boolean',
        label: 'booleanField',
        info: 'booleanField info'
      },
      radioField: {
        type: 'radio',
        label: 'radioField',
        info: 'radioField info',
        options: [
          { label: 'Variant 1', value: 'Variant 1', description: 'Информация доп для каждого радио' },
          { label: 'Variant 2', value: 'Variant 2', description: 'Информация доп для каждого радио' }
        ],
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
      comboboxField: {
        type: 'combobox',
        label: 'comboboxField',
        info: 'comboboxField info',
        options: [
          { label: 'Left', value: 'left' },
          { label: 'Right', value: 'right' },
          { label: 'Top', value: 'top' },
          { label: 'Bottom', value: 'bottom' }
        ]
      },
      arrayField: {
        type: 'array',
        label: 'arrayField',
        info: 'arrayField info',
        min: 1,
        max: 3,
        arrayFields: {
          // Какой-то компонент
          textField: {
            label: 'textField',
            type: 'text',
            info: 'textField info',
            min: 1,
            max: 50,
            required: true
          },
          textareaField: {
            label: 'textareaField',
            type: 'textarea',
            info: 'textareaField info',
            min: 1,
            max: 120,
            required: true
          },
          booleanField: {
            label: 'booleanField',
            type: 'boolean',
            info: 'booleanField info'
          },
          comboboxField: {
            label: 'comboboxField',
            type: 'combobox',
            info: 'comboboxField info',
            options: [
              { label: 'Left', value: 'left' },
              { label: 'Right', value: 'right' },
              { label: 'Top', value: 'top' },
              { label: 'Bottom', value: 'bottom' }
            ]
          },
          numberField: {
            label: 'numberField',
            type: 'number',
            info: 'numberField info',
            min: 1,
            max: 10
          },
          selectField: {
            label: 'selectField',
            type: 'select',
            info: 'selectField info',
            options: [
              { label: 'Left', value: 'left' },
              { label: 'Right', value: 'right' },
              { label: 'Top', value: 'top' },
              { label: 'Bottom', value: 'bottom' }
            ]
          },
          radioField: {
            label: 'radioField',
            type: 'radio',
            info: 'radioField info',
            options: [
              { label: 'Variant 1', value: 'Variant 1', description: 'Информация доп для каждого радио' },
              { label: 'Variant 2', value: 'Variant 2', description: 'Информация доп для каждого радио' }
            ]
          }
        }
      }
    },
    defaultProps: { title: 'Дефолтное значение', size: 2, alignment: 'right' },
    label: 'Кнопка'
  }
};

const FormContainer = styled.div`
  max-width: 300px;
  margin: 0 auto;
`;

export default function Page() {
  const [formData, setFormData] = useState<any>(null);

  const handleSubmit = (data: any) => {
    console.log('Form submitted!');
    console.log('Form data:', data);
    setFormData(data);
  };

  return (
    <div style={{ backgroundColor: '#fff', height: '100vh', overflow: 'auto' }}>
      <Indent s={32} m={36} l={60} />
      <FormContainer>
        <AutoForm config={ButtonConfig} onSubmit={handleSubmit} />
      </FormContainer>
      <Indent s={32} m={36} l={60} />
      {formData && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <H4>Form data</H4>
          <pre style={{ whiteSpace: 'pre-wrap' }}>{JSON.stringify(formData, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = gssp;
