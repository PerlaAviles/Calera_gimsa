const equipo = JSON.parse(localStorage.getItem("equipoSeleccionado"));
const form = document.getElementById("editForm");

if (!equipo) {
  form.innerHTML = "<p>No se encontró información del equipo.</p>";
} else {
  form.innerHTML = `
    <label>ID:</label>
    <input type="text" id="id" value="${equipo.id}" readonly />
    <label>No. de Serie:</label>
    <input type="text" id="noSerie" value="${equipo.noSerie || ''}" />
    <label>Modelo:</label>
    <input type="text" id="modelo" value="${equipo.modelo || ''}" />
    <!-- Resto de campos... -->
    <button type="submit">Guardar Cambios</button>
  `;
}

// Mismo script de guardar que ya usabas...
form.addEventListener("submit", function (e) {
  e.preventDefault();

  const id = document.getElementById("id").value;
  const body = {
    noSerie: document.getElementById("noSerie").value,
    modelo: document.getElementById("modelo").value,
    // Otros campos...
  };

  fetch("https://67f41119cbef97f40d2d4366.mockapi.io/datos/" + id, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body)
  })
    .then(() => {
      document.getElementById("saveMessage").innerText = "Cambios guardados correctamente.";
    })
    .catch(() => {
      document.getElementById("saveMessage").innerText = "Error al guardar los cambios.";
    });
});
