// onboarding.config.js
// Fonte única das perguntas do onboarding (P3, P4, P5 do PDF).
// Para mudar/adicionar uma pergunta, mexes só aqui: o wizard não precisa de alterações.
//
// Tipos de campo disponíveis:
//   text         -> input de texto
//   number       -> input numérico com unidade (ex.: hectares)
//   multi-card   -> várias escolhas, em cartões com ícone
//   single-chip  -> uma só escolha, em botões
//   location     -> GPS + mapa
//   action       -> botão que abre outra coisa (ex.: análise de solo)
//
// Cada campo: { type, id, label?, hint?, required?, ...extras do tipo }

export const ONBOARDING_STEPS = [
  {
    id: "farm", // P3
    title: "Como se chama a sua fazenda?",
    fields: [
      {
        type: "text",
        id: "name",
        placeholder: "Fazenda Boa Terra",
        required: true,
      },
      {
        type: "select",
        id: "crops",
        label: "O que planta?",
        required: true,
        options: [
          { value: "cebola", label: "Cebola" },
          { value: "tomate", label: "Tomate" },
          { value: "mandioca", label: "Mandioca" },
          { value: "batata", label: "Batata" },
        ],
      },
    ],
  },
  {
    id: "location", // P4
    title: "Onde fica a sua fazenda?",
    fields: [
      { type: "location", id: "location", required: true },
      {
        type: "number",
        id: "areaHa",
        label: "Tamanho da fazenda",
        unit: "hectares",
        placeholder: "12,5",
        hint: "Adicionar mais tarde",
        required: true,
      },
    ],
  },
  {
    id: "history", // P5
    title: "Mais um pouco sobre a terra",
    fields: [
      {
        type: "single-chip",
        id: "previousCrop",
        label: "O que plantou antes?",
        required: true,
        options: [
          { value: "milho", label: "Milho" },
          { value: "feijao", label: "Feijão" },
          { value: "nada", label: "Nada" },
          { value: "outra", label: "Outra" },
        ],
      },
      {
        type: "single-chip",
        id: "irrigation",
        label: "Tem irrigação (rega)?",
        required: true,
        options: [
          { value: true, label: "Sim" },
          { value: false, label: "Não" },
        ],
      },
      {
        type: "action",
        id: "soilAnalysis", // opcional: sem `required`
        label: "Análise de solo (opcional)",
        actionLabel: "Adicionar resultados",
        actionHint: "Se não tiver, usamos estimativas de satélite.",
      },
    ],
  },
];

// Valor inicial de cada campo, gerado a partir da config.
export const initialValues = () =>
  Object.fromEntries(
    ONBOARDING_STEPS.flatMap((s) => s.fields).map((f) => [
      f.id,
      f.type === "multi-card" ? [] : null,
    ]),
  );

// Um campo obrigatório está preenchido?
const isFilled = (field, value) =>
  field.type === "multi-card"
    ? Array.isArray(value) && value.length > 0
    : value !== null && value !== "";

// O passo pode avançar? (todos os campos obrigatórios preenchidos)
export const isStepValid = (step, values) =>
  step.fields.every((f) => !f.required || isFilled(f, values[f.id]));
