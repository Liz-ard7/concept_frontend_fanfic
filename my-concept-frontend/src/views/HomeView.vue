<script setup lang="ts">
import { ref, watch } from 'vue';
import { useAuthStore } from '../stores/auth';
import { UserAuthAPI, LibraryAPI, CategorizingAPI } from '../api'; // Import CategorizingAPI
import type { ID, Fic, Version, FicCategoryDoc } from '../api/types'; // Import FicCategoryDoc

const authStore = useAuthStore();

// --- Auth Forms ---
const registerUsername = ref('');
const registerPassword = ref('');
const registerError = ref<string | null>(null);

const loginUsername = ref('');
const loginPassword = ref('');
const loginError = ref<string | null>(null);

const handleRegister = async () => {
  registerError.value = null;
  const result = await UserAuthAPI.register(registerUsername.value, registerPassword.value);
  if ('error' in result) {
    registerError.value = result.error;
  } else {
    alert(`User registered! ID: ${result.user}`);
    registerUsername.value = '';
    registerPassword.value = '';
  }
};

const handleLogin = async () => {
  loginError.value = null;
  const result = await UserAuthAPI.authenticate(loginUsername.value, loginPassword.value);
  if ('error' in result) {
    loginError.value = result.error;
  } else {
    authStore.setUserId(result.user);
    alert(`Logged in as User ID: ${result.user}`);
    loginUsername.value = '';
    loginPassword.value = '';
    await LibraryAPI.addUser(result.user);
    fetchUserVersions();
  }
};

// --- Library & Categorizing Interaction (only if authenticated) ---
const ficName = ref('');
const ficText = ref('');
const authorTags = ref('');
const ficDateDay = ref(1);
const ficDateMonth = ref(1);
const ficDateYear = ref(2023);
const ficSubmitError = ref<string | null>(null);
const userVersions = ref<Version[]>([]);

// State for submitting new version of existing fic - track per version
const showNewVersionForm = ref<Record<string, boolean>>({});
const newVersionForms = ref<Record<string, {
  text: string;
  tags: string;
  dateDay: number;
  dateMonth: number;
  dateYear: number;
  error: string | null;
}>>({});

// Combined state for the currently selected fic and its categorization
const selectedFicDetails = ref<{
  fic: Fic;
  categorization?: FicCategoryDoc; // Categorization is optional as it might not be processed yet or might fail
} | null>(null);

const fetchUserVersions = async () => {
  userVersions.value = [];
  if (!authStore.userId) return;

  const result = await LibraryAPI.getAllUserVersions(authStore.userId);
  if ('error' in result) {
    console.error('Error fetching versions:', result.error);
    alert('Error fetching versions: ' + result.error);
  } else {
    // The sync returns { versions: [...] } directly, not wrapped in an array
    userVersions.value = result.versions || [];
  }
};

const handleSubmitFic = async () => {
  ficSubmitError.value = null;
  if (!authStore.userId) {
    ficSubmitError.value = 'Please log in to submit a fic.';
    return;
  }

  const date = {
    day: ficDateDay.value,
    month: ficDateMonth.value,
    year: ficDateYear.value,
  };

  const authorTagsFormatted = authorTags.value.split(',').map(tag => tag.trim()).join('\n');

  // 1. Submit new fic to Library Concept
  const submitFicResult = await LibraryAPI.submitNewFic(
    authStore.userId,
    ficText.value,
    ficName.value,
    authorTagsFormatted,
    date,
  );

  if ('error' in submitFicResult) {
    ficSubmitError.value = submitFicResult.error;
    return;
  }

  const newFicId = submitFicResult.ficId;
  alert(`Fic submitted! Fic ID: ${newFicId}`);

  // Categorization happens automatically via backend sync, no need to call manually
  // The SubmitNewFicResponse sync handles: Library.submitNewFic -> Categorizing.categorizeFic -> respond
  console.log(`Fic categorized automatically via sync`);

  // Reset form and refresh list
  ficName.value = '';
  ficText.value = '';
  authorTags.value = '';
  fetchUserVersions(); // Refresh the list of fics
};

