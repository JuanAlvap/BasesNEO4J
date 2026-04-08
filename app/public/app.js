const feedbackEl = document.getElementById("feedback");

function formatLikeNotLike(value) {
  if (value === true || value === "true" || value === "megusta") {
    return "megusta";
  }
  return "nomegusta";
}

function formatDate(isoDate) {
  if (!isoDate) return "-";
  try {
    // Parse ISO string directly without timezone conversion issues
    // Format: YYYY-MM-DDTHH:mm:ss[.sss][±HH:mm|Z]
    const isoRegex = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})/;
    const match = isoDate.match(isoRegex);
    
    if (match) {
      const [, year, month, day, hour, minute, second] = match;
      
      // Create date without timezone conversion
      // Use the raw values from the string, don't apply browser timezone
      return `${day}/${month}/${year}, ${hour}:${minute}`;
    }
    
    // Fallback to standard parsing if regex doesn't match
    const date = new Date(isoDate);
    return date.toLocaleString("es-ES", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return isoDate;
  }
}

function toIsoFromDatetimeLocal(value) {
  if (!value) {
    return "";
  }
  return new Date(value).toISOString().slice(0, 19);
}

function toDatetimeLocal(iso) {
  if (!iso) {
    return "";
  }
  return String(iso).slice(0, 16);
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

async function request(url, options = {}) {
  const response = await fetch(url, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });

  const isJson = response.headers
    .get("content-type")
    ?.includes("application/json");
  const payload = isJson ? await response.json() : null;

  if (!response.ok) {
    throw new Error(payload?.message || "Error inesperado");
  }

  return payload;
}

function showFeedback(type, message) {
  feedbackEl.classList.remove("hidden", "ok", "error");
  feedbackEl.classList.add(type);
  feedbackEl.textContent = message;
  setTimeout(() => feedbackEl.classList.add("hidden"), 2500);
}

function wireTabs() {
  const tabs = document.querySelectorAll(".tab");
  const panels = document.querySelectorAll(".panel");

  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      tabs.forEach((t) => t.classList.remove("active"));
      panels.forEach((p) => p.classList.remove("active"));
      tab.classList.add("active");
      document.getElementById(`panel-${tab.dataset.tab}`).classList.add("active");
    });
  });
}

async function renderUsuarios() {
  const tbody = document.getElementById("tbody-usuarios");
  const usuarios = await request("/api/usuarios");
  tbody.innerHTML = usuarios
    .map(
      (u) => `
      <tr>
        <td>${u.idu}</td>
        <td>${escapeHtml(u.nombre)}</td>
      </tr>
    `
    )
    .join("");
}

async function renderPosts() {
  const tbody = document.getElementById("tbody-posts");
  const posts = await request("/api/posts");
  tbody.innerHTML = posts
    .map(
      (p) => `
      <tr>
        <td>${p.idp}</td>
        <td>${escapeHtml(p.contenido)}</td>
        <td>${p.iduAutor}</td>
      </tr>
    `
    )
    .join("");
}

async function renderComentarios() {
  const tbody = document.getElementById("tbody-comentarios");
  const comentarios = await request("/api/comentarios");
  tbody.innerHTML = comentarios
    .map(
      (c) => `
      <tr>
        <td>${c.consec}</td>
        <td>${c.idp}</td>
        <td>${escapeHtml(c.contenidoCom)}</td>
        <td>${formatLikeNotLike(c.likeNotLike)}</td>
        <td>${c.iduAutor}</td>
        <td>${c.iduAutorizador}</td>
        <td>${formatDate(c.fechorCom)}</td>
        <td>${formatDate(c.fechorAut)}</td>
      </tr>
    `
    )
    .join("");
}

function closeFormModal() {
  document.getElementById("form-modal").classList.add("hidden");
  // Resetear el botón a su estado inicial
  const btn = document.getElementById("btn-submit-form");
  btn.textContent = "Guardar";
  btn.classList.remove("delete-confirm");
  btn.dataset.action = "";
  btn.dataset.editId = "";
  btn.dataset.editId2 = "";
}

