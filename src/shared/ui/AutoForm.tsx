import { useForm, Controller, Control } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Select, TextArea, TextField, Radiobox, NumberInput, Tooltip, Button, H3, Switch, Indicator, Badge, TextS } from '@salutejs/sdds-serv';
import { DevTool } from "@hookform/devtools";
import { DndContext, closestCenter, KeyboardSensor, KeyboardSensorProps, useSensor, PointerSensor, useSensors } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

type FieldType = 'text' | 'textarea' | 'select' | 'radio' | 'number' | 'array' | 'boolean';

interface FieldOption {
  label: string;
  value: string | number;
  description?: string;
}

interface FieldConfig {
  // Тип
  type: FieldType;
  // Обязательность заполнения поля
  required: boolean;
  // Информация для чего это поля заполняется
  info?: string;
  // Текстовое отображение этого поля
  label: string;
  // Опции при type = 'select' и при type = 'radio'
  options?: FieldOption[];
  // Опции max, min при type = 'number'
  max?: number;
  min?: number;
  // Опции arrayFields при type = 'array'
  arrayFields?: Record<string, FieldConfig>;
}

interface ComponentConfig {
  fields: Record<string, FieldConfig>;
  defaultProps?: Record<string, any>;
  label: string;
  // children: ComponentChildConfig[];
}

interface ComponentChildConfig {
  fields: Record<string, FieldConfig>;
  defaultProps?: Record<string, any>;
  label: string;
  visible: boolean;
}

interface AutoFormProps {
  config: Record<string, ComponentConfig>;
  onSubmit: (data: any) => void;
}

type FormValues = Record<string, string | number | undefined>;