const toggleNewVersionForm = (versionTitle: string) => {
  showNewVersionForm.value[versionTitle] = !showNewVersionForm.value[versionTitle];

  // Initialize form data if it doesn't exist
  if (!newVersionForms.value[versionTitle]) {
    newVersionForms.value[versionTitle] = {
      text: '',
      tags: '',
      dateDay: 1,
      dateMonth: 1,
      dateYear: 2023,
      error: null,
    };
  }
};

const handleSubmitNewVersion = async (versionTitle: string) => {
  const form = newVersionForms.value[versionTitle];
  if (!form) return;

  form.error = null;
  if (!authStore.userId) {
    form.error = 'Please log in to submit a new version.';
    return;
  }

  const date = {
    day: form.dateDay,
    month: form.dateMonth,
    year: form.dateYear,
  };

  const authorTagsFormatted = form.tags.split(',').map((tag: string) => tag.trim()).join('\n');

  // Submit new version of existing fanfic
  const submitResult = await LibraryAPI.submitNewVersionOfFanfic(
    authStore.userId,
    form.text,
    authorTagsFormatted,
    versionTitle,
    date,
    versionTitle, // ficName is the same as versionTitle
  );

  if ('error' in submitResult) {
    form.error = submitResult.error;
    return;
  }

  alert(`New version submitted! Version ID: ${submitResult.versionId}`);

  // Categorization happens automatically via backend sync (SubmitNewVersionResponse)

  // Reset form and refresh list
  form.text = '';
  form.tags = '';
  form.dateDay = 1;
  form.dateMonth = 1;
  form.dateYear = 2023;
  form.error = null;
  showNewVersionForm.value[versionTitle] = false;
  fetchUserVersions();
};

const deleteFic = async (ficTitle: string, versionNumber: number) => {
  if (!authStore.userId) return;

  if (!confirm(`Are you sure you want to delete version #${versionNumber} of "${ficTitle}"?`)) {
    return;
  }

  const result = await LibraryAPI.deleteFic(authStore.userId, ficTitle, versionNumber);
  if ('error' in result) {
    alert('Error deleting fic: ' + result.error);
  } else {
    alert('Fic deleted successfully!');
    // Also delete the categorization data
    await CategorizingAPI.deleteFicCategory(result.ficId);
    fetchUserVersions();
    if (selectedFicDetails.value?.fic._id === result.ficId) {
      selectedFicDetails.value = null;
    }
  }
};

const deleteVersion = async (ficTitle: string) => {
  if (!authStore.userId) return;

  if (!confirm(`Are you sure you want to delete ALL versions of "${ficTitle}"?`)) {
    return;
  }

  // Get all fic IDs from this version to delete categorizations
  const versionResult = await LibraryAPI.getVersion(authStore.userId, ficTitle);
  let ficIds: ID[] = [];
  if (!('error' in versionResult)) {
    // versionResult is now { version: Version }, not an array
    ficIds = versionResult.version.fics.map((fic: Fic) => fic._id);
  }

  const result = await LibraryAPI.deleteVersion(authStore.userId, ficTitle);
  if ('error' in result) {
    alert('Error deleting version: ' + result.error);
  } else {
    alert('All versions deleted successfully!');
    // Delete all categorizations for this version
    if (ficIds.length > 0) {
      await CategorizingAPI.deleteFicCategories(ficIds);
    }
    fetchUserVersions();
    selectedFicDetails.value = null;
  }
};

const viewFicDetails = async (ficId: ID, ficTitle: string, versionNumber: number) => {
  selectedFicDetails.value = null; // Clear previous details
  if (!authStore.userId) return;

  // 1. Fetch fic details from Library Concept
  const ficResult = await LibraryAPI.viewFic(authStore.userId, ficTitle, versionNumber);
  if ('error' in ficResult) {
    console.error('Error viewing fic:', ficResult.error);
    alert('Error viewing fic: ' + ficResult.error);
    return;
  }

  const fic = ficResult.fic;

  // 2. Fetch categorization details from Categorizing Concept
  // Note: The sync returns { ficCategory: FicCategoryDoc[] }
  const categorizationResult = await CategorizingAPI.viewFicCategory(ficId);

  let categorization: FicCategoryDoc | undefined;
  if ('error' in categorizationResult) {
    console.warn(`Categorization data not found for fic ID '${ficId}':`, categorizationResult.error);
    // It's okay if categorization isn't found, we'll just display the fic without it.
  } else if (categorizationResult.ficCategory && categorizationResult.ficCategory.length > 0) {
    categorization = categorizationResult.ficCategory[0]; // Get the first (and only) result
  }

  // Combine and set the details
  selectedFicDetails.value = {
    fic: fic,
    categorization: categorization,
  };
};

