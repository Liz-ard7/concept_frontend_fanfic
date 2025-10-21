<script setup lang="ts">
import { RouterView } from 'vue-router'
import { useAuthStore } from './stores/auth';

const authStore = useAuthStore();

const logout = () => {
  authStore.setUserId(null);
  // Optionally redirect to login or home page
  // router.push('/');
};
</script>

<template>
  <header>
    <nav>
      <RouterLink to="/">Home</RouterLink>
      <span v-if="authStore.isAuthenticated">
        | Welcome, User: {{ authStore.userId }} |
        <button @click="logout">Logout</button>
      </span>
      <span v-else>
        | Please log in or register.
      </span>
    </nav>
  </header>

  <RouterView />
</template>

<style scoped>
header {
  line-height: 1.5;
  max-height: 100vh;
}

nav {
  width: 100%;
  font-size: 1rem;
  text-align: center;
  margin-top: 2rem;
  padding: 1rem 0;
  background-color: #000000ff;
  border-bottom: 1px solid #000000ff;
}

nav a.router-link-exact-active {
  color: var(--color-text);
}

nav a {
  display: inline-block;
  padding: 0 1rem;
  border-left: 1px solid var(--color-border);
}

nav a:first-of-type {
  border: 0;
}

button {
  padding: 0.5rem 1rem;
  margin-left: 1rem;
  cursor: pointer;
  background-color: #dc3545;
  color: white;
  border: none;
  border-radius: 4px;
}
button:hover {
  background-color: #c82333;
}
</style>
