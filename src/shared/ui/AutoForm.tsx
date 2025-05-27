import { useForm, Controller, Control, UseFormRegister, UseFormGetValues } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Select,
  TextArea,
  TextField,
  Radiobox,
  Tooltip,
  Button,
  H3,
  Switch,
  Indicator,
  TextS,
  Combobox,
  IconButton,
  H4,
  RadioGroup
} from '@salutejs/sdds-serv';
import { DevTool } from '@hookform/devtools';
import { DndContext, KeyboardSensor, useSensor, PointerSensor, useSensors, pointerWithin } from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import {
  IconCopyOutline,
  IconDisclosureDownOutline,
  IconDisclosureUpOutline,
  IconDrag,
  IconInfoCircleFill,
  IconPlus,
  IconTrashOutline
} from '@salutejs/plasma-icons';

// type FieldType = 'text' | 'textarea' | 'select' | 'radio' | 'number' | 'array' | 'boolean';

interface FieldOption {
  label: string;
  value: string | number;
  description?: string;
}

type FieldConfig =
  | TextFieldConfig
  | TextareaFieldConfig
  | NumberFieldConfig
  | BooleanFieldConfig
  | RadioFieldConfig
  | SelectFieldConfig
  | ComboboxFieldConfig
  | ArrayFieldConfig;

// interface FieldConfig {
//   // Тип
//   type: FieldType;
//   // Обязательность заполнения поля
//   required: boolean;
//   // Информация для чего это поля заполняется
//   info?: string;
//   // Текстовое отображение этого поля
//   label: string;
//   // Опции при type = 'select' и при type = 'radio'
//   options?: FieldOption[];
//   // Опции max, min при type = 'number'
//   max?: number;
//   min?: number;
//   // Опции arrayFields при type = 'array'
//   arrayFields?: Record<string, FieldConfig>;
// }

interface TextFieldConfig {
  type: 'text';
  mask?: 'hex' | 'phone' | 'email' | 'url';
  required?: boolean;
  label: string;
  info?: string;
  max?: number;
  min?: number;
}

interface TextareaFieldConfig {
  type: 'textarea';
  required: boolean;
  label: string;
  info?: string;
  max?: number;
  min?: number;
}

interface NumberFieldConfig {
  type: 'number';
  required?: boolean;
  label: string;
  info?: string;
  max?: number;
  min?: number;
}

interface BooleanFieldConfig {
  type: 'boolean';
  required?: boolean;
  label: string;
  info?: string;
}

interface RadioFieldConfig {
  type: 'radio';
  required?: boolean;
  label: string;
  info?: string;
  options: FieldOption[];
}

interface SelectFieldConfig {
  type: 'select';
  required?: boolean;
  label: string;
  info?: string;
  options: FieldOption[];
  // fetchCallback: <T = any>() => Promise<T>;
  // resolveData: (data: any) => FieldOption[];
}

interface ComboboxFieldConfig {
  type: 'combobox';
  required?: boolean;
  label: string;
  info?: string;
  options: FieldOption[];
  // fetchCallback: <T = any>() => Promise<T>;
  // resolveData: (data: any) => FieldOption[];
}

interface ArrayFieldConfig {
  type: 'array';
  required?: boolean;
  label: string;
  info?: string;
  arrayFields: Record<string, FieldConfig>;
  min?: number;
  max?: number;
}

export interface ComponentConfig {
  fields: Record<string, FieldConfig>;
  defaultProps?: Record<string, any>;
  label: string;
  children?: ComponentChildConfig[];
}

interface ComponentChildConfig {
  fields: Record<string, FieldConfig>;
  defaultProps?: Record<string, any>;
  label: string;
  // Технический ключ для поля
  key: string; // в БД будет сохраняться как ключ объекта
  visible: boolean; // отвечает за видимость поля в форме
}

interface AutoFormProps {
  config: Record<string, ComponentConfig>;
  onSubmit: (data: any) => void;
}

type FormValues = Record<string, string | number | undefined>;