function closeConfirmModal() {
  document.getElementById("confirm-modal").classList.add("hidden");
}

async function openInsertForm(entity) {
  const dynamicForm = document.getElementById("dynamic-form");
  dynamicForm.innerHTML = "";

  if (entity === "usuario") {
    dynamicForm.innerHTML = `
      <div class="form-group">
        <label>ID Usuario:</label>
        <input type="number" id="input-idu" placeholder="1" min="1" required />
      </div>
      <div class="form-group">
        <label>Nombre:</label>
        <input type="text" id="input-nombre" placeholder="Juan" required />
      </div>
    `;
    document.getElementById("form-modal-title").textContent = "Insertar Usuario";
  } else if (entity === "post") {
    dynamicForm.innerHTML = `
      <div class="form-group">
        <label>ID Post:</label>
        <input type="number" id="input-idp" placeholder="1" min="1" required />
      </div>
      <div class="form-group">
        <label>Contenido:</label>
        <textarea id="input-contenido" placeholder="Mi contenido..." required></textarea>
      </div>
      <div class="form-group">
        <label>ID Autor:</label>
        <input type="number" id="input-idu-autor" placeholder="1" min="1" required />
      </div>
    `;
    document.getElementById("form-modal-title").textContent = "Insertar Post";
  } else if (entity === "comentario") {
    dynamicForm.innerHTML = `
      <div class="form-group">
        <label>ID Post:</label>
        <input type="number" id="input-idp" placeholder="1" min="1" required />
      </div>
      <div class="form-group">
        <label>Consecutivo:</label>
        <input type="number" id="input-consec" placeholder="1" min="1" required />
      </div>
      <div class="form-group">
        <label>Contenido:</label>
        <textarea id="input-contenido-com" placeholder="Mi comentario..." required></textarea>
      </div>
      <div class="form-group">
        <label>Fecha Comentario:</label>
        <input type="datetime-local" id="input-fechor-com" required />
      </div>
      <div class="form-group">
        <label>Fecha Autor:</label>
        <input type="datetime-local" id="input-fechor-aut" required />
      </div>
      <div class="form-group">
        <label>Reacción:</label>
        <select id="input-like-not-like" required>
          <option value="">-- Selecciona --</option>
          <option value="megusta">Megusta</option>
          <option value="nomegusta">No Megusta</option>
        </select>
      </div>
      <div class="form-group">
        <label>ID Autor:</label>
        <input type="number" id="input-idu-autor" placeholder="1" min="1" required />
      </div>
      <div class="form-group">
        <label>ID Autorizador:</label>
        <input type="number" id="input-idu-autorizador" placeholder="1" min="1" required />
      </div>
    `;
    document.getElementById("form-modal-title").textContent = "Insertar Comentario";
  }

  document.getElementById("btn-submit-form").dataset.action = `insert-${entity}`;
  document.getElementById("form-modal").classList.remove("hidden");
}

async function openEditIdPrompt(entity) {
  const dynamicForm = document.getElementById("dynamic-form");
  dynamicForm.innerHTML = `
    <div class="form-group">
      <label>${entity === "usuario" ? "ID Usuario:" : entity === "post" ? "ID Post:" : "Consecutivo:"}</label>
      <input type="number" id="input-lookup-id" placeholder="${entity === "comentario" ? "Ingresa el consecutivo" : "Ingresa el ID"}" min="1" required autofocus />
    </div>
  `;
  
  document.getElementById("form-modal-title").textContent = `Editar ${entity === "usuario" ? "Usuario" : entity === "post" ? "Post" : "Comentario"}`;
  document.getElementById("btn-submit-form").textContent = "Continuar";
  document.getElementById("btn-submit-form").dataset.action = `edit-lookup-${entity}`;
  document.getElementById("form-modal").classList.remove("hidden");
  
  // Focus en el input
  setTimeout(() => document.getElementById("input-lookup-id").focus(), 100);
}

