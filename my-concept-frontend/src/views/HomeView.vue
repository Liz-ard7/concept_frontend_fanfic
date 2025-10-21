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
    userVersions.value = result[0]?.versions || [];
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

  // 2. Automatically trigger categorization for the new fic
  console.log(`Triggering categorization for new fic: ${newFicId}`);
  const categorizeResult = await CategorizingAPI.categorizeFic(
    newFicId,
    ficText.value, // Pass ficText and authorTags to the categorizing API
    authorTagsFormatted,
  );

  if ('error' in categorizeResult) {
    console.error('Error during automatic categorization:', categorizeResult.error);
    alert(`Fic submitted, but categorization failed: ${categorizeResult.error}`);
    // Decide if you want to roll back fic submission or just alert
  } else {
    console.log(`Fic categorized successfully! Categorization ID: ${categorizeResult.ficId}`);
  }

  // Reset form and refresh list
  ficName.value = '';
  ficText.value = '';
  authorTags.value = '';
  fetchUserVersions(); // Refresh the list of fics
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
  // Note: _viewFicCategory returns an array of FicCategoryDoc, as per API spec
  const categorizationResult = await CategorizingAPI.viewFicCategory(ficId);

  let categorization: FicCategoryDoc | undefined;
  if ('error' in categorizationResult) {
    console.warn(`Categorization data not found for fic ID '${ficId}':`, categorizationResult.error);
    // It's okay if categorization isn't found, we'll just display the fic without it.
  } else if (Array.isArray(categorizationResult) && categorizationResult.length > 0) {
    categorization = categorizationResult[0]; // Get the first (and only) result
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
    <h1>Welcome to the Concept App</h1>

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
            <h3>{{ version.title }}</h3>
            <p>Versions: ({{ version.fics.length }})</p>
            <ul>
              <li v-for="fic in version.fics" :key="fic._id">
                Version #{{ fic.versionNumber }} ({{ fic.date.day }}/{{ fic.date.month }}/{{ fic.date.year }})
                <button @click="viewFicDetails(fic._id, version.title, fic.versionNumber)">View Details</button>
              </li>
            </ul>
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
  max-width: 900px;
  margin: 2rem auto;
  padding: 1rem;
  background-color: #fff;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
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
  justify-content: space-around;
  gap: 2rem;
  margin-bottom: 2rem;
}

.auth-form, .fic-submission, .user-library, .fic-details {
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
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
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
