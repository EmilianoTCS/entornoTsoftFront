export default async function SendFilesService(url, file, data) {
  const baseURL = `http://localhost/entornoTsoft/${url}`;

  const formData = new FormData();
  formData.append("file", file);
  formData.append("data", JSON.stringify(data));

  const res = await fetch(baseURL, {
    method: "post",
    body: formData,
  });
  const response = await res.json();
  const data_1 = response;
  return data_1;
}
