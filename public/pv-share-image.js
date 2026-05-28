/* Palabra Viva — Compartir como imagen universal v1 */
(() => {
  const IMGS = [
    "1506905925346-21bda4d32df4",
    "1447752875215-b2761acb3c5d",
    "1465146344425-f00d5f5c8f07",
    "1504701954957-2010ec3bcec1",
    "1519681393784-d120267933ba",
    "1501854140801-50d01698950b",
    "1425913397330-cf8af2ff40a1",
    "1470770903676-69b98201ea1c",
    "1462275646964-a0e3386b89fa",
    "1433086966358-54859d0ed716",
    "1476231682828-37e571bc172f",
    "1523712999610-f77fbcfc3843",
    "1432405972618-c60b0225b8f9",
    "1500534314209-a25ddb2bd429",
    "1464822759023-fed622ff2c3b",
    "1426604966848-d7adac402bff",
    "1510784722466-f2aa240a4a05",
    "1534088568595-a066f410bcda",
    "1502082553048-f009c37129b9",
    "1474524955719-b9f87c50ce47",
    "1499336315816-097655dcfbda",
    "1472214103451-9374bd1c798e",
    "1548679847-1d4ff48016c0",
    "1518791841217-8f162f1912da",
    "1509316785289-025f5b846b35",
    "1540979388789-6cee28a1cdc9",
    "1528360983277-13d401cdc186",
    "1557804506-669a67965ba0",
    "1490750967868-88df5691cc4f",
    "1518156677180-95a2893f3e9f",
    "1462275646964-a0e3386b89fa",
    "1432405972618-c60b0225b8f9",
    "1426604966848-d7adac402bff",
    "1510784722466-f2aa240a4a05",
    "1474524955719-b9f87c50ce47",
    "1534088568595-a066f410bcda",
    "1499336315816-097655dcfbda",
    "1528360983277-13d401cdc186"
  ];

  const GRADS = [
    ["#0d1b2a","#1b4f72","#2e86c1"],
    ["#1b4332","#196f3d","#40916c"],
    ["#3d2314","#7f4f24","#936639"],
    ["#2c1b58","#4a235a","#6c3483"],
    ["#1c2833","#2c3e50","#34495e"],
    ["#641e16","#922b21","#b03a2e"],
    ["#0e2742","#1a5276","#117864"],
    ["#0b3d0b","#145a32","#1e8449"]
  ];

  function randomImg() {
    var id = IMGS[Math.floor(Math.random() * IMGS.length)];
    return "https://images.unsplash.com/photo-" + id + "?auto=format&fit=crop&w=1080&q=85&_t=" + Math.floor(Date.now() / 3600000);
  }

  async function share(opts) {
    var text     = opts.text     || "";
    var ref      = opts.ref      || "";
    var subtitle = opts.subtitle || "";
    var btn      = opts.btn;
    var orig     = btn ? btn.innerHTML : "";

    if (btn) { btn.disabled = true; btn.innerHTML = "⏳"; }

    var ok = false;
    if (navigator.canShare) {
      try {
        var blob = await buildImage(text, ref, subtitle);
        var file = new File([blob], "palabraviva.jpg", { type: "image/jpeg" });
        if (navigator.canShare({ files: [file] })) {
          await navigator.share({ files: [file] });
          ok = true;
        }
      } catch(e) { console.warn("[PVShare] imagen falló:", e); }
    }
    if (!ok) {
      var shareText = (ref ? ref + "\n\n" : "") + text + "\n\nPalabra Viva";
      if (navigator.share) {
        try { await navigator.share({ title: ref || "Palabra Viva", text: shareText }); ok = true; } catch {}
      }
      if (!ok && navigator.clipboard && navigator.clipboard.writeText) {
        try { await navigator.clipboard.writeText(shareText); ok = true; } catch {}
      }
    }
    if (btn) { btn.innerHTML = orig; btn.disabled = false; }
    return ok;
  }

  async function buildImage(text, ref, subtitle) {
    var W = 1080, H = 1920;
    var cv = document.createElement("canvas");
    cv.width = W; cv.height = H;
    var ctx = cv.getContext("2d");

    var photoOk = false;
    try {
      var bg = new Image();
      bg.crossOrigin = "anonymous";
      await new Promise(function(res, rej) {
        var t = setTimeout(rej, 9000);
        bg.onload  = function() { clearTimeout(t); res(); };
        bg.onerror = function() { clearTimeout(t); rej(); };
        bg.src = randomImg();
      });
      var sc = Math.max(W / bg.width, H / bg.height);
      ctx.drawImage(bg, (W - bg.width * sc) / 2, (H - bg.height * sc) / 2, bg.width * sc, bg.height * sc);
      photoOk = true;
    } catch(e) {}

    if (!photoOk) {
      var g = GRADS[Math.floor(Math.random() * GRADS.length)];
      var gr = ctx.createLinearGradient(0, 0, 0, H);
      gr.addColorStop(0, g[0]); gr.addColorStop(0.5, g[1]); gr.addColorStop(1, g[2]);
      ctx.fillStyle = gr; ctx.fillRect(0, 0, W, H);
    }

    var ov = ctx.createLinearGradient(0, 0, 0, H);
    ov.addColorStop(0,    "rgba(0,0,0,0.12)");
    ov.addColorStop(0.35, "rgba(0,0,0,0.40)");
    ov.addColorStop(0.65, "rgba(0,0,0,0.68)");
    ov.addColorStop(1,    "rgba(0,0,0,0.90)");
    ctx.fillStyle = ov; ctx.fillRect(0, 0, W, H);

    ctx.textAlign    = "center";
    ctx.textBaseline = "middle";

    var bodyTxt = text.length > 280 ? text.slice(0, 280) + "..." : text;
    var refTop  = ref ? H / 2 - 220 : H / 2;

    if (ref) {
      ctx.font      = "600 44px sans-serif";
      ctx.fillStyle = "rgba(255,255,255,0.72)";
      ctx.fillText(ref.slice(0, 50), W / 2, refTop);
    }

    ctx.font      = "italic 60px Georgia, serif";
    ctx.fillStyle = "#ffffff";
    var bodyStartY = ref ? refTop + 80 : H / 2 - 100;
    wrapText(ctx, bodyTxt, W / 2, bodyStartY, W - 160, 82);

    if (subtitle) {
      ctx.font      = "500 36px sans-serif";
      ctx.fillStyle = "rgba(255,255,255,0.60)";
      ctx.textBaseline = "bottom";
      ctx.fillText(subtitle.slice(0, 50), W / 2, H - 120);
    }

    ctx.font         = "300 28px sans-serif";
    ctx.fillStyle    = "rgba(255,255,255,0.38)";
    ctx.textBaseline = "bottom";
    ctx.fillText("Palabra Viva", W / 2, H - 55);

    return new Promise(function(resolve, reject) {
      try { cv.toBlob(function(b) { b ? resolve(b) : reject(new Error("null blob")); }, "image/jpeg", 0.92); }
      catch(e) { reject(e); }
    });
  }

  function wrapText(ctx, text, x, startY, maxW, lineH) {
    var words = text.split(" ");
    var lines = []; var line = "";
    for (var i = 0; i < words.length; i++) {
      var test = line + words[i] + " ";
      if (i > 0 && ctx.measureText(test).width > maxW) { lines.push(line.trim()); line = words[i] + " "; }
      else { line = test; }
    }
    if (line.trim()) lines.push(line.trim());
    var totalH = (lines.length - 1) * lineH;
    lines.forEach(function(l, i) { ctx.fillText(l, x, startY + i * lineH); });
  }

  window.PVShareImage = { share: share, buildImage: buildImage };
  console.log("[PVShareImage] v1 listo");
})();