// Watch for changes in authentication status to fetch user's fics
watch(() => authStore.isAuthenticated, (newVal) => {
  if (newVal) {
    fetchUserVersions();
  } else {
    userVersions.value = [];
    selectedFicDetails.value = null; // Clear selected fic details on logout
  }
}, { immediate: true });
</script>

<template>
  <main>
    <div v-if="!authStore.isAuthenticated" class="auth-section">
      <section class="auth-form">
        <h2>Register</h2>
        <form @submit.prevent="handleRegister">
          <label for="reg-username">Username:</label>
          <input id="reg-username" v-model="registerUsername" type="text" required />
          <label for="reg-password">Password:</label>
          <input id="reg-password" v-model="registerPassword" type="password" required />
          <button type="submit">Register</button>
        </form>
        <p v-if="registerError" class="error">{{ registerError }}</p>
      </section>

      <section class="auth-form">
        <h2>Login</h2>
        <form @submit.prevent="handleLogin">
          <label for="login-username">Username:</label>
          <input id="login-username" v-model="loginUsername" type="text" required />
          <label for="login-password">Password:</label>
          <input id="login-password" v-model="loginPassword" type="password" required />
          <button type="submit">Login</button>
        </form>
        <p v-if="loginError" class="error">{{ loginError }}</p>
      </section>
    </div>

    <div v-else class="authenticated-section">
      <section class="fic-submission">
        <h2>Submit New Fic</h2>
        <form @submit.prevent="handleSubmitFic">
          <label for="fic-name">Fic Title:</label>
          <input id="fic-name" v-model="ficName" type="text" required />

          <label for="fic-text">Fic Content:</label>
          <textarea id="fic-text" v-model="ficText" rows="10" required></textarea>

          <label for="author-tags">Author Tags (comma-separated):</label>
          <input id="author-tags" v-model="authorTags" type="text" placeholder="fantasy, romance, magic" />

          <fieldset>
            <legend>Publication Date:</legend>
            <label for="date-day">Day:</label>
            <input id="date-day" v-model.number="ficDateDay" type="number" min="1" max="31" required />
            <label for="date-month">Month:</label>
            <input id="date-month" v-model.number="ficDateMonth" type="number" min="1" max="12" required />
            <label for="date-year">Year:</label>
            <input id="date-year" v-model.number="ficDateYear" type="number" min="1900" max="2100" required />
          </fieldset>

          <button type="submit">Submit Fic</button>
        </form>
        <p v-if="ficSubmitError" class="error">{{ ficSubmitError }}</p>
      </section>

      <section class="user-library">
        <h2>Your Fics</h2>
        <p v-if="userVersions.length === 0">No fics submitted yet.</p>
        <ul v-else>
          <li v-for="version in userVersions" :key="version._id">
            <div class="version-header">
              <h3>{{ version.title }}</h3>
              <button @click="deleteVersion(version.title)" class="delete-btn">Delete All Versions</button>
            </div>
            <p>Versions: ({{ version.fics.length }})</p>
            <ul>
              <li v-for="fic in version.fics" :key="fic._id">
                <span>
                  Version #{{ fic.versionNumber }} ({{ fic.date.day }}/{{ fic.date.month }}/{{ fic.date.year }})
                </span>
                <div class="action-buttons">
                  <button @click="viewFicDetails(fic._id, version.title, fic.versionNumber)">View Details</button>
                  <button @click="deleteFic(version.title, fic.versionNumber)" class="delete-btn">Delete</button>
                </div>
              </li>
            </ul>

            <!-- Submit New Version Form for this fic -->
            <div class="new-version-section">
              <button @click="toggleNewVersionForm(version.title)" class="toggle-btn">
                {{ showNewVersionForm[version.title] ? '▼ Hide New Version Form' : '▶ Add New Version' }}
              </button>

              <form v-if="showNewVersionForm[version.title] && newVersionForms[version.title]"
                    @submit.prevent="handleSubmitNewVersion(version.title)"
                    class="new-version-form">
                <label :for="'version-text-' + version._id">New Version Content:</label>
                <textarea
                  :id="'version-text-' + version._id"
                  v-model="newVersionForms[version.title]!.text"
                  rows="8"
                  required
                  placeholder="Write your new version here..."></textarea>

                <label :for="'version-tags-' + version._id">Author Tags (comma-separated):</label>
                <input
                  :id="'version-tags-' + version._id"
                  v-model="newVersionForms[version.title]!.tags"
                  type="text"
                  placeholder="fantasy, romance, magic" />

                <fieldset>
                  <legend>Publication Date:</legend>
                  <label :for="'version-date-day-' + version._id">Day:</label>
                  <input
                    :id="'version-date-day-' + version._id"
                    v-model.number="newVersionForms[version.title]!.dateDay"
                    type="number"
                    min="1"
                    max="31"
                    required />
                  <label :for="'version-date-month-' + version._id">Month:</label>
                  <input
                    :id="'version-date-month-' + version._id"
                    v-model.number="newVersionForms[version.title]!.dateMonth"
                    type="number"
                    min="1"
                    max="12"
                    required />
                  <label :for="'version-date-year-' + version._id">Year:</label>
                  <input
                    :id="'version-date-year-' + version._id"
                    v-model.number="newVersionForms[version.title]!.dateYear"
                    type="number"
                    min="1900"
                    max="2100"
                    required />
                </fieldset>

                <button type="submit">Submit New Version</button>
                <p v-if="newVersionForms[version.title]?.error" class="error">{{ newVersionForms[version.title]!.error }}</p>
              </form>
            </div>
          </li>
        </ul>

        <!-- Display combined Fic and Categorization Details -->
        <div v-if="selectedFicDetails" class="fic-details">
          <h3>Details for {{ selectedFicDetails.fic.name }} (Version #{{ selectedFicDetails.fic.versionNumber }})</h3>
          <p><strong>Fic ID:</strong> {{ selectedFicDetails.fic._id }}</p>
          <p><strong>Author Tags:</strong> {{ selectedFicDetails.fic.authorTags.split('\n').join(', ') }}</p>

          <div v-if="selectedFicDetails.categorization">
            <h4>Categorization Results</h4>
            <h5>Suggested Tags:</h5>
            <ul v-if="selectedFicDetails.categorization.suggestedTags && selectedFicDetails.categorization.suggestedTags.length > 0">
              <li v-for="tag in selectedFicDetails.categorization.suggestedTags" :key="tag.name + tag.type">
                <strong>{{ tag.name }}</strong> ({{ tag.type }}): {{ tag.reason }}
              </li>
            </ul>
            <p v-else>No suggested tags.</p>

            <h5>Tags to Remove:</h5>
            <ul v-if="selectedFicDetails.categorization.tagsToRemove && selectedFicDetails.categorization.tagsToRemove.length > 0">
              <li v-for="tag in selectedFicDetails.categorization.tagsToRemove" :key="tag.name + tag.type">
                <strong>{{ tag.name }}</strong> ({{ tag.type }}): {{ tag.reason }}
              </li>
            </ul>
            <p v-else>No tags to remove.</p>
          </div>
          <p v-else class="warning">Categorization data not yet available for this fic, or an error occurred.</p>

          <h4>Content:</h4>
          <p class="fic-content">{{ selectedFicDetails.fic.text }}</p>
          <button @click="selectedFicDetails = null">Close Details</button>
        </div>
      </section>
    </div>
  </main>
</template>

<style scoped>

main {
  width: 100%;
  max-width: none;
  padding: 1rem;
  margin: 0;
  box-sizing: border-box;
}

.warning {
  color: orange;
  font-style: italic;
  margin-top: 1rem;
  text-align: center;
}


h1, h2 {
  text-align: center;
  color: #333;
  margin-bottom: 1.5rem;
}

.auth-section {
  display: flex;
  justify-content: center;
  gap: 2rem;
  margin-bottom: 2rem;
  padding-left: 310px;
}

.auth-form, .fic-details {
  flex: 1;
  padding: 1.5rem;
  border: 1px solid #eee;
  border-radius: 6px;
  background-color: #f9f9f9;
}

.auth-form {
  max-width: 400px;
  margin: 0 auto;
}

form {
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
}

p {
  color: #595959ff;
}

ul {
  color: #595959ff;
}

h5 {
  color: #3a3a3aff;
}

label {
  font-weight: bold;
  margin-top: 0.5rem;
  color: #595959ff;
}

input[type="text"],
input[type="password"],
textarea {
  padding: 0.8rem;
  border: 1px solid #ccc; /* A clear border */
  border-radius: 4px;
  font-size: 1rem;
  color: #333; /* Darker text color */
  background-color: #ffffffff; /* A slight off-white background */
  box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.1); /* Subtle inner shadow for depth */
}

