export const fetchSchemaData = async (urlId: number) => {
  try {
    const response = await fetch(
      'https://4b3ed538-a09f-47cc-ab41-9f6815ef1c57.mock.pstmn.io/get_schema',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url_id: urlId }),
      }
    );

    if (!response.ok) {
      throw new Error(`Server responded with status ${response.status}`);
    }

    const data = await response.json();

    if (!data?.schema_data || !Array.isArray(data.schema_data)) {
      throw new Error("Invalid schema_data format in response");
    }

    return data.schema_data.slice(0, 17); // Adjust if needed
  } catch (error) {
    console.error('Error fetching schema:', error);
    throw error;
  }
};
