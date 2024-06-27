export default function SendDataService(url, operationUrl, data) {
  const baseURL = `https://entornotsoft-backend.000webhostapp.com/${url}?${operationUrl}`;

  return fetch(baseURL, {
    method: "post",
    body: JSON.stringify(data),

  })
    .then((res) => res.json())
    .then((response) => {
      const data = response;

      return data;
    });
}