input[type="text"]:focus,
input[type="password"]:focus,
textarea:focus {
  border-color: #007bff; /* Highlight border on focus */
  outline: none; /* Remove default browser outline */
  background-color: #ccc;
  box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.25); /* Subtle glow on focus */
}

textarea {
  resize: vertical;
}

fieldset {
  border: 1px solid #ccc;
  border-radius: 4px;
  padding: 1rem;
  margin-top: 1rem;
}

legend {
  font-weight: bold;
  padding: 0 0.5rem;
  color: #555;
}

fieldset input {
  width: auto;
  margin-right: 0.5rem;
}

button[type="submit"] {
  padding: 0.8rem 1.5rem;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
  margin-top: 1rem;
}

button[type="submit"]:hover {
  background-color: #0056b3;
}

.error {
  color: #dc3545;
  margin-top: 1rem;
  text-align: center;
}

.authenticated-section {
  display: flex;
  flex-direction: row;
  gap: 1rem;
  width: 100%;
  min-width: 1165px;
  margin: 0;
  box-sizing: border-box;
}

.fic-submission, .user-library {
  flex: 1;
  min-width: 0; /* Allows flex items to shrink below their content size */
  padding: 1.5rem;
  border: 1px solid #eee;
  border-radius: 6px;
  background-color: #f9f9f9;
}

