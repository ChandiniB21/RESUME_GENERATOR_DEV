// Single-form version using plain JS + localStorage

(function () {
  const qs = (s) => document.querySelector(s);
  const qa = (s) => Array.from(document.querySelectorAll(s));

  const data = loadFromStorage() || getDefaultData();
  // --- MIGRATION / NORMALIZATION: make sure all fields exist even if old localStorage is loaded
  (() => {
    const def = getDefaultData();
    // ensure nested objects have all keys
    data.personalInfo = { ...def.personalInfo, ...(data.personalInfo || {}) };
    data.publicLinks = { ...def.publicLinks, ...(data.publicLinks || {}) };
    // ensure arrays always exist
    [
      "experience",
      "education",
      "skills",
      "projects",
      "certifications",
      "internships",
      "hobbies",
      "languages",
    ].forEach((k) => {
      if (!Array.isArray(data[k])) data[k] = [];
    });
  })();
  if (typeof data.additionalInfo !== "string") data.additionalInfo = "";
  if (typeof data.declaration !== "string") data.declaration = "";

  const els = {
    // core
    fullName: qs("#fullName"),
    profilePhoto: qs("#profilePhoto"), // ✅ new

    email: qs("#email"),
    phone: qs("#phone"),
    location: qs("#location"),
    summary: qs("#summary"),
    github: qs("#github"),
    linkedin: qs("#linkedin"),
    portfolio: qs("#portfolio"),
    website: qs("#website"),
    addCustomLink: qs("#addCustomLink"), // button
    customLinksList: qs("#customLinksList"), // container

    expList: qs("#experienceList"),
    eduList: qs("#educationList"),
    skillsList: qs("#skillsList"),
    projectsList: qs("#projectsList"),
    certificationsList: qs("#certificationsList"),
    internshipsList: qs("#internshipsList"),
    hobbiesList: qs("#hobbiesList"),
    additionalInfo: qs("#additionalInfo"),
    declaration: qs("#declaration"),

    // addHobby: qs("#addHobby"),

    btnSave: qs("#btn-save"),

    btnClear: qs("#btn-clear"),

    btnPreview: qs("#btn-preview"),

    addExperience: qs("#addExperience"),
    addEducation: qs("#addEducation"),
    addSkill: qs("#addSkill"),
    addProject: qs("#addProject"),
    addCertification: qs("#addCertification"),
    addInternship: qs("#addInternship"),
    addHobby: qs("#addHobby"),
    addLanguage: qs("#addLanguage"),
    languagesList: qs("#languagesList"),
  };

  // ===== Defaults (mirrors your zip structure) =====
  function getDefaultData() {
    return {
      personalInfo: {
        fullName: "",
        profilePhoto: "", // ✅ new

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
        custom: [], // ✅ new array for dynamic links
      },
      experience: [],
      education: [],
      skills: [],
      projects: [],
      certifications: [],
      internships: [],
      hobbies: [],
      languages: [],
      additionalInfo: "", // ✅ new field
      declaration: "",
    };
  }

  // ===== Init form with stored data =====
  function initForm() {
    const { personalInfo, publicLinks } = data;
    els.fullName.value = personalInfo.fullName || "";
    if (personalInfo.profilePhoto) {
      els.profilePhoto.setAttribute("data-has-photo", "true"); // ✅ marks existing photo
    }

    els.email.value = personalInfo.email || "";
    els.phone.value = personalInfo.phone || "";
    els.location.value = personalInfo.location || "";
    els.summary.value = personalInfo.summary || "";

    els.github.value = publicLinks.github || "";
    els.linkedin.value = publicLinks.linkedin || "";
    els.portfolio.value = publicLinks.portfolio || "";
    els.website.value = publicLinks.website || "";
    els.additionalInfo.value = data.additionalInfo || "";
    els.declaration.value = data.declaration || "";

    renderExperience();
    renderEducation();
    renderSkills();
    renderProjects();
    renderCertifications();
    renderInternships();
    renderHobbies();
    renderCustomLinks();
    renderLanguages();
  }

  // ===== Storage =====
  function saveToStorage(showToast = false) {
    try {
      localStorage.setItem("resumeData", JSON.stringify(data));
      if (showToast) {
        toast("Saved", "Your progress has been saved locally.");
      }
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
    {
      const fresh = getDefaultData();
      Object.assign(data.personalInfo, fresh.personalInfo);
      Object.assign(data.publicLinks, fresh.publicLinks);
      data.experience = [];
      data.education = [];
      data.skills = [];
      data.projects = [];
      data.certifications = [];
      data.internships = [];
      data.hobbies = [];
      data.additionalInfo = "";
      data.declaration = "";

      data.languages = [];

      initForm();
      saveToStorage();
      // 🧹 FIX: remove red highlight and error messages after clear
      document.querySelectorAll(".invalid-highlight").forEach((el) => {
        el.classList.remove("invalid-highlight");
      });

      document.querySelectorAll(".error-msg").forEach((msg) => {
        msg.remove();
      });
    }
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
    // ✅ Profile photo upload
    els.profilePhoto.addEventListener("change", (e) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = function (evt) {
          data.personalInfo.profilePhoto = evt.target.result; // store base64
          saveToStorage();
        };
        reader.readAsDataURL(file);
      }
    });

    els.additionalInfo.addEventListener(
      evt,
      (e) => (data.additionalInfo = e.target.value)
    );

    els.declaration.addEventListener(
      evt,
      (e) => (data.declaration = e.target.value)
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
            const endInput = div.querySelector('input[data-k="endDate"]');
            if (endInput) {
              if (el.checked) {
                endInput.value = "";
                arr[idx].endDate = "";
                endInput.disabled = true;
                endInput.classList.add("dimmed"); // ✅ add dimmed
              } else {
                endInput.disabled = false;
                endInput.classList.remove("dimmed"); // ✅ remove dimmed
              }
            }
          } else {
            arr[idx][key] = val;
          }
        }
      );

      els.expList.appendChild(div);
    });
  }

  // ... your existing code above ...

  // ===== Education =====
  els.addEducation.addEventListener("click", () => {
    data.education.push({
      degree: "",
      institution: "",
      startDate: "",
      endDate: "",
      current: false, // ✅ new field for "Currently studying"
      score: "", // store CGPA/Marks/Grade value
      scoreType: "", // default selection //
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
        <label>End Date <input class="input" type="date" data-k="endDate" data-i="${i}" ${
        edu.current ? "disabled" : ""
      } value="${edu.endDate || ""}"></label>
      </div>
      <div class="row row-2">
        <label class="full" style="display:flex;align-items:center;gap:10px;">
          <input type="checkbox" data-k="current" data-i="${i}" ${
        edu.current ? "checked" : ""
      }/> Currently studying here
        </label>
      </div>
      <div class="row row-2">
        <label>Score
          <input class="input" data-k="score" data-i="${i}" value="${escapeHtml(
        edu.score || ""
      )}">
        </label>
        <label>Type
          <div style="display:flex;gap:10px;">
            <label><input type="radio" name="scoreType_${i}" value="CGPA" ${
        edu.scoreType === "CGPA" ? "checked" : ""
      }/> CGPA</label>
            <label><input type="radio" name="scoreType_${i}" value="Marks" ${
        edu.scoreType === "Marks" ? "checked" : ""
      }/> Marks</label>
            <label><input type="radio" name="scoreType_${i}" value="Grade" ${
        edu.scoreType === "Grade" ? "checked" : ""
      }/> Grade</label>
          </div>
        </label>
      </div>
      <label>Description
        <textarea class="textarea" data-k="description" data-i="${i}" rows="3">${escapeHtml(
        edu.description || ""
      )}</textarea>
      </label>
    `;

      // Remove button
      div.querySelector("[data-remove]").addEventListener("click", () => {
        data.education.splice(i, 1);
        renderEducation();
        saveToStorage();
      });

      // Attach input/change handlers
      attachChangeHandlers(div, data.education, i, (arr, idx, key, val, el) => {
        if (key === "current") {
          arr[idx].current = el.checked;
          const endInput = div.querySelector('input[data-k="endDate"]');
          if (endInput) {
            endInput.disabled = el.checked;
            if (el.checked) {
              endInput.value = "";
              arr[idx].endDate = "";
              endInput.classList.add("dimmed");
            } else {
              endInput.classList.remove("dimmed");
            }
          }
        } else if (key === "scoreType") {
          arr[idx].scoreType = val;
        } else arr[idx][key] = val;
      });

      // ✅ Add listener to radio buttons to update scoreType
      div.querySelectorAll(`input[name="scoreType_${i}"]`).forEach((radio) => {
        radio.addEventListener("change", (e) => {
          data.education[i].scoreType = e.target.value;
          saveToStorage();
        });
      });

      els.eduList.appendChild(div);
    });
  }

  // // ... rest of your existing code unchanged ...
  // // ... your existing code above ...
  // ... rest of your existing code unchanged ...

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
    data.projects.push({
      name: "",
      description: "",
      startDate: "",
      endDate: "",
      projectUrl: "",
    });

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
      <div class="row row-2">
        <label>Project Name <input class="input" data-k="name" data-i="${i}" value="${escapeHtml(
        project.name
      )}"></label>
        <label>Project URL <input class="input" type="url" data-k="projectUrl" data-i="${i}" value="${escapeHtml(
        project.projectUrl || ""
      )}"></label>
      </div>
      <div class="row row-2">
        <label>Start Date <input class="input" type="date" data-k="startDate" data-i="${i}" value="${
        project.startDate || ""
      }"></label>
        <label>End Date <input class="input" type="date" data-k="endDate" data-i="${i}" value="${
        project.endDate || ""
      }"></label>
      </div>
      <label>Description 
        <textarea class="textarea" rows="3" data-k="description" data-i="${i}">${escapeHtml(
        project.description || ""
      )}</textarea>
      </label>
    `;

      // ✅ Remove project
      div.querySelector("[data-remove]").addEventListener("click", () => {
        data.projects.splice(i, 1);
        renderProjects();
        saveToStorage();
      });

      // ✅ Attach input change handlers
      attachChangeHandlers(div, data.projects, i);

      // ✅ Finally append to DOM
      els.projectsList.appendChild(div);
    });
  }
  // ===== Certificates =====
  els.addCertification.addEventListener("click", () => {
    data.certifications.push({
      name: "",
      issuer: "",
      date: "",
      description: "",
      url: "",
    });
    renderCertifications();
    saveToStorage();
  });

  function renderCertifications() {
    els.certificationsList.innerHTML = "";
    data.certifications.forEach((cert, i) => {
      const div = document.createElement("div");
      div.className = "list-item";
      div.innerHTML = `
        <div class="list-item-header">
          <span class="list-item-title">Certification ${i + 1}</span>
          <button class="btn btn-small btn-danger" data-remove="${i}">Remove</button>
        </div>
        <div class="row row-2">
          <label>Certificate Name <input class="input" data-k="name" data-i="${i}" value="${escapeHtml(
        cert.name
      )}"></label>
          <label>Issuer <input class="input" data-k="issuer" data-i="${i}" value="${escapeHtml(
        cert.issuer
      )}"></label>
        </div>
        <div class="row row-2">
          <label>Date <input class="input" type="date" data-k="date" data-i="${i}" value="${
        cert.date || ""
      }"></label>
      <label>Certificate URL 
          <input class="input" type="url" placeholder="https://example.com/certificate" data-k="url" data-i="${i}" value="${escapeHtml(
        cert.url || ""
      )}">
        </label>
        </div>
        <label>Description
          <textarea class="textarea" data-k="description" data-i="${i}" rows="2">${escapeHtml(
        cert.description || ""
      )}</textarea>
        </label>
      `;
      div.querySelector("[data-remove]").addEventListener("click", () => {
        data.certifications.splice(i, 1);
        renderCertifications();
        saveToStorage();
      });
      attachChangeHandlers(div, data.certifications, i);
      els.certificationsList.appendChild(div);
    });
  }
  // ===== Internships (NEW) =====
  els.addInternship.addEventListener("click", () => {
    data.internships.push({
      name: "",
      organization: "",
      startDate: "",
      endDate: "",
      description: "",
    });
    renderInternships();
    saveToStorage();
  });
  function renderInternships() {
    els.internshipsList.innerHTML = "";
    data.internships.forEach((intern, i) => {
      const div = document.createElement("div");
      div.className = "list-item";
      div.innerHTML = `
        <div class="list-item-header">
          <span class="list-item-title">Internship ${i + 1}</span>
          <button class="btn btn-small btn-danger" data-remove="${i}">Remove</button>
        </div>
        <div class="row row-2">
          <label>Internship Name <input class="input" data-k="name" data-i="${i}" value="${escapeHtml(
        intern.name
      )}"></label>
          <label>Organization <input class="input" data-k="organization" data-i="${i}" value="${escapeHtml(
        intern.organization
      )}"></label>
        </div>
        <div class="row row-2">
          <label>Start Date <input type="date" class="input" data-k="startDate" data-i="${i}" value="${
        intern.startDate || ""
      }"></label>
          <label>End Date <input type="date" class="input" data-k="endDate" data-i="${i}" value="${
        intern.endDate || ""
      }"></label>
       <label class="full" style="display:flex;align-items:center;gap:10px">
          <input type="checkbox" data-k="current" data-i="${i}" ${
        intern.current ? "checked" : ""
      }/> Currently working here
        </label>
        </div>
        <label>Description
          <textarea class="textarea" rows="3" data-k="description" data-i="${i}">${escapeHtml(
        intern.description || ""
      )}</textarea>
        </label>
      `;
      div.querySelector("[data-remove]").addEventListener("click", () => {
        data.internships.splice(i, 1);
        renderInternships();
        saveToStorage();
      });
      attachChangeHandlers(
        div,
        data.internships,
        i,
        (arr, idx, key, val, el) => {
          if (key === "current") {
            arr[idx].current = el.checked;
            const endInput = div.querySelector('input[data-k="endDate"]');
            if (endInput) {
              if (el.checked) {
                endInput.value = "";
                arr[idx].endDate = "";
                endInput.disabled = true;
                endInput.classList.add("dimmed"); // optional styling
              } else {
                endInput.disabled = false;
                endInput.classList.remove("dimmed");
              }
            }
          } else {
            arr[idx][key] = val;
          }
        }
      );

      els.internshipsList.appendChild(div);
    });
  }
  // ===== Hobbies =====
  els.addHobby.addEventListener("click", () => {
    data.hobbies.push({ hobby: "" });
    renderHobbies();
    saveToStorage();
  });

  function renderHobbies() {
    els.hobbiesList.innerHTML = "";
    // extra guard (works even if a future edit removes hobbies in storage)
    const list = Array.isArray(data.hobbies)
      ? data.hobbies
      : (data.hobbies = []);
    list.forEach((hob, i) => {
      const div = document.createElement("div");
      div.className = "list-item";
      div.innerHTML = `
      <div class="list-item-header">
        <span class="list-item-title">Hobby ${i + 1}</span>
        <button class="btn btn-small btn-danger" data-remove="${i}">Remove</button>
      </div>
      <label>Hobby
        <input class="input" data-k="hobby" data-i="${i}" value="${escapeHtml(
        hob.hobby || ""
      )}">
      </label>
    `;

      div.querySelector("[data-remove]").addEventListener("click", () => {
        data.hobbies.splice(i, 1);
        renderHobbies();
        saveToStorage();
      });

      attachChangeHandlers(div, data.hobbies, i);
      els.hobbiesList.appendChild(div);
    });
  }
  // ===== Languages (REPLACEMENT: dropdown + preview) =====
  const LANGUAGES = [
    "English",
    "Hindi",
    "Telugu",
    "Tamil",
    "Kannada",
    "Malayalam",
    "Marathi",
    "Gujarati",
    "Punjabi",
    "Urdu",
    "Bengali",
    "Odia",
    "Assamese",
    "Konkani",
    "Sanskrit",
    "Nepali",
    "Bhojpuri",
    "Rajasthani",
    "Sindhi",
    "Maithili",
    "Santali",
    "Dogri",
    "Kashmiri",
    "Chinese (Mandarin)",
    "Cantonese",
    "Japanese",
    "Korean",
    "Vietnamese",
    "Thai",
    "Indonesian",
    "Malay",
    "Filipino (Tagalog)",
    "Arabic",
    "Persian (Farsi)",
    "Turkish",
    "Hebrew",
    "Swahili",
    "Russian",
    "Polish",
    "Ukrainian",
    "Romanian",
    "Hungarian",
    "Czech",
    "Slovak",
    "Dutch",
    "German",
    "French",
    "Spanish",
    "Portuguese",
    "Italian",
    "Greek",
    "Latin",
  ];

  function createLanguageRow(index, selectedValue = "") {
    const div = document.createElement("div");
    div.className = "list-item";

    const options = LANGUAGES.map(
      (L) => `<option value="${L}">${L}</option>`
    ).join("\n");

    div.innerHTML = `
    <div class="list-item-header">
      <span class="list-item-title">Language ${index + 1}</span>
      <button class="btn btn-small btn-danger" data-remove="${index}">Remove</button>
    </div>
    <label>
      Language
      <select class="input compact-select" data-k="name" data-i="${index}">
      
        
      <option value="">-- Select language --</option>
        <option value="__custom__">Custom...</option>
         ${options}
      </select>
      <input class="input custom-lang-input" type="text" placeholder="Enter custom language" style="display:none;" />
    </label>
  `;

    const sel = div.querySelector("select[data-k='name']");
    const customInput = div.querySelector(".custom-lang-input");

    // Restore saved value
    if (selectedValue && LANGUAGES.includes(selectedValue)) {
      sel.value = selectedValue;
    } else if (selectedValue) {
      sel.value = "__custom__";
      customInput.style.display = "inline-block";
      customInput.value = selectedValue;
    }

    // Remove handler
    div.querySelector("[data-remove]").addEventListener("click", () => {
      data.languages.splice(index, 1);
      renderLanguages();
      saveToStorage();
    });

    // When dropdown changes
    sel.addEventListener("change", (e) => {
      if (e.target.value === "__custom__") {
        customInput.style.display = "inline-block";
        data.languages[index].name = customInput.value;
        customInput.focus(); // auto-focus for user typing
      } else {
        customInput.style.display = "none";
        data.languages[index].name = e.target.value;
      }
      saveToStorage();
      updatePreviewLanguages();
    });

    // When typing custom language
    customInput.addEventListener("input", (e) => {
      data.languages[index].name = e.target.value;
      saveToStorage();
      updatePreviewLanguages();
    });

    return div;
  }

  function renderLanguages() {
    els.languagesList.innerHTML = "";
    const list = Array.isArray(data.languages)
      ? data.languages
      : (data.languages = []);

    list.forEach((lang, i) => {
      // ensure object shape
      if (typeof lang !== "object" || lang === null)
        data.languages[i] = { name: "" };
      const row = createLanguageRow(i, data.languages[i].name || "");
      els.languagesList.appendChild(row);
    });

    // update inline preview (if present)
    updatePreviewLanguages();
  }

  els.addLanguage.addEventListener("click", () => {
    data.languages.push({ name: "" });
    renderLanguages();
    saveToStorage();
  });

  // read languages from data
  function getLanguagesFromData() {
    return (Array.isArray(data.languages) ? data.languages : [])
      .map((l) => l.name)
      .filter(Boolean);
  }

  // Update an inline preview element if present on the page
  function updatePreviewLanguages() {
    const previewContainer = document.getElementById("previewLanguages");
    if (!previewContainer) return; // no inline preview on this page — preview.html should still read from localStorage
    const langs = getLanguagesFromData();
    previewContainer.textContent = langs.length
      ? langs.join(", ")
      : "No languages selected.";
  }

  // ensure preview buttons also refresh inline preview (if used)
  if (els.btnPreview)
    els.btnPreview.addEventListener("click", updatePreviewLanguages);
  if (els.btnPreview2)
    els.btnPreview2.addEventListener("click", updatePreviewLanguages);

  // run initial render (initForm already calls renderLanguages, but safe to call)
  renderLanguages();

  // ===== Custom Links =====
  // Add new custom website (only URL)
  if (els.addCustomLink) {
    els.addCustomLink.addEventListener("click", () => {
      // push only url (empty string)
      data.publicLinks.custom.push({ url: "" });
      renderCustomLinks();
      saveToStorage();
    });
  }

  // Event delegation for Remove buttons (robust across re-renders)
  if (els.customLinksList) {
    els.customLinksList.addEventListener("click", (e) => {
      const btn = e.target.closest("[data-remove]");
      if (!btn) return;
      const idx = Number(btn.getAttribute("data-remove"));
      if (!Number.isFinite(idx)) return;
      data.publicLinks.custom.splice(idx, 1);
      renderCustomLinks();
      saveToStorage();
    });
  }
  function renderCustomLinks() {
    if (!els.customLinksList) return;
    els.customLinksList.innerHTML = "";
    const list = Array.isArray(data.publicLinks.custom)
      ? data.publicLinks.custom
      : (data.publicLinks.custom = []);

    list.forEach((link, i) => {
      const div = document.createElement("div");
      div.className = "list-item";
      div.innerHTML = `
      <div class="list-item-header">
        <span class="list-item-title">Custom Link ${i + 1}</span>
        <button class="btn btn-small btn-danger" data-remove="${i}">Remove</button>
      </div>
      <label>URL
        <input class="input" type="url" data-k="url" data-i="${i}" 
          placeholder="https://example.com" value="${escapeHtml(
            link.url || ""
          )}">
      </label>
    `;

      // 👇 this makes sure updates save
      attachChangeHandlers(div, list, i);

      els.customLinksList.appendChild(div);
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
      //---
      document.getElementById("step-1").click(); // simulate navbar click

      //---
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
  els.btnSave.addEventListener("click", () => saveToStorage(true));
  els.btnClear.addEventListener("click", clearAll);
  els.btnPreview.addEventListener("click", openPreview);

  // Init
  initForm();
})();
// Validation + redirect-to-first-invalid implementation
function findFirstInvalidField() {
  // select all elements that are marked required
  const requiredEls = Array.from(document.querySelectorAll("[required]"));

  for (const el of requiredEls) {
    // Use built-in validity when possible (for email, url, etc.)
    // For file inputs, check files length; for others use value.trim()
    if (el.type === "file") {
      if (!el.files || el.files.length === 0) return el;
    } else {
      // treat empty string (including only-spaces) as invalid
      const val = (el.value || "").toString().trim();
      // For inputs with built-in validation use checkValidity
      if (typeof el.checkValidity === "function") {
        if (!el.checkValidity() || val === "") return el;
      } else {
        if (val === "") return el;
      }
    }
  }
  return null; // all required ok
}

function showInvalidCue(el) {
  if (!el) return;
  // focus + smooth scroll to center
  el.focus({ preventScroll: false });
  try {
    el.scrollIntoView({ behavior: "smooth", block: "center" });
  } catch (e) {
    // fallback
    el.scrollIntoView();
  }

  // temporary visual highlight (needs CSS .invalid-highlight)
  el.classList.add("invalid-highlight");
  setTimeout(() => el.classList.remove("invalid-highlight"), 1800);
}

function handlePreviewClick(e) {
  const firstInvalid = findFirstInvalidField();
  if (firstInvalid) {
    // prevent preview and redirect/focus to that field
    e && e.preventDefault && e.preventDefault();
    showInvalidCue(firstInvalid);
    return false;
  }

  // no invalid fields -> proceed to preview behavior
  // If you already have existing preview logic, call it here.
  // Example: openPreviewModal();
  console.log("All required fields filled — proceed to preview.");
  return true;
}

// attach to both preview buttons (top and footer)
document.addEventListener("DOMContentLoaded", () => {
  const previewBtn = document.getElementById("btn-preview");
  if (previewBtn) previewBtn.addEventListener("click", handlePreviewClick);

  // Optional: when user presses Enter in a required field, remove highlight
  document.addEventListener("input", (ev) => {
    const target = ev.target;
    if (
      target &&
      target.classList &&
      target.classList.contains("invalid-highlight")
    ) {
      const val = (target.value || "").toString().trim();
      if (val) target.classList.remove("invalid-highlight");
    }
  });
});
function findFirstInvalidField() {
  const requiredEls = Array.from(document.querySelectorAll("[required]"));

  for (const el of requiredEls) {
    if (el.type === "file") {
      if (!el.files || el.files.length === 0) return el;
    } else {
      const val = (el.value || "").toString().trim();
      if (typeof el.checkValidity === "function") {
        if (!el.checkValidity() || val === "") return el;
      } else {
        if (val === "") return el;
      }
    }
  }
  return null;
}

function showInvalidCue(el) {
  if (!el) return;

  // Focus + scroll
  el.focus({ preventScroll: false });
  el.scrollIntoView({ behavior: "smooth", block: "center" });

  // Add visual class
  el.classList.add("invalid-highlight");

  // Create or show error message
  let msg = el.parentNode.querySelector(".error-msg");
  if (!msg) {
    msg = document.createElement("div");
    msg.className = "error-msg";
    msg.textContent = "Please enter this field";
    el.parentNode.appendChild(msg);
  } else {
    msg.style.display = "block";
  }
}

function clearError(el) {
  el.classList.remove("invalid-highlight");
  const msg = el.parentNode.querySelector(".error-msg");
  if (msg) msg.style.display = "none";
}

function handlePreviewClick(e) {
  const firstInvalid = findFirstInvalidField();
  if (firstInvalid) {
    e.preventDefault();
    showInvalidCue(firstInvalid);
    return false;
  }

  console.log("All required fields filled — proceed to preview.");
  return true;
}

document.addEventListener("DOMContentLoaded", () => {
  const previewBtns = [
    document.getElementById("btn-preview"),
    document.getElementById("btn-preview-2"),
  ].filter(Boolean);

  previewBtns.forEach((btn) =>
    btn.addEventListener("click", handlePreviewClick)
  );

  // Clear error on typing
  document.addEventListener("input", (ev) => {
    const target = ev.target;
    if (target && target.hasAttribute("required")) {
      if (target.value.trim() !== "") clearError(target);
    }
  });

  // Clear Declaration
  document.getElementById("clear").addEventListener("click", () => {
    if (confirm("Are you sure you want to clear the declaration field?")) {
      const declarationField = document.getElementById("declaration");
      if (declarationField) declarationField.value = "";
    }
  });
});
// ===== Keyboard Navigation (Enter + Arrow Keys) =====
document.addEventListener("DOMContentLoaded", () => {
  function isVisible(el) {
    return !!(el.offsetWidth || el.offsetHeight || el.getClientRects().length);
  }

  function getFocusableElements() {
    const selector = [
      'input:not([type="hidden"]):not([disabled])',
      "textarea:not([disabled])",
      "select:not([disabled])",
      "button:not([disabled])",
      '[contenteditable="true"]',
    ].join(",");
    return Array.from(document.querySelectorAll(selector)).filter(isVisible);
  }

  const excludedTypes = new Set([
    "checkbox",
    "radio",
    "file",
    "submit",
    "reset",
    "button",
    "image",
    "range",
    "color",
    "hidden",
  ]);

  function moveFocus(current, dir) {
    const focusables = getFocusableElements();
    const idx = focusables.indexOf(current);
    if (idx === -1) return;
    const next = focusables[idx + dir];
    if (!next) return;
    next.focus();
    if (
      next.select &&
      (next.tagName === "INPUT" || next.tagName === "TEXTAREA")
    ) {
      next.select();
    }
    if (typeof next.scrollIntoView === "function") {
      next.scrollIntoView({ block: "nearest", behavior: "smooth" });
    }
  }

  document.addEventListener("keydown", (e) => {
    const el = e.target;
    const tag = el.tagName.toLowerCase();
    const type = (el.type || "").toLowerCase();

    if (e.metaKey || e.altKey) return; // ignore shortcuts

    if (e.key === "Enter") {
      if (tag === "button" || excludedTypes.has(type)) return;

      if (tag === "textarea") {
        if (e.shiftKey) return; // allow Shift+Enter newline
      }
      e.preventDefault();
      moveFocus(el, +1);
    }

    if (["ArrowDown", "ArrowRight"].includes(e.key)) {
      if (tag === "textarea" && !e.ctrlKey) return;
      e.preventDefault();
      moveFocus(el, +1);
    }
    if (["ArrowUp", "ArrowLeft"].includes(e.key)) {
      if (tag === "textarea" && !e.ctrlKey) return;
      e.preventDefault();
      moveFocus(el, -1);
    }
  });
});

document.addEventListener("DOMContentLoaded", () => {
  const steps = Array.from(document.querySelectorAll(".wizard-step"));
  const prevBtn = document.getElementById("prevStep");
  const nextBtn = document.getElementById("nextStep");
  let currentStep = 0;

  function showStep(index) {
    steps.forEach((s, i) => (s.style.display = i === index ? "block" : "none"));
    prevBtn.style.display = index === 0 ? "none" : "inline-block";
    nextBtn.textContent = index === steps.length - 1 ? "Preview" : "Next";
  }

  function validateStep(index) {
    const requiredEls = Array.from(steps[index].querySelectorAll("[required]"));
    for (const el of requiredEls) {
      if (!el.value.trim()) {
        el.focus();
        alert("Please fill all required fields in this step.");
        return false;
      }
    }
    return true;
  }

  prevBtn.addEventListener("click", () => {
    if (currentStep > 0) {
      currentStep--;
      showStep(currentStep);
    }
  });

  nextBtn.addEventListener("click", () => {
    if (!validateStep(currentStep)) return;
    if (currentStep < steps.length - 1) {
      currentStep++;
      showStep(currentStep);
    } else {
      document.getElementById("btn-preview").click(); // open preview
    }
  });

  showStep(currentStep);
});

const totalSteps = 12;
let currentStep = 1;

function updateProgress() {
  const percent = Math.round((currentStep / totalSteps) * 100);
  const progressFill = document.getElementById("progressFill");
  progressFill.style.width = percent + "%";
  progressFill.textContent = percent + "%";
}

// Example: call this whenever next/prev buttons are clicked
document.getElementById("nextStep").addEventListener("click", () => {
  if (currentStep < totalSteps) currentStep++;
  updateProgress();
});

document.getElementById("prevStep").addEventListener("click", () => {
  if (currentStep > 1) currentStep--;
  updateProgress();
});

// Initialize
updateProgress();

// ===== Sidebar Navigation for Wizard =====
document.addEventListener("DOMContentLoaded", () => {
  const navItems = document.querySelectorAll(".nav-item");
  const steps = Array.from(document.querySelectorAll(".wizard-step"));
  const prevBtn = document.getElementById("prevStep");
  const nextBtn = document.getElementById("nextStep");
  const progressFill = document.getElementById("progressFill");
  let currentStep = 0;

  function showStep(index) {
    steps.forEach((s, i) => (s.style.display = i === index ? "block" : "none"));
    prevBtn.style.display = index === 0 ? "none" : "inline-block";
    nextBtn.textContent = index === steps.length - 1 ? "Preview" : "Next";

    // Sidebar highlight
    navItems.forEach((i) => i.classList.remove("active"));
    navItems[index].classList.add("active");

    // Progress update
    const percent = Math.round(((index + 1) / steps.length) * 100);
    progressFill.style.width = percent + "%";
    progressFill.textContent = percent + "%";
  }

  // Sidebar click → go to that step
  navItems.forEach((item, idx) => {
    item.addEventListener("click", (e) => {
      e.preventDefault();
      currentStep = idx;
      showStep(currentStep);
    });
  });

  // Prev/Next buttons
  prevBtn.addEventListener("click", () => {
    if (currentStep > 0) {
      currentStep--;
      showStep(currentStep);
    }
  });

  nextBtn.addEventListener("click", () => {
    if (currentStep < steps.length - 1) {
      currentStep++;
      showStep(currentStep);
    } else {
      document.getElementById("btn-preview").click();
    }
  });

  // Init
  showStep(currentStep);
});
