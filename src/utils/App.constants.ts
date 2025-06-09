export const MINIMUM_SELECTION_SIZE = 60;

export const MESSAGE_TO_AI = {
  type: "text",
  text: `Imagine you're a shopkeeper analyzing your store's shelf. Please carefully observe and describe all the products visible on the shelf. Return in JSON format. After the content is returned, I will use JSON.parse to collect the data. Use the following JSON format:

{
  "1st image": [{ shelf: "1", "products": ["Product A", "Product B"] }, { shelf: "2", "products": ["Product E", "Product F"] }],
  "2nd image": [{ shelf: "1", "products": ["Product C", "Product D"] }]
}

If possible, include product types, packaging details, and any readable labels or brands. This will help me understand the shelf layout and the variety of items. Please return only the raw JSON object without any Markdown formatting, code block (no \`\`\`), or surrounding text. Just output plain JSON so I can parse it directly with JSON.parse.`,
};
