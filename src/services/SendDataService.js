export default async function SendDataService(url, operationUrl, data) {
  const baseURL = `http://localhost/entornoTsoft/${url}?${operationUrl}`;

  const res = await fetch(baseURL, {
    method: "post",
    body: JSON.stringify(data),
  });
  const response = await res.json();
  const data_1 = response;
  return data_1;
}