const generateZodSchema = (fields: Record<string, FieldConfig>, children?: ComponentChildConfig[]): z.ZodTypeAny => {
  const schema: Record<string, z.ZodTypeAny> = {};

  Object.entries(fields).forEach(([key, field]) => {
    let fieldSchema: z.ZodTypeAny;

    switch (field.type) {
      case 'text':
      case 'textarea':
        fieldSchema = z.string({ required_error: 'Обязательное поле' }).trim();

        if (field.min !== undefined) {
          fieldSchema = (fieldSchema as z.ZodString).min(field.min, {
            message: `Минимальная длина ${field.min}`
          });
        }
        if (field.max !== undefined) {
          fieldSchema = (fieldSchema as z.ZodString).max(field.max, {
            message: `Максимальная длина ${field.max}`
          });
        }
        break;
      case 'number':
        fieldSchema = z.number({ required_error: 'Обязательное поле' });
        if (field.min !== undefined) {
          fieldSchema = (fieldSchema as z.ZodNumber).min(field.min, { message: `Минимальное значение ${field.min}` });
        }
        if (field.max !== undefined) {
          fieldSchema = (fieldSchema as z.ZodNumber).max(field.max, { message: `Максимальное значение ${field.max}` });
        }
        break;
      case 'select':
      case 'radio':
      case 'combobox':
        fieldSchema = z.enum(field.options?.map((opt) => opt.value.toString()) as [string, ...string[]], {
          required_error: 'Обязательное поле',
          invalid_type_error: 'Неверный тип данных',
          message: 'Неверный тип данных'
        });
        break;
      case 'array':
        if (field.arrayFields) {
          fieldSchema = z.array(generateZodSchema(field.arrayFields));
        } else {
          fieldSchema = z.array(z.any());
        }
        break;
      default:
        fieldSchema = z.any();
    }

    // Apply required validation if the field is marked as required
    schema[key] = field.required ? fieldSchema : fieldSchema.optional();
  });

  if (children) {
    schema['children'] = z.array(
      z.discriminatedUnion('visible', [
        z.object({
          visible: z.literal(true),
          key: z.string(),
          fields: z.record(z.any())
        }),
        z.object({
          visible: z.literal(false),
          key: z.string(),
          fields: z.record(z.any())
        })
      ])
    );
  }

  return z.object(schema);
};

interface SortableItemProps {
  id: string;
  item: any;
  index: number;
  onDelete: (index: number) => void;
  onCopy: (index: number) => void;
  onToggle: (index: number) => void;
  onEdit: (index: number, key: string, value: string) => void;
}