async function openDeleteIdPrompt(entity) {
  const dynamicForm = document.getElementById("dynamic-form");
  dynamicForm.innerHTML = `
    <div class="form-group">
      <label>${entity === "usuario" ? "ID Usuario:" : entity === "post" ? "ID Post:" : "Consecutivo:"}</label>
      <input type="number" id="input-lookup-id" placeholder="${entity === "comentario" ? "Ingresa el consecutivo" : "Ingresa el ID"}" min="1" required autofocus />
    </div>
  `;
  
  document.getElementById("form-modal-title").textContent = `Eliminar ${entity === "usuario" ? "Usuario" : entity === "post" ? "Post" : "Comentario"}`;
  document.getElementById("btn-submit-form").textContent = "Continuar";
  document.getElementById("btn-submit-form").dataset.action = `delete-lookup-${entity}`;
  document.getElementById("form-modal").classList.remove("hidden");
  
  // Focus en el input
  setTimeout(() => document.getElementById("input-lookup-id").focus(), 100);
}

async function openEditForm(entity, id, id2 = "") {
  const dynamicForm = document.getElementById("dynamic-form");
  dynamicForm.innerHTML = "";

  try {
    if (entity === "usuario") {
      const usuario = await request(`/api/usuarios/${id}`);
      dynamicForm.innerHTML = `
        <div class="form-group">
          <label>ID Usuario:</label>
          <input type="number" id="input-idu" value="${usuario.idu}" disabled />
        </div>
        <div class="form-group">
          <label>Nombre:</label>
          <input type="text" id="input-nombre" value="${escapeHtml(usuario.nombre)}" required />
        </div>
      `;
    } else if (entity === "post") {
      const post = await request(`/api/posts/${id}`);
      dynamicForm.innerHTML = `
        <div class="form-group">
          <label>ID Post:</label>
          <input type="number" id="input-idp" value="${post.idp}" disabled />
        </div>
        <div class="form-group">
          <label>Contenido:</label>
          <textarea id="input-contenido" required>${escapeHtml(post.contenido)}</textarea>
        </div>
        <div class="form-group">
          <label>ID Autor:</label>
          <input type="number" id="input-idu-autor" value="${post.iduAutor}" required />
        </div>
      `;
    } else if (entity === "comentario") {
      const comentario = await request(`/api/comentarios/${id}`);
      dynamicForm.innerHTML = `
        <div class="form-group">
          <label>Consecutivo:</label>
          <input type="number" id="input-consec" value="${comentario.consec}" disabled />
        </div>
        <div class="form-group">
          <label>ID Post:</label>
          <input type="number" id="input-idp" value="${comentario.idp}" required />
        </div>
        <div class="form-group">
          <label>Contenido:</label>
          <textarea id="input-contenido-com" required>${escapeHtml(comentario.contenidoCom)}</textarea>
        </div>
        <div class="form-group">
          <label>Fecha Comentario:</label>
          <input type="datetime-local" id="input-fechor-com" value="${toDatetimeLocal(comentario.fechorCom)}" required />
        </div>
        <div class="form-group">
          <label>Fecha Autor:</label>
          <input type="datetime-local" id="input-fechor-aut" value="${toDatetimeLocal(comentario.fechorAut)}" required />
        </div>
        <div class="form-group">
          <label>Reacción:</label>
          <select id="input-like-not-like" required>
            <option value="megusta" ${comentario.likeNotLike === "megusta" ? "selected" : ""}>Megusta</option>
            <option value="nomegusta" ${comentario.likeNotLike !== "megusta" ? "selected" : ""}>No Megusta</option>
          </select>
        </div>
        <div class="form-group">
          <label>ID Autor:</label>
          <input type="number" id="input-idu-autor" value="${comentario.iduAutor}" required />
        </div>
        <div class="form-group">
          <label>ID Autorizador:</label>
          <input type="number" id="input-idu-autorizador" value="${comentario.iduAutorizador}" required />
        </div>
      `;
    }

    document.getElementById("btn-submit-form").dataset.action = `edit-${entity}`;
    document.getElementById("btn-submit-form").dataset.editId = id;
    document.getElementById("btn-submit-form").dataset.editId2 = id2;
    document.getElementById("btn-submit-form").textContent = "Actualizar";
    document.getElementById("form-modal-title").textContent = `Editar ${entity.charAt(0).toUpperCase() + entity.slice(1)}`;
  } catch (error) {
    showFeedback("error", error.message);
    closeFormModal();
  }
}

