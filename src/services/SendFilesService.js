export default function SendFilesService(url, file, data) {
  const baseURL = `https://entornotsoft-backend.000webhostapp.com/${url}`;

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
