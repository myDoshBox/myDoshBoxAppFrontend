// utils/searchFilter.js



export const searchFilter = (data, query, keys) => {
  if (!query) return data;

  const lowerQuery = query.toLowerCase();

  return data.filter((item) =>
    keys.some((key) =>
      String(item[key] || "").toLowerCase().includes(lowerQuery)
    )
  );
};
