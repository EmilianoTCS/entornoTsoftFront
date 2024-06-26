export default function SendFilesService(url, file, data) {
  const baseURL = `http://localhost/entornoTsoft/${url}`;

  const formData = new FormData();
  formData.append("file", file);
  formData.append("data", JSON.stringify(data));

  return fetch(baseURL, {
    method: "post",
    body: formData,
    
  })
    .then((res) => res.json())
    .then((response) => {
      const data = response;

      return data;
    });
}
