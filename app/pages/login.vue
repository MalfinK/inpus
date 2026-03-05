<script setup lang="ts">
definePageMeta({ layout: false });

const { loggedIn } = useUserSession();
if (loggedIn.value) {
  await navigateTo("/admin/dashboard");
}

useSeoMeta({ title: "Login Admin — InPus" });

const { login } = useAuth();
const toast = useToast();
const loading = ref(false);

const form = reactive({
  username: "",
  password: "",
});

const onSubmit = async () => {
  if (!form.username || !form.password) return;
  loading.value = true;
  try {
    await login(form.username, form.password);
    await navigateTo("/admin/dashboard");
  } catch {
    toast.add({ title: "Username atau password salah", color: "error" });
  } finally {
    loading.value = false;
  }
};
</script>

<template>
  <UApp>
    <div
      class="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950 px-4"
    >
      <div class="w-full max-w-sm">
        <!-- Logo -->
        <div class="text-center mb-8">
          <div
            class="w-16 h-16 rounded-2xl bg-primary-500 flex items-center justify-center mx-auto mb-4 shadow-lg shadow-primary-500/30"
          >
            <UIcon name="i-lucide-shield-check" class="w-8 h-8 text-white" />
          </div>
          <h1 class="text-2xl font-bold text-gray-900 dark:text-white">
            InPus Admin
          </h1>
          <p class="text-sm text-gray-500 mt-1">
            Login untuk mengakses panel admin
          </p>
        </div>

        <UCard>
          <UForm :state="form" class="space-y-4" @submit="onSubmit">
            <UFormField label="Username" name="username" required>
              <UInput
                v-model="form.username"
                placeholder="admin"
                icon="i-lucide-user"
                class="w-full"
                autocomplete="username"
              />
            </UFormField>

            <UFormField label="Password" name="password" required>
              <UInput
                v-model="form.password"
                type="password"
                placeholder="••••••••"
                icon="i-lucide-lock"
                class="w-full"
                autocomplete="current-password"
              />
            </UFormField>

            <UButton
              type="submit"
              block
              :loading="loading"
              icon="i-lucide-log-in"
            >
              Masuk
            </UButton>
          </UForm>
        </UCard>

        <div class="text-center mt-4">
          <NuxtLink
            to="/"
            class="text-sm text-gray-400 hover:text-primary-500 transition-colors"
          >
            ← Kembali ke Halaman Publik
          </NuxtLink>
        </div>
      </div>
    </div>
    <UToaster />
  </UApp>
</template>
