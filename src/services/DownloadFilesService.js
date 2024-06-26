import React from "react";

export default function DownloadFilesService({
  baseURL,
  nomTabla,
  idRegistro,
  children,
  title,
}) {
  // Construir la URL con los parámetros
  const url = `${baseURL}?nomTabla=${encodeURIComponent(
    nomTabla
  )}&idRegistro=${idRegistro}`;

  return (
    <a title={title} href={url}>
      {children}
    </a>
  );
}