.user-library ul {
  list-style-type: none;
  padding: 0;
}

.user-library li {
  background-color: #fff;
  border: 1px solid #ddd;
  padding: 1rem;
  margin-bottom: 0.8rem;
  border-radius: 5px;
}

.user-library li h3 {
  margin-top: 0;
  color: #007bff;
}

.user-library li ul {
  margin-top: 0.5rem;
  padding-left: 1.5rem;
  list-style-type: disc;
}
.user-library li ul li {
  background-color: #f0f8ff;
  margin-bottom: 0.5rem;
  padding: 0.5rem;
  border: 1px dashed #a8d6ff;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
}

.version-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
}

.action-buttons {
  display: flex;
  gap: 0.5rem;
}

.action-buttons button {
  padding: 0.4rem 0.8rem;
  font-size: 0.9rem;
}

.delete-btn {
  background-color: #dc3545 !important;
  color: white;
}

.delete-btn:hover {
  background-color: #c82333 !important;
}

.toggle-btn {
  margin-bottom: 1rem;
  padding: 0.6rem 1.2rem;
  background-color: #6c757d;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.toggle-btn:hover {
  background-color: #5a6268;
}

.new-version-section {
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 2px solid #d0d0d0;
}

.new-version-form {
  margin-top: 1rem;
  padding: 1rem;
  background-color: #f0f8ff;
  border: 1px solid #a8d6ff;
  border-radius: 6px;
}

.new-version-form label {
  color: #333;
}

.new-version-form textarea,
.new-version-form input {
  background-color: white;
}

.fic-details {
  grid-column: span 2; /* Spans across both columns */
  background-color: #e9f7ef;
  border-color: #28a745;
  margin-top: 2rem;
}
.fic-details ul {
  list-style-type: none;
  padding-left: 0;
}
.fic-details li {
  margin-bottom: 0.5em;
  padding: 0.5em;
  background-color: #f0f0f0;
  border-radius: 4px;
}
.fic-details h3 {
  color: #28a745;
}
.fic-content {
  white-space: pre-wrap; /* Preserves whitespace and line breaks */
  background-color: #ffffff;
  padding: 1rem;
  border: 1px dashed #b8e0c9;
  border-radius: 4px;
}
</style>
