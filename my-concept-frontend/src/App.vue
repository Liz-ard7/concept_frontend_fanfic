<script setup lang="ts">
import { RouterView } from 'vue-router'
import { useAuthStore } from './stores/auth';
import { UserAuthAPI, LibraryAPI } from './api';
import { ref } from 'vue';

const authStore = useAuthStore();

const showDeleteConfirm = ref(false);
const deleteUsername = ref('');
const deletePassword = ref('');
const deleteError = ref<string | null>(null);

const logout = () => {
  authStore.setUserId(null);
  // Optionally redirect to login or home page
  // router.push('/');
};

const toggleDeleteConfirm = () => {
  showDeleteConfirm.value = !showDeleteConfirm.value;
  deleteError.value = null;
  deleteUsername.value = '';
  deletePassword.value = '';
};

const handleDeleteAccount = async () => {
  deleteError.value = null;

  if (!authStore.userId) {
    deleteError.value = 'You must be logged in to delete your account.';
    return;
  }

  if (!confirm('Are you ABSOLUTELY sure you want to delete your account? This action cannot be undone!')) {
    return;
  }

  // Delete user authentication - this will cascade to Library and Categorizing via backend syncs
  const authResult = await UserAuthAPI.deleteUser(deleteUsername.value, deletePassword.value);
  if ('error' in authResult) {
    deleteError.value = 'Error deleting user account: ' + authResult.error;
    return;
  }

  alert('Account deleted successfully!');
  authStore.setUserId(null);
  showDeleteConfirm.value = false;
};
</script>

<template>
  <header>
    <nav>
      <div class="nav-inner">
        <RouterLink to="/">Home</RouterLink>
        <span v-if="authStore.isAuthenticated">
          | Welcome, User: {{ authStore.userId }} |
          <button @click="logout" class="logout-btn">Logout</button>
          <button @click="toggleDeleteConfirm" class="delete-account-btn">Delete Account</button>
        </span>
        <span v-else>
          | Please log in or register.
        </span>
      </div>
    </nav>

    <!-- Delete Account Confirmation Modal -->
    <div v-if="showDeleteConfirm" class="modal-overlay" @click="toggleDeleteConfirm">
      <div class="modal-content" @click.stop>
        <h2>Delete Account</h2>
        <p class="warning-text">⚠️ This will permanently delete your account and all your fics!</p>
        <form @submit.prevent="handleDeleteAccount">
          <label for="delete-username">Confirm Username:</label>
          <input id="delete-username" v-model="deleteUsername" type="text" required />

          <label for="delete-password">Confirm Password:</label>
          <input id="delete-password" v-model="deletePassword" type="password" required />

          <div class="modal-buttons">
            <button type="submit" class="delete-account-btn">Delete My Account</button>
            <button type="button" @click="toggleDeleteConfirm" class="cancel-btn">Cancel</button>
          </div>
        </form>
        <p v-if="deleteError" class="error">{{ deleteError }}</p>
      </div>
    </div>
  </header>

  <main class="app-content">
    <RouterView />
  </main>
</template>

<style scoped>
header {
  line-height: 1.5;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  background-color: #000000;
}

nav {
  width: 100%;
  font-size: 1rem;
  padding: 0.5rem 0;
  background-color: #000000ff;
  border-bottom: 2px solid #333;
}

.nav-inner {
  max-width: 1000px;
  margin: 0 auto;
  padding: 0 1rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
}

nav a.router-link-exact-active {
  color: var(--color-text);
}

nav a {
  display: inline-block;
  padding: 0 1rem;
  color: white;
  text-decoration: none;
  font-weight: 500;
}

nav a:hover {
  color: #007bff;
}

nav span {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex-wrap: wrap;
  color: white;
}

.app-content {
  /* Push content below the fixed header height */
  padding-top: 64px; /* adjust if you change nav height */
  width: 100%;
  max-width: 100%;
  margin: 0;
  padding-left: 0;
  padding-right: 0;
  box-sizing: border-box;
}

.logout-btn {
  padding: 0.4rem 0.8rem;
  margin-left: 0.5rem;
  cursor: pointer;
  background-color: #dc3545;
  color: white;
  border: none;
  border-radius: 4px;
}

.logout-btn:hover {
  background-color: #c82333;
}

.delete-account-btn {
  padding: 0.4rem 0.8rem;
  margin-left: 0.25rem;
  cursor: pointer;
  background-color: #721c24;
  color: white;
  border: none;
  border-radius: 4px;
}

.delete-account-btn:hover {
  background-color: #5a161c;
}

/* Modal Styles */
.modal-overlay {
  position: fixed;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background-color: white;
  padding: 2rem;
  border-radius: 8px;
  max-width: 500px;
  width: 90%;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
}

.modal-content h2 {
  margin-top: 0;
  color: #333;
}

.warning-text {
  color: #dc3545;
  font-weight: bold;
  margin: 1rem 0;
  text-align: center;
}

.modal-content form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.modal-content label {
  font-weight: bold;
  color: #333;
}

.modal-content input {
  padding: 0.8rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 1rem;
}

.modal-buttons {
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
}

.modal-buttons button {
  flex: 1;
  padding: 0.8rem 1rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
}

.cancel-btn {
  background-color: #6c757d;
  color: white;
}

.cancel-btn:hover {
  background-color: #5a6268;
}

.error {
  color: #dc3545;
  margin-top: 1rem;
  text-align: center;
  font-weight: bold;
}
</style>
