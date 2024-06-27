export default function getDataService(url, operationUrl) {
  const baseURL = `https://entornotsoft-backend.000webhostapp.com/${url}?${operationUrl}`;
ft
  return fetch(baseURL)
    .then((res) => res.json())
    .then((response) => {
      const data = response;
      return data;
    });
}