const generateZodSchema = (fields: Record<string, FieldConfig>): z.ZodTypeAny => {
  const schema: Record<string, z.ZodTypeAny> = {};

  Object.entries(fields).forEach(([key, field]) => {
    let fieldSchema: z.ZodTypeAny;

    switch (field.type) {
      case 'text':
      case 'textarea':
        fieldSchema = z.string();
        break;
      case 'number':
        fieldSchema = z.number();
        if (field.min !== undefined) {
          fieldSchema = (fieldSchema as z.ZodNumber).min(field.min);
        }
        if (field.max !== undefined) {
          fieldSchema = (fieldSchema as z.ZodNumber).max(field.max);
        }
        break;
      case 'select':
      case 'radio':
        fieldSchema = z.enum(field.options?.map(opt => opt.value.toString()) as [string, ...string[]]);
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

  return z.object(schema);
};

interface SortableItemProps {
  field: FieldConfig;
  id: string;
  item: any;
  index: number;
  onDelete: (index: number) => void;
  onCopy: (index: number) => void;
  onToggle: (index: number) => void;
  onEdit: (index: number, key: string, value: string) => void;
}

const SortableItem = ({ field, id, item, index, onDelete, onToggle, onCopy, onEdit }: SortableItemProps) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    border: '1px solid black',
    borderRadius: '8px',
    padding: '1rem',
    backgroundColor: '#fff',
    boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)',
    marginBottom: '0.5rem',
  };

  const stopPropagation = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  return (
    <div ref={setNodeRef} style={style}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Button
            type="button"
            view="default"
            size="xxs"
            {...attributes}
            {...listeners}
          >
            Drag
          </Button>
          <Button
            type="button"
            view="default"
            size="xxs"
            onClick={() =>
              onDelete(index)
            }
          >
            Del
          </Button>
          <Button
            type="button"
            view="default"
            size="xxs"
            onClick={() => {
              onCopy(index)
            }}
          >
            Copy
          </Button>
          <Button
            type="button"
            view="default"
            size="xxs"
            onClick={() => {
              onToggle(index)
            }}
          >
            Open
          </Button>
        </div>
      </div>
      {item.isExpanded && (
        <div style={{ marginTop: '0.5rem' }}>
          {Object.entries(item).map(([key, val]) => {
            if (key === 'isExpanded') return null;
            return (
              <div key={key} style={{ marginBottom: '0.5rem' }}
              onMouseDown={stopPropagation}
              onTouchStart={stopPropagation}
              onDragStart={stopPropagation}
              onDrop={stopPropagation}>
                <TextS>{key}</TextS>
                  <TextField
                    value={val as string}
                    onChange={(e) => onEdit(index, key, e.target.value)}
                    size="s"
                  />
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

const renderField = (
  field: FieldConfig,
  control: Control<FormValues>,
  errors: any,
  name: string,
) => {
  switch (field.type) {
    case 'text':
      return (
        <Controller
          name={name}
          control={control}
          render={({ field: { onChange, value } }) => (
            <TextField
              name={name}
              value={value}
              onChange={onChange}
              placeholder={field.label}
              titleCaption={`${value ? value.toString().length : 0}/${field.max}`}
              view={errors[name] ? 'negative' : "default"}
              minLength={field.min}
              maxLength={field.max}
              size='s'
            />
          )}
        />
      );
    case 'textarea':
      return (
        <Controller
          name={name}
          control={control}
          render={({ field: { onChange, value } }) => (
            <TextArea
              name={name}
              value={value}
              onChange={onChange}
              label={field.label}
              placeholder={field.label}
              size='s'
            />
          )}
        />
      );
    case 'select':
      return (
        <Controller
          name={name}
          control={control}
          render={({ field: { onChange, value } }) => (
            <Select
              name={name}
              value={value}
              onChange={onChange}
              // label={field.label}
              items={field.options?.map(option => ({
                value: option.value,
                label: option.label
              })) || []}
              defaultValue={value}
              multiselect={false}
              size='s'
            />
          )}
        />
      );
    case 'radio':
      return (
        <Controller
          name={name}
          control={control}
          render={({ field: { onChange, value } }) => (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {field.options?.map((option) => (
                <Radiobox
                  view='paragraph'
                  key={option.value}
                  name={name}
                  value={option.value}
                  description={option.description}
                  checked={value === option.value}
                  onChange={onChange}
                  label={option.label}
                  size='s'
                />
              ))}
            </div>
          )}
        />
      );
    case 'number':
      return (
        <Controller
          name={name}
          control={control}
          render={({ field: { value, onChange } }) => (
            <NumberInput
              name={name}
              value={value as number}
              onChange={onChange}
              min={field.min}
              max={field.max}
              placeholder={field.label}
              isManualInput
              onDecrement={(value) => {
                console.log('value', value);
                onChange(value);
              }}
              onIncrement={(value) => {
                console.log('value', value);
                onChange(value);
              }}
              size='s'
            />
          )}
        />
      );
    case 'boolean':
      return (
        <Controller
          name={name}
          control={control}
          render={({ field: { value, onChange } }) => (
            <Switch value={value} description={field.info} label={field.label} onChange={onChange} size='s' toggleSize='s' />
          )}
        />
      );
    case 'array':
      return (
        <Controller
          name={name}
          control={control}
          render={({ field: { value = [], onChange } }) => {
            const sensors = useSensors(
              useSensor(PointerSensor, { activationConstraint: { distance: 10 } }),
              useSensor(KeyboardSensor, {
                coordinateGetter: sortableKeyboardCoordinates,
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

            return (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <DndContext
                  sensors={sensors}
                  collisionDetection={closestCenter}
                  onDragEnd={handleDragEnd}
                >
                  <SortableContext
                    items={(value as any[]).map((item: any) => `item-${item.id}`)}
                    strategy={verticalListSortingStrategy}
                  >
                    {(value as any[]).map((item: any, index: number) => (
                      <SortableItem
                        field={field}
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
                <Button
                  type="button"
                  view="default"
                  size="xxs"
                  onClick={() => {
                    onChange([...(value as any[]), { id: Date.now(), isExpanded: false }]);
                  }}
                >
                  +
                </Button>
              </div>
            );
          }}
        />
      )
    default:
      return null;
  }
};

export const AutoForm: React.FC<AutoFormProps> = ({ config, onSubmit }) => {
  const componentName = Object.keys(config)[0];
  const componentConfig = config[componentName];
  const schema = generateZodSchema(componentConfig.fields);

  const {
    control,
    handleSubmit,
    formState: { errors }
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: componentConfig.defaultProps,
  });

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <H3>{componentConfig.label}</H3>
        {Object.entries(componentConfig.fields).map(([fieldName, field]) => (
          <div key={fieldName} style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
              <label style={{ display: "flex", alignItems: 'center', gap: '0.25rem' }}>
                <TextS>{field.label}</TextS>
                {field.required && <Indicator size='s' view="negative" />}
              </label>

              {field.info && (
                <Tooltip placement={"top"} trigger="hover" text={field.info} target={<Badge view="default" size="xs" pilled>i</Badge>} />
              )}
            </div>
            {renderField(field, control, errors, fieldName)}
            {errors[fieldName] && (
              <span style={{ color: 'red', fontSize: '0.875rem' }}>{errors[fieldName]?.message as string}</span>
            )}
          </div>
        ))}
        <Button type="submit" stretching='filled'>Сохранить</Button>
      </form>
      <DevTool control={control} />
    </>
  );
};
