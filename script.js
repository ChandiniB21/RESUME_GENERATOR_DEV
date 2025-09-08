// Single-form version using plain JS + localStorage
(function () {
  const qs = (s) => document.querySelector(s);
  const qa = (s) => Array.from(document.querySelectorAll(s));

  const data = loadFromStorage() || getDefaultData();
  const els = {
    // core
    fullName: qs("#fullName"),
    email: qs("#email"),
    phone: qs("#phone"),
    location: qs("#location"),
    summary: qs("#summary"),
    github: qs("#github"),
    linkedin: qs("#linkedin"),
    portfolio: qs("#portfolio"),
    website: qs("#website"),

    expList: qs("#experienceList"),
    eduList: qs("#educationList"),
    skillsList: qs("#skillsList"),
    projectsList: qs("#projectsList"),

    btnSave: qs("#btn-save"),
    btnSave2: qs("#btn-save-2"),
    btnClear: qs("#btn-clear"),
    btnClear2: qs("#btn-clear-2"),
    btnPreview: qs("#btn-preview"),
    btnPreview2: qs("#btn-preview-2"),
    addExperience: qs("#addExperience"),
    addEducation: qs("#addEducation"),
    addSkill: qs("#addSkill"),
    addProject: qs("#addProject"),
  };

  // ===== Defaults (mirrors your zip structure) =====
  function getDefaultData() {
    return {
      personalInfo: {
        fullName: "",
        email: "",
        phone: "",
        location: "",
        summary: "",
      },
      publicLinks: {
        github: "",
        linkedin: "",
        portfolio: "",
        website: "",
      },
      experience: [],
      education: [],
      skills: [],
      projects: [],
    };
  }

  // ===== Init form with stored data =====
  function initForm() {
    const { personalInfo, publicLinks } = data;
    els.fullName.value = personalInfo.fullName || "";
    els.email.value = personalInfo.email || "";
    els.phone.value = personalInfo.phone || "";
    els.location.value = personalInfo.location || "";
    els.summary.value = personalInfo.summary || "";

    els.github.value = publicLinks.github || "";
    els.linkedin.value = publicLinks.linkedin || "";
    els.portfolio.value = publicLinks.portfolio || "";
    els.website.value = publicLinks.website || "";

    renderExperience();
    renderEducation();
    renderSkills();
    renderProjects();
  }

  // ===== Storage =====
  function saveToStorage() {
    try {
      localStorage.setItem("resumeData", JSON.stringify(data));
      toast("Saved", "Your progress has been saved locally.");
    } catch (e) {
      alert("Unable to save to localStorage. Check browser settings.");
    }
  }
  function loadFromStorage() {
    try {
      const raw = localStorage.getItem("resumeData");
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  }
  function clearAll() {
    if (!confirm("Clear all fields?")) return;
    const fresh = getDefaultData();
    Object.assign(data.personalInfo, fresh.personalInfo);
    Object.assign(data.publicLinks, fresh.publicLinks);
    data.experience = [];
    data.education = [];
    data.skills = [];
    data.projects = [];
    initForm();
    saveToStorage();
  }

  // ===== Mini toast =====
  function toast(title, msg) {
    const div = document.createElement("div");
    div.className = "toast";
    div.style.cssText = `
      position: fixed; right: 16px; bottom: 16px; z-index: 9999;
      background: #0f172a; border: 1px solid #233156; color: #e6edf7;
      padding: 12px 14px; border-radius: 10px; box-shadow: 0 8px 20px rgba(0,0,0,.35);
      max-width: 300px; font-size: 14px;
    `;
    div.innerHTML = `<strong>${title}</strong><div style="opacity:.8;margin-top:6px">${msg}</div>`;
    document.body.appendChild(div);
    setTimeout(() => div.remove(), 2200);
  }

  // ===== Bind top fields -> data =====
  ["input", "change"].forEach((evt) => {
    els.fullName.addEventListener(
      evt,
      (e) => (data.personalInfo.fullName = e.target.value)
    );
    els.email.addEventListener(
      evt,
      (e) => (data.personalInfo.email = e.target.value)
    );
    els.phone.addEventListener(
      evt,
      (e) => (data.personalInfo.phone = e.target.value)
    );
    els.location.addEventListener(
      evt,
      (e) => (data.personalInfo.location = e.target.value)
    );
    els.summary.addEventListener(
      evt,
      (e) => (data.personalInfo.summary = e.target.value)
    );

    els.github.addEventListener(
      evt,
      (e) => (data.publicLinks.github = e.target.value)
    );
    els.linkedin.addEventListener(
      evt,
      (e) => (data.publicLinks.linkedin = e.target.value)
    );
    els.portfolio.addEventListener(
      evt,
      (e) => (data.publicLinks.portfolio = e.target.value)
    );
    els.website.addEventListener(
      evt,
      (e) => (data.publicLinks.website = e.target.value)
    );
  });

  // ===== Experience =====
  els.addExperience.addEventListener("click", () => {
    data.experience.push({
      jobTitle: "",
      company: "",
      startDate: "",
      endDate: "",
      current: false,
      description: "",
    });
    renderExperience();
    saveToStorage();
  });
  function renderExperience() {
    els.expList.innerHTML = "";
    data.experience.forEach((exp, i) => {
      const div = document.createElement("div");
      div.className = "list-item";
      div.innerHTML = `
        <div class="list-item-header">
          <span class="list-item-title">Experience ${i + 1}</span>
          <div class="row" style="grid-template-columns:auto auto; gap:6px">
            <button class="btn btn-small btn-danger" data-remove="${i}">Remove</button>
          </div>
        </div>
        <div class="row row-2">
          <label>Job Title <input class="input" data-k="jobTitle" data-i="${i}" value="${escapeHtml(
        exp.jobTitle
      )}"></label>
          <label>Company <input class="input" data-k="company" data-i="${i}" value="${escapeHtml(
        exp.company
      )}"></label>
        </div>
        <div class="row row-3">
          <label>Start Date <input class="input" type="date" data-k="startDate" data-i="${i}" value="${
        exp.startDate || ""
      }"></label>
          <label>End Date <input class="input" type="date" data-k="endDate" data-i="${i}" ${
        exp.current ? "disabled" : ""
      } value="${exp.endDate || ""}"></label>
          <label class="full" style="display:flex;align-items:center;gap:10px;grid-column:auto/auto">
            <input type="checkbox" data-k="current" data-i="${i}" ${
        exp.current ? "checked" : ""
      }/>
            Currently working here
          </label>
        </div>
        <label>Description
          <textarea class="textarea" data-k="description" data-i="${i}" rows="3">${escapeHtml(
        exp.description || ""
      )}</textarea>
        </label>
      `;
      div.querySelector("[data-remove]").addEventListener("click", () => {
        data.experience.splice(i, 1);
        renderExperience();
        saveToStorage();
      });
      attachChangeHandlers(
        div,
        data.experience,
        i,
        (arr, idx, key, val, el) => {
          if (key === "current") {
            arr[idx].current = el.checked;
            // toggle endDate input
            const endInput = div.querySelector('input[data-k="endDate"]');
            if (endInput) {
              endInput.disabled = el.checked;
              if (el.checked) endInput.value = "";
              arr[idx].endDate = "";
            }
          } else {
            arr[idx][key] = val;
          }
        }
      );
      els.expList.appendChild(div);
    });
  }

  // ===== Education =====
  els.addEducation.addEventListener("click", () => {
    data.education.push({
      degree: "",
      institution: "",
      startDate: "",
      endDate: "",
      description: "",
    });
    renderEducation();
    saveToStorage();
  });
  function renderEducation() {
    els.eduList.innerHTML = "";
    data.education.forEach((edu, i) => {
      const div = document.createElement("div");
      div.className = "list-item";
      div.innerHTML = `
        <div class="list-item-header">
          <span class="list-item-title">Education ${i + 1}</span>
          <button class="btn btn-small btn-danger" data-remove="${i}">Remove</button>
        </div>
        <div class="row row-2">
          <label>Degree/Course <input class="input" data-k="degree" data-i="${i}" value="${escapeHtml(
        edu.degree
      )}"></label>
          <label>Institution <input class="input" data-k="institution" data-i="${i}" value="${escapeHtml(
        edu.institution
      )}"></label>
        </div>
        <div class="row row-2">
          <label>Start Date <input class="input" type="date" data-k="startDate" data-i="${i}" value="${
        edu.startDate || ""
      }"></label>
          <label>End Date <input class="input" type="date" data-k="endDate" data-i="${i}" value="${
        edu.endDate || ""
      }"></label>
        </div>
        <label>Description
          <textarea class="textarea" data-k="description" data-i="${i}" rows="3">${escapeHtml(
        edu.description || ""
      )}</textarea>
        </label>
      `;
      div.querySelector("[data-remove]").addEventListener("click", () => {
        data.education.splice(i, 1);
        renderEducation();
        saveToStorage();
      });
      attachChangeHandlers(div, data.education, i);
      els.eduList.appendChild(div);
    });
  }

  // ===== Skills =====
  els.addSkill.addEventListener("click", () => {
    data.skills.push({ name: "", category: "", level: "Beginner" });
    renderSkills();
    saveToStorage();
  });
  function renderSkills() {
    els.skillsList.innerHTML = "";
    data.skills.forEach((skill, i) => {
      const div = document.createElement("div");
      div.className = "list-item";
      div.innerHTML = `
        <div class="list-item-header">
          <span class="list-item-title">Skill ${i + 1}</span>
          <button class="btn btn-small btn-danger" data-remove="${i}">Remove</button>
        </div>
        <div class="row row-3">
          <label>Skill Name <input class="input" data-k="name" data-i="${i}" value="${escapeHtml(
        skill.name
      )}"></label>
          <label>Category <input class="input" data-k="category" data-i="${i}" placeholder="Programming, Design..." value="${escapeHtml(
        skill.category
      )}"></label>
          <label>Level
            <select class="select" data-k="level" data-i="${i}">
              <option ${
                skill.level === "Beginner" ? "selected" : ""
              }>Beginner</option>
              <option ${
                skill.level === "Intermediate" ? "selected" : ""
              }>Intermediate</option>
              <option ${
                skill.level === "Expert" ? "selected" : ""
              }>Expert</option>
            </select>
          </label>
        </div>
      `;
      div.querySelector("[data-remove]").addEventListener("click", () => {
        data.skills.splice(i, 1);
        renderSkills();
        saveToStorage();
      });
      attachChangeHandlers(div, data.skills, i);
      els.skillsList.appendChild(div);
    });
  }

  // ===== Projects =====
  els.addProject.addEventListener("click", () => {
    data.projects.push({ name: "", description: "" });
    renderProjects();
    saveToStorage();
  });
  function renderProjects() {
    els.projectsList.innerHTML = "";
    data.projects.forEach((project, i) => {
      const div = document.createElement("div");
      div.className = "list-item";
      div.innerHTML = `
        <div class="list-item-header">
          <span class="list-item-title">Project ${i + 1}</span>
          <button class="btn btn-small btn-danger" data-remove="${i}">Remove</button>
        </div>
        <label>Project Name <input class="input" data-k="name" data-i="${i}" value="${escapeHtml(
        project.name
      )}"></label>
        <label>Description <textarea class="textarea" rows="3" data-k="description" data-i="${i}">${escapeHtml(
        project.description || ""
      )}</textarea></label>
      `;
      div.querySelector("[data-remove]").addEventListener("click", () => {
        data.projects.splice(i, 1);
        renderProjects();
        saveToStorage();
      });
      attachChangeHandlers(div, data.projects, i);
      els.projectsList.appendChild(div);
    });
  }

  // ===== Helpers =====
  function attachChangeHandlers(scopeEl, arr, idx, onSpecial) {
    // text inputs + textarea
    scopeEl
      .querySelectorAll(
        'input[data-k]:not([type="checkbox"]), textarea[data-k], select[data-k]'
      )
      .forEach((el) => {
        el.addEventListener("input", () => {
          const k = el.getAttribute("data-k");
          const v = el.tagName === "SELECT" ? el.value : el.value;
          if (onSpecial) onSpecial(arr, idx, k, v, el);
          else arr[idx][k] = v;
          saveToStorage();
        });
        el.addEventListener("change", () => {
          const k = el.getAttribute("data-k");
          const v = el.tagName === "SELECT" ? el.value : el.value;
          if (onSpecial) onSpecial(arr, idx, k, v, el);
          else arr[idx][k] = v;
          saveToStorage();
        });
      });
    // checkboxes
    scopeEl.querySelectorAll('input[type="checkbox"][data-k]').forEach((el) => {
      el.addEventListener("change", () => {
        const k = el.getAttribute("data-k");
        if (onSpecial) onSpecial(arr, idx, k, el.checked, el);
        else arr[idx][k] = el.checked;
        saveToStorage();
      });
    });
  }

  function escapeHtml(s = "") {
    return s.replace(
      /[&<>"']/g,
      (c) =>
        ({
          "&": "&amp;",
          "<": "&lt;",
          ">": "&gt;",
          '"': "&quot;",
          "'": "&#039;",
        }[c])
    );
  }

  // ===== Validate required minimal ATS fields =====
  function validate() {
    const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(els.email.value.trim());
    const phoneDigits = (els.phone.value.match(/\d/g) || []).length;
    if (
      !els.fullName.value.trim() ||
      !els.summary.value.trim() ||
      !emailOk ||
      phoneDigits < 7
    ) {
      alert(
        "Please fill: Full Name, valid Email, valid Phone (≥7 digits), and Summary."
      );
      return false;
    }
    return true;
  }

  // ===== Preview (new window) =====
  function openPreview() {
    if (!validate()) return;
    saveToStorage();
    const w = window.open("preview.html", "_blank");
    if (!w) alert("Please allow popups to see preview.");
  }

  // ===== Bind header/footer buttons =====
  [els.btnSave, els.btnSave2].forEach((b) =>
    b.addEventListener("click", saveToStorage)
  );
  [els.btnClear, els.btnClear2].forEach((b) =>
    b.addEventListener("click", clearAll)
  );
  [els.btnPreview, els.btnPreview2].forEach((b) =>
    b.addEventListener("click", openPreview)
  );

  // Init
  initForm();
})();