async function openDeletePrompt(entity, id, id2 = "") {
  const dynamicForm = document.getElementById("dynamic-form");
  dynamicForm.innerHTML = "";

  try {
    let data = {};
    if (entity === "usuario") {
      data = await request(`/api/usuarios/${id}`);
      dynamicForm.innerHTML = `
        <div style="text-align: center; margin-bottom: 20px;">
          <p style="font-size: 1.1rem; margin-bottom: 10px;"><strong>ID:</strong> ${data.idu}</p>
          <p style="font-size: 1.1rem; margin-bottom: 10px;"><strong>Nombre:</strong> ${escapeHtml(data.nombre)}</p>
          <p style="color: var(--error); font-weight: 600; margin-top: 16px;">¿Estás seguro de que deseas eliminar este usuario?</p>
        </div>
      `;
    } else if (entity === "post") {
      data = await request(`/api/posts/${id}`);
      dynamicForm.innerHTML = `
        <div style="text-align: center; margin-bottom: 20px;">
          <p style="font-size: 1.1rem; margin-bottom: 10px;"><strong>ID Post:</strong> ${data.idp}</p>
          <p style="font-size: 1rem; margin-bottom: 10px;"><strong>Contenido:</strong></p>
          <p style="background: #f1f5f9; padding: 12px; border-radius: 8px; margin: 10px 0;">"${escapeHtml(data.contenido)}"</p>
          <p style="color: var(--error); font-weight: 600; margin-top: 16px;">¿Estás seguro de que deseas eliminar este post?</p>
        </div>
      `;
    } else if (entity === "comentario") {
      data = await request(`/api/comentarios/${id}`);
      dynamicForm.innerHTML = `
        <div style="text-align: center; margin-bottom: 20px;">
          <p style="font-size: 1.1rem; margin-bottom: 10px;"><strong>Consecutivo:</strong> ${data.consec} | <strong>Post:</strong> ${data.idp}</p>
          <p style="font-size: 1rem; margin-bottom: 10px;"><strong>Contenido:</strong></p>
          <p style="background: #f1f5f9; padding: 12px; border-radius: 8px; margin: 10px 0;">"${escapeHtml(data.contenidoCom)}"</p>
          <p style="color: var(--error); font-weight: 600; margin-top: 16px;">¿Estás seguro de que deseas eliminar este comentario?</p>
        </div>
      `;
    }

    document.getElementById("btn-submit-form").dataset.action = `confirm-delete-${entity}`;
    document.getElementById("btn-submit-form").dataset.editId = id;
    document.getElementById("btn-submit-form").dataset.editId2 = id2;
    document.getElementById("btn-submit-form").textContent = "Sí, eliminar";
    document.getElementById("btn-submit-form").classList.add("delete-confirm");
    document.getElementById("form-modal-title").textContent = `Eliminar ${entity.charAt(0).toUpperCase() + entity.slice(1)}`;
    document.getElementById("form-modal").classList.remove("hidden");
  } catch (error) {
    showFeedback("error", error.message);
    closeFormModal();
  }
}

async function openEditPrompt(entity) {
  await openEditIdPrompt(entity);
}

