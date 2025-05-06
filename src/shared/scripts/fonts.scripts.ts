if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", () => {
    loadFont();
  });
} else {
  loadFont();
}

function loadFont(): void {
  const notoSanFontFace = new FontFace(
    "Noto Sans",
    "url(https://fonts.gstatic.com/s/notosans/v39/o-0bIpQlx3QUlC5A4PNB6Ryti20_6n1iPHjc5a7duw.woff2)",
    {
      display: "swap",
      weight: "100 900",
      style: "normal",
      stretch: '100%',
    }
  );

  notoSanFontFace
    .load()
    .then((fontface) => {
      document.fonts.add(fontface);
    })
    .catch((err) => {
      console.warn(err);
    });
}
