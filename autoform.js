// 1) Типизация всего это дела
// 2) Парсер конфига для отрисовки самой формы
// 3) Парсер итоговых данных из формы для рендера в контентой части ???
// 4) Подружить внутри СMS

const config = {
  Button: {
    render: () => {
      return <Button />;
    },
    // Атрибуты компонента
    fields: {
      // Конктреный атрибут
      title: {
        // Мета информация
        info: "Здесь описание за что этот параметр отвечает",
        label: "RU/EN название",

        // Тип text
        type: "text",
        min: 1,
        max: 10,
        // Тип textarea
        type: "textarea",
        // Тип select (enum > 4)
        type: "select",
        options: [
          { label: "RU/EN название", value: "left" },
          { label: "RU/EN название", value: "right" },
        ],
        // Тип radio (enum < 4)
        type: "radio",
        options: [
          { label: "Left", value: "left", description: "" },
          { label: "Right", value: "right", description: "" },
        ],
        // Тип number
        type: "number",
        max: 10,
        min: 1,
        // Тип boolean
        type: "boolean",
        // Тип array
        type: "array",
        arrayFields: {
          // Аватар
          title: { type: "text" },
        },
      },
    },
    defaultProps: { title: "Hello, world" },
    label: Кнопка,
    // Описать каждый чилдрен
    children: [
      {
        visible: true,
        ...ComponentConfig,
      },
    ],
  },
};