function wireMenus() {
  document.body.addEventListener("click", (event) => {
    const target = event.target;
    if (!(target instanceof HTMLElement)) return;

    const action = target.dataset.action;
    if (!action) return;

    if (action === "insert-usuario") openInsertForm("usuario");
    else if (action === "edit-usuario") openEditPrompt("usuario");
    else if (action === "delete-usuario") openDeleteIdPrompt("usuario");
    else if (action === "insert-post") openInsertForm("post");
    else if (action === "edit-post") openEditPrompt("post");
    else if (action === "delete-post") openDeleteIdPrompt("post");
    else if (action === "insert-comentario") openInsertForm("comentario");
    else if (action === "edit-comentario") openEditPrompt("comentario");
    else if (action === "delete-comentario") openDeleteIdPrompt("comentario");
  });

  document.querySelectorAll(".btn-menu").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      const container = btn.closest(".menu-container");
      const dropdown = container?.querySelector(".menu-dropdown");
      if (dropdown) {
        // Cierra todos los otros dropdowns
        document.querySelectorAll(".menu-dropdown").forEach((d) => {
          if (d !== dropdown) d.classList.add("hidden");
        });
        // Toggle el dropdown actual
        dropdown.classList.toggle("hidden");
      }
    });
  });

  document.addEventListener("click", (event) => {
    const target = event.target;
    if (!target.closest(".btn-menu")) {
      document.querySelectorAll(".menu-dropdown").forEach((dropdown) => {
        dropdown.classList.add("hidden");
      });
    }
  });
}

function wireFormModal() {
  document.getElementById("btn-submit-form").addEventListener("click", async (event) => {
    const btn = event.currentTarget;
    const action = btn.dataset.action;
    const editId = btn.dataset.editId;
    const editId2 = btn.dataset.editId2;

    try {
      // ---- Acciones de búsqueda de ID para editar ----
      if (action === "edit-lookup-usuario") {
        const id = Number(document.getElementById("input-lookup-id").value);
        if (!id || id <= 0) {
          showFeedback("error", "Por favor ingresa un ID válido");
          return;
        }
        await openEditForm("usuario", id);
      } else if (action === "edit-lookup-post") {
        const id = Number(document.getElementById("input-lookup-id").value);
        if (!id || id <= 0) {
          showFeedback("error", "Por favor ingresa un ID válido");
          return;
        }
        await openEditForm("post", id);
      } else if (action === "edit-lookup-comentario") {
        const id = Number(document.getElementById("input-lookup-id").value);
        if (!id || id <= 0) {
          showFeedback("error", "Por favor ingresa un consecutivo válido");
          return;
        }
        await openEditForm("comentario", id);
      }
      // ---- Acciones de búsqueda de ID para eliminar ----
      else if (action === "delete-lookup-usuario") {
        const id = Number(document.getElementById("input-lookup-id").value);
        if (!id || id <= 0) {
          showFeedback("error", "Por favor ingresa un ID válido");
          return;
        }
        await openDeletePrompt("usuario", id);
      } else if (action === "delete-lookup-post") {
        const id = Number(document.getElementById("input-lookup-id").value);
        if (!id || id <= 0) {
          showFeedback("error", "Por favor ingresa un ID válido");
          return;
        }
        await openDeletePrompt("post", id);
      } else if (action === "delete-lookup-comentario") {
        const id = Number(document.getElementById("input-lookup-id").value);
        if (!id || id <= 0) {
          showFeedback("error", "Por favor ingresa un consecutivo válido");
          return;
        }
        await openDeletePrompt("comentario", id);
      }
      // ---- Acciones de confirmación de eliminación ----
      else if (action === "confirm-delete-usuario") {
        await request(`/api/usuarios/${editId}`, { method: "DELETE" });
        showFeedback("ok", "Usuario eliminado");
        closeFormModal();
        await refreshAllTables();
      } else if (action === "confirm-delete-post") {
        await request(`/api/posts/${editId}`, { method: "DELETE" });
        await renderComentarios();
        showFeedback("ok", "Post eliminado");
        closeFormModal();
        await refreshAllTables();
      } else if (action === "confirm-delete-comentario") {
        await request(`/api/comentarios/${editId}`, { method: "DELETE" });
        showFeedback("ok", "Comentario eliminado");
        closeFormModal();
        await refreshAllTables();
      }
      // ---- Acciones de insertar ----
      else if (action === "insert-usuario") {
        await request("/api/usuarios", {
          method: "POST",
          body: JSON.stringify({
            idu: Number(document.getElementById("input-idu").value),
            nombre: document.getElementById("input-nombre").value.trim(),
          }),
        });
        showFeedback("ok", "Usuario creado");
        closeFormModal();
        await refreshAllTables();
      } else if (action === "insert-post") {
        await request("/api/posts", {
          method: "POST",
          body: JSON.stringify({
            idp: Number(document.getElementById("input-idp").value),
            contenido: document.getElementById("input-contenido").value.trim(),
            iduAutor: Number(document.getElementById("input-idu-autor").value),
          }),
        });
        showFeedback("ok", "Post creado");
        closeFormModal();
        await refreshAllTables();
      } else if (action === "insert-comentario") {
        await request("/api/comentarios", {
          method: "POST",
          body: JSON.stringify({
            idp: Number(document.getElementById("input-idp").value),
            consec: Number(document.getElementById("input-consec").value),
            fechorCom: toIsoFromDatetimeLocal(document.getElementById("input-fechor-com").value),
            contenidoCom: document.getElementById("input-contenido-com").value.trim(),
            fechorAut: toIsoFromDatetimeLocal(document.getElementById("input-fechor-aut").value),
            likeNotLike: document.getElementById("input-like-not-like").value,
            iduAutor: Number(document.getElementById("input-idu-autor").value),
            iduAutorizador: Number(document.getElementById("input-idu-autorizador").value),
          }),
        });
        showFeedback("ok", "Comentario creado");
        closeFormModal();
        await refreshAllTables();
      }
      // ---- Acciones de editar ----
      else if (action === "edit-usuario") {
        await request(`/api/usuarios/${editId}`, {
          method: "PUT",
          body: JSON.stringify({
            nombre: document.getElementById("input-nombre").value.trim(),
          }),
        });
        showFeedback("ok", "Usuario actualizado");
        closeFormModal();
        await refreshAllTables();
      } else if (action === "edit-post") {
        await request(`/api/posts/${editId}`, {
          method: "PUT",
          body: JSON.stringify({
            contenido: document.getElementById("input-contenido").value.trim(),
            iduAutor: Number(document.getElementById("input-idu-autor").value),
          }),
        });
        showFeedback("ok", "Post actualizado");
        closeFormModal();
        await refreshAllTables();
      } else if (action === "edit-comentario") {
        await request(`/api/comentarios/${editId}`, {
          method: "PUT",
          body: JSON.stringify({
            idp: Number(document.getElementById("input-idp").value),
            contenidoCom: document.getElementById("input-contenido-com").value.trim(),
            likeNotLike: document.getElementById("input-like-not-like").value,
            fechorCom: toIsoFromDatetimeLocal(document.getElementById("input-fechor-com").value),
            fechorAut: toIsoFromDatetimeLocal(document.getElementById("input-fechor-aut").value),
            iduAutor: Number(document.getElementById("input-idu-autor").value),
            iduAutorizador: Number(document.getElementById("input-idu-autorizador").value),
          }),
        });
        showFeedback("ok", "Comentario actualizado");
        closeFormModal();
        await refreshAllTables();
      }
    } catch (error) {
      showFeedback("error", error.message);
    }
  });

  document.getElementById("btn-cancel-form").addEventListener("click", closeFormModal);
}