const SortableItem = ({ id, item, index, onDelete, onToggle, onCopy, onEdit }: SortableItemProps) => {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    border: '1px solid black',
    borderRadius: '8px',
    padding: '1rem',
    backgroundColor: '#fff',
    boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)',
    marginBottom: '0.5rem',
    '&:hover': {
      boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
    }
  };

  return (
    <div ref={setNodeRef} style={style}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <IconButton type="button" view="default" size="xs" {...attributes} {...listeners}>
            <IconDrag size="xs" color="inherit" />
          </IconButton>
          <IconButton type="button" view="default" size="xs" onClick={() => onDelete(index)}>
            <IconTrashOutline size="xs" color="inherit" />
          </IconButton>
          <IconButton
            type="button"
            view="default"
            size="xs"
            onClick={() => {
              onCopy(index);
            }}
          >
            <IconCopyOutline size="xs" color="inherit" />
          </IconButton>
          <IconButton
            type="button"
            view="default"
            size="xs"
            onClick={() => {
              onToggle(index);
            }}
          >
            {item.isExpanded ? (
              <IconDisclosureUpOutline size="xs" color="inherit" />
            ) : (
              <IconDisclosureDownOutline size="xs" color="inherit" />
            )}
          </IconButton>
        </div>
      </div>

      {item.isExpanded && (
        <div style={{ marginTop: '0.5rem' }}>
          {Object.entries(item).map(([key, val]) => {
            if (key === 'isExpanded' || key === 'id') return null;
            return (
              <div key={key} style={{ marginBottom: '0.5rem' }}>
                <TextS>{key}</TextS>
                <TextField value={val as string} onChange={(e) => onEdit(index, key, e.target.value)} size="s" />
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

const renderField = ({
  field,
  control,
  getValues,
  register,
  errors,
  name,
  shouldUnregister
}: {
  field: FieldConfig;
  control: Control<FormValues>;
  register: UseFormRegister<FormValues>;
  getValues: UseFormGetValues<FormValues>;
  errors: any;
  name: string;
  shouldUnregister?: boolean;
}) => {
  switch (field.type) {
    case 'text':
      return (
        <TextField
          {...register(name, {
            required: field.required,
            minLength: field.min,
            maxLength: field.max
          })}
          view={errors[name] ? 'negative' : 'default'}
          // name={name}
          placeholder={field.label}
          titleCaption={`${field.max ? `${getValues(name) ? getValues(name)?.toString().length : 0}/${field.max}` : ''}`}
          minLength={field.min}
          maxLength={field.max}
          size="s"
        />
      );
    case 'textarea':
      return (
        <TextArea
          {...register(name, {
            required: field.required,
            minLength: field.min,
            maxLength: field.max,
            shouldUnregister: shouldUnregister
          })}
          size="s"
          view={errors[name] ? 'negative' : 'default'}
          placeholder={field.label}
          label={field.label}
        />
      );
    case 'select':
      return (
        <Select
          {...register(name, {
            required: field.required,
            shouldUnregister: shouldUnregister
          })}
          items={field.options?.map((option) => ({
            value: option.value.toString(),
            label: option.label
          }))}
          defaultValue={getValues(name) as string}
          multiselect={false}
          size="s"
          view={errors[name] ? 'negative' : 'default'}
        />
      );
    case 'radio':
      return (
        <RadioGroup aria-labelledby="radiogroup-title-id">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {field.options?.map((option) => (
              <Radiobox
                {...register(name, {
                  required: field.required,
                  shouldUnregister: shouldUnregister
                })}
                key={option.value}
                value={option.value.toString()}
                name={name}
                view={errors[name] ? 'negative' : 'paragraph'}
                size="s"
                label={option.label}
                description={option.description}
              />
            ))}
          </div>
        </RadioGroup>
      );
    case 'combobox':
      return (
        <Combobox
          {...register(name, {
            required: field.required,
            shouldUnregister: shouldUnregister
          })}
          name={name}
          view={errors[name] ? 'negative' : 'default'}
          items={field.options?.map((option) => ({
            value: option.value.toString(),
            label: option.label
          }))}
          size="s"
        />
      );
    case 'number':
      return (
        <TextField
          {...register(name, {
            required: field.required,
            shouldUnregister: shouldUnregister,
            valueAsNumber: true,
            min: field.min,
            max: field.max
          })}
          view={errors[name] ? 'negative' : 'default'}
          name={name}
          placeholder={field.label}
          size="s"
        />
      );
    case 'boolean':
      return (
        <Switch
          {...register(name, {
            required: field.required,
            shouldUnregister: shouldUnregister
          })}
          size="s"
          toggleSize="s"
          label={field.label}
          description={field.info}
        />
      );
    case 'array':
      return (
        <Controller
          name={name}
          control={control}
          shouldUnregister={shouldUnregister}
          render={({ field: { value = [], onChange } }) => {
            const sensors = useSensors(
              useSensor(PointerSensor, { activationConstraint: { distance: 10 } }),
              useSensor(KeyboardSensor, {
                coordinateGetter: sortableKeyboardCoordinates
              })
            );

            const handleDragEnd = (event: any) => {
              const { active, over } = event;
              if (active.id !== over.id) {
                const oldIndex = (value as any[]).findIndex((item: any) => `item-${item.id}` === active.id);
                const newIndex = (value as any[]).findIndex((item: any) => `item-${item.id}` === over.id);
                onChange(arrayMove(value as any[], oldIndex, newIndex));
              }
            };

            const handleDelete = (index: number) => {
              const newItems = [...(value as any[])];
              newItems.splice(index, 1);
              onChange(newItems);
            };

            const handleToggle = (index: number) => {
              const newItems = [...(value as any[])];
              newItems[index] = {
                ...newItems[index],
                isExpanded: !newItems[index].isExpanded
              };
              onChange(newItems);
            };

            const handleEdit = (index: number, key: string, newValue: string) => {
              const newItems = [...(value as any[])];
              newItems[index] = {
                ...newItems[index],
                [key]: newValue
              };
              onChange(newItems);
            };

            const handleCopy = (index: number) => {
              const newItems = [...(value as any[])];
              const itemToCopy = { ...newItems[index] };
              const copiedItem = {
                ...itemToCopy,
                isExpanded: false
              };
              newItems.push(copiedItem);
              onChange(newItems);
            };

            const handleAdd = () => {
              const generateNewArrayElement = (schema: Record<string, FieldConfig>) => {
                const obj: any = { id: Date.now(), isExpanded: false };
                Object.entries(schema).forEach(([key, field]) => {
                  if (field.type) {
                    switch (field.type) {
                      case 'text':
                        obj[key] = '';
                        break;
                      case 'number':
                        obj[key] = 0;
                        break;
                      case 'boolean':
                        obj[key] = false;
                        break;
                      case 'select':
                        obj[key] = '';
                        break;
                      case 'radio':
                        obj[key] = '';
                        break;
                      default:
                        obj[key] = '';
                    }
                  }
                });
                return obj;
              };
              const newArrayElement = generateNewArrayElement(field.arrayFields);

              onChange([...(value as any[]), newArrayElement]);
            };

            return (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <DndContext sensors={sensors} collisionDetection={pointerWithin} onDragEnd={handleDragEnd}>
                  <SortableContext
                    items={(value as any[]).map((item: any) => `item-${item.id}`)}
                    strategy={verticalListSortingStrategy}
                  >
                    {(value as any[]).map((item: any, index: number) => (
                      <SortableItem
                        key={`item-${item.id}`}
                        id={`item-${item.id}`}
                        item={item}
                        index={index}
                        onDelete={handleDelete}
                        onToggle={handleToggle}
                        onEdit={handleEdit}
                        onCopy={handleCopy}
                      />
                    ))}
                  </SortableContext>
                </DndContext>
                <IconButton type="button" view="default" size="xs" onClick={handleAdd} pin="circle-circle">
                  <IconPlus size="s" color="inherit" />
                </IconButton>
              </div>
            );
          }}
        />
      );
    default:
      return null;
  }
};

export const AutoForm: React.FC<AutoFormProps> = ({ config, onSubmit }) => {
  const componentName = Object.keys(config)[0];
  const componentConfig = config[componentName];
  const schema = generateZodSchema(componentConfig.fields, componentConfig.children);

  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
    getValues,
    watch
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: componentConfig.defaultProps
  });

  console.log('Состояние формы', watch());

  return (
    <>
      <form
        onSubmit={(e) => {
          console.log('Form submit event triggered');
          handleSubmit(onSubmit)(e);
        }}
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem'
        }}
      >
        <H3>{componentConfig.label}</H3>
        {Object.entries(componentConfig.fields).map(([fieldName, field]) => (
          <div key={fieldName} style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                <TextS>{field.label}</TextS>
                {field.required && <Indicator size="s" view="negative" />}
              </label>

              {field.info && (
                <Tooltip
                  placement={'top'}
                  trigger="hover"
                  text={field.info}
                  target={<IconInfoCircleFill size="xs" color="#000" />}
                />
              )}
            </div>
            {renderField({ field, control, errors, name: fieldName, register, getValues })}
            {errors[fieldName] && (
              <span style={{ color: 'red', fontSize: '0.875rem' }}>{errors[fieldName]?.message as string}</span>
            )}
          </div>
        ))}

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {componentConfig.children?.map((child, index) => (
            <div key={child.key} style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <div style={{ display: 'flex', flexDirection: 'row', gap: '0.5rem', justifyContent: 'space-between' }}>
                <H4>{child.label}</H4>
                <Controller
                  name={`children.${index}.visible`}
                  control={control}
                  render={({ field: { value, onChange } }) => <Switch value={value} onChange={onChange} />}
                />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {getValues(`children.${index}.visible`) && (
                  <div>
                    {Object.entries(child.fields).map(([fieldName, field]) => (
                      <div key={fieldName} style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                          <label style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                            <TextS>{field.label}</TextS>
                            {field.required && <Indicator size="s" view="negative" />}
                          </label>

                          {field.info && (
                            <Tooltip
                              placement={'top'}
                              trigger="hover"
                              text={field.info}
                              target={<IconInfoCircleFill size="xs" color="#000" />}
                            />
                          )}
                        </div>
                        {renderField({
                          field,
                          control,
                          errors,
                          name: `children.${index}.${fieldName}`,
                          shouldUnregister: true,
                          register,
                          getValues
                        })}
                        {errors[fieldName] && (
                          <span style={{ color: 'red', fontSize: '0.875rem' }}>
                            {errors[fieldName]?.message as string}
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        <Button type="submit" stretching="filled" size="s">
          Сохранить
        </Button>
      </form>
      <DevTool control={control} />
    </>
  );
};
