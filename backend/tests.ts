interface ContentProps {
    role: string;
    parts: [{
        text: string;
        functionResponse?: {
            name: string;
            response: string;
        }
    }]
}

let contents: ContentProps[] = [
    {
        role: "user",
        parts: [{text: "values.prompt"}]
    }            
];

function addContent() {
  contents.push({
    role: "user",
    parts: [
      { text: "values.prompt", functionResponse: { name: "Teste", response: "Teste" } },
    ],
  });

  return JSON.stringify(contents)
}

let response = addContent();
console.log(response);
`interface ContentProps {
  role: string;
  parts: [
    {
      text: string;
      functionResponse?: {
        name: string;
        response: string;
      };
    }
  ];
}

let contents: ContentProps[] = [
  {
    role: "user",
    parts: [{ text: "values.prompt" }],
  },
];

// Assuming function_response_part is correctly defined
contents.push({
  role: "function",
  parts: [
    {
      functionResponse: function_response_part,
    },
  ],
});`