document.getElementById("btn-close-form-modal").addEventListener("click", closeFormModal);
document.getElementById("btn-close-confirm-modal").addEventListener("click", closeConfirmModal);

async function refreshAllTables() {
  await renderUsuarios();
  await renderPosts();
  await renderComentarios();
}

// ========== CONSULTAS ==========

async function ejecutarConsulta1() {
  const idu = Number(document.getElementById("input-consulta1-idu").value);
  if (!idu) {
    showFeedback("error", "Ingresa un ID de usuario válido");
    return;
  }

  const resultsContainer = document.getElementById("resultado-consulta1");
  resultsContainer.innerHTML = "<p>Cargando...</p>";
  resultsContainer.classList.remove("hidden");

  try {
    const result = await request(`/api/consultas/posts-por-usuario/${idu}`);
    
    if (!result.statusOk) {
      throw new Error(result.message || "Error en la consulta");
    }

    if (result.data.length === 0) {
      resultsContainer.innerHTML = `<p class="no-results">${result.message || "El usuario no tiene posts"}</p>`;
      return;
    }

    const usuario = result.data[0];
    resultsContainer.innerHTML = `
      <div class="consultation-result">
        <h4>Posts del usuario ID ${idu}</h4>
        <table>
          <thead>
            <tr>
              <th>ID Post</th>
              <th>Contenido</th>
              <th>Autor ID</th>
            </tr>
          </thead>
          <tbody>
            ${result.data.map(p => `
              <tr>
                <td>${p.idp}</td>
                <td>${escapeHtml(p.contenido)}</td>
                <td>${p.iduAutor}</td>
              </tr>
            `).join("")}
          </tbody>
        </table>
      </div>
    `;
  } catch (error) {
    showFeedback("error", error.message);
    resultsContainer.classList.add("hidden");
  }
}

