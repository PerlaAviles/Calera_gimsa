document.getElementById("searchButton").addEventListener("click", () => {
    const query = document.getElementById("searchInput").value.trim().toLowerCase();
    const warningMessage = document.getElementById("warningMessage");
  
    warningMessage.classList.add("hidden");
    document.getElementById("searchResult").innerText = "";
  
    if (!query) {
      warningMessage.innerText = "Por favor, ingrese un ID o número de serie válido.";
      warningMessage.classList.remove("hidden");
      return;
    }
  
    fetch("https://67f41119cbef97f40d2d4366.mockapi.io/datos")
      .then(res => res.json())
      .then(data => {
        const resultado = data.find(item =>
          item.id.toLowerCase() === query || item.noSerie?.toLowerCase() === query
        );
  
        if (resultado) {
          const equipoInfoWindow = window.open("", "_blank", "width=800,height=800");
          equipoInfoWindow.document.write(`
            <html>
            <head>
            <link rel="stylesheet" href="styleses.css" />

              <title>Editar Equipo</title>
              <style>
                body { font-family: Arial; padding: 20px; }
                input, textarea { width: 100%; padding: 8px; margin-bottom: 10px; }
                label { font-weight: bold; }
                button { padding: 10px 20px; margin-top: 15px; background-color: #4c51bf; color: white; border: none; border-radius: 5px; cursor: pointer; }
              </style>
            </head>
            <body>
              <h2>Editar Información del Equipo</h2>
              <form id="editForm">
                <label>ID:</label>
                <input type="text" id="id" value="${resultado.id}" readonly />
                
                <label>No. de Serie:</label>
                <input type="text" id="noSerie" value="${resultado.noSerie || ''}" readonly />
  
                <label>Modelo:</label>
                <input type="text" id="modelo" value="${resultado.modelo || ''}" readonly/>
  
                <label>Fecha de Adquisición:</label>
                <input type="date" id="fechaAdquisicion" value="${resultado.fechaAdquisicion || ''}" readonly/>
  
                <label>Tipo:</label>
                <input type="text" id="tipo" value="${resultado.tipo || ''}" readonly/>
  
                <label>Marca:</label>
                <input type="text" id="marca" value="${resultado.marca || ''}" readonly/>
  
                <label>Características:</label>
                <textarea id="caracteristicas">${resultado.caracteristicas || ''}</textarea>
  
                <h3>Historial de Mantenimiento</h3>
                <div id="historialContainer">
                  ${(resultado.historial_mantenimiento || []).map((item) => `
                    <div class="historial-item" style="margin-bottom:10px;">
                      <label>Fecha:</label>
                      <input type="date" value="${item.fecha}" class="historial-fecha" />
                      <label>Actividad:</label>
                      <input type="text" value="${item.actividad}" class="historial-actividad" />
                      <label>Técnico:</label>
                      <input type="text" value="${item.tecnico}" class="historial-tecnico" />
                    </div>
                  `).join("")}
                </div>
                <button type="submit">Guardar Cambios</button>
              </form>
              <p id="saveMessage" style="margin-top: 15px;"></p>
  
              <script>
                document.getElementById("editForm").addEventListener("submit", function(e) {
                  e.preventDefault();
  
                  const id = document.getElementById("id").value;
                  const body = {
                    noSerie: document.getElementById("noSerie").value,
                    modelo: document.getElementById("modelo").value,
                    fechaAdquisicion: document.getElementById("fechaAdquisicion").value,
                    tipo: document.getElementById("tipo").value,
                    marca: document.getElementById("marca").value,
                    caracteristicas: document.getElementById("caracteristicas").value,
                    historial_mantenimiento: []
                  };
  
                  const historialItems = document.querySelectorAll(".historial-item");
                  historialItems.forEach(item => {
                    const fecha = item.querySelector(".historial-fecha").value;
                    const actividad = item.querySelector(".historial-actividad").value;
                    const tecnico = item.querySelector(".historial-tecnico").value;
                    if (fecha && actividad && tecnico) {
                      body.historial_mantenimiento.push({ fecha, actividad, tecnico });
                    }
                  });
  
                  fetch("https://67f41119cbef97f40d2d4366.mockapi.io/datos/" + id, {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(body)
                  })
                  .then(res => res.json())
                  .then(() => {
                    document.getElementById("saveMessage").innerText = "Cambios guardados correctamente.";
                  })
                  .catch(err => {
                    console.error(err);
                    document.getElementById("saveMessage").innerText = "Error al guardar los cambios.";
                  });
                });
              </script>
              <script src="edita-equipo.js"></script>

            </body>
            </html>
          `);
        } else {
          document.getElementById("searchResult").innerText = "No se encontró el equipo con ese ID o número de serie.";
        }
      })
      .catch(err => {
        console.error(err);
        warningMessage.innerText = "Error al buscar los datos.";
        warningMessage.classList.remove("hidden");
      });
  });
  