async function ejecutarConsulta2() {
  const idp = Number(document.getElementById("input-consulta2-idp").value);
  if (!idp) {
    showFeedback("error", "Ingresa un ID de post válido");
    return;
  }

  const resultsContainer = document.getElementById("resultado-consulta2");
  resultsContainer.innerHTML = "<p>Cargando...</p>";
  resultsContainer.classList.remove("hidden");

  try {
    const result = await request(`/api/consultas/comentarios-por-post/${idp}`);
    
    if (!result.statusOk) {
      throw new Error(result.message || "Error en la consulta");
    }

    const postInfo = result.post;
    const comentarios = result.comentarios;

    if (comentarios.length === 0) {
      resultsContainer.innerHTML = `
        <div class="consultation-result">
          <h4>Post ID ${idp} - Autor: ${postInfo.iduAutor}</h4>
          <p class="no-results">Este post no tiene comentarios</p>
        </div>
      `;
      return;
    }

    resultsContainer.innerHTML = `
      <div class="consultation-result">
        <h4>Comentarios del Post ID ${idp}</h4>
        <table>
          <thead>
            <tr>
              <th>Consec.</th>
              <th>Contenido</th>
              <th>Fecha Comentario</th>
              <th>Reacción</th>
              <th>Autor</th>
              <th>Fecha Autorización</th>
              <th>Autorizador</th>
            </tr>
          </thead>
          <tbody>
            ${comentarios.map(c => `
              <tr>
                <td>${c.consec}</td>
                <td>${escapeHtml(c.contenidoCom)}</td>
                <td>${formatDate(c.fechorCom)}</td>
                <td>${formatLikeNotLike(c.likeNotLike)}</td>
                <td>${c.iduAutor}</td>
                <td>${formatDate(c.fechorAut)}</td>
                <td>${c.nombreAutorizador ? `${c.nombreAutorizador} (${c.iduAutorizador})` : "-"}</td>
              </tr>
            `).join("")}
          </tbody>
        </table>
      </div>
    `;
  } catch (error) {
    showFeedback("error", error.message);
    resultsContainer.classList.add("hidden");
  }
}

function wireConsultas() {
  // Wire tab navigation
  const consultaTabs = document.querySelectorAll(".consultation-tab");
  const consultaPanels = document.querySelectorAll(".consultation-panel");

  consultaTabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      const consultaId = tab.dataset.consulta;

      // Remove active from all tabs and panels
      consultaTabs.forEach((t) => t.classList.remove("active"));
      consultaPanels.forEach((p) => p.classList.remove("active"));

      // Add active to selected tab and panel
      tab.classList.add("active");
      document.getElementById(`${consultaId}-panel`).classList.add("active");
    });
  });

  // Wire search buttons
  document.getElementById("btn-consulta1").addEventListener("click", ejecutarConsulta1);
  document.getElementById("btn-consulta2").addEventListener("click", ejecutarConsulta2);

  // Allow Enter key to trigger search
  document.getElementById("input-consulta1-idu").addEventListener("keypress", (e) => {
    if (e.key === "Enter") ejecutarConsulta1();
  });
  document.getElementById("input-consulta2-idp").addEventListener("keypress", (e) => {
    if (e.key === "Enter") ejecutarConsulta2();
  });
}

async function boot() {
  wireTabs();
  wireMenus();
  wireFormModal();
  wireConsultas();
  await refreshAllTables();
}

boot().catch((error) => showFeedback("error", error.message));
